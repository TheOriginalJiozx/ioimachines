import { useEffect, useState } from "react";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";
import RequestConsultation from "../components/RequestConsultation";
import { useAppState } from "../state/AppState";
import { genId, blocksToPlainText, renderBlock } from "../lib/blocks.jsx";

export default function TurnkeySolutions() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("Turnkey Solutions");
    }
  }, []);

  const { adminToken } = useAppState();

  const [showModal, setShowModal] = useState(false);
  const [turnkey, setTurnkey] = useState(null);
  const [editingTurnkey, setEditingTurnkey] = useState(false);
  const [turnkeyTitle, setTurnkeyTitle] = useState("");
  const [turnkeyContentEditor, setTurnkeyContentEditor] = useState("");
  const [turnkeyBlocks, setTurnkeyBlocks] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.18 },
    );

    const els = Array.from(document.querySelectorAll(".enter-up"));
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || "https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net/api";
        const res = await fetch(`${API_BASE}/sections/turnkey`).catch(() => null);
        const json = res && res.ok ? await res.json().catch(() => null) : null;
        if (!json) return;
        try {
          const parsed = json.content ? JSON.parse(json.content) : null;
          setTurnkey({ ...(json || {}), parsedContent: parsed });
        } catch (e) {
          setTurnkey(json);
        }
      } catch (error) {
        console.error("Failed to load turnkey section", error);
      }
    }
    load();
  }, []);

  async function saveSection(key, title, blocks, setEditing, setState, extraParsed = null) {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net/api";
      const headers = { "Content-Type": "application/json" };
      if (adminToken) headers["Authorization"] = "Bearer " + adminToken;

      let blocksCopy = blocks && Array.isArray(blocks) ? blocks.slice() : null;
      if (blocksCopy) {
        for (let i = 0; i < blocksCopy.length; i++) {
          const b = blocksCopy[i];
          if (b && b._file) {
            try {
              const formData = new FormData();
              formData.append("file", b._file);
              const upHeaders = {};
              if (adminToken) upHeaders["Authorization"] = "Bearer " + adminToken;
              const upRes = await fetch(`${API_BASE}/uploads`, { method: "POST", body: formData, headers: upHeaders });
              if (!upRes.ok) throw new Error("upload failed");
              const upJson = await upRes.json();
              const url = upJson.url || upJson.path || "";
              blocksCopy[i] = { ...blocksCopy[i], src: url };
              delete blocksCopy[i]._file;
            } catch (error) {
              console.error("upload failed", error);
              alert("Image upload failed: " + (error.message || error));
            }
          }
        }
      }

      const parsedPayload = { ...(extraParsed || {}), intro: blocksCopy || [] };
      const payload = { title: title, content: JSON.stringify(parsedPayload) };
      const res = await fetch(`${API_BASE}/sections/${key}`, { method: "PUT", headers, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("save failed");
      setState((prev) => ({ ...(prev || {}), title: title, content: JSON.stringify(parsedPayload), parsedContent: parsedPayload }));
      setEditing(false);
    } catch (error) {
      alert("Save failed: " + (error.message || error));
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#444444] font-sans" aria-label="Turnkey solutions page">
      <section className="relative w-full">
        <div className="w-full h-80 sm:h-96 md:h-[34rem] bg-gray-100 overflow-hidden">
          <img src="/turnkey_img1.jpg" alt="hero" className="object-cover w-full h-full" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full flex items-center">
            <div className="lg:pl-0 -mt-80">
              <h1 className="lg:text-[48px] text-3xl font-extrabold text-white uppercase" style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.50))" }}>
                Turnkey Solutions
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <img src="/turnkey_img2.jpg" alt="turnkey-solutions" className="w-full md:h-[28rem] object-cover rounded shadow" />
              <div className="mt-4 text-[#444444] text-[15px] space-y-3">
                {(() => {
                  const blocksSource = turnkey?.parsedContent && Array.isArray(turnkey.parsedContent.intro) ? turnkey.parsedContent.intro : null;
                  if (editingTurnkey) {
                    return (
                      <div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input value={turnkeyTitle} onChange={(e) => setTurnkeyTitle(e.target.value)} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                          {turnkeyBlocks && Array.isArray(turnkeyBlocks) ? (
                            <div className="space-y-4">
                              {turnkeyBlocks.map((block, index) => (
                                <div key={block._id || index} className="border rounded p-3">
                                  <div className="mb-2 text-sm text-gray-600">Block #{index + 1} — <span className="font-mono">{block.title ? (block.title.charAt(0).toLowerCase() + block.title.slice(1)) : block.type}</span></div>
                                  {block.type === "paragraph" && (
                                    <>
                                      <textarea
                                        value={block.text || ""}
                                        onChange={(event) => {
                                          const id = block._id;
                                          const val = event.target.value;
                                          setTurnkeyBlocks((previous) => {
                                            const array = (previous || []).slice();
                                            const idx = array.findIndex((b) => b._id === id);
                                            if (idx === -1) return previous;
                                            array[idx] = { ...array[idx], text: val };
                                            return array;
                                          });
                                        }}
                                        rows={4}
                                        className="w-full p-2 border rounded text-sm font-mono"
                                      />
                                      <div className="mt-2 flex gap-2">
                                        <button className="px-2 py-1 rounded border text-sm" onClick={() => {
                                          const id = block._id;
                                          setTurnkeyBlocks((previous) => {
                                            const array = (previous || []).slice();
                                            const idx = array.findIndex((b) => b._id === id);
                                            if (idx <= 0) return previous;
                                            const tmp = array[idx - 1];
                                            array[idx - 1] = array[idx];
                                            array[idx] = tmp;
                                            return array;
                                          });
                                        }} disabled={index === 0}>Move up</button>
                                        <button className="px-2 py-1 rounded border text-sm" onClick={() => {
                                          const id = block._id;
                                          setTurnkeyBlocks((previous) => {
                                            const array = (previous || []).slice();
                                            const idx = array.findIndex((b) => b._id === id);
                                            if (idx === -1 || idx >= array.length - 1) return previous;
                                            const tmp = array[idx + 1];
                                            array[idx + 1] = array[idx];
                                            array[idx] = tmp;
                                            return array;
                                          });
                                        }} disabled={index >= (turnkeyBlocks ? turnkeyBlocks.length - 1 : 0)}>Move down</button>
                                        <button className="px-2 py-1 rounded border text-sm" onClick={() => {
                                          const id = turnkeyBlocks && turnkeyBlocks[index] && turnkeyBlocks[index]._id;
                                          if (!id) {
                                            setTurnkeyBlocks((previous) => {
                                              const c = (previous || []).slice();
                                              c.splice(index, 1);
                                              return c;
                                            });
                                            return;
                                          }
                                          setTurnkeyBlocks((previous) => (previous || []).filter((b) => b._id !== id));
                                        }}>Remove block</button>
                                      </div>
                                    </>
                                  )}
                                  {block.type === "image" && (
                                    <div className="grid grid-cols-1 gap-2">
                                      <label className="text-xs text-gray-600">Replace image (upload)</label>
                                      <div className="flex items-center gap-2">
                                        <label className="bg-white border px-3 py-1 rounded text-sm cursor-pointer">Choose image
                                          <input type="file" accept="image/*" onChange={(event) => {
                                            const file = event.target.files && event.target.files[0];
                                            if (!file) return;
                                            const id = block._id;
                                            try {
                                              const preview = URL.createObjectURL(file);
                                              let alt = "";
                                              if (turnkeyTitle && turnkeyTitle.trim()) alt = `${turnkeyTitle} image`;
                                              else {
                                                try {
                                                  const name = file.name || "";
                                                  alt = name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
                                                } catch (error) { alt = ""; }
                                              }
                                              setTurnkeyBlocks((prev) => {
                                                const copy = (prev || []).slice();
                                                const idx = copy.findIndex((b) => b._id === id);
                                                if (idx === -1) return prev;
                                                copy[idx] = { ...copy[idx], _file: file, src: preview, alt, _autoAlt: true };
                                                return copy;
                                              });
                                            } catch (error) {
                                              let alt = "";
                                              if (turnkeyTitle && turnkeyTitle.trim()) alt = `${turnkeyTitle} image`;
                                              setTurnkeyBlocks((prev) => {
                                                const copy = (prev || []).slice();
                                                const idx = copy.findIndex((b) => b._id === id);
                                                if (idx === -1) return prev;
                                                copy[idx] = { ...copy[idx], _file: file, alt, _autoAlt: true };
                                                return copy;
                                              });
                                            }
                                          }} className="hidden" />
                                        </label>
                                      </div>
                                      <label className="text-xs text-gray-600">Or image URL</label>
                                      <input value={block.src || block.url || ""} onChange={(event) => {
                                        const val = event.target.value || "";
                                        const copy = (turnkeyBlocks || []).slice();
                                        let alt = "";
                                        if (turnkeyTitle && turnkeyTitle.trim()) alt = `${turnkeyTitle} image`;
                                        else {
                                          try {
                                            const p = val.split("?")[0].split("#")[0];
                                            const parts = p.split("/");
                                            let fileName = parts[parts.length - 1] || p;
                                            fileName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
                                            alt = fileName;
                                          } catch (error) { alt = ""; }
                                        }
                                        copy[index] = { ...copy[index], src: val, url: undefined, alt, _autoAlt: true };
                                        setTurnkeyBlocks(copy);
                                      }} className="w-full p-2 border rounded text-sm" />
                                      <label className="text-xs text-gray-600">Alt text</label>
                                      <input value={block.alt || ""} onChange={(event) => {
                                        const copy = (turnkeyBlocks || []).slice();
                                        copy[index] = { ...copy[index], alt: event.target.value, _autoAlt: false };
                                        setTurnkeyBlocks(copy);
                                      }} className="w-full p-2 border rounded text-sm" />
                                      <div className="mt-2">{block.src || block.url ? <img src={block.src || block.url} alt={block.alt || ""} className="object-contain w-full h-36" /> : <div className="text-sm text-gray-400">No image</div>}</div>
                                      <div className="mt-2"><button className="px-2 py-1 rounded border text-sm" onClick={() => {
                                        const id = block._id;
                                        setTurnkeyBlocks((previous) => (previous || []).filter((b) => b._id !== id));
                                      }}>Remove block</button></div>
                                    </div>
                                  )}
                                  {block.type === "list" && (
                                    <div className="grid grid-cols-1 gap-2">
                                      <label className="text-xs text-gray-600">List items (one per line)</label>
                                      <textarea value={block._editorValue !== undefined ? block._editorValue : ([...(block.items || []).map((it) => it), ...(block.extraText || [])].join("\n"))} onChange={(event) => {
                                        const val = event.target.value;
                                        const copy = (turnkeyBlocks || []).slice();
                                        copy[index] = { ...copy[index], _editorValue: val };
                                        setTurnkeyBlocks(copy);
                                      }} onBlur={(event) => {
                                        const val = event.target.value || "";
                                        const rawLines = val.split(/\r?\n/).map((s) => s.replace(/\u00A0/g, " ").replace(/\t/g, " "));
                                        const items = [];
                                        const extra = [];
                                        const ordered = [];
                                        rawLines.forEach((ln) => {
                                          const trimmedEnd = ln.replace(/\s+$/g, "");
                                          const candidateEnd = trimmedEnd.replace(/;\s*$/, "").trim();
                                          const existingItems = (block.items || []).map((s) => String(s).trim());
                                          if (trimmedEnd.endsWith(";") || (candidateEnd !== "" && existingItems.includes(candidateEnd))) {
                                            const candidate = candidateEnd;
                                            if (candidate !== "") {
                                              items.push(candidate);
                                              ordered.push({ kind: "item", text: candidate });
                                            } else {
                                              ordered.push({ kind: "text", text: ln });
                                              extra.push(ln);
                                            }
                                          } else {
                                            ordered.push({ kind: "text", text: ln });
                                            extra.push(ln);
                                          }
                                        });
                                        const copy = (turnkeyBlocks || []).slice();
                                        copy[index] = { ...copy[index], items, extraText: extra, orderedContent: ordered, _editorValue: val };
                                        setTurnkeyBlocks(copy);
                                      }} rows={4} className="w-full p-2 border rounded text-sm font-mono" />
                                      <div className="mt-2"><button className="px-2 py-1 rounded border text-sm" onClick={() => {
                                        const id = block._id;
                                        setTurnkeyBlocks((previous) => (previous || []).filter((b) => b._id !== id));
                                      }}>Remove block</button></div>
                                    </div>
                                  )}
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <button className="bg-indigo-600 text-white px-3 py-1 rounded" onClick={() => {
                                  const copy = (turnkeyBlocks || []).slice();
                                  copy.push({ _id: genId(), type: "paragraph", text: "" });
                                  setTurnkeyBlocks(copy);
                                }}>Add paragraph</button>
                                <button className="bg-white border px-3 py-1 rounded" onClick={() => {
                                  const copy = (turnkeyBlocks || []).slice();
                                  copy.push({ _id: genId(), type: "image", src: "", alt: "", _autoAlt: true });
                                  setTurnkeyBlocks(copy);
                                }}>Add image</button>
                                <button className="bg-white border px-3 py-1 rounded" onClick={() => {
                                  const copy = (turnkeyBlocks || []).slice();
                                  const imgIndex = copy.findIndex((b) => b && b.type === "image");
                                  const insertAt = imgIndex !== -1 ? imgIndex + 1 : copy.length;
                                  const list = { _id: genId(), type: "list", title: "Service Description", style: "disc", items: [""] };
                                  copy.splice(insertAt, 0, list);
                                  setTurnkeyBlocks(copy);
                                }}>Add Service Description</button>
                                <button className="bg-white border px-3 py-1 rounded" onClick={() => {
                                  const copy = (turnkeyBlocks || []).slice();
                                  const imgIndex = copy.findIndex((b) => b && b.type === "image");
                                  const insertAt = imgIndex !== -1 ? imgIndex + 1 : copy.length;
                                  const imgText = { _id: genId(), type: "paragraph", title: "Image text", text: "" };
                                  copy.splice(insertAt, 0, imgText);
                                  setTurnkeyBlocks(copy);
                                }}>Add image text</button>
                                <button className="bg-white border px-3 py-1 rounded" onClick={() => {
                                  const copy = (turnkeyBlocks || []).slice();
                                  copy.push({ _id: genId(), type: "list", title: "Inhouse Competencies", style: "disc", items: [""] });
                                  setTurnkeyBlocks(copy);
                                }}>Add Inhouse Competencies</button>
                                <button className="bg-white border px-3 py-1 rounded" onClick={() => {
                                  const copy = (turnkeyBlocks || []).slice();
                                  copy.push({ _id: genId(), type: "image", src: "", alt: "inhouse-competencies", _autoAlt: true });
                                  setTurnkeyBlocks(copy);
                                }}>Add Inhouse Competencies Image</button>
                                <button className="bg-white border px-3 py-1 rounded" onClick={() => {
                                  const copy = (turnkeyBlocks || []).slice();
                                  copy.push({ _id: genId(), type: "list", style: "decimal", items: [""] });
                                  setTurnkeyBlocks(copy);
                                }}>Add list</button>
                              </div>
                            </div>
                          ) : (
                            <textarea value={turnkeyContentEditor} onChange={(event) => setTurnkeyContentEditor(event.target.value)} rows={6} className="w-full px-4 py-2 border rounded" />
                          )}
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                          <button onClick={() => setEditingTurnkey(false)} className="px-4 py-2 rounded border">Cancel</button>
                          <button onClick={() => {
                            saveSection(
                              "turnkey",
                              turnkeyTitle,
                              turnkeyBlocks || (turnkeyContentEditor ? [{ _id: genId(), type: "paragraph", text: turnkeyContentEditor }] : []),
                              setEditingTurnkey,
                              setTurnkey
                            );
                          }} className="px-4 py-2 rounded bg-[#444444] text-white">Save</button>
                        </div>
                      </div>
                    );
                  }

                  if (blocksSource) {
                    return <>{blocksSource.map((b, i) => renderBlock(b, i))}</>;
                  }

                  // fallback static content
                  return (
                    <>
                      <div>IOIMACHINES develops custom machine vision systems for different applications such as surface inspection and fabric quality control.</div>
                      <div>Our systems build on our proprietary algorithms for feature detection combined with machine learning and artificial intelligence.</div>
                      <div>Our software runs on Windows-based computers with GPUs to accelerate computations.</div>
                      <div>For extreme high-speed applications we implement our proprietary FPGA-based acceleration hardware.</div>
                      <h3 className="text-[24px] font-semibold text-[#222222]">Service Description</h3>
                      <div>IOIMACHINES Vision engineers have extensive experience in designing, manufacturing, implementing, testing and validating machine vision solutions.</div>
                      <ul className="mt-4 list-disc list-outside pl-8 space-y-2 text-[15px]">
                        <li className="text-[#444444]">Starting at your production site, we evaluate possibility to build in-line machine vision inspection station.</li>
                        <li className="text-[#444444]">Produce a specification document describing desired performance parameters and system components.</li>
                        <li className="text-[#444444]">Build the system at our production facilities and perform tests to identify any issues and correct them prior to shipment.</li>
                        <li className="text-[#444444]">Install the system at your site and perform a site acceptance test to ensure that it works optimally in the production environment.</li>
                      </ul>
                      <h3 className="text-[24px] font-semibold text-[#222222]">Inhouse Competencies</h3>
                      <div>Our competency area covers:</div>
                      <ul className="mt-4 list-disc list-outside pl-8 space-y-2 text-[15px]">
                        <li className="text-[#444444]">Machine and computer vision algorithms.</li>
                        <li className="text-[#444444]">Design and implementation of vision algorithms in FPGAs and SoCs (System on Chip).</li>
                        <li className="text-[#444444]">2D industrial cameras.</li>
                        <li className="text-[#444444]">3D sensors for 3D measurements of defect size.</li>
                        <li className="text-[#444444]">Lighting technologies and schemes.</li>
                        <li className="text-[#444444]">Design and implementation of automation systems including PLCs, robotics and conveyor belts.</li>
                        <li className="text-[#444444]">Sensor interfaces.</li>
                        <li className="text-[#444444]">Electronic and mechanical system design.</li>
                      </ul>
                      <img src="/turnkey_components.png" alt="turnkey-components" className="" />
                    </>
                  );
                })()}
              </div>
            </div>
            <div>
              <h2 className="text-[40px] font-semibold text-[#222222]">Process</h2>
              <ul className="mt-4 list-disc list-inside space-y-2 text-[15px]">
                <li className="text-[#444444]">Budget and Milestones.</li>
                <li className="text-[#444444]">Pre-Assessment.</li>
                <li className="text-[#444444]">Service Implementation.</li>
              </ul>

              <div className="mt-10 flex justify-start">
                <button onClick={() => setShowModal(true)} className="text-black px-6 py-3 border border-black uppercase">
                  Request a Consultation
                </button>
              </div>
              {adminToken && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setTurnkeyTitle(turnkey?.title || "Turnkey Solutions");
                      const parsed = turnkey?.parsedContent || null;
                      let arr = [];
                      if (parsed && parsed.intro) {
                        arr = Array.isArray(parsed.intro)
                          ? parsed.intro.map((b) => ({ ...b, _id: b._id || genId() }))
                          : typeof parsed.intro === "string"
                          ? [{ _id: genId(), type: "paragraph", text: parsed.intro }]
                          : [];
                      }
                      if (!arr.some((b) => b && b._id)) arr = arr.map((b) => ({ ...b, _id: genId() }));
                      setTurnkeyBlocks(arr);
                      setTurnkeyContentEditor(blocksToPlainText(arr));
                      setEditingTurnkey(true);
                    }}
                    className="mt-3 px-3 py-1 border rounded"
                  >
                    Edit
                  </button>
                </div>
              )}
              <div className="mt-8 bg-[#FAFAFA] p-6 rounded shadow-sm">
                <h3 className="text-[20px] font-semibold mb-3 text-[#222222]">Scope & Approach</h3>
                <ul className="list-decimal pl-5 space-y-2 text-[15px] text-[#444444]">
                  <li>Initial site visit to define requirements and capture sample images.</li>
                  <li>Data analysis to evaluate technical feasibility and constraints.</li>
                  <li>Prototype design and validation on representative samples.</li>
                  <li>Final report with recommendations, BOM and project timeline.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      {showModal && <RequestConsultation modal onClose={() => setShowModal(false)} />}

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <GetAdvice />

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <Features />

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <ContactCase />

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>
    </div>
  );
}

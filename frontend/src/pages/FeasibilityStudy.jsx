import { useEffect, useState } from "react";
import { useAppState } from "../state/AppState";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";
import { genId, blocksToPlainText } from "../lib/blocks.jsx";

function renderBlockFeasibility(block, index, blocks) {
  if (!block) return null;
  switch (block.type) {
    case "paragraph": {
      const text = block.text || "";


      if (text && /\d+\.\s*/.test(text)) {
        const matches = text.match(/\d+\.\s*/g) || [];
        if (matches.length > 1) {
          const parts = text.split(/(?=\d+\.)/).map((p) => p.replace(/^\d+\.\s*/, "").trim()).filter(Boolean);
          if (parts.length > 0) {
            return (
              <ol key={index} className="list-decimal pl-6 text-[15px] text-[#444444] mb-4">
                {parts.map((it, i) => (
                  <li key={i} className="mb-2">{it}</li>
                ))}
              </ol>
            );
          }
        }
      }

      const m = text.match(/^(.*?:)\s*(.+)$/);
      if (m) {
        const prefix = m[1];
        const rest = m[2];
        const items = rest.split(/\s*;\s*/).map((s) => s.trim()).filter(Boolean);
        if (items.length > 1) {
          return (
            <div key={index} className="mb-4">
              <p className="text-[15px] text-[#444444] leading-relaxed mb-2">{prefix}</p>
              <ul className="list-disc pl-6 text-[15px] text-[#444444] mb-4">
                {items.map((it, i) => (
                  <li key={i} className="mb-2">{it}</li>
                ))}
              </ul>
            </div>
          );
        }
      }


      if (!m && text && text.indexOf(";") !== -1) {
        const items = text.split(/\s*;\s*/).map((s) => s.trim()).filter(Boolean);
        if (items.length > 1) {


          try {
            if (Array.isArray(blocks) && typeof index === "number" && blocks[index + 1] && blocks[index + 1].type === "list") {
              const nextItems = (blocks[index + 1].items || []).map((s) => String(s).trim()).filter(Boolean);
              const itemsNorm = items.map((s) => String(s).trim()).filter(Boolean);
              const same = itemsNorm.length === nextItems.length && itemsNorm.every((v, i) => v === String(nextItems[i]).trim());
              if (same) {

              } else {
                return (
                  <ul key={index} className="list-disc pl-6 text-[15px] text-[#444444] mb-4">
                    {items.map((it, i) => (
                      <li key={i} className="mb-2">{it}</li>
                    ))}
                  </ul>
                );
              }
            } else {
              return (
                <ul key={index} className="list-disc pl-6 text-[15px] text-[#444444] mb-4">
                  {items.map((it, i) => (
                    <li key={i} className="mb-2">{it}</li>
                  ))}
                </ul>
              );
            }
          } catch (error) {
            return (
              <ul key={index} className="list-disc pl-6 text-[15px] text-[#444444] mb-4">
                {items.map((it, i) => (
                  <li key={i} className="mb-2">{it}</li>
                ))}
              </ul>
            );
          }
        }
      }

      const textVal = block.text || "";
      const sentences = (textVal || "").split(/(?<=[.?!])\s+(?=[A-ZÅÆØ0-9])/);
      if (sentences.length > 1) {
        return (
          <div key={index} className="mb-4">
            {sentences.map((s, i) => (
              <p key={i} className="text-[15px] text-[#444444] leading-relaxed mb-2">{s}</p>
            ))}
          </div>
        );
      }

      return (
        <p key={index} className="text-[15px] text-[#444444] leading-relaxed mb-4">
          {textVal}
        </p>
      );
    }
    case "heading":
      if (block.level === 2)
        return (
          <h2 key={index} className="text-2xl font-bold mb-3">
            {block.text}
          </h2>
        );
      if (block.level === 3)
        return (
          <h3 key={index} className="text-xl font-semibold mb-2">
            {block.text}
          </h3>
        );
      return (
        <h4 key={index} className="font-semibold mb-2">
          {block.text}
        </h4>
      );
    case "image":
      return (
        <div key={index} className="w-full mb-4 overflow-hidden rounded shadow">
          <img src={block.src} alt={block.alt || ""} className="w-full md:h-[28rem] object-cover" />
        </div>
      );
    case "list":

      if (Array.isArray(block.orderedContent) && block.orderedContent.length > 0) {
        const nodes = [];
        let bufferItems = [];
        const isProcess = block.title && String(block.title).toLowerCase().includes("process");
        const isScope = index === "scope" || (block.title && String(block.title).toLowerCase().includes("scope"));
        const flushItems = (keyBase) => {
          if (bufferItems.length === 0) return;
          const listClass = isProcess
            ? "mt-4 list-disc list-inside space-y-2 text-[15px]"
            : isScope
            ? "list-decimal pl-5 space-y-2 text-[15px] text-[#444444]"
            : `list-${block.style || "disc"} pl-5 text-[15px] text-[#444444] mb-4`;
          nodes.push(
            <ul key={`${keyBase}-ul`} className={listClass}>
              {bufferItems.map((it, i) => (
                <li key={`${keyBase}-li-${i}`} className="mb-2">{it}</li>
              ))}
            </ul>
          );
          bufferItems = [];
        };

        block.orderedContent.forEach((entry, i) => {
          if (entry && entry.kind === "item") {
            bufferItems.push(entry.text);
          } else {

            flushItems(i);
            nodes.push(
              <p key={`text-${i}`} className="text-[15px] text-[#444444] leading-relaxed mb-2">{entry ? entry.text : ""}</p>
            );
          }
        });
        flushItems("end");

        if (block.title) {
          return (
            <div key={index} className="mb-4">
              <h3 class="text-[24px] font-semibold text-[#222222]">{block.title}</h3>
              {nodes}
            </div>
          );
        }
        return <div key={index}>{nodes}</div>;
      }


      const isProcessFallback = block.title && String(block.title).toLowerCase().includes("process");
      const isScopeFallback = index === "scope" || (block.title && String(block.title).toLowerCase().includes("scope"));
      const listClassFallback = isProcessFallback
        ? "mt-4 list-disc list-inside space-y-2 text-[15px]"
        : isScopeFallback
        ? "list-decimal pl-5 space-y-2 text-[15px] text-[#444444]"
        : `list-${block.style || "disc"} pl-5 text-[15px] text-[#444444] mb-4`;
      const listEl = (
        <ul key={index} className={listClassFallback}>
          {(block.items || []).map((it, i) => (
            <li key={i} className="mb-2">{it}</li>
          ))}
        </ul>
      );
      const extra = (block.extraText || []).map((t, i) => (
        <p key={`extra-${i}`} className="text-[15px] text-[#444444] leading-relaxed mb-2">{t}</p>
      ));
      if (block.title) {
        return (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold mb-2">{block.title}</h3>
            {listEl}
            {extra}
          </div>
        );
      }
      return (
        <div key={index}>
          {listEl}
          {extra}
        </div>
      );
    default:
      return <div key={index} dangerouslySetInnerHTML={{ __html: block.html || "" }} />;
  }
}

export default function Feasibility() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("Feasibility Study");
    }
  }, []);

  const { adminToken } = useAppState();

  const [feasibility, setFeasibility] = useState(null);
  const [editingFeasibility, setEditingFeasibility] = useState(false);
  const [feasibilityTitle, setFeasibilityTitle] = useState("");
  const [feasibilityBlocks, setFeasibilityBlocks] = useState(null);
  const [feasibilityContentEditor, setWhyContentEditor] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || "https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net/api";
        const res = await fetch(`${API_BASE}/sections/feasibility`).catch(() => null);
        const json = res && res.ok ? await res.json().catch(() => null) : null;

        const parseContent = (row) => {
          if (!row) return null;
          try {
            const parsed = row.content ? JSON.parse(row.content) : null;
            return { ...row, parsedContent: parsed };
          } catch (error) {
            return { ...row, parsedContent: null };
          }
        };

        const parsed = parseContent(json);
        setFeasibility(parsed);
      } catch (error) {
        console.error("Failed to load feasibility sections", error);
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
    <div className="min-h-screen bg-white text-[#444444] font-sans" aria-label="Feasibility Study page">
      <section className="relative w-full" aria-label="Feasibility Study hero">
        <div className="w-full h-80 sm:h-96 md:h-[34rem] bg-gray-100 overflow-hidden">
          <img src="/feasibility_study.jpg" alt="hero" className="object-cover w-full h-full" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full flex items-center">
            <div className="lg:pl-0 -mt-80">
              <h1 className="lg:text-[48px] text-3xl font-extrabold text-white uppercase" style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.50))" }}>
                
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-white" aria-label="Feasibility section">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className={`grid md:grid-cols-2 gap-12 items-start ${editingFeasibility ? "md:grid-cols-3" : ""}`}>
            <div className={editingFeasibility ? "feasibility-content md:col-span-1" : "feasibility-content"}>
              {editingFeasibility ? (
                <div className="w-full md:h-[28rem]"></div>
              ) : (
                (() => {
                  const blocksSource = feasibility?.parsedContent && Array.isArray(feasibility.parsedContent.intro) ? feasibility.parsedContent.intro : null;
                  if (blocksSource) {
                    const imgIndex = blocksSource.findIndex((b) => b && b.type === "image");
                    if (imgIndex !== -1) {

                      const nodes = [];
                      nodes.push(renderBlockFeasibility(blocksSource[imgIndex], imgIndex, blocksSource));

                      let cursor = imgIndex + 1;
                      const maybeImageText = blocksSource[cursor];
                      if (
                        maybeImageText &&
                        maybeImageText.type === "paragraph" &&
                        maybeImageText.title &&
                        String(maybeImageText.title).toLowerCase().includes("image text")
                      ) {
                        nodes.push(renderBlockFeasibility(maybeImageText, cursor, blocksSource));
                        cursor++;
                      }

                      const next = blocksSource[cursor];
                      const next2 = blocksSource[cursor + 1];
                      if (next && next.type === "heading" && (next.text || "").toLowerCase().includes("deliverable")) {
                        nodes.push(renderBlockFeasibility(next, cursor, blocksSource));
                        if (next2 && next2.type === "list") nodes.push(renderBlockFeasibility(next2, cursor + 1, blocksSource));
                      } else if (next && next.type === "list" && next.style === "disc") {

                        nodes.push(renderBlockFeasibility(next, cursor, blocksSource));
                      }
                      return <>{nodes}</>;
                    }
                  }
                  return null;
                })()
              )}
            </div>
            <div className={editingFeasibility ? "editor-column editing-feasibility md:col-span-2" : "editor-column"}>
              {editingFeasibility ? (
                <div className="mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input value={feasibilityTitle} onChange={(event) => setFeasibilityTitle(event.target.value)} className="w-full p-2 border rounded" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    {feasibilityBlocks && Array.isArray(feasibilityBlocks) ? (
                      <div className="space-y-4">
                        {feasibilityBlocks.map((block, index) => (
                          <div key={block._id || index} className="border rounded p-3">
                            <div className="mb-2 text-sm text-gray-600">
                              Block #{index + 1} — <span className="font-mono">{block.title ? (block.title.charAt(0).toLowerCase() + block.title.slice(1)) : block.type}</span>
                            </div>
                            {block.type === "paragraph" && (
                              <>
                                <textarea
                                  value={block.text || ""}
                                  onChange={(event) => {
                                    const id = block._id;
                                    const val = event.target.value;
                                    setFeasibilityBlocks((previous) => {
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
                                  <button
                                    className="px-2 py-1 rounded border text-sm"
                                    onClick={() => {
                                      const id = block._id;
                                      setFeasibilityBlocks((previous) => {
                                        const array = (previous || []).slice();
                                        const idx = array.findIndex((b) => b._id === id);
                                        if (idx <= 0) return previous;
                                        const tmp = array[idx - 1];
                                        array[idx - 1] = array[idx];
                                        array[idx] = tmp;
                                        return array;
                                      });
                                    }}
                                    disabled={index === 0}
                                  >
                                    Move up
                                  </button>
                                  <button
                                    className="px-2 py-1 rounded border text-sm"
                                    onClick={() => {
                                      const id = block._id;
                                      setFeasibilityBlocks((previous) => {
                                        const array = (previous || []).slice();
                                        const idx = array.findIndex((b) => b._id === id);
                                        if (idx === -1 || idx >= array.length - 1) return previous;
                                        const tmp = array[idx + 1];
                                        array[idx + 1] = array[idx];
                                        array[idx] = tmp;
                                        return array;
                                      });
                                    }}
                                    disabled={index >= (feasibilityBlocks ? feasibilityBlocks.length - 1 : 0)}
                                  >
                                    Move down
                                  </button>
                                  <button
                                    className="px-2 py-1 rounded border text-sm"
                                    onClick={() => {
                                      const id = feasibilityBlocks && feasibilityBlocks[index] && feasibilityBlocks[index]._id;
                                      if (!id) {
                                        setFeasibilityBlocks((previous) => {
                                          const c = (previous || []).slice();
                                          c.splice(index, 1);
                                          return c;
                                        });
                                        return;
                                      }
                                      setFeasibilityBlocks((previous) => (previous || []).filter((b) => b._id !== id));
                                    }}
                                  >
                                    Remove block
                                  </button>
                                </div>
                              </>
                            )}
                            {block.type === "image" && (
                              <div className="grid grid-cols-1 gap-2">
                                <label className="text-xs text-gray-600">Replace image (upload)</label>
                                <div className="flex items-center gap-2">
                                  <label className="bg-white border px-3 py-1 rounded text-sm cursor-pointer">
                                    Choose image
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(event) => {
                                        const file = event.target.files && event.target.files[0];
                                        if (!file) return;
                                        const id = block._id;
                                        try {
                                          const preview = URL.createObjectURL(file);
                                          let alt = "";
                                          if (feasibilityTitle && feasibilityTitle.trim()) alt = `${feasibilityTitle} image`;
                                          else {
                                            try {
                                              const name = file.name || "";
                                              alt = name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
                                            } catch (error) {
                                              alt = "";
                                            }
                                          }
                                          setFeasibilityBlocks((prev) => {
                                            const copy = (prev || []).slice();
                                            const idx = copy.findIndex((b) => b._id === id);
                                            if (idx === -1) return prev;
                                            copy[idx] = { ...copy[idx], _file: file, src: preview, alt, _autoAlt: true };
                                            return copy;
                                          });
                                        } catch (error) {
                                          let alt = "";
                                          if (feasibilityTitle && feasibilityTitle.trim()) alt = `${feasibilityTitle} image`;
                                          setFeasibilityBlocks((prev) => {
                                            const copy = (prev || []).slice();
                                            const idx = copy.findIndex((b) => b._id === id);
                                            if (idx === -1) return prev;
                                            copy[idx] = { ...copy[idx], _file: file, alt, _autoAlt: true };
                                            return copy;
                                          });
                                        }
                                      }}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                                <label className="text-xs text-gray-600">Or image URL</label>
                                <input
                                  value={block.src || block.url || ""}
                                  onChange={(event) => {
                                    const val = event.target.value || "";
                                    const copy = (feasibilityBlocks || []).slice();
                                    let alt = "";
                                    if (feasibilityTitle && feasibilityTitle.trim()) alt = `${feasibilityTitle} image`;
                                    else {
                                      try {
                                        const p = val.split("?")[0].split("#")[0];
                                        const parts = p.split("/");
                                        let fileName = parts[parts.length - 1] || p;
                                        fileName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
                                        alt = fileName;
                                      } catch (error) {
                                        alt = "";
                                      }
                                    }
                                    copy[index] = { ...copy[index], src: val, url: undefined, alt, _autoAlt: true };
                                    setFeasibilityBlocks(copy);
                                  }}
                                  className="w-full p-2 border rounded text-sm"
                                />
                                <label className="text-xs text-gray-600">Alt text</label>
                                <input
                                  value={block.alt || ""}
                                  onChange={(event) => {
                                    const copy = (feasibilityBlocks || []).slice();
                                    copy[index] = { ...copy[index], alt: event.target.value, _autoAlt: false };
                                    setFeasibilityBlocks(copy);
                                  }}
                                  className="w-full p-2 border rounded text-sm"
                                />
                                <div className="mt-2">{block.src || block.url ? <img src={block.src || block.url} alt={block.alt || ""} className="object-contain w-full h-36" /> : <div className="text-sm text-gray-400">No image</div>}</div>
                                <div className="mt-2">
                                  <button
                                    className="px-2 py-1 rounded border text-sm"
                                    onClick={() => {
                                      const id = block._id;
                                      setFeasibilityBlocks((previous) => (previous || []).filter((b) => b._id !== id));
                                    }}
                                  >
                                    Remove block
                                  </button>
                                </div>
                              </div>
                            )}
                            {block.type === "list" && (
                              <div className="grid grid-cols-1 gap-2">
                                <label className="text-xs text-gray-600">List items (one per line)</label>
                                <textarea
                                  value={block._editorValue !== undefined ? block._editorValue : ([...(block.items || []).map((it) => it), ...(block.extraText || [])].join("\n"))}
                                  onChange={(event) => {
                                    const val = event.target.value;
                                    const copy = (feasibilityBlocks || []).slice();
                                    copy[index] = { ...copy[index], _editorValue: val };
                                    setFeasibilityBlocks(copy);
                                  }}
                                  onBlur={(event) => {
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
                                    const copy = (feasibilityBlocks || []).slice();
                                    copy[index] = { ...copy[index], items, extraText: extra, orderedContent: ordered, _editorValue: val };
                                    setFeasibilityBlocks(copy);
                                  }}
                                  rows={4}
                                  className="w-full p-2 border rounded text-sm font-mono"
                                />
                                <div className="mt-2">
                                  <button
                                    className="px-2 py-1 rounded border text-sm"
                                    onClick={() => {
                                      const id = block._id;
                                      setFeasibilityBlocks((previous) => (previous || []).filter((b) => b._id !== id));
                                    }}
                                  >
                                    Remove block
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <button
                            className="bg-indigo-600 text-white px-3 py-1 rounded"
                            onClick={() => {
                              const copy = (feasibilityBlocks || []).slice();
                              copy.push({ _id: genId(), type: "paragraph", text: "" });
                              setFeasibilityBlocks(copy);
                            }}
                          >
                            Add paragraph
                          </button>
                          <button
                            className="bg-white border px-3 py-1 rounded"
                            onClick={() => {
                              const copy = (feasibilityBlocks || []).slice();
                              copy.push({ _id: genId(), type: "image", src: "", alt: "", _autoAlt: true });
                              setFeasibilityBlocks(copy);
                            }}
                          >
                            Add image
                          </button>
                                <button
                                  className="bg-white border px-3 py-1 rounded"
                                  onClick={() => {
                                    const copy = (feasibilityBlocks || []).slice();
                                    const imgIndex = copy.findIndex((b) => b && b.type === "image");
                                    const insertAt = imgIndex !== -1 ? imgIndex + 1 : copy.length;
                                    const list = {
                                      _id: genId(),
                                      type: "list",
                                      title: "Deliverables",
                                      style: "disc",
                                      items: [""],
                                    };
                                    copy.splice(insertAt, 0, list);
                                    setFeasibilityBlocks(copy);
                                  }}
                                >
                                  Add deliverables
                                </button>
                                <button
                                  className="bg-white border px-3 py-1 rounded"
                                  onClick={() => {
                                    const copy = (feasibilityBlocks || []).slice();
                                    const imgIndex = copy.findIndex((b) => b && b.type === "image");
                                    const insertAt = imgIndex !== -1 ? imgIndex + 1 : copy.length;
                                    const imgText = { _id: genId(), type: "paragraph", title: "Image text", text: "" };
                                    copy.splice(insertAt, 0, imgText);
                                    setFeasibilityBlocks(copy);
                                  }}
                                >
                                  Add image text
                                </button>
                          <button
                            className="bg-white border px-3 py-1 rounded"
                            onClick={() => {
                              const copy = (feasibilityBlocks || []).slice();
                              copy.push({ _id: genId(), type: "list", style: "decimal", items: [""] });
                              setFeasibilityBlocks(copy);
                            }}
                          >
                            Add list
                          </button>
                        </div>
                      </div>
                    ) : (
                      <textarea value={feasibilityContentEditor} onChange={(event) => setWhyContentEditor(event.target.value)} rows={6} className="w-full px-4 py-2 border rounded" />
                    )}
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button onClick={() => setEditingFeasibility(false)} className="px-4 py-2 rounded border">Cancel</button>
                    <button
                      onClick={() => {
                        saveSection(
                          "feasibility",
                          feasibilityTitle,
                          feasibilityBlocks || (feasibilityContentEditor ? [{ _id: genId(), type: "paragraph", text: feasibilityContentEditor }] : []),
                          setEditingFeasibility,
                          setFeasibility
                        );
                      }}
                      className="px-4 py-2 rounded bg-[#444444] text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-[40px] font-semibold text-[#222222]">{feasibility?.title}</h2>
                  <div className="mt-4 text-[15px] leading-relaxed feasibility-content">
                    {(() => {
                      const blocksSource = feasibility?.parsedContent && Array.isArray(feasibility.parsedContent.intro) ? feasibility.parsedContent.intro : null;
                      if (blocksSource) {
                        const imgIndex = blocksSource.findIndex((b) => b && b.type === "image");
                        const scopeIndex = blocksSource.findIndex((b) => b && b.type === "list" && (b.style === "decimal" || b.style === "decimal-leading-zero" || b.style === "decimal"));
                        const deliverIndex = blocksSource.findIndex((b) =>
                          b && (
                            (b.title && String(b.title).toLowerCase().includes("deliverable")) ||
                            (b.type === "heading" && b.text && String(b.text).toLowerCase().includes("deliverable"))
                          )
                        );
                                return (blocksSource || []).map((b, i) => {

                                  if (i === imgIndex) return null;

                                  if (i === scopeIndex) return null;


                                  if (imgIndex !== -1 && i === imgIndex + 1) {
                                    const isImageTextPara = b && b.type === "paragraph" && b.title && String(b.title).toLowerCase().includes("image text");
                                    const isDeliverablesHeadingOrTitled = deliverIndex !== -1 && deliverIndex === imgIndex + 1 && i === deliverIndex;
                                    const isDeliverablesListFallback = b && b.type === "list" && b.style === "disc";
                                    if (isImageTextPara || isDeliverablesHeadingOrTitled || isDeliverablesListFallback) return null;
                                  }


                                  try {
                                    const isDeliverHeading = b && b.type === "heading" && b.text && String(b.text).toLowerCase().includes("deliverable");
                                    const isDeliverTitledList = b && b.type === "list" && b.title && String(b.title).toLowerCase().includes("deliverable");
                                    const isDeliverParagraphTitle = b && b.type === "paragraph" && b.title && String(b.title).toLowerCase().includes("deliverable");
                                    if (isDeliverHeading || isDeliverTitledList || isDeliverParagraphTitle) return null;
                                  } catch (error) {

                                  }
                                  return renderBlockFeasibility(b, i, blocksSource);
                                });
                      }
                      return <p>{feasibility?.content}</p>;
                    })()}
                  </div>

                  {(() => {
                    const blocksSource = feasibility?.parsedContent && Array.isArray(feasibility.parsedContent.intro) ? feasibility.parsedContent.intro : null;
                    const scopeBlock = blocksSource && blocksSource.find((b) => b && b.type === "list" && b.style === "decimal");
                    if (!scopeBlock) return null;
                    return (
                      <div className="mt-8 bg-[#FAFAFA] p-6 rounded shadow-sm">
                        <h3 className="text-[20px] font-semibold mb-3 text-[#222222]">Scope & Approach</h3>
                        {renderBlockFeasibility(scopeBlock, "scope", blocksSource)}
                      </div>
                    );
                  })()}
                  {adminToken && (
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          setFeasibilityTitle(feasibility?.title);
                          const parsed =
                            feasibility?.parsedContent ||
                            (feasibility && feasibility.content
                              ? (() => {
                                  try {
                                    return JSON.parse(feasibility.content);
                                  } catch (error) {
                                    return null;
                                  }
                                })()
                              : null);
                          if (parsed && parsed.intro) {
                            let arr = Array.isArray(parsed.intro) ? parsed.intro.map((b) => ({ ...b, _id: b._id || genId() })) : typeof parsed.intro === "string" ? [{ _id: genId(), type: "paragraph", text: parsed.intro }] : [];
                            if (!arr.some((b) => b && b.type === "paragraph")) arr.push({ _id: genId(), type: "paragraph", text: "" });
                            setFeasibilityBlocks(arr);
                            setWhyContentEditor(blocksToPlainText(arr));

                            try {
                              let editorVal = "";
                              const sc = (parsed && (parsed.scope || parsed.scopeText)) || feasibility?.scope || null;
                              if (Array.isArray(sc)) {
                                const listBlock = sc.find((b) => b && b.type === "list");
                                if (listBlock && Array.isArray(listBlock.items)) editorVal = listBlock.items.join("\n");
                                else {
                                  const para = sc.find((b) => b && b.type === "paragraph");
                                  if (para) editorVal = para.text || "";
                                }
                              } else if (typeof sc === "string") {
                                editorVal = sc;
                              }

                            } catch (error) {

                            }
                          } else if (feasibility && feasibility.content) {
                            try {
                              const maybe = JSON.parse(feasibility.content);
                              let arr = Array.isArray(maybe) ? maybe.map((b) => ({ ...b, _id: b._id || genId() })) : typeof maybe === "string" ? [{ _id: genId(), type: "paragraph", text: maybe }] : [];
                              if (!arr.some((b) => b && b.type === "paragraph")) arr.push({ _id: genId(), type: "paragraph", text: "" });
                              setFeasibilityBlocks(arr);
                              setWhyContentEditor(blocksToPlainText(arr));

                                try {
                                  let editorVal = "";
                                  const parsed2 = maybe;
                                  const sc2 = (parsed2 && (parsed2.scope || parsed2.scopeText)) || feasibility?.scope || null;
                                  if (Array.isArray(sc2)) {
                                    const listBlock = sc2.find((b) => b && b.type === "list");
                                    if (listBlock && Array.isArray(listBlock.items)) editorVal = listBlock.items.join("\n");
                                    else {
                                      const para = sc2.find((b) => b && b.type === "paragraph");
                                      if (para) editorVal = para.text || "";
                                    }
                                  } else if (typeof sc2 === "string") editorVal = sc2;

                                } catch (error) {

                                }

                            } catch (error) {
                              const arr = [{ _id: genId(), type: "paragraph", text: feasibility.content || "" }];
                              setFeasibilityBlocks(arr);
                              setWhyContentEditor(blocksToPlainText(arr));

                            }
                          } else {
                            setFeasibilityBlocks([{ _id: genId(), type: "paragraph", text: "" }]);
                            setWhyContentEditor("");
                          }
                          setEditingFeasibility(true);
                        }}
                        className="px-3 py-1 rounded border"
                      >
                        Edit
                      </button>
                    </div>
                  )}

                  
                </>
              )}
            </div>
          </div>
        </div>
      </section>

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

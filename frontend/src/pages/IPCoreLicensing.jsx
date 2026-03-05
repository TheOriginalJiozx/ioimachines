import { useEffect, useState } from "react";
import { useAppState } from "../state/AppState";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";
import RequestConsultation from "../components/RequestConsultation";
import { genId, blocksToPlainText } from "../lib/blocks.jsx";

function renderBlockIPCore(block, index) {
  if (!block) return null;

  switch (block.type) {
    case "paragraph": {
      const hideTitle = block.title && (block.title.toLowerCase().includes("image text") || block.title.toLowerCase().includes("images"));
      return (
        <div key={index} className="mb-4">
          {block.title && !hideTitle && <h3 className="text-[24px] font-semibold text-[#222222] mb-2">{block.title}</h3>}
          <div className="whitespace-pre-wrap text-[15px] text-[#444444]">{block.text}</div>
          {block.images && block.images.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {block.images.map((img, i) => (
                <img key={i} src={img} alt={`image-${i}`} className="w-full h-28 sm:h-32 md:h-40 object-contain bg-white p-2 rounded" />
              ))}
            </div>
          )}
        </div>
      );
    }
    case "image":
      return (
        <div key={index} className="mb-4">
          <img src={block.src} alt={block.alt || ""} className="w-full rounded shadow" />
        </div>
      );
    case "list": {
      const hideTitle = block.title && block.title.toLowerCase() === "gui functions";
      const ListTag = block.style === "decimal" ? "ol" : "ul";
      const isScope = block.style === "decimal";

      if (isScope) {
        return (
          <div key={index} className="mt-8 bg-[#FAFAFA] p-6 rounded shadow-sm">
            <h3 className="text-[20px] font-semibold mb-3 text-[#222222]">Scope & Approach</h3>
            <ListTag className="list-decimal pl-8 space-y-2 text-[15px] text-[#444444]">
              {(block.items || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ListTag>
          </div>
        );
      }

      return (
        <div key={index} className="mb-4">
          {block.title && !hideTitle && <h2 className={`${block.title === "Process" ? "text-[56px]" : "text-[40px]"} font-semibold text-[#222222] mb-3`}>{block.title}</h2>}
          {block.extraText && block.extraText.length > 0 && (
            <div className="mb-3 text-[15px] text-[#444444]">
              {block.extraText.map((text, i) => (
                <p key={i} className="mb-2">
                  {text}
                </p>
              ))}
            </div>
          )}
          <ListTag className="mt-4 list-disc list-inside space-y-2 text-[15px] pl-6">
            {(block.items || []).map((item, i) => (
              <li key={i} className="text-[#444444] mb-2">
                {item}
              </li>
            ))}
          </ListTag>
          {block.title === "Process" && (
            <>
            </>
          )}
        </div>
      );
    }
    default:
      return null;
  }
}

export default function IPCoreLicensing() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("IP Core Licensing");
    }
  }, []);

  const [showModal, setShowModal] = useState(false);
  const { adminToken } = useAppState();

  const [ipcore, setIPCore] = useState(null);
  const [editingIPCore, setEditingIPCore] = useState(false);
  const [ipcoreTitle, setIPCoreTitle] = useState("");
  const [ipcoreBlocks, setIPCoreBlocks] = useState(null);
  const [ipcoreContentEditor, setIPCoreContentEditor] = useState("");

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
        const res = await fetch(`${API_BASE}/sections/ipcore`).catch(() => null);
        const json = res && res.ok ? await res.json().catch(() => null) : null;
        if (!json) return;
        try {
          const parsed = json.content ? JSON.parse(json.content) : null;
          setIPCore({ ...(json || {}), parsedContent: parsed });
        } catch (e) {
          setIPCore(json);
        }
      } catch (error) {
        console.error("Failed to load ipcore section", error);
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
    <div className="min-h-screen bg-white text-[#444444] font-sans" aria-label="IP core licensing page">
      <section className="relative w-full">
        <div className="w-full h-80 sm:h-96 md:h-[34rem] bg-gray-100 overflow-hidden">
          <img src="/ipcorelicensing_img1.jpg" alt="hero" className="object-cover w-full h-full" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full flex items-center">
            <div className="lg:pl-0 -mt-80">
              <h1 className="lg:text-[48px] text-3xl font-extrabold text-white uppercase" style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.50))" }}>
                IP Core Licensing
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className={editingIPCore ? "w-full" : "grid md:grid-cols-2 gap-12 items-start"}>
            {!editingIPCore && (
              <div>
                <div className="mt-4 text-[#444444] text-[15px]">
                  {ipcore &&
                    ipcore.parsedContent &&
                    Array.isArray(ipcore.parsedContent.intro) &&
                    ipcore.parsedContent.intro.map((block, idx) => {
                      if (block.type === "list" && block.style === "decimal") return null;
                      if (block.type === "list" && block.title === "Process") return null;
                      return renderBlockIPCore(block, idx);
                    })}
                </div>
              </div>
            )}
            <div>
              {editingIPCore ? (
                <div className="mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    {ipcoreBlocks && Array.isArray(ipcoreBlocks) ? (
                      <div className="space-y-4">
                        {ipcoreBlocks.map((block, index) => (
                          <div key={block._id || index} className="border rounded p-3">
                            <div className="mb-2 text-sm text-gray-600">
                              Block #{index + 1} — <span className="font-mono">{block.title ? block.title.charAt(0).toLowerCase() + block.title.slice(1).toLowerCase() : block.type}</span>
                            </div>
                            {block.type === "paragraph" && !(block.title && String(block.title).toLowerCase().includes("images")) && (
                              <>
                                <textarea
                                  value={block.text || ""}
                                  onChange={(event) => {
                                    const id = block._id;
                                    const val = event.target.value;
                                    setIPCoreBlocks((previous) => {
                                      const array = (previous || []).slice();
                                      const idx = array.findIndex((b) => b._id === id);
                                      if (idx === -1) return previous;
                                      array[idx] = { ...array[idx], text: val };
                                      return array;
                                    });
                                  }}
                                  rows={6}
                                  className="w-full p-2 border rounded text-sm font-mono"
                                />
                                {block.images && block.images.length > 0 && (
                                  <div className="mt-2 space-y-2">
                                    {block.images.map((img, imgIndex) => (
                                      <div key={imgIndex} className="border rounded p-2 bg-gray-50">
                                        {img && <img src={img} alt="uploaded" className="w-full h-24 object-cover rounded mb-1" />}
                                        <button
                                          className="px-2 py-1 rounded border text-xs"
                                          onClick={() => {
                                            const id = block._id;
                                            setIPCoreBlocks((previous) => {
                                              const array = (previous || []).slice();
                                              const idx = array.findIndex((b) => b._id === id);
                                              if (idx === -1) return previous;
                                              const newImages = (array[idx].images || []).filter((_, i) => i !== imgIndex);
                                              array[idx] = { ...array[idx], images: newImages };
                                              return array;
                                            });
                                          }}
                                        >
                                          Remove image
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="mt-2 flex gap-2">
                                  <label className="bg-white border px-3 py-1 rounded text-sm cursor-pointer">
                                    Add image
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(event) => {
                                        const file = event.target.files && event.target.files[0];
                                        if (!file) return;
                                        const id = block._id;
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                          const dataUrl = e.target.result;
                                          setIPCoreBlocks((previous) => {
                                            const array = (previous || []).slice();
                                            const idx = array.findIndex((b) => b._id === id);
                                            if (idx === -1) return previous;
                                            const images = [...(array[idx].images || []), dataUrl];
                                            array[idx] = { ...array[idx], images };
                                            return array;
                                          });
                                        };
                                        reader.readAsDataURL(file);
                                      }}
                                      className="hidden"
                                    />
                                  </label>
                                  <button
                                    className="px-2 py-1 rounded border text-sm"
                                    onClick={() => {
                                      const id = block._id;
                                      setIPCoreBlocks((previous) => (previous || []).filter((b) => b._id !== id));
                                    }}
                                  >
                                    Remove block
                                  </button>
                                </div>
                              </>
                            )}
                            {block.type === "paragraph" && block.title && String(block.title).toLowerCase().includes("images") && (
                              <>
                                {block.images && block.images.length > 0 && (
                                  <div className="mt-2 space-y-2">
                                    {block.images.map((img, imgIndex) => (
                                      <div key={imgIndex} className="border rounded p-2 bg-gray-50">
                                        {img && <img src={img} alt="uploaded" className="w-full h-24 object-cover rounded mb-1" />}
                                        <button
                                          className="px-2 py-1 rounded border text-xs"
                                          onClick={() => {
                                            const id = block._id;
                                            setIPCoreBlocks((previous) => {
                                              const array = (previous || []).slice();
                                              const idx = array.findIndex((b) => b._id === id);
                                              if (idx === -1) return previous;
                                              const newImages = (array[idx].images || []).filter((_, i) => i !== imgIndex);
                                              array[idx] = { ...array[idx], images: newImages };
                                              return array;
                                            });
                                          }}
                                        >
                                          Remove image
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="mt-2 flex gap-2">
                                  {(!block.images || block.images.length < 3) && (
                                    <label className="bg-white border px-3 py-1 rounded text-sm cursor-pointer">
                                      Add image
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                          const file = event.target.files && event.target.files[0];
                                          if (!file) return;
                                          const id = block._id;
                                          const reader = new FileReader();
                                          reader.onload = (e) => {
                                            const dataUrl = e.target.result;
                                            setIPCoreBlocks((previous) => {
                                              const array = (previous || []).slice();
                                              const idx = array.findIndex((b) => b._id === id);
                                              if (idx === -1) return previous;
                                              const images = [...(array[idx].images || []), dataUrl];
                                              if (images.length > 3) {
                                                alert("Maximum 3 images allowed");
                                                return previous;
                                              }
                                              array[idx] = { ...array[idx], images };
                                              return array;
                                            });
                                          };
                                          reader.readAsDataURL(file);
                                        }}
                                        className="hidden"
                                      />
                                    </label>
                                  )}
                                  {block.images && block.images.length >= 3 && <div className="text-xs text-gray-500">Max 3 images reached</div>}
                                  <div className="mt-2 flex gap-2 flex-wrap">
                                    {index > 0 && (
                                      <button
                                        className="px-2 py-1 rounded border text-sm"
                                        onClick={() => {
                                          setIPCoreBlocks((previous) => {
                                            const array = (previous || []).slice();
                                            [array[index - 1], array[index]] = [array[index], array[index - 1]];
                                            return array;
                                          });
                                        }}
                                      >
                                        Move up
                                      </button>
                                    )}
                                    {index < ipcoreBlocks.length - 1 && (
                                      <button
                                        className="px-2 py-1 rounded border text-sm"
                                        onClick={() => {
                                          setIPCoreBlocks((previous) => {
                                            const array = (previous || []).slice();
                                            [array[index], array[index + 1]] = [array[index + 1], array[index]];
                                            return array;
                                          });
                                        }}
                                      >
                                        Move down
                                      </button>
                                    )}
                                    <button
                                      className="px-2 py-1 rounded border text-sm"
                                      onClick={() => {
                                        const id = block._id;
                                        setIPCoreBlocks((previous) => (previous || []).filter((b) => b._id !== id));
                                      }}
                                    >
                                      Remove block
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                            {block.type === "heading" && (
                              <>
                                <input
                                  type="text"
                                  value={block.text || ""}
                                  onChange={(event) => {
                                    const id = block._id;
                                    const val = event.target.value;
                                    setIPCoreBlocks((previous) => {
                                      const array = (previous || []).slice();
                                      const idx = array.findIndex((b) => b._id === id);
                                      if (idx === -1) return previous;
                                      array[idx] = { ...array[idx], text: val };
                                      return array;
                                    });
                                  }}
                                  className="w-full p-2 border rounded text-sm"
                                  placeholder="Heading text"
                                />
                                <div className="mt-2 flex gap-2 flex-wrap">
                                  {index > 0 && (
                                    <button
                                      className="px-2 py-1 rounded border text-sm"
                                      onClick={() => {
                                        setIPCoreBlocks((previous) => {
                                          const array = (previous || []).slice();
                                          [array[index - 1], array[index]] = [array[index], array[index - 1]];
                                          return array;
                                        });
                                      }}
                                    >
                                      Move up
                                    </button>
                                  )}
                                  {index < ipcoreBlocks.length - 1 && (
                                    <button
                                      className="px-2 py-1 rounded border text-sm"
                                      onClick={() => {
                                        setIPCoreBlocks((previous) => {
                                          const array = (previous || []).slice();
                                          [array[index], array[index + 1]] = [array[index + 1], array[index]];
                                          return array;
                                        });
                                      }}
                                    >
                                      Move down
                                    </button>
                                  )}
                                  <button
                                    className="px-2 py-1 rounded border text-sm"
                                    onClick={() => {
                                      const id = block._id;
                                      setIPCoreBlocks((previous) => (previous || []).filter((b) => b._id !== id));
                                    }}
                                  >
                                    Remove block
                                  </button>
                                </div>
                              </>
                            )}
                            {block.type === "list" && (
                              <>
                                <label className="text-xs text-gray-600 block">{block._isSemicolonList ? "Text and items (items end with ;)" : "List items (one per line)"}</label>
                                <textarea
                                  value={block._editorValue !== undefined ? block._editorValue : block._isSemicolonList ? [...(block.extraText || []), ...(block.items || []).map((item) => item + ";")].join("\n") : (block.items || []).join("\n")}
                                  onChange={(event) => {
                                    const id = block._id;
                                    const val = event.target.value;
                                    setIPCoreBlocks((previous) => {
                                      const array = (previous || []).slice();
                                      const idx = array.findIndex((b) => b._id === id);
                                      if (idx === -1) return previous;
                                      array[idx] = { ...array[idx], _editorValue: val };
                                      return array;
                                    });
                                  }}
                                  onBlur={(event) => {
                                    const id = block._id;
                                    const val = event.target.value;
                                    let items = [];
                                    let extra = [];

                                    if (block._isSemicolonList) {
                                      const lines = val.split("\n").map((s) => s.replace(/\u00A0/g, " ").replace(/\t/g, " "));
                                      lines.forEach((line) => {
                                        const trimmedEnd = line.replace(/\s+$/g, "");
                                        if (trimmedEnd.endsWith(";")) {
                                          const itemText = trimmedEnd.replace(/;\s*$/, "").trim();
                                          if (itemText) items.push(itemText);
                                        } else if (line.trim()) {
                                          extra.push(line.trim());
                                        }
                                      });
                                    } else {
                                      items = val
                                        .split("\n")
                                        .map((s) => s.trim())
                                        .filter((s) => s.length > 0);
                                    }

                                    setIPCoreBlocks((previous) => {
                                      const array = (previous || []).slice();
                                      const idx = array.findIndex((b) => b._id === id);
                                      if (idx === -1) return previous;
                                      const updated = { ...array[idx], items, _editorValue: undefined };
                                      if (block._isSemicolonList) {
                                        updated.extraText = extra;
                                      }
                                      array[idx] = updated;
                                      return array;
                                    });
                                  }}
                                  rows={6}
                                  className="w-full p-2 border rounded text-sm font-mono"
                                />
                                <div className="mt-2 flex gap-2 flex-wrap">
                                  {index > 0 && (
                                    <button
                                      className="px-2 py-1 rounded border text-sm"
                                      onClick={() => {
                                        setIPCoreBlocks((previous) => {
                                          const array = (previous || []).slice();
                                          [array[index - 1], array[index]] = [array[index], array[index - 1]];
                                          return array;
                                        });
                                      }}
                                    >
                                      Move up
                                    </button>
                                  )}
                                  {index < ipcoreBlocks.length - 1 && (
                                    <button
                                      className="px-2 py-1 rounded border text-sm"
                                      onClick={() => {
                                        setIPCoreBlocks((previous) => {
                                          const array = (previous || []).slice();
                                          [array[index], array[index + 1]] = [array[index + 1], array[index]];
                                          return array;
                                        });
                                      }}
                                    >
                                      Move down
                                    </button>
                                  )}
                                  <button
                                    className="px-2 py-1 rounded border text-sm"
                                    onClick={() => {
                                      const id = block._id;
                                      setIPCoreBlocks((previous) => (previous || []).filter((b) => b._id !== id));
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
                                          setIPCoreBlocks((prev) => {
                                            const copy = (prev || []).slice();
                                            const idx = copy.findIndex((b) => b._id === id);
                                            if (idx === -1) return prev;
                                            copy[idx] = { ...copy[idx], _file: file, src: preview, alt: block.alt || "image", _autoAlt: false };
                                            return copy;
                                          });
                                        } catch (error) {
                                          console.error("preview failed", error);
                                        }
                                      }}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                                <label className="text-xs text-gray-600">Or image URL</label>
                                <input
                                  value={block.src || ""}
                                  onChange={(event) => {
                                    const id = block._id;
                                    const val = event.target.value || "";
                                    setIPCoreBlocks((prev) => {
                                      const copy = (prev || []).slice();
                                      const idx = copy.findIndex((b) => b._id === id);
                                      if (idx === -1) return prev;
                                      copy[idx] = { ...copy[idx], src: val, alt: block.alt || "image", _autoAlt: false };
                                      return copy;
                                    });
                                  }}
                                  className="w-full p-2 border rounded text-sm"
                                />
                                <label className="text-xs text-gray-600">Alt text</label>
                                <input
                                  value={block.alt || ""}
                                  onChange={(event) => {
                                    const id = block._id;
                                    setIPCoreBlocks((prev) => {
                                      const copy = (prev || []).slice();
                                      const idx = copy.findIndex((b) => b._id === id);
                                      if (idx === -1) return prev;
                                      copy[idx] = { ...copy[idx], alt: event.target.value, _autoAlt: false };
                                      return copy;
                                    });
                                  }}
                                  className="w-full p-2 border rounded text-sm"
                                />
                                <div className="mt-2">{block.src ? <img src={block.src} alt={block.alt || ""} className="object-contain w-full h-36 rounded" /> : <div className="text-sm text-gray-400">No image</div>}</div>
                                <div className="mt-2 flex gap-2 flex-wrap">
                                  {index > 0 && (
                                    <button
                                      className="px-2 py-1 rounded border text-sm"
                                      onClick={() => {
                                        setIPCoreBlocks((previous) => {
                                          const array = (previous || []).slice();
                                          [array[index - 1], array[index]] = [array[index], array[index - 1]];
                                          return array;
                                        });
                                      }}
                                    >
                                      Move up
                                    </button>
                                  )}
                                  {index < ipcoreBlocks.length - 1 && (
                                    <button
                                      className="px-2 py-1 rounded border text-sm"
                                      onClick={() => {
                                        setIPCoreBlocks((previous) => {
                                          const array = (previous || []).slice();
                                          [array[index], array[index + 1]] = [array[index + 1], array[index]];
                                          return array;
                                        });
                                      }}
                                    >
                                      Move down
                                    </button>
                                  )}
                                  <button
                                    className="px-2 py-1 rounded border text-sm"
                                    onClick={() => {
                                      const id = block._id;
                                      setIPCoreBlocks((previous) => (previous || []).filter((b) => b._id !== id));
                                    }}
                                  >
                                    Remove block
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                          <button
                            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                            onClick={() => {
                              const copy = (ipcoreBlocks || []).slice();
                              copy.push({ _id: genId(), type: "heading", level: 3, text: "" });
                              setIPCoreBlocks(copy);
                            }}
                          >
                            Add heading
                          </button>
                          <button
                            className="bg-white border px-3 py-1 rounded text-sm"
                            onClick={() => {
                              const copy = (ipcoreBlocks || []).slice();
                              copy.push({ _id: genId(), type: "paragraph", text: "" });
                              setIPCoreBlocks(copy);
                            }}
                          >
                            Add paragraph
                          </button>
                          <button
                            className="bg-white border px-3 py-1 rounded text-sm"
                            onClick={() => {
                              const copy = (ipcoreBlocks || []).slice();
                              copy.push({ _id: genId(), type: "image", src: "", alt: "", _autoAlt: true });
                              setIPCoreBlocks(copy);
                            }}
                          >
                            Add image
                          </button>
                          <button
                            className="bg-white border px-3 py-1 rounded text-sm"
                            onClick={() => {
                              const copy = (ipcoreBlocks || []).slice();
                              copy.push({ _id: genId(), type: "list", title: "Process", style: "disc", items: [""] });
                              setIPCoreBlocks(copy);
                            }}
                          >
                            Add process
                          </button>
                          <button
                            className="bg-white border px-3 py-1 rounded text-sm"
                            onClick={() => {
                              const copy = (ipcoreBlocks || []).slice();
                              copy.push({ _id: genId(), type: "paragraph", title: "Signature Algorithm Images", text: "", images: [] });
                              setIPCoreBlocks(copy);
                            }}
                          >
                            Add signature algorithm images
                          </button>
                          <button
                            className="bg-white border px-3 py-1 rounded text-sm"
                            onClick={() => {
                              const copy = (ipcoreBlocks || []).slice();
                              copy.push({ _id: genId(), type: "list", title: "GUI Functions", style: "disc", items: [""], _isSemicolonList: true });
                              setIPCoreBlocks(copy);
                            }}
                          >
                            Add GUI functions
                          </button>
                          <button
                            className="bg-white border px-3 py-1 rounded text-sm"
                            onClick={() => {
                              const copy = (ipcoreBlocks || []).slice();
                              copy.push({ _id: genId(), type: "list", title: "Scope & Approach", style: "decimal", items: [""] });
                              setIPCoreBlocks(copy);
                            }}
                          >
                            Add scope & approach
                          </button>
                        </div>
                      </div>
                    ) : (
                      <textarea value={ipcoreContentEditor} onChange={(event) => setIPCoreContentEditor(event.target.value)} rows={6} className="w-full px-4 py-2 border rounded" />
                    )}
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button onClick={() => setEditingIPCore(false)} className="px-4 py-2 rounded border">
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        saveSection("ipcore", ipcoreTitle, ipcoreBlocks || (ipcoreContentEditor ? [{ _id: genId(), type: "paragraph", text: ipcoreContentEditor }] : []), setEditingIPCore, setIPCore);
                      }}
                      className="px-4 py-2 rounded bg-[#444444] text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {adminToken && !editingIPCore && (
                    <div className="mb-4">
                      <button
                        onClick={() => {
                          setIPCoreTitle(ipcore?.title || "IP Core Licensing");
                          const parsed = ipcore?.parsedContent || null;
                          let arr = [];
                          if (parsed && parsed.intro) {
                            arr = Array.isArray(parsed.intro) ? parsed.intro.map((b) => ({ ...b, _id: b._id || genId() })) : typeof parsed.intro === "string" ? [{ _id: genId(), type: "paragraph", text: parsed.intro }] : [];
                          }

                          if (!arr.some((b) => b && b._id)) arr = arr.map((b) => ({ ...b, _id: genId() }));
                          setIPCoreBlocks(arr);
                          setIPCoreContentEditor(blocksToPlainText(arr));
                          setEditingIPCore(true);
                        }}
                        className="px-3 py-1 border rounded"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                  {ipcore &&
                    ipcore.parsedContent &&
                    Array.isArray(ipcore.parsedContent.intro) &&
                    ipcore.parsedContent.intro.map((block, idx) => {
                      if (block.type === "list" && block.title === "Process") {
                        return renderBlockIPCore(block, idx);
                      }
                      return null;
                    })}

                  <div className="mt-6 flex justify-start">
                    <button onClick={() => setShowModal(true)} className="text-black px-6 py-3 border border-black uppercase">
                      Request an Evaluation License
                    </button>
                  </div>

                  {ipcore &&
                    ipcore.parsedContent &&
                    Array.isArray(ipcore.parsedContent.intro) &&
                    ipcore.parsedContent.intro.map((block, idx) => {
                      if (block.type === "list" && block.style === "decimal") {
                        return renderBlockIPCore(block, idx);
                      }
                      return null;
                    })}

                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      {showModal && <RequestConsultation modal onClose={() => setShowModal(false)} />}

      {!editingIPCore && (
        <>
          <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

          <GetAdvice />

          <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

          <Features />

          <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

          <ContactCase />

          <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>
        </>
      )}
    </div>
  );
}

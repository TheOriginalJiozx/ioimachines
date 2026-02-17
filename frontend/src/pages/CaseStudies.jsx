import { useEffect, useState } from "react";
import { useAppState } from "../state/AppState";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";

export default function CaseStudies() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [caseData, setCaseData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [caseList, setCaseList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [contentEditor, setContentEditor] = useState("");
  const [solutionEditor, setSolutionEditor] = useState("");
  const [editingBlocks, setEditingBlocks] = useState(null);
  const [editingSolutionBlocks, setEditingSolutionBlocks] = useState(null);
  const [titleEditor, setTitleEditor] = useState("");
  const [solutionTitleEditor, setSolutionTitleEditor] = useState("");
  const [saving, setSaving] = useState(false);
  const { adminToken } = useAppState();
  const [isCreating, setIsCreating] = useState(false);
  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

  function normalizeEntry(entry) {
    const title = entry.title || "";
    const image = entry.image || entry.hero_image || "";
    let content = entry.content || entry.contentJson || entry.content_json || "";
    try {
      content = typeof content === "string" ? JSON.parse(content) : content;
    } catch (error) {}
    let solutionContent = entry.solution_content_json || entry.solutionContentJson || entry.solutionContent || "";
    try {
      solutionContent = typeof solutionContent === "string" ? JSON.parse(solutionContent) : solutionContent;
    } catch (error) {}
    const solutionTitle = entry.solution_title || entry.solutionTitle || "";
    return { slug: entry.slug, title, image, content, solutionTitle, solutionContent };
  }

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("Case Studies");
    }



    async function load() {
      setLoading(true);
      setError("");
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || "https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net/api";
        const res = await fetch(`${API_BASE}/case-studies`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();

        if (Array.isArray(json) && json.length > 0) {
          const list = json.map(normalizeEntry);
          setCaseList(list);
          setSelectedIndex(0);
          setCaseData(list[0]);
        } else if (!Array.isArray(json)) {
          const item = normalizeEntry(json);
          setCaseList([item]);
          setCaseData(item);
          setSelectedIndex(0);
        } else {
          setCaseList([]);
          setCaseData(null);
        }
      } catch (error) {
        setError("Failed to load case study: " + error.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (caseList && caseList.length > 0) {
      const index = Math.max(0, Math.min(selectedIndex, caseList.length - 1));
      setCaseData(caseList[index]);
    }
  }, [selectedIndex, caseList]);

  useEffect(() => {
    if (!titleEditor) return;
    if (editingBlocks && Array.isArray(editingBlocks)) {
      const copy = editingBlocks.slice();
      let changed = false;
      for (let i = 0; i < copy.length; i++) {
        const block = copy[i];
        if (block && block.type === 'image' && block._autoAlt) {
          const newAlt = `${titleEditor} image`;
          if (block.alt !== newAlt) {
            copy[i] = { ...block, alt: newAlt };
            changed = true;
          }
        }
      }
      if (changed) setEditingBlocks(copy);
    }
    if (editingSolutionBlocks && Array.isArray(editingSolutionBlocks)) {
      const copy2 = editingSolutionBlocks.slice();
      let changed2 = false;
      for (let i = 0; i < copy2.length; i++) {
        const block = copy2[i];
        if (block && block.type === 'image' && block._autoAlt) {
          const newAlt = `${titleEditor} image`;
          if (block.alt !== newAlt) {
            copy2[i] = { ...block, alt: newAlt };
            changed2 = true;
          }
        }
      }
      if (changed2) setEditingSolutionBlocks(copy2);
    }
  }, [titleEditor, editingBlocks, editingSolutionBlocks]);

  function blocksToPlainText(content) {
    if (!content && content !== "") return "";
    let array = content;
    if (typeof content === "string") {
      try {
        array = JSON.parse(content);
      } catch (error) {
        alert("Content is not valid JSON. Please fix it before editing. Error: " + error.message);
      }
    }
    if (Array.isArray(array)) {
      return array
        .map((block) => {
          try {
            return block && block.type === "paragraph" && block.text ? block.text : "";
          } catch (error) {
            return "";
          }
        })
        .filter((string) => string && string.length > 0)
        .join("\n");
    }
    return typeof content === "string" ? content : "";
  }

  function renderBlock(block, index) {
    if (!block) return null;
    switch (block.type) {
      case "paragraph":
        return (
          <p key={index} className="text-sm text-[#606060] mb-4">
            {block.text}
          </p>
        );
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
          <div key={index} className="w-full max-w-xs md:max-w-sm mb-4">
            <img src={block.src} alt={block.alt || ""} className="object-contain w-full h-auto" />
          </div>
        );
      case "list":
        return (
          <ul key={index} className={`list-${block.style || "disc"} pl-5 text-sm text-[#606060] mb-4`}>
            {(block.items || []).map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        );
      default:
        return <div key={index} dangerouslySetInnerHTML={{ __html: block.html || "" }} />;
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#444444] font-sans" aria-label="Case studies page">
      <section className="relative w-full mb-16">
        <div className="w-full h-80 sm:h-96 md:h-[34rem] bg-gray-100 overflow-hidden">
          <img src="/success_stories.jpg" alt="Case hero" className="object-cover w-full h-full" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full flex items-center">
            <div className="lg:pl-0 -mt-80">
              <h1 className="lg:text-[38px] font-extrabold text-white uppercase" style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.50))" }}>
                Case Studies
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full">
        <div className="w-full sm:h-96 md:h-[24rem] bg-[#404D56] overflow-hidden flex items-center justify-center">
          <img src="/cases-1.png" className="object-contain h-3/4 w-auto" alt="heroTwo" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 overflow-visible">
        <div className="grid md:grid-cols-3 gap-8 items-start overflow-visible">
          <div className="md:col-span-2">
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600">{error}</div>}

            {isEditing ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">{isCreating ? "Creating New Case Study" : `Editing: ${caseData?.title}`}</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input value={titleEditor} onChange={(event) => setTitleEditor(event.target.value)} className="w-full p-2 border rounded" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  {editingBlocks && Array.isArray(editingBlocks) ? (
                    <div className="space-y-4">
                      {editingBlocks.map((block, index) => (
                        <div key={block._id || index} className="border rounded p-3">
                          <div className="mb-2 text-sm text-gray-600">
                            Block #{index + 1} — <span className="font-mono">{block.type}</span>
                          </div>
                            {block.type === "paragraph" && (
                            <>
                            <textarea
                              value={block.text || ""}
                              onChange={(event) => {
                                const id = block._id;
                                const val = event.target.value;
                                setEditingBlocks((previous) => {
                                  const array = (previous || []).slice();
                                  const index = array.findIndex((block) => block._id === id);
                                  if (index === -1) return previous;
                                  array[index] = { ...array[index], text: val };
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
                                  setEditingBlocks((previous) => {
                                    const array = (previous || []).slice();
                                    const index = array.findIndex((block) => block._id === id);
                                    if (index <= 0) return previous;
                                    const temporary = array[index - 1];
                                    array[index - 1] = array[index];
                                    array[index] = temporary;
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
                                  setEditingBlocks((previous) => {
                                    const array = (previous || []).slice();
                                    const index = array.findIndex((block) => block._id === id);
                                    if (index === -1 || index >= array.length - 1) return previous;
                                    const temporary = array[index + 1];
                                    array[index + 1] = array[index];
                                    array[index] = temporary;
                                    return array;
                                  });
                                }}
                                disabled={index >= (editingBlocks ? editingBlocks.length - 1 : 0)}
                              >
                                Move down
                              </button>
                              <button
                                className="px-2 py-1 rounded border text-sm"
                                onClick={() => {
                                  const id = editingBlocks && editingBlocks[index] && editingBlocks[index]._id;
                                  if (!id) {
                                    setEditingBlocks((previous) => {
                                      const copy = (previous || []).slice();
                                      copy.splice(index, 1);
                                      return copy;
                                    });
                                    return;
                                  }
                                  setEditingBlocks((previous) => (previous || []).filter((block) => block._id !== id));
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
                                        if (titleEditor && titleEditor.trim()) alt = `${titleEditor} image`;
                                        else alt = (file.name || "").replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
                                        setEditingBlocks((previous) => {
                                          const array = (previous || []).slice();
                                          const index = array.findIndex((block) => block._id === id);
                                          if (index === -1) return previous;
                                          array[index] = { ...array[index], _file: file, src: preview, alt, _autoAlt: true };
                                          return array;
                                        });
                                      } catch (error) {
                                        let alt = "";
                                        if (titleEditor && titleEditor.trim()) alt = `${titleEditor} image`;
                                        else alt = (file.name || "").replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
                                        setEditingBlocks((previous) => {
                                          const array = (previous || []).slice();
                                          const index = array.findIndex((block) => block._id === id);
                                          if (index === -1) return previous;
                                          array[index] = { ...array[index], _file: file, alt, _autoAlt: true };
                                          return array;
                                        });
                                      }
                                    }}
                                    className="hidden"
                                  />
                                </label>
                                <div className="text-sm text-gray-600">or paste URL below</div>
                              </div>

                              <label className="text-xs text-gray-600">Or image URL</label>
                              <input
                                value={block.src || block.url || ""}
                                onChange={(event) => {
                                  const copy = editingBlocks.slice();
                                  const val = event.target.value || "";
                                  let alt = "";
                                  if (titleEditor && titleEditor.trim()) alt = `${titleEditor} image`;
                                  else {
                                    try {
                                      const p = val.split("?")[0].split("#")[0];
                                      const parts = p.split('/');
                                      let fileName = parts[parts.length - 1] || p;
                                      fileName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
                                      alt = fileName;
                                    } catch (error) {
                                      alt = "";
                                    }
                                  }
                                  copy[index] = { ...copy[index], src: val, url: undefined, alt, _autoAlt: true };
                                  setEditingBlocks(copy);
                                }}
                                className="w-full p-2 border rounded text-sm"
                              />

                              <label className="text-xs text-gray-600">Alt text</label>
                              <input
                                value={block.alt || ""}
                                onChange={(event) => {
                                  const copy = editingBlocks.slice();
                                  copy[index] = { ...copy[index], alt: event.target.value, _autoAlt: false };
                                  setEditingBlocks(copy);
                                }}
                                className="w-full p-2 border rounded text-sm"
                              />

                              <div className="mt-2">{block.src || block.url ? <img src={block.src || block.url} alt={block.alt || ""} className="object-contain w-full h-36" /> : <div className="text-sm text-gray-400">No image</div>}</div>
                              <div className="mt-2">
                                <button
                                  className="px-2 py-1 rounded border text-sm"
                                  onClick={() => {
                                    const copy = editingBlocks.slice();
                                    copy.splice(index, 1);
                                    setEditingBlocks(copy);
                                  }}
                                >
                                  Remove block
                                </button>
                              </div>
                            </div>
                          )}
                          {block.type !== "paragraph" && block.type !== "image" && (
                            <>
                              <input
                                value={block.src || block.url || ""}
                                onChange={(event) => {
                                  const val = event.target.value || "";
                                  const id = block._id;
                                  let alt = "";
                                  if (titleEditor && titleEditor.trim()) alt = `${titleEditor} image`;
                                  else {
                                    try {
                                      const p = val.split("?")[0].split("#")[0];
                                      const parts = p.split('/');
                                      let fname = parts[parts.length - 1] || p;
                                      fname = fname.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
                                      alt = fname;
                                    } catch (error) {
                                      alt = "";
                                    }
                                  }
                                  setEditingBlocks((previous) => {
                                    const array = (previous || []).slice();
                                    const index = array.findIndex((block) => block._id === id);
                                    if (index === -1) return previous;
                                    array[index] = { ...array[index], src: val, url: undefined, alt, _autoAlt: true };
                                    return array;
                                  });
                                }}
                                className="w-full p-2 border rounded text-sm"
                              />
                              <div className="mt-2 flex gap-2">
                                <button
                                  className="px-2 py-1 rounded border text-sm"
                                  onClick={() => {
                                    const id = block._id;
                                    setEditingBlocks((previous) => {
                                      const array = (previous || []).slice();
                                      const index = array.findIndex((block) => block._id === id);
                                      if (index <= 0) return previous;
                                      const temporary = array[index - 1];
                                      array[index - 1] = array[index];
                                      array[index] = temporary;
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
                                    if (!editingBlocks || index >= editingBlocks.length - 1) return;
                                    const copy = editingBlocks.slice();
                                    const temporary = copy[index + 1];
                                    copy[index + 1] = copy[index];
                                    copy[index] = temporary;
                                    setEditingBlocks(copy);
                                  }}
                                  disabled={index >= (editingBlocks ? editingBlocks.length - 1 : 0)}
                                >
                                  Move down
                                </button>
                                <button
                                  className="px-2 py-1 rounded border text-sm"
                                  onClick={() => {
                                    const id = editingBlocks && editingBlocks[index] && editingBlocks[index]._id;
                                    if (!id) {
                                      setEditingBlocks((previous) => {
                                        const copy = (previous || []).slice();
                                        copy.splice(index, 1);
                                        return copy;
                                      });
                                      return;
                                    }
                                    setEditingBlocks((previous) => (previous || []).filter((block) => block._id !== id));
                                  }}
                                >
                                  Remove block
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <button
                          className="bg-indigo-600 text-white px-3 py-1 rounded"
                          onClick={() => {
                            const copy = (editingBlocks || []).slice();
                            copy.push({ _id: genId(), type: "paragraph", text: "" });
                            setEditingBlocks(copy);
                          }}
                        >
                          Add paragraph
                        </button>
                        <button
                          className="bg-white border px-3 py-1 rounded"
                          onClick={() => {
                            const copy = (editingBlocks || []).slice();
                            copy.push({ _id: genId(), type: "image", src: "", alt: "", _autoAlt: true });
                            setEditingBlocks(copy);
                          }}
                        >
                          Add image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <textarea value={contentEditor} onChange={(event) => setContentEditor(event.target.value)} rows={10} className="w-full p-3 border rounded text-sm font-mono" />
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                    disabled={saving}
                    onClick={async () => {
                      if (!caseData) return;
                      function toJsonString(text) {
                        if (typeof text !== "string") return JSON.stringify([]);
                        try {
                          const parsed = JSON.parse(text);
                          return JSON.stringify(parsed, null, 2);
                        } catch (error) {
                          const lines = text
                            .split(/\r?\n/)
                            .map((s) => s.trim())
                            .filter((s) => s.length > 0);
                          if (lines.length === 0) return JSON.stringify([]);
                          const blocks = lines.map((l) => ({ type: "paragraph", text: l }));
                          return JSON.stringify(blocks, null, 2);
                        }
                      }

                      let contentPayload;
                      if (editingBlocks && Array.isArray(editingBlocks)) {
                        const API_BASE = import.meta.env.VITE_API_BASE || "https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net/api";
                        const blocksCopy = editingBlocks.slice();
                        for (let i = 0; i < blocksCopy.length; i++) {
                          const block = blocksCopy[i];
                          if (block && block._file) {
                            try {
                              const formData = new FormData();
                              formData.append("file", block._file);
                              const headers = {};
                              if (adminToken) headers["Authorization"] = "Bearer " + adminToken;
                              const upRes = await fetch(`${API_BASE}/uploads`, { method: "POST", body: formData, headers });
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
                        setEditingBlocks(blocksCopy);
                        contentPayload = JSON.stringify(blocksCopy, null, 2);
                      } else {
                        const paragraphJson = toJsonString(contentEditor);
                        let paragraphBlocks = [];
                        try {
                          paragraphBlocks = JSON.parse(paragraphJson);
                        } catch (error) {
                          paragraphBlocks = [];
                        }

                        contentPayload = JSON.stringify(paragraphBlocks, null, 2);
                      }

                      let solutionPayload;
                      if (editingSolutionBlocks && Array.isArray(editingSolutionBlocks)) {
                        const API_BASE = import.meta.env.VITE_API_BASE || "https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net/api";
                        const solCopy = editingSolutionBlocks.slice();
                        for (let i = 0; i < solCopy.length; i++) {
                          const block = solCopy[i];
                          if (block && block._file) {
                            try {
                              const formData = new FormData();
                              formData.append("file", block._file);
                              const headers = {};
                              if (adminToken) headers["Authorization"] = "Bearer " + adminToken;
                              const upRes = await fetch(`${API_BASE}/uploads`, { method: "POST", body: formData, headers });
                              if (!upRes.ok) throw new Error("upload failed");
                              const upJson = await upRes.json();
                              const url = upJson.url || upJson.path || "";
                              solCopy[i] = { ...solCopy[i], src: url };
                              delete solCopy[i]._file;
                            } catch (error) {
                              console.error("upload failed", error);
                              alert("Solution image upload failed: " + (error.message || error));
                            }
                          }
                        }
                        setEditingSolutionBlocks(solCopy);
                        solutionPayload = JSON.stringify(solCopy, null, 2);
                      } else {
                        const solutionParagraphJson = toJsonString(solutionEditor);
                        let solutionParagraphBlocks = [];
                        try {
                          solutionParagraphBlocks = JSON.parse(solutionParagraphJson);
                        } catch (error) {
                          solutionParagraphBlocks = [];
                        }
                        solutionPayload = JSON.stringify(solutionParagraphBlocks, null, 2);
                      }

                      setSaving(true);
                      try {
                        const API_BASE = import.meta.env.VITE_API_BASE || "https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net/api";
                        const headers = { "Content-Type": "application/json" };
                        if (adminToken) headers["Authorization"] = "Bearer " + adminToken;
                          const payload = { content: contentPayload, solution_content_json: solutionPayload, title: titleEditor, solution_title: solutionTitleEditor };
                          let res;
                          if (isCreating) {
                            const slug = titleEditor ? titleEditor.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') : '';
                            const createBody = { ...payload, slug };
                            res = await fetch(`${API_BASE}/case-studies`, {
                              method: "POST",
                              headers,
                              body: JSON.stringify(createBody),
                            });
                            if (!res.ok) {
                              const txt = await res.text();
                              throw new Error("Create failed: " + res.status + " " + txt);
                            }
                            const result = await res.json().catch(() => ({}));
                            const created = {
                              slug: result.slug || (titleEditor ? titleEditor.toLowerCase().replace(/[^a-z0-9]+/g, '-') : ''),
                              title: titleEditor,
                              content: JSON.parse(contentPayload),
                              solutionContent: JSON.parse(solutionPayload),
                              solutionTitle: solutionTitleEditor,
                            };
                            const newList = (caseList || []).slice();
                            newList.push(created);
                            setCaseList(newList);
                            setSelectedIndex(newList.length - 1);
                            setCaseData(created);
                            setIsCreating(false);
                            setIsEditing(false);
                          } else {
                            res = await fetch(`${API_BASE}/case-studies/${caseData.slug}`, {
                              method: "PUT",
                              headers,
                              body: JSON.stringify(payload),
                            });
                            if (!res.ok) {
                              const txt = await res.text();
                              throw new Error("Save failed: " + res.status + " " + txt);
                            }
                            const result = await res.json().catch(() => ({}));
                            setCaseData((previous) => ({ ...previous, title: titleEditor, content: JSON.parse(contentPayload), solutionContent: JSON.parse(solutionPayload), solutionTitle: solutionTitleEditor, slug: result.slug || previous.slug }));
                            setCaseList((previousList) => previousList.map((it, index) => (index === selectedIndex ? { ...it, title: titleEditor, slug: result.slug || it.slug } : it)));
                            setIsEditing(false);
                          }
                        } catch (error) {
                          alert(error.message || "Save failed");
                        } finally {
                          setSaving(false);
                        }
                    }}
                  >
                    Save
                  </button>
                  <button className="px-4 py-2 rounded border" onClick={() => setIsEditing(false)} disabled={saving}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              !loading &&
              caseData && (
                <div>
                  {adminToken && (
                    <div className="mb-4 w-full">
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <button
                          className="bg-indigo-600 text-white px-4 py-2 rounded w-full sm:w-auto"
                          onClick={() => {
                            setIsCreating(true);
                            setTitleEditor("");
                            setSolutionTitleEditor("");
                            setContentEditor("");
                            setSolutionEditor("");
                            setEditingBlocks([
                              { _id: genId(), type: "image", src: "", alt: "", _autoAlt: true },
                              { _id: genId(), type: "paragraph", text: "" },
                            ]);
                            setEditingSolutionBlocks([
                              { _id: genId(), type: "image", src: "", alt: "", _autoAlt: true },
                              { _id: genId(), type: "paragraph", text: "" },
                            ]);
                            setIsEditing(true);
                          }}
                        >
                          Add New Study Case
                        </button>
                        <button
                          className="bg-white border px-4 py-2 rounded w-full sm:w-auto"
                          onClick={() => {
                            if (!caseData) return;
                            try {
                              setContentEditor(blocksToPlainText(caseData.content));
                            } catch (error) {
                              setContentEditor(caseData.content || "");
                            }
                            try {
                              setSolutionEditor(blocksToPlainText(caseData.solutionContent));
                            } catch (error) {
                              setSolutionEditor(caseData.solutionContent || "");
                            }

                            try {
                              const array = Array.isArray(caseData.content) ? caseData.content : typeof caseData.content === "string" ? JSON.parse(caseData.content || "[]") : [];
                              setEditingBlocks(array.map((block) => ({ ...block, _id: block._id || genId() })));
                            } catch (error) {
                              setEditingBlocks(null);
                            }

                            try {
                              const sArr = Array.isArray(caseData.solutionContent) ? caseData.solutionContent : typeof caseData.solutionContent === "string" ? JSON.parse(caseData.solutionContent || "[]") : [];
                              setEditingSolutionBlocks(sArr.map((block) => ({ ...block, _id: block._id || genId() })));
                            } catch (error) {
                              setEditingSolutionBlocks(null);
                            }
                            setTitleEditor(caseData.title || "");
                            setSolutionTitleEditor(caseData.solutionTitle || "");
                            setIsCreating(false);
                            setIsEditing(true);
                          }}
                        >
                          Edit Study Case
                        </button>
                      </div>
                    </div>
                  )}
                  <div>
                    {caseData.title && <h2 className="text-3xl font-bold mb-6">{caseData.title}</h2>}
                  </div>
                  {(Array.isArray(caseData.content) ? caseData.content : [caseData.content]).map((block, i) => renderBlock(block, i))}
                </div>
              )
            )}
          </div>
          <aside className="md:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{caseData && caseData.solutionTitle ? caseData.solutionTitle : ""}</h3>
              </div>

              <div className="text-sm text-[#606060] mt-4">
                {!isEditing && (caseData && caseData.solutionContent ? (Array.isArray(caseData.solutionContent) ? caseData.solutionContent : [caseData.solutionContent]).map((block, i) => renderBlock(block, i)) : <p>Solution text here</p>)}

                {isEditing && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Solution Title</label>
                      <input value={solutionTitleEditor} onChange={(event) => setSolutionTitleEditor(event.target.value)} className="w-full p-2 border rounded" />
                    </div>

                    {editingSolutionBlocks && Array.isArray(editingSolutionBlocks) ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Solution blocks</label>
                        <div className="space-y-3">
                          {editingSolutionBlocks.map((block, studyIndex) => (
                            <div key={block._id || studyIndex} className="border rounded p-2">
                              <div className="mb-1 text-sm text-gray-600">
                                Block #{studyIndex + 1} — <span className="font-mono">{block.type}</span>
                              </div>
                              {block.type === "paragraph" && (
                                <textarea
                                  value={block.text || ""}
                                  onChange={(event) => {
                                    const id = block._id;
                                    const val = event.target.value;
                                    setEditingSolutionBlocks((previous) => {
                                      const array = (previous || []).slice();
                                      const index = array.findIndex((block) => block._id === id);
                                      if (index === -1) return previous;
                                      array[index] = { ...array[index], text: val };
                                      return array;
                                    });
                                  }}
                                  rows={3}
                                  className="w-full p-2 border rounded text-sm font-mono"
                                />
                              )}
                              {block.type === "image" && (
                                <div>
                                  <label className="text-xs text-gray-600">Replace image (upload)</label>
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
                                          if (titleEditor && titleEditor.trim()) alt = `${titleEditor} image`;
                                          else alt = (file.name || "").replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
                                          setEditingSolutionBlocks((previous) => {
                                            const array = (previous || []).slice();
                                            const index = array.findIndex((block) => block._id === id);
                                            if (index === -1) return previous;
                                            array[index] = { ...array[index], _file: file, src: preview, alt, _autoAlt: true };
                                            return array;
                                          });
                                        } catch (error) {
                                          let alt = "";
                                          if (titleEditor && titleEditor.trim()) alt = `${titleEditor} image`;
                                          else alt = (file.name || "").replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
                                          setEditingSolutionBlocks((previous) => {
                                            const array = (previous || []).slice();
                                            const index = array.findIndex((block) => block._id === id);
                                            if (index === -1) return previous;
                                            array[index] = { ...array[index], _file: file, alt, _autoAlt: true };
                                            return array;
                                          });
                                        }
                                      }}
                                  />
                                  <label className="text-xs text-gray-600 mt-2 block">Or image URL</label>
                                  <input
                                    value={block.src || block.url || ""}
                                    onChange={(event) => {
                                      const val = event.target.value || "";
                                      const id = block._id;
                                      let alt = "";
                                      if (titleEditor && titleEditor.trim()) alt = `${titleEditor} image`;
                                      else {
                                        try {
                                          const p = val.split("?")[0].split("#")[0];
                                          const parts = p.split('/');
                                          let fileName = parts[parts.length - 1] || p;
                                          fileName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
                                          alt = fileName;
                                        } catch (error) {
                                          alt = "";
                                        }
                                      }
                                      setEditingSolutionBlocks((previous) => {
                                        const array = (previous || []).slice();
                                        const index = array.findIndex((block) => block._id === id);
                                        if (index === -1) return previous;
                                        array[index] = { ...array[index], src: val, url: undefined, alt, _autoAlt: true };
                                        return array;
                                      });
                                    }}
                                    className="w-full p-2 border rounded text-sm"
                                  />
                                  <label className="text-xs text-gray-600 mt-2 block">Alt text</label>
                                  <input
                                    value={block.alt || ""}
                                    onChange={(event) => {
                                      const id = block._id;
                                      const val = event.target.value;
                                      setEditingSolutionBlocks((previous) => {
                                        const array = (previous || []).slice();
                                        const index = array.findIndex((block) => block._id === id);
                                        if (index === -1) return previous;
                                        array[index] = { ...array[index], alt: val, _autoAlt: false };
                                        return array;
                                      });
                                    }}
                                    className="w-full p-2 border rounded text-sm"
                                  />
                                  <div className="mt-2">{block.src || block.url ? <img src={block.src || block.url} alt={block.alt || ""} className="object-contain w-full h-28" /> : <div className="text-sm text-gray-400">No image</div>}</div>
                                </div>
                              )}
                              {block.type !== "paragraph" && block.type !== "image" && (
                                <textarea
                                  value={JSON.stringify(block, null, 2)}
                                  onChange={(event) => {
                                    try {
                                      const parsed = JSON.parse(event.target.value);
                                      const copy = editingSolutionBlocks.slice();
                                      copy[studyIndex] = parsed;
                                      setEditingSolutionBlocks(copy);
                                    } catch (error) {
                                      const copy = editingSolutionBlocks.slice();
                                      copy[studyIndex] = { ...copy[studyIndex], _raw: event.target.value };
                                      setEditingSolutionBlocks(copy);
                                    }
                                  }}
                                  rows={3}
                                  className="w-full p-2 border rounded text-sm font-mono"
                                />
                              )}

                              <div className="mt-2 flex gap-2">
                                <button
                                  className="px-2 py-1 rounded border text-sm"
                                  onClick={() => {
                                    const id = block._id;
                                    setEditingSolutionBlocks((previous) => {
                                      const array = (previous || []).slice();
                                      const index = array.findIndex((block) => block._id === id);
                                      if (index <= 0) return previous;
                                      const temporary = array[index - 1];
                                      array[index - 1] = array[index];
                                      array[index] = temporary;
                                      return array;
                                    });
                                  }}
                                  disabled={studyIndex === 0}
                                >
                                  Move up
                                </button>
                                <button
                                  className="px-2 py-1 rounded border text-sm"
                                  onClick={() => {
                                    const id = block._id;
                                    setEditingSolutionBlocks((previous) => {
                                      const array = (previous || []).slice();
                                      const index = array.findIndex((block) => block._id === id);
                                      if (index === -1 || index >= array.length - 1) return previous;
                                      const temporary = array[index + 1];
                                      array[index + 1] = array[index];
                                      array[index] = temporary;
                                      return array;
                                    });
                                  }}
                                  disabled={studyIndex >= (editingSolutionBlocks ? editingSolutionBlocks.length - 1 : 0)}
                                >
                                  Move down
                                </button>
                                    <button
                                      className="px-2 py-1 rounded border text-sm"
                                      onClick={() => {
                                        const id = editingSolutionBlocks && editingSolutionBlocks[studyIndex] && editingSolutionBlocks[studyIndex]._id;
                                        if (!id) {
                                          setEditingSolutionBlocks((previous) => {
                                            const copy = (previous || []).slice();
                                            copy.splice(studyIndex, 1);
                                            return copy;
                                          });
                                          return;
                                        }
                                        setEditingSolutionBlocks((previous) => (previous || []).filter((block) => block._id !== id));
                                      }}
                                    >
                                      Remove block
                                    </button>
                              </div>
                            </div>
                          ))}
                          <div className="flex gap-2 mt-2">
                            <button
                              className="bg-indigo-600 text-white px-3 py-1 rounded"
                              onClick={() => {
                                const copy = (editingSolutionBlocks || []).slice();
                                copy.push({ _id: genId(), type: "paragraph", text: "" });
                                setEditingSolutionBlocks(copy);
                              }}
                            >
                              Add paragraph
                            </button>
                            <button
                              className="bg-white border px-3 py-1 rounded"
                              onClick={() => {
                                setEditingSolutionBlocks((previous) => {
                                  const array = (previous || []).slice();
                                  array.push({ _id: genId(), type: "image", src: "", alt: "", _autoAlt: true });
                                  return array;
                                });
                              }}
                            >
                              Add image
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Solution</label>
                        <textarea value={solutionEditor} onChange={(event) => setSolutionEditor(event.target.value)} rows={12} className="w-full p-2 border rounded text-sm font-mono" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
        <div className="md:col-span-3 mt-8">
          {caseList && caseList.length > 0 && (
            <div className="flex gap-4 overflow-x-auto overflow-y-visible py-2 ml-0">
              {caseList.map((caseStudy, study) => (
                <button
                  key={caseStudy.slug}
                  onClick={
                    isEditing
                      ? undefined
                      : () => {
                          setSelectedIndex(study);
                        }
                  }
                  disabled={isEditing}
                  aria-disabled={isEditing}
                  className={`flex-none w-20 text-center p-1 rounded relative ring-offset-6 ring-offset-white ${selectedIndex === study ? "z-50" : "opacity-80 hover:opacity-100"} ${isEditing ? "cursor-not-allowed opacity-50" : ""}`}
                  aria-pressed={selectedIndex === study}
                >
                  <div className={`w-full h-20 rounded overflow-hidden flex items-center justify-center ${selectedIndex === study ? "bg-[#0471AB]" : "bg-gray-100"}`}>
                    <div className={`text-2xl font-bold ${selectedIndex === study ? "text-white" : "text-gray-700"}`}>{study + 1}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-block"></div>

      <GetAdvice />

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-block"></div>

      <Features />

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-block"></div>

      <ContactCase />

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-block"></div>
    </div>
  );
}

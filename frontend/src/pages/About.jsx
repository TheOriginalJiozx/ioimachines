import { useEffect, useState } from "react";
import { useAppState } from "../state/AppState";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";
import { genId, blocksToPlainText } from "../lib/blocks.jsx";


  function renderBlockAbout(block, index) {
    if (!block) return null;
    switch (block.type) {
      case "paragraph":
        {
          const text = block.text || "";
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
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </div>
              );
            }
          }
          return (
            <p key={index} className="text-[15px] text-[#444444] leading-relaxed mb-4">
              {block.text}
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
        return (
          <ul key={index} className={`list-${block.style || "disc"} pl-5 text-[15px] text-[#444444] mb-4`}>
            {(block.items || []).map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        );
      default:
        return <div key={index} dangerouslySetInnerHTML={{ __html: block.html || "" }} />;
    }
  }


  function renderBlockMission(block, index) {
    if (!block) return null;
    switch (block.type) {
      case "paragraph":
        {
          const text = block.text || "";
          const m = text.match(/^(.*?:)\s*(.+)$/);
          if (m) {
            const prefix = m[1];
            const rest = m[2];
            const items = rest.split(/\s*;\s*/).map((s) => s.trim()).filter(Boolean);
            if (items.length > 1) {
              return (
                <div key={index} className="mb-4">
                  <p className="text-lg text-[#444444] leading-relaxed mb-2">{prefix}</p>
                  <ul className="list-disc pl-6 text-lg text-[#444444] mb-4">
                    {items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </div>
              );
            }
          }
          return (
            <p key={index} className="text-lg text-[#444444] leading-relaxed mb-4">
              {block.text}
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
        return (
          <ul key={index} className={`list-${block.style || "disc"} pl-5 text-lg text-[#444444] mb-4`}>
            {(block.items || []).map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        );
      default:
        return <div key={index} dangerouslySetInnerHTML={{ __html: block.html || "" }} />;
    }
  }

export default function About() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("About Us");
    }
  }, []);

  const { adminToken } = useAppState();

  const [mission, setMission] = useState(null);
  const [why, setWhy] = useState(null);

  const [editingMission, setEditingMission] = useState(false);
  const [editingWhy, setEditingWhy] = useState(false);

  const [missionTitle, setMissionTitle] = useState("");
  const [whyTitle, setWhyTitle] = useState("");

  const [missionBlocks, setMissionBlocks] = useState(null);
  const [whyBlocks, setWhyBlocks] = useState(null);

  const [missionContentEditor, setMissionContentEditor] = useState("");
  const [whyContentEditor, setWhyContentEditor] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || "https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net/api";
        const mRes = await fetch(`${API_BASE}/sections/about-mission`).catch(() => null);
        const wRes = await fetch(`${API_BASE}/sections/about-why`).catch(() => null);
        const mJson = mRes && mRes.ok ? await mRes.json().catch(() => null) : null;
        const wJson = wRes && wRes.ok ? await wRes.json().catch(() => null) : null;

        const parseContent = (row) => {
          if (!row) return null;
          try {
            const parsed = row.content ? JSON.parse(row.content) : null;
            return { ...row, parsedContent: parsed };
          } catch (error) {
            return { ...row, parsedContent: null };
          }
        };

        const mParsed = parseContent(mJson);
        const wParsed = parseContent(wJson);

        setMission(mParsed);
        setWhy(wParsed);
      } catch (error) {
        console.error("Failed to load about sections", error);
      }
    }
    load();
  }, []);

  async function saveSection(key, title, blocks, setEditing, setState) {
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
              formData.append('file', b._file);
              const upHeaders = {};
              if (adminToken) upHeaders['Authorization'] = 'Bearer ' + adminToken;
              const upRes = await fetch(`${API_BASE}/uploads`, { method: 'POST', body: formData, headers: upHeaders });
              if (!upRes.ok) throw new Error('upload failed');
              const upJson = await upRes.json();
              const url = upJson.url || upJson.path || '';
              blocksCopy[i] = { ...blocksCopy[i], src: url };
              delete blocksCopy[i]._file;
            } catch (error) {
              console.error('upload failed', error);
              alert('Image upload failed: ' + (error.message || error));
            }
          }
        }
      }

      const payload = { title: title, content: JSON.stringify({ intro: blocksCopy || [] }) };
      const res = await fetch(`${API_BASE}/sections/${key}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('save failed');
      setState((prev) => ({ ...(prev || {}), title: title, content: JSON.stringify({ intro: blocksCopy || [] }), parsedContent: { intro: blocksCopy || [] } }));
      setEditing(false);
    } catch (error) {
      alert('Save failed: ' + (error.message || error));
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#444444] font-sans" aria-label="About page">
      <section className="relative w-full" aria-label="About hero">
        <div className="w-full h-80 sm:h-96 md:h-[34rem] bg-gray-100 overflow-hidden">
          <img src="/about_us1.jpg" alt="hero" className="object-cover w-full h-full" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full flex items-center">
            <div className="lg:pl-0 -mt-80">
              <h1 className="lg:text-[48px] text-3xl font-extrabold text-white uppercase" style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.50))" }}>
                About Us
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-white" aria-label="Our Mission section">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className={"text-center " + (editingMission ? "max-w-6xl" : "max-w-3xl") + " mx-auto"}>
            {editingMission ? (
              <div className={"editing-feasibility"}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input value={missionTitle} onChange={(event) => setMissionTitle(event.target.value)} className="w-full p-2 border rounded" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  {missionBlocks && Array.isArray(missionBlocks) ? (
                    <div className="space-y-4">
                      {missionBlocks.map((block, index) => (
                        <div key={block._id || index} className="border rounded p-3">
                          <div className="mb-2 text-sm text-gray-600">Block #{index + 1} — <span className="font-mono">{block.type}</span></div>
                          {block.type === 'paragraph' && (
                            <>
                              <textarea value={block.text || ''} onChange={(event) => {
                                const id = block._id;
                                const val = event.target.value;
                                setMissionBlocks((previous) => {
                                  const array = (previous || []).slice();
                                  const idx = array.findIndex((b) => b._id === id);
                                  if (idx === -1) return previous;
                                  array[idx] = { ...array[idx], text: val };
                                  return array;
                                });
                              }} rows={4} className="w-full p-2 border rounded text-sm font-mono" />
                              <div className="mt-2 flex gap-2">
                                <button className="px-2 py-1 rounded border text-sm" onClick={() => {
                                  const id = block._id;
                                  setMissionBlocks((previous) => {
                                    const array = (previous || []).slice();
                                    const idx = array.findIndex((b) => b._id === id);
                                    if (idx <= 0) return previous;
                                    const tmp = array[idx-1]; array[idx-1] = array[idx]; array[idx] = tmp;
                                    return array;
                                  });
                                }} disabled={index === 0}>Move up</button>
                                <button className="px-2 py-1 rounded border text-sm" onClick={() => {
                                  const id = block._id;
                                  setMissionBlocks((previous) => {
                                    const array = (previous || []).slice();
                                    const idx = array.findIndex((b) => b._id === id);
                                    if (idx === -1 || idx >= array.length - 1) return previous;
                                    const tmp = array[idx+1]; array[idx+1] = array[idx]; array[idx] = tmp;
                                    return array;
                                  });
                                }} disabled={index >= (missionBlocks ? missionBlocks.length - 1 : 0)}>Move down</button>
                                <button className="px-2 py-1 rounded border text-sm" onClick={() => {
                                  const id = missionBlocks && missionBlocks[index] && missionBlocks[index]._id;
                                  if (!id) { setMissionBlocks((previous) => { const c=(previous||[]).slice(); c.splice(index,1); return c; }); return; }
                                  setMissionBlocks((previous) => (previous||[]).filter((b) => b._id !== id));
                                }}>Remove block</button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <button className="bg-indigo-600 text-white px-3 py-1 rounded" onClick={()=>{ const copy=(missionBlocks||[]).slice(); copy.push({_id:genId(), type:'paragraph', text:''}); setMissionBlocks(copy); }}>Add paragraph</button>
                      </div>
                    </div>
                  ) : (
                    <textarea value={missionContentEditor} onChange={(event) =>setMissionContentEditor(event.target.value)} rows={6} className="w-full px-4 py-2 border rounded" />
                  )}
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => { setEditingMission(false); }} className="px-4 py-2 rounded border">Cancel</button>
                  <button onClick={() => saveSection(missionTitle, missionBlocks || (missionContentEditor ? [{ _id: genId(), type: 'paragraph', text: missionContentEditor }] : []), setEditingMission, setMission)} className="px-4 py-2 rounded bg-[#444444] text-white">Save</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-[34px] font-semibold text-[#222222]">{mission?.title}</h2>
                <div className="mt-4 text-lg leading-relaxed">
                  {(() => {
                    const blocksSource = (mission?.parsedContent && Array.isArray(mission.parsedContent.intro)) ? mission.parsedContent.intro : null;
                    if (blocksSource) return (blocksSource || []).map((b, i) => renderBlockMission(b, i));
                    return <p>{mission?.content}</p>;
                  })()}
                </div>
                {adminToken && <div className="mt-4"><button onClick={() => {
                  setMissionTitle(mission?.title);
                  const parsed = mission?.parsedContent || (mission && mission.content ? (() => { try { return JSON.parse(mission.content) } catch (error){ return null } })() : null);
                  if (parsed && parsed.intro) {
                    let arr = Array.isArray(parsed.intro) ? parsed.intro.map((b) => ({ ...b, _id: b._id || genId() })) : (typeof parsed.intro === 'string' ? [{ _id: genId(), type: 'paragraph', text: parsed.intro }] : []);
                    if (!arr.some((b) => b && b.type === 'paragraph')) arr.push({ _id: genId(), type: 'paragraph', text: '' });
                    setMissionBlocks(arr);
                    setMissionContentEditor(blocksToPlainText(arr));
                  } else if (mission && mission.content) {
                    try {
                      const maybe = JSON.parse(mission.content);
                      let arr = Array.isArray(maybe) ? maybe.map((b) => ({ ...b, _id: b._id || genId() })) : (typeof maybe === 'string' ? [{ _id: genId(), type: 'paragraph', text: maybe }] : []);
                      if (!arr.some((b) => b && b.type === 'paragraph')) arr.push({ _id: genId(), type: 'paragraph', text: '' });
                      setMissionBlocks(arr);
                      setMissionContentEditor(blocksToPlainText(arr));
                    } catch (error) {
                      const arr = [{ _id: genId(), type: 'paragraph', text: mission.content || '' }];
                      setMissionBlocks(arr);
                      setMissionContentEditor(blocksToPlainText(arr));
                    }
                  } else {
                    setMissionBlocks([{ _id: genId(), type: 'paragraph', text: '' }]);
                    setMissionContentEditor("");
                  }
                  setEditingMission(true);
                }} className="px-3 py-1 rounded border">Edit</button></div>}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white" aria-label="Why Choose Us section">
          <div className="max-w-6xl mx-auto px-6 py-16">
          <div className={`grid md:grid-cols-2 gap-12 items-center ${editingWhy ? 'md:grid-cols-3' : ''}`}>
            <div>
              {(() => {
                const blocksSource = (why?.parsedContent && Array.isArray(why.parsedContent.intro)) ? why.parsedContent.intro : null;
                if (editingWhy) {
                  return <div className="w-full md:h-[28rem]"></div>;
                }
                  if (blocksSource) {
                    const imgIndex = blocksSource.findIndex((b) => b && b.type === 'image');
                    if (imgIndex !== -1) return renderBlockAbout(blocksSource[imgIndex], imgIndex);
                  }
                return <img src="/about_us2.jpg" alt="contact" className="w-full md:h-[28rem] object-cover rounded shadow" />;
              })()}
            </div>
            <div className={editingWhy ? 'editor-column editing-feasibility md:col-span-2' : ''}>
              {editingWhy ? (
                <div className="mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input value={whyTitle} onChange={(event) => setWhyTitle(event.target.value)} className="w-full p-2 border rounded" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    {whyBlocks && Array.isArray(whyBlocks) ? (
                      <div className="space-y-4">
                        {whyBlocks.map((block, index) => (
                          <div key={block._id || index} className="border rounded p-3">
                            <div className="mb-2 text-sm text-gray-600">Block #{index + 1} — <span className="font-mono">{block.type}</span></div>
                            {block.type === 'paragraph' && (
                              <>
                                <textarea value={block.text || ''} onChange={(event) => {
                                  const id = block._id;
                                  const val = event.target.value;
                                  setWhyBlocks((previous) => {
                                    const array = (previous || []).slice();
                                    const idx = array.findIndex((b) => b._id === id);
                                    if (idx === -1) return previous;
                                    array[idx] = { ...array[idx], text: val };
                                    return array;
                                  });
                                }} rows={4} className="w-full p-2 border rounded text-sm font-mono" />
                                <div className="mt-2 flex gap-2">
                                  <button className="px-2 py-1 rounded border text-sm" onClick={() => {
                                    const id = block._id;
                                    setWhyBlocks((previous) => {
                                      const array = (previous || []).slice();
                                      const idx = array.findIndex((b) => b._id === id);
                                      if (idx <= 0) return previous;
                                      const tmp = array[idx-1]; array[idx-1] = array[idx]; array[idx] = tmp;
                                      return array;
                                    });
                                  }} disabled={index === 0}>Move up</button>
                                  <button className="px-2 py-1 rounded border text-sm" onClick={() => {
                                    const id = block._id;
                                    setWhyBlocks((previous) => {
                                      const array = (previous || []).slice();
                                      const idx = array.findIndex((b) => b._id === id);
                                      if (idx === -1 || idx >= array.length - 1) return previous;
                                      const tmp = array[idx+1]; array[idx+1] = array[idx]; array[idx] = tmp;
                                      return array;
                                    });
                                  }} disabled={index >= (whyBlocks ? whyBlocks.length - 1 : 0)}>Move down</button>
                                  <button className="px-2 py-1 rounded border text-sm" onClick={() => {
                                    const id = whyBlocks && whyBlocks[index] && whyBlocks[index]._id;
                                    if (!id) { setWhyBlocks((previous) => { const c=(previous||[]).slice(); c.splice(index,1); return c; }); return; }
                                    setWhyBlocks((previous) => (previous||[]).filter((b) => b._id !== id));
                                  }}>Remove block</button>
                                </div>
                              </>
                            )}
                            {block.type === 'image' && (
                              <div className="grid grid-cols-1 gap-2">
                                <label className="text-xs text-gray-600">Replace image (upload)</label>
                                <div className="flex items-center gap-2">
                                  <label className="bg-white border px-3 py-1 rounded text-sm cursor-pointer">
                                    Choose image
                                    <input type="file" accept="image/*" onChange={(event) => {
                                      const file = event.target.files && event.target.files[0];
                                      if (!file) return;
                                      const id = block._id;
                                      try {
                                        const preview = URL.createObjectURL(file);
                                        let alt = '';
                                        if (whyTitle && whyTitle.trim()) alt = `${whyTitle} image`;
                                        else { try { const name = (file.name||''); alt = name.replace(/\.[^/.]+$/,'').replace(/[-_]+/g,' '); } catch (error){ alt = '' } }
                                        setWhyBlocks((prev) => {
                                          const copy = (prev||[]).slice();
                                          const idx = copy.findIndex((b) => b._id === id);
                                          if (idx === -1) return prev;
                                          copy[idx] = { ...copy[idx], _file: file, src: preview, alt, _autoAlt: true };
                                          return copy;
                                        });
                                      } catch (error) {
                                        let alt = '';
                                        if (whyTitle && whyTitle.trim()) alt = `${whyTitle} image`;
                                        setWhyBlocks((prev) => {
                                          const copy = (prev||[]).slice();
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
                                <input value={block.src || block.url || ''} onChange={(event) => {
                                  const val = event.target.value||'';
                                  const copy = (whyBlocks||[]).slice();
                                  let alt = '';
                                  if (whyTitle && whyTitle.trim()) alt = `${whyTitle} image`;
                                  else { try { const p = val.split('?')[0].split('#')[0]; const parts = p.split('/'); let fileName = parts[parts.length-1]||p; fileName = fileName.replace(/\.[^/.]+$/,'').replace(/[-_]+/g,' '); alt = fileName;} catch (error){alt=''} }
                                  copy[index] = { ...copy[index], src: val, url: undefined, alt, _autoAlt: true };
                                  setWhyBlocks(copy);
                                }} className="w-full p-2 border rounded text-sm" />
                                <label className="text-xs text-gray-600">Alt text</label>
                                <input value={block.alt||''} onChange={(event) =>{ const copy=(whyBlocks||[]).slice(); copy[index]={...copy[index], alt:event.target.value, _autoAlt:false}; setWhyBlocks(copy);}} className="w-full p-2 border rounded text-sm" />
                                <div className="mt-2">{block.src||block.url ? <img src={block.src||block.url} alt={block.alt||''} className="object-contain w-full h-36" /> : <div className="text-sm text-gray-400">No image</div>}</div>
                                <div className="mt-2">
                                  <button className="px-2 py-1 rounded border text-sm" onClick={() => {
                                    const id = block._id;
                                    setWhyBlocks((previous) => (previous || []).filter((b) => b._id !== id));
                                  }}>Remove block</button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <button className="bg-indigo-600 text-white px-3 py-1 rounded" onClick={()=>{ const copy=(whyBlocks||[]).slice(); copy.push({_id:genId(), type:'paragraph', text:''}); setWhyBlocks(copy); }}>Add paragraph</button>
                          <button className="bg-white border px-3 py-1 rounded" onClick={()=>{ const copy=(whyBlocks||[]).slice(); copy.push({_id:genId(), type:'image', src:'', alt:'', _autoAlt:true}); setWhyBlocks(copy); }}>Add image</button>
                        </div>
                      </div>
                    ) : (
                      <textarea value={whyContentEditor} onChange={(event) =>setWhyContentEditor(event.target.value)} rows={6} className="w-full px-4 py-2 border rounded" />
                    )}
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button onClick={() => setEditingWhy(false)} className="px-4 py-2 rounded border">Cancel</button>
                    <button onClick={() => saveSection('about-why', whyTitle || 'Why Choose Us', whyBlocks || (whyContentEditor ? [{ _id: genId(), type: 'paragraph', text: whyContentEditor }] : []), setEditingWhy, setWhy)} className="px-4 py-2 rounded bg-[#444444] text-white">Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-[34px] font-semibold text-[#222222]">{why?.title}</h2>
                  <div className="mt-4 text-[15px] leading-relaxed">
                    {(() => {
                        const blocksSource = (why?.parsedContent && Array.isArray(why.parsedContent.intro)) ? why.parsedContent.intro : null;
                        if (blocksSource) {
                          const imgIndex = blocksSource.findIndex((b) => b && b.type === 'image');
                          return (blocksSource || []).map((b, i) => {
                            if (i === imgIndex) return null;
                            return renderBlockAbout(b, i);
                          });
                        }
                        return <p>{why?.content}</p>;
                      })()}
                  </div>
                  {adminToken && <div className="mt-4"><button onClick={() => {
                    setWhyTitle(why?.title);
                    const parsed = why?.parsedContent || (why && why.content ? (() => { try { return JSON.parse(why.content) } catch (error){ return null } })() : null);
                    if (parsed && parsed.intro) {
                      let arr = Array.isArray(parsed.intro) ? parsed.intro.map((b) => ({ ...b, _id: b._id || genId() })) : (typeof parsed.intro === 'string' ? [{ _id: genId(), type: 'paragraph', text: parsed.intro }] : []);
                      if (!arr.some((b) => b && b.type === 'paragraph')) arr.push({ _id: genId(), type: 'paragraph', text: '' });
                      setWhyBlocks(arr);
                      setWhyContentEditor(blocksToPlainText(arr));
                    } else if (why && why.content) {
                      try {
                        const maybe = JSON.parse(why.content);
                        let arr = Array.isArray(maybe) ? maybe.map((b) => ({ ...b, _id: b._id || genId() })) : (typeof maybe === 'string' ? [{ _id: genId(), type: 'paragraph', text: maybe }] : []);
                        if (!arr.some((b) => b && b.type === 'paragraph')) arr.push({ _id: genId(), type: 'paragraph', text: '' });
                        setWhyBlocks(arr);
                        setWhyContentEditor(blocksToPlainText(arr));
                      } catch (error) {
                        const arr = [{ _id: genId(), type: 'paragraph', text: why.content || '' }];
                        setWhyBlocks(arr);
                        setWhyContentEditor(blocksToPlainText(arr));
                      }
                    } else {
                      setWhyBlocks([{ _id: genId(), type: 'paragraph', text: '' }]);
                      setWhyContentEditor("");
                    }
                    setEditingWhy(true);
                  }} className="px-3 py-1 rounded border">Edit</button></div>}
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

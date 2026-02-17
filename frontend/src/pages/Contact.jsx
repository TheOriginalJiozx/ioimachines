import { useEffect } from "react";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";
import RequestConsultation from "../components/RequestConsultation";
import { useState } from "react";
import { useAppState } from "../state/AppState";
import { genId, blocksToPlainText, renderBlock } from "../lib/blocks.jsx";

export default function Contact() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("Contact Us");
    }
  }, []);

  const [section, setSection] = useState(null);
  const { adminToken } = useAppState();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editTiming, setEditTiming] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editingBlocks, setEditingBlocks] = useState(null);
  const [contentEditor, setContentEditor] = useState("");

  useEffect(() => {
    async function loadSection() {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || "https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net/api";
        const res = await fetch(`${API_BASE}/sections/contact`).catch(() => null);
        const json = res && res.ok ? await res.json().catch(() => null) : null;
        let parsed = null;
        try { parsed = json && json.content ? JSON.parse(json.content) : null; } catch (error) { parsed = null; }
        setSection({ ...json, parsedContent: parsed });

        try {
          const a = json && json.address ? (function(){ try { return JSON.parse(json.address) } catch (error){ return json.address } })() : null;
          setEditAddress(a || 'Hvidovrevej 44<br/>2610 Rødovre<br/>Denmark');
        } catch (error) { setEditAddress('Hvidovrevej 44<br/>2610 Rødovre<br/>Denmark'); }
        try {
          const m = json && json.email ? (function(){ try { return JSON.parse(json.email) } catch (error){ return json.email } })() : null;
          setEditEmail(m || 'mc@ioimachines.com');
        } catch (error) { setEditEmail('mc@ioimachines.com'); }
        try {
          const t = json && json.timing ? (function(){ try { return JSON.parse(json.timing) } catch (error){ return json.timing } })() : null;
          setEditTiming(t || 'Monday - Friday: 8 AM - 10 PM<br/>Saturday: 8 AM - 12 PM<br/>Sunday: 8 AM - 12 PM');
        } catch (error) { setEditTiming('Monday - Friday: 8 AM - 10 PM<br/>Saturday: 8 AM - 12 PM<br/>Sunday: 8 AM - 12 PM'); }
        try {
          const p = json && json.phone ? (function(){ try { return JSON.parse(json.phone) } catch (error){ return json.phone } })() : null;
          setEditPhone(p || '(+45) 30 32 89 64');
        } catch (error) { setEditPhone('(+45) 30 32 89 64'); }
      } catch (error) {
        alert("Failed to load content: " + error.message);
      }
    }
    loadSection();
  }, []);

  async function saveSection() {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net/api";
      const headers = { "Content-Type": "application/json" };
      if (adminToken) headers["Authorization"] = "Bearer " + adminToken;


      let blocks = null;
      if (editingBlocks && Array.isArray(editingBlocks)) {

        const API_BASE = import.meta.env.VITE_API_BASE || "https://ioimachines-cqbjftddhcfphebp.canadacentral-01.azurewebsites.net/api";
        const blocksCopy = editingBlocks.slice();
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

        setEditingBlocks(blocksCopy);
        blocks = blocksCopy;
      } else if (contentEditor && contentEditor.trim()) blocks = [{ _id: genId(), type: 'paragraph', text: contentEditor, contactType: null }];
      else if (contentEditor && contentEditor.trim()) blocks = [{ _id: genId(), type: 'paragraph', text: contentEditor, contactType: null }];

      const introBlocks = (blocks || []).filter((b) => !b.contactType);
      const contentObj = { intro: introBlocks };

      const findContact = (type) => {
        const b = (blocks || []).find((x) => x.contactType === type);
        return b ? b.text : null;
      };

      const addressVal = findContact('address') || editAddress || null;
      const emailVal = findContact('email') || editEmail || null;
      const timingVal = findContact('timing') || editTiming || null;
      const phoneVal = findContact('phone') || editPhone || null;

      const payloadWithContacts = {
        title: editTitle,
        content: JSON.stringify(contentObj),
        email: emailVal,
        phone: phoneVal,
        address: addressVal,
        timing: timingVal
      };

      const mainRes = await fetch(`${API_BASE}/sections/contact`, { method: "PUT", headers, body: JSON.stringify(payloadWithContacts) });
      if (!mainRes.ok) throw new Error("Failed to save contact section");

      setSection((prev) => ({ ...(prev || {}), title: editTitle, content: JSON.stringify(contentObj), parsedContent: contentObj, email: emailVal, phone: phoneVal, address: addressVal, timing: timingVal }));

      setEditing(false);
    } catch (error) {
      alert("Save failed: " + (error.message || error));
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#444444] font-sans" aria-label="Contact page">
      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-white" aria-label="Contact intro section">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className={`grid md:grid-cols-2 gap-12 items-center ${editing ? "md:grid-cols-3" : ""}`}>
            <div className={editing ? "md:col-span-1" : ""}>
              {editing ? (
                <div className="w-full md:h-[28rem]"></div>
              ) : (
                (() => {
                  const blocksSource = (section?.parsedContent && Array.isArray(section.parsedContent.intro))
                    ? section.parsedContent.intro
                    : null;
                  if (blocksSource) {
                    const imgIndex = blocksSource.findIndex((b) => b && b.type === 'image');
                    if (imgIndex !== -1) return renderBlock(blocksSource[imgIndex], imgIndex);
                  }
                })()
              )}
            </div>
            <div className={editing ? "editor-column editing-feasibility md:col-span-2" : "editor-column"}>
              {editing ? (
                <div className="mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} className="w-full p-2 border rounded" />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Intro</label>
                    {editingBlocks && Array.isArray(editingBlocks) ? (
                      <div className="space-y-4">
                        {editingBlocks.map((block, index) => (
                          <div key={block._id || index} className="border rounded p-3">
                            <div className="mb-2 text-sm text-gray-600">Block #{index + 1} — <span className="font-mono">{block.type}</span></div>
                            {block.type === 'paragraph' && (
                              <>
                                <div className="mb-2 flex items-center gap-2">
                                  <label className="text-xs text-gray-600">Contact field</label>
                                  <select value={block.contactType || ''} onChange={(event) => {
                                    const val = event.target.value || null;
                                    const id = block._id;
                                    setEditingBlocks((previous) => {
                                      const array = (previous || []).slice();
                                      const idx = array.findIndex((b) => b._id === id);
                                      if (idx === -1) return previous;
                                      array[idx] = { ...array[idx], contactType: val };
                                      return array;
                                    });
                                  }} className="p-1 border rounded text-sm">
                                    <option value="">— None —</option>
                                    <option value="address">Address</option>
                                    <option value="email">E-mail</option>
                                    <option value="phone">Phone</option>
                                    <option value="timing">Timing</option>
                                  </select>
                                </div>
                                <textarea
                                  value={block.text || ''}
                                  onChange={(event) => {
                                    const id = block._id;
                                    const val = event.target.value;
                                    setEditingBlocks((previous) => {
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
                                    setEditingBlocks((previous) => {
                                      const array = (previous || []).slice();
                                      const idx = array.findIndex((b) => b._id === id);
                                      if (idx <= 0) return previous;
                                      const tmp = array[idx-1]; array[idx-1] = array[idx]; array[idx] = tmp;
                                      return array;
                                    });
                                  }} disabled={index === 0}>Move up</button>
                                  <button className="px-2 py-1 rounded border text-sm" onClick={() => {
                                    const id = block._id;
                                    setEditingBlocks((previous) => {
                                      const array = (previous || []).slice();
                                      const idx = array.findIndex((b) => b._id === id);
                                      if (idx === -1 || idx >= array.length - 1) return previous;
                                      const tmp = array[idx+1]; array[idx+1] = array[idx]; array[idx] = tmp;
                                      return array;
                                    });
                                  }} disabled={index >= (editingBlocks ? editingBlocks.length - 1 : 0)}>Move down</button>
                                  <button className="px-2 py-1 rounded border text-sm" onClick={() => {
                                    const id = editingBlocks && editingBlocks[index] && editingBlocks[index]._id;
                                    if (!id) { setEditingBlocks((previous) => { const c=(previous||[]).slice(); c.splice(index,1); return c; }); return; }
                                    setEditingBlocks((previous) => (previous||[]).filter((b) => b._id !== id));
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
                                    if (editTitle && editTitle.trim()) alt = `${editTitle} image`;
                                    else { try { const name = (file.name||''); alt = name.replace(/\.[^/.]+$/,'').replace(/[-_]+/g,' '); } catch (error){ alt = '' } }
                                    setEditingBlocks((prev) => {
                                      const copy = (prev||[]).slice();
                                      const idx = copy.findIndex((b) => b._id === id);
                                      if (idx === -1) return prev;
                                      copy[idx] = { ...copy[idx], _file: file, src: preview, alt, _autoAlt: true };
                                      return copy;
                                    });
                                  } catch (error) {
                                    let alt = '';
                                    if (editTitle && editTitle.trim()) alt = `${editTitle} image`;
                                    setEditingBlocks((prev) => {
                                      const copy = (prev||[]).slice();
                                      const idx = copy.findIndex((b) => b._id === id);
                                      if (idx === -1) return prev;
                                      copy[idx] = { ...copy[idx], _file: file, alt, _autoAlt: true };
                                      return copy;
                                    });
                                  }
                                    } } className="hidden" />
                                  </label>
                                  <div className="text-sm text-gray-600">or paste URL below</div>
                                </div>
                                <label className="text-xs text-gray-600">Or image URL</label>
                                <input value={block.src || block.url || ''} onChange={(event) => {
                                  const val = event.target.value||'';
                                  const copy = (editingBlocks||[]).slice();
                                  let alt = '';
                                  if (editTitle && editTitle.trim()) alt = `${editTitle} image`;
                                  else { try { const p = val.split('?')[0].split('#')[0]; const parts = p.split('/'); let fileName = parts[parts.length-1]||p; fileName = fileName.replace(/\.[^/.]+$/,'').replace(/[-_]+/g,' '); alt = fileName;} catch (error){alt=''} }
                                  copy[index] = { ...copy[index], src: val, url: undefined, alt, _autoAlt: true };
                                  setEditingBlocks(copy);
                                }} className="w-full p-2 border rounded text-sm" />
                                <label className="text-xs text-gray-600">Alt text</label>
                                <input value={block.alt||''} onChange={(event) =>{ const copy=(editingBlocks||[]).slice(); copy[index]={...copy[index], alt:event.target.value, _autoAlt:false}; setEditingBlocks(copy);}} className="w-full p-2 border rounded text-sm" />
                                <div className="mt-2">{block.src||block.url ? <img src={block.src||block.url} alt={block.alt||''} className="object-contain w-full h-36" /> : <div className="text-sm text-gray-400">No image</div>}</div>
                                <div className="mt-2"><button className="px-2 py-1 rounded border text-sm" onClick={()=>{ const copy=(editingBlocks||[]).slice(); copy.splice(index,1); setEditingBlocks(copy); }}>Remove block</button></div>
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <button className="bg-indigo-600 text-white px-3 py-1 rounded" onClick={()=>{ const copy=(editingBlocks||[]).slice(); copy.push({_id:genId(), type:'paragraph', text:''}); setEditingBlocks(copy); }}>Add paragraph</button>
                          <button className="bg-white border px-3 py-1 rounded" onClick={()=>{ const copy=(editingBlocks||[]).slice(); copy.push({_id:genId(), type:'image', src:'', alt:'', _autoAlt:true}); setEditingBlocks(copy); }}>Add image</button>
                        </div>
                      </div>
                    ) : (
                      <textarea value={contentEditor} onChange={(event) =>setContentEditor(event.target.value)} rows={6} className="w-full px-4 py-2 border rounded" />
                    )}
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button onClick={() => { setEditing(false); }} className="px-4 py-2 rounded border">Cancel</button>
                    <button onClick={saveSection} className="px-4 py-2 rounded bg-[#444444] text-white">Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-[40px] font-semibold text-[#222222]">{section?.title || 'Get in Touch'}</h2>
                  {(() => {

                    const blocksSource = (section?.parsedContent && Array.isArray(section.parsedContent.intro))
                      ? section.parsedContent.intro
                      : null;

                    if (blocksSource) {
                      const imgIndex = blocksSource.findIndex((b) => b && b.type === 'image');
                      return (blocksSource || []).filter((_, idx) => idx !== imgIndex).map((block, i) => renderBlock(block, i));
                    }

                    if (section?.parsedContent && typeof section.parsedContent.intro === 'string') {
                      return (
                        <div className="mt-4 text-[#444444] text-[15px]">
                          <div dangerouslySetInnerHTML={{ __html: section.parsedContent.intro || '' }} />
                        </div>
                      );
                    }

                    return (
                      <p className="mt-4 text-[#444444] text-[15px]" dangerouslySetInnerHTML={{ __html: section?.content || `Thank you for showing interest — let us get in touch.<br/>Fill the consultation form below and we'll contact you shortly to discuss your requirements.` }} />
                    );
                  })()}

                  {(section?.address || section?.email || section?.phone || section?.timing) && (
                    <div className="mt-6 grid md:grid-cols-2 gap-8 text-[#444444] text-[15px]">
                      <div>
                        {section?.address && (
                          <>
                            <h3 className="text-xl font-semibold">Address</h3>
                            <div className="mt-3 text-sm" dangerouslySetInnerHTML={{ __html: (section.address || '') }} />
                          </>
                        )}

                        {section?.email && (
                          <>
                            <h3 className="mt-6 text-xl font-semibold">E-mail</h3>
                            <div className="mt-3 text-sm">
                              <a href={`mailto:${(section.email || '').replace(/^\"|\"$/g, '')}`} className="text-[#444444] underline">{(section.email || '').replace(/^\"|\"$/g, '')}</a>
                            </div>
                          </>
                        )}
                      </div>

                      <div>
                        {section?.timing && (
                          <>
                            <h3 className="text-xl font-semibold">Timing</h3>
                            <div className="mt-3 text-sm" dangerouslySetInnerHTML={{ __html: (section.timing || '') }} />
                          </>
                        )}

                        {section?.phone && (
                          <>
                            <h3 className="mt-6 text-xl font-semibold">Phone</h3>
                            <div className="mt-3 text-sm">{(section.phone || '').replace(/^\"|\"$/g, '')}</div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  {adminToken && (
                    <div className="mt-4">
                      <button onClick={() => {
                          const parsed = section?.parsedContent || (section && section.content ? (() => { try { return JSON.parse(section.content) } catch(error){return null} })() : null);
                          setEditTitle(section?.title || 'Get in Touch');
                          if (parsed && parsed.intro) {
                            if (Array.isArray(parsed.intro)) {
                              setEditingBlocks(parsed.intro.map((b) => ({ ...b, _id: b._id || genId(), contactType: b.contactType || null })));
                              setContentEditor(blocksToPlainText(parsed.intro));
                            } else if (typeof parsed.intro === 'string') {
                              setEditingBlocks([{ _id: genId(), type: 'paragraph', text: parsed.intro, contactType: null }]);
                              setContentEditor(parsed.intro);
                            } else {
                              setEditingBlocks([{ _id: genId(), type: 'paragraph', text: '', contactType: null }]);
                              setContentEditor("");
                            }
                          } else if (section && section.content) {

                            try {
                              const maybe = JSON.parse(section.content);
                              if (Array.isArray(maybe)) {
                                setEditingBlocks(maybe.map((b) => ({ ...b, _id: b._id || genId(), contactType: b.contactType || null })));
                                setContentEditor(blocksToPlainText(maybe));
                              } else if (typeof maybe === 'string') {
                                setEditingBlocks([{ _id: genId(), type: 'paragraph', text: maybe, contactType: null }]);
                                setContentEditor(maybe);
                              } else {
                                setEditingBlocks([{ _id: genId(), type: 'paragraph', text: '', contactType: null }]);
                                setContentEditor("");
                              }

                              if (maybe && typeof maybe === 'object') {
                                if (maybe.address) setEditingBlocks((prev) => (prev || []).concat([{ _id: genId(), type: 'paragraph', text: maybe.address, contactType: 'address' }]));
                                if (maybe.email) setEditingBlocks((prev) => (prev || []).concat([{ _id: genId(), type: 'paragraph', text: maybe.email, contactType: 'email' }]));
                                if (maybe.timing) setEditingBlocks((prev) => (prev || []).concat([{ _id: genId(), type: 'paragraph', text: maybe.timing, contactType: 'timing' }]));
                                if (maybe.phone) setEditingBlocks((prev) => (prev || []).concat([{ _id: genId(), type: 'paragraph', text: maybe.phone, contactType: 'phone' }]));
                              }
                            } catch (error) {
                              setEditingBlocks([{ _id: genId(), type: 'paragraph', text: section.content, contactType: null }]);
                              setContentEditor(section.content || "");
                            }
                          } else {
                            setEditingBlocks([{ _id: genId(), type: 'paragraph', text: '', contactType: null }]);
                            setContentEditor("");
                          }

                          try { const a = section && section.address ? (function(){ try{ return JSON.parse(section.address) }catch (error){return section.address} })() : null; setEditAddress(a || 'Hvidovrevej 44<br/>2610 Rødovre<br/>Denmark'); } catch (error){ setEditAddress('Hvidovrevej 44<br/>2610 Rødovre<br/>Denmark'); }
                          try { const m = section && section.email ? (function(){ try{ return JSON.parse(section.email) }catch (error){return section.email} })() : null; setEditEmail(m || 'mc@ioimachines.com'); } catch (error){ setEditEmail('mc@ioimachines.com'); }
                          try { const t = section && section.timing ? (function(){ try{ return JSON.parse(section.timing) }catch (error){return section.timing} })() : null; setEditTiming(t || 'Monday - Friday: 8 AM - 10 PM<br/>Saturday: 8 AM - 12 PM<br/>Sunday: 8 AM - 12 PM'); } catch (error){ setEditTiming('Monday - Friday: 8 AM - 10 PM<br/>Saturday: 8 AM - 12 PM<br/>Sunday: 8 AM - 12 PM'); }
                          try { const p = section && section.phone ? (function(){ try{ return JSON.parse(section.phone) }catch (error){return section.phone} })() : null; setEditPhone(p || '(+45) 30 32 89 64'); } catch (error){ setEditPhone('(+45) 30 32 89 64'); }

                          setEditingBlocks((prev) => {
                            const arr = (prev || []).slice();
                            const hasType = (type) => arr.some((b) => b.contactType === type);
                            try {
                              if (!hasType('address') && section && section.address) {
                                const val = (function(){ try{ return JSON.parse(section.address) }catch (error){return section.address} })();
                                arr.push({ _id: genId(), type: 'paragraph', text: val, contactType: 'address' });
                              }
                            } catch (error) {}
                            try {
                              if (!hasType('email') && section && section.email) {
                                const val = (function(){ try{ return JSON.parse(section.email) }catch (error){return section.email} })();
                                arr.push({ _id: genId(), type: 'paragraph', text: val, contactType: 'email' });
                              }
                            } catch (error) {}
                            try {
                              if (!hasType('timing') && section && section.timing) {
                                const val = (function(){ try{ return JSON.parse(section.timing) }catch (error){return section.timing} })();
                                arr.push({ _id: genId(), type: 'paragraph', text: val, contactType: 'timing' });
                              }
                            } catch (error) {}
                            try {
                              if (!hasType('phone') && section && section.phone) {
                                const val = (function(){ try{ return JSON.parse(section.phone) }catch (error){return section.phone} })();
                                arr.push({ _id: genId(), type: 'paragraph', text: val, contactType: 'phone' });
                              }
                            } catch (error) {}
                            return arr;
                          });

                          setEditing(true);
                        }} className="px-3 py-2 bg-gray-200 rounded">Edit section</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-[#0471AB]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-extrabold text-center text-white">Request a Consultation</h2>

          <div className="mt-10 flex justify-center">
              <RequestConsultation variant="contact" />
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

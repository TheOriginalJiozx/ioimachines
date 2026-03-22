import { useEffect, useState } from "react";
import HeroEditor from "../components/HeroEditor";
import { useAppState } from "../state/useAppState";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";
import RequestConsultation from "../components/RequestConsultation";
import { genId, blocksToPlainText } from "../lib/blocks.jsx";
import IPCoreBlockEditor, { IPCoreBlockAddButtons } from "../components/IPCoreBlockEditor.jsx";
import { renderBlockIPCore } from "../utils/ipcoreBlockRenderUtils.jsx";
import { handleIPCoreSave, handleIPCoreCancel, saveSection } from "../utils/ipcoreSaveCancelUtils";

export default function IPCoreLicensing() {
    // --- HERO STATE ---
    const [hero, setHero] = useState({ title: "", imageUrl: "" });
    const handleSaveHero = async (draft) => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
        const res = await fetch(`${API_BASE}/page-heros/ipcore`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(adminToken ? { Authorization: 'Bearer ' + adminToken } : {}),
          },
          body: JSON.stringify({
            imageUrl: draft.imageUrl,
            title: draft.title,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setHero({
            title: data.title || draft.title,
            imageUrl: data.imageUrl || draft.imageUrl,
          });
        }
      } catch (e) {
        console.error("Failed to save hero data", e);
      }
    };
    useEffect(() => {
      async function fetchHero() {
        try {
          const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
          const res = await fetch(`${API_BASE}/page-heros/ipcore`);
          if (res.ok) {
            const data = await res.json();
            setHero({ title: data.title, imageUrl: data.imageUrl });
          }
        } catch (e) {
          console.error("Failed to fetch hero data", e);
        }
      }
      fetchHero();
    }, []);
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
        const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
        const res = await fetch(`${API_BASE}/sections/ipcore`, {
          headers: {
            'Content-Type': 'application/json',
            ...(adminToken ? { Authorization: 'Bearer ' + adminToken } : {}),
          },
        }).catch(() => null);
        const json = res && res.ok ? await res.json().catch(() => null) : null;
        if (!json) return;
        try {
          const parsed = json.content ? JSON.parse(json.content) : null;
          setIPCore({ ...(json || {}), parsedContent: parsed });
        } catch {
          setIPCore(json);
        }
      } catch (error) {
        console.error("Failed to load ipcore section", error);
      }
    }
    load();
  }, [adminToken]);

  return (
    <div className="min-h-screen bg-white text-[#444444] font-sans" aria-label="IP core licensing page">
      <section className="relative w-full">
        <HeroEditor hero={hero} adminToken={adminToken} onSave={handleSaveHero} />
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
                    <label htmlFor="ipcore-content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    {ipcoreBlocks && Array.isArray(ipcoreBlocks) ? (
                      <>
                        <div className="space-y-4">
                          {ipcoreBlocks.map((block, index) => (
                            <IPCoreBlockEditor
                              key={block._id || index}
                              block={block}
                              index={index}
                              blocks={ipcoreBlocks}
                              setBlocks={setIPCoreBlocks}
                            />
                          ))}
                        </div>
                        <IPCoreBlockAddButtons blocks={ipcoreBlocks} setBlocks={setIPCoreBlocks} />
                      </>
                    ) : (
                      <textarea id="ipcore-content" value={ipcoreContentEditor} onChange={(event) => setIPCoreContentEditor(event.target.value)} rows={6} className="w-full px-4 py-2 border rounded" />
                    )}
                  </div>

                  <div className="flex justify-start gap-3 mt-4">
                    <button
                      onClick={() => handleIPCoreCancel(setEditingIPCore)}
                      className="px-4 py-2 rounded border"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleIPCoreSave({
                        saveSection,
                        ipcoreTitle,
                        ipcoreBlocks,
                        ipcoreContentEditor,
                        setEditingIPCore,
                        setIPCore,
                        genId,
                        adminToken,
                      })}
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

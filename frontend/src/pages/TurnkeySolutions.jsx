import { useEffect, useState } from "react";
import { useAppState } from "../state/useAppState";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";
import RequestConsultation from "../components/RequestConsultation";
import { genId, blocksToPlainText } from "../lib/blocks.jsx";
import HeroEditor from "../components/HeroEditor";
import { handleTurnkeySave, handleTurnkeyCancel, saveSection } from "../utils/turnkeySaveCancelUtils";
import { renderBlockTurnkey } from "../utils/turnkeyBlockRenderUtils.jsx";
import TurnkeyBlockEditor, { TurnkeyBlockAddButtons } from "../components/TurnkeyBlockEditor";

export default function TurnkeySolutions() {
    const [hero, setHero] = useState({ title: "", imageUrl: "" });
    useEffect(() => {
      async function fetchHero() {
        try {
          const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
          const res = await fetch(`${API_BASE}/page-heros/turnkey`);
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
    if (typeof globalThis !== "undefined" && typeof globalThis.setPageTitle === "function") {
      globalThis.setPageTitle("Turnkey Solutions");
    }
  }, []);

  const [showModal, setShowModal] = useState(false);
  const { adminToken } = useAppState();

  const [turnkey, setTurnkey] = useState(null);
  const [editingTurnkey, setEditingTurnkey] = useState(false);
  const [turnkeyTitle, setTurnkeyTitle] = useState("");
  const [turnkeyBlocks, setTurnkeyBlocks] = useState(null);
  const [turnkeyContentEditor, setTurnkeyContentEditor] = useState("");

  useEffect(() => {
    if (typeof globalThis === "undefined" || globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
        const res = await fetch(`${API_BASE}/sections/turnkey`).catch(() => null);
        const json = res?.ok ? await res.json().catch(() => null) : null;
        if (!json) return;
        try {
          const parsed = json.content ? JSON.parse(json.content) : null;
          setTurnkey({ ...(json || {}), parsedContent: parsed });
        } catch {
          setTurnkey(json);
        }
      } catch (error) {
        console.error("Failed to load turnkey section", error);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#444444] font-sans" aria-label="Turnkey solutions page">
      <section className="relative w-full">
        <HeroEditor
          hero={hero}
          adminToken={adminToken}
          onSave={async (heroDraft) => {
            try {
              const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
              const res = await fetch(`${API_BASE}/page-heros/turnkey`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  ...(adminToken ? { Authorization: 'Bearer ' + adminToken } : {}),
                },
                body: JSON.stringify({
                  imageUrl: heroDraft.imageUrl,
                  title: heroDraft.title,
                }),
              });
              if (res.ok) {
                const data = await res.json();
                setHero({
                  title: data.title || heroDraft.title,
                  imageUrl: data.imageUrl || heroDraft.imageUrl,
                });
              }
            } catch (e) {
              console.error("Failed to save hero data", e);
            }
          }}
        />
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className={editingTurnkey ? "w-full" : "grid md:grid-cols-2 gap-12 items-start"}>
            {!editingTurnkey && (
              <div>
                <div className="mt-4 text-[#444444] text-[15px]">
                  {turnkey && turnkey.parsedContent && Array.isArray(turnkey.parsedContent.intro) && turnkey.parsedContent.intro.map((block, idx) => {
                    if (block.type === "list" && block.style === "decimal") return null;
                    if (block.type === "list" && block.title === "Process") return null;
                    return renderBlockTurnkey(block, idx);
                  })}
                </div>
              </div>
            )}
            <div>
              {editingTurnkey ? (
                <div className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="turnkey-content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <div className="flex flex-col gap-4">
                      {turnkeyBlocks && Array.isArray(turnkeyBlocks) && turnkeyBlocks.map((block, index) => (
                        <TurnkeyBlockEditor
                          key={block._id || index}
                          block={block}
                          index={index}
                          blocks={turnkeyBlocks}
                          setBlocks={setTurnkeyBlocks}
                        />
                      ))}
                    </div>
                  </div>
                    <TurnkeyBlockAddButtons blocks={turnkeyBlocks} setBlocks={setTurnkeyBlocks} />
                  <div className="flex justify-start gap-3 mt-4">
                    <button onClick={() => handleTurnkeyCancel(setEditingTurnkey)} className="px-4 py-2 rounded border bg-[#444444] text-white">
                      Cancel
                    </button>
                    <button
                      onClick={() => handleTurnkeySave({
                        saveSection,
                        turnkeyTitle,
                        turnkeyBlocks,
                        turnkeyContentEditor,
                        setEditingTurnkey,
                        setTurnkey,
                        genId,
                      })}
                      className="px-4 py-2 rounded bg-indigo-600 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {adminToken && !editingTurnkey && (
                    <div className="mb-4">
                      <button
                        onClick={() => {
                          setTurnkeyTitle(turnkey?.title || "Turnkey Solutions");
                          const parsed = turnkey?.parsedContent || null;
                          let arr = [];
                          if (parsed && parsed.intro) {
                            arr = Array.isArray(parsed.intro) ? parsed.intro.map((b) => ({ ...b, _id: b._id || genId() })) : typeof parsed.intro === "string" ? [{ _id: genId(), type: "paragraph", text: parsed.intro }] : [];
                          }
                          
                          if (!arr.some((b) => b && b._id)) arr = arr.map((b) => ({ ...b, _id: genId() }));
                          setTurnkeyBlocks(arr);
                          setTurnkeyContentEditor(blocksToPlainText(arr));
                          setEditingTurnkey(true);
                        }}
                        className="px-3 py-1 border rounded"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                  {turnkey && turnkey.parsedContent && Array.isArray(turnkey.parsedContent.intro) && turnkey.parsedContent.intro.map((block, idx) => {
                    if (block.type === "list" && block.title === "Process") {
                      return renderBlockTurnkey(block, idx);
                    }
                    return null;
                  })}

                  <div className="mt-6 flex justify-start">
                    <button onClick={() => (globalThis.location.href = "/contact")} className="text-black px-6 py-3 border border-black uppercase">
                      Request an Evaluation License
                    </button>
                  </div>

                  {turnkey && turnkey.parsedContent && Array.isArray(turnkey.parsedContent.intro) && turnkey.parsedContent.intro.map((block, idx) => {
                    if (block.type === "list" && block.style === "decimal") {
                      return renderBlockTurnkey(block, idx);
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

      {!editingTurnkey && (
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

import { useEffect, useState } from "react";
import { useAppState } from "../state/useAppState";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";
import RequestConsultation from "../components/RequestConsultation";
import { genId, blocksToPlainText } from "../lib/blocks.jsx";
import HeroEditor from "../components/HeroEditor";
import { feasibilityBlockRender } from "../utils/feasibilityBlockRender.jsx";
import { saveSection, handleFeasibilityCancel } from "../utils/feasibilitySaveCancelUtils.js";
import FeasibilityBlockEditor from "../components/FeasibilityBlockEditor";

export default function Feasibility() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("Feasibility Study");
    }
  }, []);
    // --- HERO STATE ---
    const [hero, setHero] = useState({ title: "", imageUrl: "" });

  const [showModal, setShowModal] = useState(false);
  const { adminToken } = useAppState();

  const [feasibility, setFeasibility] = useState(null);
  const [editingFeasibility, setEditingFeasibility] = useState(false);
  const [feasibilityTitle, setFeasibilityTitle] = useState("");
  const [feasibilityBlocks, setFeasibilityBlocks] = useState(null);
  const [feasibilityContentEditor, setFeasibilityContentEditor] = useState("");

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
        const res = await fetch(`${API_BASE}/sections/feasibility`, {
          headers: {
            'Content-Type': 'application/json',
            ...(adminToken ? { Authorization: 'Bearer ' + adminToken } : {}),
          },
        }).catch(() => null);
        const json = res && res.ok ? await res.json().catch(() => null) : null;
        if (!json) return;
        try {
          const parsed = json.content ? JSON.parse(json.content) : null;
          setFeasibility({ ...(json || {}), parsedContent: parsed });
        } catch {
          setFeasibility(json);
        }
      } catch (error) {
        console.error("Failed to load feasibility section", error);
      }
    }
    load();
  }, [adminToken]);

  useEffect(() => {
    async function fetchHero() {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
        const res = await fetch(`${API_BASE}/page-heros/feasibility`);
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

  return (
    <div className="min-h-screen bg-white text-[#444444] font-sans" aria-label="Feasibility Study page">
      <section className="relative w-full">
        <HeroEditor
          hero={hero}
          adminToken={adminToken}
          onSave={async (heroDraft) => {
            try {
              const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
              const res = await fetch(`${API_BASE}/page-heros/feasibility`, {
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
              alert("Failed to save hero: " + (e.message || e));
            }
          }}
        />
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className={editingFeasibility ? "w-full" : "grid md:grid-cols-2 gap-12 items-start"}>
            {!editingFeasibility && (
              <div>
                <div className="mt-4 text-[#444444] text-[15px]">
                  {feasibility && feasibility.parsedContent && Array.isArray(feasibility.parsedContent.intro) && feasibility.parsedContent.intro.map((block, idx) => {
                    if (block.type === "list" && block.style === "decimal") return null;
                    if (block.title && block.title.toLowerCase() === "process") return null;
                    return feasibilityBlockRender(block, idx);
                  })}
                </div>
              </div>
            )}
            <div>
              {editingFeasibility ? (
                <div className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="feasibility-content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    {feasibilityBlocks && Array.isArray(feasibilityBlocks) ? (
                      <FeasibilityBlockEditor blocks={feasibilityBlocks} setBlocks={setFeasibilityBlocks} genId={genId} />
                    ) : (
                      <textarea id="feasibility-content" value={feasibilityContentEditor} onChange={(event) => setFeasibilityContentEditor(event.target.value)} rows={6} className="w-full px-4 py-2 border rounded" />
                    )}
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => handleFeasibilityCancel(setEditingFeasibility)}
                      className="px-4 py-2 rounded border"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // You can use handleFeasibilitySave here if you want, but keeping saveSection as requested
                        saveSection("feasibility", feasibilityTitle, feasibilityBlocks || (feasibilityContentEditor ? [{ _id: genId(), type: "paragraph", text: feasibilityContentEditor }] : []), setEditingFeasibility, setFeasibility);
                        // Example usage of handleFeasibilitySave (not active):
                        // handleFeasibilitySave({ key: "feasibility", title: feasibilityTitle, blocks: feasibilityBlocks, setEditing: setEditingFeasibility, setState: setFeasibility, adminToken });
                      }}
                      className="px-4 py-2 rounded bg-[#444444] text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {adminToken && !editingFeasibility && (
                    <div className="mb-4">
                      <button
                        onClick={() => {
                          setFeasibilityTitle(feasibility?.title);
                          const parsed = feasibility?.parsedContent || null;
                          let arr = [];
                          if (parsed && parsed.intro) {
                            arr = Array.isArray(parsed.intro) ? parsed.intro.map((b) => ({ ...b, _id: b._id || genId() })) : typeof parsed.intro === "string" ? [{ _id: genId(), type: "paragraph", text: parsed.intro }] : [];
                          }
                          
                          if (!arr.some((b) => b && b._id)) arr = arr.map((b) => ({ ...b, _id: genId() }));
                          setFeasibilityBlocks(arr);
                          setFeasibilityContentEditor(blocksToPlainText(arr));
                          setEditingFeasibility(true);
                        }}
                        className="px-3 py-1 border rounded"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                  {feasibility && feasibility.parsedContent && Array.isArray(feasibility.parsedContent.intro) && feasibility.parsedContent.intro.map((block, idx) => {
                    if (block.title && block.title.toLowerCase() === "process") {
                      return feasibilityBlockRender(block, idx);
                    }
                    return null;
                  })}

                  <div className="mt-6 flex justify-start">
                    <button onClick={() => setShowModal(true)} className="text-black px-6 py-3 border border-black uppercase">
                      Request a Feasibility Study
                    </button>
                  </div>

                  {feasibility && feasibility.parsedContent && Array.isArray(feasibility.parsedContent.intro) && feasibility.parsedContent.intro.map((block, idx) => {
                    if (block.type === "list" && block.style === "decimal") {
                      return feasibilityBlockRender(block, idx);
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

      {!editingFeasibility && (
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

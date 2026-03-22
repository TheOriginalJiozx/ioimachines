import { useEffect, useState } from "react";
import { useAppState } from "../state/useAppState";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";
import { genId, blocksToPlainText } from "../lib/blocks.jsx";
import HeroEditor from "../components/HeroEditor";
import { saveAboutSection, handleAboutCancel } from "../utils/aboutSaveCancelUtils";
import AboutBlockEditor from "../components/AboutBlockEditor";
import { renderBlockAbout } from "../utils/aboutBlockRenderUtils.jsx";
import { renderBlockMission } from "../utils/aboutMissionBlockRender.jsx";

export default function About() {
  const [hero, setHero] = useState({ title: "", imageUrl: "" });
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("About Us");
    }
    async function fetchHero() {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
        const res = await fetch(`${API_BASE}/page-heros/about`);
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
        const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
        const mRes = await fetch(`${API_BASE}/sections/about-mission`).catch(() => null);
        const wRes = await fetch(`${API_BASE}/sections/about-why`).catch(() => null);
        const mJson = mRes && mRes.ok ? await mRes.json().catch(() => null) : null;
        const wJson = wRes && wRes.ok ? await wRes.json().catch(() => null) : null;

        const parseContent = (row) => {
          if (!row) return null;
          try {
            const parsed = row.content ? JSON.parse(row.content) : null;
            return { ...row, parsedContent: parsed };
          } catch {
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

  return (
    <div className="min-h-screen bg-white text-[#444444] font-sans" aria-label="About page">
      <section className="relative w-full" aria-label="About hero">
        <HeroEditor
          hero={hero}
          adminToken={adminToken}
          onSave={async (heroDraft) => {
            try {
              const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
              const res = await fetch(`${API_BASE}/page-heros/about`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  ...(adminToken ? { Authorization: 'Bearer ' + adminToken } : {}),
                },
                body: JSON.stringify({
                  title: heroDraft.title,
                  imageUrl: heroDraft.imageUrl,
                }),
              });
              if (res.ok) {
                const data = await res.json();
                setHero({ title: data.title || heroDraft.title, imageUrl: data.imageUrl || heroDraft.imageUrl });
              }
            } catch (e) {
              console.error("Failed to save hero data", e);
            }
          }}
        />
      </section>

      <div className="top-0 left-0 right-0 bg-[#EBEBEB] z-50 border-b"></div>

      <section className="bg-white" aria-label="Our Mission section">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className={"text-center " + (editingMission ? "max-w-6xl" : "max-w-3xl") + " mx-auto"}>
            {editingMission ? (
              <AboutBlockEditor
                blocks={missionBlocks}
                setBlocks={setMissionBlocks}
                title={missionTitle}
                setTitle={setMissionTitle}
                contentEditor={missionContentEditor}
                setContentEditor={setMissionContentEditor}
                onCancel={() => handleAboutCancel(setEditingMission)}
                onSave={() => saveAboutSection('about-mission', missionTitle, missionBlocks || (missionContentEditor ? [{ _id: genId(), type: 'paragraph', text: missionContentEditor }] : []), setEditingMission, setMission, adminToken)}
              />
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
                  setMissionTitle(mission?.title || "");
                  const parsed = mission?.parsedContent || (mission && mission.content ? (() => {
                    try {
                      return JSON.parse(mission.content)
                    } catch {
                      return null
                    }
                  })() : null);
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
                    } catch {
                      const arr = [{ _id: genId(), type: 'paragraph', text: mission.content }];
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
          <div className={`grid md:grid-cols-2 gap-12 items-center` + (editingWhy ? ' md:grid-cols-1' : '')}>
            <div>
              {(() => {
                const blocksSource = (why?.parsedContent && Array.isArray(why.parsedContent.intro)) ? why.parsedContent.intro : null;
                if (editingWhy) {
                  return null;
                }
                if (blocksSource) {
                  const imgIndex = blocksSource.findIndex((b) => b && b.type === 'image');
                  if (imgIndex !== -1) return renderBlockAbout(blocksSource[imgIndex], imgIndex);
                }
                return <img src="/about_us2.jpg" alt="contact" className="w-full md:h-[28rem] object-cover rounded shadow" />;
              })()}
            </div>
            <div className={editingWhy ? 'editor-column editing-feasibility col-span-full' : ''}>
              {editingWhy ? (
                <AboutBlockEditor
                  blocks={whyBlocks}
                  setBlocks={setWhyBlocks}
                  title={whyTitle}
                  setTitle={setWhyTitle}
                  contentEditor={whyContentEditor}
                  setContentEditor={setWhyContentEditor}
                  onCancel={() => handleAboutCancel(setEditingWhy)}
                  onSave={() => saveAboutSection('about-why', whyTitle || 'Why Choose Us', whyBlocks || (whyContentEditor ? [{ _id: genId(), type: 'paragraph', text: whyContentEditor }] : []), setEditingWhy, setWhy, adminToken)}
                />
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
                    setWhyTitle(why?.title || "");
                    const parsed = why?.parsedContent || (why && why.content ? (() => {
                      try {
                        return JSON.parse(why.content)
                      } catch {
                      return null
                    }
                  })() : null);
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
                      } catch {
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

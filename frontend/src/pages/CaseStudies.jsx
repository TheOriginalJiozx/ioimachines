import { useEffect, useState } from "react";
import { useAppState } from "../state/useAppState";
import ContactCase from "../components/ContactCase";
import Features from "../components/Features";
import GetAdvice from "../components/GetAdvice";
import HeroEditor from "../components/HeroEditor";
import { updateImageBlockAlts, renderBlock } from "../utils/caseStudyBlockUtils.jsx";
import { blocksToPlainText } from "../lib/blocks";
import { fetchHeroData, normalizeEntry } from "../utils/caseStudiesUtils";
import CaseStudyBlockEditor from "../components/CaseStudyBlockEditor";
import { moveBlockUp, moveBlockDown, deleteBlock } from "../utils/caseStudiesEditingUtils";
import CaseStudySolutionBlockEditor from "../components/CaseStudySolutionBlockEditor";
import { addParagraphBlock, addImageBlock } from "../utils/caseStudiesBlockAddUtils";
import { handleSave, handleCancel } from "../utils/caseStudiesSaveCancelUtils";

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
  const [hero, setHero] = useState({ title: "", imageUrl: "" });

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
    fetchHeroData(API_BASE).then(setHero);
  }, []);
  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.setPageTitle === "function") {
      window.setPageTitle("Case Studies");
    }

    async function load() {
      setLoading(true);
      setError("");
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
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
      const updated = updateImageBlockAlts(editingBlocks, titleEditor);
      if (updated !== editingBlocks) setEditingBlocks(updated);
    }
    if (editingSolutionBlocks && Array.isArray(editingSolutionBlocks)) {
      const updated2 = updateImageBlockAlts(editingSolutionBlocks, titleEditor);
      if (updated2 !== editingSolutionBlocks) setEditingSolutionBlocks(updated2);
    }
  }, [titleEditor, editingBlocks, editingSolutionBlocks]);

  return (
    <div className="min-h-screen bg-white text-[#444444] font-sans" aria-label="Case studies page">
      <section className="relative w-full mb-16">
        <HeroEditor
          hero={hero}
          adminToken={adminToken}
          onSave={async (heroDraft) => {
            try {
              const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
              const res = await fetch(`${API_BASE}/page-heros/case-studies`, {
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
              error("Failed to save hero data", e);
            }
          }}
        />
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
                  <label htmlFor="case-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input id="case-title" value={titleEditor} onChange={(event) => setTitleEditor(event.target.value)} className="w-full p-2 border rounded" />
                </div>

                <div className="mb-4">
                  <label htmlFor="case-content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  {editingBlocks && Array.isArray(editingBlocks) ? (
                    <div className="space-y-4">
                      {editingBlocks.map((block, index) => (
                        <CaseStudyBlockEditor
                          key={block._id || index}
                          block={block}
                          index={index}
                          onChange={(id, newBlock) => setEditingBlocks((prev) => prev.map(b => b._id === id ? newBlock : b))}
                          onMoveUp={id => setEditingBlocks(prev => moveBlockUp(prev, id))}
                          onMoveDown={id => setEditingBlocks(prev => moveBlockDown(prev, id))}
                          onDelete={id => setEditingBlocks(prev => deleteBlock(prev, id))}
                        />
                      ))}
                      <div className="flex gap-2 mt-2">
                        <button
                          className="bg-indigo-600 text-white px-3 py-1 rounded"
                          onClick={() => setEditingBlocks(blocks => addParagraphBlock(blocks, genId))}
                        >
                          Add paragraph
                        </button>
                        <button
                          className="bg-white border px-3 py-1 rounded"
                          onClick={() => setEditingBlocks(blocks => addImageBlock(blocks, genId))}
                        >
                          Add image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <textarea id="case-content" value={contentEditor} onChange={(event) => setContentEditor(event.target.value)} rows={10} className="w-full p-3 border rounded text-sm font-mono" />
                  )}
                </div>
                <div className="flex justify-start gap-3 mt-4">
                  <button className="px-4 py-2 rounded border bg-[#444444] text-white" onClick={() => handleCancel(setIsEditing, setSaving)} disabled={saving}>
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-indigo-600 text-white"
                    disabled={saving}
                    onClick={() => handleSave({
                      caseData,
                      isCreating,
                      editingBlocks,
                      editingSolutionBlocks,
                      contentEditor,
                      solutionEditor,
                      titleEditor,
                      solutionTitleEditor,
                      adminToken,
                      setEditingBlocks,
                      setEditingSolutionBlocks,
                      setCaseList,
                      setCaseData,
                      setIsEditing,
                      setIsCreating,
                      setSelectedIndex,
                      setSaving,
                      selectedIndex,
                    })}
                  >
                    Save
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
                            } catch {
                              setContentEditor(caseData.content);
                            }
                            try {
                              setSolutionEditor(blocksToPlainText(caseData.solutionContent));
                            } catch {
                              setSolutionEditor(caseData.solutionContent);
                            }

                            try {
                              const array = Array.isArray(caseData.content) ? caseData.content : typeof caseData.content === "string" ? JSON.parse(caseData.content || "[]") : [];
                              setEditingBlocks(array.map((block) => ({ ...block, _id: block._id || genId() })));
                            } catch {
                              setEditingBlocks(null);
                            }

                            try {
                              const sArr = Array.isArray(caseData.solutionContent) ? caseData.solutionContent : typeof caseData.solutionContent === "string" ? JSON.parse(caseData.solutionContent || "[]") : [];
                              setEditingSolutionBlocks(sArr.map((block) => ({ ...block, _id: block._id || genId() })));
                            } catch {
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
                      <label htmlFor="solution-title" className="block text-sm font-medium text-gray-700 mb-1">Solution title</label>
                      <input id="solution-title" value={solutionTitleEditor} onChange={(event) => setSolutionTitleEditor(event.target.value)} className="w-full p-2 border rounded" />
                    </div>

                    {editingSolutionBlocks && Array.isArray(editingSolutionBlocks) ? (
                      <div>
                        <label htmlFor="solution-blocks" className="block text-sm font-medium text-gray-700 mb-1">Solution blocks</label>
                        <div className="space-y-3">
                          {editingSolutionBlocks.map((block, studyIndex) => (
                            <CaseStudySolutionBlockEditor
                              key={block._id || studyIndex}
                              block={block}
                              index={studyIndex}
                              onChange={(id, newBlock) => setEditingSolutionBlocks((prev) => prev.map(b => b._id === id ? newBlock : b))}
                              onMoveUp={id => setEditingSolutionBlocks(prev => moveBlockUp(prev, id))}
                              onMoveDown={id => setEditingSolutionBlocks(prev => moveBlockDown(prev, id))}
                              onDelete={id => setEditingSolutionBlocks(prev => deleteBlock(prev, id))}
                            />
                          ))}
                          <div className="flex gap-2 mt-2">
                            <button
                              className="bg-indigo-600 text-white px-3 py-1 rounded"
                              onClick={() => setEditingSolutionBlocks(blocks => addParagraphBlock(blocks, genId))}
                            >
                              Add paragraph
                            </button>
                            <button
                              className="bg-white border px-3 py-1 rounded"
                              onClick={() => setEditingSolutionBlocks(blocks => addImageBlock(blocks, genId))}
                            >
                              Add image
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="solution-editor" className="block text-sm font-medium text-gray-700 mb-1">Solution</label>
                        <textarea id="solution-editor" value={solutionEditor} onChange={(event) => setSolutionEditor(event.target.value)} rows={12} className="w-full p-2 border rounded text-sm font-mono" />
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


async function uploadBlocks(blocks, API_BASE, adminToken, isSolution = false) {
  if (!blocks || !Array.isArray(blocks)) return blocks;
  const uploaded = await Promise.all(blocks.map(async (block) => {
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
        const newBlock = { ...block, src: url };
        delete newBlock._file;
        return newBlock;
      } catch (error) {
        console.error(isSolution ? "Solution image upload failed" : "upload failed", error);
        alert((isSolution ? "Solution image upload failed: " : "Image upload failed: ") + (error.message || error));
        return block;
      }
    }
    return block;
  }));
  return uploaded;
}

function toJsonString(text) {
  if (typeof text !== "string") return JSON.stringify([]);
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2);
  } catch {
    const lines = text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (lines.length === 0) return JSON.stringify([]);
    const blocks = lines.map((l) => ({ type: "paragraph", text: l }));
    return JSON.stringify(blocks, null, 2);
  }
}

export async function handleSave({
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
}) {
  const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
  setSaving(true);
  let contentBlocks = editingBlocks;
  let solutionBlocks = editingSolutionBlocks;
  let contentPayload, solutionPayload;

  if (editingBlocks && Array.isArray(editingBlocks)) {
    contentBlocks = await uploadBlocks(editingBlocks, API_BASE, adminToken, false);
    setEditingBlocks(contentBlocks);
    contentPayload = JSON.stringify(contentBlocks, null, 2);
  } else {
    const paragraphJson = toJsonString(contentEditor);
    let paragraphBlocks = [];
    try {
      paragraphBlocks = JSON.parse(paragraphJson);
    } catch {
      paragraphBlocks = [];
    }
    contentPayload = JSON.stringify(paragraphBlocks, null, 2);
  }

  if (editingSolutionBlocks && Array.isArray(editingSolutionBlocks)) {
    solutionBlocks = await uploadBlocks(editingSolutionBlocks, API_BASE, adminToken, true);
    setEditingSolutionBlocks(solutionBlocks);
    solutionPayload = JSON.stringify(solutionBlocks, null, 2);
  } else {
    const solutionParagraphJson = toJsonString(solutionEditor);
    let solutionParagraphBlocks = [];
    try {
      solutionParagraphBlocks = JSON.parse(solutionParagraphJson);
    } catch {
      solutionParagraphBlocks = [];
    }
    solutionPayload = JSON.stringify(solutionParagraphBlocks, null, 2);
  }

  try {
    const headers = { "Content-Type": "application/json" };
    if (adminToken) headers["Authorization"] = "Bearer " + adminToken;
    const payload = { content: contentPayload, solution_content_json: solutionPayload, title: titleEditor, solution_title: solutionTitleEditor };
    let res;
    if (isCreating) {
      const slug = titleEditor ? titleEditor.toLowerCase().trim().replaceAll(/[^a-z0-9]+/g, '-') : '';
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
        slug: result.slug || (titleEditor ? titleEditor.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-') : ''),
        title: titleEditor,
        content: contentBlocks || [],
        solutionTitle: solutionTitleEditor,
        solutionContent: solutionBlocks || [],
      };
      setCaseList(list => [...list, created]);
      setCaseData(created);
      setIsEditing(false);
      setIsCreating(false);
      setSelectedIndex(prev => prev + 1);
    } else {
      res = await fetch(`${API_BASE}/case-studies/${caseData.slug}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error("Update failed: " + res.status + " " + txt);
      }
      const updated = {
        ...caseData,
        title: titleEditor,
        content: contentBlocks || [],
        solutionTitle: solutionTitleEditor,
        solutionContent: solutionBlocks || [],
      };
      setCaseData(updated);
      setCaseList(list => list.map((c, idx) => idx === selectedIndex ? { ...c, ...updated } : c));
      setIsEditing(false);
    }
  } catch (err) {
    console.error("Save failed", err);
  }
  setSaving(false);
}

export function handleCancel(setIsEditing, setSaving) {
  setIsEditing(false);
  setSaving(false);
}

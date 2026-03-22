// Utility functions for save and cancel logic in CaseStudies

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

  let contentPayload;
  if (editingBlocks && Array.isArray(editingBlocks)) {
    const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
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
    } catch {
      paragraphBlocks = [];
    }
    contentPayload = JSON.stringify(paragraphBlocks, null, 2);
  }

  let solutionPayload;
  if (editingSolutionBlocks && Array.isArray(editingSolutionBlocks)) {
    const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
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
    } catch {
      solutionParagraphBlocks = [];
    }
    solutionPayload = JSON.stringify(solutionParagraphBlocks, null, 2);
  }

  setSaving(true);
  try {
    const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
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
        content: editingBlocks || [],
        solutionTitle: solutionTitleEditor,
        solutionContent: editingSolutionBlocks || [],
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
        content: editingBlocks || [],
        solutionTitle: solutionTitleEditor,
        solutionContent: editingSolutionBlocks || [],
      };
      setCaseData(updated);
      setCaseList(list => list.map((c, idx) => idx === selectedIndex ? { ...c, ...updated } : c));
      setIsEditing(false);
    }
  } catch {
    console.error("Save failed");
  }
  setSaving(false);
}

export function handleCancel(setIsEditing, setSaving) {
  setIsEditing(false);
  setSaving(false);
}

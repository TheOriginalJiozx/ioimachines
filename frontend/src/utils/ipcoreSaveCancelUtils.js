
async function uploadBlockFile(b, API_BASE, adminToken) {
  if (!b || !b._file) return b;
  try {
    const formData = new FormData();
    formData.append("file", b._file);
    const upHeaders = {};
    if (adminToken) upHeaders["Authorization"] = "Bearer " + adminToken;
    const upRes = await fetch(`${API_BASE}/uploads`, { method: "POST", body: formData, headers: upHeaders });
    if (!upRes.ok) throw new Error("upload failed");
    const upJson = await upRes.json();
    const url = upJson.url || upJson.path || "";
    const newBlock = { ...b, src: url };
    delete newBlock._file;
    return newBlock;
  } catch (error) {
    alert("Image upload failed: " + (error.message || error));
    return b;
  }
}

async function uploadBlockImages(images, API_BASE, adminToken) {
  if (!Array.isArray(images)) return images;
  const newImages = await Promise.all(images.map(async (img) => {
    if (img && img._file) {
      try {
        const formData = new FormData();
        formData.append("file", img._file);
        const upHeaders = {};
        if (adminToken) upHeaders["Authorization"] = "Bearer " + adminToken;
        const upRes = await fetch(`${API_BASE}/uploads`, { method: "POST", body: formData, headers: upHeaders });
        if (!upRes.ok) throw new Error("upload failed");
        const upJson = await upRes.json();
        const url = upJson.url || upJson.path || "";
        return url;
      } catch (error) {
        alert("Image upload failed: " + (error.message || error));
        return img;
      }
    } else if (typeof img === "string") {
      return img;
    }
    return img;
  }));
  return newImages;
}

export async function saveSection(key, title, blocks, setEditing, setState, extraParsed = null, adminToken = null) {
  const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
  const headers = { "Content-Type": "application/json" };
  if (adminToken) headers["Authorization"] = "Bearer " + adminToken;

  let blocksCopy = blocks && Array.isArray(blocks) ? await Promise.all(blocks.map(async (b) => {
    let newBlock = b;
    if (b && b._file) {
      newBlock = await uploadBlockFile(b, API_BASE, adminToken);
    }
    if (b && Array.isArray(b.images)) {
      const newImages = await uploadBlockImages(b.images, API_BASE, adminToken);
      newBlock = { ...newBlock, images: newImages };
      if (newBlock.src) delete newBlock.src;
    }
    return newBlock;
  })) : null;

  const parsedPayload = extraParsed ? { ...extraParsed, intro: blocksCopy || [] } : { intro: blocksCopy || [] };
  const payload = { title: title, content: JSON.stringify(parsedPayload) };
  try {
    const res = await fetch(`${API_BASE}/sections/${key}`, { method: "PUT", headers, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error("save failed");
    setState((prev) => ({ ...prev, title: title, content: JSON.stringify(parsedPayload), parsedContent: parsedPayload }));
    setEditing(false);
  } catch (error) {
    alert("Save failed: " + (error.message || error));
  }
}

export function handleIPCoreCancel(setEditingIPCore) {
  setEditingIPCore(false);
}

export function handleIPCoreSave({
  saveSection,
  ipcoreTitle,
  ipcoreBlocks,
  ipcoreContentEditor,
  setEditingIPCore,
  setIPCore,
  genId,
  adminToken,
}) {
  saveSection(
    "ipcore",
    ipcoreTitle,
    ipcoreBlocks || (ipcoreContentEditor ? [{ _id: genId(), type: "paragraph", text: ipcoreContentEditor }] : []),
    setEditingIPCore,
    setIPCore,
    null,
    adminToken
  );
}

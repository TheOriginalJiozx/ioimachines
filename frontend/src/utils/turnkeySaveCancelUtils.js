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
    console.error("upload failed", error);
    alert("Image upload failed: " + (error.message || error));
    return b;
  }
}

export async function saveSection(key, title, blocks, setEditing, setState, extraParsed = null, adminToken = null) {
  try {
    const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
    const headers = { "Content-Type": "application/json" };
    if (adminToken) headers["Authorization"] = "Bearer " + adminToken;

    let blocksCopy = blocks && Array.isArray(blocks) ? blocks.slice() : null;
    if (blocksCopy) {
      for (let i = 0; i < blocksCopy.length; i++) {
        const b = blocksCopy[i];
        if (b && b._file) {
          try {
            const formData = new FormData();
            formData.append("file", b._file);
            const upHeaders = {};
            if (adminToken) upHeaders["Authorization"] = "Bearer " + adminToken;
            const upRes = await fetch(`${API_BASE}/uploads`, { method: "POST", body: formData, headers: upHeaders });
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
    }

    const parsedPayload = { ...extraParsed, intro: blocksCopy || [] };
    const payload = { title: title, content: JSON.stringify(parsedPayload) };
    const res = await fetch(`${API_BASE}/sections/${key}`, { method: "PUT", headers, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error("save failed");
    setState((prev) => ({ ...prev, title: title, content: JSON.stringify(parsedPayload), parsedContent: parsedPayload }));
      setState((prev) => ({ ...prev, title: title, content: JSON.stringify(parsedPayload), parsedContent: parsedPayload }));
    setEditing(false);
  } catch (error) {
    alert("Save failed: " + (error.message || error));
  }
}


export function handleTurnkeyCancel(setEditingTurnkey) {
  setEditingTurnkey(false);
}

export function handleTurnkeySave({
  saveSection,
  turnkeyTitle,
  turnkeyBlocks,
  turnkeyContentEditor,
  setEditingTurnkey,
  setTurnkey,
  genId,
}) {
  saveSection(
    "turnkey",
    turnkeyTitle,
    turnkeyBlocks || (turnkeyContentEditor ? [{ _id: genId(), type: "paragraph", text: turnkeyContentEditor }] : []),
    setEditingTurnkey,
    setTurnkey
  );
}

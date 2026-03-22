export async function saveSection(key, title, blocks, setEditing, setState, extraParsed = null, adminToken = null) {
  try {
    const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
    const headers = { "Content-Type": "application/json" };
    if (adminToken) headers["Authorization"] = "Bearer " + adminToken;

    let blocksCopy = blocks && Array.isArray(blocks) ? blocks.slice() : null;
    if (blocksCopy) {
      for (let i = 0; i < blocksCopy.length; i++) {
        const b = blocksCopy[i];
        // Enkel billed-upload (legacy) - kun hvis _file findes
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
            alert("Image upload failed: " + (error.message || error));
          }
        }
        if (b && Array.isArray(b.images)) {
          const newImages = [];
          for (let img of b.images) {
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
                newImages.push(url);
              } catch (error) {
                alert("Image upload failed: " + (error.message || error));
              }
            } else if (typeof img === "string") {
              newImages.push(img);
            }
          }
          blocksCopy[i] = { ...blocksCopy[i], images: newImages };
          // Fjern evt. src hvis den findes, så kun images-array bruges
          if (blocksCopy[i].src) delete blocksCopy[i].src;
        }
      }
    }

    const parsedPayload = { ...(extraParsed || {}), intro: blocksCopy || [] };
    const payload = { title: title, content: JSON.stringify(parsedPayload) };
    const res = await fetch(`${API_BASE}/sections/${key}`, { method: "PUT", headers, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error("save failed");
    setState((prev) => ({ ...(prev || {}), title: title, content: JSON.stringify(parsedPayload), parsedContent: parsedPayload }));
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
    setSection({ ...section, parsedContent: parsed });
    ipcoreTitle,
    ipcoreBlocks || (ipcoreContentEditor ? [{ _id: genId(), type: "paragraph", text: ipcoreContentEditor }] : []),
    setEditingIPCore,
    setIPCore,
    null,
    adminToken
  );
}

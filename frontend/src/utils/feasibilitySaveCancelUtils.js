
async function uploadFeasibilityBlocks(blocks, API_BASE, adminToken) {
  if (!blocks || !Array.isArray(blocks)) return blocks;
  const uploaded = await Promise.all(blocks.map(async (b) => {
    if (b && b._file) {
      try {
        const formData = new FormData();
        formData.append("file", b._file);
        const upHeaders = {};
        if (adminToken) upHeaders["Authorization"] = "Bearer " + adminToken;
        const upRes = await fetch(`${API_BASE}/uploads`, {
          method: "POST",
          body: formData,
          headers: upHeaders,
        });
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
    return b;
  }));
  return uploaded;
}

function buildFeasibilityPayload(title, blocks, extraParsed) {
  let parsedPayload = null;
  if (extraParsed) {
    parsedPayload = extraParsed;
  } else if (blocks && Array.isArray(blocks)) {
    parsedPayload = { intro: blocks };
  } else {
    parsedPayload = blocks;
  }
  return { title: title, content: JSON.stringify(parsedPayload) };
}

export async function saveSection(
  key,
  title,
  blocks,
  setEditing,
  setState,
  adminToken,
  extraParsed = null,
) {
  const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
  const headers = { "Content-Type": "application/json" };
  if (adminToken) headers["Authorization"] = "Bearer " + adminToken;

  let blocksCopy = blocks && Array.isArray(blocks) ? await uploadFeasibilityBlocks(blocks.slice(), API_BASE, adminToken) : null;
  const payload = buildFeasibilityPayload(title, blocksCopy || blocks, extraParsed);
  try {
    const res = await fetch(`${API_BASE}/sections/${key}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("save failed");
    const parsedPayload = JSON.parse(payload.content);
    setState((prev) => ({
      ...prev,
      title: title,
      content: payload.content,
      parsedContent: parsedPayload,
    }));
    setEditing(false);
  } catch (error) {
    alert("Save failed: " + (error.message || error));
  }
}

export function handleFeasibilityCancel(setEditing) {
  setEditing(false);
}

export function handleFeasibilitySave({
  key,
  title,
  blocks,
  setEditing,
  setState,
  adminToken,
  extraParsed,
}) {
  return saveSection(key, title, blocks, setEditing, setState, adminToken, extraParsed);
}

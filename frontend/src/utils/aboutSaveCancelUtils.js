export async function saveAboutSection(key, title, blocks, setEditing, setState, adminToken) {
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
            formData.append('file', b._file);
            const upHeaders = {};
            if (adminToken) upHeaders['Authorization'] = 'Bearer ' + adminToken;
            const upRes = await fetch(`${API_BASE}/uploads`, { method: 'POST', body: formData, headers: upHeaders });
            if (!upRes.ok) throw new Error('upload failed');
            const upJson = await upRes.json();
            const url = upJson.url || upJson.path || '';
            blocksCopy[i] = { ...blocksCopy[i], src: url };
            delete blocksCopy[i]._file;
          } catch (error) {
            console.error('upload failed', error);
            alert('Image upload failed: ' + (error.message || error));
          }
        }
      }
    }

    const payload = { title: title, content: JSON.stringify({ intro: blocksCopy || [] }) };
    const res = await fetch(`${API_BASE}/sections/${key}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('save failed');
      setState((prev) => ({ ...prev, title: title, content: JSON.stringify({ intro: blocksCopy || [] }), parsedContent: { intro: blocksCopy || [] } }));
    setEditing(false);
  } catch (error) {
    alert('Save failed: ' + (error.message || error));
  }
}

export function handleAboutCancel(setEditing) {
  setEditing(false);
}

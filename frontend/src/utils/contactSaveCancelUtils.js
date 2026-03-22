
async function uploadContactBlocks(blocks, API_BASE, adminToken) {
  if (!Array.isArray(blocks) || blocks.length === 0) return blocks;
  const uploaded = await Promise.all(blocks.map(async (b) => {
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
        const newBlock = { ...b, src: url };
        delete newBlock._file;
        return newBlock;
      } catch (error) {
        console.error('upload failed', error);
        alert('Image upload failed: ' + (error.message || error));
        return b;
      }
    }
    return b;
  }));
  return uploaded;
}

function buildContactBlocks(blocks, title, contentEditor) {
  if (Array.isArray(blocks) && blocks.length > 0) {
    const blocksCopy = blocks.slice();
    if (blocksCopy[0].type === 'title') {
      blocksCopy[0] = { ...blocksCopy[0], text: title };
    } else {
      blocksCopy.unshift({ _id: (typeof crypto === 'undefined' ? Math.random().toString() : crypto.randomUUID()), type: 'title', text: title });
    }
    return blocksCopy;
  } else if (contentEditor && contentEditor.trim()) {
    return [
      { _id: (typeof crypto === 'undefined' ? Math.random().toString() : crypto.randomUUID()), type: 'title', text: title },
      { _id: (typeof crypto === 'undefined' ? Math.random().toString() : crypto.randomUUID()), type: 'paragraph', text: contentEditor, contactType: null }
    ];
  }
  return [];
}

function findContact(blocksResult, type, fallback) {
  const b = (blocksResult || []).find((x) => x.contactType === type);
  if (b && b.text) {
    return b.text;
  }
  return fallback || null;
}

export async function saveContactSection(sectionKey, title, blocks, setEditing, setState, adminToken, editAddress, editEmail, editTiming, editPhone, contentEditor) {
  const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
  const headers = { "Content-Type": "application/json" };
  if (adminToken) headers["Authorization"] = "Bearer " + adminToken;

  let blocksResult = [];
  if (Array.isArray(blocks) && blocks.length > 0) {
    blocksResult = await uploadContactBlocks(blocks, API_BASE, adminToken);
    blocksResult = buildContactBlocks(blocksResult, title, null);
  } else if (contentEditor && contentEditor.trim()) {
    blocksResult = buildContactBlocks([], title, contentEditor);
  }

  const introBlocks = (blocksResult || []).filter((b) => b.contactType === undefined || b.contactType === null);
  const contentObj = { intro: introBlocks };

  const addressVal = findContact(blocksResult, 'address', editAddress);
  const emailVal = findContact(blocksResult, 'email', editEmail);
  const timingVal = findContact(blocksResult, 'timing', editTiming);
  const phoneVal = findContact(blocksResult, 'phone', editPhone);

  const payloadWithContacts = {
    title: title,
    content: JSON.stringify(contentObj),
    email: emailVal,
    phone: phoneVal,
    address: addressVal,
    timing: timingVal
  };

  try {
    const mainRes = await fetch(`${API_BASE}/sections/contact`, { method: "PUT", headers, body: JSON.stringify(payloadWithContacts) });
    if (!mainRes.ok) throw new Error("Failed to save contact section");

    setState((prev) => ({ ...prev, title: title, content: JSON.stringify(contentObj), parsedContent: contentObj, email: emailVal, phone: phoneVal, address: addressVal, timing: timingVal }));
    setEditing(false);
  } catch (error) {
    alert("Save failed: " + (error.message || error));
  }
}

export function handleContactCancel(setEditing) {
  setEditing(false);
}

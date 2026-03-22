export async function saveContactSection(sectionKey, title, blocks, setEditing, setState, adminToken, editAddress, editEmail, editTiming, editPhone, contentEditor) {
  try {
    const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
    const headers = { "Content-Type": "application/json" };
    if (adminToken) headers["Authorization"] = "Bearer " + adminToken;

    let blocksResult = null;
    if (Array.isArray(blocks) && blocks.length > 0) {
      const blocksCopy = blocks.slice();
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

      if (blocksCopy[0].type !== 'title') {
        blocksCopy.unshift({ _id: (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString()), type: 'title', text: title });
      } else {
        blocksCopy[0] = { ...blocksCopy[0], text: title };
      }
      blocksResult = blocksCopy;
    } else if (contentEditor && contentEditor.trim()) {
      blocksResult = [
        { _id: (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString()), type: 'title', text: title },
        { _id: (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString()), type: 'paragraph', text: contentEditor, contactType: null }
      ];
    }

    const introBlocks = (blocksResult || []).filter((b) => !b.contactType);
    const contentObj = { intro: introBlocks };

    const findContact = (type) => {
      const b = (blocksResult || []).find((x) => x.contactType === type);
      return b && b.text ? b.text : null;
    };

    const addressVal = findContact('address') || editAddress || null;
    const emailVal = findContact('email') || editEmail || null;
    const timingVal = findContact('timing') || editTiming || null;
    const phoneVal = findContact('phone') || editPhone || null;

    const payloadWithContacts = {
      title: title,
      content: JSON.stringify(contentObj),
      email: emailVal,
      phone: phoneVal,
      address: addressVal,
      timing: timingVal
    };

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

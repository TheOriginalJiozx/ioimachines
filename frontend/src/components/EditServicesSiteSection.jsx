import React, { useState } from "react";

export default function EditServicesSiteSection({
  title,
  subtitle,
  body1,
  body2,
  setTitle,
  setSubtitle,
  setBody1,
  setBody2,
  onCancel,
  onSave,
  saving
}) {
  const [localTitle, setLocalTitle] = useState(title);
  const [localSubtitle, setLocalSubtitle] = useState(subtitle);
  const [localBody1, setLocalBody1] = useState(body1);
  const [localBody2, setLocalBody2] = useState(Array.isArray(body2) ? [...body2] : []);

  return (
    <div className="bg-white text-black rounded-lg p-4">
      <input
        type="text"
        value={localTitle}
        onChange={e => setLocalTitle(e.target.value)}
        className="w-full font-bold text-xl mb-2 border-b border-gray-200 focus:outline-none focus:border-[#444444] bg-transparent"
      />
      <input
        type="text"
        value={localSubtitle}
        onChange={e => setLocalSubtitle(e.target.value)}
        className="w-full font-semibold text-lg mb-2 border-b border-gray-200 focus:outline-none focus:border-[#444444] bg-transparent"
      />
      <textarea
        value={localBody1}
        onChange={e => setLocalBody1(e.target.value)}
        rows={2}
        className="w-full text-sm mb-2 border rounded p-2 focus:outline-none focus:border-[#444444]"
      />
      <div className="mb-4">
        {localBody2.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={item.icon}
              onChange={e => {
                const newArr = [...localBody2];
                newArr[idx].icon = e.target.value;
                setLocalBody2(newArr);
              }}
              placeholder="Font Awesome icon class"
              className="w-40 text-sm border rounded p-2 focus:outline-none focus:border-[#444444]"
            />
            <input
              type="text"
              value={item.text}
              onChange={e => {
                const newArr = [...localBody2];
                newArr[idx].text = e.target.value;
                setLocalBody2(newArr);
              }}
              placeholder="Item text"
              className="flex-1 text-sm border rounded p-2 focus:outline-none focus:border-[#444444]"
            />
            <button
              className="bg-[#444444] text-white px-2 py-1 rounded"
              onClick={() => {
                const newArr = localBody2.filter((_, i) => i !== idx);
                setLocalBody2(newArr);
              }}
              title="Remove item"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          className="bg-indigo-600 text-white px-3 py-1 rounded mt-2"
          onClick={() => setLocalBody2([...localBody2, { icon: "", text: "" }])}
        >
          Add item
        </button>
      </div>
      <div className="flex gap-2 mt-2">
        <button className="bg-[#444444] text-white px-4 py-2 rounded" onClick={onCancel} disabled={saving}>Cancel</button>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          disabled={saving}
          onClick={async () => {
            setTitle(localTitle);
            setSubtitle(localSubtitle);
            setBody1(localBody1);
            setBody2(localBody2);
            await onSave(localTitle, localSubtitle, localBody1, localBody2);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

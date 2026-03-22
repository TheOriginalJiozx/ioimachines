import PropTypes from "prop-types";
import React, { useState } from "react";

export default function EditWhatWeDoSection({
  title,
  subtitle,
  body1,
  body2,
  body3,
  body4,
  setTitle,
  setSubtitle,
  setBody1,
  setBody2,
  setBody3,
  setBody4,
  saving,
  onCancel,
  onSave
}) {
  const [localTitle, setLocalTitle] = useState(title);
  const [localSubtitle, setLocalSubtitle] = useState(subtitle);
  const [localBody1, setLocalBody1] = useState(body1);
  const [localBody2, setLocalBody2] = useState(body2);
  const [localBody3, setLocalBody3] = useState(body3);
  const [localBody4, setLocalBody4] = useState(body4);

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
      <textarea
        value={localBody2}
        onChange={e => setLocalBody2(e.target.value)}
        rows={2}
        className="w-full text-sm mb-2 border rounded p-2 focus:outline-none focus:border-[#444444]"
      />
      <textarea
        value={localBody3}
        onChange={e => setLocalBody3(e.target.value)}
        rows={2}
        className="w-full text-sm mb-2 border rounded p-2 focus:outline-none focus:border-[#444444]"
      />
      <textarea
        value={localBody4}
        onChange={e => setLocalBody4(e.target.value)}
        rows={2}
        className="w-full text-sm mb-2 border rounded p-2 focus:outline-none focus:border-[#444444]"
      />
      <div className="flex justify-start gap-3 mt-4">
        <button className="px-4 py-2 rounded bg-[#444444] text-white" onClick={onCancel} disabled={saving}>Cancel</button>
        <button
          className="px-4 py-2 rounded bg-indigo-600 text-white"
          disabled={saving}
          onClick={async () => {
            setTitle(localTitle);
            setSubtitle(localSubtitle);
            setBody1(localBody1);
            setBody2(localBody2);
            setBody3(localBody3);
            setBody4(localBody4);
            await onSave(localTitle, localSubtitle, localBody1, localBody2, localBody3, localBody4);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

EditWhatWeDoSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  body1: PropTypes.string,
  body2: PropTypes.string,
  body3: PropTypes.string,
  body4: PropTypes.string,
  setTitle: PropTypes.func,
  setSubtitle: PropTypes.func,
  setBody1: PropTypes.func,
  setBody2: PropTypes.func,
  setBody3: PropTypes.func,
  setBody4: PropTypes.func,
  saving: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};
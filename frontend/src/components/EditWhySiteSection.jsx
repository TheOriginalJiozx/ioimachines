import PropTypes from "prop-types";
import React, { useState } from "react";

export default function EditWhySiteSection({
  whyTitle,
  whySubtitle,
  whyBody1,
  whyBody2,
  whyBody3,
  perfTitle,
  perfSubtitle,
  perfBody1,
  perfBody2,
  setWhyTitle,
  setWhySubtitle,
  setWhyBody1,
  setWhyBody2,
  setWhyBody3,
  setPerfTitle,
  setPerfSubtitle,
  setPerfBody1,
  setPerfBody2,
  onCancel,
  onSave,
  saving
}) {
  const [localWhyTitle, setLocalWhyTitle] = useState(whyTitle);
  const [localWhySubtitle, setLocalWhySubtitle] = useState(whySubtitle);
  const [localWhyBody1, setLocalWhyBody1] = useState(whyBody1);
  const [localWhyBody2, setLocalWhyBody2] = useState(whyBody2);
  const [localWhyBody3, setLocalWhyBody3] = useState(whyBody3);
  const [localPerfTitle, setLocalPerfTitle] = useState(perfTitle);
  const [localPerfSubtitle, setLocalPerfSubtitle] = useState(perfSubtitle);
  const [localPerfBody1, setLocalPerfBody1] = useState(perfBody1);
  const [localPerfBody2, setLocalPerfBody2] = useState(perfBody2);

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center min-w-6xl mx-auto w-full">
      <div className="max-w-xl">
        <input
          type="text"
          value={localWhyTitle}
          onChange={e => setLocalWhyTitle(e.target.value)}
          className="w-full font-semibold text-lg mb-2 border-b border-gray-200 focus:outline-none focus:border-[#444444] bg-transparent"
        />
        <input
          type="text"
          value={localWhySubtitle}
          onChange={e => setLocalWhySubtitle(e.target.value)}
          className="w-full font-semibold text-base mb-2 border-b border-gray-200 focus:outline-none focus:border-[#444444] bg-transparent"
        />
        <textarea
          value={localWhyBody1}
          onChange={e => setLocalWhyBody1(e.target.value)}
          rows={2}
          className="w-full text-sm mb-2 border rounded p-2 focus:outline-none focus:border-[#444444]"
        />
        <textarea
          value={localWhyBody2}
          onChange={e => setLocalWhyBody2(e.target.value)}
          rows={2}
          className="w-full text-sm mb-2 border rounded p-2 focus:outline-none focus:border-[#444444]"
        />
        <textarea
          value={localWhyBody3}
          onChange={e => setLocalWhyBody3(e.target.value)}
          rows={2}
          className="w-full text-sm mb-2 border rounded p-2 focus:outline-none focus:border-[#444444]"
        />
      </div>
      <aside className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm max-w-xl">
        <input
          type="text"
          value={localPerfTitle}
          onChange={e => setLocalPerfTitle(e.target.value)}
          className="w-full font-semibold text-lg mb-2 border-b border-gray-200 focus:outline-none focus:border-[#444444] bg-transparent"
        />
        <input
          type="text"
          value={localPerfSubtitle}
          onChange={e => setLocalPerfSubtitle(e.target.value)}
          className="w-full font-semibold text-base mb-2 border-b border-gray-200 focus:outline-none focus:border-[#444444] bg-transparent"
        />
        <textarea
          value={localPerfBody1}
          onChange={e => setLocalPerfBody1(e.target.value)}
          rows={2}
          className="w-full text-sm mb-2 border rounded p-2 focus:outline-none focus:border-[#444444]"
        />
        <textarea
          value={localPerfBody2}
          onChange={e => setLocalPerfBody2(e.target.value)}
          rows={2}
          className="w-full text-sm mb-2 border rounded p-2 focus:outline-none focus:border-[#444444]"
        />
      </aside>
      <div className="flex gap-2 mt-4 md:col-span-2">
        <button className="bg-[#444444] text-white px-4 py-2 rounded" onClick={onCancel} disabled={saving}>Cancel</button>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          disabled={saving}
          onClick={async () => {
            setWhyTitle(localWhyTitle);
            setWhySubtitle(localWhySubtitle);
            setWhyBody1(localWhyBody1);
            setWhyBody2(localWhyBody2);
            setWhyBody3(localWhyBody3);
            setPerfTitle(localPerfTitle);
            setPerfSubtitle(localPerfSubtitle);
            setPerfBody1(localPerfBody1);
            setPerfBody2(localPerfBody2);
            await onSave(
              localWhyTitle,
              localWhySubtitle,
              localWhyBody1,
              localWhyBody2,
              localWhyBody3,
              localPerfTitle,
              localPerfSubtitle,
              localPerfBody1,
              localPerfBody2
            );
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

EditWhySiteSection.propTypes = {
  whyTitle: PropTypes.string,
  whySubtitle: PropTypes.string,
  whyBody1: PropTypes.string,
  whyBody2: PropTypes.string,
  whyBody3: PropTypes.string,
  perfTitle: PropTypes.string,
  perfSubtitle: PropTypes.string,
  perfBody1: PropTypes.string,
  perfBody2: PropTypes.string,
  setWhyTitle: PropTypes.func,
  setWhySubtitle: PropTypes.func,
  setWhyBody1: PropTypes.func,
  setWhyBody2: PropTypes.func,
  setWhyBody3: PropTypes.func,
  setPerfTitle: PropTypes.func,
  setPerfSubtitle: PropTypes.func,
  setPerfBody1: PropTypes.func,
  setPerfBody2: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  saving: PropTypes.bool,
};
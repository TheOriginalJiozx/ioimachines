import PropTypes from "prop-types";
import React, { useState } from "react";

export default function EditModalText({
  modalTitle,
  modalBody,
  modalIconClass,
  setModalTitle,
  setModalBody,
  setModalIconClass,
  onCancel,
  onSave,
  saving
}) {
  const [localTitle, setLocalTitle] = useState(modalTitle);
  const [localBody, setLocalBody] = useState(modalBody);
  const [localIconClass, setLocalIconClass] = useState(modalIconClass);

  return (
    <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <input
          type="text"
          value={localTitle}
          onChange={e => setLocalTitle(e.target.value)}
          className="text-lg font-semibold text-gray-800 w-full border-b border-gray-200 focus:outline-none focus:border-[#444444] bg-transparent"
        />
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          disabled={saving}
        >✕</button>
      </div>
      <textarea
        value={localBody}
        onChange={e => setLocalBody(e.target.value)}
        rows={6}
        className="mt-4 w-full text-sm text-gray-700 border rounded p-2 whitespace-pre-line focus:outline-none focus:border-[#444444]"
      />
      <input
        type="text"
        value={localIconClass}
        onChange={e => setLocalIconClass(e.target.value)}
        placeholder="Font Awesome icon class (fx: fas fa-lock)"
        className="mt-4 w-full text-sm text-gray-700 border rounded p-2 focus:outline-none focus:border-[#444444]"
      />
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="bg-[#444444] text-white px-4 py-2 rounded"
          disabled={saving}
        >Cancel</button>
        <button
          onClick={async () => {
            setModalTitle(localTitle);
            setModalBody(localBody);
            setModalIconClass(localIconClass);
            await onSave(localTitle, localBody, localIconClass);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          disabled={saving}
        >Save</button>
      </div>
    </div>
  );
}

EditModalText.propTypes = {
  modalTitle: PropTypes.string,
  modalBody: PropTypes.string,
  modalIconClass: PropTypes.string,
  setModalTitle: PropTypes.func,
  setModalBody: PropTypes.func,
  setModalIconClass: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  saving: PropTypes.bool,
};
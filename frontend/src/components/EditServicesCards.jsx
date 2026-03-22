import PropTypes from "prop-types";
import React, { useState } from "react";

export default function EditServicesCards({
  card1, card2, card3,
  onCancel, onSave
}) {
  const [localCard1, setLocalCard1] = useState(card1);
  const [localCard2, setLocalCard2] = useState(card2);
  const [localCard3, setLocalCard3] = useState(card3);
  const [saving, setSaving] = useState(false);

  return (
    <div>
      {[localCard1, localCard2, localCard3].map((card, idx) => (
        <div key={idx} className="bg-white rounded-lg p-6 shadow flex items-start space-x-4 enter-up mb-4" style={{ "--i": idx }}>
          <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
            <i className={card.icon}></i>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={card.title}
              onChange={e => {
                const val = e.target.value;
                if (idx === 0) setLocalCard1({ ...localCard1, title: val });
                if (idx === 1) setLocalCard2({ ...localCard2, title: val });
                if (idx === 2) setLocalCard3({ ...localCard3, title: val });
              }}
              className="font-semibold text-black w-full border-b border-gray-200 mb-2 focus:outline-none focus:border-[#444444] bg-transparent"
            />
            <textarea
              value={card.text}
              onChange={e => {
                const val = e.target.value;
                if (idx === 0) setLocalCard1({ ...localCard1, text: val });
                if (idx === 1) setLocalCard2({ ...localCard2, text: val });
                if (idx === 2) setLocalCard3({ ...localCard3, text: val });
              }}
              rows={2}
              className="text-sm text-black w-full border rounded p-2 mb-2 focus:outline-none focus:border-[#444444]"
            />
            <input
              type="text"
              value={card.icon}
              onChange={e => {
                const val = e.target.value;
                if (idx === 0) setLocalCard1({ ...localCard1, icon: val });
                if (idx === 1) setLocalCard2({ ...localCard2, icon: val });
                if (idx === 2) setLocalCard3({ ...localCard3, icon: val });
              }}
              placeholder="Font Awesome icon class"
              className="text-sm text-black w-full border rounded p-2 mb-2 focus:outline-none focus:border-[#444444]"
            />
          </div>
        </div>
      ))}
      <div className="flex gap-2 mt-2">
        <button className="bg-[#444444] text-white px-4 py-2 rounded" onClick={onCancel}>Cancel</button>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            await onSave(localCard1, localCard2, localCard3);
            setSaving(false);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

EditServicesCards.propTypes = {
  card1: PropTypes.object,
  card2: PropTypes.object,
  card3: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};
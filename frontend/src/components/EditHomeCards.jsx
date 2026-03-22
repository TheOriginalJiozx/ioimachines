import PropTypes from "prop-types";
import React, { useState } from "react";

export default function EditHomeCards({
  card1, card2, card3, card4,
  setCard1, setCard2, setCard3, setCard4,
  card4List, setCard4List,
  card4ListIcons, setCard4ListIcons,
  card4Footer, setCard4Footer,
  onCancel, onSave,
}) {
  const [localCard1, setLocalCard1] = useState(card1);
  const [localCard2, setLocalCard2] = useState(card2);
  const [localCard3, setLocalCard3] = useState(card3);
  const [localCard4, setLocalCard4] = useState(card4);
  const [localCard4List, setLocalCard4List] = useState([...card4List]);
  const [localCard4ListIcons, setLocalCard4ListIcons] = useState([...card4ListIcons]);
  const [localCard4Footer, setLocalCard4Footer] = useState(card4Footer);
  const [saving, setSaving] = useState(false);

  return (
    <div>
      {[localCard1, localCard2, localCard3].map((card) => (
        <div key={card.id || card._id || card.title || card.icon || globalThis.crypto.randomUUID()} className="bg-white rounded-lg p-6 shadow flex items-start space-x-4 enter-up mb-4" style={{ "--i": card.id || card._id || card.title || card.icon }}>
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
      {/* Card 4 */}
      <div className="bg-white rounded-lg p-6 shadow flex items-start space-x-4 enter-up mb-4">
        <div className="w-12 h-12 rounded-lg bg-[#F1F7FB] flex items-center justify-center text-[#0471AB]">
          <i className={localCard4.icon}></i>
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={localCard4.title}
            onChange={e => setLocalCard4({ ...localCard4, title: e.target.value })}
            className="font-semibold text-black w-full border-b border-gray-200 mb-2 focus:outline-none focus:border-[#444444] bg-transparent"
          />
          <textarea
            value={localCard4.text}
            onChange={e => setLocalCard4({ ...localCard4, text: e.target.value })}
            rows={2}
            className="text-sm text-black w-full border rounded p-2 mb-2 focus:outline-none focus:border-[#444444]"
          />
          <input
            type="text"
            value={localCard4.icon}
            onChange={e => setLocalCard4({ ...localCard4, icon: e.target.value })}
            placeholder="Font Awesome icon class"
            className="text-sm text-black w-full border rounded p-2 mb-2 focus:outline-none focus:border-[#444444]"
          />
          <div className="mb-4">
            {localCard4List.map((item, idx) => (
              <div key={item.id || item._id || item || globalThis.crypto.randomUUID()} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={e => {
                    const newArr = [...localCard4List];
                    newArr[idx] = e.target.value;
                    setLocalCard4List(newArr);
                  }}
                  placeholder="Item text"
                  className="flex-1 text-sm border rounded p-2 focus:outline-none focus:border-[#444444]"
                />
                <input
                  type="text"
                  value={localCard4ListIcons[idx] || ""}
                  onChange={e => {
                    const newIcons = [...localCard4ListIcons];
                    newIcons[idx] = e.target.value;
                    setLocalCard4ListIcons(newIcons);
                  }}
                  placeholder="Font Awesome icon (fx: fa-desktop)"
                  className="w-40 text-sm border rounded p-2 focus:outline-none focus:border-[#444444]"
                />
                <button
                  className="bg-[#444444] text-white px-2 py-1 rounded"
                  onClick={() => {
                    setLocalCard4List(localCard4List.filter((_, i) => i !== idx));
                    setLocalCard4ListIcons(localCard4ListIcons.filter((_, i) => i !== idx));
                  }}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              className="bg-indigo-600 text-white px-3 py-1 rounded mt-2"
              onClick={() => {
                setLocalCard4List([...localCard4List, ""]);
                setLocalCard4ListIcons([...localCard4ListIcons, ""]);
              }}
            >
              Add item
            </button>
          </div>
          <textarea
            value={localCard4Footer}
            onChange={e => setLocalCard4Footer(e.target.value)}
            rows={2}
            className="w-full text-sm mt-2 border rounded p-2 focus:outline-none focus:border-[#444444]"
          />
        </div>
      </div>
      <div className="flex justify-start gap-3 mt-4">
        <button className="px-4 py-2 rounded bg-[#444444] text-white" onClick={onCancel}>Cancel</button>
        <button
          className="px-4 py-2 rounded bg-indigo-600 text-white"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            setCard1(localCard1);
            setCard2(localCard2);
            setCard3(localCard3);
            setCard4(localCard4);
            setCard4List(localCard4List);
            setCard4ListIcons(localCard4ListIcons);
            setCard4Footer(localCard4Footer);
            await onSave(localCard1, localCard2, localCard3, localCard4, localCard4List, localCard4ListIcons, localCard4Footer);
            setSaving(false);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

EditHomeCards.propTypes = {
  card1: PropTypes.object,
  card2: PropTypes.object,
  card3: PropTypes.object,
  card4: PropTypes.object,
  setCard1: PropTypes.func,
  setCard2: PropTypes.func,
  setCard3: PropTypes.func,
  setCard4: PropTypes.func,
  card4List: PropTypes.array,
  setCard4List: PropTypes.func,
  card4ListIcons: PropTypes.array,
  setCard4ListIcons: PropTypes.func,
  card4Footer: PropTypes.string,
  setCard4Footer: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};
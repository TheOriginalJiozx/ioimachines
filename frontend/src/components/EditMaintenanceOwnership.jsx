import React, { useState } from "react";

export default function EditMaintenanceOwnership({
  maintenance,
  setMaintenance,
  ownership,
  setOwnership,
  onCancel,
  onSave,
  saving
}) {
  const [localMaintenance, setLocalMaintenance] = useState({ ...maintenance });
  const [localOwnership, setLocalOwnership] = useState({ ...ownership });

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="max-w-xl">
        <input
          type="text"
          value={localMaintenance.maintenanceTitle}
          onChange={e => setLocalMaintenance({ ...localMaintenance, maintenanceTitle: e.target.value })}
          className="w-full font-semibold text-lg mb-2 border-b border-gray-200 focus:outline-none focus:border-[#444444] bg-transparent"
        />
        <textarea
          value={localMaintenance.maintenanceBody}
          onChange={e => setLocalMaintenance({ ...localMaintenance, maintenanceBody: e.target.value })}
          rows={2}
          className="w-full text-sm mb-2 border rounded p-2 focus:outline-none focus:border-[#444444]"
        />
        <div className="mb-4">
          {localMaintenance.maintenanceList.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={e => {
                  const newArr = [...localMaintenance.maintenanceList];
                  newArr[idx] = e.target.value;
                  setLocalMaintenance({ ...localMaintenance, maintenanceList: newArr });
                }}
                className="flex-1 text-sm border rounded p-2 focus:outline-none focus:border-[#444444]"
              />
              <button
                className="bg-[#444444] text-white px-2 py-1 rounded"
                onClick={() => setLocalMaintenance({ ...localMaintenance, maintenanceList: localMaintenance.maintenanceList.filter((_, i) => i !== idx) })}
              >✕</button>
            </div>
          ))}
          <button
            className="bg-indigo-600 text-white px-3 py-1 rounded mt-2"
            onClick={() => setLocalMaintenance({ ...localMaintenance, maintenanceList: [...localMaintenance.maintenanceList, ""] })}
          >Add item</button>
        </div>
        <textarea
          value={localMaintenance.maintenanceFooter}
          onChange={e => setLocalMaintenance({ ...localMaintenance, maintenanceFooter: e.target.value })}
          rows={2}
          className="w-full text-sm mb-2 border rounded p-2 focus:outline-none focus:border-[#444444]"
        />
      </div>
      <aside className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
        <input
          type="text"
          value={localOwnership.ownershipTitle}
          onChange={e => setLocalOwnership({ ...localOwnership, ownershipTitle: e.target.value })}
          className="w-full font-semibold text-lg mb-2 border-b border-gray-200 focus:outline-none focus:border-[#444444] bg-transparent"
        />
        <textarea
          value={localOwnership.ownershipBody}
          onChange={e => setLocalOwnership({ ...localOwnership, ownershipBody: e.target.value })}
          rows={2}
          className="w-full text-sm mb-2 border rounded p-2 focus:outline-none focus:border-[#444444]"
        />
        <input
          type="text"
          value={localOwnership.ownershipListTitle}
          onChange={e => setLocalOwnership({ ...localOwnership, ownershipListTitle: e.target.value })}
          className="w-full font-semibold text-base mb-2 border-b border-gray-200 focus:outline-none focus:border-[#444444] bg-transparent"
        />
        <div className="mb-4">
          {localOwnership.ownershipList.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={e => {
                  const newArr = [...localOwnership.ownershipList];
                  newArr[idx] = e.target.value;
                  setLocalOwnership({ ...localOwnership, ownershipList: newArr });
                }}
                className="flex-1 text-sm border rounded p-2 focus:outline-none focus:border-[#444444]"
              />
              <button
                className="bg-[#444444] text-white px-2 py-1 rounded"
                onClick={() => setLocalOwnership({ ...localOwnership, ownershipList: localOwnership.ownershipList.filter((_, i) => i !== idx) })}
              >✕</button>
            </div>
          ))}
          <button
            className="bg-indigo-600 text-white px-3 py-1 rounded mt-2"
            onClick={() => setLocalOwnership({ ...localOwnership, ownershipList: [...localOwnership.ownershipList, ""] })}
          >Add item</button>
        </div>
        <textarea
          value={localOwnership.ownershipFooter}
          onChange={e => setLocalOwnership({ ...localOwnership, ownershipFooter: e.target.value })}
          rows={2}
          className="w-full text-sm mb-2 border rounded p-2 focus:outline-none focus:border-[#444444]"
        />
      </aside>
      <div className="col-span-2 flex gap-2 mt-4">
        <button className="bg-[#444444] text-white px-4 py-2 rounded" onClick={onCancel} disabled={saving}>Cancel</button>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          disabled={saving}
          onClick={async () => {
            setMaintenance(localMaintenance);
            setOwnership(localOwnership);
            await onSave(localMaintenance, localOwnership);
          }}
        >Save</button>
      </div>
    </div>
  );
}

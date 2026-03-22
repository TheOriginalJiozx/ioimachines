import React from "react";
import PropTypes from "prop-types";
import { updateBlock, moveBlockUp, moveBlockDown, deleteBlock } from "../utils/contactEditingUtils";
import { canAddBlock, addBlock } from "../utils/contactBlockAddUtils";

export default function ContactBlockEditor({ blocks, setBlocks, setTitle, title, onCancel, onSave }) {
  if (!blocks || !Array.isArray(blocks)) return null;
  return (
    <div className="editing-feasibility">
      <div className="mb-4">
        <label htmlFor="contact-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input id="contact-title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      {blocks.map((block, index) => (
        <div key={block._id || index} className="border rounded p-3">
          <div className="mb-2 text-sm text-gray-600">Block #{index + 1} — <span className="font-mono">{block.type}</span></div>
          {block.type === "paragraph" && (
            <>
              <div className="mb-2 flex flex-wrap gap-2 items-center">
                <label htmlFor={`contact-block-type-${index}`} className="text-xs text-gray-600">Contact field</label>
                <select id={`contact-block-type-${index}`} value={block.contactType || ''} onChange={event => {
                  const val = event.target.value || null;
                  setBlocks(prev => updateBlock(prev, block._id, { ...block, contactType: val }));
                }} className="p-1 border rounded text-sm">
                  <option value="">— None —</option>
                  <option value="address">Address</option>
                  <option value="email">E-mail</option>
                  <option value="phone">Phone</option>
                  <option value="timing">Timing</option>
                </select>
              </div>
              <label htmlFor={`contact-block-text-${index}`} className="text-xs text-gray-600">Text</label>
              <textarea
                id={`contact-block-text-${index}`}
                value={block.text || ''}
                onChange={event => setBlocks(prev => updateBlock(prev, block._id, { ...block, text: event.target.value }))}
                rows={4}
                className="w-full p-2 border rounded text-sm font-mono"
              />
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                {index > 0 && (
                  <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(prev => moveBlockUp(prev, block._id))}>Move up</button>
                )}
                {index < blocks.length - 1 && (
                  <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(prev => moveBlockDown(prev, block._id))}>Move down</button>
                )}
                <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(prev => deleteBlock(prev, block._id))}>Remove block</button>
              </div>
            </>
          )}
          {block.type === "image" && (
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor={`contact-block-image-upload-${index}`} className="text-xs text-gray-600 mb-2">Replace image (upload)</label>
              <div className="flex gap-2 items-center">
                <label className="bg-white border px-3 py-1 rounded text-sm cursor-pointer">
                  Choose image
                  <input id={`contact-block-image-upload-${index}`} type="file" accept="image/*" onChange={event => {
                    const file = event.target.files && event.target.files[0];
                    if (!file) return;
                    setBlocks(prev => updateBlock(prev, block._id, { ...block, _file: file }));
                  }} className="hidden" />
                </label>
                <div className="text-sm text-gray-600 mt-1">or paste URL below</div>
              </div>
              <label htmlFor={`contact-block-image-url-${index}`} className="text-xs text-gray-600">Or image URL</label>
              <input id={`contact-block-image-url-${index}`} value={block.src || ''} onChange={event => setBlocks(prev => updateBlock(prev, block._id, { ...block, src: event.target.value }))} className="w-full p-2 border rounded text-sm" />
              <label htmlFor={`contact-block-image-alt-${index}`} className="text-xs text-gray-600">Alt text</label>
              <input id={`contact-block-image-alt-${index}`} value={block.alt||''} onChange={event => setBlocks(prev => updateBlock(prev, block._id, { ...block, alt: event.target.value }))} className="w-full p-2 border rounded text-sm" />
              <div className="mt-2">
                {block._file ? (
                  <img src={URL.createObjectURL(block._file)} alt={block.alt||''} className="object-contain w-full h-36" />
                ) : block.src ? (
                  <img src={block.src} alt={block.alt||''} className="object-contain w-full h-36" />
                ) : (
                  <div className="text-sm text-gray-400">No image</div>
                )}
              </div>
              <div className="mt-2"><button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(prev => deleteBlock(prev, block._id))}>Remove block</button></div>
            </div>
          )}
        </div>
      ))}
      <div className="flex gap-2 mt-4">
        <button
          className={`px-3 py-1 border rounded${!canAddBlock(blocks, 'paragraph') ? ' bg-gray-200 text-gray-400 cursor-not-allowed opacity-60' : ''}`}
          onClick={() => setBlocks(prev => addBlock(prev, 'paragraph'))}
          disabled={!canAddBlock(blocks, 'paragraph')}
        >
          Add paragraph
        </button>
        <button
          className={`px-3 py-1 border rounded${!canAddBlock(blocks, 'image') ? ' bg-gray-200 text-gray-400 cursor-not-allowed opacity-60' : ''}`}
          onClick={() => setBlocks(prev => addBlock(prev, 'image'))}
          disabled={!canAddBlock(blocks, 'image')}
        >
          Add image
        </button>
      </div>
      <div className="flex justify-start gap-3 mt-4">
        <button onClick={onCancel} className="px-4 py-2 rounded bg-[#444444] text-white">Cancel</button>
        <button onClick={onSave} className="px-4 py-2 rounded bg-indigo-600 text-white">Save</button>
      </div>
    </div>
  );
}

ContactBlockEditor.propTypes = {
  blocks: PropTypes.array,
  setBlocks: PropTypes.func,
  setTitle: PropTypes.func,
  title: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

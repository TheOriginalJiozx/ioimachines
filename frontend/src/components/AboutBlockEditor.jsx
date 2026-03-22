import React from "react";
import PropTypes from "prop-types";
import { moveUpBlock, moveDownBlock, removeBlock } from "../utils/aboutEditingUtils";

export default function AboutBlockEditor({ blocks, setBlocks, title, setTitle, contentEditor, setContentEditor, onCancel, onSave }) {
  return (
    <div className="editing-feasibility">
      <div className="mb-4">
        <label htmlFor="about-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input id="about-title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      <div className="mb-4">
        <label htmlFor="about-content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        {blocks && Array.isArray(blocks) ? (
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <div key={block._id || index} className="border rounded p-3">
                <div className="mb-2 text-sm text-gray-600">Block #{index + 1} — <span className="font-mono">{block.type}</span></div>
                {block.type === 'paragraph' && (
                  <>
                    <textarea id={`about-block-text-${index}`} value={block.text || ''} onChange={e => {
                      const arr = [...blocks];
                      arr[index] = { ...arr[index], text: e.target.value };
                      setBlocks(arr);
                    }} rows={4} className="w-full p-2 border rounded text-sm font-mono" />
                  </>
                )}
                {block.type === 'image' && (
                  <div className="grid grid-cols-1 gap-2">
                    <label htmlFor={`about-block-image-upload-${index}`} className="text-xs text-gray-600">Upload image</label>
                    <input id={`about-block-image-upload-${index}`} type="file" accept="image/*" onChange={e => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      const arr = [...blocks];
                      arr[index] = { ...arr[index], _file: file };
                      setBlocks(arr);
                    }} className="w-full p-2 border rounded text-sm" />
                    <label htmlFor={`about-block-image-url-${index}`} className="text-xs text-gray-600">Image URL</label>
                    <input id={`about-block-image-url-${index}`} value={block.src || ''} onChange={e => {
                      const arr = [...blocks];
                      arr[index] = { ...arr[index], src: e.target.value };
                      setBlocks(arr);
                    }} className="w-full p-2 border rounded text-sm" />
                    <label htmlFor={`about-block-image-alt-${index}`} className="text-xs text-gray-600">Alt text</label>
                    <input id={`about-block-image-alt-${index}`} value={block.alt || ''} onChange={e => {
                      const arr = [...blocks];
                      arr[index] = { ...arr[index], alt: e.target.value };
                      setBlocks(arr);
                    }} className="w-full p-2 border rounded text-sm" />
                    <div className="mt-2">
                      {block._file ? (
                        <img src={URL.createObjectURL(block._file)} alt={block.alt || ''} className="object-contain w-full h-36" />
                      ) : block.src ? (
                        <img src={block.src} alt={block.alt || ''} className="object-contain w-full h-36" />
                      ) : (
                        <div className="text-sm text-gray-400">No image</div>
                      )}
                    </div>
                  </div>
                )}
                <div className="mt-2 flex gap-2">
                  <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(moveUpBlock(blocks, index))} disabled={index === 0}>Move up</button>
                  <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(moveDownBlock(blocks, index))} disabled={index >= blocks.length - 1}>Move down</button>
                  <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(removeBlock(blocks, index))}>Remove block</button>
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <button className="bg-indigo-600 text-white px-3 py-1 rounded" onClick={() => setBlocks([...(blocks || []), { _id: Date.now().toString(), type: 'paragraph', text: '' }])}>Add paragraph</button>
              <button className="bg-white text-[#444444] border border-[#444444] px-3 py-1 rounded" onClick={() => setBlocks([...(blocks || []), { _id: Date.now().toString(), type: 'image', src: '', alt: '' }])}>Add image</button>
            </div>
          </div>
        ) : (
          <textarea value={contentEditor} onChange={e => setContentEditor(e.target.value)} rows={6} className="w-full px-4 py-2 border rounded" />
        )}
      </div>
      <div className="flex justify-start gap-3 mt-4">
        <button onClick={onCancel} className="px-4 py-2 rounded bg-[#444444] text-white">Cancel</button>
        <button onClick={onSave} className="px-4 py-2 rounded bg-indigo-600 text-white">Save</button>
      </div>
    </div>
  );
}

AboutBlockEditor.propTypes = {
  blocks: PropTypes.array,
  setBlocks: PropTypes.func,
  title: PropTypes.string,
  setTitle: PropTypes.func,
  contentEditor: PropTypes.string,
  setContentEditor: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

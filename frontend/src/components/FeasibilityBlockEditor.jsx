import React from "react";
import PropTypes from "prop-types";
import { canAddBlock, addBlock } from "../utils/feasibilityBlockAddUtils";
import { updateBlock, moveBlockUp, moveBlockDown, deleteBlock } from "../utils/feasibilityBlockEditingUtils";
import { getListBlockEditorValue, parseListBlockEditorValue } from "../utils/feasibilityListBlockUtils";

export default function FeasibilityBlockEditor({ block, index, blocks, setBlocks, hideMoveDown }) {
  if (!blocks || !Array.isArray(blocks)) return null;
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <div key={block._id || index} className="border rounded p-3">
          <div className="mb-2 text-sm text-gray-600">
            Block #{index + 1} — <span className="font-mono">{block.title ? (block.title.charAt(0).toLowerCase() + block.title.slice(1).toLowerCase()) : block.type}</span>
          </div>
          {block.type === "paragraph" && !(block.title && String(block.title).toLowerCase().includes("images") && !String(block.title).toLowerCase().includes("image text")) && (
            <>
              <textarea
                value={block.text || ""}
                onChange={event => setBlocks(prev => updateBlock(prev, block._id, { ...block, text: event.target.value }))}
                rows={6}
                className="w-full p-2 border rounded text-sm font-mono"
              />
              {block._file && (
                <div className="mt-2">
                  <img src={URL.createObjectURL(block._file)} alt="uploaded" className="w-full h-24 object-cover rounded mb-1" />
                  <button
                    className="px-2 py-1 rounded border text-xs"
                    onClick={() => setBlocks(prev => updateBlock(prev, block._id, { ...block, _file: undefined }))}
                  >
                    Remove image
                  </button>
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                <label htmlFor={`feasibility-block-image-upload-${index}`} className="bg-white border px-3 py-1 rounded text-sm cursor-pointer mb-1">
                  Add image
                  <input id={`feasibility-block-image-upload-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={event => {
                      const file = event.target.files && event.target.files[0];
                      if (!file) return;
                      setBlocks(prev => updateBlock(prev, block._id, { ...block, _file: file }));
                    }}
                    className="hidden"
                  />
                </label>
                <button
                  className="px-2 py-1 rounded border text-sm mt-1"
                  onClick={() => setBlocks(prev => deleteBlock(prev, block._id))}
                >
                  Remove block
                </button>
              </div>
            </>
          )}
          {block.type === "list" && (
            <>
              <label htmlFor={`feasibility-list-items-${index}`} className="text-xs text-gray-600 block">
                {block.title && block.title.toLowerCase() === "process"
                  ? "Items (one per line, end with ;)"
                  : block._isSemicolonList
                  ? "Text and items (items end with ;)"
                  : block.style === "decimal"
                  ? "Scope items (one per line)"
                  : "List items (one per line)"}
              </label>
              <textarea
                id={`feasibility-list-items-${index}`}
                value={getListBlockEditorValue(block)}
                onChange={event => setBlocks(prev => updateBlock(prev, block._id, { ...block, _editorValue: event.target.value }))}
                onBlur={event => {
                  const parsed = parseListBlockEditorValue(block, event.target.value);
                  setBlocks(prev => updateBlock(prev, block._id, { ...block, ...parsed, _editorValue: undefined }));
                }}
                rows={6}
                className="w-full p-2 border rounded text-sm font-mono"
              />
              <div className="mt-2 flex gap-2 flex-wrap">
                {index > 0 && (
                  <button
                    className="px-2 py-1 rounded border text-sm"
                    onClick={() => setBlocks(prev => moveBlockUp(prev, block._id))}
                  >
                    Move up
                  </button>
                )}
                {!hideMoveDown && (
                  <button
                    className="px-2 py-1 rounded border text-sm"
                    onClick={() => setBlocks(prev => moveBlockDown(prev, block._id))}
                    disabled={index === blocks.length - 1}
                  >
                    Move down
                  </button>
                )}
                <button
                  className="px-2 py-1 rounded border text-sm"
                  onClick={() => setBlocks(prev => deleteBlock(prev, block._id))}
                >
                  Remove block
                </button>
              </div>
            </>
          )}
          {block.type === "image" && (
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor={`feasibility-image-upload-${index}`} className="text-xs text-gray-600">Replace image (upload)</label>
              <div className="flex items-center gap-2">
                <label htmlFor={`feasibility-image-upload-input-${index}`} className="bg-white border px-3 py-1 rounded text-sm cursor-pointer">
                  Choose image
                  <input
                    id={`feasibility-image-upload-input-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={event => {
                      const file = event.target.files && event.target.files[0];
                      if (!file) return;
                      const preview = URL.createObjectURL(file);
                      setBlocks(prev => updateBlock(prev, block._id, { ...block, _file: file, src: preview }));
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              <label htmlFor={`feasibility-image-url-${index}`} className="text-xs text-gray-600">Or image URL</label>
              <input
                id={`feasibility-image-url-${index}`}
                value={block.src || ""}
                onChange={event => setBlocks(prev => updateBlock(prev, block._id, { ...block, src: event.target.value || "" }))}
                className="w-full p-2 border rounded text-sm"
              />
              <label htmlFor={`feasibility-image-alt-${index}`} className="text-xs text-gray-600">Alt text</label>
              <input
                id={`feasibility-image-alt-${index}`}
                value={block.alt || ""}
                onChange={event => setBlocks(prev => updateBlock(prev, block._id, { ...block, alt: event.target.value }))}
                className="w-full p-2 border rounded text-sm"
              />
              <div className="mt-2">{block.src ? <img src={block.src} alt={block.alt && block.alt.trim() !== "" ? block.alt : "Feasibility image"} className="object-contain w-full h-36 rounded" /> : <div className="text-sm text-gray-400">No image</div>}</div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {index > 0 && (
                  <button
                    className="px-2 py-1 rounded border text-sm"
                    onClick={() => setBlocks(prev => moveBlockUp(prev, block._id))}
                  >
                    Move up
                  </button>
                )}
                {index < blocks.length - 1 && (
                  <button
                    className="px-2 py-1 rounded border text-sm"
                    onClick={() => setBlocks(prev => moveBlockDown(prev, block._id))}
                  >
                    Move down
                  </button>
                )}
                <button
                  className="px-2 py-1 rounded border text-sm"
                  onClick={() => setBlocks(prev => deleteBlock(prev, block._id))}
                >
                  Remove block
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <FeasibilityBlockAddButtons blocks={blocks} setBlocks={setBlocks} />
    </div>
  );
}

FeasibilityBlockEditor.propTypes = {
  block: PropTypes.object,
  index: PropTypes.number,
  blocks: PropTypes.array,
  setBlocks: PropTypes.func,
  hideMoveDown: PropTypes.bool,
};

function FeasibilityBlockAddButtons({ blocks, setBlocks }) {
  return (
    <div className="flex gap-2 flex-wrap mt-4">
      <button
        className="bg-white border px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canAddBlock(blocks, "image")}
        onClick={() => setBlocks(prev => addBlock(prev, "image"))}
      >
        Add image
      </button>
      <button
        className="bg-white border px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canAddBlock(blocks, "paragraph-image-text")}
        onClick={() => setBlocks(prev => addBlock(prev, "paragraph-image-text"))}
      >
        Add image text
      </button>
      <button
        className="bg-white border px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canAddBlock(blocks, "list-process")}
        onClick={() => setBlocks(prev => addBlock(prev, "list-process"))}
      >
        Add process
      </button>
      <button
        className="bg-white border px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canAddBlock(blocks, "list-scope")}
        onClick={() => setBlocks(prev => addBlock(prev, "list-scope"))}
      >
        Add scope & approach
      </button>
      <button
        className="bg-white border px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canAddBlock(blocks, "list-deliverables")}
        onClick={() => setBlocks(prev => addBlock(prev, "list-deliverables"))}
      >
        Add deliverables
      </button>
    </div>
  );
}

FeasibilityBlockAddButtons.propTypes = {
  blocks: PropTypes.array,
  setBlocks: PropTypes.func,
};
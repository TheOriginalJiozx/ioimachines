import React from "react";
import {
  moveBlockUp,
  moveBlockDown,
  deleteBlock,
  updateBlock,
} from "../utils/ipcoreBlockEditingUtils";
import PropTypes from "prop-types";
import { canAddBlock, addBlock } from "../utils/ipcoreBlockAddUtils";
import { getListBlockEditorValue, parseListBlockEditorValue } from "../utils/ipcoreListBlockUtils";

export default function IPCoreBlockEditor({ block, index, blocks, setBlocks, hideMoveDown }) {
  if (!block) return null;



  return (
    <div className="border rounded p-3 mb-4">
      <div className="mb-2 text-sm text-gray-600">
        Block #{index + 1} —{" "}
        <span className="font-mono">{block.title ? block.title : block.type}</span>
      </div>
      {block.type === "paragraph" && (
        <textarea
          value={block.text || ""}
          onChange={(e) => {
            setBlocks(updateBlock(blocks, block._id, { ...block, text: e.target.value }));
          }}
          rows={6}
          className="w-full p-2 border rounded text-sm font-mono"
        />
      )}
      {block.type === "list" && (
        <textarea
          value={getListBlockEditorValue(block)}
          onChange={(e) => {
            const parsed = parseListBlockEditorValue(block, e.target.value);
            setBlocks(updateBlock(blocks, block._id, { ...block, ...parsed }));
          }}
          rows={6}
          className="w-full p-2 border rounded text-sm font-mono"
        />
      )}

      {block.type === "image" && !Array.isArray(block.images) && (
        <div className="mb-2 flex flex-col items-start gap-2">
          <label htmlFor={`ipcore-block-image-upload-${index}`} className="text-xs text-gray-600">Replace image (upload)</label>
          <div className="flex items-center gap-2 mb-1">
            <label className="bg-white border px-3 py-1 rounded text-sm cursor-pointer">
              Choose image
              <input id={`ipcore-block-image-upload-${index}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  setBlocks(updateBlock(blocks, block._id, { ...block, _file: file }));
                }}
              />
            </label>
          </div>
          <label htmlFor={`ipcore-block-image-url-${index}`} className="text-xs text-gray-600">Or image URL</label>
          <input
            id={`ipcore-block-image-url-${index}`}
            value={block.src || ""}
            onChange={(e) =>
              setBlocks(updateBlock(blocks, block._id, { ...block, src: e.target.value || "" }))
            }
            className="w-full p-2 border rounded text-sm mb-1"
          />
          <label htmlFor={`ipcore-block-image-alt-${index}`} className="text-xs text-gray-600">Alt text</label>
          <input
            id={`ipcore-block-image-alt-${index}`}
            value={block.alt || ""}
            onChange={(e) =>
              setBlocks(updateBlock(blocks, block._id, { ...block, alt: e.target.value }))
            }
            className="w-full p-2 border rounded text-sm mb-1"
          />
          <div className="mt-2">
            {block._file ? (
              <img
                src={URL.createObjectURL(block._file)}
                alt={block.alt || ""}
                className="object-contain w-32 h-24 border rounded"
              />
            ) : block.src ? (
              <img
                src={block.src}
                alt={block.alt || ""}
                className="object-contain w-32 h-24 border rounded"
              />
            ) : (
              <div className="text-sm text-gray-400">No image</div>
            )}
          </div>
        </div>
      )}

      {/* Only allow multi-image for Signature Algorithm Images */}
      {block.type === "image" &&
        block.title === "Signature Algorithm Images" &&
        Array.isArray(block.images) && (
          <div className="mb-2">
            <div className="flex gap-4 mb-2">
              {block.images.map((img, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <img
                    src={img}
                    alt={block.title || "image"}
                    className="object-contain w-32 h-24 border rounded mb-1"
                  />
                  <button
                    className="px-1 py-0.5 rounded border text-xs mt-1"
                    onClick={() => {
                      const newImgs = block.images.slice();
                      newImgs.splice(idx, 1);
                      setBlocks(updateBlock(blocks, block._id, { ...block, images: newImgs }));
                    }}>
                    Remove
                  </button>
                </div>
              ))}
              {block.images.length < 3 && (
                <label className="flex flex-col items-center justify-center w-32 h-24 border rounded cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <span className="text-xs text-gray-500">Add image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const newImgs = (block.images || []).concat(ev.target.result).slice(0, 3);
                        setBlocks(updateBlock(blocks, block._id, { ...block, images: newImgs }));
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        )}

      <div className="mt-2 flex flex-wrap gap-2 items-center">
        {index > 0 && (
          <button
            className="px-2 py-1 rounded border text-sm"
            onClick={() => setBlocks(moveBlockUp(blocks, block._id))}>
            Move up
          </button>
        )}
        {!hideMoveDown && (
          <button
            className="px-2 py-1 rounded border text-sm"
            onClick={() => setBlocks(moveBlockDown(blocks, block._id))}
            disabled={index === blocks.length - 1}
          >
            Move down
          </button>
        )}
        <button
          className="px-2 py-1 rounded border text-sm"
          onClick={() => setBlocks(deleteBlock(blocks, block._id))}>
          Remove block
        </button>
      </div>
    </div>
  );
}

IPCoreBlockEditor.propTypes = {
  block: PropTypes.object,
  index: PropTypes.number,
  blocks: PropTypes.array,
  setBlocks: PropTypes.func,
  hideMoveDown: PropTypes.bool,
};

export function IPCoreBlockAddButtons({ blocks, setBlocks }) {
  const disabledClass = "opacity-50 cursor-not-allowed";
  const hasImageBlock = Array.isArray(blocks) && blocks.some(b => b.type === "image" && (!b.title || b.title === "Image"));
  return (
    <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
      <button
        className={`px-2 py-1 rounded border text-sm ${hasImageBlock ? disabledClass : ""}`}
        disabled={hasImageBlock}
        onClick={() => setBlocks(addBlock(blocks, "image"))}>
        Add Image
      </button>
      <button
        className={`px-2 py-1 rounded border text-sm ${!canAddBlock(blocks, "paragraph-image-text") ? disabledClass : ""}`}
        disabled={!canAddBlock(blocks, "paragraph-image-text")}
        onClick={() => setBlocks(addBlock(blocks, "paragraph-image-text"))}>
        Add Image Text
      </button>
      <button
        className={`px-2 py-1 rounded border text-sm ${!canAddBlock(blocks, "list-process") ? disabledClass : ""}`}
        disabled={!canAddBlock(blocks, "list-process")}
        onClick={() => setBlocks(addBlock(blocks, "list-process"))}>
        Add Process
      </button>
      <button
        className={`px-2 py-1 rounded border text-sm ${!canAddBlock(blocks, "list-scope") ? disabledClass : ""}`}
        disabled={!canAddBlock(blocks, "list-scope")}
        onClick={() => setBlocks(addBlock(blocks, "list-scope"))}>
        Add Scope & Approach
      </button>
      <button
        className={`px-2 py-1 rounded border text-sm ${!canAddBlock(blocks, "list-gui-functions") ? disabledClass : ""}`}
        disabled={!canAddBlock(blocks, "list-gui-functions")}
        onClick={() => setBlocks(addBlock(blocks, "list-gui-functions"))}>
        Add GUI Functions
      </button>
      <button
        className={`px-2 py-1 rounded border text-sm ${!canAddBlock(blocks, "image-signature-algorithm") ? disabledClass : ""}`}
        disabled={!canAddBlock(blocks, "image-signature-algorithm")}
        onClick={() => setBlocks(addBlock(blocks, "image-signature-algorithm"))}>
        Add Signature Algorithm Images
      </button>
      <button
        className={`px-2 py-1 rounded border text-sm ${!canAddBlock(blocks, "paragraph-signature-algorithm") ? disabledClass : ""}`}
        disabled={!canAddBlock(blocks, "paragraph-signature-algorithm")}
        onClick={() => setBlocks(addBlock(blocks, "paragraph-signature-algorithm"))}>
        Add Signature Algorithm
      </button>
    </div>
  );
}

IPCoreBlockAddButtons.propTypes = {
  blocks: PropTypes.array,
  setBlocks: PropTypes.func,
};

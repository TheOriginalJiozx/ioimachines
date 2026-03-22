import React from "react";
import {
  updateBlock,
  moveBlockUp,
  moveBlockDown,
  deleteBlock
} from "../utils/turnkeyBlockEditingUtils";
import { canAddBlock, addBlock } from "../utils/turnkeyBlockAddUtils";
import { getListBlockEditorValue, parseListBlockEditorValue } from "../utils/turnkeyListBlockUtils";

import PropTypes from "prop-types";
export default function TurnkeyBlockEditor({ block, index, blocks, setBlocks, hideMoveDown }) {
  const blockCount = blocks.length;

  if (!block) return null;

  if (block.type === "paragraph" && !(block.title && (String(block.title).toLowerCase().includes("signature") || String(block.title).toLowerCase().includes("image")))) {
    return (
      <div className="border rounded p-3">
        <div className="mb-2 text-sm text-gray-600">
          Block #{index + 1} — <span className="font-mono">{block.title ? (block.title.charAt(0).toLowerCase() + block.title.slice(1).toLowerCase()) : block.type}</span>
        </div>
        <label htmlFor={`turnkey-paragraph-${index}`} className="sr-only">Paragraph</label>
        <textarea id={`turnkey-paragraph-${index}`} value={block.text || ""}
          onChange={event => setBlocks(blocks => updateBlock(blocks, block._id, { ...block, text: event.target.value }))}
          rows={6}
          className="w-full p-2 border rounded text-sm font-mono"
        />

        <div className="mt-2 flex flex-wrap gap-2 items-center">
          <label className="bg-white border px-3 py-1 rounded text-sm cursor-pointer">
            Add image
            <input type="file"
              accept="image/*"
              onChange={event => {
                const file = event.target.files && event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                  setBlocks(blocks => updateBlock(blocks, block._id, { ...block, images: [...(block.images || []), e.target.result] }));
                };
                reader.readAsDataURL(file);
              }}
              className="hidden"
            />
          </label>
          {index > 0 && (
            <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(blocks => moveBlockUp(blocks, block._id))}>Move up</button>
          )}
          {!hideMoveDown && (
            <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(blocks => moveBlockDown(blocks, block._id))} disabled={index === blockCount - 1}>Move down</button>
          )}
          <button className="px-2 py-1 rounded border text-sm text-red-600 border-red-600" onClick={() => setBlocks(blocks => deleteBlock(blocks, block._id))}>Remove block</button>
          <button
            className="px-2 py-1 rounded border text-sm bg-green-100"
            disabled={!canAddBlock(blocks, 'paragraph')}
            onClick={() => setBlocks(blocks => addBlock(blocks, 'paragraph'))}
          >
            Add Paragraph
          </button>
          <button
            className="px-2 py-1 rounded border text-sm bg-blue-100"
            disabled={!canAddBlock(blocks, 'image')}
            onClick={() => setBlocks(blocks => addBlock(blocks, 'image'))}
          >
            Add Image
          </button>
          <button
            className="px-2 py-1 rounded border text-sm bg-yellow-100"
            disabled={!canAddBlock(blocks, 'list-service')}
            onClick={() => setBlocks(blocks => addBlock(blocks, 'list-service'))}
          >
            Add Service List
          </button>
          <button
            className="px-2 py-1 rounded border text-sm bg-yellow-100"
            disabled={!canAddBlock(blocks, 'list-deliverables')}
            onClick={() => setBlocks(blocks => addBlock(blocks, 'list-deliverables'))}
          >
            Add Deliverables
          </button>
          <button
            className="px-2 py-1 rounded border text-sm bg-yellow-100"
            disabled={!canAddBlock(blocks, 'list-scope')}
            onClick={() => setBlocks(blocks => addBlock(blocks, 'list-scope'))}
          >
            Add Scope & Approach
          </button>
          <button
            className="px-2 py-1 rounded border text-sm bg-yellow-100"
            disabled={!canAddBlock(blocks, 'list-process')}
            onClick={() => setBlocks(blocks => addBlock(blocks, 'list-process'))}
          >
            Add Process
          </button>
        </div>
      </div>
    );
  }

  if (block.type === "paragraph" && block.title && String(block.title).toLowerCase().includes("image text")) {
    return (
      <div className="border rounded p-3">
        <div className="mb-2 text-sm text-gray-600">
          Block #{index + 1} — <span className="font-mono">{block.title}</span>
        </div>
        <textarea value={block.text || ""}
          onChange={event => setBlocks(blocks => updateBlock(blocks, block._id, { ...block, text: event.target.value }))}
          rows={6}
          className="w-full p-2 border rounded text-sm font-mono"
        />

        <div className="mt-2 flex gap-2 flex-wrap">
          {index > 0 && (
            <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(blocks => moveBlockUp(blocks, block._id))}>Move up</button>
          )}
          {!hideMoveDown && (
            <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(blocks => moveBlockDown(blocks, block._id))} disabled={index === blockCount - 1}>Move down</button>
          )}
          <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(blocks => deleteBlock(blocks, block._id))}>Remove block</button>
        </div>
      </div>
    );
  }

  if (block.type === "heading") {
    return (
      <div className="border rounded p-3">
        <input type="text"
          value={block.text || ""}
          onChange={event => setBlocks(blocks => updateBlock(blocks, block._id, { ...block, text: event.target.value }))}
          className="w-full p-2 border rounded text-sm"
          placeholder="Heading text"
        />
        <div className="mt-2 flex gap-2 flex-wrap">
          {index > 0 && (
            <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(blocks => moveBlockUp(blocks, block._id))}>Move up</button>
          )}
          {!hideMoveDown && (
            <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(blocks => moveBlockDown(blocks, block._id))} disabled={index === blockCount - 1}>Move down</button>
          )}
          <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(blocks => deleteBlock(blocks, block._id))}>Remove block</button>
        </div>
      </div>
    );
  }

  if (block.type === "list") {
    return (
      <div className="border rounded p-3">
        <label htmlFor={`turnkey-list-items-${index}`} className="text-xs text-gray-600 block">
          {block._isSemicolonList ? "Text and items (items end with ;)" : "List items (one per line)"}
        </label>
        <textarea id={`turnkey-list-items-${index}`} value={getListBlockEditorValue(block)}
          onChange={event => setBlocks(blocks => updateBlock(blocks, block._id, { ...block, _editorValue: event.target.value }))}
          onBlur={event => {
            const parsed = parseListBlockEditorValue(block, event.target.value);
            setBlocks(blocks => updateBlock(blocks, block._id, { ...block, ...parsed, _editorValue: undefined }));
          }}
          rows={6}
          className="w-full p-2 border rounded text-sm font-mono"
        />
        <div className="mt-2 flex gap-2 flex-wrap">
          {index > 0 && (
            <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(blocks => moveBlockUp(blocks, block._id))}>Move up</button>
          )}
          {!hideMoveDown && (
            <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(blocks => moveBlockDown(blocks, block._id))} disabled={index === blockCount - 1}>Move down</button>
          )}
          <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(blocks => deleteBlock(blocks, block._id))}>Remove block</button>
        </div>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <div className="border rounded p-3">
        <label htmlFor={`turnkey-image-upload-${index}`} className="text-xs text-gray-600">Replace image (upload)</label>
        <div className="flex items-center gap-2">
          <label htmlFor={`turnkey-image-upload-input-${index}`} className="bg-white border px-3 py-1 rounded text-sm cursor-pointer">
            Choose image
            <input id={`turnkey-image-upload-input-${index}`} type="file"
              accept="image/*"
              onChange={event => {
                const file = event.target.files && event.target.files[0];
                if (!file) return;
                try {
                  const preview = URL.createObjectURL(file);
                  setBlocks(blocks => updateBlock(blocks, block._id, { ...block, _file: file, src: preview, alt: block.alt || "image", _autoAlt: false }));
                } catch (error) {
                  console.error("preview failed", error);
                }
              }}
              className="hidden"
            />
          </label>
        </div>
        <label htmlFor={`turnkey-image-url-${index}`} className="text-xs text-gray-600">Or image URL</label>
        <input id={`turnkey-image-url-${index}`} value={block.src || ""}
          onChange={event => setBlocks(blocks => updateBlock(blocks, block._id, { ...block, src: event.target.value || "", alt: block.alt || "image", _autoAlt: false }))}
          className="w-full p-2 border rounded text-sm"
        />
        <label htmlFor={`turnkey-image-alt-${index}`} className="text-xs text-gray-600">Alt text</label>
        <input id={`turnkey-image-alt-${index}`} value={block.alt || ""}
          onChange={event => setBlocks(blocks => updateBlock(blocks, block._id, { ...block, alt: event.target.value, _autoAlt: false }))}
          className="w-full p-2 border rounded text-sm"
        />
        <div className="mt-2">{block.src ? <img src={block.src} alt={block.alt || ""} className="object-contain w-full h-36 rounded" /> : <div className="text-sm text-gray-400">No image</div>}</div>
        <div className="mt-2 flex gap-2 flex-wrap">
          {index > 0 && (
            <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(blocks => moveBlockUp(blocks, block._id))}>Move up</button>
          )}
          <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(blocks => moveBlockDown(blocks, block._id))} disabled={index === blockCount - 1}>Move down</button>
          <button className="px-2 py-1 rounded border text-sm" onClick={() => setBlocks(blocks => deleteBlock(blocks, block._id))}>Remove block</button>
        </div>
      </div>
    );
  }

  return null;
}

TurnkeyBlockEditor.propTypes = {
  block: PropTypes.object,
  index: PropTypes.number,
  blocks: PropTypes.array,
  setBlocks: PropTypes.func,
  hideMoveDown: PropTypes.bool,
};

export function TurnkeyBlockAddButtons({ blocks, setBlocks }) {
  const disabledClass = "opacity-50 cursor-not-allowed";
  return (
    <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
      <button
        className={`px-2 py-1 rounded border text-sm ${!canAddBlock(blocks, "list-inhouse") ? disabledClass : ""}`}
        disabled={!canAddBlock(blocks, "list-inhouse")}
        onClick={() => setBlocks(addBlock(blocks, "list-inhouse"))}
      >
        Add Inhouse Competencies
      </button>
      <button
        className={`px-2 py-1 rounded border text-sm ${!canAddBlock(blocks, "list-service") ? disabledClass : ""}`}
        disabled={!canAddBlock(blocks, "list-service")}
        onClick={() => setBlocks(addBlock(blocks, "list-service"))}
      >
        Add Service Description
      </button>
      <button
        className={`px-2 py-1 rounded border text-sm ${!canAddBlock(blocks, "list-scope") ? disabledClass : ""}`}
        disabled={!canAddBlock(blocks, "list-scope")}
        onClick={() => setBlocks(addBlock(blocks, "list-scope"))}
      >
        Add Scope & Approach
      </button>
      <button
        className={`px-2 py-1 rounded border text-sm ${!canAddBlock(blocks, "paragraph-image-text") ? disabledClass : ""}`}
        disabled={!canAddBlock(blocks, "paragraph-image-text")}
        onClick={() => setBlocks(addBlock(blocks, "paragraph-image-text"))}
      >
        Add Image Text
      </button>
      <button
        className={`px-2 py-1 rounded border text-sm ${!canAddBlock(blocks, "image") ? disabledClass : ""}`}
        disabled={!canAddBlock(blocks, "image")}
        onClick={() => setBlocks(addBlock(blocks, "image"))}
      >
        Add Image
      </button>
      <button
        className={`px-2 py-1 rounded border text-sm ${!canAddBlock(blocks, "list-process") ? disabledClass : ""}`}
        disabled={!canAddBlock(blocks, "list-process")}
        onClick={() => setBlocks(addBlock(blocks, "list-process"))}
      >
        Add Process
      </button>
    </div>
  );
}

TurnkeyBlockAddButtons.propTypes = {
  blocks: PropTypes.array,
  setBlocks: PropTypes.func,
};
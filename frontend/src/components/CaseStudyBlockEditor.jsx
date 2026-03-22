import React from "react";
import PropTypes from "prop-types";

export default function CaseStudyBlockEditor({ block, onChange, onMoveUp, onMoveDown, onDelete, index }) {
  if (!block) return null;
  return (
    <div className="border rounded p-3 mb-4">
      <div className="mb-2 text-sm text-gray-600">
        Block #{typeof index === 'number' ? index + 1 : block._id} — <span className="font-mono">{block.type}</span>
      </div>
      {block.type === "paragraph" && (
        <textarea
          value={block.text || ""}
          onChange={e => onChange(block._id, { ...block, text: e.target.value })}
          rows={4}
          className="w-full p-2 border rounded text-sm font-mono"
        />
      )}
      {block.type === "image" && (
        <div className="flex flex-col gap-2">
          <label htmlFor={`case-block-image-upload-${index}`} className="bg-transparent border border-black text-black px-3 py-1 rounded cursor-pointer w-fit transition hover:bg-black/10">
            Upload image
            <input id={`case-block-image-upload-${index}`}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                let alt = block.alt || '';
                if (!alt && file.name) alt = file.name.replaceAll(/\.[^/.]+$/, '').replaceAll('-', ' ').replaceAll('_', ' ');
                onChange(block._id, { ...block, _file: file, alt, _autoAlt: true });
              }}
            />
          </label>
          <label htmlFor={`case-block-image-url-${index}`} className="text-xs text-gray-600">Image URL</label>
          <input
            id={`case-block-image-url-${index}`}
            type="text"
            value={block.src || ""}
            onChange={e => onChange(block._id, { ...block, src: e.target.value })}
            className="w-full p-2 border rounded text-sm font-mono"
            placeholder="Image URL"
          />
          {(() => {
            if (block?._file) {
              return <img src={URL.createObjectURL(block._file)} alt={block.alt || ''} className="object-contain w-full max-h-40 rounded border" style={{ marginTop: 8 }} />;
            }
            if (block?.src || block?.url) {
              return <img src={block.src || block.url} alt={block.alt || ''} className="object-contain w-full max-h-40 rounded border" style={{ marginTop: 8 }} />;
            }
            return null;
          })()}
          <label htmlFor={`case-block-image-alt-${index}`} className="text-xs text-gray-600">Alt text</label>
          <input
            id={`case-block-image-alt-${index}`}
            type="text"
            value={block.alt || ""}
            onChange={e => onChange(block._id, { ...block, alt: e.target.value })}
            className="w-full p-2 border rounded text-sm font-mono"
            placeholder="Alt text"
          />
        </div>
      )}
      <div className="mt-2 flex flex-wrap gap-2 items-center">
        <button className="px-2 py-1 rounded border text-sm" onClick={() => onMoveUp(block._id)}>Move up</button>
        <button className="px-2 py-1 rounded border text-sm" onClick={() => onMoveDown(block._id)}>Move down</button>
        <button className="px-2 py-1 rounded border text-sm text-red-600 border-red-600" onClick={() => onDelete(block._id)}>Delete</button>
      </div>
    </div>
  );
}
CaseStudyBlockEditor.propTypes = {
  block: PropTypes.object,
  onChange: PropTypes.func,
  onMoveUp: PropTypes.func,
  onMoveDown: PropTypes.func,
  onDelete: PropTypes.func,
  index: PropTypes.number,
};

// Custom About block renderer (migrated from About.jsx)
import React from "react";

export function renderBlockAbout(block, index) {
  if (!block) return null;
  switch (block.type) {
    case "paragraph": {
      const text = block.text || "";
      const m = text.match(/^(.*?:)\s*(.+)$/);
      if (m) {
        const prefix = m[1];
        const rest = m[2];
        const items = rest.split(/\s*;\s*/).map((s) => s.trim()).filter(Boolean);
        if (items.length > 1) {
          return (
            <div key={index} className="mb-4">
              <p className="text-[15px] text-[#444444] leading-relaxed mb-2">{prefix}</p>
              <ul className="list-disc pl-6 text-[15px] text-[#444444] mb-4">
                {items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            </div>
          );
        }
      }
      return (
        <p key={index} className="text-[15px] text-[#444444] leading-relaxed mb-4">
          {block.text}
        </p>
      );
    }
    case "heading":
      if (block.level === 2)
        return (
          <h2 key={index} className="text-2xl font-bold mb-3">
            {block.text}
          </h2>
        );
      if (block.level === 3)
        return (
          <h3 key={index} className="text-xl font-semibold mb-2">
            {block.text}
          </h3>
        );
      return (
        <h4 key={index} className="font-semibold mb-2">
          {block.text}
        </h4>
      );
    case "image":
      return (
        <div key={index} className="w-full mb-4 overflow-hidden rounded shadow">
          <img src={block.src} alt={block.alt || ""} className="w-full md:h-[28rem] object-cover" />
        </div>
      );
    case "list":
      return (
        <ul key={index} className={`list-${block.style || "disc"} pl-5 text-[15px] text-[#444444] mb-4`}>
          {(block.items || []).map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    default:
      return <div key={index} dangerouslySetInnerHTML={{ __html: block.html || "" }} />;
  }
}

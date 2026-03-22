import React from "react";

export function feasibilityBlockRender(block, index) {
  if (!block) return null;
  switch (block.type) {
    case "paragraph": {
      const hideTitle = block.title && (block.title.toLowerCase().includes("image text") || block.title.toLowerCase().includes("images"));
      const isProcessBlock = block.title && block.title.toLowerCase() === "process";
      const hasSemicolons = block.text && block.text.includes(";");
      if (isProcessBlock && hasSemicolons) {
        const items = block.text.split(";").map(item => item.trim()).filter(item => item.length > 0);
        return (
          <div key={index} className="mb-4">
            {block.title && !hideTitle && <h2 className="text-[56px] font-semibold text-[#222222] mb-3">{block.title}</h2>}
            <ul style={{ listStyle: 'disc', marginLeft: '1.5rem' }} className="mt-4 space-y-2 text-[15px] text-[#444444]">
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        );
      }
      return (
        <div key={index} className="mb-4">
          {block.title && !hideTitle && <h3 className="text-[24px] font-semibold text-[#222222] mb-2">{block.title}</h3>}
          <div className="whitespace-pre-wrap text-[15px] text-[#444444]">{block.text}</div>
          {block.images && block.images.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {block.images.map((img, i) => (
                <img key={i} src={img} alt={`image-${i}`} className="w-full h-28 sm:h-32 md:h-40 object-contain bg-white p-2 rounded" />
              ))}
            </div>
          )}
        </div>
      );
    }
    case "image":
      return (
        <div key={index} className="mb-4">
          <img src={block.src} alt={block.alt || ""} className="w-full rounded shadow" />
        </div>
      );
    case "list": {
      const hideTitle = block.title && block.title.toLowerCase() === "gui functions";
      const ListTag = block.style === "decimal" ? "ol" : "ul";
      const isScope = block.style === "decimal";
      const displayItems = (block.items || []).map(item => {
        if (block.title && block.title.toLowerCase() === "process" && item && typeof item === 'string') {
          return item.replaceAll(/;+$/, '').trim();
        }
        return item;
      });
      if (isScope) {
        return (
          <div key={index} className="mt-8 bg-[#FAFAFA] p-6 rounded shadow-sm">
            <h3 className="text-[20px] font-semibold mb-3 text-[#222222]">Scope & Approach</h3>
            <ListTag className="list-decimal pl-8 space-y-2 text-[15px] text-[#444444]">
              {displayItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ListTag>
          </div>
        );
      }
      return (
        <div key={index} className="mb-4">
          {block.title && !hideTitle && <h2 className={`${block.title === "Process" ? "text-[56px]" : "text-[40px]"} font-semibold text-[#222222] mb-3`}>{block.title}</h2>}
          {block.extraText && block.extraText.length > 0 && (
            <div className="mb-3 text-[15px] text-[#444444]">
              {block.extraText.map((text, i) => (
                <p key={i} className="mb-2">{text}</p>
              ))}
            </div>
          )}
          <ListTag style={ListTag === 'ul' ? { listStyleType: 'disc', marginLeft: '1.5rem' } : undefined} className="mt-4 space-y-2 text-[15px] text-[#444444]">
            {displayItems.map((item, i) => (
              <li key={i} className="mb-2">{item}</li>
            ))}
          </ListTag>
        </div>
      );
    }
    default:
      return null;
  }
}

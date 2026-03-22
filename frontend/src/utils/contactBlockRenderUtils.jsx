// Utility for rendering contact blocks
import React from "react";

export function renderContactBlock(block, i) {
  if (!block) return null;
  switch (block.type) {
    case "paragraph":
      return (
        <p key={block._id || i} className="mb-4 text-[#444444] text-[15px]">
          {block.text}
        </p>
      );
    case "image":
      return (
        <div key={block._id || i} className="mb-6">
          <img src={block.src} alt={block.alt || "Contact image"} className="object-contain w-full h-36" />
        </div>
      );
    default:
      return null;
  }
}

export function updateImageBlockAlts(blocks, title) {
  if (!Array.isArray(blocks) || !title) return blocks;
  let changed = false;
  const newBlocks = blocks.map((block) => {
    if (block && block.type === 'image' && block._autoAlt) {
      const newAlt = `${title} image`;
      if (block.alt !== newAlt) {
        changed = true;
        return { ...block, alt: newAlt };
      }
    }
    return block;
  });
  return changed ? newBlocks : blocks;
}

export function renderBlock(block, key) {
  if (!block) return null;
  switch (block.type) {
    case "paragraph":
      return (
        <p key={key} className="text-sm text-[#606060] mb-4">
          {block.text}
        </p>
      );
    case "image":
      return (
        <div key={key} className="w-full max-w-xs md:max-w-sm mb-4">
          <img src={block.src || block.url} alt={block.alt || ""} className="object-contain w-full h-auto" />
        </div>
      );
    case "heading":
      return <h3 key={key}>{block.text}</h3>;
    default:
      return null;
  }
}
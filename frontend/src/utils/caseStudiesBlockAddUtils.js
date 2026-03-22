// Utility functions for adding blocks

export function addParagraphBlock(blocks, genId) {
  const copy = (blocks || []).slice();
  copy.push({ _id: genId(), type: "paragraph", text: "" });
  return copy;
}

export function addImageBlock(blocks, genId) {
  const copy = (blocks || []).slice();
  copy.push({ _id: genId(), type: "image", src: "", alt: "", _autoAlt: true });
  return copy;
}

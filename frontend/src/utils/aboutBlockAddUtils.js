// Utility for adding new blocks to About sections
export function addAboutBlock(blocks, type) {
  const newBlock = type === 'image'
    ? { _id: Date.now().toString(), type: 'image', src: '', alt: '' }
    : { _id: Date.now().toString(), type: 'paragraph', text: '' };
  return [...(blocks || []), newBlock];
}

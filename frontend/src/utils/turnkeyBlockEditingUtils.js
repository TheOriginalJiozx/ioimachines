// Utility functions for block editing in TurnkeySolutions

export function moveBlockUp(blocks, id) {
  const idx = blocks.findIndex(b => b._id === id);
  if (idx > 0) {
    const copy = blocks.slice();
    [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
    return copy;
  }
  return blocks;
}

export function moveBlockDown(blocks, id) {
  const idx = blocks.findIndex(b => b._id === id);
  if (idx !== -1 && idx < blocks.length - 1) {
    const copy = blocks.slice();
    [copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]];
    return copy;
  }
  return blocks;
}

export function deleteBlock(blocks, id) {
  return blocks.filter(b => b._id !== id);
}

export function updateBlock(blocks, id, newBlock) {
  return blocks.map(b => b._id === id ? newBlock : b);
}

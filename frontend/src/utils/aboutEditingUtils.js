// Move a block up in the array
export function moveUpBlock(blocks, index) {
  if (index <= 0) return blocks;
  const arr = [...blocks];
  [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
  return arr;
}

// Move a block down in the array
export function moveDownBlock(blocks, index) {
  if (index >= blocks.length - 1) return blocks;
  const arr = [...blocks];
  [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
  return arr;
}

// Remove a block from the array
export function removeBlock(blocks, index) {
  const arr = [...blocks];
  arr.splice(index, 1);
  return arr;
}

export function moveBlockUp(blocks, id) {
  const array = (blocks || []).slice();
  const index = array.findIndex((block) => block._id === id);
  if (index <= 0) return blocks;
  const temporary = array[index - 1];
  array[index - 1] = array[index];
  array[index] = temporary;
  return array;
}

export function moveBlockDown(blocks, id) {
  const array = (blocks || []).slice();
  const index = array.findIndex((block) => block._id === id);
  if (index === -1 || index === array.length - 1) return blocks;
  const temporary = array[index + 1];
  array[index + 1] = array[index];
  array[index] = temporary;
  return array;
}

export function deleteBlock(blocks, id) {
  return (blocks || []).filter((block) => block._id !== id);
}

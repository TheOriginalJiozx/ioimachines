// Utility functions for list blocks in Feasibility Study
export function getListBlockEditorValue(block) {
  if (!block) return '';
  if (block._editorValue !== undefined) return block._editorValue;
  if (block._isSemicolonList) {
    return [
      ...(block.extraText || []),
      ...((block.items || []).map(item => item + ';'))
    ].join('\n');
  }
  return (block.items || []).join('\n');
}

export function parseListBlockEditorValue(block, value) {
  let items = [];
  let extra = [];
  if (block._isSemicolonList) {
    const lines = value.split('\n').map(s => s.replaceAll(/\u00A0/g, ' ').replaceAll('\t', '\t'));
    lines.forEach(line => {
      const trimmedEnd = line.replaceAll(/\s+$/g, '');
      if (trimmedEnd.endsWith(';')) {
        const itemText = trimmedEnd.replaceAll(/;\s*$/, '').trim();
        if (itemText) items.push(itemText);
      } else if (line.trim()) {
        extra.push(line.trim());
      }
    });
  } else {
    items = value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
  }
  const result = { items };
  if (block._isSemicolonList) result.extraText = extra;
  return result;
}

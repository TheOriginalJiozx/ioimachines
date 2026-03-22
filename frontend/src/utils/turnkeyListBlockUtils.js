// Utils for handling list block editing in TurnkeySolutions

export function getListBlockEditorValue(block) {
  if (block._editorValue !== undefined) return block._editorValue;
  if (block._isSemicolonList) {
    return [
      ...(block.extraText || []),
      ...((block.items || []).map(item => item + ";"))
    ].join("\n");
  }
  return (block.items || []).join("\n");
}

export function parseListBlockEditorValue(block, value) {
  let items = [];
  let extra = [];
  if (block._isSemicolonList) {
    const lines = value.split("\n").map(s => s.replaceAll("\u00A0", " ").replaceAll("\t", "\t"));
    lines.forEach((line) => {
      const trimmedEnd = line.replaceAll(/\s+$/g, "");
      if (trimmedEnd.endsWith(";")) {
        const itemText = trimmedEnd.replaceAll(/;\s*$/, "").trim();
        if (itemText) items.push(itemText);
      } else if (line.trim()) {
        extra.push(line.trim());
      }
    });
    return { items, extraText: extra };
  } else {
    items = value.split("\n").map(s => s.trim()).filter(s => s.length > 0);
    return { items };
  }
}

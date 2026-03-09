export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function blocksToPlainText(content) {
  if (!content && content !== "") return "";
  let array = content;
  if (typeof content === "string") {
    try {
      array = JSON.parse(content);
    } catch (error) {
      return typeof content === "string" ? content : "";
    }
  }
  if (Array.isArray(array)) {
    return array
      .map((block) => {
        try {
          return block && block.type === "paragraph" && block.text ? block.text : "";
        } catch (error) {
          return "";
        }
      })
      .filter((string) => string && string.length > 0)
      .join("\n");
  }
  return typeof content === "string" ? content : "";
}

// Basic renderBlock implementation for Contact.jsx usage
export function renderBlock(block, key) {
  if (!block) return null;
  switch (block.type) {
    case "image":
      return <img src={block.url} alt={block.alt || ""} key={key} style={{ maxWidth: "100%" }} />;
    case "paragraph":
      return <p key={key}>{block.text}</p>;
    case "heading":
      return <h3 key={key}>{block.text}</h3>;
    default:
      return null;
  }
}

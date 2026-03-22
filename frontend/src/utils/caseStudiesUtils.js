// Utility functions for CaseStudies logic

export async function fetchHeroData(apiBase) {
  try {
    const res = await fetch(`${apiBase}/page-heros/case-studies`);
    if (res.ok) {
      const data = await res.json();
      return { title: data.title || "", imageUrl: data.imageUrl || "" };
    }
    return { title: "", imageUrl: "" };
  } catch {
    return { title: "", imageUrl: "" };
  }
}

export function normalizeEntry(entry) {
  const title = entry.title || "";
  const image = entry.image || entry.hero_image || "";
  let content = entry.content || entry.contentJson || entry.content_json || "";
  try {
    content = typeof content === "string" ? JSON.parse(content) : content;
  } catch {
    // ignore JSON parse error, fallback to original content
  }
  let solutionContent = entry.solution_content_json || entry.solutionContentJson || entry.solutionContent || "";
  try {
    solutionContent = typeof solutionContent === "string" ? JSON.parse(solutionContent) : solutionContent;
  } catch {
    // ignore JSON parse error, fallback to original solutionContent
  }
  const solutionTitle = entry.solution_title || entry.solutionTitle || "";
  return { slug: entry.slug, title, image, content, solutionTitle, solutionContent };
}

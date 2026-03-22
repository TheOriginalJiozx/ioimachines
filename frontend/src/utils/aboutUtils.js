// General About section utilities
export function getAboutSectionTitle(section) {
  return section?.title || '';
}

export function getAboutSectionBlocks(section) {
  return (section?.parsedContent && Array.isArray(section.parsedContent.intro)) ? section.parsedContent.intro : [];
}

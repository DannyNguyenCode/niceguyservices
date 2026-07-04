export const EVERGREEN_SCROLL_OFFSET = 88;

export function evergreenSectionIdFromHref(href: string): string | null {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return null;
  return href.slice(hashIndex + 1) || null;
}

export function scrollToEvergreenSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const top =
    el.getBoundingClientRect().top + window.scrollY - EVERGREEN_SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });

  const nextHash = `#${sectionId}`;
  if (window.location.hash !== nextHash) {
    window.history.pushState(null, "", nextHash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
}

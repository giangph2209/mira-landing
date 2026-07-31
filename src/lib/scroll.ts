export function scrollToHash(href: string) {
  if (typeof window === "undefined") return;

  const id = href.startsWith("#") ? href.slice(1) : href;
  if (!id) return;

  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

export function isHashHref(href: string | undefined): href is string {
  return Boolean(href && href.startsWith("#") && href.length > 1);
}

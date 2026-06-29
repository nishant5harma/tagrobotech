export function normalizeSlug(slug) {
  const trimmed = slug.trim().toLowerCase();
  if (trimmed === "/") return "/";

  return trimmed
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-/]/g, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}

export function slugFromTitle(title) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  return normalizeSlug(base);
}

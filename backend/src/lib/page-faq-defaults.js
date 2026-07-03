import pageFaqDefaults from "../../../database/defaults/page-faq.json" with { type: "json" };

export function defaultPageFaqSectionData() {
  return structuredClone(pageFaqDefaults);
}

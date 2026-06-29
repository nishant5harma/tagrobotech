export const ROBOTS_OPTIONS = [
  { value: "index,follow", label: "Index, Follow (default)" },
  { value: "noindex,follow", label: "No Index, Follow" },
  { value: "index,nofollow", label: "Index, No Follow" },
  { value: "noindex,nofollow", label: "No Index, No Follow" },
] as const;

export type SeoFormData = {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  robots: string;
  og_title: string;
  og_description: string;
  og_image_id: string | null;
  schema_json_text: string;
};

export const EMPTY_SEO_FORM: SeoFormData = {
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  canonical_url: "",
  robots: "index,follow",
  og_title: "",
  og_description: "",
  og_image_id: null,
  schema_json_text: "",
};

export function seoToFormData(seo: {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  canonical_url?: string | null;
  robots?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image_id?: string | null;
  schema_json?: Record<string, unknown> | string | null;
} | null): SeoFormData {
  if (!seo) return { ...EMPTY_SEO_FORM };

  let schemaText = "";
  if (seo.schema_json) {
    try {
      const parsed =
        typeof seo.schema_json === "string" ? JSON.parse(seo.schema_json) : seo.schema_json;
      schemaText = JSON.stringify(parsed, null, 2);
    } catch {
      schemaText = "";
    }
  }

  return {
    meta_title: seo.meta_title ?? "",
    meta_description: seo.meta_description ?? "",
    meta_keywords: seo.meta_keywords ?? "",
    canonical_url: seo.canonical_url ?? "",
    robots: seo.robots ?? "index,follow",
    og_title: seo.og_title ?? "",
    og_description: seo.og_description ?? "",
    og_image_id: seo.og_image_id ?? null,
    schema_json_text: schemaText,
  };
}

export function formDataToSeoPayload(data: SeoFormData) {
  let schema_json: Record<string, unknown> | null = null;
  if (data.schema_json_text.trim()) {
    schema_json = JSON.parse(data.schema_json_text) as Record<string, unknown>;
  }

  return {
    meta_title: data.meta_title.trim() || null,
    meta_description: data.meta_description.trim() || null,
    meta_keywords: data.meta_keywords.trim() || null,
    canonical_url: data.canonical_url.trim() || null,
    robots: data.robots,
    og_title: data.og_title.trim() || null,
    og_description: data.og_description.trim() || null,
    og_image_id: data.og_image_id,
    schema_json,
  };
}

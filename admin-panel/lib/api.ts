const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export function resolveMediaUrl(fileUrl: string): string {
  if (!fileUrl) return "";
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) return fileUrl;
  return `${API_URL}${fileUrl}`;
}

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type DashboardStats = {
  pages: number;
  sections: number;
  media: number;
  seo: number;
};

export type PageRow = {
  id: string;
  title: string;
  slug: string;
  page_type: string;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PageSection = {
  id: string;
  page_id: string;
  section_type: string;
  position: number;
  is_active: boolean | number;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type PageSeo = {
  id: string;
  page_id: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_url: string | null;
  robots: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_id: string | null;
  schema_json: Record<string, unknown> | null;
};

export type MediaItem = {
  id: string;
  original_name: string | null;
  file_name: string | null;
  file_url: string;
  mime_type: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  created_at: string;
  file_exists?: boolean;
};

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data as T;
}

export function login(email: string, password: string) {
  return apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMe(token: string) {
  return apiFetch<{ user: AuthUser }>("/api/auth/me", {}, token);
}

export function getDashboardStats(token: string) {
  return apiFetch<DashboardStats>("/api/admin/stats", {}, token);
}

export function getPages(token: string) {
  return apiFetch<{ pages: PageRow[] }>("/api/admin/pages", {}, token);
}

export function createPage(
  token: string,
  body: { title: string; slug: string; page_type?: string; status?: string }
) {
  return apiFetch<{ page: PageRow }>(
    "/api/admin/pages",
    { method: "POST", body: JSON.stringify(body) },
    token
  );
}

export function getPage(token: string, id: string) {
  return apiFetch<{ page: PageRow; sections: PageSection[]; seo: PageSeo | null }>(
    `/api/admin/pages/${id}`,
    {},
    token
  );
}

export function updatePage(
  token: string,
  id: string,
  body: Partial<Pick<PageRow, "title" | "slug" | "page_type" | "status" | "sort_order">>
) {
  return apiFetch<{ page: PageRow }>(
    `/api/admin/pages/${id}`,
    { method: "PUT", body: JSON.stringify(body) },
    token
  );
}

export type UpdatePageSeoBody = {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  canonical_url?: string | null;
  robots?: string;
  og_title?: string | null;
  og_description?: string | null;
  og_image_id?: string | null;
  schema_json?: Record<string, unknown> | null;
};

export function updatePageSeo(token: string, pageId: string, body: UpdatePageSeoBody) {
  return apiFetch<{ seo: PageSeo }>(
    `/api/admin/pages/${pageId}/seo`,
    { method: "PUT", body: JSON.stringify(body) },
    token
  );
}

export function deletePage(token: string, id: string) {
  return apiFetch<{ message: string }>(
    `/api/admin/pages/${id}`,
    { method: "DELETE" },
    token
  );
}

export function createSection(
  token: string,
  pageId: string,
  body: { section_type: string; position?: number; is_active?: boolean; data?: Record<string, unknown> }
) {
  return apiFetch<{ section: PageSection }>(
    `/api/admin/pages/${pageId}/sections`,
    { method: "POST", body: JSON.stringify(body) },
    token
  );
}

export function updateSection(
  token: string,
  pageId: string,
  sectionId: string,
  body: Partial<Pick<PageSection, "section_type" | "position" | "is_active" | "data">>
) {
  return apiFetch<{ section: PageSection }>(
    `/api/admin/pages/${pageId}/sections/${sectionId}`,
    { method: "PUT", body: JSON.stringify(body) },
    token
  );
}

export function deleteSection(token: string, pageId: string, sectionId: string) {
  return apiFetch<{ message: string }>(
    `/api/admin/pages/${pageId}/sections/${sectionId}`,
    { method: "DELETE" },
    token
  );
}

export function reorderSections(token: string, pageId: string, sectionIds: string[]) {
  return apiFetch<{ sections: PageSection[] }>(
    `/api/admin/pages/${pageId}/sections/reorder`,
    { method: "PUT", body: JSON.stringify({ section_ids: sectionIds }) },
    token
  );
}

export function getMedia(token: string) {
  return apiFetch<{ media: MediaItem[] }>("/api/admin/media", {}, token);
}

export function createMedia(
  token: string,
  body: {
    file_url: string;
    file_name?: string;
    original_name?: string;
    mime_type?: string;
    alt_text?: string;
  }
) {
  return apiFetch<{ media: MediaItem }>(
    "/api/admin/media",
    { method: "POST", body: JSON.stringify(body) },
    token
  );
}

export function deleteMedia(token: string, id: string) {
  return apiFetch<{ message: string }>(
    `/api/admin/media/${id}`,
    { method: "DELETE" },
    token
  );
}

export async function uploadMedia(token: string, file: File, altText?: string) {
  const formData = new FormData();
  formData.append("file", file);
  if (altText?.trim()) {
    formData.append("alt_text", altText.trim());
  }

  const response = await fetch(`${API_URL}/api/admin/media/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return data as { media: MediaItem };
}

export async function getResourcesMegaMenu(token: string) {
  return getMegaMenu(token, "resources");
}

export async function updateResourcesMegaMenu(
  token: string,
  menu: Record<string, unknown>
) {
  return updateMegaMenu(token, "resources", menu);
}

export async function getMegaMenu(token: string, kind: "resources" | "features" | "solutions") {
  return apiFetch<{ menu: Record<string, unknown> }>(
    `/api/admin/navigation/${kind}`,
    {},
    token
  );
}

export async function updateMegaMenu(
  token: string,
  kind: "resources" | "features" | "solutions",
  menu: Record<string, unknown>
) {
  return apiFetch<{ menu: Record<string, unknown> }>(
    `/api/admin/navigation/${kind}`,
    {
      method: "PUT",
      body: JSON.stringify({ menu }),
    },
    token
  );
}

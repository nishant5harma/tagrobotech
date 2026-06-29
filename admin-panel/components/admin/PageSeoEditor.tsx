"use client";

import { FormEvent, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Search, Save } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import MediaThumbnail from "@/components/admin/MediaThumbnail";
import { getMedia, type MediaItem, type PageSeo } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";
import {
  formDataToSeoPayload,
  ROBOTS_OPTIONS,
  seoToFormData,
  type SeoFormData,
} from "@/lib/seo";

type PageSeoEditorProps = {
  pageTitle: string;
  pageSlug: string;
  seo: PageSeo | null;
  onSave: (payload: ReturnType<typeof formDataToSeoPayload>) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function PageSeoEditor({
  pageTitle,
  pageSlug,
  seo,
  onSave,
}: PageSeoEditorProps) {
  const [form, setForm] = useState<SeoFormData>(() => seoToFormData(seo));
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [ogPreviewUrl, setOgPreviewUrl] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [ogPreviewOpen, setOgPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    getMedia(token).then((data) => {
      setMediaItems(data.media);
      if (seo?.og_image_id) {
        const item = data.media.find((m) => m.id === seo.og_image_id);
        if (item) setOgPreviewUrl(item.file_url);
      }
    });
  }, [seo?.og_image_id]);

  function updateField<K extends keyof SeoFormData>(key: K, value: SeoFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleOgImageChange(id: string | null, item?: MediaItem) {
    updateField("og_image_id", id);
    setOgPreviewUrl(item?.file_url ?? null);
    if (id && !item) {
      const found = mediaItems.find((m) => m.id === id);
      setOgPreviewUrl(found?.file_url ?? null);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = formDataToSeoPayload(form);
      await onSave(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save SEO");
    } finally {
      setSaving(false);
    }
  }

  function fillFromPageTitle() {
    setForm((prev) => ({
      ...prev,
      meta_title: prev.meta_title || pageTitle,
      og_title: prev.og_title || pageTitle,
    }));
  }

  const previewTitle = form.meta_title || pageTitle || "Page title";
  const previewDescription =
    form.meta_description || "Meta description will appear here in search results.";
  const previewUrl =
    form.canonical_url ||
    `https://tagrobotech.com${pageSlug === "/" ? "" : `/${pageSlug}`}`;

  const ogImageSrc =
    ogPreviewUrl ??
    mediaItems.find((m) => m.id === form.og_image_id)?.file_url ??
    null;

  const ogImageItem = mediaItems.find((m) => m.id === form.og_image_id);
  const ogFileMissing = ogImageItem?.file_exists === false;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 px-6 py-4">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left transition hover:opacity-80"
        >
          <Search className="h-5 w-5 shrink-0 text-[var(--orange)]" />
          <div className="min-w-0">
            <h2 className="font-semibold text-foreground">SEO settings</h2>
            <p className="truncate text-xs text-muted">
              {expanded
                ? "Search engines, social previews, and structured data"
                : previewTitle}
            </p>
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-3">
          {expanded ? (
            <button
              type="button"
              onClick={fillFromPageTitle}
              className="text-xs font-medium text-[var(--orange)] transition hover:underline"
            >
              Fill from page name
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg p-1 text-muted transition hover:bg-[var(--surface-muted)] hover:text-foreground"
            aria-label={expanded ? "Minimize SEO settings" : "Expand SEO settings"}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {expanded ? (
        <form onSubmit={handleSubmit} className="space-y-6 border-t border-border px-6 pb-6 pt-4">
          {/* Search preview */}
          <div className="rounded-xl border border-border bg-[var(--surface-muted)]/40 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
              Google preview
            </p>
            <p className="truncate text-lg text-[#1a0dab]">{previewTitle}</p>
            <p className="truncate text-sm text-[#006621]">{previewUrl}</p>
            <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
              {previewDescription}
            </p>
          </div>

          {/* Basic meta */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-foreground">Basic meta tags</legend>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Meta title</label>
                <span
                  className={`text-xs ${form.meta_title.length > 60 ? "text-amber-600" : "text-muted"}`}
                >
                  {form.meta_title.length}/60
                </span>
              </div>
              <input
                value={form.meta_title}
                onChange={(e) => updateField("meta_title", e.target.value)}
                placeholder="TagRobotech | Asset Auditing Solutions"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Meta description</label>
                <span
                  className={`text-xs ${form.meta_description.length > 160 ? "text-amber-600" : "text-muted"}`}
                >
                  {form.meta_description.length}/160
                </span>
              </div>
              <textarea
                value={form.meta_description}
                onChange={(e) => updateField("meta_description", e.target.value)}
                rows={3}
                placeholder="Brief summary for search results (150–160 characters recommended)"
                className={`${inputClass} resize-y`}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Meta keywords</label>
              <input
                value={form.meta_keywords}
                onChange={(e) => updateField("meta_keywords", e.target.value)}
                placeholder="RFID, asset tracking, barcode, enterprise auditing"
                className={inputClass}
              />
              <p className="text-xs text-muted">Comma-separated keywords (optional)</p>
            </div>
          </fieldset>

          {/* Advanced */}
          <fieldset className="space-y-4 rounded-xl border border-border p-4">
            <legend className="px-1 text-sm font-semibold text-foreground">Advanced</legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium">Canonical URL</label>
                <input
                  value={form.canonical_url}
                  onChange={(e) => updateField("canonical_url", e.target.value)}
                  placeholder="https://tagrobotech.com/about"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium">Robots</label>
                <select
                  value={form.robots}
                  onChange={(e) => updateField("robots", e.target.value)}
                  className={inputClass}
                >
                  {ROBOTS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Open Graph */}
          <fieldset className="space-y-4 rounded-xl border border-border p-4">
            <legend className="px-1 text-sm font-semibold text-foreground">
              Open Graph (social sharing)
            </legend>

            <div className="space-y-2">
              <label className="block text-sm font-medium">OG title</label>
              <input
                value={form.og_title}
                onChange={(e) => updateField("og_title", e.target.value)}
                placeholder="Defaults to meta title if empty"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">OG description</label>
              <textarea
                value={form.og_description}
                onChange={(e) => updateField("og_description", e.target.value)}
                rows={2}
                placeholder="Defaults to meta description if empty"
                className={`${inputClass} resize-y`}
              />
            </div>

            <MediaPicker
              label="OG image"
              accept="image"
              value={form.og_image_id}
              onChange={handleOgImageChange}
              defaultGalleryOpen={false}
            />

            {/* Social preview card */}
            <div className="overflow-hidden rounded-xl border border-border bg-white dark:bg-[#1a1d2e]">
              <button
                type="button"
                onClick={() => setOgPreviewOpen(!ogPreviewOpen)}
                className="flex w-full items-center justify-between border-b border-border px-3 py-2 text-left text-xs font-medium text-muted transition hover:bg-[var(--surface-muted)]/50"
              >
                <span>Social share preview</span>
                {ogPreviewOpen ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              {ogPreviewOpen ? (
                <>
                  <div className="relative aspect-[1.91/1] bg-[var(--surface-muted)]">
                    {ogImageSrc ? (
                      <MediaThumbnail
                        src={ogImageSrc}
                        alt="OG preview"
                        className="h-full w-full object-cover"
                        fallbackLabel="Image unavailable"
                        fileMissing={ogFileMissing}
                      />
                    ) : (
                      <p className="flex h-full items-center justify-center text-xs text-muted">
                        1200×630 recommended — select an image above
                      </p>
                    )}
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="truncate text-xs uppercase text-muted">tagrobotech.com</p>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {form.og_title || form.meta_title || pageTitle}
                    </p>
                    <p className="line-clamp-2 text-xs text-muted">
                      {form.og_description || form.meta_description || "Social share description"}
                    </p>
                  </div>
                </>
              ) : (
                <p className="px-3 py-2 text-xs text-muted">Preview minimized</p>
              )}
            </div>
          </fieldset>

          {/* Schema JSON-LD */}
          <fieldset className="space-y-4 rounded-xl border border-border p-4">
            <legend className="px-1 text-sm font-semibold text-foreground">
              Structured data (JSON-LD)
            </legend>
            <p className="text-xs text-muted">
              Optional Schema.org markup for rich results (Organization, WebPage, BlogPosting, etc.)
            </p>
            <textarea
              value={form.schema_json_text}
              onChange={(e) => updateField("schema_json_text", e.target.value)}
              rows={10}
              placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "${pageTitle}"\n}`}
              className={`${inputClass} font-mono text-xs leading-relaxed`}
            />
          </fieldset>

          {error ? <p className="text-sm text-[var(--error-text)]">{error}</p> : null}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-[#252847]"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving SEO..." : "Save SEO"}
          </button>
        </form>
      ) : null}
    </div>
  );
}

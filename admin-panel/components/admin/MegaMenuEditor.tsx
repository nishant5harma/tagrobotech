"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  normalizeMegaMenuData,
  megaMenuToPayload,
  type MegaMenuColumn,
  type MegaMenuData,
  type MegaMenuKind,
  type MegaMenuLinkItem,
} from "@/lib/mega-menu";

type MegaMenuEditorProps = {
  kind: MegaMenuKind;
  title: string;
  linkPrefix: string;
  pageTypes: string[];
  initialData: unknown;
  linkedPages: Array<{ title: string; slug: string }>;
  onSave: (data: Record<string, unknown>) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function MegaMenuEditor({
  kind,
  title,
  linkPrefix,
  pageTypes,
  initialData,
  linkedPages,
  onSave,
}: MegaMenuEditorProps) {
  const [data, setData] = useState<MegaMenuData>(() => normalizeMegaMenuData(initialData, kind));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof MegaMenuData>(key: K, value: MegaMenuData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateFeatured<K extends keyof MegaMenuData["featured"]>(
    key: K,
    value: MegaMenuData["featured"][K]
  ) {
    setData((prev) => ({
      ...prev,
      featured: { ...prev.featured, [key]: value },
    }));
  }

  function updateColumn(index: number, patch: Partial<MegaMenuColumn>) {
    setData((prev) => ({
      ...prev,
      columns: prev.columns.map((column, i) => (i === index ? { ...column, ...patch } : column)),
    }));
  }

  function updateColumnItem(columnIndex: number, itemIndex: number, patch: Partial<MegaMenuLinkItem>) {
    setData((prev) => ({
      ...prev,
      columns: prev.columns.map((column, ci) =>
        ci === columnIndex
          ? {
              ...column,
              items: column.items.map((item, ii) =>
                ii === itemIndex ? { ...item, ...patch } : item
              ),
            }
          : column
      ),
    }));
  }

  function addColumnItem(columnIndex: number) {
    setData((prev) => ({
      ...prev,
      columns: prev.columns.map((column, i) =>
        i === columnIndex
          ? {
              ...column,
              items: [...column.items, { label: "", page_slug: null, href: null }],
            }
          : column
      ),
    }));
  }

  function removeColumnItem(columnIndex: number, itemIndex: number) {
    setData((prev) => ({
      ...prev,
      columns: prev.columns.map((column, i) =>
        i === columnIndex
          ? { ...column, items: column.items.filter((_, ii) => ii !== itemIndex) }
          : column
      ),
    }));
  }

  function addColumn() {
    setData((prev) => ({
      ...prev,
      columns: [...prev.columns, { title: "", subtitle: "", items: [] }],
    }));
  }

  function removeColumn(index: number) {
    setData((prev) => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(megaMenuToPayload(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function PageSlugSelect({
    value,
    onChange,
  }: {
    value: string | null;
    onChange: (slug: string | null) => void;
  }) {
    return (
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className={inputClass}
      >
        <option value="">Select linked page</option>
        {linkedPages.map((page) => (
          <option key={page.slug} value={page.slug}>
            {page.title} ({page.slug})
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="space-y-6">
      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Navbar label</legend>
        <input
          value={data.label}
          onChange={(e) => updateField("label", e.target.value)}
          className={inputClass}
        />
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Left sidebar intro</legend>
        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Tagline</label>
          <input
            value={data.intro_tagline}
            onChange={(e) => updateField("intro_tagline", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Description</label>
          <textarea
            value={data.intro_description}
            onChange={(e) => updateField("intro_description", e.target.value)}
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Featured card</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Tagline</label>
            <input
              value={data.featured.tagline}
              onChange={(e) => updateFeatured("tagline", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Title</label>
            <input
              value={data.featured.title}
              onChange={(e) => updateFeatured("title", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <MediaPicker
          label="Featured image"
          value={data.featured.image_media_id}
          onChange={(mediaId) => updateFeatured("image_media_id", mediaId)}
        />
        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Fallback image path</label>
          <input
            value={data.featured.image_src}
            onChange={(e) => updateFeatured("image_src", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Link to page</label>
            <PageSlugSelect
              value={data.featured.page_slug}
              onChange={(slug) => updateFeatured("page_slug", slug)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Or custom URL
            </label>
            <input
              value={data.featured.href ?? ""}
              onChange={(e) => updateFeatured("href", e.target.value || null)}
              placeholder={`${linkPrefix}/example or https://...`}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      {data.columns.map((column, columnIndex) => (
        <fieldset
          key={columnIndex}
          className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4"
        >
          <legend className="flex w-full items-center justify-between gap-2 px-1 text-sm font-semibold text-foreground">
            <span>Column {columnIndex + 1}</span>
            <button
              type="button"
              onClick={() => removeColumn(columnIndex)}
              className="text-xs font-normal text-red-600 hover:underline"
            >
              Remove column
            </button>
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Title</label>
              <input
                value={column.title}
                onChange={(e) => updateColumn(columnIndex, { title: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Subtitle</label>
              <input
                value={column.subtitle}
                onChange={(e) => updateColumn(columnIndex, { subtitle: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-3">
            {column.items.map((item, itemIndex) => (
              <div key={itemIndex} className="rounded-xl border border-border bg-card p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted">Label</label>
                    <input
                      value={item.label}
                      onChange={(e) =>
                        updateColumnItem(columnIndex, itemIndex, { label: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted">Page</label>
                    <PageSlugSelect
                      value={item.page_slug}
                      onChange={(slug) =>
                        updateColumnItem(columnIndex, itemIndex, { page_slug: slug })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted">Custom URL</label>
                    <input
                      value={item.href ?? ""}
                      onChange={(e) =>
                        updateColumnItem(columnIndex, itemIndex, {
                          href: e.target.value || null,
                        })
                      }
                      placeholder="Optional override"
                      className={inputClass}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeColumnItem(columnIndex, itemIndex)}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove link
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addColumnItem(columnIndex)}
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              Add link
            </button>
          </div>
        </fieldset>
      ))}

      <button
        type="button"
        onClick={addColumn}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted transition hover:border-[var(--orange)] hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        Add column
      </button>

      {error ? <p className="text-sm text-[var(--error-text)]">{error}</p> : null}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-[var(--orange)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#d94e1f] disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save mega menu"}
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  normalizePageHeroSectionData,
  pageHeroSectionToPayload,
  type PageHeroSectionData,
} from "@/lib/page-hero-section";

type PageHeroSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function PageHeroSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: PageHeroSectionEditorProps) {
  const [data, setData] = useState<PageHeroSectionData>(() =>
    normalizePageHeroSectionData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof PageHeroSectionData>(
    key: K,
    value: PageHeroSectionData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateButton(
    key: "primary_button" | "secondary_button",
    field: "text" | "link",
    value: string
  ) {
    setData((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  }

  function updateBreadcrumb(index: number, field: "label" | "href", value: string) {
    setData((prev) => ({
      ...prev,
      breadcrumbs: prev.breadcrumbs.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: field === "href" && !value ? null : value } : item
      ),
    }));
  }

  function addBreadcrumb() {
    setData((prev) => ({
      ...prev,
      breadcrumbs: [...prev.breadcrumbs, { label: "", href: "" }],
    }));
  }

  function removeBreadcrumb(index: number) {
    setData((prev) => ({
      ...prev,
      breadcrumbs: prev.breadcrumbs.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function updateStat(index: number, field: "value" | "label", value: string) {
    setData((prev) => ({
      ...prev,
      stats: prev.stats.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addStat() {
    setData((prev) => ({
      ...prev,
      stats: [...prev.stats, { value: "", label: "" }],
    }));
  }

  function removeStat(index: number) {
    setData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);

    try {
      await onSave(pageHeroSectionToPayload(data), isActive);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => onIsActiveChange(e.target.checked)}
          className="rounded border-border"
        />
        Section visible on page
      </label>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Breadcrumbs</legend>

        <div className="space-y-3">
          {data.breadcrumbs.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="grid gap-3 rounded-xl border border-border bg-card p-3 sm:grid-cols-[1fr_1fr_auto]"
            >
              <input
                value={item.label}
                onChange={(e) => updateBreadcrumb(index, "label", e.target.value)}
                placeholder="Label"
                className={inputClass}
              />
              <input
                value={item.href ?? ""}
                onChange={(e) => updateBreadcrumb(index, "href", e.target.value)}
                placeholder="/solutions or leave blank for current page"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeBreadcrumb(index)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addBreadcrumb}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--orange)]"
        >
          <Plus className="h-4 w-4" />
          Add breadcrumb
        </button>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Content</legend>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Heading</label>
          <input
            value={data.heading}
            onChange={(e) => updateField("heading", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={4}
            className={`${inputClass} resize-y`}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Buttons</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Primary button text
            </label>
            <input
              value={data.primary_button.text}
              onChange={(e) => updateButton("primary_button", "text", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Primary button link
            </label>
            <input
              value={data.primary_button.link}
              onChange={(e) => updateButton("primary_button", "link", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Secondary button text
            </label>
            <input
              value={data.secondary_button.text}
              onChange={(e) => updateButton("secondary_button", "text", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Secondary button link
            </label>
            <input
              value={data.secondary_button.link}
              onChange={(e) => updateButton("secondary_button", "link", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Stats</legend>

        <div className="space-y-3">
          {data.stats.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="grid gap-3 rounded-xl border border-border bg-card p-3 sm:grid-cols-[180px_1fr_auto]"
            >
              <input
                value={item.value}
                onChange={(e) => updateStat(index, "value", e.target.value)}
                placeholder="45%"
                className={inputClass}
              />
              <input
                value={item.label}
                onChange={(e) => updateStat(index, "label", e.target.value)}
                placeholder="Downtime Reduction"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeStat(index)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addStat}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--orange)]"
        >
          <Plus className="h-4 w-4" />
          Add stat
        </button>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Desktop image</legend>

        <MediaPicker
          label="Desktop image"
          value={data.desktop_image_media_id}
          onChange={(mediaId) => updateField("desktop_image_media_id", mediaId)}
        />

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Fallback image path
          </label>
          <input
            value={data.desktop_image_src}
            onChange={(e) => updateField("desktop_image_src", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Image alt text
          </label>
          <input
            value={data.desktop_image_alt}
            onChange={(e) => updateField("desktop_image_alt", e.target.value)}
            className={inputClass}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Mobile image</legend>

        <MediaPicker
          label="Mobile image"
          value={data.mobile_image_media_id}
          onChange={(mediaId) => updateField("mobile_image_media_id", mediaId)}
        />

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Fallback image path
          </label>
          <input
            value={data.mobile_image_src}
            onChange={(e) => updateField("mobile_image_src", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Image alt text
          </label>
          <input
            value={data.mobile_image_alt}
            onChange={(e) => updateField("mobile_image_alt", e.target.value)}
            className={inputClass}
          />
        </div>
      </fieldset>

      {error ? <p className="text-sm text-[var(--error-text)]">{error}</p> : null}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-[var(--orange)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#d94e1f] disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save section"}
      </button>
    </div>
  );
}

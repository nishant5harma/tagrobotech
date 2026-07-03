"use client";

import { useState } from "react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  heroSectionServicePageToPayload,
  normalizeHeroSectionServicePageData,
  type HeroSectionServicePageData,
} from "@/lib/hero-section-service-page";

type HeroSectionServicePageEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function HeroSectionServicePageEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: HeroSectionServicePageEditorProps) {
  const [data, setData] = useState<HeroSectionServicePageData>(() =>
    normalizeHeroSectionServicePageData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof HeroSectionServicePageData>(
    key: K,
    value: HeroSectionServicePageData[K]
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

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(heroSectionServicePageToPayload(data), isActive);
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
        <legend className="px-1 text-sm font-semibold text-foreground">Hero content</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Tagline</label>
            <input value={data.tagline} onChange={(e) => updateField("tagline", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Heading</label>
            <input value={data.heading} onChange={(e) => updateField("heading", e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Description</label>
          <textarea value={data.description} onChange={(e) => updateField("description", e.target.value)} rows={3} className={inputClass} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Phone label</label>
            <input value={data.phone_label} onChange={(e) => updateField("phone_label", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Phone number</label>
            <input value={data.phone_number} onChange={(e) => updateField("phone_number", e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Primary button text</label>
            <input value={data.primary_button.text} onChange={(e) => updateButton("primary_button", "text", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Primary button link</label>
            <input value={data.primary_button.link} onChange={(e) => updateButton("primary_button", "link", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Secondary button text</label>
            <input value={data.secondary_button.text} onChange={(e) => updateButton("secondary_button", "text", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Secondary button link</label>
            <input value={data.secondary_button.link} onChange={(e) => updateButton("secondary_button", "link", e.target.value)} className={inputClass} />
          </div>
        </div>

        <MediaPicker
          label="Hero image"
          value={data.image_media_id}
          onChange={(mediaId) => updateField("image_media_id", mediaId)}
        />
        <input value={data.image_src} onChange={(e) => updateField("image_src", e.target.value)} placeholder="Fallback image path" className={inputClass} />
        <input value={data.image_alt} onChange={(e) => updateField("image_alt", e.target.value)} placeholder="Image alt text" className={inputClass} />
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

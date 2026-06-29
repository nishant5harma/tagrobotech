"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  normalizeWhoWeAreAboutSectionData,
  whoWeAreAboutSectionToPayload,
  type WhoWeAreAboutSectionData,
  type WhoWeAreFeature,
  type WhoWeAreFeatureStyle,
} from "@/lib/who-we-are-about-section";

type WhoWeAreAboutSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function WhoWeAreAboutSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: WhoWeAreAboutSectionEditorProps) {
  const [data, setData] = useState<WhoWeAreAboutSectionData>(() =>
    normalizeWhoWeAreAboutSectionData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof WhoWeAreAboutSectionData>(
    key: K,
    value: WhoWeAreAboutSectionData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateParagraph(index: number, value: string) {
    setData((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.map((paragraph, i) => (i === index ? value : paragraph)),
    }));
  }

  function addParagraph() {
    setData((prev) => ({ ...prev, paragraphs: [...prev.paragraphs, ""] }));
  }

  function removeParagraph(index: number) {
    setData((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, i) => i !== index),
    }));
  }

  function updateFeature(index: number, patch: Partial<WhoWeAreFeature>) {
    setData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? { ...feature, ...patch } : feature
      ),
    }));
  }

  function addFeature() {
    setData((prev) => ({
      ...prev,
      features: [...prev.features, { tagline: "", description: "", style: "white" as WhoWeAreFeatureStyle }],
    }));
  }

  function removeFeature(index: number) {
    setData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(whoWeAreAboutSectionToPayload(data), isActive);
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
        <legend className="px-1 text-sm font-semibold text-foreground">Left panel</legend>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Tagline</label>
          <input
            value={data.tagline}
            onChange={(e) => updateField("tagline", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Heading</label>
          <input
            value={data.heading}
            onChange={(e) => updateField("heading", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Paragraphs</label>
          {data.paragraphs.map((paragraph, index) => (
            <div key={index} className="flex gap-2">
              <textarea
                value={paragraph}
                onChange={(e) => updateParagraph(index, e.target.value)}
                rows={3}
                className={`${inputClass} resize-y`}
              />
              <button
                type="button"
                onClick={() => removeParagraph(index)}
                className="shrink-0 self-start rounded-lg border border-red-200 px-3 py-2 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addParagraph}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            Add paragraph
          </button>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Right side image</legend>

        <MediaPicker
          label="Section image"
          value={data.image_media_id}
          onChange={(mediaId) => updateField("image_media_id", mediaId)}
        />

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Fallback image path
          </label>
          <input
            value={data.image_src}
            onChange={(e) => updateField("image_src", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Image alt text</label>
          <input
            value={data.image_alt}
            onChange={(e) => updateField("image_alt", e.target.value)}
            className={inputClass}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">
          Feature cards ({data.features.length})
        </legend>

        {data.features.map((feature, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-border bg-card p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wide text-muted">Label</label>
                <input
                  value={feature.tagline}
                  onChange={(e) => updateFeature(index, { tagline: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wide text-muted">Card style</label>
                <select
                  value={feature.style}
                  onChange={(e) =>
                    updateFeature(index, { style: e.target.value as WhoWeAreFeatureStyle })
                  }
                  className={inputClass}
                >
                  <option value="white">White</option>
                  <option value="muted">Muted gray</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Description</label>
              <textarea
                value={feature.description}
                onChange={(e) => updateFeature(index, { description: e.target.value })}
                rows={3}
                className={`${inputClass} resize-y`}
              />
            </div>
            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove card
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addFeature}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted transition hover:border-[var(--orange)] hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          Add feature card
        </button>
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

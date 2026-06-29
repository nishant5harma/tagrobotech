"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  aboutSectionToPayload,
  normalizeAboutSectionData,
  type AboutSectionData,
} from "@/lib/about-section";

type AboutSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function AboutSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: AboutSectionEditorProps) {
  const [data, setData] = useState<AboutSectionData>(() => normalizeAboutSectionData(initialData));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof AboutSectionData>(key: K, value: AboutSectionData[K]) {
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

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      const payload = aboutSectionToPayload({
        ...data,
        paragraphs: data.paragraphs.map((p) => p.trim()).filter(Boolean),
      });
      await onSave(payload, isActive);
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
        <legend className="px-1 text-sm font-semibold text-foreground">Heading</legend>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Tagline</label>
          <input
            value={data.tagline}
            onChange={(e) => updateField("tagline", e.target.value)}
            className={inputClass}
            placeholder="About Us"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Heading
            </label>
            <input
              value={data.heading}
              onChange={(e) => updateField("heading", e.target.value)}
              className={inputClass}
              placeholder="Pioneers of"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Heading accent (orange)
            </label>
            <input
              value={data.heading_accent}
              onChange={(e) => updateField("heading_accent", e.target.value)}
              className={inputClass}
              placeholder="Asset Tracking"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Body text</legend>

        {data.paragraphs.map((paragraph, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-medium uppercase tracking-wide text-muted">
                Paragraph {index + 1}
              </label>
              {data.paragraphs.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              ) : null}
            </div>
            <textarea
              value={paragraph}
              onChange={(e) => updateParagraph(index, e.target.value)}
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addParagraph}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted transition hover:border-[var(--orange)] hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          Add paragraph
        </button>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Right visual</legend>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="about_visual_type"
              checked={data.visual_type === "spline"}
              onChange={() => updateField("visual_type", "spline")}
            />
            3D Spline scene
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="about_visual_type"
              checked={data.visual_type === "image"}
              onChange={() => updateField("visual_type", "image")}
            />
            Image from media
          </label>
        </div>

        {data.visual_type === "spline" ? (
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Spline scene URL
            </label>
            <input
              value={data.spline_scene_url}
              onChange={(e) => updateField("spline_scene_url", e.target.value)}
              className={inputClass}
              placeholder="https://prod.spline.design/..."
            />
            <p className="text-xs text-muted">
              Default robot scene is pre-filled. Paste a different Spline URL to change the 3D model.
            </p>
          </div>
        ) : (
          <MediaPicker
            label="Feature image"
            value={data.image_id}
            onChange={(id) => updateField("image_id", id)}
          />
        )}
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

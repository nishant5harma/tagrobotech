"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  DEFAULT_HERO_DATA,
  heroDataToPayload,
  normalizeHeroData,
  type HeroSectionData,
} from "@/lib/hero";

type HeroSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function HeroSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: HeroSectionEditorProps) {
  const [data, setData] = useState<HeroSectionData>(() => normalizeHeroData(initialData));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof HeroSectionData>(key: K, value: HeroSectionData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateStat(index: number, field: "value" | "label", value: string) {
    setData((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat)),
    }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(heroDataToPayload(data), isActive);
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

      {/* Background */}
      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Background</legend>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="background_type"
              checked={data.background_type === "image"}
              onChange={() => updateField("background_type", "image")}
            />
            Image
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="background_type"
              checked={data.background_type === "video"}
              onChange={() => updateField("background_type", "video")}
            />
            Video
          </label>
        </div>

        {data.background_type === "image" ? (
          <MediaPicker
            label="Background image"
            accept="image"
            value={data.image_id}
            onChange={(id) => updateField("image_id", id)}
          />
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Video URL</label>
              <input
                value={data.video_url ?? ""}
                onChange={(e) => updateField("video_url", e.target.value || null)}
                placeholder="https://example.com/hero.mp4"
                className={inputClass}
              />
              <p className="text-xs text-muted">Use a direct MP4/WebM link, or upload a video below.</p>
            </div>
            <MediaPicker
              label="Or upload video from library"
              accept="video"
              value={data.video_id}
              onChange={(id, item) => {
                updateField("video_id", id);
                if (item?.file_url) {
                  updateField("video_url", item.file_url);
                }
              }}
            />
          </div>
        )}
      </fieldset>

      {/* Top row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="block text-sm font-medium">Tagline</label>
          <input
            value={data.tagline}
            onChange={(e) => updateField("tagline", e.target.value)}
            placeholder="RFID • IoT • Asset Tracking • Automation"
            className={inputClass}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="block text-sm font-medium">Badge</label>
          <input
            value={data.badge}
            onChange={(e) => updateField("badge", e.target.value)}
            placeholder="Industry pioneer"
            className={inputClass}
          />
        </div>
      </div>

      {/* Heading */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Heading (main)</label>
          <input
            value={data.heading}
            onChange={(e) => updateField("heading", e.target.value)}
            placeholder="Transform Assets Into"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Heading accent (orange)</label>
          <input
            value={data.heading_accent}
            onChange={(e) => updateField("heading_accent", e.target.value)}
            placeholder="Real-Time Intelligence"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={4}
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* Buttons */}
      <fieldset className="space-y-4 rounded-xl border border-border p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Call to action buttons</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Primary button
            </label>
            <input
              value={data.primary_button.text}
              onChange={(e) =>
                updateField("primary_button", { ...data.primary_button, text: e.target.value })
              }
              placeholder="Get free consultation"
              className={inputClass}
            />
            <input
              value={data.primary_button.link}
              onChange={(e) =>
                updateField("primary_button", { ...data.primary_button, link: e.target.value })
              }
              placeholder="/contact"
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Secondary button
            </label>
            <input
              value={data.secondary_button.text}
              onChange={(e) =>
                updateField("secondary_button", { ...data.secondary_button, text: e.target.value })
              }
              placeholder="Explore solutions"
              className={inputClass}
            />
            <input
              value={data.secondary_button.link}
              onChange={(e) =>
                updateField("secondary_button", { ...data.secondary_button, link: e.target.value })
              }
              placeholder="#services"
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      {/* Stats */}
      <fieldset className="space-y-4 rounded-xl border border-border p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Stats row</legend>
        {data.stats.map((stat, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div className="space-y-2">
              <label className="block text-xs text-muted">Value</label>
              <input
                value={stat.value}
                onChange={(e) => updateStat(index, "value", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs text-muted">Label</label>
              <input
                value={stat.label}
                onChange={(e) => updateStat(index, "label", e.target.value)}
                className={inputClass}
              />
            </div>
            <button
              type="button"
              onClick={() =>
                updateField(
                  "stats",
                  data.stats.filter((_, i) => i !== index)
                )
              }
              className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-600 dark:border-red-900 dark:text-red-400"
              aria-label="Remove stat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => updateField("stats", [...data.stats, { value: "", label: "" }])}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--orange)]"
        >
          <Plus className="h-4 w-4" />
          Add stat
        </button>
      </fieldset>

      {/* Preview hint */}
      <div className="rounded-xl border border-dashed border-border bg-[var(--surface-muted)]/40 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Preview</p>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
          {data.tagline || "Tagline"}
        </p>
        <span className="mt-2 inline-block rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase text-[#ea580c]">
          {data.badge || "Badge"}
        </span>
        <h3 className="mt-3 text-lg font-bold text-[#0f2744]">
          {data.heading}{" "}
          <span className="text-[#f97316]">{data.heading_accent}</span>
        </h3>
        <p className="mt-2 text-sm text-muted line-clamp-3">{data.description}</p>
      </div>

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

export { DEFAULT_HERO_DATA };

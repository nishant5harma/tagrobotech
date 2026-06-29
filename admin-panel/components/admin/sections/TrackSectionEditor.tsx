"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  TRACK_CATEGORIES,
  trackSectionToPayload,
  normalizeTrackSectionData,
  type TrackItem,
  type TrackSectionData,
} from "@/lib/track-section";

type TrackSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function TrackSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: TrackSectionEditorProps) {
  const [data, setData] = useState<TrackSectionData>(() => normalizeTrackSectionData(initialData));
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof TrackSectionData>(key: K, value: TrackSectionData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateStat(index: number, field: "value" | "label", value: string) {
    setData((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat)),
    }));
  }

  function updateItem(index: number, patch: Partial<TrackItem>) {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  function addItem() {
    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          title: "New solution",
          category: "Enterprise",
          description: "",
          media_id: null,
          image_alt: "",
          image_src: "",
        },
      ],
    }));
    setOpenItemIndex(data.items.length);
  }

  function removeItem(index: number) {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    setOpenItemIndex(null);
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(trackSectionToPayload(data), isActive);
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
        <legend className="px-1 text-sm font-semibold text-foreground">Header</legend>

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

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Description</label>
          <textarea
            value={data.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">CTA text</label>
            <input
              value={data.cta_button.text}
              onChange={(e) =>
                updateField("cta_button", { ...data.cta_button, text: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">CTA link</label>
            <input
              value={data.cta_button.link}
              onChange={(e) =>
                updateField("cta_button", { ...data.cta_button, link: e.target.value })
              }
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Stats</legend>
        {data.stats.map((stat, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-2">
            <input
              value={stat.value}
              onChange={(e) => updateStat(index, "value", e.target.value)}
              className={inputClass}
              placeholder="Value"
            />
            <input
              value={stat.label}
              onChange={(e) => updateStat(index, "label", e.target.value)}
              className={inputClass}
              placeholder="Label"
            />
          </div>
        ))}
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">
          Solutions ({data.items.length})
        </legend>

        {data.items.map((item, index) => {
          const isOpen = openItemIndex === index;
          return (
            <div key={`${item.title}-${index}`} className="overflow-hidden rounded-xl border border-border bg-card">
              <button
                type="button"
                onClick={() => setOpenItemIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {index + 1}. {item.title || "Untitled solution"}
                  </p>
                  <p className="truncate text-xs text-muted">{item.category}</p>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
                )}
              </button>

              {isOpen ? (
                <div className="space-y-4 border-t border-border px-4 py-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                        Title
                      </label>
                      <input
                        value={item.title}
                        onChange={(e) => updateItem(index, { title: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                        Category
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) => updateItem(index, { category: e.target.value })}
                        className={inputClass}
                      >
                        {TRACK_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                        Image alt text
                      </label>
                      <input
                        value={item.image_alt}
                        onChange={(e) => updateItem(index, { image_alt: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                      Description
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateItem(index, { description: e.target.value })}
                      rows={3}
                      className={`${inputClass} resize-y`}
                    />
                  </div>

                  <MediaPicker
                    label="Card image (from media library)"
                    value={item.media_id}
                    onChange={(mediaId) => updateItem(index, { media_id: mediaId })}
                  />

                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                      Fallback image path (if no media selected)
                    </label>
                    <input
                      value={item.image_src}
                      onChange={(e) => updateItem(index, { image_src: e.target.value })}
                      className={inputClass}
                      placeholder="/assets-images/example.jpeg"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove solution
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}

        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted transition hover:border-[var(--orange)] hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          Add solution
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

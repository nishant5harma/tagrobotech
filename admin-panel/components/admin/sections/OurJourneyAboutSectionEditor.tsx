"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  normalizeOurJourneyAboutSectionData,
  ourJourneyAboutSectionToPayload,
  type JourneyImageFit,
  type OurJourneyAboutSectionData,
  type OurJourneyItem,
} from "@/lib/our-journey-about-section";

type OurJourneyAboutSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function OurJourneyAboutSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: OurJourneyAboutSectionEditorProps) {
  const [data, setData] = useState<OurJourneyAboutSectionData>(() =>
    normalizeOurJourneyAboutSectionData(initialData)
  );
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof OurJourneyAboutSectionData>(
    key: K,
    value: OurJourneyAboutSectionData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateItem(index: number, patch: Partial<OurJourneyItem>) {
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
          year: "",
          title: "",
          description: "",
          image_media_id: null,
          image_src: "",
          image_alt: "",
          image_fit: "cover" as JourneyImageFit,
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
      await onSave(ourJourneyAboutSectionToPayload(data), isActive);
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
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">
          Journey milestones ({data.items.length})
        </legend>

        {data.items.map((item, index) => {
          const isOpen = openItemIndex === index;

          return (
            <div
              key={`${item.year}-${index}`}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <button
                type="button"
                onClick={() => setOpenItemIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <p className="truncate text-sm font-medium text-foreground">
                  {index + 1}. {item.year || "Year"} — {item.title || "Untitled milestone"}
                </p>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
                )}
              </button>

              {isOpen ? (
                <div className="space-y-4 border-t border-border px-4 py-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">Year</label>
                      <input
                        value={item.year}
                        onChange={(e) => updateItem(index, { year: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">Title</label>
                      <input
                        value={item.title}
                        onChange={(e) => updateItem(index, { title: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted">Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateItem(index, { description: e.target.value })}
                      rows={4}
                      className={`${inputClass} resize-y`}
                    />
                  </div>

                  <MediaPicker
                    label="Milestone image"
                    value={item.image_media_id}
                    onChange={(mediaId) => updateItem(index, { image_media_id: mediaId })}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                        Fallback image path
                      </label>
                      <input
                        value={item.image_src}
                        onChange={(e) => updateItem(index, { image_src: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                        Image fit
                      </label>
                      <select
                        value={item.image_fit}
                        onChange={(e) =>
                          updateItem(index, { image_fit: e.target.value as JourneyImageFit })
                        }
                        className={inputClass}
                      >
                        <option value="cover">Cover (photo)</option>
                        <option value="contain">Contain (product/screenshot)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted">Image alt text</label>
                    <input
                      value={item.image_alt}
                      onChange={(e) => updateItem(index, { image_alt: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove milestone
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
          Add milestone
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

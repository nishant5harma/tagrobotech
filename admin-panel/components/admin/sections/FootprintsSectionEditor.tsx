"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  FEATURE_ICON_OPTIONS,
  footprintsSectionToPayload,
  normalizeFootprintsSectionData,
  type FootprintFeatureIcon,
  type FootprintsFeature,
  type FootprintsSectionData,
} from "@/lib/footprints-section";

type FootprintsSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function FootprintsSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: FootprintsSectionEditorProps) {
  const [data, setData] = useState<FootprintsSectionData>(() =>
    normalizeFootprintsSectionData(initialData)
  );
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof FootprintsSectionData>(
    key: K,
    value: FootprintsSectionData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateTag(index: number, value: string) {
    setData((prev) => ({
      ...prev,
      tags: prev.tags.map((tag, i) => (i === index ? value : tag)),
    }));
  }

  function addTag() {
    setData((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
  }

  function removeTag(index: number) {
    setData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  }

  function updateFeature(index: number, patch: Partial<FootprintsFeature>) {
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
      features: [
        ...prev.features,
        { title: "New capability", description: "", icon: "map-pin" as FootprintFeatureIcon },
      ],
    }));
    setOpenItemIndex(data.features.length);
  }

  function removeFeature(index: number) {
    setData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
    setOpenItemIndex(null);
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(
        footprintsSectionToPayload({
          ...data,
          tags: data.tags.map((tag) => tag.trim()).filter(Boolean),
        }),
        isActive
      );
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

        <div className="space-y-3">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Tags</label>
          {data.tags.map((tag, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={tag}
                onChange={(e) => updateTag(index, e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="shrink-0 rounded-lg border border-red-200 px-3 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTag}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            Add tag
          </button>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Dashboard image</legend>

        <MediaPicker
          label="Dashboard screenshot"
          value={data.dashboard_media_id}
          onChange={(mediaId) => updateField("dashboard_media_id", mediaId)}
        />

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Fallback image path
          </label>
          <input
            value={data.dashboard_image_src}
            onChange={(e) => updateField("dashboard_image_src", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Image alt text</label>
          <input
            value={data.dashboard_image_alt}
            onChange={(e) => updateField("dashboard_image_alt", e.target.value)}
            className={inputClass}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Capabilities panel</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Panel label</label>
            <input
              value={data.capabilities_label}
              onChange={(e) => updateField("capabilities_label", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Badge text</label>
            <input
              value={data.capabilities_badge}
              onChange={(e) => updateField("capabilities_badge", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">
          Features ({data.features.length})
        </legend>

        {data.features.map((feature, index) => {
          const isOpen = openItemIndex === index;
          return (
            <div
              key={`${feature.title}-${index}`}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <button
                type="button"
                onClick={() => setOpenItemIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {index + 1}. {feature.title || "Untitled feature"}
                  </p>
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
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">Title</label>
                      <input
                        value={feature.title}
                        onChange={(e) => updateFeature(index, { title: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">Icon</label>
                      <select
                        value={feature.icon}
                        onChange={(e) =>
                          updateFeature(index, { icon: e.target.value as FootprintFeatureIcon })
                        }
                        className={inputClass}
                      >
                        {FEATURE_ICON_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                      Description
                    </label>
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
                    Remove feature
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}

        <button
          type="button"
          onClick={addFeature}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted transition hover:border-[var(--orange)] hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          Add feature
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

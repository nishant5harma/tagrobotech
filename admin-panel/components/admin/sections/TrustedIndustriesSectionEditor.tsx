"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  INDUSTRY_ICON_OPTIONS,
  STAT_ICON_OPTIONS,
  normalizeTrustedIndustriesSectionData,
  trustedIndustriesSectionToPayload,
  type IndustryIcon,
  type TrustedIndustryItem,
  type TrustedIndustriesSectionData,
} from "@/lib/trusted-industries";

type TrustedIndustriesSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function TrustedIndustriesSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: TrustedIndustriesSectionEditorProps) {
  const [data, setData] = useState<TrustedIndustriesSectionData>(() =>
    normalizeTrustedIndustriesSectionData(initialData)
  );
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof TrustedIndustriesSectionData>(
    key: K,
    value: TrustedIndustriesSectionData[K]
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

  function updateStat(index: number, field: "value" | "label" | "icon", value: string) {
    setData((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) =>
        i === index ? { ...stat, [field]: value } : stat
      ),
    }));
  }

  function updateItem(index: number, patch: Partial<TrustedIndustryItem>) {
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
          name: "New sector",
          projects: "0+",
          icon: "building" as IndustryIcon,
          accent: "from-blue-600/80 to-blue-900/40",
          image_alt: "",
          image_src: "",
          media_id: null,
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
      await onSave(
        trustedIndustriesSectionToPayload({
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

        <div className="grid gap-4 sm:grid-cols-2">
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
              Heading accent (orange)
            </label>
            <input
              value={data.heading_accent}
              onChange={(e) => updateField("heading_accent", e.target.value)}
              className={inputClass}
            />
          </div>
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

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Featured carousel label
          </label>
          <input
            value={data.featured_label}
            onChange={(e) => updateField("featured_label", e.target.value)}
            className={inputClass}
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

        <MediaPicker
          label="Background image (from media)"
          value={data.background_media_id}
          onChange={(mediaId) => updateField("background_media_id", mediaId)}
        />
        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Fallback background path
          </label>
          <input
            value={data.background_image_src}
            onChange={(e) => updateField("background_image_src", e.target.value)}
            className={inputClass}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Bottom stats</legend>
        {data.stats.map((stat, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-3">
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
            <select
              value={stat.icon}
              onChange={(e) => updateStat(index, "icon", e.target.value)}
              className={inputClass}
            >
              {STAT_ICON_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">
          Sectors ({data.items.length})
        </legend>

        {data.items.map((item, index) => {
          const isOpen = openItemIndex === index;
          return (
            <div key={`${item.name}-${index}`} className="overflow-hidden rounded-xl border border-border bg-card">
              <button
                type="button"
                onClick={() => setOpenItemIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {index + 1}. {item.name || "Untitled sector"}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {item.projects} projects
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
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">Name</label>
                      <input
                        value={item.name}
                        onChange={(e) => updateItem(index, { name: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">Projects</label>
                      <input
                        value={item.projects}
                        onChange={(e) => updateItem(index, { projects: e.target.value })}
                        className={inputClass}
                        placeholder="600+"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">Icon</label>
                      <select
                        value={item.icon}
                        onChange={(e) =>
                          updateItem(index, { icon: e.target.value as IndustryIcon })
                        }
                        className={inputClass}
                      >
                        {INDUSTRY_ICON_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">Gradient accent</label>
                      <input
                        value={item.accent}
                        onChange={(e) => updateItem(index, { accent: e.target.value })}
                        className={inputClass}
                        placeholder="from-fuchsia-500/80 to-fuchsia-900/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted">Image alt</label>
                    <input
                      value={item.image_alt}
                      onChange={(e) => updateItem(index, { image_alt: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <MediaPicker
                    label="Sector image"
                    value={item.media_id}
                    onChange={(mediaId) => updateItem(index, { media_id: mediaId })}
                  />

                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                      Fallback image URL / path
                    </label>
                    <input
                      value={item.image_src}
                      onChange={(e) => updateItem(index, { image_src: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove sector
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
          Add sector
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

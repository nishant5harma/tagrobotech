"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  DELIVER_CAPABILITY_ICON_OPTIONS,
  normalizeWhatWeDeliverAboutSectionData,
  whatWeDeliverAboutSectionToPayload,
  type DeliverCapability,
  type DeliverCapabilityIcon,
  type WhatWeDeliverAboutSectionData,
} from "@/lib/what-we-deliver-about-section";

type WhatWeDeliverAboutSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function WhatWeDeliverAboutSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: WhatWeDeliverAboutSectionEditorProps) {
  const [data, setData] = useState<WhatWeDeliverAboutSectionData>(() =>
    normalizeWhatWeDeliverAboutSectionData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof WhatWeDeliverAboutSectionData>(
    key: K,
    value: WhatWeDeliverAboutSectionData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateCapability(index: number, patch: Partial<DeliverCapability>) {
    setData((prev) => ({
      ...prev,
      capabilities: prev.capabilities.map((capability, i) =>
        i === index ? { ...capability, ...patch } : capability
      ),
    }));
  }

  function addCapability() {
    setData((prev) => ({
      ...prev,
      capabilities: [
        ...prev.capabilities,
        { title: "", description: "", icon: "wifi" as DeliverCapabilityIcon },
      ],
    }));
  }

  function removeCapability(index: number) {
    setData((prev) => ({
      ...prev,
      capabilities: prev.capabilities.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(whatWeDeliverAboutSectionToPayload(data), isActive);
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

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Description</label>
          <textarea
            value={data.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={4}
            className={`${inputClass} resize-y`}
          />
        </div>

        <MediaPicker
          label="Panel image"
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
          Capability cards ({data.capabilities.length})
        </legend>

        {data.capabilities.map((capability, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-border bg-card p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wide text-muted">Title</label>
                <input
                  value={capability.title}
                  onChange={(e) => updateCapability(index, { title: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wide text-muted">Icon</label>
                <select
                  value={capability.icon}
                  onChange={(e) =>
                    updateCapability(index, { icon: e.target.value as DeliverCapabilityIcon })
                  }
                  className={inputClass}
                >
                  {DELIVER_CAPABILITY_ICON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Description</label>
              <textarea
                value={capability.description}
                onChange={(e) => updateCapability(index, { description: e.target.value })}
                rows={3}
                className={`${inputClass} resize-y`}
              />
            </div>
            <button
              type="button"
              onClick={() => removeCapability(index)}
              className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove card
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addCapability}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted transition hover:border-[var(--orange)] hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          Add capability card
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

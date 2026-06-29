"use client";

import { useState } from "react";
import {
  normalizeResourcePageHeroSectionData,
  resourcePageHeroSectionToPayload,
  type ResourcePageHeroSectionData,
} from "@/lib/resource-page-hero-section";

type ResourcePageHeroSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function ResourcePageHeroSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: ResourcePageHeroSectionEditorProps) {
  const [data, setData] = useState<ResourcePageHeroSectionData>(() =>
    normalizeResourcePageHeroSectionData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof ResourcePageHeroSectionData>(
    key: K,
    value: ResourcePageHeroSectionData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(resourcePageHeroSectionToPayload(data), isActive);
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

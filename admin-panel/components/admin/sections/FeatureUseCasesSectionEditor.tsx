"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  normalizeFeatureUseCasesSectionData,
  featureUseCasesSectionToPayload,
  type FeatureUseCasesSectionData,
} from "@/lib/feature-use-cases-section";

type Props = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function FeatureUseCasesSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: Props) {
  const [form, setForm] = useState<FeatureUseCasesSectionData>(() =>
    normalizeFeatureUseCasesSectionData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await onSave(featureUseCasesSectionToPayload(form), isActive);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => onIsActiveChange(e.target.checked)}
        />
        Section active
      </label>
      <input
        className={inputClass}
        value={form.tagline}
        onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
        placeholder="Tagline"
      />
      <input
        className={inputClass}
        value={form.heading}
        onChange={(e) => setForm((p) => ({ ...p, heading: e.target.value }))}
        placeholder="Heading"
      />
      <input
        className={inputClass}
        value={form.heading_accent}
        onChange={(e) => setForm((p) => ({ ...p, heading_accent: e.target.value }))}
        placeholder="Heading accent"
      />
      <textarea
        className={inputClass}
        rows={3}
        value={form.description}
        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        placeholder="Description"
      />
      <div className="space-y-3">
        {form.items.map((item, index) => (
          <div key={index} className="space-y-2 rounded-xl border border-border p-3">
            <input
              className={inputClass}
              value={item.title}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  items: p.items.map((row, i) =>
                    i === index ? { ...row, title: e.target.value } : row
                  ),
                }))
              }
              placeholder="Use case title"
            />
            <textarea
              className={inputClass}
              rows={2}
              value={item.description}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  items: p.items.map((row, i) =>
                    i === index ? { ...row, description: e.target.value } : row
                  ),
                }))
              }
              placeholder="Use case description"
            />
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm text-red-600"
              onClick={() =>
                setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== index) }))
              }
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm text-muted"
          onClick={() =>
            setForm((p) => ({
              ...p,
              items: [...p.items, { title: "", description: "" }],
            }))
          }
        >
          <Plus className="h-4 w-4" /> Add use case
        </button>
      </div>
      {error ? <p className="text-sm text-[var(--error-text)]">{error}</p> : null}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-[var(--orange)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save section"}
      </button>
    </div>
  );
}

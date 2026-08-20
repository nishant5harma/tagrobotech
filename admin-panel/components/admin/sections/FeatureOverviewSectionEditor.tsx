"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  normalizeFeatureOverviewSectionData,
  featureOverviewSectionToPayload,
  type FeatureOverviewSectionData,
} from "@/lib/feature-overview-section";

type Props = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function FeatureOverviewSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: Props) {
  const [form, setForm] = useState<FeatureOverviewSectionData>(() =>
    normalizeFeatureOverviewSectionData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await onSave(featureOverviewSectionToPayload(form), isActive);
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
      {(
        [
          ["tagline", "Tagline"],
          ["heading", "Heading"],
          ["heading_accent", "Heading accent"],
          ["aside_title", "Aside title"],
        ] as const
      ).map(([key, placeholder]) => (
        <input
          key={key}
          className={inputClass}
          value={form[key]}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          placeholder={placeholder}
        />
      ))}
      <textarea
        className={inputClass}
        rows={3}
        value={form.description}
        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        placeholder="Description"
      />
      <textarea
        className={inputClass}
        rows={4}
        value={form.body}
        onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
        placeholder="Body"
      />
      <textarea
        className={inputClass}
        rows={3}
        value={form.aside_text}
        onChange={(e) => setForm((p) => ({ ...p, aside_text: e.target.value }))}
        placeholder="Aside text"
      />
      <div className="space-y-2">
        {form.bullets.map((bullet, index) => (
          <div key={index} className="flex gap-2">
            <input
              className={inputClass}
              value={bullet}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  bullets: p.bullets.map((row, i) => (i === index ? e.target.value : row)),
                }))
              }
              placeholder="Bullet"
            />
            <button
              type="button"
              className="text-red-600"
              onClick={() =>
                setForm((p) => ({ ...p, bullets: p.bullets.filter((_, i) => i !== index) }))
              }
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm text-muted"
          onClick={() => setForm((p) => ({ ...p, bullets: [...p.bullets, ""] }))}
        >
          <Plus className="h-4 w-4" /> Add bullet
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

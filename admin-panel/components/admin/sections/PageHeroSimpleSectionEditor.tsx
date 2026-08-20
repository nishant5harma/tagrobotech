"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  normalizePageHeroSimpleSectionData,
  pageHeroSimpleSectionToPayload,
  type PageHeroSimpleSectionData,
} from "@/lib/page-hero-simple-section";

type Props = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function PageHeroSimpleSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: Props) {
  const [form, setForm] = useState<PageHeroSimpleSectionData>(() =>
    normalizePageHeroSimpleSectionData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(pageHeroSimpleSectionToPayload(form), isActive);
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

      <fieldset className="space-y-3 rounded-xl border border-border p-4">
        <legend className="px-1 text-sm font-semibold">Content</legend>
        <input
          className={inputClass}
          value={form.heading}
          onChange={(e) => setForm((p) => ({ ...p, heading: e.target.value }))}
          placeholder="Heading"
        />
        <textarea
          className={inputClass}
          rows={3}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="Description"
        />
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border p-4">
        <legend className="px-1 text-sm font-semibold">Buttons</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className={inputClass}
            value={form.primary_button.text}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                primary_button: { ...p.primary_button, text: e.target.value },
              }))
            }
            placeholder="Primary button text"
          />
          <input
            className={inputClass}
            value={form.primary_button.link}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                primary_button: { ...p.primary_button, link: e.target.value },
              }))
            }
            placeholder="Primary button link"
          />
          <input
            className={inputClass}
            value={form.secondary_button.text}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                secondary_button: { ...p.secondary_button, text: e.target.value },
              }))
            }
            placeholder="Secondary button text"
          />
          <input
            className={inputClass}
            value={form.secondary_button.link}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                secondary_button: { ...p.secondary_button, link: e.target.value },
              }))
            }
            placeholder="Secondary button link"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border p-4">
        <legend className="px-1 text-sm font-semibold">Hero image (no mobile mockup)</legend>
        <input
          className={inputClass}
          value={form.image_src}
          onChange={(e) => setForm((p) => ({ ...p, image_src: e.target.value }))}
          placeholder="Image path e.g. /uploads/example.webp"
        />
        <input
          className={inputClass}
          value={form.image_alt}
          onChange={(e) => setForm((p) => ({ ...p, image_alt: e.target.value }))}
          placeholder="Image alt"
        />
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border p-4">
        <div className="flex items-center justify-between">
          <legend className="px-1 text-sm font-semibold">Stats</legend>
          <button
            type="button"
            onClick={() =>
              setForm((p) => ({
                ...p,
                stats: [...p.stats, { value: "", label: "" }],
              }))
            }
            className="inline-flex items-center gap-1 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
        {form.stats.map((stat, index) => (
          <div key={index} className="flex gap-2">
            <input
              className={inputClass}
              value={stat.value}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  stats: p.stats.map((s, i) =>
                    i === index ? { ...s, value: e.target.value } : s
                  ),
                }))
              }
              placeholder="Value"
            />
            <input
              className={inputClass}
              value={stat.label}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  stats: p.stats.map((s, i) =>
                    i === index ? { ...s, label: e.target.value } : s
                  ),
                }))
              }
              placeholder="Label"
            />
            <button
              type="button"
              onClick={() =>
                setForm((p) => ({
                  ...p,
                  stats: p.stats.filter((_, i) => i !== index),
                }))
              }
              className="rounded-lg px-2 text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </fieldset>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-xl bg-[#f15a24] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save section"}
      </button>
    </div>
  );
}

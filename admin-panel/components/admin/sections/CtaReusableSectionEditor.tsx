"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  ctaReusableSectionToPayload,
  normalizeCtaReusableSectionData,
  type CtaReusableSectionData,
} from "@/lib/cta-reusable-section";

type CtaReusableSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function CtaReusableSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: CtaReusableSectionEditorProps) {
  const [form, setForm] = useState<CtaReusableSectionData>(() =>
    normalizeCtaReusableSectionData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof CtaReusableSectionData>(
    key: K,
    value: CtaReusableSectionData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateButton(field: "text" | "link", value: string) {
    setForm((prev) => ({
      ...prev,
      button: { ...prev.button, [field]: value },
    }));
  }

  function updateRating(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      ratings: prev.ratings.map((rating, ratingIndex) =>
        ratingIndex === index ? { value } : rating
      ),
    }));
  }

  function addRating() {
    setForm((prev) => ({
      ...prev,
      ratings: [...prev.ratings, { value: "5.0" }],
    }));
  }

  function removeRating(index: number) {
    setForm((prev) => ({
      ...prev,
      ratings: prev.ratings.filter((_, ratingIndex) => ratingIndex !== index),
    }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);

    try {
      await onSave(ctaReusableSectionToPayload(form), isActive);
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
        <legend className="px-1 text-sm font-semibold text-foreground">Content</legend>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Heading
          </label>
          <input
            value={form.heading}
            onChange={(e) => updateField("heading", e.target.value)}
            className={inputClass}
            placeholder="Book Your Consultation Now"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="Short supporting line below the heading"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Button</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Button text
            </label>
            <input
              value={form.button.text}
              onChange={(e) => updateButton("text", e.target.value)}
              className={inputClass}
              placeholder="Schedule a Free Demo"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Button link
            </label>
            <input
              value={form.button.link}
              onChange={(e) => updateButton("link", e.target.value)}
              className={inputClass}
              placeholder="/contact"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Trust badges</legend>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={form.show_trust_badges}
            onChange={(e) => updateField("show_trust_badges", e.target.checked)}
            className="rounded border-border"
          />
          Show ratings and certification badges
        </label>

        {form.show_trust_badges ? (
          <div className="space-y-3">
            {form.ratings.map((rating, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  value={rating.value}
                  onChange={(e) => updateRating(index, e.target.value)}
                  className={inputClass}
                  placeholder="4.8"
                />
                <button
                  type="button"
                  onClick={() => removeRating(index)}
                  className="rounded-md p-1.5 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                  aria-label={`Remove rating ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addRating}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--surface-muted)]"
            >
              <Plus className="h-4 w-4" />
              Add rating badge
            </button>
          </div>
        ) : null}
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

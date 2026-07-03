"use client";

import { useState } from "react";
import {
  normalizePageCtaSectionData,
  pageCtaSectionToPayload,
  type PageCtaSectionData,
} from "@/lib/page-cta-section";

type PageCtaSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function PageCtaSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: PageCtaSectionEditorProps) {
  const [form, setForm] = useState<PageCtaSectionData>(() =>
    normalizePageCtaSectionData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof PageCtaSectionData>(
    key: K,
    value: PageCtaSectionData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateButton(
    key: "primary_button" | "secondary_button",
    field: "text" | "link",
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);

    try {
      await onSave(pageCtaSectionToPayload(form), isActive);
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
            placeholder="Why Choose Tag RoBo Tech?"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={4}
            className={inputClass}
            placeholder="Short paragraph above the buttons"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Primary button</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Button text
            </label>
            <input
              value={form.primary_button.text}
              onChange={(e) => updateButton("primary_button", "text", e.target.value)}
              className={inputClass}
              placeholder="Get Started for Free"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Button link
            </label>
            <input
              value={form.primary_button.link}
              onChange={(e) => updateButton("primary_button", "link", e.target.value)}
              className={inputClass}
              placeholder="/contact"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Secondary button</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Button text
            </label>
            <input
              value={form.secondary_button.text}
              onChange={(e) => updateButton("secondary_button", "text", e.target.value)}
              className={inputClass}
              placeholder="Schedule a Free Demo"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Button link
            </label>
            <input
              value={form.secondary_button.link}
              onChange={(e) => updateButton("secondary_button", "link", e.target.value)}
              className={inputClass}
              placeholder="/contact"
            />
          </div>
        </div>
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

"use client";

import { useState } from "react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  normalizeSoftwareCtaSectionSoftwareData,
  softwareCtaSectionSoftwareToPayload,
  type SoftwareCtaSectionSoftwareData,
} from "@/lib/software-cta-section-software";

type SoftwareCtaSectionSoftwareEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function SoftwareCtaSectionSoftwareEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: SoftwareCtaSectionSoftwareEditorProps) {
  const [form, setForm] = useState<SoftwareCtaSectionSoftwareData>(() =>
    normalizeSoftwareCtaSectionSoftwareData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateButton(key: "primary_button" | "secondary_button", field: "text" | "link", value: string) {
    setForm((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(softwareCtaSectionSoftwareToPayload(form), isActive);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={isActive} onChange={(e) => onIsActiveChange(e.target.checked)} className="rounded border-border" />
        Section visible on page
      </label>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Ready to deploy CTA</legend>
        <input value={form.tagline} onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))} placeholder="Tagline" className={inputClass} />
        <input value={form.heading} onChange={(e) => setForm((p) => ({ ...p, heading: e.target.value }))} placeholder="Heading" className={inputClass} />
        <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} placeholder="Description" className={inputClass} />
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={form.primary_button.text} onChange={(e) => updateButton("primary_button", "text", e.target.value)} placeholder="Primary button text" className={inputClass} />
          <input value={form.primary_button.link} onChange={(e) => updateButton("primary_button", "link", e.target.value)} placeholder="Primary button link" className={inputClass} />
          <input value={form.secondary_button.text} onChange={(e) => updateButton("secondary_button", "text", e.target.value)} placeholder="Secondary button text" className={inputClass} />
          <input value={form.secondary_button.link} onChange={(e) => updateButton("secondary_button", "link", e.target.value)} placeholder="Secondary button link" className={inputClass} />
        </div>
        <MediaPicker label="CTA image" value={form.image_media_id} onChange={(mediaId) => setForm((p) => ({ ...p, image_media_id: mediaId }))} />
        <input value={form.image_src} onChange={(e) => setForm((p) => ({ ...p, image_src: e.target.value }))} placeholder="Fallback image path" className={inputClass} />
        <input value={form.image_alt} onChange={(e) => setForm((p) => ({ ...p, image_alt: e.target.value }))} placeholder="Image alt text" className={inputClass} />
      </fieldset>

      {error ? <p className="text-sm text-[var(--error-text)]">{error}</p> : null}
      <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-[var(--orange)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? "Saving..." : "Save section"}</button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  normalizeSoftwareIntroSectionSoftwareData,
  softwareIntroSectionSoftwareToPayload,
  type SoftwareIntroBadge,
  type SoftwareIntroSectionSoftwareData,
  type SoftwareIntroValueProp,
} from "@/lib/software-intro-section-software";

type SoftwareIntroSectionSoftwareEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function SoftwareIntroSectionSoftwareEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: SoftwareIntroSectionSoftwareEditorProps) {
  const [data, setData] = useState<SoftwareIntroSectionSoftwareData>(() =>
    normalizeSoftwareIntroSectionSoftwareData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateButton(key: "primary_button" | "secondary_button", field: "text" | "link", value: string) {
    setData((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  }

  function updateBadge(index: number, label: string) {
    setData((prev) => ({
      ...prev,
      badges: prev.badges.map((item, i) => (i === index ? { label } : item)),
    }));
  }

  function addBadge() {
    setData((prev) => ({ ...prev, badges: [...prev.badges, { label: "" }] }));
  }

  function updateValueProp(index: number, patch: Partial<SoftwareIntroValueProp>) {
    setData((prev) => ({
      ...prev,
      value_props: prev.value_props.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(softwareIntroSectionSoftwareToPayload(data), isActive);
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
        <legend className="px-1 text-sm font-semibold text-foreground">Footprints intro</legend>
        <input value={data.eyebrow} onChange={(e) => setData((p) => ({ ...p, eyebrow: e.target.value }))} placeholder="Eyebrow" className={inputClass} />
        <input value={data.heading} onChange={(e) => setData((p) => ({ ...p, heading: e.target.value }))} placeholder="Heading" className={inputClass} />
        <textarea value={data.description} onChange={(e) => setData((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Description" className={inputClass} />
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={data.primary_button.text} onChange={(e) => updateButton("primary_button", "text", e.target.value)} placeholder="Primary button text" className={inputClass} />
          <input value={data.primary_button.link} onChange={(e) => updateButton("primary_button", "link", e.target.value)} placeholder="Primary button link" className={inputClass} />
          <input value={data.secondary_button.text} onChange={(e) => updateButton("secondary_button", "text", e.target.value)} placeholder="Secondary button text" className={inputClass} />
          <input value={data.secondary_button.link} onChange={(e) => updateButton("secondary_button", "link", e.target.value)} placeholder="Secondary button link" className={inputClass} />
        </div>
        <MediaPicker label="Dashboard image" value={data.image_media_id} onChange={(mediaId) => setData((p) => ({ ...p, image_media_id: mediaId }))} />
        <input value={data.image_src} onChange={(e) => setData((p) => ({ ...p, image_src: e.target.value }))} placeholder="Fallback image path" className={inputClass} />
        <input value={data.image_alt} onChange={(e) => setData((p) => ({ ...p, image_alt: e.target.value }))} placeholder="Image alt text" className={inputClass} />
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Badges</legend>
        {data.badges.map((badge: SoftwareIntroBadge, index) => (
          <input key={`badge-${index}`} value={badge.label} onChange={(e) => updateBadge(index, e.target.value)} placeholder="Badge label" className={inputClass} />
        ))}
        <button type="button" onClick={addBadge} className="inline-flex items-center gap-2 text-sm text-[var(--orange)]"><Plus className="h-4 w-4" />Add badge</button>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Value props</legend>
        {data.value_props.map((prop, index) => (
          <div key={`prop-${index}`} className="grid gap-3 sm:grid-cols-3">
            <input value={prop.number} onChange={(e) => updateValueProp(index, { number: e.target.value })} placeholder="Number" className={inputClass} />
            <input value={prop.title} onChange={(e) => updateValueProp(index, { title: e.target.value })} placeholder="Title" className={inputClass} />
            <input value={prop.description} onChange={(e) => updateValueProp(index, { description: e.target.value })} placeholder="Description" className={inputClass} />
          </div>
        ))}
      </fieldset>

      {error ? <p className="text-sm text-[var(--error-text)]">{error}</p> : null}
      <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-[var(--orange)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? "Saving..." : "Save section"}</button>
    </div>
  );
}

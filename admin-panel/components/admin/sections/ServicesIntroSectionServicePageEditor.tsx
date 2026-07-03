"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  normalizeServicesIntroSectionServicePageData,
  servicesIntroSectionServicePageToPayload,
  type ServicesIntroFeaturedItem,
  type ServicesIntroProcessStep,
  type ServicesIntroSectionServicePageData,
} from "@/lib/services-intro-section-service-page";

type ServicesIntroSectionServicePageEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function ServicesIntroSectionServicePageEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: ServicesIntroSectionServicePageEditorProps) {
  const [data, setData] = useState<ServicesIntroSectionServicePageData>(() =>
    normalizeServicesIntroSectionServicePageData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateButton(
    key: "primary_button" | "secondary_button",
    field: "text" | "link",
    value: string
  ) {
    setData((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  }

  function updateFeaturedItem(index: number, patch: Partial<ServicesIntroFeaturedItem>) {
    setData((prev) => ({
      ...prev,
      featured_items: prev.featured_items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  }

  function addFeaturedItem() {
    setData((prev) => ({
      ...prev,
      featured_items: [
        ...prev.featured_items,
        {
          summary_label: "",
          title: "",
          image_media_id: null,
          image_src: "",
          image_alt: "",
          link: "",
        },
      ],
    }));
  }

  function removeFeaturedItem(index: number) {
    setData((prev) => ({
      ...prev,
      featured_items: prev.featured_items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function updateProcessStep(index: number, patch: Partial<ServicesIntroProcessStep>) {
    setData((prev) => ({
      ...prev,
      process_steps: prev.process_steps.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(servicesIntroSectionServicePageToPayload(data), isActive);
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
        <legend className="px-1 text-sm font-semibold text-foreground">Intro content</legend>
        <input value={data.eyebrow} onChange={(e) => setData((prev) => ({ ...prev, eyebrow: e.target.value }))} placeholder="Eyebrow" className={inputClass} />
        <input value={data.heading} onChange={(e) => setData((prev) => ({ ...prev, heading: e.target.value }))} placeholder="Heading" className={inputClass} />
        <textarea value={data.description} onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))} rows={3} placeholder="Description" className={inputClass} />
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={data.primary_button.text} onChange={(e) => updateButton("primary_button", "text", e.target.value)} placeholder="Primary button text" className={inputClass} />
          <input value={data.primary_button.link} onChange={(e) => updateButton("primary_button", "link", e.target.value)} placeholder="Primary button link" className={inputClass} />
          <input value={data.secondary_button.text} onChange={(e) => updateButton("secondary_button", "text", e.target.value)} placeholder="Secondary button text" className={inputClass} />
          <input value={data.secondary_button.link} onChange={(e) => updateButton("secondary_button", "link", e.target.value)} placeholder="Secondary button link" className={inputClass} />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Featured services</legend>
        {data.featured_items.map((item, index) => (
          <div key={`featured-${index}`} className="space-y-3 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Featured #{index + 1}</p>
              <button type="button" onClick={() => removeFeaturedItem(index)} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
            <input value={item.summary_label} onChange={(e) => updateFeaturedItem(index, { summary_label: e.target.value })} placeholder="Summary label" className={inputClass} />
            <input value={item.title} onChange={(e) => updateFeaturedItem(index, { title: e.target.value })} placeholder="Title" className={inputClass} />
            <input value={item.link} onChange={(e) => updateFeaturedItem(index, { link: e.target.value })} placeholder="Link" className={inputClass} />
            <MediaPicker label="Image" value={item.image_media_id} onChange={(mediaId) => updateFeaturedItem(index, { image_media_id: mediaId })} />
            <input value={item.image_src} onChange={(e) => updateFeaturedItem(index, { image_src: e.target.value })} placeholder="Fallback image path" className={inputClass} />
            <input value={item.image_alt} onChange={(e) => updateFeaturedItem(index, { image_alt: e.target.value })} placeholder="Image alt text" className={inputClass} />
          </div>
        ))}
        <button type="button" onClick={addFeaturedItem} className="inline-flex items-center gap-2 text-sm text-[var(--orange)]"><Plus className="h-4 w-4" />Add featured service</button>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Process steps</legend>
        {data.process_steps.map((step, index) => (
          <div key={`step-${index}`} className="grid gap-3 sm:grid-cols-3">
            <input value={step.number} onChange={(e) => updateProcessStep(index, { number: e.target.value })} placeholder="Number" className={inputClass} />
            <input value={step.title} onChange={(e) => updateProcessStep(index, { title: e.target.value })} placeholder="Title" className={inputClass} />
            <input value={step.description} onChange={(e) => updateProcessStep(index, { description: e.target.value })} placeholder="Description" className={inputClass} />
          </div>
        ))}
      </fieldset>

      {error ? <p className="text-sm text-[var(--error-text)]">{error}</p> : null}
      <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-[var(--orange)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? "Saving..." : "Save section"}</button>
    </div>
  );
}

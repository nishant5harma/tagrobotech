"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  normalizeServicesCatalogueSectionServicePageData,
  servicesCatalogueSectionServicePageToPayload,
  type ServicesCatalogueServiceItem,
  type ServicesCatalogueSectionServicePageData,
} from "@/lib/services-catalogue-section-service-page";

type ServicesCatalogueSectionServicePageEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function ServicesCatalogueSectionServicePageEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: ServicesCatalogueSectionServicePageEditorProps) {
  const [data, setData] = useState<ServicesCatalogueSectionServicePageData>(() =>
    normalizeServicesCatalogueSectionServicePageData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [openServiceIndex, setOpenServiceIndex] = useState<number | null>(0);

  function updateService(index: number, patch: Partial<ServicesCatalogueServiceItem>) {
    setData((prev) => ({
      ...prev,
      services: prev.services.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  }

  function updateServiceTags(index: number, value: string) {
    updateService(index, {
      tags: value.split(",").map((tag) => tag.trim()).filter(Boolean),
    });
  }

  function updateServiceHighlights(index: number, value: string) {
    updateService(index, {
      highlights: value.split("\n").map((line) => line.trim()).filter(Boolean),
    });
  }

  function addService() {
    setData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          number: String(prev.services.length + 1).padStart(2, "0"),
          category_key: "enterprise",
          category_label: "Enterprise",
          summary_label: "",
          title: "",
          short_description: "",
          image_media_id: null,
          image_src: "",
          image_alt: "",
          link: "",
          tags: [],
          highlights: [],
          enquire_text: "Enquire",
          enquire_link: "/contact",
        },
      ],
    }));
  }

  function removeService(index: number) {
    setData((prev) => ({
      ...prev,
      services: prev.services.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(servicesCatalogueSectionServicePageToPayload(data), isActive);
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
        <legend className="px-1 text-sm font-semibold text-foreground">Catalogue header</legend>
        <input value={data.tagline} onChange={(e) => setData((prev) => ({ ...prev, tagline: e.target.value }))} placeholder="Tagline" className={inputClass} />
        <input value={data.heading} onChange={(e) => setData((prev) => ({ ...prev, heading: e.target.value }))} placeholder="Heading" className={inputClass} />
        <textarea value={data.description} onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))} rows={3} placeholder="Description" className={inputClass} />
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Services ({data.services.length})</legend>
        {data.services.map((service, index) => {
          const isOpen = openServiceIndex === index;
          return (
            <div key={`service-${index}`} className="rounded-xl border border-border bg-card">
              <button
                type="button"
                onClick={() => setOpenServiceIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-sm font-medium text-foreground">
                  {service.number} · {service.title || `Service ${index + 1}`}
                </span>
                <span className="text-xs text-muted">{service.category_label}</span>
              </button>
              {isOpen ? (
                <div className="space-y-3 border-t border-border p-4">
                  <div className="flex justify-end">
                    <button type="button" onClick={() => removeService(index)} className="inline-flex items-center gap-1 text-sm text-red-500">
                      <Trash2 className="h-4 w-4" />Remove
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <input value={service.number} onChange={(e) => updateService(index, { number: e.target.value })} placeholder="Number" className={inputClass} />
                    <input value={service.category_key} onChange={(e) => updateService(index, { category_key: e.target.value })} placeholder="Category key" className={inputClass} />
                    <input value={service.category_label} onChange={(e) => updateService(index, { category_label: e.target.value })} placeholder="Category label" className={inputClass} />
                  </div>
                  <input value={service.summary_label} onChange={(e) => updateService(index, { summary_label: e.target.value })} placeholder="Summary label" className={inputClass} />
                  <input value={service.title} onChange={(e) => updateService(index, { title: e.target.value })} placeholder="Title" className={inputClass} />
                  <textarea value={service.short_description} onChange={(e) => updateService(index, { short_description: e.target.value })} rows={3} placeholder="Short description" className={inputClass} />
                  <input value={service.link} onChange={(e) => updateService(index, { link: e.target.value })} placeholder="Link" className={inputClass} />
                  <input value={service.tags.join(", ")} onChange={(e) => updateServiceTags(index, e.target.value)} placeholder="Tags (comma separated)" className={inputClass} />
                  <textarea value={service.highlights.join("\n")} onChange={(e) => updateServiceHighlights(index, e.target.value)} rows={4} placeholder="Highlights (one per line)" className={inputClass} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input value={service.enquire_text} onChange={(e) => updateService(index, { enquire_text: e.target.value })} placeholder="Enquire button text" className={inputClass} />
                    <input value={service.enquire_link} onChange={(e) => updateService(index, { enquire_link: e.target.value })} placeholder="Enquire button link" className={inputClass} />
                  </div>
                  <MediaPicker label="Service image" value={service.image_media_id} onChange={(mediaId) => updateService(index, { image_media_id: mediaId })} />
                  <input value={service.image_src} onChange={(e) => updateService(index, { image_src: e.target.value })} placeholder="Fallback image path" className={inputClass} />
                  <input value={service.image_alt} onChange={(e) => updateService(index, { image_alt: e.target.value })} placeholder="Image alt text" className={inputClass} />
                </div>
              ) : null}
            </div>
          );
        })}
        <button type="button" onClick={addService} className="inline-flex items-center gap-2 text-sm text-[var(--orange)]"><Plus className="h-4 w-4" />Add service</button>
      </fieldset>

      {error ? <p className="text-sm text-[var(--error-text)]">{error}</p> : null}
      <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-[var(--orange)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? "Saving..." : "Save section"}</button>
    </div>
  );
}

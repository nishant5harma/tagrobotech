"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  normalizeSoftwareModulesSectionSoftwareData,
  softwareModulesSectionSoftwareToPayload,
  type SoftwareModuleItem,
  type SoftwareModulesSectionSoftwareData,
} from "@/lib/software-modules-section-software";

type SoftwareModulesSectionSoftwareEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function SoftwareModulesSectionSoftwareEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: SoftwareModulesSectionSoftwareEditorProps) {
  const [data, setData] = useState<SoftwareModulesSectionSoftwareData>(() =>
    normalizeSoftwareModulesSectionSoftwareData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function updateModule(index: number, patch: Partial<SoftwareModuleItem>) {
    setData((prev) => ({
      ...prev,
      modules: prev.modules.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  function addModule() {
    setData((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        { number: String(prev.modules.length + 1).padStart(2, "0"), title: "", description: "" },
      ],
    }));
  }

  function removeModule(index: number) {
    setData((prev) => ({ ...prev, modules: prev.modules.filter((_, i) => i !== index) }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(softwareModulesSectionSoftwareToPayload(data), isActive);
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
        <legend className="px-1 text-sm font-semibold text-foreground">Analysis header</legend>
        <input value={data.tagline} onChange={(e) => setData((p) => ({ ...p, tagline: e.target.value }))} placeholder="Tagline" className={inputClass} />
        <input value={data.heading} onChange={(e) => setData((p) => ({ ...p, heading: e.target.value }))} placeholder="Heading" className={inputClass} />
        <textarea value={data.description} onChange={(e) => setData((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Description" className={inputClass} />
        <input value={data.platform_tagline} onChange={(e) => setData((p) => ({ ...p, platform_tagline: e.target.value }))} placeholder="Platform tagline" className={inputClass} />
        <input value={data.platform_heading} onChange={(e) => setData((p) => ({ ...p, platform_heading: e.target.value }))} placeholder="Platform heading" className={inputClass} />
        <textarea value={data.platform_description} onChange={(e) => setData((p) => ({ ...p, platform_description: e.target.value }))} rows={2} placeholder="Platform description" className={inputClass} />
        <MediaPicker label="Module preview image" value={data.image_media_id} onChange={(mediaId) => setData((p) => ({ ...p, image_media_id: mediaId }))} />
        <input value={data.image_src} onChange={(e) => setData((p) => ({ ...p, image_src: e.target.value }))} placeholder="Fallback image path" className={inputClass} />
        <input value={data.image_alt} onChange={(e) => setData((p) => ({ ...p, image_alt: e.target.value }))} placeholder="Image alt text" className={inputClass} />
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Modules ({data.modules.length})</legend>
        {data.modules.map((module, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={`module-${index}`} className="rounded-xl border border-border bg-card">
              <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full items-center justify-between px-4 py-3 text-left">
                <span className="text-sm font-medium text-foreground">{module.number} · {module.title || `Module ${index + 1}`}</span>
              </button>
              {isOpen ? (
                <div className="space-y-3 border-t border-border p-4">
                  <div className="flex justify-end">
                    <button type="button" onClick={() => removeModule(index)} className="inline-flex items-center gap-1 text-sm text-red-500"><Trash2 className="h-4 w-4" />Remove</button>
                  </div>
                  <input value={module.number} onChange={(e) => updateModule(index, { number: e.target.value })} placeholder="Number" className={inputClass} />
                  <input value={module.title} onChange={(e) => updateModule(index, { title: e.target.value })} placeholder="Title" className={inputClass} />
                  <textarea value={module.description} onChange={(e) => updateModule(index, { description: e.target.value })} rows={3} placeholder="Description" className={inputClass} />
                </div>
              ) : null}
            </div>
          );
        })}
        <button type="button" onClick={addModule} className="inline-flex items-center gap-2 text-sm text-[var(--orange)]"><Plus className="h-4 w-4" />Add module</button>
      </fieldset>

      {error ? <p className="text-sm text-[var(--error-text)]">{error}</p> : null}
      <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-[var(--orange)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? "Saving..." : "Save section"}</button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  normalizeToolsIntroSectionToolsData,
  toolsIntroSectionToolsToPayload,
  type ToolsIntroPill,
  type ToolsIntroSectionToolsData,
  type ToolsIntroStat,
} from "@/lib/tools-intro-section-tools";

type ToolsIntroSectionToolsEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function ToolsIntroSectionToolsEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: ToolsIntroSectionToolsEditorProps) {
  const [data, setData] = useState<ToolsIntroSectionToolsData>(() =>
    normalizeToolsIntroSectionToolsData(initialData)
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

  function updateStat(index: number, patch: Partial<ToolsIntroStat>) {
    setData((prev) => ({
      ...prev,
      stats: prev.stats.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  }

  function updatePill(index: number, patch: Partial<ToolsIntroPill>) {
    setData((prev) => ({
      ...prev,
      tool_pills: prev.tool_pills.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  }

  function addPill() {
    setData((prev) => ({
      ...prev,
      tool_pills: [
        ...prev.tool_pills,
        {
          title: "",
          image_media_id: null,
          image_src: "",
          image_alt: "",
          anchor: "",
        },
      ],
    }));
  }

  function removePill(index: number) {
    setData((prev) => ({
      ...prev,
      tool_pills: prev.tool_pills.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(toolsIntroSectionToolsToPayload(data), isActive);
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
        <input value={data.tagline_below} onChange={(e) => setData((prev) => ({ ...prev, tagline_below: e.target.value }))} placeholder="Tagline below stats" className={inputClass} />
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={data.primary_button.text} onChange={(e) => updateButton("primary_button", "text", e.target.value)} placeholder="Primary button text" className={inputClass} />
          <input value={data.primary_button.link} onChange={(e) => updateButton("primary_button", "link", e.target.value)} placeholder="Primary button link" className={inputClass} />
          <input value={data.secondary_button.text} onChange={(e) => updateButton("secondary_button", "text", e.target.value)} placeholder="Secondary button text" className={inputClass} />
          <input value={data.secondary_button.link} onChange={(e) => updateButton("secondary_button", "link", e.target.value)} placeholder="Secondary button link" className={inputClass} />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Stats</legend>
        {data.stats.map((stat, index) => (
          <div key={`stat-${index}`} className="grid gap-3 sm:grid-cols-2">
            <input value={stat.value} onChange={(e) => updateStat(index, { value: e.target.value })} placeholder="Value" className={inputClass} />
            <input value={stat.label} onChange={(e) => updateStat(index, { label: e.target.value })} placeholder="Label" className={inputClass} />
          </div>
        ))}
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Tool pills</legend>
        {data.tool_pills.map((pill, index) => (
          <div key={`pill-${index}`} className="space-y-3 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Pill #{index + 1}</p>
              <button type="button" onClick={() => removePill(index)} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
            <input value={pill.title} onChange={(e) => updatePill(index, { title: e.target.value })} placeholder="Title" className={inputClass} />
            <input value={pill.anchor} onChange={(e) => updatePill(index, { anchor: e.target.value })} placeholder="Anchor id" className={inputClass} />
            <MediaPicker label="Image" value={pill.image_media_id} onChange={(mediaId) => updatePill(index, { image_media_id: mediaId })} />
            <input value={pill.image_src} onChange={(e) => updatePill(index, { image_src: e.target.value })} placeholder="Fallback image path" className={inputClass} />
            <input value={pill.image_alt} onChange={(e) => updatePill(index, { image_alt: e.target.value })} placeholder="Image alt text" className={inputClass} />
          </div>
        ))}
        <button type="button" onClick={addPill} className="inline-flex items-center gap-2 text-sm text-[var(--orange)]"><Plus className="h-4 w-4" />Add tool pill</button>
      </fieldset>

      {error ? <p className="text-sm text-[var(--error-text)]">{error}</p> : null}
      <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-[var(--orange)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? "Saving..." : "Save section"}</button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  normalizeToolsFlagshipSectionToolsData,
  toolsFlagshipSectionToolsToPayload,
  type ToolsFlagshipItem,
  type ToolsFlagshipSectionToolsData,
} from "@/lib/tools-flagship-section-tools";

type ToolsFlagshipSectionToolsEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function ToolsFlagshipSectionToolsEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: ToolsFlagshipSectionToolsEditorProps) {
  const [data, setData] = useState<ToolsFlagshipSectionToolsData>(() =>
    normalizeToolsFlagshipSectionToolsData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function updateTool(index: number, patch: Partial<ToolsFlagshipItem>) {
    setData((prev) => ({
      ...prev,
      tools: prev.tools.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  }

  function updateTags(index: number, value: string) {
    updateTool(index, { tags: value.split(",").map((tag) => tag.trim()).filter(Boolean) });
  }

  function updateHighlights(index: number, value: string) {
    updateTool(index, {
      highlights: value.split("\n").map((line) => line.trim()).filter(Boolean),
    });
  }

  function updateHowItWorks(index: number, value: string) {
    const lines = value.split("\n").map((line) => line.trim()).filter(Boolean);
    updateTool(index, {
      how_it_works: lines.map((text, stepIndex) => ({
        step: String(stepIndex + 1),
        text,
      })),
    });
  }

  function addTool() {
    setData((prev) => ({
      ...prev,
      tools: [
        ...prev.tools,
        {
          number: String(prev.tools.length + 1).padStart(2, "0"),
          badge: "Flagship tool",
          title: "",
          summary: "",
          description: "",
          image_media_id: null,
          image_src: "",
          image_alt: "",
          anchor: "",
          tags: [],
          highlights: [],
          how_it_works: [],
          deploy_text: "Deploy",
          deploy_link: "/contact",
        },
      ],
    }));
  }

  function removeTool(index: number) {
    setData((prev) => ({
      ...prev,
      tools: prev.tools.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(toolsFlagshipSectionToolsToPayload(data), isActive);
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
        <legend className="px-1 text-sm font-semibold text-foreground">Section header</legend>
        <input value={data.tagline} onChange={(e) => setData((prev) => ({ ...prev, tagline: e.target.value }))} placeholder="Tagline" className={inputClass} />
        <input value={data.heading} onChange={(e) => setData((prev) => ({ ...prev, heading: e.target.value }))} placeholder="Heading" className={inputClass} />
        <textarea value={data.description} onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))} rows={3} placeholder="Description" className={inputClass} />
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Flagship tools ({data.tools.length})</legend>
        {data.tools.map((tool, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={`tool-${index}`} className="rounded-xl border border-border bg-card">
              <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full items-center justify-between px-4 py-3 text-left">
                <span className="text-sm font-medium text-foreground">{tool.number} · {tool.title || `Tool ${index + 1}`}</span>
              </button>
              {isOpen ? (
                <div className="space-y-3 border-t border-border p-4">
                  <div className="flex justify-end">
                    <button type="button" onClick={() => removeTool(index)} className="inline-flex items-center gap-1 text-sm text-red-500"><Trash2 className="h-4 w-4" />Remove</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input value={tool.number} onChange={(e) => updateTool(index, { number: e.target.value })} placeholder="Number" className={inputClass} />
                    <input value={tool.badge} onChange={(e) => updateTool(index, { badge: e.target.value })} placeholder="Badge" className={inputClass} />
                  </div>
                  <input value={tool.title} onChange={(e) => updateTool(index, { title: e.target.value })} placeholder="Title" className={inputClass} />
                  <input value={tool.anchor} onChange={(e) => updateTool(index, { anchor: e.target.value })} placeholder="Anchor id" className={inputClass} />
                  <textarea value={tool.summary} onChange={(e) => updateTool(index, { summary: e.target.value })} rows={2} placeholder="Summary" className={inputClass} />
                  <textarea value={tool.description} onChange={(e) => updateTool(index, { description: e.target.value })} rows={3} placeholder="Description" className={inputClass} />
                  <input value={tool.tags.join(", ")} onChange={(e) => updateTags(index, e.target.value)} placeholder="Tags (comma separated)" className={inputClass} />
                  <textarea value={tool.highlights.join("\n")} onChange={(e) => updateHighlights(index, e.target.value)} rows={4} placeholder="Highlights (one per line)" className={inputClass} />
                  <textarea value={tool.how_it_works.map((step) => step.text).join("\n")} onChange={(e) => updateHowItWorks(index, e.target.value)} rows={3} placeholder="How it works steps (one per line, optional)" className={inputClass} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input value={tool.deploy_text} onChange={(e) => updateTool(index, { deploy_text: e.target.value })} placeholder="Deploy button text" className={inputClass} />
                    <input value={tool.deploy_link} onChange={(e) => updateTool(index, { deploy_link: e.target.value })} placeholder="Deploy button link" className={inputClass} />
                  </div>
                  <MediaPicker label="Tool image" value={tool.image_media_id} onChange={(mediaId) => updateTool(index, { image_media_id: mediaId })} />
                  <input value={tool.image_src} onChange={(e) => updateTool(index, { image_src: e.target.value })} placeholder="Fallback image path" className={inputClass} />
                  <input value={tool.image_alt} onChange={(e) => updateTool(index, { image_alt: e.target.value })} placeholder="Image alt text" className={inputClass} />
                </div>
              ) : null}
            </div>
          );
        })}
        <button type="button" onClick={addTool} className="inline-flex items-center gap-2 text-sm text-[var(--orange)]"><Plus className="h-4 w-4" />Add tool</button>
      </fieldset>

      {error ? <p className="text-sm text-[var(--error-text)]">{error}</p> : null}
      <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-[var(--orange)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? "Saving..." : "Save section"}</button>
    </div>
  );
}

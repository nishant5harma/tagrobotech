"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  caseStudySectionToPayload,
  normalizeCaseStudySectionData,
  type CaseStudyItem,
  type CaseStudySectionData,
} from "@/lib/case-study-section";

type CaseStudySectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

function emptyItem(index: number): CaseStudyItem {
  return {
    id: `case-study-${Date.now()}-${index}`,
    title: "",
    excerpt: "",
    client: "",
    industry: "",
    media_id: null,
    image_src: "",
    image_alt: "",
    link_text: "Read more",
    link: "/contact",
  };
}

export default function CaseStudySectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: CaseStudySectionEditorProps) {
  const [form, setForm] = useState<CaseStudySectionData>(() =>
    normalizeCaseStudySectionData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof CaseStudySectionData>(
    key: K,
    value: CaseStudySectionData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateItem(index: number, field: keyof CaseStudyItem, value: string) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addItem() {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, emptyItem(prev.items.length + 1)],
    }));
  }

  function removeItem(index: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(caseStudySectionToPayload(form), isActive);
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
        <legend className="px-1 text-sm font-semibold text-foreground">Section header</legend>
        <input
          className={inputClass}
          value={form.tagline}
          onChange={(e) => updateField("tagline", e.target.value)}
          placeholder="Tagline"
        />
        <input
          className={inputClass}
          value={form.heading}
          onChange={(e) => updateField("heading", e.target.value)}
          placeholder="Heading"
        />
        <textarea
          className={inputClass}
          rows={3}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Description"
        />
        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Read more character limit
          </label>
          <input
            type="number"
            min={80}
            max={600}
            className={inputClass}
            value={form.read_more_chars}
            onChange={(e) => updateField("read_more_chars", Number(e.target.value) || 160)}
          />
        </div>
      </fieldset>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Case study cards</h3>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-[var(--surface-muted)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add card
          </button>
        </div>

        {form.items.map((item, index) => (
          <fieldset
            key={item.id}
            className="space-y-3 rounded-xl border border-border bg-[var(--surface-muted)]/20 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <legend className="px-1 text-sm font-semibold text-foreground">
                Card {index + 1}
              </legend>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>

            <input
              className={inputClass}
              value={item.title}
              onChange={(e) => updateItem(index, "title", e.target.value)}
              placeholder="Title"
            />
            <textarea
              className={inputClass}
              rows={4}
              value={item.excerpt}
              onChange={(e) => updateItem(index, "excerpt", e.target.value)}
              placeholder="Text / story (long text gets Read more on the site)"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className={inputClass}
                value={item.industry}
                onChange={(e) => updateItem(index, "industry", e.target.value)}
                placeholder="Industry"
              />
              <input
                className={inputClass}
                value={item.client}
                onChange={(e) => updateItem(index, "client", e.target.value)}
                placeholder="Client"
              />
            </div>
            <input
              className={inputClass}
              value={item.image_src}
              onChange={(e) => updateItem(index, "image_src", e.target.value)}
              placeholder="Image path (e.g. /uploads/example.webp)"
            />
            <input
              className={inputClass}
              value={item.image_alt}
              onChange={(e) => updateItem(index, "image_alt", e.target.value)}
              placeholder="Image alt text"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className={inputClass}
                value={item.link_text}
                onChange={(e) => updateItem(index, "link_text", e.target.value)}
                placeholder="Link label"
              />
              <input
                className={inputClass}
                value={item.link}
                onChange={(e) => updateItem(index, "link", e.target.value)}
                placeholder="Link URL"
              />
            </div>
          </fieldset>
        ))}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-xl bg-[#f15a24] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#d94e1f] disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save section"}
      </button>
    </div>
  );
}

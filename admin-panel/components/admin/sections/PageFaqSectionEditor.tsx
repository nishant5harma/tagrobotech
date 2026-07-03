"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import {
  normalizePageFaqSectionData,
  pageFaqSectionToPayload,
  type PageFaqSectionData,
} from "@/lib/page-faq-section";

type PageFaqSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function PageFaqSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: PageFaqSectionEditorProps) {
  const [form, setForm] = useState<PageFaqSectionData>(() =>
    normalizePageFaqSectionData(initialData)
  );
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof PageFaqSectionData>(
    key: K,
    value: PageFaqSectionData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateItem(index: number, field: "question" | "answer", value: string) {
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
      items: [...prev.items, { question: "New question", answer: "" }],
    }));
    setOpenItemIndex(form.items.length);
  }

  function removeItem(index: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
    setOpenItemIndex(null);
  }

  async function handleSave() {
    setError("");
    setSaving(true);

    try {
      await onSave(pageFaqSectionToPayload(form), isActive);
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
        <legend className="px-1 text-sm font-semibold text-foreground">Header</legend>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Tagline
          </label>
          <input
            value={form.tagline}
            onChange={(e) => updateField("tagline", e.target.value)}
            className={inputClass}
            placeholder="FAQ"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Heading
            </label>
            <input
              value={form.heading}
              onChange={(e) => updateField("heading", e.target.value)}
              className={inputClass}
              placeholder="Frequently Asked"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Heading accent (orange)
            </label>
            <input
              value={form.heading_accent}
              onChange={(e) => updateField("heading_accent", e.target.value)}
              className={inputClass}
              placeholder="Questions"
            />
          </div>
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
            placeholder="Short intro text above the FAQ list"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">FAQ items</legend>

        <div className="space-y-3">
          {form.items.map((item, index) => {
            const isOpen = openItemIndex === index;

            return (
              <div key={index} className="rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 px-3 py-3">
                  <button
                    type="button"
                    onClick={() => setOpenItemIndex(isOpen ? null : index)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <span className="rounded-md bg-[var(--surface-muted)] px-2 py-0.5 text-xs text-muted">
                      #{index + 1}
                    </span>
                    <span className="truncate text-sm font-medium text-foreground">
                      {item.question || "Untitled question"}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="ml-auto h-4 w-4 shrink-0 text-muted" />
                    ) : (
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-muted" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded-md p-1.5 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                    aria-label={`Remove FAQ item ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {isOpen ? (
                  <div className="space-y-4 border-t border-border px-4 py-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                        Question
                      </label>
                      <input
                        value={item.question}
                        onChange={(e) => updateItem(index, "question", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                        Answer
                      </label>
                      <textarea
                        value={item.answer}
                        onChange={(e) => updateItem(index, "answer", e.target.value)}
                        rows={4}
                        className={inputClass}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--surface-muted)]"
        >
          <Plus className="h-4 w-4" />
          Add FAQ item
        </button>
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

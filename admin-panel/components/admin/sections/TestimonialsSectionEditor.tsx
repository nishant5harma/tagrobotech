"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  createTestimonialId,
  normalizeTestimonialsSectionData,
  testimonialsSectionToPayload,
  type TestimonialItem,
  type TestimonialsSectionData,
} from "@/lib/testimonials-section";

type TestimonialsSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function TestimonialsSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: TestimonialsSectionEditorProps) {
  const [data, setData] = useState<TestimonialsSectionData>(() =>
    normalizeTestimonialsSectionData(initialData)
  );
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof TestimonialsSectionData>(
    key: K,
    value: TestimonialsSectionData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateStat(index: number, field: "value" | "label", value: string) {
    setData((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) =>
        i === index ? { ...stat, [field]: value } : stat
      ),
    }));
  }

  function updateItem(index: number, patch: Partial<TestimonialItem>) {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i !== index) return item;
        const next = { ...item, ...patch };
        if (patch.company && !patch.id) {
          next.id = createTestimonialId(patch.company, index);
        }
        return next;
      }),
    }));
  }

  function addItem() {
    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `testimonial-${prev.items.length + 1}`,
          quote: "",
          author: "",
          role: "",
          company: "",
          rating: 5,
          highlight: "",
          media_id: null,
          company_logo_src: "",
        },
      ],
    }));
    setOpenItemIndex(data.items.length);
  }

  function removeItem(index: number) {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    setOpenItemIndex(null);
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(
        testimonialsSectionToPayload({
          ...data,
          items: data.items.map((item, index) => ({
            ...item,
            id: item.id || createTestimonialId(item.company, index),
          })),
        }),
        isActive
      );
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
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Tagline</label>
          <input
            value={data.tagline}
            onChange={(e) => updateField("tagline", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">Heading</label>
            <input
              value={data.heading}
              onChange={(e) => updateField("heading", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Heading accent
            </label>
            <input
              value={data.heading_accent}
              onChange={(e) => updateField("heading_accent", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Description</label>
          <textarea
            value={data.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Stats</legend>

        {data.stats.map((stat, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Value</label>
              <input
                value={stat.value}
                onChange={(e) => updateStat(index, "value", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Label</label>
              <input
                value={stat.label}
                onChange={(e) => updateStat(index, "label", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">
          Testimonials ({data.items.length})
        </legend>

        {data.items.map((item, index) => {
          const isOpen = openItemIndex === index;
          return (
            <div
              key={`${item.id}-${index}`}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <button
                type="button"
                onClick={() => setOpenItemIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {index + 1}. {item.author || "Untitled"} — {item.company || "No company"}
                  </p>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
                )}
              </button>

              {isOpen ? (
                <div className="space-y-4 border-t border-border px-4 py-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted">Quote</label>
                    <textarea
                      value={item.quote}
                      onChange={(e) => updateItem(index, { quote: e.target.value })}
                      rows={4}
                      className={`${inputClass} resize-y`}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">Author</label>
                      <input
                        value={item.author}
                        onChange={(e) => updateItem(index, { author: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">Role</label>
                      <input
                        value={item.role}
                        onChange={(e) => updateItem(index, { role: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">Company</label>
                      <input
                        value={item.company}
                        onChange={(e) => updateItem(index, { company: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium uppercase tracking-wide text-muted">Rating (1–5)</label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={item.rating}
                        onChange={(e) =>
                          updateItem(index, {
                            rating: Math.min(5, Math.max(1, Number(e.target.value) || 5)),
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                      Highlight badge (optional)
                    </label>
                    <input
                      value={item.highlight}
                      onChange={(e) => updateItem(index, { highlight: e.target.value })}
                      placeholder="e.g. Healthcare-grade accuracy"
                      className={inputClass}
                    />
                  </div>

                  <MediaPicker
                    label="Company logo"
                    value={item.media_id}
                    onChange={(mediaId) => updateItem(index, { media_id: mediaId })}
                  />

                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                      Fallback logo path
                    </label>
                    <input
                      value={item.company_logo_src}
                      onChange={(e) => updateItem(index, { company_logo_src: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove testimonial
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}

        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted transition hover:border-[var(--orange)] hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          Add testimonial
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

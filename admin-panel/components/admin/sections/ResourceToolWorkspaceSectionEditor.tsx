"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  normalizeResourceToolWorkspaceSectionData,
  resourceToolWorkspaceSectionToPayload,
  type ResourceToolType,
  type ResourceToolWorkspaceSectionData,
} from "@/lib/resource-tool-workspace-section";

type Props = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function ResourceToolWorkspaceSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: Props) {
  const [form, setForm] = useState<ResourceToolWorkspaceSectionData>(() =>
    normalizeResourceToolWorkspaceSectionData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await onSave(resourceToolWorkspaceSectionToPayload(form), isActive);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => onIsActiveChange(e.target.checked)}
        />
        Section active
      </label>
      <select
        className={inputClass}
        value={form.tool_type}
        onChange={(e) =>
          setForm((p) => ({ ...p, tool_type: e.target.value as ResourceToolType }))
        }
      >
        <option value="roi">ROI Calculator</option>
        <option value="maintenance">Maintenance Calculator</option>
        <option value="qr">QR Code Generator</option>
        <option value="barcode">Barcode Generator</option>
      </select>
      <input
        className={inputClass}
        value={form.tagline}
        onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
        placeholder="Tagline"
      />
      <input
        className={inputClass}
        value={form.heading}
        onChange={(e) => setForm((p) => ({ ...p, heading: e.target.value }))}
        placeholder="Heading"
      />
      <textarea
        className={inputClass}
        rows={3}
        value={form.description}
        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        placeholder="Description"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className={inputClass}
          value={form.primary_button.text}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              primary_button: { ...p.primary_button, text: e.target.value },
            }))
          }
          placeholder="Button text"
        />
        <input
          className={inputClass}
          value={form.primary_button.link}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              primary_button: { ...p.primary_button, link: e.target.value },
            }))
          }
          placeholder="Button link"
        />
      </div>
      <input
        className={inputClass}
        value={form.result_heading}
        onChange={(e) => setForm((p) => ({ ...p, result_heading: e.target.value }))}
        placeholder="Result heading"
      />
      <textarea
        className={inputClass}
        rows={2}
        value={form.result_helper}
        onChange={(e) => setForm((p) => ({ ...p, result_helper: e.target.value }))}
        placeholder="Result helper"
      />
      <div className="space-y-3">
        {form.fields.map((field, index) => (
          <div key={field.id || index} className="rounded-xl border border-border p-3 grid gap-2 sm:grid-cols-2">
            <input
              className={inputClass}
              value={field.id}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  fields: p.fields.map((row, i) =>
                    i === index ? { ...row, id: e.target.value } : row
                  ),
                }))
              }
              placeholder="Field id"
            />
            <input
              className={inputClass}
              value={field.label}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  fields: p.fields.map((row, i) =>
                    i === index ? { ...row, label: e.target.value } : row
                  ),
                }))
              }
              placeholder="Field label"
            />
            <input
              className={inputClass}
              value={field.placeholder}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  fields: p.fields.map((row, i) =>
                    i === index ? { ...row, placeholder: e.target.value } : row
                  ),
                }))
              }
              placeholder="Placeholder"
            />
            <input
              className={inputClass}
              value={field.suffix}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  fields: p.fields.map((row, i) =>
                    i === index ? { ...row, suffix: e.target.value } : row
                  ),
                }))
              }
              placeholder="Suffix"
            />
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm text-red-600 sm:col-span-2"
              onClick={() =>
                setForm((p) => ({ ...p, fields: p.fields.filter((_, i) => i !== index) }))
              }
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove field
            </button>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm text-muted"
          onClick={() =>
            setForm((p) => ({
              ...p,
              fields: [
                ...p.fields,
                {
                  id: `field_${p.fields.length + 1}`,
                  label: "",
                  placeholder: "",
                  suffix: "",
                },
              ],
            }))
          }
        >
          <Plus className="h-4 w-4" /> Add field
        </button>
      </div>
      {error ? <p className="text-sm text-[var(--error-text)]">{error}</p> : null}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-[var(--orange)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save section"}
      </button>
    </div>
  );
}

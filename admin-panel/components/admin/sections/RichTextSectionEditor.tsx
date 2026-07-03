"use client";

import { useState } from "react";
import TinyMceEditor from "@/components/admin/TinyMceEditor";
import {
  normalizeRichTextSectionData,
  richTextSectionToPayload,
  type RichTextSectionData,
} from "@/lib/rich-text-section";

type RichTextSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function RichTextSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: RichTextSectionEditorProps) {
  const [data, setData] = useState<RichTextSectionData>(() =>
    normalizeRichTextSectionData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof RichTextSectionData>(
    key: K,
    value: RichTextSectionData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(richTextSectionToPayload(data), isActive);
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

      <div className="space-y-2">
        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Section heading (optional)
        </label>
        <input
          value={data.heading}
          onChange={(e) => updateField("heading", e.target.value)}
          className={inputClass}
        />
      </div>

      <TinyMceEditor
        label="Content"
        value={data.content}
        onChange={(value) => updateField("content", value)}
      />

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

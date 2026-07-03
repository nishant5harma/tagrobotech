"use client";

import { useState } from "react";
import TinyMceEditor from "@/components/admin/TinyMceEditor";
import {
  articleBodySectionToPayload,
  normalizeArticleBodySectionData,
  type ArticleBodySectionData,
} from "@/lib/article-body-section";

type ArticleBodySectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
  headingLabel?: string;
  showVisibilityToggle?: boolean;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

export default function ArticleBodySectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
  headingLabel = "Section heading (optional)",
  showVisibilityToggle = true,
}: ArticleBodySectionEditorProps) {
  const [data, setData] = useState<ArticleBodySectionData>(() =>
    normalizeArticleBodySectionData(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof ArticleBodySectionData>(
    key: K,
    value: ArticleBodySectionData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(articleBodySectionToPayload(data), isActive);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {showVisibilityToggle ? (
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => onIsActiveChange(e.target.checked)}
            className="rounded border-border"
          />
          Section visible on page
        </label>
      ) : null}

      <div className="space-y-2">
        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          {headingLabel}
        </label>
        <input
          value={data.heading}
          onChange={(e) => updateField("heading", e.target.value)}
          className={inputClass}
          placeholder="Optional intro heading above the article body"
        />
      </div>

      <TinyMceEditor
        label="Article content"
        value={data.content}
        onChange={(value) => updateField("content", value)}
        minHeight={560}
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

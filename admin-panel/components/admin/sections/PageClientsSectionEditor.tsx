"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import MediaLibraryGrid from "@/components/admin/MediaLibraryGrid";
import MediaThumbnail from "@/components/admin/MediaThumbnail";
import { getMedia, type MediaItem } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";
import {
  normalizePageClientsSectionData,
  pageClientsSectionToPayload,
  type PageClientsSectionData,
} from "@/lib/page-clients-section";

type PageClientsSectionEditorProps = {
  initialData: unknown;
  isActive: boolean;
  onIsActiveChange: (active: boolean) => void;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

const inputClass =
  "login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm";

function isImageItem(item: MediaItem) {
  return (
    item.mime_type?.startsWith("image/") ||
    Boolean(item.file_url.match(/\.(webp|jpg|jpeg|png|gif|svg)$/i))
  );
}

export default function PageClientsSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: PageClientsSectionEditorProps) {
  const [form, setForm] = useState<PageClientsSectionData>(() =>
    normalizePageClientsSectionData(initialData)
  );
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    getMedia(token).then((data) => setMedia(data.media.filter(isImageItem)));
  }, []);

  const selectedIds = new Set(
    form.items.map((item) => item.media_id).filter(Boolean) as string[]
  );

  function updateField<K extends keyof PageClientsSectionData>(
    key: K,
    value: PageClientsSectionData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addLogo(item: MediaItem) {
    if (selectedIds.has(item.id)) return;

    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          media_id: item.id,
          name: item.alt_text || item.file_name || item.original_name || "Client",
          website_url: "",
          logo_src: "",
        },
      ],
    }));
  }

  function toggleLogo(item: MediaItem) {
    if (selectedIds.has(item.id)) {
      removeLogo(item.id);
      return;
    }

    addLogo(item);
    setMedia((prev) => {
      if (prev.some((row) => row.id === item.id)) return prev;
      return [item, ...prev];
    });
  }

  function removeLogo(mediaId: string | null) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.media_id !== mediaId),
    }));
  }

  function updateItem(
    mediaId: string | null,
    field: "name" | "website_url" | "logo_src",
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.media_id === mediaId ? { ...item, [field]: value } : item
      ),
    }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);

    try {
      await onSave(pageClientsSectionToPayload(form), isActive);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const mediaById = new Map(media.map((item) => [item.id, item]));

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
        <legend className="px-1 text-sm font-semibold text-foreground">Heading</legend>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Prefix
            </label>
            <input
              value={form.heading_prefix}
              onChange={(e) => updateField("heading_prefix", e.target.value)}
              placeholder="Trusted by"
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Highlight (orange)
            </label>
            <input
              value={form.heading_highlight}
              onChange={(e) => updateField("heading_highlight", e.target.value)}
              placeholder="300+"
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Suffix
            </label>
            <input
              value={form.heading_suffix}
              onChange={(e) => updateField("heading_suffix", e.target.value)}
              placeholder="Leading Enterprises"
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">
            Selected logos ({form.items.length})
          </p>
          <p className="text-xs text-muted">Upload logos in Media, then pick below</p>
        </div>

        {form.items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
            No logos selected yet. The frontend will show default client logos until you add some.
          </div>
        ) : (
          <div className="space-y-3">
            {form.items.map((item) => {
              const mediaItem = item.media_id ? mediaById.get(item.media_id) : null;

              return (
                <div
                  key={item.media_id || item.name}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3"
                >
                  <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--surface-muted)]">
                    {mediaItem ? (
                      <MediaThumbnail
                        src={mediaItem.file_url}
                        alt={item.name}
                        className="h-full w-full object-contain p-1"
                        fileMissing={mediaItem.file_exists === false}
                      />
                    ) : null}
                  </div>
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(item.media_id, "name", e.target.value)}
                    placeholder="Client name"
                    className={`${inputClass} min-w-[140px] flex-1`}
                  />
                  <input
                    value={item.website_url}
                    onChange={(e) => updateItem(item.media_id, "website_url", e.target.value)}
                    placeholder="Website (optional)"
                    className={`${inputClass} min-w-[160px] flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => removeLogo(item.media_id)}
                    className="text-red-600 dark:text-red-400"
                    aria-label="Remove logo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MediaLibraryGrid
        selectedIds={selectedIds}
        onToggle={toggleLogo}
        emptyMessage="No client logos yet. Upload below or open Media to add images."
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

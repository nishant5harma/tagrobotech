"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import MediaThumbnail from "@/components/admin/MediaThumbnail";
import { getMedia, type MediaItem } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";
import {
  moreClientsSectionToPayload,
  normalizeMoreClientsSectionData,
  type MoreClientsSectionData,
} from "@/lib/more-clients-section";

type MoreClientsSectionEditorProps = {
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

export default function MoreClientsSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: MoreClientsSectionEditorProps) {
  const [data, setData] = useState<MoreClientsSectionData>(() =>
    normalizeMoreClientsSectionData(initialData)
  );
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    getMedia(token)
      .then((result) => setMedia(result.media.filter(isImageItem)))
      .finally(() => setLoadingMedia(false));
  }, []);

  const selectedIds = new Set(data.items.map((item) => item.media_id));

  function updateField<K extends keyof MoreClientsSectionData>(
    key: K,
    value: MoreClientsSectionData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateCta(field: "text" | "link", value: string) {
    setData((prev) => ({
      ...prev,
      cta_button: { ...prev.cta_button, [field]: value },
    }));
  }

  function addLogo(item: MediaItem) {
    if (selectedIds.has(item.id)) return;

    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          media_id: item.id,
          name: item.alt_text || item.file_name || item.original_name || "Client",
        },
      ],
    }));
  }

  function removeLogo(mediaId: string) {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.media_id !== mediaId),
    }));
  }

  function updateItemName(mediaId: string, name: string) {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.media_id === mediaId ? { ...item, name } : item
      ),
    }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await onSave(moreClientsSectionToPayload(data), isActive);
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
        <legend className="px-1 text-sm font-semibold text-foreground">Header</legend>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Tagline</label>
          <input
            value={data.tagline}
            onChange={(e) => updateField("tagline", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
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
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Heading suffix
            </label>
            <input
              value={data.heading_suffix}
              onChange={(e) => updateField("heading_suffix", e.target.value)}
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">CTA text</label>
            <input
              value={data.cta_button.text}
              onChange={(e) => updateCta("text", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">CTA link</label>
            <input
              value={data.cta_button.link}
              onChange={(e) => updateCta("link", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">
            Client logos ({data.items.length})
          </p>
          <p className="text-xs text-muted">Upload images in Media first, then pick below</p>
        </div>

        {data.items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
            No logos selected yet. Click images from the media library below.
          </div>
        ) : (
          <div className="space-y-3">
            {data.items.map((item) => {
              const mediaItem = mediaById.get(item.media_id);
              return (
                <div
                  key={item.media_id}
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
                    onChange={(e) => updateItemName(item.media_id, e.target.value)}
                    placeholder="Client name"
                    className={`${inputClass} min-w-[140px] flex-1`}
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

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Pick from media library
        </p>
        {loadingMedia ? (
          <p className="text-sm text-muted">Loading media...</p>
        ) : media.length === 0 ? (
          <p className="text-sm text-muted">
            No images in Media yet. Go to Media in the sidebar and upload client logos first.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {media.map((item) => {
              const isSelected = selectedIds.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => (isSelected ? removeLogo(item.id) : addLogo(item))}
                  className={`relative aspect-video overflow-hidden rounded-lg border-2 transition ${
                    isSelected
                      ? "border-[var(--orange)] ring-2 ring-[var(--orange)]/20"
                      : "border-border hover:border-[var(--orange)]/50"
                  }`}
                >
                  <MediaThumbnail
                    src={item.file_url}
                    alt={item.file_name || "Media"}
                    className="h-full w-full object-contain p-1"
                    fileMissing={item.file_exists === false}
                  />
                  {isSelected ? (
                    <span className="absolute right-1 top-1 rounded-full bg-[var(--orange)] px-1.5 py-0.5 text-[10px] font-medium text-white">
                      Added
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>

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

"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import MediaThumbnail from "@/components/admin/MediaThumbnail";
import { getMedia, type MediaItem } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";
import {
  normalizeReachTrustAboutSectionData,
  reachTrustAboutSectionToPayload,
  type ReachTrustAboutSectionData,
} from "@/lib/reach-trust-about-section";

type ReachTrustAboutSectionEditorProps = {
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

export default function ReachTrustAboutSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: ReachTrustAboutSectionEditorProps) {
  const [data, setData] = useState<ReachTrustAboutSectionData>(() =>
    normalizeReachTrustAboutSectionData(initialData)
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

  function updateField<K extends keyof ReachTrustAboutSectionData>(
    key: K,
    value: ReachTrustAboutSectionData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateSector(index: number, value: string) {
    setData((prev) => ({
      ...prev,
      sectors: prev.sectors.map((sector, i) => (i === index ? value : sector)),
    }));
  }

  function addSector() {
    setData((prev) => ({ ...prev, sectors: [...prev.sectors, ""] }));
  }

  function removeSector(index: number) {
    setData((prev) => ({
      ...prev,
      sectors: prev.sectors.filter((_, i) => i !== index),
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
      await onSave(reachTrustAboutSectionToPayload(data), isActive);
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
        <legend className="px-1 text-sm font-semibold text-foreground">Left panel</legend>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Tagline</label>
          <input
            value={data.tagline}
            onChange={(e) => updateField("tagline", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Heading</label>
          <input
            value={data.heading}
            onChange={(e) => updateField("heading", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Description</label>
          <textarea
            value={data.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={4}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Sector tags ({data.sectors.length})
          </label>
          {data.sectors.map((sector, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={sector}
                onChange={(e) => updateSector(index, e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeSector(index)}
                className="shrink-0 self-center rounded-lg border border-red-200 px-3 py-2 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSector}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            Add sector tag
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Flagship clients label
          </label>
          <input
            value={data.flagship_clients_label}
            onChange={(e) => updateField("flagship_clients_label", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Flagship clients text
          </label>
          <textarea
            value={data.flagship_clients}
            onChange={(e) => updateField("flagship_clients", e.target.value)}
            rows={4}
            className={`${inputClass} resize-y`}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-[var(--surface-muted)]/30 p-4">
        <legend className="px-1 text-sm font-semibold text-foreground">Right panel image</legend>

        <MediaPicker
          label="Delivery / field image"
          value={data.image_media_id}
          onChange={(mediaId) => updateField("image_media_id", mediaId)}
        />

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Fallback image path
          </label>
          <input
            value={data.image_src}
            onChange={(e) => updateField("image_src", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">Image alt text</label>
          <input
            value={data.image_alt}
            onChange={(e) => updateField("image_alt", e.target.value)}
            className={inputClass}
          />
        </div>
      </fieldset>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">
            Client logos ({data.items.length})
          </p>
          <p className="text-xs text-muted">
            Leave empty to use built-in client logos. Pick from media to override.
          </p>
        </div>

        {data.items.length > 0 ? (
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
        ) : (
          <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
            No custom logos selected — the site will show the default client logo grid.
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
            No images in Media yet. Upload client logos in Media to customize the grid.
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

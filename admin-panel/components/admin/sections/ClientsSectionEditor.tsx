"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import MediaThumbnail from "@/components/admin/MediaThumbnail";
import { getMedia, type MediaItem } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";
import {
  clientsSectionToPayload,
  normalizeClientsSectionData,
  type ClientsSectionData,
} from "@/lib/clients-section";

type ClientsSectionEditorProps = {
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

export default function ClientsSectionEditor({
  initialData,
  isActive,
  onIsActiveChange,
  onSave,
}: ClientsSectionEditorProps) {
  const [form, setForm] = useState<ClientsSectionData>(() => normalizeClientsSectionData(initialData));
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    getMedia(token)
      .then((data) => setMedia(data.media.filter(isImageItem)))
      .finally(() => setLoadingMedia(false));
  }, []);

  const selectedIds = new Set(form.items.map((item) => item.media_id));

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
        },
      ],
    }));
  }

  function removeLogo(mediaId: string) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.media_id !== mediaId),
    }));
  }

  function updateItem(mediaId: string, field: "name" | "website_url", value: string) {
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
      await onSave(clientsSectionToPayload(form), isActive);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const mediaById = new Map(media.map((m) => [m.id, m]));

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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="block text-sm font-medium">Heading</label>
          <input
            value={form.heading}
            onChange={(e) => setForm((prev) => ({ ...prev, heading: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="block text-sm font-medium">Right label</label>
          <input
            value={form.subtext}
            onChange={(e) => setForm((prev) => ({ ...prev, subtext: e.target.value }))}
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">
            Selected logos ({form.items.length})
          </p>
          <p className="text-xs text-muted">Upload images in Media first, then pick below</p>
        </div>

        {form.items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
            No logos selected yet. Click images from the media library below.
          </div>
        ) : (
          <div className="space-y-3">
            {form.items.map((item) => {
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

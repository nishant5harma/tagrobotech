"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ExternalLink, ImagePlus, Loader2, Upload } from "lucide-react";
import MediaThumbnail from "@/components/admin/MediaThumbnail";
import { getMedia, uploadMedia, type MediaItem } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

type MediaPickerProps = {
  value: string | null;
  onChange: (mediaId: string | null, item?: MediaItem) => void;
  accept?: "image" | "video" | "any";
  label?: string;
  defaultGalleryOpen?: boolean;
};

function isImageItem(item: MediaItem) {
  return (
    item.mime_type?.startsWith("image/") ||
    Boolean(item.file_url.match(/\.(webp|jpg|jpeg|png|gif|svg)$/i))
  );
}

function isVideoItem(item: MediaItem) {
  return (
    item.mime_type?.startsWith("video/") ||
    Boolean(item.file_url.match(/\.(mp4|webm)$/i))
  );
}

export default function MediaPicker({
  value,
  onChange,
  accept = "image",
  label = "Pick from media library",
  defaultGalleryOpen = true,
}: MediaPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [galleryOpen, setGalleryOpen] = useState(defaultGalleryOpen);

  async function loadMedia() {
    const token = getStoredToken();
    if (!token) return;

    setLoading(true);
    try {
      const data = await getMedia(token);
      setMedia(data.media);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  const filtered = media.filter((item) => {
    if (accept === "image") return isImageItem(item);
    if (accept === "video") return isVideoItem(item);
    return true;
  });

  const selected = media.find((item) => item.id === value) ?? null;

  async function handleUpload(file: File) {
    setError("");
    setUploading(true);

    const token = getStoredToken();
    if (!token) return;

    try {
      const { media: item } = await uploadMedia(token, file);
      setMedia((prev) => [item, ...prev]);
      onChange(item.id, item);
      setGalleryOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/media"
            className="inline-flex items-center gap-1 text-xs text-muted transition hover:text-[var(--orange)]"
          >
            Open Media
            <ExternalLink className="h-3 w-3" />
          </Link>
          <input
            ref={inputRef}
            type="file"
            accept={accept === "video" ? "video/*" : accept === "image" ? "image/*" : "image/*,video/*"}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          <button
            type="button"
            onClick={() => setGalleryOpen(!galleryOpen)}
            className="inline-flex items-center gap-1 text-xs text-muted transition hover:text-foreground"
          >
            {galleryOpen ? "Hide library" : "Show library"}
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--orange)] hover:text-[var(--orange)] disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            Upload {accept === "video" ? "video" : "image"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-xs text-muted transition hover:text-foreground"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {selected ? (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-[var(--surface-muted)]/40 p-3">
          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--surface-muted)]">
            {isImageItem(selected) ? (
              <MediaThumbnail
                src={selected.file_url}
                alt={selected.alt_text || selected.file_name || "Selected"}
                fallbackLabel={selected.file_name || selected.original_name || "Image"}
                fileMissing={selected.file_exists === false}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-muted">Video</div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {selected.file_name || selected.original_name}
            </p>
            <p className="truncate text-xs text-muted">{selected.file_url}</p>
          </div>
        </div>
      ) : null}

      {error ? <p className="text-xs text-[var(--error-text)]">{error}</p> : null}

      {galleryOpen ? (
        loading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading media library...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted">
            <ImagePlus className="h-4 w-4" />
            No {accept === "video" ? "videos" : "images"} yet — upload one above.
          </div>
        ) : (
          <div className="grid max-h-[360px] grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-border bg-[var(--surface-muted)]/20 p-3 sm:grid-cols-4 md:grid-cols-5">
            {filtered.map((item) => {
              const isSelected = item.id === value;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChange(item.id, item)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-card transition ${
                    isSelected
                      ? "border-[var(--orange)] ring-2 ring-[var(--orange)]/20"
                      : "border-border hover:border-[var(--orange)]/50"
                  }`}
                >
                  {isImageItem(item) ? (
                    <MediaThumbnail
                      src={item.file_url}
                      alt={item.alt_text || item.file_name || "Media"}
                      fallbackLabel={item.file_name || item.original_name || "Image"}
                      fileMissing={item.file_exists === false}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[var(--surface-muted)] text-[10px] text-muted">
                      Video
                    </div>
                  )}
                  {isSelected ? (
                    <span className="absolute right-1 top-1 rounded-full bg-[var(--orange)] p-0.5 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )
      ) : null}
    </div>
  );
}

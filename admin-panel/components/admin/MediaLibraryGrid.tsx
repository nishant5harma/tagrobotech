"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink, ImagePlus, Loader2, Upload } from "lucide-react";
import MediaThumbnail from "@/components/admin/MediaThumbnail";
import { getMedia, uploadMedia, type MediaItem } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

type MediaLibraryGridProps = {
  selectedIds: Set<string>;
  onToggle: (item: MediaItem) => void;
  accept?: "image" | "video" | "any";
  label?: string;
  emptyMessage?: string;
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

export default function MediaLibraryGrid({
  selectedIds,
  onToggle,
  accept = "image",
  label = "Pick from media library",
  emptyMessage = "No images yet. Upload below or add files in the Media section.",
}: MediaLibraryGridProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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

  async function handleUpload(file: File) {
    setError("");
    setUploading(true);

    const token = getStoredToken();
    if (!token) return;

    try {
      const { media: item } = await uploadMedia(token, file);
      setMedia((prev) => [item, ...prev]);
      onToggle(item);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-[var(--surface-muted)]/20 p-4">
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
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--orange)] hover:text-[var(--orange)] disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            Upload image
          </button>
        </div>
      </div>

      {error ? <p className="text-xs text-[var(--error-text)]">{error}</p> : null}

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading media library...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-4 py-8 text-center">
          <ImagePlus className="h-6 w-6 text-muted" />
          <p className="text-sm text-muted">{emptyMessage}</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 text-sm font-medium text-[var(--orange)]"
          >
            Upload your first image
          </button>
        </div>
      ) : (
        <div className="grid max-h-[420px] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {filtered.map((item) => {
            const isSelected = selectedIds.has(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggle(item)}
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
                    className="h-full w-full object-contain p-2"
                    fallbackLabel={item.file_name || item.original_name || "Image"}
                    fileMissing={item.file_exists === false}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[var(--surface-muted)] text-[10px] text-muted">
                    Video
                  </div>
                )}
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
  );
}

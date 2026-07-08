"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Save, Trash2, Upload } from "lucide-react";
import {
  createMedia,
  deleteMedia,
  getMedia,
  resolveMediaUrl,
  updateMedia,
  uploadMedia,
  type MediaItem,
} from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

export default function MediaPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [addingUrl, setAddingUrl] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [editing, setEditing] = useState<Record<string, { file_name: string; alt_text: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  function loadMedia() {
    const token = getStoredToken();
    if (!token) return;

    return getMedia(token).then((data) => setMedia(data.media));
  }

  useEffect(() => {
    loadMedia()?.finally(() => setLoading(false));
  }, []);

  async function handleFiles(files: FileList | File[]) {
    const token = getStoredToken();
    if (!token) return;

    setError("");
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        await uploadMedia(token, file, altText || undefined, uploadFileName || file.name);
      }
      setAltText("");
      setUploadFileName("");
      await loadMedia();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleUrlAdd(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setAddingUrl(true);

    const token = getStoredToken();
    if (!token) return;

    try {
      await createMedia(token, {
        file_url: fileUrl,
        file_name: fileName || undefined,
        alt_text: altText || undefined,
      });
      setFileUrl("");
      setFileName("");
      setAltText("");
      setShowUrlForm(false);
      await loadMedia();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add media");
    } finally {
      setAddingUrl(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this media item? It will be removed from any pages using it.")) return;

    const token = getStoredToken();
    if (!token) return;

    setError("");
    try {
      await deleteMedia(token, id);
      setMedia((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete media");
    }
  }

  async function handleSaveMedia(item: MediaItem) {
    const token = getStoredToken();
    if (!token) return;

    const draft = editing[item.id] ?? {
      file_name: item.file_name || item.original_name || "",
      alt_text: item.alt_text || "",
    };

    setSavingId(item.id);
    setError("");
    try {
      const { media: updated } = await updateMedia(token, item.id, {
        file_name: draft.file_name,
        alt_text: draft.alt_text || null,
      });
      setMedia((prev) => prev.map((entry) => (entry.id === item.id ? updated : entry)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update media");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Media</h1>
        <p className="mt-1 text-sm text-muted">Upload images and videos for pages and sections.</p>
      </div>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <ImagePlus className="h-5 w-5 text-[var(--orange)]" />
          <h2 className="font-semibold text-foreground">Upload files</h2>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Image/video name</label>
          <input
            value={uploadFileName}
            onChange={(e) => setUploadFileName(e.target.value)}
            placeholder="hero-banner.webp"
            className="login-input w-full max-w-md rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Alt text (optional)</label>
          <input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe the image for accessibility"
            className="login-input w-full max-w-md rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/mp4,video/webm"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = e.target.files;
            if (files?.length) handleFiles(files);
          }}
        />

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
          }}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 transition ${
            dragOver
              ? "border-[var(--orange)] bg-orange-50/50 dark:bg-orange-950/20"
              : "border-border bg-[var(--surface-muted)]/30"
          }`}
        >
          <Upload className="mb-3 h-8 w-8 text-[var(--orange)]" />
          <p className="text-sm font-medium text-foreground">Drag & drop images or videos here</p>
          <p className="mt-1 text-xs text-muted">JPG, PNG, WebP, GIF, SVG, MP4, WebM — up to 25MB</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-4 rounded-xl bg-[var(--orange)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#d94e1f] disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Choose files"}
          </button>
        </div>

        {error ? <p className="text-sm text-[var(--error-text)]">{error}</p> : null}

        <button
          type="button"
          onClick={() => setShowUrlForm(!showUrlForm)}
          className="text-sm text-muted transition hover:text-foreground"
        >
          {showUrlForm ? "Hide URL option" : "Add by URL instead"}
        </button>

        {showUrlForm ? (
          <form onSubmit={handleUrlAdd} className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="block text-sm font-medium">File URL</label>
              <input
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://example.com/image.webp"
                required
                className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">File name</label>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="hero.webp"
                className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={addingUrl}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition hover:border-[var(--orange)]"
              >
                {addingUrl ? "Adding..." : "Add URL"}
              </button>
            </div>
          </form>
        ) : null}
      </section>

      {loading ? (
        <p className="text-sm text-muted">Loading media...</p>
      ) : media.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm text-muted">No media files yet. Upload your first image above.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              <div className="relative aspect-video bg-[var(--surface-muted)]">
                {item.mime_type?.startsWith("image/") ||
                item.file_url.match(/\.(webp|jpg|jpeg|png|gif|svg)$/i) ? (
                  <Image
                    src={resolveMediaUrl(item.file_url)}
                    alt={item.alt_text || item.file_name || "Media"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : item.mime_type?.startsWith("video/") ||
                  item.file_url.match(/\.(mp4|webm)$/i) ? (
                  <video
                    src={resolveMediaUrl(item.file_url)}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted">
                    {item.file_name || "File"}
                  </div>
                )}
              </div>
              <div className="space-y-2 p-4">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.file_name || item.original_name}
                </p>
                <p className="truncate text-xs text-muted">{item.file_url}</p>
                <div className="space-y-2">
                  <input
                    value={
                      editing[item.id]?.file_name ?? item.file_name ?? item.original_name ?? ""
                    }
                    onChange={(e) =>
                      setEditing((prev) => ({
                        ...prev,
                        [item.id]: {
                          file_name:
                            e.target.value,
                          alt_text: prev[item.id]?.alt_text ?? item.alt_text ?? "",
                        },
                      }))
                    }
                    placeholder="File name"
                    className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-3 py-2 text-xs"
                  />
                  <input
                    value={editing[item.id]?.alt_text ?? item.alt_text ?? ""}
                    onChange={(e) =>
                      setEditing((prev) => ({
                        ...prev,
                        [item.id]: {
                          file_name:
                            prev[item.id]?.file_name ?? item.file_name ?? item.original_name ?? "",
                          alt_text: e.target.value,
                        },
                      }))
                    }
                    placeholder="Alt text"
                    className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-3 py-2 text-xs"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSaveMedia(item)}
                    disabled={savingId === item.id}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--orange)] transition hover:opacity-80 disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {savingId === item.id ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 transition hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

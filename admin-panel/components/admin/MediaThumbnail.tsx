"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { resolveMediaUrl } from "@/lib/api";

type MediaThumbnailProps = {
  src: string;
  alt?: string;
  className?: string;
  fallbackLabel?: string;
  fileMissing?: boolean;
};

export default function MediaThumbnail({
  src,
  alt = "",
  className = "h-full w-full object-cover",
  fallbackLabel,
  fileMissing = false,
}: MediaThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const url = resolveMediaUrl(src);

  if (!src) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[var(--surface-muted)] p-2 text-center">
        <ImageIcon className="h-5 w-5 text-muted" />
        <span className="line-clamp-3 text-[10px] text-muted">{fallbackLabel || "No preview"}</span>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[var(--surface-muted)] p-2 text-center">
        <ImageIcon className="h-5 w-5 text-muted" />
        <span className="line-clamp-3 text-[10px] text-muted">
          {fileMissing ? "File missing — re-upload" : fallbackLabel || "Preview unavailable"}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

"use client";

import CmsImage from "@/components/CmsImage";
import { cn } from "@/lib/utils";

type FootprintsDashboardMockupProps = {
  className?: string;
  priority?: boolean;
  imageSrc?: string;
  imageAlt?: string;
};

const DEFAULT_IMAGE_SRC = "/assets-images/laptop.png";
const DEFAULT_IMAGE_ALT = "Footprints asset tracking dashboard by Tag Robo Tech";

export default function FootprintsDashboardMockup({
  className,
  priority = false,
  imageSrc = DEFAULT_IMAGE_SRC,
  imageAlt = DEFAULT_IMAGE_ALT,
}: FootprintsDashboardMockupProps) {
  return (
    <CmsImage
      src={imageSrc}
      alt={imageAlt}
      width={1536}
      height={1024}
      className={cn("h-auto w-full object-contain", className)}
      priority={priority}
    />
  );
}

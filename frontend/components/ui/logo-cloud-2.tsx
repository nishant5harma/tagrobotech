"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CLIENT_LOGOS, type ClientLogo } from "@/lib/clients";

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos?: ClientLogo[];
};

const COLS_MD = 4;
const COLS_SM = 2;

function getCellStyles(index: number, total: number) {
  const colsMd = COLS_MD;
  const colsSm = COLS_SM;
  const rowMd = Math.floor(index / colsMd);
  const colMd = index % colsMd;
  const rowSm = Math.floor(index / colsSm);
  const colSm = index % colsSm;
  const lastRowMd = Math.floor((total - 1) / colsMd);
  const lastRowSm = Math.floor((total - 1) / colsSm);

  const isAltMd = (rowMd + colMd) % 2 === 0;
  const isAltSm = (rowSm + colSm) % 2 === 0;

  return cn(
    "relative flex items-center justify-center px-4 py-8 md:p-8",
    isAltSm ? "bg-[#f7f9fc]" : "bg-white",
    isAltMd ? "md:bg-[#f7f9fc]" : "md:bg-white",
    colSm < colsSm - 1 && rowSm <= lastRowSm && "border-r border-neutral-200",
    rowSm < lastRowSm && "border-b border-neutral-200",
    colMd < colsMd - 1 && "md:border-r md:border-neutral-200",
    rowMd < lastRowMd && "md:border-b md:border-neutral-200"
  );
}

function PlusDecor({
  position,
}: {
  position: "bottom-right" | "bottom-left" | "bottom-right-mobile-only";
}) {
  const base =
    "pointer-events-none absolute z-10 size-6 text-neutral-300";

  if (position === "bottom-right") {
    return (
      <Plus
        className={cn(base, "-bottom-[12.5px] -right-[12.5px]")}
        strokeWidth={1}
        aria-hidden="true"
      />
    );
  }

  if (position === "bottom-left") {
    return (
      <Plus
        className={cn(
          base,
          "-bottom-[12.5px] -left-[12.5px] hidden md:block"
        )}
        strokeWidth={1}
        aria-hidden="true"
      />
    );
  }

  return (
    <Plus
      className={cn(
        base,
        "-bottom-[12.5px] absolute md:-left-[12.5px] -right-[12.5px] md:hidden"
      )}
      strokeWidth={1}
      aria-hidden="true"
    />
  );
}

function shouldShowPlus(
  index: number,
  total: number,
  corner: "bottom-right" | "bottom-left"
): boolean {
  const colsMd = COLS_MD;
  const rowMd = Math.floor(index / colsMd);
  const colMd = index % colsMd;
  const lastRowMd = Math.floor((total - 1) / colsMd);

  if (corner === "bottom-right") {
    return colMd < colsMd - 1 && rowMd <= lastRowMd;
  }

  return colMd > 0 && colMd < colsMd - 1 && rowMd < lastRowMd;
}

export function LogoCloud({ logos = CLIENT_LOGOS, className, ...props }: LogoCloudProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 border border-neutral-200 md:grid-cols-4",
        className
      )}
      {...props}
    >
      {logos.map((logo, index) => (
        <div key={logo.id} className={getCellStyles(index, logos.length)}>
          <Image
            src={logo.src}
            alt={logo.alt}
            width={160}
            height={48}
            className="pointer-events-none h-8 w-auto max-w-[140px] select-none object-contain sm:h-9 sm:max-w-[160px] md:h-10 md:max-w-[180px]"
            unoptimized
          />
          {shouldShowPlus(index, logos.length, "bottom-right") && (
            <PlusDecor position="bottom-right" />
          )}
          {shouldShowPlus(index, logos.length, "bottom-left") && (
            <PlusDecor position="bottom-left" />
          )}
        </div>
      ))}
    </div>
  );
}

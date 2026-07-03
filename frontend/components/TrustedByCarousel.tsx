"use client";

import Image from "next/image";
import { TRUSTED_LOGOS } from "@/lib/constants";
import type { ClientCarouselData } from "@/lib/cms";

type TrustedByCarouselProps = {
  data?: ClientCarouselData | null;
};

export default function TrustedByCarousel({ data }: TrustedByCarouselProps) {
  const cmsLogos = data?.clients?.map((client) => ({
    src: client.logo_url,
    alt: client.alt || client.name,
    href: client.website_url || undefined,
  }));

  const logos =
    cmsLogos && cmsLogos.length > 0
      ? cmsLogos
      : TRUSTED_LOGOS.map((logo) => ({ src: logo.src, alt: logo.alt, href: undefined }));

  const heading =
    data?.heading || "Trusted by leading enterprises — industry pioneers since day one";
  const subtext = data?.subtext || "and more...";

  const track = [...logos, ...logos];

  return (
    <div className="border-y border-neutral-100 bg-neutral-50/90">
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mb-6 flex flex-col items-center justify-between gap-3 sm:mb-7 sm:flex-row lg:items-end">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-neutral-500 sm:text-[13px]">
            {heading}
          </p>
          <span className="text-[14px] font-medium text-neutral-400 sm:text-[15px]">
            {subtext}
          </span>
        </div>

        <div className="logo-carousel relative overflow-hidden py-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-neutral-50/95 to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-r from-transparent to-neutral-50/95 sm:w-24" />

          <div className="logo-carousel-track flex w-max items-center gap-12 sm:gap-16 lg:gap-20">
            {track.map((logo, index) => (
              <div
                key={`${logo.src}-${index}`}
                className="flex h-14 shrink-0 items-center justify-center px-2 sm:h-16 lg:h-[72px]"
              >
                {logo.href ? (
                  <a href={logo.href} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={180}
                      height={72}
                      unoptimized={logo.src.startsWith("http://localhost")}
                      className="h-10 w-auto max-w-[140px] object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-12 sm:max-w-[170px] lg:h-14 lg:max-w-[200px]"
                    />
                  </a>
                ) : (
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={180}
                    height={72}
                    unoptimized={logo.src.startsWith("http://localhost")}
                    className="h-10 w-auto max-w-[140px] object-contain opacity-75 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-12 sm:max-w-[170px] lg:h-14 lg:max-w-[200px]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

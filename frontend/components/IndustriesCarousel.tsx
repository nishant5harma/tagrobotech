"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ResolvedTrustedIndustry } from "@/lib/trusted-industries";

const PER_SLIDE = 3;
const AUTOPLAY_MS = 6500;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=700&q=80";

function chunk<T>(items: T[], size: number): T[][] {
  const slides: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    slides.push(items.slice(i, i + size));
  }
  return slides;
}

function IndustryImage({
  src,
  alt,
  accent,
}: {
  src: string;
  alt: string;
  accent: string;
}) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <div className="relative h-44 overflow-hidden sm:h-48">
      <img
        src={imageSrc}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={() => setImageSrc(FALLBACK_IMAGE)}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t ${accent} via-black/20 to-black/50`}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60"
        aria-hidden="true"
      />
    </div>
  );
}

type IndustriesCarouselProps = {
  industries: ResolvedTrustedIndustry[];
  featuredLabel: string;
};

export default function IndustriesCarousel({
  industries,
  featuredLabel,
}: IndustriesCarouselProps) {
  const slides = useMemo(() => chunk(industries, PER_SLIDE), [industries]);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [progress, setProgress] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > page ? 1 : -1);
      setPage(next);
      setProgress(0);
    },
    [page]
  );

  const goPrev = useCallback(() => {
    if (slides.length === 0) return;
    goTo(page === 0 ? slides.length - 1 : page - 1);
  }, [goTo, page, slides.length]);

  const goNext = useCallback(() => {
    if (slides.length === 0) return;
    goTo(page === slides.length - 1 ? 0 : page + 1);
  }, [goTo, page, slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [goNext, slides.length]);

  useEffect(() => {
    setProgress(0);
    const start = Date.now();

    const frame = window.setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / AUTOPLAY_MS, 1));
    }, 50);

    return () => window.clearInterval(frame);
  }, [page]);

  if (slides.length === 0) return null;

  const slide = slides[page] ?? [];
  const slideLabel = slide.map((item) => item.name).join(" · ");

  return (
    <div className="relative">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
            {featuredLabel}
          </p>
          <p className="mt-2 truncate text-[14px] font-medium text-white/80 sm:text-[15px]">
            {slideLabel}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to industry slide ${index + 1}`}
                aria-current={page === index ? "true" : undefined}
                className={`h-2 rounded-full transition-all ${
                  page === index
                    ? "w-8 bg-[#f97316]"
                    : "w-2 bg-white/25 hover:bg-white/45"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous industries"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white backdrop-blur-md transition-all hover:border-white/25 hover:bg-white/15"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next industries"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f97316] text-white shadow-[0_8px_24px_rgba(249,115,22,0.35)] transition-all hover:bg-[#ea580c] hover:shadow-[0_10px_28px_rgba(249,115,22,0.45)]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 48 : -48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {slide.map((industry) => (
              <article
                key={industry.name}
                className="group relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(0,0,0,0.32)]"
              >
                <IndustryImage
                  src={industry.imageSrc}
                  alt={industry.imageAlt}
                  accent={industry.accent}
                />

                <div className="relative p-5 sm:p-6">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[2rem] font-bold leading-none tracking-tight text-[#f97316] sm:text-[2.15rem]">
                        {industry.projects}
                      </p>
                      <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                        Projects delivered
                      </p>
                    </div>
                    <span className="rounded-full bg-[#0f2744]/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0f2744]/70">
                      Sector
                    </span>
                  </div>

                  <h3 className="mt-4 text-[1.1rem] font-bold tracking-tight text-[#0f2744] sm:text-[1.15rem]">
                    {industry.name}
                  </h3>
                </div>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex w-full max-w-md items-center gap-3 sm:max-w-xs">
          <span className="shrink-0 text-[12px] font-semibold tabular-nums text-white/50">
            {String(page + 1).padStart(2, "0")}
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#f97316] to-[#fdba74] transition-[width] duration-100 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="shrink-0 text-[12px] font-semibold tabular-nums text-white/50">
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        <div className="flex gap-2 sm:hidden">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to industry slide ${index + 1}`}
              aria-current={page === index ? "true" : undefined}
              className={`h-2 rounded-full transition-all ${
                page === index
                  ? "w-8 bg-[#f97316]"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

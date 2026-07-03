"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { resolveCmsMediaUrl, type ClientCarouselData } from "@/lib/cms";
import { mergeHeroData, type HeroSectionData } from "@/lib/hero";
import TrustedByCarousel from "@/components/TrustedByCarousel";

type HeroSectionProps = {
  data?: HeroSectionData | null;
  clients?: ClientCarouselData | null;
};

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatIcon({ type }: { type: number }) {
  const icons = [
    <svg key="0" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M16 11c1.7 0 3-1.3 3-3S17.7 5 16 5s-3 1.3-3 3 1.3 3 3 3zM8 13c1.7 0 3-1.3 3-3S9.7 7 8 7 5 8.3 5 10s1.3 3 3 3zM8 15c-2.2 0-4 1-4 2.2V20h8v-2.8C12 16 10.2 15 8 15zM16 13c-1.5 0-2.8.6-3.6 1.5 1.8.9 3.1 2.4 3.6 4.2h4.5v-2.3C20 14 18.2 13 16 13z" fill="#f97316" />
    </svg>,
    <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="#f97316" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="4" stroke="#f97316" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="1.5" fill="#f97316" />
    </svg>,
    <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10.5a8 8 0 0116 0v2.8a2 2 0 01-2 2h-1.2a1 1 0 01-1-1v-2.4a1 1 0 011-1H17v-1.4a6 6 0 00-12 0v1.4h1.2a1 1 0 011 1v2.4a1 1 0 01-1 1H6a2 2 0 01-2-2v-2.8z" stroke="#f97316" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>,
  ];

  return icons[type] ?? icons[0];
}

export default function HeroSection({ data, clients }: HeroSectionProps) {
  const hero = mergeHeroData(data ?? null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideoBackground = hero.background_type === "video";
  const videoSrc = hero.video_url ? resolveCmsMediaUrl(hero.video_url) : null;
  const imageSrc =
    hero.background_type === "image" && hero.image_url
      ? resolveCmsMediaUrl(hero.image_url)
      : null;

  useEffect(() => {
    if (isVideoBackground) {
      videoRef.current?.play().catch(() => {});
    }
  }, [isVideoBackground, videoSrc]);

  return (
    <section className="relative bg-white pt-[108px]">
      <div className="relative min-h-[calc(100vh-108px)] overflow-hidden">
        {isVideoBackground && videoSrc ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover object-center"
            aria-hidden="true"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : null}

        {!isVideoBackground && imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            aria-hidden="true"
          />
        ) : null}

        <div
          className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/15 lg:via-white/88 lg:to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent lg:hidden"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[calc(100vh-108px)] max-w-[1400px] flex-col px-5 pb-8 pt-10 sm:px-8 lg:px-10 lg:pb-10 lg:pt-14">
          <div className="grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
            <div className="max-w-2xl">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="h-px w-8 bg-[#f97316]" aria-hidden="true" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500 sm:text-[12px]">
                  {hero.tagline}
                </p>
                {hero.badge ? (
                  <span className="rounded-full border border-[#f97316]/25 bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#ea580c]">
                    {hero.badge}
                  </span>
                ) : null}
              </div>

              <h1 className="text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-[#0f2744]">
                {hero.heading}
                {hero.heading_accent ? (
                  <>
                    {" "}
                    <span className="text-[#f97316]">{hero.heading_accent}</span>
                  </>
                ) : null}
              </h1>

              <p className="mt-5 max-w-xl text-[15px] leading-7 text-neutral-600 sm:text-[16px] sm:leading-8">
                {hero.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={hero.primary_button.link}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f97316] px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(249,115,22,0.28)] transition-all hover:bg-[#ea580c] hover:shadow-[0_10px_28px_rgba(249,115,22,0.34)]"
                >
                  {hero.primary_button.text}
                  <ArrowIcon />
                </Link>
                <Link
                  href={hero.secondary_button.link}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white/80 px-6 py-3.5 text-[14px] font-semibold text-neutral-800 backdrop-blur-sm transition-all hover:border-neutral-400 hover:bg-white"
                >
                  {hero.secondary_button.text}
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="hidden lg:block" aria-hidden="true" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-neutral-200/80 pt-8 sm:grid-cols-3 sm:gap-6 lg:mt-4">
            {hero.stats.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                  <StatIcon type={index} />
                </div>
                <div>
                  <p className="text-[18px] font-bold tracking-tight text-[#0f2744] sm:text-[20px]">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-5 text-neutral-500 sm:text-[13px]">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TrustedByCarousel data={clients} />
    </section>
  );
}

"use client";

import {
  mergeResourcePageHeroSectionData,
  type ResourcePageHeroSectionData,
} from "@/lib/resource-page-hero-section";

type ResourcePageHeroSectionProps = {
  data?: ResourcePageHeroSectionData | null;
};

export default function ResourcePageHeroSection({ data }: ResourcePageHeroSectionProps) {
  const section = mergeResourcePageHeroSectionData(data ?? null);

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 12%, rgba(249,115,22,0.1), transparent 24%), radial-gradient(circle at 88% 18%, rgba(15,39,68,0.06), transparent 28%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto w-[min(92%,900px)] px-4 py-16 sm:py-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
          {section.tagline}
        </p>
        <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.06] tracking-tight text-[#0f2744]">
          {section.heading}
        </h1>
        <p className="mt-5 max-w-3xl text-[16px] leading-8 text-neutral-600">
          {section.description}
        </p>
      </div>
    </section>
  );
}

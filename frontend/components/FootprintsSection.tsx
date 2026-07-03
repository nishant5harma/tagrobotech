"use client";

import FootprintsDashboardMockup from "@/components/FootprintsDashboardMockup";
import {
  footprintsDashboardImageSrc,
  mergeFootprintsSectionData,
  resolveFeatureIcon,
  type FootprintsSectionData,
} from "@/lib/footprints-section";

type FootprintsSectionProps = {
  data?: FootprintsSectionData | null;
};

export default function FootprintsSection({ data }: FootprintsSectionProps) {
  const section = mergeFootprintsSectionData(data ?? null);
  const dashboardSrc = footprintsDashboardImageSrc(section);

  return (
    <section
      id="software"
      className="relative overflow-hidden bg-[#f7f9fc] py-10 sm:py-12"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 50%, rgba(249,115,22,0.12), transparent 42%), radial-gradient(circle at 85% 20%, rgba(15,39,68,0.08), transparent 40%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-[min(85%,1400px)]">
        <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
              {section.tagline}
            </p>
            <h2 className="mt-3 text-[clamp(1.85rem,3.2vw,2.75rem)] font-bold leading-tight tracking-tight text-[#0f2744]">
              {section.heading}
            </h2>
            <p className="mt-3 max-w-xl text-[14px] leading-7 text-neutral-600">
              {section.description}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
            {section.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#0f2744]/10 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#0f2744]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <FootprintsDashboardMockup
            priority
            imageSrc={dashboardSrc}
            imageAlt={section.dashboard_image_alt}
          />

          <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_16px_40px_rgba(15,39,68,0.06)] backdrop-blur-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                {section.capabilities_label}
              </p>
              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#ea580c]">
                {section.capabilities_badge}
              </span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {section.features.map((feature) => {
                const Icon = resolveFeatureIcon(feature.icon);

                return (
                  <article
                    key={feature.title}
                    className="group rounded-xl border border-neutral-100 bg-neutral-50/60 p-3 transition hover:border-[#f97316]/30 hover:bg-white hover:shadow-md"
                  >
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f2744] text-white transition group-hover:bg-[#f97316]">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="text-[12px] font-bold leading-4 text-[#0f2744]">
                      {feature.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-neutral-500">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

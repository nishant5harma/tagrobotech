"use client";

import {
  mergeTechnologyPlatformSectionData,
  resolvePlatforms,
  type TechnologyPlatformSectionData,
} from "@/lib/technology-platform";

type TechnologyPlatformsSectionProps = {
  data?: TechnologyPlatformSectionData | null;
};

export default function TechnologyPlatformsSection({ data }: TechnologyPlatformsSectionProps) {
  const section = mergeTechnologyPlatformSectionData(data ?? null);
  const platforms = resolvePlatforms(section);

  return (
    <section id="technologies" className="bg-[#f8fafc] py-16 sm:py-20">
      <div className="mx-auto w-[min(85%,1400px)]">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-start">
          <div className="sticky top-28 self-start">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#f97316]" aria-hidden="true" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500 sm:text-[12px]">
                {section.tagline}
              </p>
            </div>

            <h2 className="max-w-xl text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-tight text-[#0f2744]">
              {section.heading}{" "}
              <span className="text-[#f97316]">{section.heading_accent}</span>
            </h2>

            <p className="mt-5 max-w-xl text-[15px] leading-7 text-neutral-600 sm:text-[16px] sm:leading-8">
              {section.description}
            </p>

            <div className="mt-8 hidden rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,39,68,0.08)] xl:block">
              <div className="grid grid-cols-3 gap-3">
                {platforms.map((platform) => {
                  const Icon = platform.iconComponent;

                  return (
                    <div
                      key={platform.name}
                      className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-center"
                    >
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0f2744] shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-5 text-[13px] font-semibold text-[#0f2744]">
                        {platform.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {platforms.map((platform) => {
              const Icon = platform.iconComponent;

              return (
                <article
                  key={platform.name}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_16px_50px_rgba(15,39,68,0.08)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${platform.accent}`}
                    aria-hidden="true"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, rgba(15,39,68,0.14) 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                    aria-hidden="true"
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f2744] text-white shadow-[0_10px_24px_rgba(15,39,68,0.18)]">
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="rounded-full border border-neutral-200 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        {platform.name}
                      </span>
                    </div>

                    <h3 className="mt-10 text-[1.5rem] font-bold tracking-tight text-[#0f2744]">
                      {platform.name}
                    </h3>

                    <p className="mt-4 text-[14px] leading-6 text-neutral-600 sm:text-[15px]">
                      {platform.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

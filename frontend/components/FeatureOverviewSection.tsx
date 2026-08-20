"use client";

import {
  mergeFeatureOverviewSectionData,
  type FeatureOverviewSectionData,
} from "@/lib/feature-overview-section";

type FeatureOverviewSectionProps = {
  data?: FeatureOverviewSectionData | null;
};

export default function FeatureOverviewSection({ data }: FeatureOverviewSectionProps) {
  const section = mergeFeatureOverviewSectionData(data);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto w-[min(92%,1180px)] px-4">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
          <div>
            {section.tagline ? (
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#f97316]">
                {section.tagline}
              </p>
            ) : null}
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-[#0f2744]">
              {section.heading}{" "}
              {section.heading_accent ? (
                <span className="text-[#f97316]">{section.heading_accent}</span>
              ) : null}
            </h2>
            {section.description ? (
              <p className="mt-5 text-[15px] leading-8 text-pretty text-neutral-600">
                {section.description}
              </p>
            ) : null}
            {section.body ? (
              <p className="mt-4 text-[15px] leading-8 text-pretty text-neutral-600">
                {section.body}
              </p>
            ) : null}
            <ul className="mt-6 space-y-3">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-[14px] leading-7 text-neutral-700">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#f97316]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="border border-[#0f2744]/10 bg-[#f8fafc] p-6 sm:p-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#f97316]">
              {section.aside_title}
            </p>
            <p className="mt-4 text-[15px] leading-8 text-neutral-600">{section.aside_text}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

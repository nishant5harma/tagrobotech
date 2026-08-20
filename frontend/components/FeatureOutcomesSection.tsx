"use client";

import {
  mergeFeatureOutcomesSectionData,
  type FeatureOutcomesSectionData,
} from "@/lib/feature-outcomes-section";

type FeatureOutcomesSectionProps = {
  data?: FeatureOutcomesSectionData | null;
};

export default function FeatureOutcomesSection({ data }: FeatureOutcomesSectionProps) {
  const section = mergeFeatureOutcomesSectionData(data);

  return (
    <section className="bg-[#fff7ed] py-16 sm:py-20">
      <div className="mx-auto w-[min(92%,1180px)] px-4">
        <div className="mx-auto max-w-3xl text-center">
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
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {section.items.map((item, index) => (
            <article
              key={`${item.label}-${index}`}
              className="border border-[#0f2744]/10 bg-white p-5 sm:p-6"
            >
              <p className="text-[1.35rem] font-bold tracking-tight text-[#f97316]">{item.value}</p>
              <h3 className="mt-2 text-[0.98rem] font-semibold text-[#0f2744]">{item.label}</h3>
              <p className="mt-3 text-[13px] leading-6 text-neutral-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

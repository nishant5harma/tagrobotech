"use client";

import {
  mergeFeatureWorkflowSectionData,
  type FeatureWorkflowSectionData,
} from "@/lib/feature-workflow-section";

type FeatureWorkflowSectionProps = {
  data?: FeatureWorkflowSectionData | null;
};

export default function FeatureWorkflowSection({ data }: FeatureWorkflowSectionProps) {
  const section = mergeFeatureWorkflowSectionData(data);

  return (
    <section className="bg-[linear-gradient(180deg,#0f2744_0%,#173a63_100%)] py-16 sm:py-20 text-white">
      <div className="mx-auto w-[min(92%,1180px)] px-4">
        <div className="mx-auto max-w-3xl text-center">
          {section.tagline ? (
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#fb923c]">
              {section.tagline}
            </p>
          ) : null}
          <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight">
            {section.heading}{" "}
            {section.heading_accent ? (
              <span className="text-[#fb923c]">{section.heading_accent}</span>
            ) : null}
          </h2>
          {section.description ? (
            <p className="mt-5 text-[15px] leading-8 text-pretty text-white/75">
              {section.description}
            </p>
          ) : null}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {section.steps.map((step, index) => (
            <div
              key={`${step.title}-${index}`}
              className="border border-white/15 bg-white/5 p-6 backdrop-blur-[2px]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f97316] text-sm font-bold text-white">
                {index + 1}
              </div>
              <h3 className="mt-5 text-[1.05rem] font-semibold">{step.title}</h3>
              <p className="mt-3 text-[14px] leading-7 text-white/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

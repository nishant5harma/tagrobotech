"use client";

import {
  mergeResourceHowItWorksSectionData,
  type ResourceHowItWorksSectionData,
} from "@/lib/resource-how-it-works-section";

type ResourceHowItWorksSectionProps = {
  data?: ResourceHowItWorksSectionData | null;
};

export default function ResourceHowItWorksSection({ data }: ResourceHowItWorksSectionProps) {
  const section = mergeResourceHowItWorksSectionData(data);

  return (
    <section className="bg-[linear-gradient(180deg,#fff7f3_0%,#ffffff_55%)] py-16 sm:py-20">
      <div className="mx-auto w-[min(92%,1180px)] px-4">
        <div className="mx-auto max-w-3xl text-center">
          {section.tagline ? (
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#f97316]">
              {section.tagline}
            </p>
          ) : null}
          <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-[#111827]">
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

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {section.steps.map((step, index) => (
            <div
              key={`${step.title}-${index}`}
              className="rounded-[1.5rem] border border-[#0f2744]/8 bg-white p-6 shadow-[0_12px_40px_rgba(15,39,68,0.06)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff7ed] text-sm font-bold text-[#f97316]">
                {index + 1}
              </div>
              <h3 className="mt-5 text-[1.05rem] font-semibold text-[#0f2744]">{step.title}</h3>
              <p className="mt-3 text-[14px] leading-7 text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

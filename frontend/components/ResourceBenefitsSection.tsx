"use client";

import {
  mergeResourceBenefitsSectionData,
  type ResourceBenefitsSectionData,
} from "@/lib/resource-benefits-section";

type ResourceBenefitsSectionProps = {
  data?: ResourceBenefitsSectionData | null;
};

export default function ResourceBenefitsSection({ data }: ResourceBenefitsSectionProps) {
  const section = mergeResourceBenefitsSectionData(data);

  return (
    <section className="bg-white py-16 sm:py-20">
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
          {section.items.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-[#0f2744]/8 bg-[#f8fafc] p-6"
            >
              <h3 className="text-[1.05rem] font-semibold text-[#0f2744]">{item.title}</h3>
              <p className="mt-3 text-[14px] leading-7 text-neutral-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

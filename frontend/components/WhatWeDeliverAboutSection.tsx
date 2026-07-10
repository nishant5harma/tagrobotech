"use client";

import CmsImage from "@/components/CmsImage";
import { motion } from "framer-motion";
import {
  mergeWhatWeDeliverAboutSectionData,
  resolveDeliverCapabilityIcon,
  whatWeDeliverImageSrc,
  type WhatWeDeliverAboutSectionData,
} from "@/lib/what-we-deliver-about-section";

type WhatWeDeliverAboutSectionProps = {
  data?: WhatWeDeliverAboutSectionData | null;
};

export default function WhatWeDeliverAboutSection({ data }: WhatWeDeliverAboutSectionProps) {
  const section = mergeWhatWeDeliverAboutSectionData(data ?? null);
  const imageSrc = whatWeDeliverImageSrc(section);

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="py-16 sm:py-20"
    >
      <div className="mx-auto w-[min(92%,1320px)] px-4">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
          <div className="rounded-[2rem] border border-[#0f2744]/10 bg-[#f8fafc] p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
              {section.tagline}
            </p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.04] tracking-tight text-[#0f2744]">
              {section.heading}
            </h2>
            <p className="mt-5 text-[15px] leading-8 text-neutral-600 sm:text-[16px]">
              {section.description}
            </p>
            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-[#0f2744]/10 bg-white shadow-[0_18px_50px_rgba(15,39,68,0.08)]">
              <CmsImage
                src={imageSrc}
                alt={section.image_alt}
                width={1400}
                height={900}
                className="h-[240px] w-full object-cover"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {section.capabilities.map((capability, index) => {
              const Icon = resolveDeliverCapabilityIcon(capability.icon);

              return (
                <motion.article
                  key={`${capability.title}-${index}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="rounded-[1.75rem] border border-[#0f2744]/10 bg-white p-6 shadow-[0_20px_50px_rgba(15,39,68,0.08)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f97316]/10 text-[#f97316]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-[1.1rem] font-bold tracking-tight text-[#0f2744]">
                    {capability.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-7 text-neutral-600">
                    {capability.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

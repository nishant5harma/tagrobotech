"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LogoCloud } from "@/components/ui/logo-cloud-2";
import {
  mergeReachTrustAboutSectionData,
  reachTrustImageSrc,
  toReachTrustLogoCloudItems,
  type ReachTrustAboutSectionData,
} from "@/lib/reach-trust-about-section";

type ReachTrustAboutSectionProps = {
  data?: ReachTrustAboutSectionData | null;
};

export default function ReachTrustAboutSection({ data }: ReachTrustAboutSectionProps) {
  const section = mergeReachTrustAboutSectionData(data ?? null);
  const logos = toReachTrustLogoCloudItems(section);
  const imageSrc = reachTrustImageSrc(section);

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#f8fafc] py-16 sm:py-20"
    >
      <div className="mx-auto w-[min(92%,1320px)] px-4">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
              {section.tagline}
            </p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.04] tracking-tight text-[#0f2744]">
              {section.heading}
            </h2>
            <p className="mt-5 text-[15px] leading-8 text-neutral-600 sm:text-[16px]">
              {section.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {section.sectors.map((sector) => (
                <span
                  key={sector}
                  className="rounded-full border border-[#0f2744]/10 bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#0f2744]"
                >
                  {sector}
                </span>
              ))}
            </div>

            <p className="mt-8 rounded-[1.5rem] border border-[#0f2744]/10 bg-white p-6 text-[14px] leading-7 text-neutral-600 shadow-[0_16px_40px_rgba(15,39,68,0.05)]">
              <span className="font-semibold text-[#0f2744]">
                {section.flagship_clients_label}
              </span>{" "}
              {section.flagship_clients}
            </p>
          </div>

          <div className="space-y-6">
            <LogoCloud
              logos={logos}
              className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(15,39,68,0.08)]"
            />

            <div className="overflow-hidden rounded-[2rem] border border-[#0f2744]/10 bg-white shadow-[0_18px_50px_rgba(15,39,68,0.08)]">
              <Image
                src={imageSrc}
                alt={section.image_alt}
                width={1200}
                height={800}
                className="h-[220px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

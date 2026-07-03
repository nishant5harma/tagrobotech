"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import FootprintsDashboardMockup from "@/components/FootprintsDashboardMockup";
import {
  mergeSoftwareCtaSectionSoftwareData,
  softwareCtaImageSrc,
  type SoftwareCtaSectionSoftwareData,
} from "@/lib/software-cta-section-software";

type SoftwareCtaSectionSoftwareProps = {
  data?: SoftwareCtaSectionSoftwareData | null;
};

function CtaLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  if (href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http")) {
    return <a href={href} className={className}>{children}</a>;
  }
  return <Link href={href} className={className}>{children}</Link>;
}

export default function SoftwareCtaSectionSoftware({ data }: SoftwareCtaSectionSoftwareProps) {
  const section = mergeSoftwareCtaSectionSoftwareData(data ?? null);
  const imageSrc = softwareCtaImageSrc(section);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="bg-white py-16 sm:py-20"
    >
      <div className="mx-auto w-[min(92%,1320px)] px-4">
        <div className="grid gap-10 rounded-[1.75rem] bg-[#0f2744] p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:p-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300">
              {section.tagline}
            </p>
            <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-tight text-white">
              {section.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-8 text-white/80 sm:text-[16px]">
              {section.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink
                href={section.primary_button.link}
                className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full bg-[#f97316] px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#ea580c]"
              >
                {section.primary_button.text}
                <ArrowRight className="h-4 w-4" />
              </CtaLink>
              <CtaLink
                href={section.secondary_button.link}
                className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-white/10"
              >
                {section.secondary_button.text}
              </CtaLink>
            </div>
          </div>

          <FootprintsDashboardMockup
            imageSrc={imageSrc}
            imageAlt={section.image_alt}
            className="min-h-[240px] sm:min-h-[300px]"
          />
        </div>
      </div>
    </motion.section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import FootprintsDashboardMockup from "@/components/FootprintsDashboardMockup";
import {
  mergeSoftwareIntroSectionSoftwareData,
  softwareIntroImageSrc,
  type SoftwareIntroSectionSoftwareData,
} from "@/lib/software-intro-section-software";

type SoftwareIntroSectionSoftwareProps = {
  data?: SoftwareIntroSectionSoftwareData | null;
};

function CtaLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  if (href.startsWith("tel:") || href.startsWith("mailto:")) {
    return <a href={href} className={className}>{children}</a>;
  }
  return <Link href={href} className={className}>{children}</Link>;
}

export default function SoftwareIntroSectionSoftware({ data }: SoftwareIntroSectionSoftwareProps) {
  const section = mergeSoftwareIntroSectionSoftwareData(data ?? null);
  const imageSrc = softwareIntroImageSrc(section);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto w-[min(92%,1320px)] px-4">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <FootprintsDashboardMockup
            imageSrc={imageSrc}
            imageAlt={section.image_alt}
            className="min-h-[280px] sm:min-h-[360px]"
          />

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">{section.eyebrow}</p>
            <h2 className="mt-4 text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight text-[#0f2744]">
              {section.heading}
            </h2>
            <p className="mt-5 text-[15px] leading-8 text-neutral-600 sm:text-[16px]">{section.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {section.badges.map((badge) => (
                <span
                  key={badge.label}
                  className="rounded-full border border-[#0f2744]/10 bg-[#f8fafc] px-4 py-2 text-[13px] font-semibold text-[#0f2744]"
                >
                  {badge.label}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink
                href={section.primary_button.link}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f97316] px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#ea580c]"
              >
                {section.primary_button.text}
                <ArrowRight className="h-4 w-4" />
              </CtaLink>
              <CtaLink
                href={section.secondary_button.link}
                className="inline-flex items-center justify-center rounded-full border border-[#0f2744]/10 bg-white px-6 py-3.5 text-[14px] font-semibold text-[#0f2744] transition hover:border-[#0f2744]/20"
              >
                {section.secondary_button.text}
              </CtaLink>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {section.value_props.map((prop, index) => (
            <motion.div
              key={`${prop.number}-${prop.title}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="rounded-[1.5rem] border border-[#0f2744]/10 bg-[#f8fafc] p-6"
            >
              <p className="text-[2rem] font-bold leading-none text-[#f97316]/80">{prop.number}</p>
              <h3 className="mt-4 text-[1.05rem] font-bold text-[#0f2744]">{prop.title}</h3>
              <p className="mt-3 text-[14px] leading-7 text-neutral-600">{prop.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

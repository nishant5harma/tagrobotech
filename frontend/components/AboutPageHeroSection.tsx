"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import FootprintsDashboardMockup from "@/components/FootprintsDashboardMockup";
import {
  aboutPageHeroImageSrc,
  mergeAboutPageHeroSectionData,
  type AboutPageHeroSectionData,
} from "@/lib/about-page-hero-section";

type AboutPageHeroSectionProps = {
  data?: AboutPageHeroSectionData | null;
};

function HeroButton({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith("tel:") || href.startsWith("mailto:");

  if (isExternal) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function AboutPageHeroSection({ data }: AboutPageHeroSectionProps) {
  const section = mergeAboutPageHeroSectionData(data ?? null);
  const imageSrc = aboutPageHeroImageSrc(section);

  return (
    <section className="relative overflow-visible bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_55%,#f8fafc_100%)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 12%, rgba(249,115,22,0.12), transparent 24%), radial-gradient(circle at 85% 22%, rgba(15,39,68,0.08), transparent 28%), linear-gradient(rgba(15,39,68,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,39,68,0.04) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 44px 44px, 44px 44px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-[min(92%,1320px)] px-4 py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
              {section.tagline}
            </p>
            <h1 className="mt-4 text-[clamp(2.9rem,6vw,5.8rem)] font-bold leading-[0.94] tracking-tight text-[#0f2744]">
              {section.heading}{" "}
              <span className="text-[#f97316]">{section.heading_accent}</span>
              {section.heading_suffix ? ` ${section.heading_suffix}` : ""}
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-8 text-neutral-600 sm:text-[17px]">
              {section.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <HeroButton
                href={section.primary_button.link}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f97316] px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(249,115,22,0.3)] transition hover:bg-[#ea580c]"
              >
                {section.primary_button.text}
                <ArrowRight className="h-4 w-4" />
              </HeroButton>
              <HeroButton
                href={section.secondary_button.link}
                className="inline-flex items-center justify-center rounded-full border border-[#0f2744]/10 bg-white px-6 py-3.5 text-[14px] font-semibold text-[#0f2744] shadow-sm transition hover:border-[#0f2744]/20"
              >
                {section.secondary_button.text}
              </HeroButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.05 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <div className="h-[85%] w-full rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.14)_0%,transparent_72%)] blur-3xl" />
            </div>
            <div className="relative w-full lg:w-[112%] lg:max-w-none xl:w-[118%]">
              <FootprintsDashboardMockup
                priority
                imageSrc={imageSrc}
                imageAlt={section.image_alt}
                className="min-h-[240px] sm:min-h-[320px] lg:min-h-[400px] xl:min-h-[460px]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

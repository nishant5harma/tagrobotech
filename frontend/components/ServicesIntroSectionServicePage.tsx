"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  mergeServicesIntroSectionServicePageData,
  servicesIntroFeaturedImageSrc,
  type ServicesIntroSectionServicePageData,
} from "@/lib/services-intro-section-service-page";

type ServicesIntroSectionServicePageProps = {
  data?: ServicesIntroSectionServicePageData | null;
};

function CtaLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  if (href.startsWith("tel:") || href.startsWith("mailto:")) {
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

export default function ServicesIntroSectionServicePage({
  data,
}: ServicesIntroSectionServicePageProps) {
  const section = mergeServicesIntroSectionServicePageData(data ?? null);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto w-[min(92%,1320px)] px-4">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
            {section.eyebrow}
          </p>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.04] tracking-tight text-[#0f2744]">
            {section.heading}
          </h2>
          <p className="mt-5 text-[15px] leading-8 text-neutral-600 sm:text-[16px]">
            {section.description}
          </p>
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

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {section.featured_items.map((item, index) => (
            <motion.article
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="group overflow-hidden rounded-[1.5rem] border border-[#0f2744]/10 bg-[#f8fafc]"
            >
              <Link href={item.link} className="block">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={servicesIntroFeaturedImageSrc(item)}
                    alt={item.image_alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[12px] font-medium uppercase tracking-wide text-[#f97316]">
                    {item.summary_label}
                  </p>
                  <h3 className="mt-2 text-[1.1rem] font-bold text-[#0f2744]">{item.title}</h3>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {section.process_steps.map((step, index) => (
            <motion.div
              key={`${step.number}-${step.title}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="rounded-[1.5rem] border border-[#0f2744]/10 bg-white p-6 shadow-[0_16px_40px_rgba(15,39,68,0.06)]"
            >
              <p className="text-[2rem] font-bold leading-none text-[#f97316]/80">{step.number}</p>
              <h3 className="mt-4 text-[1.05rem] font-bold text-[#0f2744]">{step.title}</h3>
              <p className="mt-3 text-[14px] leading-7 text-neutral-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

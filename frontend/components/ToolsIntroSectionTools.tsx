"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  mergeToolsIntroSectionToolsData,
  toolsIntroPillImageSrc,
  type ToolsIntroSectionToolsData,
} from "@/lib/tools-intro-section-tools";

type ToolsIntroSectionToolsProps = {
  data?: ToolsIntroSectionToolsData | null;
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

export default function ToolsIntroSectionTools({ data }: ToolsIntroSectionToolsProps) {
  const section = mergeToolsIntroSectionToolsData(data ?? null);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto w-[min(92%,1320px)] px-4">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-end">
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

          <div className="grid grid-cols-2 gap-4">
            {section.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.5rem] border border-[#0f2744]/10 bg-[#f8fafc] p-6"
              >
                <p className="text-[2.2rem] font-bold leading-none text-[#0f2744]">{stat.value}</p>
                <p className="mt-3 text-[13px] leading-6 text-neutral-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-12 text-center text-[15px] font-medium text-[#0f2744] sm:text-[16px]">
          {section.tagline_below}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {section.tool_pills.map((pill, index) => (
            <motion.a
              key={`${pill.title}-${index}`}
              href={`#${pill.anchor}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="group overflow-hidden rounded-[1.25rem] border border-[#0f2744]/10 bg-[#f8fafc]"
            >
              <div className="relative h-28 overflow-hidden">
                <Image
                  src={toolsIntroPillImageSrc(pill)}
                  alt={pill.image_alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <p className="p-4 text-center text-[13px] font-semibold text-[#0f2744]">{pill.title}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  mergeToolsFlagshipSectionToolsData,
  toolsFlagshipImageSrc,
  type ToolsFlagshipSectionToolsData,
} from "@/lib/tools-flagship-section-tools";

type ToolsFlagshipSectionToolsProps = {
  data?: ToolsFlagshipSectionToolsData | null;
};

function DeployLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  if (href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http")) {
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

export default function ToolsFlagshipSectionTools({ data }: ToolsFlagshipSectionToolsProps) {
  const section = mergeToolsFlagshipSectionToolsData(data ?? null);

  return (
    <section className="bg-[#f4f6fa] py-16 sm:py-20">
      <div className="mx-auto w-[min(92%,1320px)] px-4">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
            {section.tagline}
          </p>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.04] tracking-tight text-[#0f2744]">
            {section.heading}
          </h2>
          <p className="mt-5 text-[15px] leading-8 text-neutral-600 sm:text-[16px]">
            {section.description}
          </p>
        </div>

        <div className="mt-14 space-y-10">
          {section.tools.map((tool, index) => {
            const imageOnRight = index % 2 === 1;

            return (
              <motion.article
                key={`${tool.number}-${tool.title}`}
                id={tool.anchor}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5 }}
                className={`grid gap-8 rounded-[1.75rem] border border-[#0f2744]/10 bg-white p-6 shadow-[0_16px_40px_rgba(15,39,68,0.06)] lg:grid-cols-2 lg:p-8 ${
                  imageOnRight ? "lg:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="overflow-hidden rounded-[1.25rem]">
                  <Image
                    src={toolsFlagshipImageSrc(tool)}
                    alt={tool.image_alt}
                    width={900}
                    height={600}
                    className="h-full min-h-[240px] w-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#f97316]">
                    Tracking tool
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#f97316]/10 px-3 py-1 text-[12px] font-semibold text-[#f97316]">
                      {tool.number} · {tool.badge}
                    </span>
                    {tool.tags.map((tag) => (
                      <span
                        key={`${tool.title}-${tag}`}
                        className="rounded-full border border-[#0f2744]/10 px-3 py-1 text-[12px] font-medium text-[#0f2744]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="mt-4 text-[clamp(1.5rem,2.5vw,2rem)] font-bold text-[#0f2744]">
                    {tool.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-8 text-neutral-600">{tool.summary}</p>
                  <p className="mt-4 text-[14px] leading-7 text-neutral-500">{tool.description}</p>

                  {tool.how_it_works.length > 0 ? (
                    <div className="mt-6 rounded-[1.25rem] border border-[#0f2744]/10 bg-[#f8fafc] p-5">
                      <p className="text-[12px] font-semibold uppercase tracking-wide text-[#0f2744]">
                        How it works
                      </p>
                      <ol className="mt-4 space-y-3">
                        {tool.how_it_works.map((step) => (
                          <li key={`${tool.title}-${step.step}`} className="flex gap-3 text-[14px] text-neutral-600">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0f2744] text-[12px] font-bold text-white">
                              {step.step}
                            </span>
                            <span className="pt-0.5 leading-7">{step.text}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : null}

                  <ul className="mt-6 space-y-3">
                    {tool.highlights.map((highlight) => (
                      <li
                        key={`${tool.title}-${highlight}`}
                        className="flex gap-3 text-[14px] leading-7 text-neutral-600"
                      >
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#f97316]" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <DeployLink
                    href={tool.deploy_link}
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0f2744] px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#16345a]"
                  >
                    {tool.deploy_text}
                    <ArrowRight className="h-4 w-4" />
                  </DeployLink>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

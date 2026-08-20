"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  mergePageCtaSectionData,
  type PageCtaSectionData,
} from "@/lib/page-cta-section";

type PageCtaSectionProps = {
  data?: PageCtaSectionData | null;
};

function CtaButton({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
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

export default function PageCtaSection({ data }: PageCtaSectionProps) {
  const section = mergePageCtaSectionData(data);

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto w-[min(92%,1280px)] px-4">
        <div className="rounded-[1.75rem] bg-[#0f2744] px-6 py-12 text-center sm:rounded-[2rem] sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          {section.tagline ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f97316] sm:text-[12px]">
              {section.tagline}
            </p>
          ) : null}

          <h2 className="mx-auto mt-4 max-w-4xl text-[clamp(1.45rem,3.2vw,2.35rem)] font-bold leading-tight tracking-tight text-white">
            {section.heading}
          </h2>

          {section.description ? (
            <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-8 text-white/75 sm:text-[16px]">
              {section.description}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            {section.primary_button.text ? (
              <CtaButton
                href={section.primary_button.link || "#"}
                className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-full bg-[#f97316] px-7 py-3.5 text-[13px] font-semibold text-white transition hover:bg-[#ea580c]"
              >
                {section.primary_button.text}
                <ArrowRight className="h-4 w-4" />
              </CtaButton>
            ) : null}

            {section.secondary_button.text ? (
              <CtaButton
                href={section.secondary_button.link || "#"}
                className="inline-flex min-w-[200px] items-center justify-center rounded-full border border-white/35 bg-transparent px-7 py-3.5 text-[13px] font-semibold text-white transition hover:border-white/60 hover:bg-white/5"
              >
                {section.secondary_button.text}
              </CtaButton>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import {
  mergeCtaReusableSectionData,
  type CtaReusableSectionData,
} from "@/lib/cta-reusable-section";

type CtaReusableSectionProps = {
  data?: CtaReusableSectionData | null;
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

function TrustBadges({ ratings }: { ratings: CtaReusableSectionData["ratings"] }) {
  const complianceBadges = ["AICPA SOC", "ISO 27001", "GDPR"];

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
      {ratings.map((rating, index) => (
        <div
          key={`rating-${index}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-[#111827] shadow-sm"
        >
          <Star className="h-3.5 w-3.5 fill-[#f97316] text-[#f97316]" />
          <span>{rating.value}</span>
        </div>
      ))}

      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[13px] font-bold text-[#4285f4] shadow-sm">
        G
      </div>

      <div className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#ff6d2e] shadow-sm">
        Capterra
      </div>

      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[12px] font-extrabold text-[#ff492c] shadow-sm">
        G2
      </div>

      {complianceBadges.map((badge) => (
        <div
          key={badge}
          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/30 bg-[#1e4f8a] p-1 text-center text-[7px] font-bold leading-tight text-white"
        >
          {badge}
        </div>
      ))}
    </div>
  );
}

export default function CtaReusableSection({ data }: CtaReusableSectionProps) {
  const section = mergeCtaReusableSectionData(data);

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="mx-auto w-[min(92%,1280px)] px-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#ff7a45_0%,#f45a2a_48%,#ef4f24_100%)] px-6 py-10 text-center shadow-[0_24px_60px_rgba(239,79,36,0.28)] sm:rounded-[2.5rem] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 top-8 h-44 w-44 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-[#ff9b6d]/30 blur-xl"
          />

          <div className="relative z-[1]">
            <h2 className="text-[clamp(1.5rem,3.2vw,2.35rem)] font-bold leading-tight text-white">
              {section.heading}
            </h2>

            {section.description ? (
              <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-white/95 sm:text-[16px]">
                {section.description}
              </p>
            ) : null}

            {section.button.text ? (
              <div className="mt-7 sm:mt-8">
                <CtaButton
                  href={section.button.link || "#"}
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#ef4f24] transition hover:bg-[#fff7f3] sm:px-8 sm:text-[13px]"
                >
                  {section.button.text}
                </CtaButton>
              </div>
            ) : null}

            {section.show_trust_badges ? <TrustBadges ratings={section.ratings} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

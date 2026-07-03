"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LogoCloud } from "@/components/ui/logo-cloud-2";
import {
  mergeMoreClientsSectionData,
  toLogoCloudItems,
  type MoreClientsSectionData,
} from "@/lib/more-clients-section";

type OurClientsSectionProps = {
  data?: MoreClientsSectionData | null;
};

export default function OurClientsSection({ data }: OurClientsSectionProps) {
  const section = mergeMoreClientsSectionData(data ?? null);
  const logos = toLogoCloudItems(section);

  return (
    <section
      id="clients"
      className="relative overflow-hidden bg-white py-16 sm:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(249,115,22,0.08), transparent 42%), radial-gradient(circle at 80% 70%, rgba(15,39,68,0.06), transparent 40%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-[min(92%,1200px)] px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
            {section.tagline}
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight tracking-tight text-[#0f2744]">
            {section.heading}{" "}
            <span className="text-[#f97316]">{section.heading_accent}</span>
            {section.heading_suffix ? ` ${section.heading_suffix}` : ""}
          </h2>
          <p className="mt-3 text-[14px] leading-7 text-neutral-600">
            {section.description}
          </p>
        </div>

        <LogoCloud logos={logos} />

        <div className="mt-8 text-center">
          <Link
            href={section.cta_button.link}
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0f2744] transition-colors hover:text-[#f97316]"
          >
            {section.cta_button.text}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

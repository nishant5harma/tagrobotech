"use client";

import CmsImage from "@/components/CmsImage";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import FootprintsDashboardMockup from "@/components/FootprintsDashboardMockup";
import {
  mergeSolutionPageHeroData,
  solutionHeroImageSrc,
  type SolutionPageHeroData,
} from "@/lib/solution-page-hero-section";

type SolutionPageHeroSectionProps = {
  data?: SolutionPageHeroData | null;
};

function HeroCta({
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

function MobileDashboardMockup({
  imageSrc,
  imageAlt,
}: {
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <div className="relative mx-auto w-[min(100%,220px)]">
      <div className="rounded-[2rem] border-[6px] border-[#1a1a1a] bg-[#1a1a1a] p-1.5 shadow-[0_24px_50px_rgba(15,39,68,0.18)]">
        <div className="overflow-hidden rounded-[1.4rem] bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2">
            <span className="text-[10px] font-semibold text-[#0f2744]">Dashboards</span>
            <span className="rounded bg-[#f97316] px-1.5 py-0.5 text-[8px] font-medium text-white">
              + Add Asset
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 p-2">
            {[
              { value: "5", label: "Pending Audits", color: "bg-[#22c55e]" },
              { value: "0", label: "Pending Approvals", color: "bg-[#1e3a5f]" },
              { value: "10", label: "Pending Activities", color: "bg-[#3b82f6]" },
              { value: "18", label: "Pending Request", color: "bg-[#f59e0b]" },
            ].map((tile) => (
              <div
                key={tile.label}
                className={`rounded-lg px-2 py-2 text-white ${tile.color}`}
              >
                <p className="text-[15px] font-bold leading-none">{tile.value}</p>
                <p className="mt-1 text-[7px] leading-tight opacity-95">{tile.label}</p>
              </div>
            ))}
          </div>
          <div className="relative h-28 bg-neutral-50">
            <CmsImage
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover object-top opacity-80"
              unoptimized
            />
          </div>
        </div>
      </div>
      <div className="absolute left-1/2 top-2 h-1 w-12 -translate-x-1/2 rounded-full bg-neutral-700" />
    </div>
  );
}

export default function SolutionPageHeroSection({ data }: SolutionPageHeroSectionProps) {
  const section = mergeSolutionPageHeroData(data);
  const desktopSrc = solutionHeroImageSrc(
    section.desktop_image_src,
    section.desktop_image_url
  );
  const mobileSrc = solutionHeroImageSrc(section.mobile_image_src, section.mobile_image_url);

  return (
    <section className="relative overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 0% 0%, rgba(249,115,22,0.06), transparent 28%), radial-gradient(circle at 100% 20%, rgba(15,39,68,0.04), transparent 32%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-[min(92%,1320px)] px-4 pb-10 pt-8 sm:pb-14 sm:pt-10">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-[13px] text-neutral-500">
          {section.breadcrumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-1.5">
              {index > 0 ? <ChevronRight className="h-3.5 w-3.5 text-neutral-300" /> : null}
              {crumb.href ? (
                <Link href={crumb.href} className="transition-colors hover:text-[#0f2744]">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-neutral-700">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
          <div>
            <h1 className="max-w-xl text-[clamp(2rem,4.2vw,3.35rem)] font-bold leading-[1.08] tracking-tight text-[#111827]">
              {section.heading}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-8 text-neutral-600 sm:text-[16px]">
              {section.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <HeroCta
                href={section.primary_button.link}
                className="inline-flex items-center justify-center rounded-full bg-[#f97316] px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(249,115,22,0.28)] transition hover:bg-[#ea580c]"
              >
                {section.primary_button.text}
              </HeroCta>
              <HeroCta
                href={section.secondary_button.link}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-[#f97316] bg-white px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#f97316] transition hover:bg-[#fff7ed]"
              >
                {section.secondary_button.text}
                <ArrowUpRight className="h-4 w-4" />
              </HeroCta>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {section.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-neutral-100 bg-white px-4 py-5 shadow-[0_10px_30px_rgba(15,39,68,0.06)]"
                >
                  <p className="text-[clamp(1.5rem,2.5vw,2rem)] font-bold leading-none text-[#111827]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[13px] leading-5 text-neutral-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[360px] lg:min-h-[480px]">
            <div className="absolute inset-y-0 right-0 w-[min(100%,620px)] translate-x-2 lg:translate-x-6">
              <FootprintsDashboardMockup
                imageSrc={desktopSrc}
                imageAlt={section.desktop_image_alt}
                priority
                className="drop-shadow-[0_24px_50px_rgba(15,39,68,0.12)]"
              />
            </div>

            <div className="absolute bottom-2 left-0 z-10 sm:bottom-6 sm:left-4">
              <MobileDashboardMockup imageSrc={mobileSrc} imageAlt={section.mobile_image_alt} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

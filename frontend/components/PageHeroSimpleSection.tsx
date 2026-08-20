"use client";

import CmsImage from "@/components/CmsImage";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import {
  mergePageHeroSimpleSectionData,
  pageHeroSimpleImageSrc,
  type PageHeroSimpleContext,
  type PageHeroSimpleSectionData,
} from "@/lib/page-hero-simple-section";

type PageHeroSimpleSectionProps = {
  data?: PageHeroSimpleSectionData | null;
  context?: PageHeroSimpleContext;
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

export default function PageHeroSimpleSection({ data, context }: PageHeroSimpleSectionProps) {
  const section = mergePageHeroSimpleSectionData(data, context);
  const imageSrc = pageHeroSimpleImageSrc(section.image_src, section.image_url);

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
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-1.5 text-[13px] text-neutral-500"
        >
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

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <h1 className="max-w-xl text-[clamp(2rem,4.2vw,3.35rem)] font-bold leading-[1.08] tracking-tight text-[#111827]">
              {section.heading}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-8 text-neutral-600 sm:text-[16px]">
              {section.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {section.primary_button.text ? (
                <HeroCta
                  href={section.primary_button.link || "#"}
                  className="inline-flex items-center justify-center rounded-full bg-[#f97316] px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(249,115,22,0.28)] transition hover:bg-[#ea580c]"
                >
                  {section.primary_button.text}
                </HeroCta>
              ) : null}
              {section.secondary_button.text ? (
                <HeroCta
                  href={section.secondary_button.link || "#"}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-[#f97316] bg-white px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#f97316] transition hover:bg-[#fff7ed]"
                >
                  {section.secondary_button.text}
                  <ArrowUpRight className="h-4 w-4" />
                </HeroCta>
              ) : null}
            </div>

            {section.stats.length > 0 ? (
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {section.stats.map((stat, index) => (
                  <div
                    key={`${stat.label}-${index}`}
                    className="rounded-2xl border border-neutral-100 bg-white px-4 py-5 shadow-[0_10px_30px_rgba(15,39,68,0.06)]"
                  >
                    <p className="text-[clamp(1.5rem,2.5vw,2rem)] font-bold leading-none text-[#111827]">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[13px] leading-5 text-neutral-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[1.75rem] border border-[#e8ecf3] bg-[#f7f8fb] shadow-[0_24px_50px_rgba(15,39,68,0.1)]">
              <div className="relative aspect-[4/3] w-full">
                <CmsImage
                  src={imageSrc}
                  alt={section.image_alt || section.heading}
                  fill
                  priority
                  className="object-cover object-center"
                  unoptimized={
                    imageSrc.startsWith("http://localhost") || imageSrc.startsWith("/uploads/")
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

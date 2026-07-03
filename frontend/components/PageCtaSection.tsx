"use client";

import Link from "next/link";
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
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto w-[min(92%,1280px)] px-4">
        <div className="rounded-[1.25rem] bg-[#121212] px-6 py-12 text-center sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
            {section.heading}
          </h2>

          {section.description ? (
            <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-8 text-white/90 sm:text-[16px]">
              {section.description}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            {section.primary_button.text ? (
              <CtaButton
                href={section.primary_button.link || "#"}
                className="inline-flex min-w-[220px] items-center justify-center rounded-lg bg-[#e66b55] px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#d95a44]"
              >
                {section.primary_button.text}
              </CtaButton>
            ) : null}

            {section.secondary_button.text ? (
              <CtaButton
                href={section.secondary_button.link || "#"}
                className="inline-flex min-w-[220px] items-center justify-center rounded-lg bg-[#2d343c] px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#3a424c]"
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

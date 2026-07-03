"use client";

import Image from "next/image";
import {
  mergePageClientsSectionData,
  toPageClientLogos,
  type PageClientsSectionData,
} from "@/lib/page-clients-section";

type PageClientsSectionProps = {
  data?: PageClientsSectionData | null;
};

export default function PageClientsSection({ data }: PageClientsSectionProps) {
  const section = mergePageClientsSectionData(data);
  const logos = toPageClientLogos(section);

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto w-[min(92%,1280px)] px-4">
        <h2 className="text-center text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-[#111827]">
          {section.heading_prefix}{" "}
          <span className="text-[#f97316]">{section.heading_highlight}</span>{" "}
          {section.heading_suffix}
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10">
          {logos.map((logo) => (
            <div
              key={logo.id}
              className="flex h-14 items-center justify-center sm:h-16 lg:h-[72px]"
            >
              {logo.href ? (
                <a
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full w-full items-center justify-center"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={180}
                    height={72}
                    unoptimized={
                      logo.src.startsWith("http://localhost") ||
                      logo.src.startsWith("/uploads/")
                    }
                    className="h-9 w-auto max-w-[130px] object-contain opacity-90 transition hover:opacity-100 sm:h-10 sm:max-w-[150px] lg:h-11 lg:max-w-[170px]"
                  />
                </a>
              ) : (
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={180}
                  height={72}
                  unoptimized={
                    logo.src.startsWith("http://localhost") ||
                    logo.src.startsWith("/uploads/")
                  }
                  className="h-9 w-auto max-w-[130px] object-contain opacity-90 sm:h-10 sm:max-w-[150px] lg:h-11 lg:max-w-[170px]"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

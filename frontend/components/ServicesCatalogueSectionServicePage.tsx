"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  mergeServicesCatalogueSectionServicePageData,
  servicesCatalogueImageSrc,
  type ServicesCatalogueSectionServicePageData,
} from "@/lib/services-catalogue-section-service-page";

type ServicesCatalogueSectionServicePageProps = {
  data?: ServicesCatalogueSectionServicePageData | null;
};

function EnquireLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
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

export default function ServicesCatalogueSectionServicePage({
  data,
}: ServicesCatalogueSectionServicePageProps) {
  const section = mergeServicesCatalogueSectionServicePageData(data ?? null);
  const [activeCategory, setActiveCategory] = useState(section.categories[0]?.key ?? "all");

  const filteredServices = useMemo(() => {
    if (activeCategory === "all") return section.services;
    return section.services.filter((service) => service.category_key === activeCategory);
  }, [activeCategory, section.services]);

  const groupedServices = useMemo(() => {
    return section.categories.map((category) => ({
      ...category,
      items: section.services.filter((service) => service.category_key === category.key),
    }));
  }, [section.categories, section.services]);

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

        <div className="mt-10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
              activeCategory === "all"
                ? "bg-[#0f2744] text-white"
                : "bg-white text-[#0f2744] hover:bg-white/80"
            }`}
          >
            Complete catalogue
          </button>
          {section.categories.map((category) => (
            <button
              key={category.key}
              type="button"
              onClick={() => setActiveCategory(category.key)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                activeCategory === category.key
                  ? "bg-[#0f2744] text-white"
                  : "bg-white text-[#0f2744] hover:bg-white/80"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service, index) => (
            <motion.article
              key={`${service.number}-${service.title}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: (index % 6) * 0.04 }}
              className="overflow-hidden rounded-[1.5rem] border border-[#0f2744]/10 bg-white shadow-[0_16px_40px_rgba(15,39,68,0.06)]"
            >
              <Link href={service.link} className="block">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={servicesCatalogueImageSrc(service)}
                    alt={service.image_alt}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#0f2744]">
                    {service.category_label}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[12px] font-medium uppercase tracking-wide text-[#f97316]">
                    {service.summary_label}
                  </p>
                  <h3 className="mt-2 text-[1.15rem] font-bold text-[#0f2744]">{service.title}</h3>
                  <p className="mt-3 text-[14px] leading-7 text-neutral-600">
                    {service.short_description}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-20 space-y-16">
          {groupedServices.map((group) => (
            <div key={group.key}>
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
                    Service category
                  </p>
                  <h3 className="mt-2 text-[clamp(1.6rem,3vw,2.4rem)] font-bold text-[#0f2744]">
                    {group.label}
                  </h3>
                </div>
              </div>

              <div className="space-y-8">
                {group.items.map((service) => (
                  <article
                    key={`detail-${service.number}-${service.title}`}
                    id={service.link.replace(/^\//, "").replace(/\//g, "-")}
                    className="grid gap-8 rounded-[1.75rem] border border-[#0f2744]/10 bg-white p-6 shadow-[0_16px_40px_rgba(15,39,68,0.06)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:p-8"
                  >
                    <div className="overflow-hidden rounded-[1.25rem]">
                      <Image
                        src={servicesCatalogueImageSrc(service)}
                        alt={service.image_alt}
                        width={900}
                        height={600}
                        className="h-full min-h-[220px] w-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-[#f97316]/10 px-3 py-1 text-[12px] font-semibold text-[#f97316]">
                          {service.number} · {service.category_label}
                        </span>
                        {service.tags.map((tag) => (
                          <span
                            key={`${service.title}-${tag}`}
                            className="rounded-full border border-[#0f2744]/10 px-3 py-1 text-[12px] font-medium text-[#0f2744]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h4 className="mt-4 text-[clamp(1.4rem,2.5vw,2rem)] font-bold text-[#0f2744]">
                        {service.title}
                      </h4>
                      <p className="mt-4 text-[15px] leading-8 text-neutral-600">
                        {service.short_description}
                      </p>

                      <ul className="mt-6 space-y-3">
                        {service.highlights.map((highlight) => (
                          <li
                            key={`${service.title}-${highlight}`}
                            className="flex gap-3 text-[14px] leading-7 text-neutral-600"
                          >
                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#f97316]" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      <EnquireLink
                        href={service.enquire_link}
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0f2744] px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#16345a]"
                      >
                        {service.enquire_text}
                        <ArrowRight className="h-4 w-4" />
                      </EnquireLink>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

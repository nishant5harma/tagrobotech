"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  mergeWhoWeAreAboutSectionData,
  whoWeAreAboutImageSrc,
  type WhoWeAreAboutSectionData,
  type WhoWeAreFeature,
} from "@/lib/who-we-are-about-section";

type WhoWeAreAboutSectionProps = {
  data?: WhoWeAreAboutSectionData | null;
};

function FeatureCard({ feature }: { feature: WhoWeAreFeature }) {
  const isMuted = feature.style === "muted";

  return (
    <div
      className={`rounded-[2rem] border border-[#0f2744]/10 p-6 shadow-[0_18px_50px_rgba(15,39,68,0.08)] ${
        isMuted ? "bg-[#f8fafc] shadow-[0_18px_50px_rgba(15,39,68,0.05)]" : "bg-white"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f97316]">
        {feature.tagline}
      </p>
      <p className="mt-3 text-[14px] leading-7 text-neutral-600">{feature.description}</p>
    </div>
  );
}

export default function WhoWeAreAboutSection({ data }: WhoWeAreAboutSectionProps) {
  const section = mergeWhoWeAreAboutSectionData(data ?? null);
  const imageSrc = whoWeAreAboutImageSrc(section);

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="py-16 sm:py-20"
    >
      <div className="mx-auto grid w-[min(92%,1320px)] gap-8 px-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-[2rem] border border-[#0f2744]/10 bg-[#0f2744] p-8 text-white shadow-[0_24px_60px_rgba(15,39,68,0.14)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300">
            {section.tagline}
          </p>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.03] tracking-tight">
            {section.heading}
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-8 text-white/75">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] border border-[#0f2744]/10 bg-white shadow-[0_18px_50px_rgba(15,39,68,0.08)] sm:col-span-2">
            <Image
              src={imageSrc}
              alt={section.image_alt}
              width={1200}
              height={800}
              className="h-[280px] w-full object-cover"
            />
          </div>
          {section.features.map((feature) => (
            <FeatureCard key={feature.tagline} feature={feature} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

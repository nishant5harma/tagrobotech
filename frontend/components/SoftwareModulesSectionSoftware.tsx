"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FootprintsDashboardMockup from "@/components/FootprintsDashboardMockup";
import {
  mergeSoftwareModulesSectionSoftwareData,
  softwareModulesImageSrc,
  type SoftwareModuleItem,
  type SoftwareModulesSectionSoftwareData,
} from "@/lib/software-modules-section-software";

type SoftwareModulesSectionSoftwareProps = {
  data?: SoftwareModulesSectionSoftwareData | null;
};

function ModuleCard({
  module,
  isActive,
  onSelect,
}: {
  module: SoftwareModuleItem;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full rounded-2xl border px-5 py-5 text-left transition-all duration-200 sm:px-6 sm:py-6 ${
        isActive
          ? "border-[#f97316]/35 bg-white shadow-[0_20px_50px_rgba(15,39,68,0.1)] ring-1 ring-[#f97316]/15"
          : "border-[#0f2744]/8 bg-white shadow-[0_10px_30px_rgba(15,39,68,0.05)] hover:border-[#f97316]/20 hover:shadow-[0_16px_40px_rgba(15,39,68,0.08)]"
      }`}
    >
      <p
        className={`text-[10px] font-bold uppercase tracking-[0.22em] ${
          isActive ? "text-[#f97316]" : "text-[#f97316]/80"
        }`}
      >
        Module {module.number}
      </p>
      <p
        className={`mt-2 text-[15px] font-bold leading-snug sm:text-[16px] ${
          isActive ? "text-[#0f2744]" : "text-[#0f2744]/90"
        }`}
      >
        {module.title}
      </p>
      {isActive ? (
        <p className="mt-3 text-[13px] leading-7 text-neutral-600 sm:text-[14px]">
          {module.description}
        </p>
      ) : null}
    </button>
  );
}

export default function SoftwareModulesSectionSoftware({ data }: SoftwareModulesSectionSoftwareProps) {
  const section = mergeSoftwareModulesSectionSoftwareData(data ?? null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeModule: SoftwareModuleItem =
    section.modules[activeIndex] ?? section.modules[0];
  const imageSrc = softwareModulesImageSrc(section);

  return (
    <section className="relative overflow-hidden bg-[#f7f9fc] py-16 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(249,115,22,0.1), transparent 34%), radial-gradient(circle at 88% 12%, rgba(15,39,68,0.06), transparent 30%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-[min(92%,1320px)] px-4">
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

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start lg:gap-10">
          <div className="max-h-[min(72vh,680px)] space-y-3 overflow-y-auto pr-1 sm:space-y-4 lg:sticky lg:top-28">
            {section.modules.map((module, index) => (
              <ModuleCard
                key={`${module.number}-${module.title}`}
                module={module}
                isActive={index === activeIndex}
                onSelect={() => setActiveIndex(index)}
              />
            ))}
          </div>

          <div className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[2rem] border border-white/90 bg-white p-5 shadow-[0_24px_60px_rgba(15,39,68,0.08)] sm:p-7">
              <FootprintsDashboardMockup
                imageSrc={imageSrc}
                imageAlt={section.image_alt}
                className="w-full"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule.number}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-6 border-t border-neutral-100 pt-6"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f97316]">
                    Module {activeModule.number}
                  </p>
                  <h3 className="mt-2 text-[clamp(1.25rem,2vw,1.65rem)] font-bold leading-tight text-[#0f2744]">
                    {activeModule.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-7 text-neutral-600 sm:text-[15px]">
                    {activeModule.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-20 rounded-[2rem] border border-[#0f2744]/8 bg-white p-6 shadow-[0_20px_50px_rgba(15,39,68,0.06)] sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
              {section.platform_tagline}
            </p>
            <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-tight text-[#0f2744]">
              {section.platform_heading}
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-neutral-600">
              {section.platform_description}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {section.modules.map((module, index) => (
              <motion.article
                key={`platform-${module.number}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: (index % 6) * 0.03 }}
                className="flex gap-4 rounded-[1.35rem] border border-[#0f2744]/8 bg-[#f8fafc] p-5 transition hover:border-[#f97316]/20 hover:bg-white hover:shadow-[0_12px_32px_rgba(15,39,68,0.06)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0f2744] text-[13px] font-bold text-white">
                  {module.number}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold leading-snug text-[#0f2744]">{module.title}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-neutral-600">{module.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

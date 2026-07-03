"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type JourneyStep = {
  year: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

type AboutJourneyTimelineProps = {
  steps: readonly JourneyStep[];
};

export default function AboutJourneyTimeline({
  steps,
}: AboutJourneyTimelineProps) {
  return (
    <div className="relative mt-12">
      <div className="absolute bottom-0 left-5 top-0 hidden w-px bg-white/10 md:block" />

      <div className="space-y-8 md:space-y-10">
        {steps.map((step, index) => {
          const reverse = index % 2 === 1;
          const usesContain = step.imageSrc.endsWith("laptop.png");

          return (
            <motion.article
              key={`${step.year}-${step.title}`}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative md:pl-16"
            >
              <div className="absolute left-0 top-6 hidden md:block">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-300/30 bg-[#f97316] text-[11px] font-bold tracking-[0.14em] text-white shadow-[0_10px_26px_rgba(249,115,22,0.35)]">
                  {step.year}
                </div>
              </div>

              <div
                className={cn(
                  "group overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-sm",
                  reverse ? "md:ml-12 lg:ml-20" : "md:mr-12 lg:mr-20"
                )}
              >
                <div
                  className={cn(
                    "grid gap-0 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]",
                    reverse && "lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]"
                  )}
                >
                  <div className={cn("relative", reverse && "lg:order-2")}>
                    <Image
                      src={step.imageSrc}
                      alt={step.imageAlt}
                      width={1400}
                      height={900}
                      className={cn(
                        "h-[260px] w-full transition-transform duration-700 group-hover:scale-[1.03] lg:h-full",
                        usesContain
                          ? "object-contain bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] p-6"
                          : "object-cover"
                      )}
                      unoptimized={usesContain}
                    />
                    {!usesContain ? (
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-[#0b1b31]/40 via-transparent to-transparent"
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>

                  <div
                    className={cn(
                      "flex flex-col justify-center p-6 sm:p-8 lg:p-10",
                      reverse && "lg:order-1"
                    )}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-300 md:hidden">
                      {step.year}
                    </p>
                    <h3 className="mt-2 text-[clamp(1.45rem,2.4vw,2rem)] font-bold leading-tight tracking-tight text-white md:mt-0">
                      {step.title}
                    </h3>
                    <p className="mt-5 max-w-xl text-[15px] leading-8 text-white/72">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

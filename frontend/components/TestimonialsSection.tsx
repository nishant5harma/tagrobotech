"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import {
  mergeTestimonialsSectionData,
  toTestimonialCards,
  type TestimonialsSectionData,
} from "@/lib/testimonials-section";
import type { Testimonial } from "@/lib/testimonials";

const AUTOPLAY_MS = 7000;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating
              ? "fill-[#f97316] text-[#f97316]"
              : "fill-neutral-200 text-neutral-200"
          }`}
        />
      ))}
    </div>
  );
}

function AuthorAvatar({ author }: { author: string }) {
  const initials = author
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0f2744] to-[#1a3a5c] text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(15,39,68,0.2)]">
      {initials}
    </div>
  );
}

function FeaturedTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-8 shadow-[0_24px_60px_rgba(15,39,68,0.1)] sm:p-10 lg:p-12">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#f97316]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-[#0f2744]/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#f97316]">
            <Quote className="h-7 w-7" />
          </div>
          {testimonial.highlight && (
            <span className="rounded-full border border-[#f97316]/20 bg-orange-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#ea580c]">
              {testimonial.highlight}
            </span>
          )}
        </div>

        <StarRating rating={testimonial.rating} />

        <blockquote className="mt-6 text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium leading-[1.65] tracking-tight text-[#0f2744]">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-neutral-100 pt-8">
          <div className="flex items-center gap-4">
            <AuthorAvatar author={testimonial.author} />
            <div>
              <p className="text-[15px] font-bold text-[#0f2744]">
                {testimonial.author}
              </p>
              <p className="mt-0.5 text-[13px] text-neutral-500">
                {testimonial.role}
              </p>
            </div>
          </div>

          {testimonial.companyLogo ? (
            <div className="flex h-12 items-center rounded-xl border border-neutral-100 bg-neutral-50 px-4">
              <Image
                src={testimonial.companyLogo}
                alt={testimonial.company}
                width={120}
                height={40}
                className="h-8 w-auto max-w-[120px] object-contain opacity-80"
              />
            </div>
          ) : (
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
              {testimonial.company}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function CompactTestimonialCard({
  testimonial,
  active,
  onClick,
}: {
  testimonial: Testimonial;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={`group w-full rounded-2xl border p-5 text-left transition-all duration-300 sm:p-6 ${
        active
          ? "border-[#f97316]/40 bg-white shadow-[0_12px_32px_rgba(15,39,68,0.08)]"
          : "border-neutral-200/80 bg-white/70 hover:border-[#0f2744]/15 hover:bg-white hover:shadow-md"
      }`}
    >
      <StarRating rating={testimonial.rating} />
      <p className="mt-4 line-clamp-3 text-[14px] leading-6 text-neutral-600">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3">
        <AuthorAvatar author={testimonial.author} />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-[#0f2744]">
            {testimonial.author}
          </p>
          <p className="truncate text-[12px] text-neutral-500">
            {testimonial.company}
          </p>
        </div>
      </div>
    </button>
  );
}

export default function TestimonialsSection({
  data,
}: {
  data?: TestimonialsSectionData | null;
}) {
  const section = mergeTestimonialsSectionData(data ?? null);
  const testimonials = toTestimonialCards(section);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > activeIndex ? 1 : -1);
      setActiveIndex(next);
    },
    [activeIndex],
  );

  const goPrev = useCallback(() => {
    goTo(activeIndex === 0 ? testimonials.length - 1 : activeIndex - 1);
  }, [activeIndex, goTo, testimonials.length]);

  const goNext = useCallback(() => {
    goTo(activeIndex === testimonials.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, goTo, testimonials.length]);

  useEffect(() => {
    const timer = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [goNext]);

  const activeTestimonial = testimonials[activeIndex];
  const compactItems = testimonials.filter(
    (_, index) => index !== activeIndex,
  ).slice(0, 3);

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[#f4f6fa] py-16 sm:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(249,115,22,0.08), transparent 35%), radial-gradient(circle at 80% 70%, rgba(15,39,68,0.06), transparent 40%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,39,68,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(15,39,68,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-[min(85%,1400px)]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-14">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#f97316]" aria-hidden="true" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                {section.tagline}
              </p>
            </div>

            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.08] tracking-tight text-[#0f2744]">
              {section.heading}{" "}
              <span className="text-[#f97316]">{section.heading_accent}</span>
            </h2>

            <p className="mt-5 max-w-lg text-[15px] leading-7 text-neutral-600 sm:text-[16px] sm:leading-8">
              {section.description}
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
              {section.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/80 bg-white/90 px-3 py-4 text-center shadow-sm backdrop-blur-sm sm:px-4 sm:py-5"
                >
                  <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-bold leading-none text-[#0f2744]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500 sm:text-[11px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous testimonial"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#0f2744] transition-colors hover:border-[#0f2744]/20 hover:bg-neutral-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next testimonial"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f97316] text-white transition-colors hover:bg-[#ea580c]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="ml-3 text-[13px] font-medium text-neutral-500">
                {activeIndex + 1} / {testimonials.length}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={activeTestimonial.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 48 : -48 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <FeaturedTestimonialCard testimonial={activeTestimonial} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 lg:hidden">
              <span className="text-[13px] font-medium text-neutral-500">
                {activeIndex + 1} / {testimonials.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous testimonial"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#0f2744]"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next testimonial"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f97316] text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 hidden gap-4 lg:grid lg:grid-cols-3">
          {compactItems.map((testimonial) => (
            <CompactTestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              active={false}
              onClick={() =>
                goTo(testimonials.findIndex((item) => item.id === testimonial.id))
              }
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-2 lg:mt-10">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`View testimonial from ${testimonial.company}`}
              aria-current={activeIndex === index ? "true" : undefined}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index
                  ? "w-8 bg-[#f97316]"
                  : "w-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

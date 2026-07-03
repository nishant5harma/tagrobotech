import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TrackingSolutionsShowcase from "@/components/TrackingSolutionsShowcase";
import { resolveCmsMediaUrl } from "@/lib/cms";
import {
  mergeTrackSectionData,
  toTrackingSolutionCards,
  type TrackSectionData,
} from "@/lib/track-section";

type TrackSectionProps = {
  data?: TrackSectionData | null;
};

export default function TrackSection({ data }: TrackSectionProps) {
  const track = mergeTrackSectionData(data ?? null);
  const solutions = toTrackingSolutionCards(track, resolveCmsMediaUrl);

  return (
    <section id="services" className="bg-[#f4f6fa]">
      <div className="relative overflow-hidden bg-[#0f2744] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 15%, rgba(249,115,22,0.35), transparent 22%), radial-gradient(circle at 10% 80%, rgba(255,255,255,0.08), transparent 20%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto w-[min(85%,1400px)] px-0 py-14 sm:py-16 lg:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300">
            {track.tagline}
          </p>

          <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
            <div>
              <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight">
                {track.heading}
              </h2>
              <p className="mt-5 max-w-2xl text-[16px] leading-8 text-white/75 sm:text-[17px]">
                {track.description}
              </p>
              <Link
                href={track.cta_button.link}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f97316] px-6 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#ea580c]"
              >
                {track.cta_button.text}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {track.stats.map((stat, index) => (
                <div
                  key={`${stat.label}-${index}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5"
                >
                  <p className="text-[1.75rem] font-bold leading-none sm:text-[2rem]">{stat.value}</p>
                  <p className="mt-2 text-[12px] leading-5 text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-[min(85%,1400px)] pb-16 pt-10 sm:pb-20 sm:pt-12">
        <TrackingSolutionsShowcase solutions={solutions} />
      </div>
    </section>
  );
}

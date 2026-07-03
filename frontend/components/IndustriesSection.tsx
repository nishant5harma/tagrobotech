import IndustriesCarousel from "@/components/IndustriesCarousel";
import {
  mergeTrustedIndustriesSectionData,
  resolveStatIcon,
  toTrustedIndustryCards,
  trustedIndustriesBackgroundSrc,
  type TrustedIndustriesSectionData,
} from "@/lib/trusted-industries";

type IndustriesSectionProps = {
  data?: TrustedIndustriesSectionData | null;
};

export default function IndustriesSection({ data }: IndustriesSectionProps) {
  const section = mergeTrustedIndustriesSectionData(data ?? null);
  const industries = toTrustedIndustryCards(section);
  const backgroundSrc = trustedIndustriesBackgroundSrc(section);

  return (
    <section id="industries" className="relative overflow-hidden">
      <div className="relative bg-gradient-to-br from-[#081628] via-[#0f2744] to-[#0a1f38]">
        <img
          src={backgroundSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.14] mix-blend-luminosity"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: [
              "radial-gradient(ellipse 80% 60% at 8% 15%, rgba(249,115,22,0.22), transparent 55%)",
              "radial-gradient(ellipse 70% 50% at 92% 80%, rgba(56,189,248,0.1), transparent 50%)",
              "radial-gradient(ellipse 50% 40% at 50% 100%, rgba(15,39,68,0.9), transparent 70%)",
            ].join(", "),
          }}
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-[#f97316]/10 blur-[100px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full bg-sky-500/10 blur-[90px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-[min(85%,1400px)] px-0 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <h2 className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-white">
              {section.heading}{" "}
              <span className="bg-gradient-to-r from-[#fdba74] to-[#f97316] bg-clip-text text-transparent">
                {section.heading_accent}
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/70 sm:text-[16px] sm:leading-8">
              {section.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {section.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-white/80 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-14 lg:mt-16">
            <IndustriesCarousel
              industries={industries}
              featuredLabel={section.featured_label}
            />
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-[#081628]/60 backdrop-blur-sm">
          <div className="mx-auto grid w-[min(85%,1400px)] grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
            {section.stats.map((stat) => {
              const Icon = resolveStatIcon(stat.icon);

              return (
                <div
                  key={stat.label}
                  className="group flex flex-col items-center bg-[#0a1f38]/80 px-6 py-10 text-center backdrop-blur-md transition-colors hover:bg-[#0f2744]/90 sm:px-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f97316]/15 text-[#f97316] transition-colors group-hover:bg-[#f97316]/25">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-5 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none tracking-tight text-white">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/55">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

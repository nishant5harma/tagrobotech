"use client";

import type { Application } from "@splinetool/runtime";
import { Spotlight } from "@/components/ui/spotlight";
import { SplineScene } from "@/components/ui/splite";
import { resolveCmsMediaUrl } from "@/lib/cms";
import { mergeAboutSectionData, type AboutSectionData } from "@/lib/about-section";

type RobotSplineSectionProps = {
  data?: AboutSectionData | null;
};

function prepareRobotScene(app: Application) {
  app.setBackgroundColor("#ffffff");
}

export default function RobotSplineSection({ data }: RobotSplineSectionProps) {
  const about = mergeAboutSectionData(data ?? null);
  const imageSrc =
    about.visual_type === "image" && about.image_url
      ? resolveCmsMediaUrl(about.image_url)
      : null;
  const splineScene =
    about.visual_type === "spline" && about.spline_scene_url ? about.spline_scene_url : null;

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden border-t border-neutral-100 bg-white"
    >
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#f97316"
      />

      <div className="relative flex min-h-[min(600px,85vh)] w-full flex-col lg:flex-row lg:items-stretch">
        <div className="relative z-10 flex flex-1 flex-col justify-center px-5 py-12 sm:px-8 sm:py-14 lg:max-w-[50%] lg:px-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))] lg:py-16 xl:pr-16">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-[#f97316]" aria-hidden="true" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500 sm:text-[12px]">
              {about.tagline}
            </p>
          </div>

          <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.1] tracking-tight text-[#0f2744]">
            {about.heading}{" "}
            <span className="text-[#f97316]">{about.heading_accent}</span>
          </h2>

          <div className="mt-6 max-w-xl space-y-4 text-[15px] leading-7 text-neutral-600 sm:text-[16px] sm:leading-8">
            {about.paragraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="relative min-h-[360px] flex-1 sm:min-h-[420px] lg:min-h-0">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={about.heading_accent || "About Tag RoBo Tech"}
              className="h-full w-full object-contain object-center bg-white p-6"
            />
          ) : splineScene ? (
            <SplineScene
              scene={splineScene}
              className="h-full w-full bg-white [&_canvas]:bg-white"
              onLoad={prepareRobotScene}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

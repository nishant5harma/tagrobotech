import Image from "next/image";
import CmsReusableSections from "@/components/CmsReusableSections";
import type { CmsPageResponse } from "@/lib/cms";

type CmsEditorialPageExperienceProps = {
  page: CmsPageResponse;
};

function formatDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function CmsEditorialPageExperience({ page }: CmsEditorialPageExperienceProps) {
  const isBlog = page.page.page_type === "blog";
  const eyebrow = isBlog ? "Blog" : "Case Study";
  const formattedDate = formatDate(page.page.published_at);

  return (
    <main className="bg-white pt-[108px]">
      <section className="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]">
        <div className="mx-auto w-[min(92%,1000px)] px-4 py-16 sm:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-[#0f2744]">
            {page.page.title}
          </h1>
          {page.page.excerpt ? (
            <p className="mt-5 max-w-3xl text-[16px] leading-8 text-neutral-600">
              {page.page.excerpt}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500">
            {formattedDate ? <span>{formattedDate}</span> : null}
            {page.page.author_name ? <span>By {page.page.author_name}</span> : null}
            {page.page.client_name ? <span>Client: {page.page.client_name}</span> : null}
            {page.page.industry ? <span>Industry: {page.page.industry}</span> : null}
          </div>

          {page.page.featured_image_url ? (
            <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-[2rem] bg-[#f8fafc] shadow-[0_20px_60px_rgba(15,39,68,0.1)]">
              <Image
                src={page.page.featured_image_url}
                alt={page.page.featured_image_alt || page.page.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ) : null}
        </div>
      </section>

      <CmsReusableSections
        sections={page.sections}
        pageContext={{ pageType: page.page.page_type, pageTitle: page.page.title }}
      />
    </main>
  );
}

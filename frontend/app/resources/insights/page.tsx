import type { Metadata } from "next";
import Link from "next/link";
import CmsImage from "@/components/CmsImage";
import Footer from "@/components/Footer";
import SiteNavbar from "@/components/SiteNavbar";
import { getPublishedContentList, resolveCmsMediaUrl, type CmsContentListItem } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Insights | Blog & Case Studies | Tag RoBo Tech",
  description:
    "Browse Tag RoBo Tech blogs and case studies on RFID asset tracking inventory control FAR verification and enterprise operations.",
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

function InsightCard({
  item,
  basePath,
  badge,
}: {
  item: CmsContentListItem;
  basePath: "/blog" | "/case-studies";
  badge: string;
}) {
  const formattedDate = formatDate(item.published_at);

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-[#0f2744]/8 bg-white shadow-[0_16px_50px_rgba(15,39,68,0.08)]">
      <Link href={`${basePath}/${item.slug}`} className="block">
        <div className="relative aspect-[16/9] bg-[#f8fafc]">
          {item.featured_image_url ? (
            <CmsImage
              src={resolveCmsMediaUrl(item.featured_image_url)}
              alt={item.featured_image_alt || item.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              No image
            </div>
          )}
        </div>
      </Link>
      <div className="space-y-3 p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
          <span className="font-semibold uppercase tracking-[0.14em] text-[#f97316]">{badge}</span>
          {formattedDate ? <span>{formattedDate}</span> : null}
        </div>
        <h3 className="text-[1.15rem] font-semibold leading-snug text-[#0f2744]">
          <Link href={`${basePath}/${item.slug}`} className="hover:text-[#f97316]">
            {item.title}
          </Link>
        </h3>
        {item.excerpt ? (
          <p className="text-[14px] leading-7 text-neutral-600 line-clamp-3">{item.excerpt}</p>
        ) : null}
      </div>
    </article>
  );
}

function InsightSection({
  title,
  description,
  href,
  linkLabel,
  items,
  basePath,
  badge,
}: {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  items: CmsContentListItem[];
  basePath: "/blog" | "/case-studies";
  badge: string;
}) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto w-[min(92%,1180px)] px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(1.6rem,3vw,2.25rem)] font-bold tracking-tight text-[#0f2744]">
              {title}
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-neutral-600">{description}</p>
          </div>
          <Link
            href={href}
            className="inline-flex items-center rounded-full border border-[#0f2744]/15 px-5 py-2.5 text-sm font-semibold text-[#0f2744] transition hover:border-[#f97316] hover:text-[#f97316]"
          >
            {linkLabel}
          </Link>
        </div>

        <div className="mt-10">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#0f2744]/10 px-6 py-12 text-center">
              <p className="text-sm text-neutral-500">No entries published yet.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <InsightCard key={item.id} item={item} basePath={basePath} badge={badge} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default async function ResourcesInsightsPage() {
  const [blogs, caseStudies] = await Promise.all([
    getPublishedContentList("blog", { limit: 12 }),
    getPublishedContentList("case_study", { limit: 12 }),
  ]);

  return (
    <>
      <SiteNavbar />
      <main className="bg-white pt-[108px]">
        <section className="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]">
          <div className="mx-auto w-[min(92%,1180px)] px-4 py-16 sm:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
              Learn
            </p>
            <h1 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-[#0f2744]">
              Blog &amp; Case Studies
            </h1>
            <p className="mt-5 max-w-3xl text-[16px] leading-8 text-neutral-600">
              Explore practical articles and real deployment stories from Tag RoBo Tech across
              RFID asset tracking inventory control FAR verification and enterprise operations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="inline-flex rounded-full bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
              >
                View all blogs
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex rounded-full border border-[#0f2744]/15 px-5 py-2.5 text-sm font-semibold text-[#0f2744] transition hover:border-[#f97316] hover:text-[#f97316]"
              >
                View all case studies
              </Link>
            </div>
          </div>
        </section>

        <InsightSection
          title="Latest from the Blog"
          description="Guides updates and opinions on asset operations tracking technology and audit readiness."
          href="/blog"
          linkLabel="All blogs"
          items={blogs}
          basePath="/blog"
          badge="Blog"
        />

        <div className="border-t border-neutral-100" />

        <InsightSection
          title="Case Studies"
          description="See how organisations improve visibility compliance and efficiency with Tag RoBo Tech."
          href="/case-studies"
          linkLabel="All case studies"
          items={caseStudies}
          basePath="/case-studies"
          badge="Case Study"
        />
      </main>
      <Footer />
    </>
  );
}

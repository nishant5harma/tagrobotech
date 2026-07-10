import CmsImage from "@/components/CmsImage";
import Link from "next/link";
import { resolveCmsMediaUrl, type CmsContentListItem } from "@/lib/cms";

type ContentArchivePageProps = {
  title: string;
  description: string;
  eyebrow: string;
  items: CmsContentListItem[];
  basePath: "/blog" | "/case-studies";
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

export default function ContentArchivePage({
  title,
  description,
  eyebrow,
  items,
  basePath,
}: ContentArchivePageProps) {
  return (
    <main className="bg-white pt-[108px]">
      <section className="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]">
        <div className="mx-auto w-[min(92%,1180px)] px-4 py-16 sm:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-[#0f2744]">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-[16px] leading-8 text-neutral-600">{description}</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto w-[min(92%,1180px)] px-4">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#0f2744]/10 px-6 py-12 text-center">
              <p className="text-sm text-neutral-500">No entries published yet.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => {
                const formattedDate = formatDate(item.published_at);

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[1.5rem] border border-[#0f2744]/8 bg-white shadow-[0_16px_50px_rgba(15,39,68,0.08)]"
                  >
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

                    <div className="space-y-4 p-6">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                        {formattedDate ? <span>{formattedDate}</span> : null}
                        {item.author_name ? <span>{item.author_name}</span> : null}
                        {item.client_name ? <span>{item.client_name}</span> : null}
                        {item.industry ? <span>{item.industry}</span> : null}
                      </div>

                      <div>
                        <Link href={`${basePath}/${item.slug}`}>
                          <h2 className="text-[1.25rem] font-bold tracking-tight text-[#0f2744] transition hover:text-[#f97316]">
                            {item.title}
                          </h2>
                        </Link>
                        {item.excerpt ? (
                          <p className="mt-3 text-[14px] leading-7 text-neutral-600">{item.excerpt}</p>
                        ) : null}
                      </div>

                      <Link
                        href={`${basePath}/${item.slug}`}
                        className="inline-flex items-center text-sm font-semibold text-[#f97316] transition hover:text-[#ea580c]"
                      >
                        Read more
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  getFrontendPreviewUrl,
  getReusableComponent,
} from "@/lib/components-registry";

type ComponentDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ComponentDetailPage({ params }: ComponentDetailPageProps) {
  const { slug } = await params;
  const component = getReusableComponent(slug);

  if (!component) {
    notFound();
  }

  const previewUrl = getFrontendPreviewUrl(component.previewPath);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Link
        href="/dashboard/components"
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to components
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {component.label}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">{component.description}</p>
          <p className="mt-3 text-xs text-muted">
            Section type: <code className="text-foreground">{component.sectionType}</code>
          </p>
        </div>

        <a
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-[var(--orange)]/40"
        >
          Open live preview
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-semibold text-foreground">Use on dynamic pages</h2>
        <ol className="mt-4 space-y-2 text-sm leading-7 text-muted">
          <li>1. Create pages like <strong className="text-foreground">Service 1</strong> and <strong className="text-foreground">Service 2</strong> in Pages.</li>
          <li>2. Set page type to one of: {component.usedOn.join(", ")}.</li>
          <li>3. In Page sections, add <strong className="text-foreground">{component.label}</strong>.</li>
          <li>4. Save different content on each page. The UI stays the same.</li>
        </ol>
        <Link
          href="/dashboard/pages"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--orange)]"
        >
          Go to Pages
        </Link>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="font-semibold text-foreground">Component preview</h2>
          <p className="text-sm text-muted">
            This is the shared UI. Page-specific text, buttons, stats, and images are edited per page.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <iframe
            title={`${component.label} preview`}
            src={previewUrl}
            className="h-[760px] w-full border-0"
          />
        </div>
      </section>
    </div>
  );
}

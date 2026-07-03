import Link from "next/link";
import { ArrowLeft, ArrowRight, Boxes } from "lucide-react";
import { REUSABLE_COMPONENTS } from "@/lib/components-registry";

export default function ComponentsHubPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Components</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Reusable UI blocks for dynamic pages. Create multiple pages with the same layout, then
          edit each page&apos;s content from the backend.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-semibold text-foreground">How it works</h2>
        <ol className="mt-4 space-y-2 text-sm leading-7 text-muted">
          <li>1. Pick a component here and preview the UI.</li>
          <li>2. Go to <strong className="text-foreground">Pages</strong> and create pages like Service 1 and Service 2.</li>
          <li>3. Set page type to <strong className="text-foreground">Service</strong>, <strong className="text-foreground">Solution</strong>, <strong className="text-foreground">Feature</strong>, or <strong className="text-foreground">Resource</strong>.</li>
          <li>4. Add the same component to each page and edit the content separately.</li>
        </ol>
      </section>

      <div className="grid gap-4">
        {REUSABLE_COMPONENTS.map((component) => (
          <Link
            key={component.slug}
            href={`/dashboard/components/${component.slug}`}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-[var(--orange)]/40 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--orange)]">
              <Boxes className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-foreground">{component.label}</p>
                <code className="rounded-md bg-[var(--surface-muted)] px-2 py-0.5 text-xs text-muted">
                  {component.sectionType}
                </code>
              </div>
              <p className="mt-1 text-sm text-muted">{component.description}</p>
              <p className="mt-2 text-xs text-muted">
                Works on: {component.usedOn.join(", ")}
              </p>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}

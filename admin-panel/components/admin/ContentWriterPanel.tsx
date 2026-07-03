"use client";

import { FilePlus2 } from "lucide-react";
import ArticleBodySectionEditor from "@/components/admin/sections/ArticleBodySectionEditor";
import type { PageSection } from "@/lib/api";

type ContentWriterPanelProps = {
  pageType: "blog" | "case_study";
  section: PageSection | null;
  creating: boolean;
  onCreate: () => Promise<void>;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
};

export default function ContentWriterPanel({
  pageType,
  section,
  creating,
  onCreate,
  onSave,
}: ContentWriterPanelProps) {
  const isBlog = pageType === "blog";

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--orange)]">
          {isBlog ? "Blog Writer" : "Case Study Writer"}
        </p>
        <h2 className="mt-2 text-lg font-semibold text-foreground">
          {isBlog ? "Write the article body" : "Write the case study narrative"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {isBlog
            ? "Use TinyMCE to draft the post, structure headings, and add formatted content."
            : "Write the case study story, solution details, outcomes, and supporting narrative."}
        </p>
      </div>

      {section ? (
        <ArticleBodySectionEditor
          initialData={section.data}
          isActive={Boolean(section.is_active)}
          onIsActiveChange={() => {}}
          onSave={onSave}
          headingLabel={isBlog ? "Article heading (optional)" : "Case study heading (optional)"}
          showVisibilityToggle={false}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-[var(--surface-muted)]/40 p-6">
          <p className="text-sm text-muted">
            No primary content section exists yet. Create one to start writing.
          </p>
          <button
            type="button"
            onClick={onCreate}
            disabled={creating}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--orange)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#d94e1f] disabled:opacity-50"
          >
            <FilePlus2 className="h-4 w-4" />
            {creating ? "Creating..." : "Create writer section"}
          </button>
        </div>
      )}
    </section>
  );
}

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Layers, Plus, Save } from "lucide-react";
import ContentWriterPanel from "@/components/admin/ContentWriterPanel";
import MediaPicker from "@/components/admin/MediaPicker";
import SortableSectionsList from "@/components/admin/SortableSectionsList";
import SectionTypePicker from "@/components/admin/SectionTypePicker";
import PageSeoEditor from "@/components/admin/PageSeoEditor";
import PageStatusBadge from "@/components/admin/PageStatusBadge";
import {
  createSection,
  deleteSection,
  getPage,
  updatePage,
  updatePageSeo,
  reorderSections,
  updateSection,
  type PageRow,
  type PageSection,
  type PageSeo,
} from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

export default function EditPagePage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const [page, setPage] = useState<PageRow | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [seo, setSeo] = useState<PageSeo | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("draft");
  const [pageType, setPageType] = useState("page");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImageId, setFeaturedImageId] = useState<string | null>(null);
  const [publishedAt, setPublishedAt] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [clientName, setClientName] = useState("");
  const [industry, setIndustry] = useState("");
  const [newSectionType, setNewSectionType] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [savingPage, setSavingPage] = useState(false);
  const [addingSection, setAddingSection] = useState(false);
  const [creatingWriterSection, setCreatingWriterSection] = useState(false);
  const [reorderingSections, setReorderingSections] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadPage() {
    const token = getStoredToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const data = await getPage(token, pageId);
    setPage(data.page);
    setSections(data.sections);
    setSeo(data.seo);
    setTitle(data.page.title);
    setSlug(data.page.slug);
    setStatus(data.page.status);
    setPageType(data.page.page_type);
    setExcerpt(data.page.excerpt ?? "");
    setFeaturedImageId(data.page.featured_image_id ?? null);
    setPublishedAt(data.page.published_at ? data.page.published_at.slice(0, 16) : "");
    setAuthorName(data.page.author_name ?? "");
    setClientName(data.page.client_name ?? "");
    setIndustry(data.page.industry ?? "");
  }

  useEffect(() => {
    loadPage()
      .catch(() => setError("Failed to load page"))
      .finally(() => setLoading(false));
  }, [pageId]);

  async function handleSavePage(event: FormEvent) {
    event.preventDefault();
    setSavingPage(true);
    setError("");
    setMessage("");

    const token = getStoredToken();
    if (!token) return;

    try {
      const { page: updated } = await updatePage(token, pageId, {
        title,
        slug,
        status,
        page_type: pageType,
        excerpt,
        featured_image_id: featuredImageId,
        published_at: publishedAt || null,
        author_name: authorName,
        client_name: clientName,
        industry,
      });
      setPage(updated);
      setMessage("Page settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save page");
    } finally {
      setSavingPage(false);
    }
  }

  async function handleAddSection() {
    setAddingSection(true);
    setError("");

    const token = getStoredToken();
    if (!token) return;

    try {
      const { section } = await createSection(token, pageId, {
        section_type: newSectionType,
      });
      setSections((prev) => [...prev, section]);
      setMessage(`${newSectionType} section added.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add section");
    } finally {
      setAddingSection(false);
    }
  }

  async function handleCreateWriterSection() {
    setCreatingWriterSection(true);
    setError("");

    const token = getStoredToken();
    if (!token) return;

    try {
      const { section } = await createSection(token, pageId, {
        section_type: "article_body",
      });
      setSections((prev) => [...prev, section]);
      setMessage("Writer section created.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create writer section");
    } finally {
      setCreatingWriterSection(false);
    }
  }

  async function handleReorderSections(reordered: PageSection[]) {
    const previous = sections;
    setSections(reordered);
    setReorderingSections(true);
    setError("");

    const token = getStoredToken();
    if (!token) return;

    try {
      const { sections: updated } = await reorderSections(
        token,
        pageId,
        reordered.map((section) => section.id)
      );
      setSections(updated);
      setMessage("Section order saved.");
    } catch (err) {
      setSections(previous);
      setError(err instanceof Error ? err.message : "Failed to reorder sections");
    } finally {
      setReorderingSections(false);
    }
  }

  async function handleSaveSection(
    sectionId: string,
    data: Record<string, unknown>,
    isActive: boolean
  ) {
    const token = getStoredToken();
    if (!token) return;

    const { section } = await updateSection(token, pageId, sectionId, { data, is_active: isActive });
    setSections((prev) => prev.map((s) => (s.id === sectionId ? section : s)));
    setMessage("Section saved.");
  }

  async function handleSaveSeo(payload: Parameters<typeof updatePageSeo>[2]) {
    const token = getStoredToken();
    if (!token) return;

    const { seo: updated } = await updatePageSeo(token, pageId, payload);
    setSeo(updated);
    setMessage("SEO settings saved.");
  }

  async function handleDeleteSection(sectionId: string) {
    if (!confirm("Delete this section?")) return;

    const token = getStoredToken();
    if (!token) return;

    await deleteSection(token, pageId, sectionId);
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setMessage("Section deleted.");
  }

  const publicUrl = useMemo(() => {
    const cleanSlug = slug.replace(/^\//, "");
    if (pageType === "resource") return `/resources/${cleanSlug}`;
    if (pageType === "feature") return `/features/${cleanSlug}`;
    if (pageType === "solution") return `/solutions/${cleanSlug}`;
    if (pageType === "service") return `/services/${cleanSlug}`;
    if (pageType === "blog") return `/blog/${cleanSlug}`;
    if (pageType === "case_study") return `/case-studies/${cleanSlug}`;
    return slug === "/" ? "/" : `/${cleanSlug}`;
  }, [pageType, slug]);

  const isBlog = pageType === "blog";
  const isCaseStudy = pageType === "case_study";
  const showEditorialFields = isBlog || isCaseStudy;
  const articleBodySection =
    sections.find((section) => section.section_type === "article_body") ?? null;

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--orange)]/30 border-t-[var(--orange)]" />
      </div>
    );
  }

  if (!page) {
    return <p className="text-sm text-muted">Page not found.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link
        href="/dashboard/pages"
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to pages
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <PageStatusBadge status={status} />
            <span className="text-xs capitalize text-muted">{pageType}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{page.title}</h1>
          <p className="mt-1 text-sm text-muted">Edit metadata, SEO, and page sections.</p>
        </div>
      </div>

      {message ? (
        <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-[var(--error-border)] bg-[var(--error-bg)] px-4 py-3 text-sm text-[var(--error-text)]">
          {error}
        </p>
      ) : null}

      {/* Page settings */}
      <form
        onSubmit={handleSavePage}
        className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <h2 className="font-semibold text-foreground">Page settings</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className="block text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Page type</label>
            <select
              value={pageType}
              onChange={(e) => setPageType(e.target.value)}
              className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
            >
              <option value="page">Page</option>
              <option value="resource">Resource</option>
              <option value="feature">Feature</option>
              <option value="solution">Solution</option>
              <option value="service">Service</option>
              <option value="blog">Blog</option>
              <option value="case_study">Case Study</option>
            </select>
            {slug ? (
              <p className="text-xs text-muted">
                Public URL: <code className="text-foreground">{publicUrl}</code>
              </p>
            ) : null}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="block text-sm font-medium">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
              placeholder="Short summary used for archive cards and search snippets."
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="block text-sm font-medium">Featured image</label>
            <MediaPicker
              value={featuredImageId}
              onChange={(mediaId) => setFeaturedImageId(mediaId)}
              accept="image"
              label="Pick featured image"
              defaultGalleryOpen={false}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Published at</label>
            <input
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
            />
          </div>
          {showEditorialFields ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                {isBlog ? "Author name" : "Client name"}
              </label>
              <input
                value={isBlog ? authorName : clientName}
                onChange={(e) => (isBlog ? setAuthorName(e.target.value) : setClientName(e.target.value))}
                className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
                placeholder={isBlog ? "e.g. Tag RoBo Tech Team" : "e.g. Leading Manufacturer"}
              />
            </div>
          ) : null}
          {isCaseStudy ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Industry</label>
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
                placeholder="e.g. Manufacturing"
              />
            </div>
          ) : null}
          {isBlog ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Industry / topic</label>
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
                placeholder="e.g. RFID, Asset Tracking"
              />
            </div>
          ) : null}
          {!showEditorialFields ? (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Author name</label>
                <input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Client name</label>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Industry</label>
                <input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-2.5 text-sm"
                />
              </div>
            </>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={savingPage}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-[#252847]"
        >
          <Save className="h-4 w-4" />
          {savingPage ? "Saving..." : "Save settings"}
        </button>
      </form>

      <PageSeoEditor
        pageTitle={title}
        pageSlug={slug}
        seo={seo}
        onSave={handleSaveSeo}
      />

      {showEditorialFields ? (
        <ContentWriterPanel
          pageType={pageType}
          section={articleBodySection}
          creating={creatingWriterSection}
          onCreate={handleCreateWriterSection}
          onSave={(data, isActive) =>
            articleBodySection
              ? handleSaveSection(articleBodySection.id, data, isActive)
              : Promise.resolve()
          }
        />
      ) : null}

      {/* Sections */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[var(--orange)]" />
            <h2 className="text-lg font-semibold text-foreground">Page sections</h2>
            <span className="text-sm text-muted">({sections.length})</span>
            {reorderingSections ? (
              <span className="text-xs text-muted">Saving order…</span>
            ) : null}
          </div>
          <p className="w-full text-xs text-muted sm:w-auto">
            Drag the grip handle to reorder sections.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-border bg-[var(--surface-muted)]/40 p-4">
          <div className="min-w-[200px] flex-1 space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-muted">
              Add section
            </label>
            <SectionTypePicker value={newSectionType} onChange={setNewSectionType} />
          </div>
          <button
            type="button"
            onClick={handleAddSection}
            disabled={addingSection}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--orange)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#d94e1f] disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {addingSection ? "Adding..." : "Add section"}
          </button>
        </div>

        {sections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
            <p className="text-sm text-muted">No sections yet. Add a hero, FAQ, or other block above.</p>
          </div>
        ) : (
          <SortableSectionsList
            sections={sections}
            onReorder={handleReorderSections}
            onSave={handleSaveSection}
            onDelete={handleDeleteSection}
          />
        )}
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Pencil, Plus } from "lucide-react";
import PageStatusBadge from "@/components/admin/PageStatusBadge";
import { getPages, type PageRow } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

export default function PagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    getPages(token)
      .then((data) => setPages(data.pages))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Pages</h1>
          <p className="mt-1 text-sm text-muted">Create and manage website pages.</p>
        </div>
        <Link
          href="/dashboard/pages/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--orange)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#d94e1f]"
        >
          <Plus className="h-4 w-4" />
          Add Page
        </Link>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[var(--orange)]" />
            <h2 className="font-semibold text-foreground">All Pages</h2>
          </div>
          <span className="text-sm text-muted">{pages.length} total</span>
        </div>

        {loading ? (
          <p className="px-6 py-8 text-sm text-muted">Loading pages...</p>
        ) : pages.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-muted">No pages yet.</p>
            <Link
              href="/dashboard/pages/new"
              className="mt-3 inline-block text-sm font-medium text-[var(--orange)]"
            >
              Create your first page →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-6 py-3.5 font-medium">Title</th>
                  <th className="px-6 py-3.5 font-medium">Slug</th>
                  <th className="px-6 py-3.5 font-medium">Type</th>
                  <th className="px-6 py-3.5 font-medium">Status</th>
                  <th className="px-6 py-3.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr
                    key={page.id}
                    className="border-t border-border transition hover:bg-[var(--surface-muted)]/50"
                  >
                    <td className="px-6 py-3.5 font-medium text-foreground">{page.title}</td>
                    <td className="px-6 py-3.5">
                      <code className="rounded-md bg-[var(--surface-muted)] px-2 py-0.5 text-xs text-muted">
                        {page.slug}
                      </code>
                    </td>
                    <td className="px-6 py-3.5 capitalize text-muted">{page.page_type}</td>
                    <td className="px-6 py-3.5">
                      <PageStatusBadge status={page.status} />
                    </td>
                    <td className="px-6 py-3.5">
                      <Link
                        href={`/dashboard/pages/${page.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--orange)] hover:text-[var(--orange)]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

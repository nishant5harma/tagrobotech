"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MegaMenuEditor from "@/components/admin/MegaMenuEditor";
import { getMegaMenu, getPages, updateMegaMenu } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";
import { normalizeMegaMenuData, type MegaMenuKind } from "@/lib/mega-menu";

const MENU_CONFIG: Record<
  MegaMenuKind,
  { title: string; linkPrefix: string; pageTypes: string[] }
> = {
  resources: {
    title: "Resources mega menu",
    linkPrefix: "/resources",
    pageTypes: ["resource"],
  },
  features: {
    title: "Features mega menu",
    linkPrefix: "/features",
    pageTypes: ["feature", "resource"],
  },
  solutions: {
    title: "Solutions mega menu",
    linkPrefix: "/solutions",
    pageTypes: ["solution", "resource"],
  },
};

export default function MegaMenuPage({ kind }: { kind: MegaMenuKind }) {
  const config = MENU_CONFIG[kind];
  const [menu, setMenu] = useState<Record<string, unknown> | null>(null);
  const [linkedPages, setLinkedPages] = useState<Array<{ title: string; slug: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    Promise.all([getMegaMenu(token, kind), getPages(token)])
      .then(([menuResult, pagesResult]) => {
        setMenu(menuResult.menu);
        setLinkedPages(
          pagesResult.pages
            .filter((page) => config.pageTypes.includes(page.page_type))
            .map((page) => ({
              title: `${page.title}${page.status === "published" ? "" : " (draft)"}`,
              slug: page.slug,
            }))
        );
      })
      .catch(() => setError("Failed to load navigation settings"))
      .finally(() => setLoading(false));
  }, [kind, config.pageTypes]);

  async function handleSave(data: Record<string, unknown>) {
    const token = getStoredToken();
    if (!token) return;

    setError("");
    setMessage("");

    const result = await updateMegaMenu(token, kind, data);
    setMenu(result.menu);
    setMessage(`${config.title} saved.`);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--orange)]/30 border-t-[var(--orange)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link
        href="/dashboard/navigation"
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to navigation
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{config.title}</h1>
        <p className="mt-1 text-sm text-muted">
          Configure the {kind} dropdown in the site navbar. Link items to CMS pages or custom URLs.
        </p>
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

      <MegaMenuEditor
        kind={kind}
        title={config.title}
        linkPrefix={config.linkPrefix}
        pageTypes={config.pageTypes}
        initialData={menu ?? normalizeMegaMenuData(null, kind)}
        linkedPages={linkedPages}
        onSave={handleSave}
      />
    </div>
  );
}

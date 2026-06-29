"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createPage } from "@/lib/api";
import { getStoredToken } from "@/lib/auth";

function slugify(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewPagePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const token = getStoredToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const { page } = await createPage(token, { title, slug });
      router.push(`/dashboard/pages/${page.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create page");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/dashboard/pages"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to pages
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Add Page</h1>
        <p className="mt-1 text-sm text-muted">Enter a name and URL slug for the new page.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-foreground">
            Page name
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. About Us"
            className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="block text-sm font-medium text-foreground">
            Slug
          </label>
          <input
            id="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="e.g. about-us"
            className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-3 text-sm"
          />
          <p className="text-xs text-muted">URL path — use / for homepage only.</p>
        </div>

        {error ? (
          <p className="rounded-xl border border-[var(--error-border)] bg-[var(--error-bg)] px-4 py-3 text-sm text-[var(--error-text)]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[var(--orange)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#d94e1f] disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create page"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Image,
  Layers,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import PageStatusBadge from "@/components/admin/PageStatusBadge";
import {
  getDashboardStats,
  getPages,
  type AuthUser,
  type DashboardStats,
  type PageRow,
} from "@/lib/api";
import { getStoredToken, getStoredUser } from "@/lib/auth";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser<AuthUser>();

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    Promise.all([getDashboardStats(token), getPages(token)])
      .then(([dashboardStats, pagesData]) => {
        setStats(dashboardStats);
        setPages(pagesData.pages);
      })
      .finally(() => setLoading(false));
  }, []);

  const publishedCount = pages.filter((p) => p.status === "published").length;
  const draftCount = pages.filter((p) => p.status === "draft").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--orange)]/30 border-t-[var(--orange)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero banner */}
      <section className="dashboard-hero login-fade-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2b2e5d] via-[#353a6b] to-[#1e213f] p-6 text-white shadow-lg shadow-[#2b2e5d]/20 sm:p-8">
        <div
          aria-hidden
          className="dashboard-hero-glow dash-float pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#f15a24]/20 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-white/5 blur-2xl"
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/10">
              <Sparkles className="h-3.5 w-3.5 text-[#f15a24]" />
              Content overview
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
              {getGreeting()}
              {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">
              Your CMS is running smoothly. {publishedCount} pages live, {draftCount} in
              draft — keep building.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/10 backdrop-blur-sm">
              <p className="text-[11px] uppercase tracking-wider text-white/50">Published</p>
              <p className="mt-0.5 text-2xl font-semibold">{publishedCount}</p>
            </div>
            <div className="rounded-xl bg-[#f15a24]/20 px-4 py-3 ring-1 ring-[#f15a24]/30 backdrop-blur-sm dark:bg-[#c44f1f]/15 dark:ring-[#c44f1f]/20">
              <p className="text-[11px] uppercase tracking-wider text-white/60">Drafts</p>
              <p className="mt-0.5 text-2xl font-semibold">{draftCount}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pages" value={stats?.pages ?? 0} icon={FileText} accent="navy" delay={50} />
        <StatCard label="Sections" value={stats?.sections ?? 0} icon={Layers} accent="orange" delay={100} />
        <StatCard label="Media" value={stats?.media ?? 0} icon={Image} accent="violet" delay={150} />
        <StatCard label="SEO Records" value={stats?.seo ?? 0} icon={Search} accent="teal" delay={200} />
      </section>

      {/* Recent pages */}
      <section
        className="login-fade-up overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
        style={{ animationDelay: "0.15s" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[var(--orange-soft)] p-2 text-[var(--orange)]">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Recent Pages</h2>
              <p className="text-xs text-muted">Latest content across your site</p>
            </div>
          </div>
          <Link
            href="/dashboard/pages"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--orange)] transition hover:gap-2.5"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-6 py-3.5 font-medium">Title</th>
                <th className="px-6 py-3.5 font-medium">Slug</th>
                <th className="px-6 py-3.5 font-medium">Type</th>
                <th className="px-6 py-3.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {pages.slice(0, 5).map((page, i) => (
                <tr
                  key={page.id}
                  className="border-t border-border transition hover:bg-[var(--surface-muted)]/60"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-xs font-semibold text-[var(--navy)] dark:text-[var(--orange)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-medium text-foreground">{page.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <code className="rounded-md bg-[var(--surface-muted)] px-2 py-0.5 text-xs text-muted">
                      {page.slug}
                    </code>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex rounded-md bg-[#e8eaf5] px-2 py-0.5 text-xs font-medium capitalize text-[#2b2e5d] dark:bg-[#252847] dark:text-[#a8acd4]">
                      {page.page_type}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <PageStatusBadge status={page.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft, Menu } from "lucide-react";

const MENUS = [
  {
    title: "Resources",
    description: "Guides, case studies, and insights mega menu",
    href: "/dashboard/navigation/resources",
  },
  {
    title: "Features",
    description: "Platform capabilities and product features mega menu",
    href: "/dashboard/navigation/features",
  },
  {
    title: "Solutions",
    description: "Industry, use case, and role-based solutions mega menu",
    href: "/dashboard/navigation/solutions",
  },
];

export default function NavigationHubPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Navigation</h1>
        <p className="mt-1 text-sm text-muted">
          Edit the three mega menus shown in the site navbar: Resources, Features, and Solutions.
        </p>
      </div>

      <div className="grid gap-4">
        {MENUS.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-[var(--orange)]/40 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--orange)]">
              <Menu className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{menu.title}</p>
              <p className="mt-1 text-sm text-muted">{menu.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

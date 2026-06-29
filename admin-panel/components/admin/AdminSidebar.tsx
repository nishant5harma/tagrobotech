"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { adminNavItems } from "@/lib/nav";
import { clearAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  }

  function handleLogout() {
    clearAuth();
    router.replace("/login");
  }

  return (
    <aside className="relative flex h-full w-[248px] shrink-0 flex-col overflow-hidden border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-20 h-40 w-40 rounded-full blur-2xl"
        style={{ background: "var(--sidebar-glow)" }}
      />

      <div className="relative border-b border-[var(--sidebar-border)] px-5 py-6">
        <Link href="/dashboard" className="inline-block">
          <Image
            src="/tagrobo-logo.png"
            alt="Tag RoBo Tech"
            width={160}
            height={48}
            className="h-auto w-[148px] rounded-xl object-contain"
            priority
          />
        </Link>
        <p
          className="mt-3 text-[10px] font-medium uppercase tracking-[0.18em]"
          style={{ color: "var(--sidebar-label)" }}
        >
          CMS Workspace
        </p>
      </div>

      <nav className="relative flex-1 space-y-1 px-3 py-5">
        {adminNavItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition ${
                active ? "admin-nav-link--active" : ""
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative border-t border-[var(--sidebar-border)] p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="admin-logout-btn flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </aside>
  );
}

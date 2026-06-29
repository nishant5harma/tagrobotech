"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { getMe, type AuthUser } from "@/lib/api";
import { clearAuth, getStoredToken, getStoredUser } from "@/lib/auth";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f15a24] to-[#d94e1f] text-xs font-semibold text-white shadow-md shadow-[#f15a24]/30">
      {initials}
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const cached = getStoredUser<AuthUser>();
    if (cached) setUser(cached);

    getMe(token)
      .then((res) => setUser(res.user))
      .catch(() => {
        clearAuth();
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--orange)]/30 border-t-[var(--orange)]" />
          <p className="text-sm text-muted">Loading workspace...</p>
        </div>
      </div>
    );
  }

  const displayName = user?.name || "Admin";

  return (
    <div className="flex min-h-screen bg-background transition-colors">
      <div className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:z-30">
        <AdminSidebar />
      </div>

      <div className="flex min-h-screen flex-1 flex-col md:pl-[248px]">
        <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-6 py-3.5">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--orange)] md:hidden">
                Tag RoBo Tech
              </p>
              <p className="truncate text-sm text-muted">
                <span className="hidden sm:inline">{getGreeting()}, </span>
                <span className="font-medium text-foreground">{displayName}</span>
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <ThemeToggle />
              <div className="hidden items-center gap-3 sm:flex">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{displayName}</p>
                  <p className="max-w-[180px] truncate text-xs text-muted">{user?.email}</p>
                </div>
                <UserAvatar name={displayName} />
              </div>
            </div>
          </div>
        </header>

        <main className="relative flex-1 overflow-hidden">
          <div aria-hidden className="dashboard-ambient absolute inset-0" />
          <div className="relative z-10 px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

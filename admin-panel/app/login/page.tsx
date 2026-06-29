"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { login } from "@/lib/api";
import { setAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      setAuth(data.token, data.user);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[var(--page-bg)] transition-colors duration-300">
      {/* Theme toggle */}
      <div className="absolute right-5 top-5 z-20 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      {/* Unified dark-mode glow — full viewport */}
      <div aria-hidden className="login-ambient pointer-events-none absolute inset-0" />

      {/* Light-mode ambient accents only */}
      <div
        aria-hidden
        className="login-blob pointer-events-none absolute -right-20 top-[8%] h-[380px] w-[380px] rounded-full bg-[#f15a24]/10 blur-3xl dark:hidden"
      />
      <div
        aria-hidden
        className="login-blob pointer-events-none absolute bottom-[5%] left-[38%] h-[320px] w-[320px] rounded-full bg-[#2b2e5d]/8 blur-3xl dark:hidden"
        style={{ animationDelay: "-8s" }}
      />

      <div className="relative z-10 flex w-full">
        {/* Left — brand panel */}
        <aside className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-[var(--panel-bg)] p-12 lg:flex xl:p-16 dark:bg-transparent">
          {/* Light-mode only gradient */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--panel-gradient-from)] via-[var(--panel-gradient-via)] to-[var(--panel-gradient-to)] dark:hidden"
          />
          <div
            aria-hidden
            className="login-blob pointer-events-none absolute -right-16 top-1/3 h-56 w-56 rounded-full bg-[#f15a24]/15 blur-3xl dark:hidden"
          />

          <div className="login-fade-up relative z-10">
            <Image
              src="/tagrobo-logo.png"
              alt="Tag RoBo Tech"
              width={220}
              height={72}
              priority
              className="h-auto w-[200px] object-contain xl:w-[220px]"
            />
          </div>

          <div
            className="login-fade-up relative z-10 max-w-md"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="mb-5 h-1 w-10 rounded-full bg-[#f15a24]" />
            <h1 className="text-[1.85rem] font-medium leading-[1.25] tracking-[-0.02em] text-white xl:text-[2rem] dark:text-[var(--text-primary)]">
              Content management,
              <span className="text-[#f15a24]"> simplified.</span>
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-white/55 dark:text-[var(--text-muted)]">
              Manage pages, sections, media, and SEO from one focused workspace
              built for your team.
            </p>
            <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.2em] text-[#808285]">
              Transforming Tracking
            </p>
          </div>

          <p
            className="login-fade-up relative z-10 text-xs text-white/30 dark:text-[var(--text-muted)]"
            style={{ animationDelay: "0.2s" }}
          >
            © {new Date().getFullYear()} Tag RoBo Tech
          </p>
        </aside>

        {/* Subtle divider — light mode only */}
        <div
          aria-hidden
          className="hidden w-px self-stretch bg-gradient-to-b from-transparent via-[#e2e4ec] to-transparent lg:block dark:hidden"
        />

        {/* Right — login form */}
        <main className="flex flex-1 items-center justify-center bg-transparent px-6 py-12 sm:px-10">
          <div
            className="login-fade-up w-full max-w-[400px]"
            style={{ animationDelay: "0.15s" }}
          >
            {/* Mobile logo */}
            <div className="mb-10 flex justify-center lg:hidden">
              <Image
                src="/tagrobo-logo.png"
                alt="Tag RoBo Tech"
                width={200}
                height={64}
                priority
                className="h-auto w-[180px] rounded-xl object-contain"
              />
            </div>

            <div className="mb-8">
              <h2 className="text-[1.75rem] font-medium tracking-[-0.02em] text-[var(--text-primary)]">
                Welcome back
              </h2>
              <p className="mt-2 text-[15px] text-[var(--text-muted)]">
                Sign in to manage your website content.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[var(--form-border)] bg-[var(--form-bg)] p-6 shadow-sm shadow-[#2b2e5d]/5 transition-colors duration-300 dark:shadow-none sm:p-7"
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-[13px] font-medium text-[var(--text-primary)]"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-3 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]"
                    placeholder="you@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-[13px] font-medium text-[var(--text-primary)]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-3 pr-11 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error ? (
                  <div
                    role="alert"
                    className="rounded-xl border border-[var(--error-border)] bg-[var(--error-bg)] px-4 py-3 text-[13px] text-[var(--error-text)]"
                  >
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#f15a24] px-4 py-3.5 text-[15px] font-medium text-white shadow-md shadow-[#f15a24]/25 transition hover:bg-[#d94e1f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in
                    </span>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-[12px] leading-relaxed text-[var(--text-muted)]">
              Secure access for authorized team members only.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  FlaskConical,
  Mail,
  Phone,
  Send,
} from "lucide-react";
import { submitLead } from "@/lib/leads";
import type { FooterSettings } from "@/lib/site-settings";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 9.5V7.7c0-.8.6-1 1-.1h1.7V4h-2.3C12 4 10.5 5.5 10.5 7.9V9.5H8v2.8h2.5V20h3V12.3h2.2l.3-2.8H13.5z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 4H22l-6.8 7.8L22.7 20h-4.2l-3.3-4.3L10.8 20H4.7l7.3-8.3L4 4h4.3l3 3.9L18.9 4zm-1.5 14.3h1.2L7.8 5.6H6.5l10.9 12.7z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.5 9.5H9v10.5H6.5V9.5zM7.8 4a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11 9.5h2.4v1.4h.1c.3-.6 1.2-1.4 2.5-1.4 2.7 0 3.2 1.8 3.2 4.1V20H16.3v-5.2c0-1.2 0-2.8-1.7-2.8-1.7 0-2 1.3-2 2.7V20H11V9.5z" />
    </svg>
  );
}

const SOCIAL_ICONS = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  X: XIcon,
  LinkedIn: LinkedInIcon,
} as const;

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={`${title}-${link.label}-${link.href}`}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1.5 text-[14px] text-white/70 transition-colors hover:text-white"
            >
              <span>{link.label}</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactItem({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8 text-[#f97316] ring-1 ring-white/10">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">{label}</p>
        <div className="mt-1 text-[13px] leading-6 text-white/75">{children}</div>
      </div>
    </div>
  );
}

function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;

    setError("");
    setSubmitting(true);

    try {
      await submitLead({
        form_type: "newsletter",
        email: email.trim(),
        source_page: typeof window !== "undefined" ? window.location.pathname : "/",
        source_label: "Footer newsletter",
      });
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to subscribe");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md sm:p-8 lg:p-10">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#f97316]/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#fdba74]">
            Newsletter
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,2.5vw,2rem)] font-bold leading-tight tracking-tight text-white">
            Stay ahead on tracking &amp; IoT insights
          </h2>
          <p className="mt-3 max-w-md text-[14px] leading-7 text-white/60">
            Product updates, industry trends, and deployment tips — delivered monthly. No spam.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <label htmlFor="footer-email" className="sr-only">
            Email address
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                required
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/8 pl-11 pr-4 text-[14px] text-white placeholder:text-white/35 outline-none transition focus:border-[#f97316]/50 focus:ring-2 focus:ring-[#f97316]/20"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#f97316] px-6 text-[13px] font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Subscribing..." : "Subscribe"}
              <Send className="h-4 w-4" />
            </button>
          </div>
          {error ? <p className="mt-3 text-[13px] font-medium text-red-300">{error}</p> : null}
          {submitted ? (
            <p className="mt-3 text-[13px] font-medium text-[#fdba74]">
              Thanks — you&apos;re on the list.
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}

export default function FooterClient({ settings }: { settings: FooterSettings }) {
  const year = new Date().getFullYear();
  const logoSrc = settings.logo_url || "/images/Tag-Robo-Tech.png";
  const logoAlt = settings.logo_alt || "Tag RoBo Tech";
  const logoHeight = Math.max(24, Number(settings.logo_height || 34));
  const logoWidth = Math.max(80, Number(settings.logo_width || 200));

  return (
    <footer className="relative mt-auto bg-[#071222] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 0%, rgba(249,115,22,0.14), transparent 32%), radial-gradient(circle at 88% 100%, rgba(56,189,248,0.08), transparent 28%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-[min(92%,1200px)] px-4 pt-16 sm:pt-20">
        <NewsletterCard />

        <div className="mt-14 grid gap-12 border-t border-white/8 pt-14 lg:grid-cols-[1.35fr_0.85fr_0.85fr_1.15fr] lg:gap-10">
          <div>
            <Link href="/" aria-label="Tag RoBo Tech home">
              <img
                src={logoSrc}
                alt={logoAlt}
                width={logoWidth}
                height={logoHeight}
                className="block object-contain"
                style={{ width: `${logoWidth}px`, height: `${logoHeight}px` }}
              />
            </Link>
            <p className="mt-5 max-w-sm text-[14px] leading-7 text-white/60">{settings.about_text}</p>

            <div className="mt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                Follow us
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {settings.social_links.map((social) => {
                  const Icon =
                    SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS] ?? LinkedInIcon;
                  return (
                    <a
                      key={`${social.label}-${social.href}`}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <FooterLinkColumn title="Quick links" links={settings.quick_links} />
          <FooterLinkColumn title="Support" links={settings.support_links} />

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
              Contact
            </h3>
            <div className="mt-5 space-y-5">
              <ContactItem icon={Building2} label="Head office">
                {settings.contact.head_office}
              </ContactItem>
              <ContactItem icon={FlaskConical} label="R&amp;D centre">
                {settings.contact.rnd_centre}
              </ContactItem>
              <ContactItem icon={Mail} label="Email">
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="transition-colors hover:text-white"
                >
                  {settings.contact.email}
                </a>
              </ContactItem>
              <ContactItem icon={Phone} label="Phone">
                <div className="space-y-1">
                  <p>
                    Sales <span className="text-white/45">(Mon–Sat)</span>{" "}
                    <a
                      href={`tel:+91${settings.contact.sales_phone}`}
                      className="font-medium text-white transition-colors hover:text-[#fdba74]"
                    >
                      {settings.contact.sales_phone}
                    </a>
                  </p>
                  <p>
                    Partners <span className="text-white/45">(Mon–Sat)</span>{" "}
                    <a
                      href={`tel:+91${settings.contact.partner_phone}`}
                      className="font-medium text-white transition-colors hover:text-[#fdba74]"
                    >
                      {settings.contact.partner_phone}
                    </a>
                  </p>
                </div>
              </ContactItem>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/8 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-white/45">© {year} Tag RoBo Tech. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            {settings.legal_links.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="text-[13px] text-white/45 transition-colors hover:text-white/80"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <a
        href={`tel:+91${settings.contact.sales_phone}`}
        className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#f97316] text-white shadow-[0_12px_32px_rgba(249,115,22,0.45)] transition hover:scale-105 hover:bg-[#ea580c]"
        aria-label="Call Tag RoBo Tech"
      >
        <Phone className="h-5 w-5" />
      </a>
    </footer>
  );
}

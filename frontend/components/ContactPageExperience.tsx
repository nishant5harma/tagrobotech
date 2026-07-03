"use client";

import type { ComponentType, FormEvent, ReactNode } from "react";
import { useState } from "react";
import {
  Building2,
  Clock,
  FlaskConical,
  Globe,
  Mail,
  MapPin,
  Phone,
  Send,
  User,
} from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants";
import {
  CONTACT_INFO,
  CONTACT_PAGE,
  OFFICES,
} from "@/lib/contact";
import { submitLead } from "@/lib/leads";
import { cn } from "@/lib/utils";

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

function InfoCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-full rounded-2xl border border-[#0f2744]/8 bg-white p-5 shadow-[0_8px_30px_rgba(15,39,68,0.06)] sm:p-6",
        className,
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f2744] text-[#f97316]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-[15px] font-bold tracking-tight text-[#0f2744]">{title}</h3>
      <div className="mt-2 text-[14px] leading-7 text-neutral-600">{children}</div>
    </div>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setSubmitting(true);

    const formData = new FormData(form);

    try {
      await submitLead({
        form_type: "contact",
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("mobile") ?? ""),
        message: String(formData.get("message") ?? ""),
        source_page: "/contact",
        source_label: "Contact page form",
      });
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "h-12 w-full rounded-xl border border-[#d1d9e6] bg-white px-4 text-[14px] text-[#0f2744] shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20";

  return (
    <div className="rounded-2xl border border-[#0f2744]/8 bg-white p-6 shadow-[0_20px_60px_rgba(15,39,68,0.1)] sm:p-8 lg:p-9">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
        {CONTACT_PAGE.formTitle}
      </p>
      <h2 className="mt-3 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-[#0f2744]">
        Send us a message
      </h2>
      <p className="mt-2 text-[14px] leading-7 text-neutral-600">
        {CONTACT_PAGE.formDescription}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-[13px] font-medium text-[#0f2744]">
            Your Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              className={cn(inputClass, "pl-11")}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-[13px] font-medium text-[#0f2744]">
              Your Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className={cn(inputClass, "pl-11")}
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-mobile" className="mb-1.5 block text-[13px] font-medium text-[#0f2744]">
              Your Mobile
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                id="contact-mobile"
                name="mobile"
                type="tel"
                required
                placeholder="+91 98765 43210"
                className={cn(inputClass, "pl-11")}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1.5 block text-[13px] font-medium text-[#0f2744]">
            Your Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            placeholder="Tell us about your tracking requirements..."
            className="w-full resize-none rounded-xl border border-[#d1d9e6] bg-white px-4 py-3.5 text-[14px] text-[#0f2744] shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f97316] px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(249,115,22,0.35)] transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {submitting ? "Sending..." : "Send Message"}
          <Send className="h-4 w-4" />
        </button>

        {error ? (
          <p className="text-[14px] font-medium text-red-600">{error}</p>
        ) : null}

        {submitted ? (
          <p className="text-[14px] font-medium text-[#0f2744]">
            Thank you! We&apos;ll get back to you shortly.
          </p>
        ) : null}
      </form>
    </div>
  );
}

export default function ContactPageExperience() {
  return (
    <main className="bg-[#f8fafc] pt-[108px]">
      <section className="relative overflow-hidden bg-[#081628] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 22%, rgba(249,115,22,0.22), transparent 36%), radial-gradient(circle at 82% 8%, rgba(56,189,248,0.1), transparent 30%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto w-[min(92%,1320px)] px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300">
              {CONTACT_PAGE.eyebrow}
            </p>
            <h1 className="mt-4 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight">
              {CONTACT_PAGE.headline}{" "}
              <span className="text-[#f97316]">{CONTACT_PAGE.headlineAccent}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-8 text-white/70">
              {CONTACT_PAGE.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`tel:+91${CONTACT_INFO.salesPhone}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#f97316] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#ea580c]"
              >
                <Phone className="h-4 w-4" />
                +91 {CONTACT_INFO.salesPhone}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.salesEmail}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-5 py-3 text-[14px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                <Mail className="h-4 w-4" />
                {CONTACT_INFO.salesEmail}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-[min(92%,1320px)] px-4">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="order-2 space-y-6 lg:order-1">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
                  Contact Information
                </p>
                <h2 className="mt-3 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-[#0f2744]">
                  Reach our team directly
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {OFFICES.map((office) => (
                  <InfoCard
                    key={office.id}
                    icon={office.id === "head-office" ? Building2 : FlaskConical}
                    title={office.title}
                  >
                    <p>{office.address}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#f97316] transition hover:text-[#ea580c]"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      View on map
                    </a>
                  </InfoCard>
                ))}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <InfoCard icon={Phone} title="For Sales Enquiry">
                  <a
                    href={`tel:+91${CONTACT_INFO.salesPhone}`}
                    className="font-semibold text-[#0f2744] transition hover:text-[#f97316]"
                  >
                    +91 {CONTACT_INFO.salesPhone}
                  </a>
                  <p className="mt-1 flex items-center gap-1.5 text-[13px] text-neutral-500">
                    <Clock className="h-3.5 w-3.5" />
                    {CONTACT_INFO.businessHours}
                  </p>
                </InfoCard>

                <InfoCard icon={Phone} title="Business Partner Enquiry">
                  <a
                    href={`tel:+91${CONTACT_INFO.partnerPhone}`}
                    className="font-semibold text-[#0f2744] transition hover:text-[#f97316]"
                  >
                    +91 {CONTACT_INFO.partnerPhone}
                  </a>
                  <p className="mt-1 flex items-center gap-1.5 text-[13px] text-neutral-500">
                    <Clock className="h-3.5 w-3.5" />
                    {CONTACT_INFO.businessHours}
                  </p>
                </InfoCard>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <InfoCard icon={Mail} title="Email">
                  <div className="space-y-2">
                    <p>
                      <span className="text-neutral-500">Sales: </span>
                      <a
                        href={`mailto:${CONTACT_INFO.salesEmail}`}
                        className="font-medium text-[#0f2744] transition hover:text-[#f97316]"
                      >
                        {CONTACT_INFO.salesEmail}
                      </a>
                    </p>
                    <p>
                      <span className="text-neutral-500">General: </span>
                      <a
                        href={`mailto:${CONTACT_INFO.generalEmail}`}
                        className="font-medium text-[#0f2744] transition hover:text-[#f97316]"
                      >
                        {CONTACT_INFO.generalEmail}
                      </a>
                    </p>
                  </div>
                </InfoCard>

                <InfoCard icon={Globe} title="Website">
                  <a
                    href={CONTACT_INFO.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#0f2744] transition hover:text-[#f97316]"
                  >
                    {CONTACT_INFO.websiteLabel}
                  </a>
                </InfoCard>
              </div>

              <div className="rounded-2xl bg-[#0f2744] p-6 text-white sm:p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
                  Find us on
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SOCIAL_LINKS.map((social) => {
                    const Icon = SOCIAL_ICONS[social.label];
                    return (
                      <a
                        key={social.href}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-white/8 text-white/80 transition hover:border-white/25 hover:bg-white/12 hover:text-white"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:sticky lg:top-[120px]">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#0f2744]/6 bg-white py-12 sm:py-16">
        <div className="mx-auto w-[min(92%,1320px)] px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
              Our locations
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-[#0f2744]">
              Visit us in Gurugram
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {OFFICES.map((office) => (
              <div
                key={office.id}
                className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(15,39,68,0.08)] ring-1 ring-[#0f2744]/8"
              >
                <div className="border-b border-[#0f2744]/6 px-5 py-4 sm:px-6">
                  <h3 className="font-bold text-[#0f2744]">{office.title}</h3>
                  <p className="mt-1 text-[13px] leading-6 text-neutral-600">{office.address}</p>
                </div>
                <iframe
                  title={`Map — ${office.title}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(office.mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="h-[280px] w-full border-0 sm:h-[320px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

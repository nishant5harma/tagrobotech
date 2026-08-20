"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Check, Phone } from "lucide-react";
import TrackSection from "@/components/TrackSection";
import { CONTACT_PHONE } from "@/lib/constants";
import { submitLead } from "@/lib/leads";

const TRUST_BRANDS = [
  "HCL",
  "Tata Motors",
  "Coca-Cola",
  "Flipkart",
  "Tech Mahindra",
  "PVR",
  "Max Healthcare",
  "Brookfield",
  "Saint Gobain",
] as const;

const SCALE_CHIPS = [
  "10 offices",
  "250 retail outlets",
  "700 warehouses",
  "1,000 branches",
  "300 manufacturing units",
  "Multiple countries",
] as const;

const DELIVERABLES = [
  "Physical Asset Verification",
  "Fixed Asset Register Reconciliation",
  "QR / Barcode / RFID Tagging",
  "Geo-Tagged Asset Capture",
  "Photographic Evidence",
  "Asset Condition Assessment",
  "Missing & Ghost Asset Identification",
  "ERP-Ready Data",
  "Audit-Ready Reports",
] as const;

const PROBLEMS = [
  { item: "Ghost assets still sitting on the books", tag: "Unverified" },
  { item: "Assets missing at the time of count", tag: "Unverified" },
  { item: "Duplicate records across locations", tag: "Unreconciled" },
  { item: "Assets recorded at the wrong location", tag: "Unreconciled" },
  { item: "Assets tagged to the incorrect cost centre", tag: "Unreconciled" },
  { item: "Assets shifted without documentation", tag: "Untracked" },
  { item: "Idle and non-working assets still depreciating", tag: "Untracked" },
  { item: "Incomplete or outdated asset register", tag: "Overdue" },
] as const;

const PROCESS_STEPS = [
  {
    title: "Collect existing FAR",
    description: "We start from your current register — no matter its condition.",
  },
  {
    title: "Deploy PAN India audit teams",
    description: "Dedicated ground teams mobilised to every location on your list.",
  },
  {
    title: "Physical verification",
    description: "Every asset counted and inspected on site, not estimated.",
  },
  {
    title: "Barcode / QR / RFID tagging",
    description: "Each asset tagged for fast, repeatable future audits.",
  },
  {
    title: "Asset photography & geo-mapping",
    description: "Visual and location evidence captured for every record.",
  },
  {
    title: "FAR reconciliation",
    description: "Physical count reconciled line-by-line against your books.",
  },
  {
    title: "Management MIS & audit reports",
    description: "Clean, audit-ready reports handed to your finance and audit teams.",
  },
] as const;

const PILLARS = [
  {
    title: "Dedicated Ground Teams",
    description: "Trained field auditors mobilised to your exact locations.",
  },
  {
    title: "Technology",
    description: "RFID, QR, barcode, GPS and NFC, matched to the asset type.",
  },
  {
    title: "Automation",
    description: "In-house software captures and reconciles data as we go.",
  },
  {
    title: "Nationwide Reach",
    description: "6,791+ locations covered, from metros to remote sites.",
  },
  {
    title: "ERP Integration",
    description: "Verified data delivered ready to load into your ERP.",
  },
] as const;

const INDUSTRIES = [
  "Manufacturing",
  "Automobile",
  "FMCG",
  "Retail Chains",
  "Pharmaceutical",
  "Hospitals",
  "IT & ITES",
  "Banks & NBFC",
  "Telecom",
  "Warehousing",
  "Construction",
  "Mining",
  "Infrastructure",
  "Education",
  "Government",
  "Oil & Gas",
  "Logistics",
  "Hotels",
  "Airports",
  "Real Estate",
  "Utilities",
] as const;

const STATS = [
  { value: 100, suffix: "M+", label: "Assets Tracked" },
  { value: 18099, suffix: "+", label: "Projects Delivered" },
  { value: 6791, suffix: "+", label: "Locations Covered" },
  { value: 13, suffix: "+", label: "Years Experience" },
] as const;

const WHO_ITEMS = [
  "Chief Financial Officers",
  "Finance Controllers & Fixed Asset Teams",
  "Internal Audit Teams",
  "Corporate Administration & Facility Management",
  "Compliance Teams & Statutory Auditors",
  "Companies operating from multiple locations",
] as const;

const FIT_ITEMS = [
  "Your assets are spread across India",
  "Your FAR is outdated",
  "Audit observations repeat every year",
  "Assets are difficult to locate",
  "You're implementing SAP / Oracle",
  "You have more than 5,000 assets",
] as const;

const ASSESSMENT_CHECKS = [
  "Number of assets & locations",
  "Current FAR condition",
  "Your ERP platform",
  "Tagging requirement",
  "Project timeline",
] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
      <span className="inline-block h-px w-6 bg-[#f97316]" aria-hidden="true" />
      {children}
    </p>
  );
}

function VerificationSeal() {
  return (
    <div className="mx-auto flex h-[250px] w-[250px] items-center justify-center">
      <svg viewBox="0 0 250 250" className="h-full w-full" aria-hidden="true">
        <circle cx="125" cy="125" r="100" fill="none" stroke="#f97316" strokeWidth="1.5" />
        <circle cx="125" cy="125" r="88" fill="none" stroke="#f97316" strokeWidth="1" />
        <circle cx="125" cy="125" r="60" fill="#0f2744" />
        <path
          d="M100 127 L117 144 L152 106"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <path id="farSealPath" d="M 125,125 m -94,0 a 94,94 0 1,1 188,0 a 94,94 0 1,1 -188,0" />
        </defs>
        <g className="origin-[125px_125px] animate-[spin_26s_linear_infinite] motion-reduce:animate-none">
          <text
            fill="#0f2744"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            fontSize="10.5"
            letterSpacing="3"
          >
            <textPath href="#farSealPath" startOffset="0%">
              PHYSICALLY VERIFIED • PAN INDIA EXECUTION • FAR RECONCILED •
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  );
}

function AnimatedStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const [display, setDisplay] = useState(`0${suffix}`);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    let frame = 0;
    const totalFrames = 60;
    const tick = () => {
      frame += 1;
      const progress = Math.min(1, frame / totalFrames);
      const current = Math.round(value * progress);
      setDisplay(`${current.toLocaleString("en-IN")}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, suffix, value]);

  return (
    <div
      className="border-l border-white/20 pl-4"
      ref={(node) => {
        if (!node || started) return;
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              setStarted(true);
              observer.disconnect();
            }
          },
          { threshold: 0.4 }
        );
        observer.observe(node);
      }}
    >
      <p className="text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold tracking-tight text-white">
        {display}
      </p>
      <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
        {label}
      </p>
    </div>
  );
}

function AssessmentForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setSubmitting(true);

    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("mobile") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const designation = String(data.get("designation") ?? "").trim();
    const industry = String(data.get("industry") ?? "").trim();
    const locations = String(data.get("locations") ?? "").trim();
    const assets = String(data.get("assets") ?? "").trim();
    const erp = String(data.get("erp") ?? "").trim();
    const timeline = String(data.get("timeline") ?? "").trim();
    const requirement = String(data.get("requirement") ?? "").trim();

    const message = [
      "FAR Verification assessment request",
      company ? `Company: ${company}` : null,
      designation ? `Designation: ${designation}` : null,
      industry ? `Industry: ${industry}` : null,
      locations ? `Locations: ${locations}` : null,
      assets ? `Approx assets: ${assets}` : null,
      erp ? `ERP: ${erp}` : null,
      timeline ? `Timeline: ${timeline}` : null,
      requirement ? `Requirement: ${requirement}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await submitLead({
        form_type: "contact",
        name,
        email,
        phone,
        message,
        source_page: "/far-verification",
        source_label: "FAR Verification assessment form",
      });
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "h-11 w-full rounded-xl border border-[#d1d9e6] bg-[#f8fafc] px-3.5 text-[14px] text-[#0f2744] outline-none transition placeholder:text-neutral-400 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20";

  return (
    <div className="rounded-2xl border border-[#0f2744]/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,39,68,0.1)] sm:p-8">
      <h3 className="text-[1.25rem] font-bold tracking-tight text-[#0f2744]">
        Get a Free Project Assessment
      </h3>
      <p className="mt-1 text-[13.5px] text-neutral-600">
        A specialist will get back to you within one business day.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5 text-[12px] font-medium text-neutral-500">
            Full Name
            <input name="name" required className={inputClass} />
          </label>
          <label className="space-y-1.5 text-[12px] font-medium text-neutral-500">
            Company
            <input name="company" required className={inputClass} />
          </label>
          <label className="space-y-1.5 text-[12px] font-medium text-neutral-500">
            Designation
            <input name="designation" className={inputClass} />
          </label>
          <label className="space-y-1.5 text-[12px] font-medium text-neutral-500">
            Official Email
            <input name="email" type="email" required className={inputClass} />
          </label>
          <label className="space-y-1.5 text-[12px] font-medium text-neutral-500">
            Mobile
            <input name="mobile" type="tel" required className={inputClass} />
          </label>
          <label className="space-y-1.5 text-[12px] font-medium text-neutral-500">
            Industry
            <input name="industry" className={inputClass} />
          </label>
          <label className="space-y-1.5 text-[12px] font-medium text-neutral-500">
            Number of Locations
            <input name="locations" className={inputClass} />
          </label>
          <label className="space-y-1.5 text-[12px] font-medium text-neutral-500">
            Approx. Number of Assets
            <input name="assets" className={inputClass} />
          </label>
          <label className="space-y-1.5 text-[12px] font-medium text-neutral-500">
            Current ERP
            <input name="erp" className={inputClass} />
          </label>
          <label className="space-y-1.5 text-[12px] font-medium text-neutral-500">
            Timeline
            <input name="timeline" className={inputClass} />
          </label>
          <label className="space-y-1.5 text-[12px] font-medium text-neutral-500 sm:col-span-2">
            Project Requirement
            <textarea
              name="requirement"
              rows={3}
              className="w-full rounded-xl border border-[#d1d9e6] bg-[#f8fafc] px-3.5 py-3 text-[14px] text-[#0f2744] outline-none transition placeholder:text-neutral-400 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#f97316] px-6 text-[14px] font-semibold text-white transition hover:bg-[#ea580c] disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Schedule Consultation"}
        </button>

        {submitted ? (
          <p className="text-[13px] font-medium text-[#0f2744]">
            Request received — our specialist will reach out shortly.
          </p>
        ) : null}
        {error ? <p className="text-[13px] font-medium text-red-600">{error}</p> : null}
      </form>
    </div>
  );
}

export default function FarVerificationPageExperience() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="bg-white pt-[108px]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_55%,#f8fafc_100%)]">
        <div className="mx-auto grid w-[min(92%,1180px)] items-center gap-12 px-4 py-16 sm:py-20 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
          <div>
            <Eyebrow>FAR Verification & Reconciliation</Eyebrow>
            <h1 className="max-w-3xl text-[clamp(2rem,4.4vw,3.25rem)] font-bold leading-[1.08] tracking-tight text-[#0f2744]">
              India&apos;s Leading Partner for Fixed Asset Register Verification.
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-8 text-neutral-600 sm:text-[17px]">
              We physically verify, tag and reconcile fixed assets for enterprises operating across
              hundreds of locations — built for the CFOs, Internal Audit teams and Statutory Auditors
              who have to sign off on the numbers.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f97316] px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(249,115,22,0.3)] transition hover:bg-[#ea580c]"
              >
                Request a Free Project Consultation
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-[#0f2744]/15 bg-white px-6 py-3.5 text-[14px] font-semibold text-[#0f2744] transition hover:border-[#0f2744]/30"
              >
                Download Sample FAR Audit Report
              </a>
            </div>
            <p className="mt-6 text-[13px] text-neutral-500">
              Executed across <strong className="font-semibold text-[#0f2744]">6,791+</strong>{" "}
              locations · <strong className="font-semibold text-[#0f2744]">18,099+</strong> projects
              delivered · <strong className="font-semibold text-[#0f2744]">13+</strong> years in the
              field
            </p>
          </div>
          <VerificationSeal />
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-[#0f2744]/8 bg-[#f8fafc] py-10">
        <div className="mx-auto w-[min(92%,1180px)] px-4">
          <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Trusted by India&apos;s largest enterprises
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {TRUST_BRANDS.map((brand) => (
              <span key={brand} className="text-[16px] font-semibold text-[#0f2744]/75">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Scale / Why choose — using site TrackSection */}
      <div id="scale">
        <TrackSection />
      </div>

      {/* Problem */}
      <section className="border-y border-[#0f2744]/8 bg-[#f8fafc] py-16 sm:py-20">
        <div className="mx-auto w-[min(92%,1180px)] px-4">
          <div className="max-w-2xl">
            <Eyebrow>The Register Rarely Matches the Floor</Eyebrow>
            <h2 className="text-[clamp(1.7rem,3vw,2.25rem)] font-bold tracking-tight text-[#0f2744]">
              Is your Fixed Asset Register really accurate?
            </h2>
          </div>
          <div className="mt-8 border-t border-[#0f2744]/10">
            {PROBLEMS.map((row) => (
              <div
                key={row.item}
                className="flex items-baseline justify-between gap-4 border-b border-[#0f2744]/10 py-4"
              >
                <span className="text-[15px] font-medium text-[#0f2744]">{row.item}</span>
                <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f97316]">
                  {row.tag}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 border-l-4 border-[#f97316] pl-4 text-[15px] leading-7 text-neutral-600">
            When the auditors arrive, every one of these lines becomes an expensive compliance
            observation.
          </p>
        </div>
      </section>

      {/* Process */}
      <section id="solution" className="py-16 sm:py-20">
        <div className="mx-auto w-[min(92%,1180px)] px-4">
          <div className="max-w-2xl">
            <Eyebrow>Our Process</Eyebrow>
            <h2 className="text-[clamp(1.7rem,3vw,2.25rem)] font-bold tracking-tight text-[#0f2744]">
              Complete FAR verification, start to finish.
            </h2>
          </div>

          <div className="mt-10 space-y-0">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.title} className="grid grid-cols-[44px_1fr] gap-5">
                <div className="flex flex-col items-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0f2744] text-[13px] font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  {index < PROCESS_STEPS.length - 1 ? (
                    <div className="mt-1.5 w-px flex-1 bg-[#0f2744]/15" aria-hidden="true" />
                  ) : null}
                </div>
                <div className={index < PROCESS_STEPS.length - 1 ? "pb-9" : "pb-0"}>
                  <h3 className="text-[17px] font-bold text-[#0f2744]">{step.title}</h3>
                  <p className="mt-1.5 max-w-xl text-[14.5px] leading-7 text-neutral-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Different */}
      <section className="border-y border-[#0f2744]/8 bg-[#f8fafc] py-16 sm:py-20">
        <div className="mx-auto w-[min(92%,1180px)] px-4">
          <div className="max-w-2xl">
            <Eyebrow>Built for Large Enterprises</Eyebrow>
            <h2 className="text-[clamp(1.7rem,3vw,2.25rem)] font-bold tracking-tight text-[#0f2744]">
              Why we&apos;re different
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-neutral-600 sm:text-[16px]">
              Unlike conventional audit firms, we combine ground execution with technology — enabling
              projects involving millions of assets across cities, within aggressive timelines.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-[#0f2744]/10 border-t-[3px] border-t-[#f97316] bg-white p-5 shadow-[0_12px_40px_rgba(15,39,68,0.06)]"
              >
                <h3 className="text-[16px] font-bold text-[#0f2744]">{pillar.title}</h3>
                <p className="mt-2 text-[13.5px] leading-6 text-neutral-600">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-[min(92%,1180px)] px-4">
          <div className="max-w-2xl">
            <Eyebrow>Industries We Serve</Eyebrow>
            <h2 className="text-[clamp(1.7rem,3vw,2.25rem)] font-bold tracking-tight text-[#0f2744]">
              Every sector with assets to account for.
            </h2>
          </div>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {INDUSTRIES.map((industry) => (
              <span
                key={industry}
                className="rounded-full border border-[#0f2744]/10 bg-white px-4 py-2 text-[13px] font-medium text-[#0f2744]"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0f2744] py-16 sm:py-20">
        <div className="mx-auto grid w-[min(92%,1180px)] grid-cols-2 gap-8 px-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </section>

      {/* Who / Fit */}
      <section id="who" className="py-16 sm:py-20">
        <div className="mx-auto grid w-[min(92%,1180px)] gap-12 px-4 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Who Should Contact Us</Eyebrow>
            <h2 className="text-[clamp(1.5rem,2.5vw,1.75rem)] font-bold tracking-tight text-[#0f2744]">
              Built for the people who own the numbers.
            </h2>
            <div className="mt-6">
              {WHO_ITEMS.map((item) => (
                <div
                  key={item}
                  className="border-b border-[#0f2744]/10 py-3.5 text-[15px] text-[#0f2744]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <Eyebrow>We&apos;re the Right Partner If</Eyebrow>
            <h2 className="text-[clamp(1.5rem,2.5vw,1.75rem)] font-bold tracking-tight text-[#0f2744]">
              Any of this sounds familiar.
            </h2>
            <div className="mt-6">
              {FIT_ITEMS.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 border-b border-[#0f2744]/10 py-3.5 text-[15px] text-[#0f2744]"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#f97316]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-y border-[#0f2744]/8 bg-[#f8fafc] py-16 sm:py-20">
        <div className="mx-auto w-[min(92%,1180px)] px-4">
          <blockquote className="max-w-3xl rounded-2xl border border-[#0f2744]/10 border-l-4 border-l-[#f97316] bg-white px-8 py-10 shadow-[0_16px_50px_rgba(15,39,68,0.06)]">
            <p className="text-[clamp(1.15rem,2vw,1.4rem)] font-medium italic leading-8 text-[#0f2744]">
              &ldquo;We had a huge challenge tracking assets spread across 900+ points. Tag RoBo
              Tech&apos;s reach was extremely fast and effective.&rdquo;
            </p>
            <footer className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              CFO, Largest Auto OEM
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-[#f8fafc] py-16 sm:py-20">
        <div className="mx-auto grid w-[min(92%,1180px)] gap-12 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div>
            <Eyebrow>Get Started</Eyebrow>
            <h2 className="text-[clamp(1.6rem,3vw,2rem)] font-bold tracking-tight text-[#0f2744]">
              Planning your next fixed asset verification?
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-8 text-neutral-600">
              Tell us about your project and our specialists will recommend the most efficient
              execution plan.
            </p>
            <div className="mt-7 space-y-3">
              {ASSESSMENT_CHECKS.map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-[15px] text-[#0f2744]">
                  <Check className="h-4 w-4 text-[#f97316]" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-2 text-[14.5px] leading-7 text-neutral-600">
              <p>
                <strong className="font-semibold text-[#0f2744]">Head Office:</strong> Suncity
                Success Tower, Sector-65, Gurugram – 122018
              </p>
              <p>
                <strong className="font-semibold text-[#0f2744]">Sales Enquiry:</strong>{" "}
                <a href={`tel:+91${CONTACT_PHONE}`} className="text-[#f97316] hover:underline">
                  +91 {CONTACT_PHONE.slice(0, 5)} {CONTACT_PHONE.slice(5)}
                </a>
              </p>
              <p>
                <strong className="font-semibold text-[#0f2744]">Email:</strong>{" "}
                <a href="mailto:info@tagrobotech.com" className="text-[#f97316] hover:underline">
                  info@tagrobotech.com
                </a>
              </p>
            </div>
          </div>

          <AssessmentForm />
        </div>
      </section>

      {/* Sticky CTA */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-4 bg-[#0f2744] px-5 py-3 transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <span className="hidden text-[13px] text-white/80 sm:inline">
          Ready to verify your fixed assets?
        </span>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full bg-[#f97316] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#ea580c]"
        >
          Request Proposal
        </a>
        <a
          href={`tel:+91${CONTACT_PHONE}`}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/80 transition hover:text-white"
        >
          <Phone className="h-3.5 w-3.5" />
          {CONTACT_PHONE}
        </a>
      </div>
    </main>
  );
}

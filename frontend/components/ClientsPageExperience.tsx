"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Globe2, Handshake, Sparkles } from "lucide-react";
import { LogoCloud } from "@/components/ui/logo-cloud-2";
import { CONTACT_PHONE } from "@/lib/constants";
import {
  CLIENT_INDUSTRIES,
  CLIENT_LOGOS,
  CLIENT_STATS,
  CLIENTS_HERO_BG,
} from "@/lib/clients";
import { cn } from "@/lib/utils";

export default function ClientsPageExperience() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#081628] pt-[132px] text-white">
        <Image
          src={CLIENTS_HERO_BG}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,22,40,0.92)_0%,rgba(8,22,40,0.82)_45%,rgba(8,22,40,0.94)_100%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(249,115,22,0.18), transparent 38%), radial-gradient(circle at 85% 10%, rgba(56,189,248,0.08), transparent 32%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto w-[min(92%,1320px)] px-4 pb-16 pt-10 sm:pb-20 sm:pt-14">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Our Clients
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="mt-6 text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight"
              >
                Trusted by enterprises{" "}
                <span className="text-[#f97316]">across India</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="mt-5 max-w-xl text-[16px] leading-8 text-white/70 sm:text-[17px]"
              >
                From banking and healthcare to retail, media, and manufacturing —
                leading organizations rely on Tag RoBo Tech for asset tracking,
                reconciliation, and operational intelligence at scale.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f97316] px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(249,115,22,0.35)] transition hover:bg-[#ea580c]"
                >
                  Become a partner
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`tel:+91${CONTACT_PHONE}`}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/6 px-6 py-3.5 text-[14px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  {CONTACT_PHONE}
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#f97316]/20 via-transparent to-sky-400/10 blur-2xl" />
              <div className="relative grid grid-cols-3 gap-3 sm:gap-4">
                {CLIENT_LOGOS.slice(0, 9).map((logo, index) => (
                  <motion.div
                    key={logo.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.18 + index * 0.04 }}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-[1.25rem] border border-white/10 bg-white/8 p-4 backdrop-blur-sm",
                      index % 3 === 1 && "translate-y-3 sm:translate-y-4",
                    )}
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={120}
                      height={48}
                      className="h-8 w-auto max-w-full object-contain brightness-0 invert opacity-90 sm:h-9"
                      unoptimized
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {CLIENT_STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.25 + index * 0.05 }}
                className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm sm:p-5"
              >
                <p className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.14em] text-white/55 sm:text-[13px]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="border-b border-[#0f2744]/6 bg-[#f8fafc] py-12 sm:py-14">
        <div className="mx-auto w-[min(92%,1320px)] px-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
                Sectors we serve
              </p>
              <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.25rem)] font-bold tracking-tight text-[#0f2744]">
                One partner, many industries
              </h2>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {CLIENT_INDUSTRIES.map((industry) => (
                <span
                  key={industry}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#0f2744] ring-1 ring-[#0f2744]/10"
                >
                  <Building2 className="h-3.5 w-3.5 text-[#f97316]" />
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full logo wall */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-[min(92%,1200px)] px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
              Partner network
            </p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-bold leading-tight tracking-tight text-[#0f2744]">
              {CLIENT_LOGOS.length} organizations that{" "}
              <span className="text-[#f97316]">trust us</span>
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-neutral-600">
              A growing ecosystem of enterprises who chose Tag RoBo Tech for
              reliable tracking, faster reconciliation, and software that turns
              field data into decisions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-12 overflow-hidden rounded-[1.75rem] shadow-[0_28px_70px_rgba(15,39,68,0.08)] ring-1 ring-[#0f2744]/8"
          >
            <LogoCloud logos={CLIENT_LOGOS} />
          </motion.div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-t border-[#0f2744]/6 bg-white py-14 sm:py-16">
        <div className="mx-auto w-[min(92%,1320px)] px-4">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Handshake,
                title: "Long-term partnerships",
                description:
                  "We work as an extension of your operations team — from tagging and reconciliation to ongoing monitoring.",
              },
              {
                icon: Globe2,
                title: "Nationwide execution",
                description:
                  "Experienced field teams deploy across sites, warehouses, branches, and remote locations throughout India.",
              },
              {
                icon: Building2,
                title: "Enterprise-grade delivery",
                description:
                  "RFID, GPS, BLE, robotics, and ERP-ready software — tailored to compliance, scale, and your industry.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="rounded-[1.5rem] bg-[#f8fafc] p-6 ring-1 ring-[#0f2744]/8 sm:p-7"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f2744] text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-[1.15rem] font-bold tracking-tight text-[#0f2744]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] leading-7 text-neutral-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#0f2744] py-16 text-white sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(249,115,22,0.35), transparent 45%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-[min(92%,900px)] px-4 text-center">
          <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] font-bold leading-tight tracking-tight">
            Ready to join our client family?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-white/70">
            Whether you need asset reconciliation, fleet tracking, or a full
            robotics-led verification program — our team is ready to design the
            right solution for your organization.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f97316] px-7 py-3.5 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(249,115,22,0.35)] transition hover:bg-[#ea580c]"
            >
              Start a conversation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-[14px] font-semibold text-white transition hover:bg-white/8"
            >
              Explore our services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

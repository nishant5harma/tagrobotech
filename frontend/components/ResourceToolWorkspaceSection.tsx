"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  mergeResourceToolWorkspaceSectionData,
  type ResourceToolWorkspaceSectionData,
} from "@/lib/resource-tool-workspace-section";

type ResourceToolWorkspaceSectionProps = {
  data?: ResourceToolWorkspaceSectionData | null;
};

function parseNumber(value: string) {
  const cleaned = value.replace(/,/g, "").trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
}

function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ResourceToolWorkspaceSection({
  data,
}: ResourceToolWorkspaceSectionProps) {
  const section = mergeResourceToolWorkspaceSectionData(data);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(section.fields.map((field) => [field.id, ""]))
  );
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    if (!submitted) return null;

    if (section.tool_type === "roi" || section.tool_type === "maintenance") {
      const assets = parseNumber(values.assets || values.asset_count || "0");
      const hours = parseNumber(values.hours || values.search_hours || "0");
      const rate = parseNumber(values.rate || values.labour_rate || "0");
      const writeoffs = parseNumber(values.writeoffs || values.downtime_loss || "0");
      const searchSavings = hours * rate * 52 * 0.45;
      const writeoffSavings = writeoffs * 0.25;
      const maintenanceGain = assets > 0 ? assets * 120 : 0;
      const total =
        section.tool_type === "roi"
          ? searchSavings + writeoffSavings
          : searchSavings * 0.7 + maintenanceGain;

      return {
        kind: "currency" as const,
        value: formatInr(Math.max(total, 0)),
        detail:
          section.tool_type === "roi"
            ? "Combined estimate from recovered search time and reduced write-off exposure."
            : "Combined estimate from readiness gains and reduced maintenance scramble cost.",
      };
    }

    const payload =
      values.code ||
      values.asset_id ||
      values.label ||
      values.text ||
      Object.values(values).find((item) => item.trim()) ||
      "TagRoBoTech";

    if (section.tool_type === "qr") {
      return {
        kind: "qr" as const,
        value: payload,
        detail: "Preview generated from your entered value. Use durable labels before plant rollout.",
      };
    }

    return {
      kind: "barcode" as const,
      value: payload.replace(/\s+/g, "").toUpperCase().slice(0, 24) || "TAGROBOTECH",
      detail: "Preview string for barcode labelling. Validate printer and scanner settings on site.",
    };
  }, [section.tool_type, submitted, values]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="bg-[#0f2744] py-16 sm:py-20">
      <div className="mx-auto w-[min(92%,1180px)] px-4">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div>
            {section.tagline ? (
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#fdba74]">
                {section.tagline}
              </p>
            ) : null}
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-white">
              {section.heading}
            </h2>
            {section.description ? (
              <p className="mt-5 text-[15px] leading-8 text-white/70">{section.description}</p>
            ) : null}
            <Link
              href={section.primary_button.link || "/contact"}
              className="mt-8 inline-flex rounded-full bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
            >
              {section.primary_button.text || "Talk to an expert"}
            </Link>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-medium text-[#0f2744]" htmlFor={field.id}>
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      id={field.id}
                      value={values[field.id] ?? ""}
                      onChange={(event) =>
                        setValues((prev) => ({ ...prev, [field.id]: event.target.value }))
                      }
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-sm text-[#0f2744] outline-none transition focus:border-[#f97316]"
                    />
                    {field.suffix ? (
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                        {field.suffix}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#f97316] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
              >
                Calculate / Generate
              </button>
            </form>

            {result ? (
              <div className="mt-6 rounded-2xl border border-[#0f2744]/8 bg-[#f8fafc] p-5">
                <p className="text-sm font-semibold text-[#0f2744]">{section.result_heading}</p>
                {result.kind === "currency" ? (
                  <p className="mt-3 text-3xl font-bold tracking-tight text-[#f97316]">
                    {result.value}
                  </p>
                ) : null}
                {result.kind === "qr" ? (
                  <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(result.value)}`}
                      alt={`QR preview for ${result.value}`}
                      width={180}
                      height={180}
                      className="rounded-xl border border-neutral-200 bg-white p-2"
                    />
                    <p className="text-sm font-medium text-[#0f2744] break-all">{result.value}</p>
                  </div>
                ) : null}
                {result.kind === "barcode" ? (
                  <div className="mt-4 space-y-3">
                    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white px-4 py-6">
                      <div className="flex h-16 items-end justify-center gap-[2px]">
                        {result.value.split("").map((char, index) => (
                          <span
                            key={`${char}-${index}`}
                            className="bg-[#0f2744]"
                            style={{
                              width: `${4 + (char.charCodeAt(0) % 5)}px`,
                              height: `${40 + (char.charCodeAt(0) % 24)}px`,
                            }}
                          />
                        ))}
                      </div>
                      <p className="mt-3 text-center text-sm font-semibold tracking-[0.2em] text-[#0f2744]">
                        {result.value}
                      </p>
                    </div>
                  </div>
                ) : null}
                <p className="mt-3 text-[13px] leading-6 text-neutral-600">
                  {result.detail} {section.result_helper}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

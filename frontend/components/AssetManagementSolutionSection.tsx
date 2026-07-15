"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import {
  assetSolutionImageSrc,
  mergeAssetManagementSolutionSectionData,
  type AssetManagementSolutionSectionData,
  type AssetSolutionTab,
} from "@/lib/asset-management-solution-section";

type AssetManagementSolutionSectionProps = {
  data?: AssetManagementSolutionSectionData | null;
};

function SolutionCta({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a
        href={href}
        className="inline-flex items-center gap-2 rounded-full border-2 border-[#f97316] px-6 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#f97316] transition hover:bg-[#fff7ed]"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border-2 border-[#f97316] px-6 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#f97316] transition hover:bg-[#fff7ed]"
    >
      {children}
    </Link>
  );
}

function DashboardMockup({ tab }: { tab: AssetSolutionTab }) {
  const imageSrc = assetSolutionImageSrc(tab);
  const useCustomImage = Boolean(tab.image_url || tab.image_src !== "/assets-images/laptop.png");

  if (useCustomImage && tab.image_url) {
    return (
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_50px_rgba(15,39,68,0.1)]">
        <Image
          src={imageSrc}
          alt={tab.image_alt}
          width={1200}
          height={800}
          className="h-auto w-full object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_50px_rgba(15,39,68,0.1)]">
      <div className="flex items-center gap-1.5 border-b border-neutral-100 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#0f2744]">Dashboards</p>
          <span className="rounded-md border border-neutral-200 px-2 py-1 text-[11px] text-neutral-500">
            Status
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { value: "43", label: "Total Work Orders", color: "text-[#111827]" },
            { value: "20", label: "Completed WOs", color: "text-[#16a34a]" },
            { value: "17", label: "Compliant WOs", color: "text-[#2563eb]" },
            { value: "6", label: "Overdue WOs", color: "text-[#dc2626]" },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-neutral-100 bg-[#f8fafc] p-3">
              <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
              <p className="mt-1 text-[10px] leading-tight text-neutral-500">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-xl border border-neutral-100 p-3">
            <p className="mb-3 text-[11px] font-medium text-neutral-600">
              Work Order Status Breakdown
            </p>
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[conic-gradient(#f97316_0_35%,#3b82f6_35%_60%,#22c55e_60%_82%,#e5e7eb_82%_100%)]" />
          </div>
          <div className="rounded-xl border border-neutral-100 p-3">
            <p className="mb-3 text-[11px] font-medium text-neutral-600">Work Remaining Overview</p>
            <div className="flex h-28 items-end gap-2">
              {[48, 72, 56, 88, 64, 92].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t bg-[#3b82f6]/80"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabPanel({ tab }: { tab: AssetSolutionTab }) {
  const [openFeature, setOpenFeature] = useState(0);

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
      <div>
        <h3 className="text-[clamp(1.35rem,2.5vw,1.85rem)] font-bold leading-tight text-[#111827]">
          {tab.panel_heading}
        </h3>
        <p className="mt-4 text-[15px] leading-8 text-pretty text-neutral-600">{tab.panel_description}</p>

        <div className="mt-8 space-y-0 border-t border-neutral-200">
          {tab.features.map((feature, index) => {
            const isOpen = openFeature === index;

            return (
              <div key={feature.title} className="border-b border-neutral-200">
                <button
                  type="button"
                  onClick={() => setOpenFeature(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="text-[15px] font-medium text-[#111827]">{feature.title}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-neutral-400 transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && feature.description ? (
                  <p className="pb-4 pr-8 text-[14px] leading-7 text-neutral-600">
                    {feature.description}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <SolutionCta href={tab.cta_button.link}>
            {tab.cta_button.text}
            <ArrowUpRight className="h-4 w-4" />
          </SolutionCta>
        </div>
      </div>

      <DashboardMockup tab={tab} />
    </div>
  );
}

export default function AssetManagementSolutionSection({
  data,
}: AssetManagementSolutionSectionProps) {
  const section = mergeAssetManagementSolutionSectionData(data);
  const [activeTabId, setActiveTabId] = useState(section.tabs[0]?.id ?? "");

  const activeTab =
    section.tabs.find((tab) => tab.id === activeTabId) ?? section.tabs[0] ?? null;

  return (
    <section className="bg-[linear-gradient(180deg,#fff7f3_0%,#ffffff_28%,#ffffff_100%)] py-16 sm:py-20">
      <div className="mx-auto w-[min(92%,1280px)] px-4">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-snug tracking-tight text-pretty text-[#111827]">
            {section.heading}{" "}
            <span className="text-[#f97316]">{section.heading_accent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-4xl text-[15px] leading-8 text-pretty text-neutral-600 sm:text-[16px]">
            {section.description}
          </p>
        </div>

        <div className="mt-10 overflow-x-auto">
          <div className="flex min-w-max justify-center gap-8 border-b border-neutral-200 px-2 sm:gap-12">
            {section.tabs.map((tab) => {
              const isActive = tab.id === activeTab?.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`relative pb-4 text-[13px] font-semibold whitespace-nowrap transition sm:text-[14px] ${
                    isActive ? "text-[#f97316]" : "text-neutral-500 hover:text-[#111827]"
                  }`}
                >
                  {tab.label}
                  {isActive ? (
                    <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#f97316]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 lg:mt-12">
          {activeTab ? <TabPanel key={activeTab.id} tab={activeTab} /> : null}
        </div>
      </div>
    </section>
  );
}

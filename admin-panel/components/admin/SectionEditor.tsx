"use client";

import { useState, type HTMLAttributes } from "react";
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react";
import HeroSectionEditor from "@/components/admin/sections/HeroSectionEditor";
import ClientsSectionEditor from "@/components/admin/sections/ClientsSectionEditor";
import AboutSectionEditor from "@/components/admin/sections/AboutSectionEditor";
import TrackSectionEditor from "@/components/admin/sections/TrackSectionEditor";
import TechnologyPlatformSectionEditor from "@/components/admin/sections/TechnologyPlatformSectionEditor";
import TrustedIndustriesSectionEditor from "@/components/admin/sections/TrustedIndustriesSectionEditor";
import FootprintsSectionEditor from "@/components/admin/sections/FootprintsSectionEditor";
import TestimonialsSectionEditor from "@/components/admin/sections/TestimonialsSectionEditor";
import MoreClientsSectionEditor from "@/components/admin/sections/MoreClientsSectionEditor";
import AboutPageHeroSectionEditor from "@/components/admin/sections/AboutPageHeroSectionEditor";
import WhoWeAreAboutSectionEditor from "@/components/admin/sections/WhoWeAreAboutSectionEditor";
import OurJourneyAboutSectionEditor from "@/components/admin/sections/OurJourneyAboutSectionEditor";
import WhatWeDeliverAboutSectionEditor from "@/components/admin/sections/WhatWeDeliverAboutSectionEditor";
import ReachTrustAboutSectionEditor from "@/components/admin/sections/ReachTrustAboutSectionEditor";
import ResourcePageHeroSectionEditor from "@/components/admin/sections/ResourcePageHeroSectionEditor";
import RichTextSectionEditor from "@/components/admin/sections/RichTextSectionEditor";
import { SECTION_TYPES } from "@/lib/sections";
import type { PageSection } from "@/lib/api";

type SectionEditorProps = {
  section: PageSection;
  onSave: (data: Record<string, unknown>, isActive: boolean) => Promise<void>;
  onDelete: () => Promise<void>;
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
};

function normalizeSectionData(data: PageSection["data"]): Record<string, unknown> {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return data ?? {};
}

export default function SectionEditor({
  section,
  onSave,
  onDelete,
  dragHandleProps,
  isDragging = false,
}: SectionEditorProps) {
  const [open, setOpen] = useState(false);
  const [jsonText, setJsonText] = useState(
    JSON.stringify(normalizeSectionData(section.data), null, 2)
  );
  const [isActive, setIsActive] = useState(Boolean(section.is_active));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const typeLabel =
    SECTION_TYPES.find((t) => t.value === section.section_type)?.label ?? section.section_type;

  const isHero = section.section_type === "hero";
  const isClients = section.section_type === "clients";
  const isAbout = section.section_type === "about";
  const isTrack = section.section_type === "track";
  const isTechnologyPlatform = section.section_type === "technology_platform";
  const isTrustedIndustries = section.section_type === "trusted_industries";
  const isFootprints = section.section_type === "footprints";
  const isTestimonials = section.section_type === "testimonials";
  const isMoreClients = section.section_type === "more_clients";
  const isAboutPageHero = section.section_type === "about_page_hero";
  const isWhoWeAreAbout = section.section_type === "who_we_are_about";
  const isOurJourneyAbout = section.section_type === "our_journey_about";
  const isWhatWeDeliverAbout = section.section_type === "what_we_deliver_about";
  const isReachTrustAbout = section.section_type === "reach_trust_about";
  const isResourcePageHero = section.section_type === "resource_page_hero";
  const isRichText = section.section_type === "rich_text";
  const hasFormEditor =
    isHero ||
    isClients ||
    isAbout ||
    isTrack ||
    isTechnologyPlatform ||
    isTrustedIndustries ||
    isFootprints ||
    isTestimonials ||
    isMoreClients ||
    isAboutPageHero ||
    isWhoWeAreAbout ||
    isOurJourneyAbout ||
    isWhatWeDeliverAbout ||
    isReachTrustAbout ||
    isResourcePageHero ||
    isRichText;

  async function handleJsonSave() {
    setError("");
    setSaving(true);

    try {
      const data = JSON.parse(jsonText) as Record<string, unknown>;
      await onSave(data, isActive);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-card transition-shadow ${
        isDragging ? "border-[var(--orange)] shadow-lg" : "border-border"
      }`}
    >
      <div className="flex w-full items-center gap-1 px-2 py-3.5 sm:gap-2 sm:px-4">
        <button
          type="button"
          aria-label={`Drag to reorder ${typeLabel} section`}
          className="shrink-0 cursor-grab touch-none rounded-md p-1 text-muted transition hover:bg-[var(--surface-muted)] hover:text-foreground active:cursor-grabbing"
          {...dragHandleProps}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left transition hover:opacity-80"
        >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">{typeLabel}</span>
            <span className="rounded-md bg-[var(--surface-muted)] px-2 py-0.5 text-xs text-muted">
              #{section.position}
            </span>
            {!isActive ? (
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                hidden
              </span>
            ) : null}
          </div>
        </div>
          {open ? (
            <ChevronUp className="h-4 w-4 shrink-0 text-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
          )}
        </button>
      </div>

      {open ? (
        <div className="space-y-4 border-t border-border px-4 py-4">
          {isHero ? (
            <HeroSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : isClients ? (
            <ClientsSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : isAbout ? (
            <AboutSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : isTrack ? (
            <TrackSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : isTechnologyPlatform ? (
            <TechnologyPlatformSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : isTrustedIndustries ? (
            <TrustedIndustriesSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : isFootprints ? (
            <FootprintsSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : isTestimonials ? (
            <TestimonialsSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : isMoreClients ? (
            <MoreClientsSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : isAboutPageHero ? (
            <AboutPageHeroSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : isWhoWeAreAbout ? (
            <WhoWeAreAboutSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : isOurJourneyAbout ? (
            <OurJourneyAboutSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : isWhatWeDeliverAbout ? (
            <WhatWeDeliverAboutSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : isReachTrustAbout ? (
            <ReachTrustAboutSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : isResourcePageHero ? (
            <ResourcePageHeroSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : isRichText ? (
            <RichTextSectionEditor
              initialData={section.data}
              isActive={isActive}
              onIsActiveChange={setIsActive}
              onSave={onSave}
            />
          ) : (
            <>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-border"
                />
                Section visible on page
              </label>

              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wide text-muted">
                  Section data (JSON)
                </label>
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  rows={12}
                  className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-3 py-2 font-mono text-xs leading-relaxed"
                />
              </div>

              {error ? (
                <p className="text-sm text-[var(--error-text)]">{error}</p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleJsonSave}
                  disabled={saving}
                  className="rounded-lg bg-[var(--orange)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#d94e1f] disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save section"}
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}

          {hasFormEditor ? (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete section
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

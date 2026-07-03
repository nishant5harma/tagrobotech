import defaults from "@/lib/data/software-modules-section-software.json";
import { resolveCmsMediaUrl } from "@/lib/cms";

export type SoftwareModuleItem = {
  number: string;
  title: string;
  description: string;
};

export type SoftwareModulesSectionSoftwareData = {
  tagline: string;
  heading: string;
  description: string;
  platform_tagline: string;
  platform_heading: string;
  platform_description: string;
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
  image_url?: string | null;
  modules: SoftwareModuleItem[];
};

export const DEFAULT_SOFTWARE_MODULES_SECTION_SOFTWARE: SoftwareModulesSectionSoftwareData =
  defaults as SoftwareModulesSectionSoftwareData;

function asRecord(data: unknown): Record<string, unknown> {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return (data as Record<string, unknown>) ?? {};
}

function normalizeModules(value: unknown): SoftwareModuleItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return DEFAULT_SOFTWARE_MODULES_SECTION_SOFTWARE.modules.map((item) => ({ ...item }));
  }
  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback =
      DEFAULT_SOFTWARE_MODULES_SECTION_SOFTWARE.modules[index] ??
      DEFAULT_SOFTWARE_MODULES_SECTION_SOFTWARE.modules[0];
    return {
      number: String(row.number ?? fallback.number),
      title: String(row.title ?? fallback.title),
      description: String(row.description ?? fallback.description),
    };
  });
}

export function normalizeSoftwareModulesSectionSoftwareData(
  raw: unknown
): SoftwareModulesSectionSoftwareData {
  const data = asRecord(raw);
  return {
    tagline: String(data.tagline ?? DEFAULT_SOFTWARE_MODULES_SECTION_SOFTWARE.tagline),
    heading: String(data.heading ?? DEFAULT_SOFTWARE_MODULES_SECTION_SOFTWARE.heading),
    description: String(data.description ?? DEFAULT_SOFTWARE_MODULES_SECTION_SOFTWARE.description),
    platform_tagline: String(
      data.platform_tagline ?? DEFAULT_SOFTWARE_MODULES_SECTION_SOFTWARE.platform_tagline
    ),
    platform_heading: String(
      data.platform_heading ?? DEFAULT_SOFTWARE_MODULES_SECTION_SOFTWARE.platform_heading
    ),
    platform_description: String(
      data.platform_description ?? DEFAULT_SOFTWARE_MODULES_SECTION_SOFTWARE.platform_description
    ),
    image_media_id: data.image_media_id ? String(data.image_media_id) : null,
    image_src: String(data.image_src ?? DEFAULT_SOFTWARE_MODULES_SECTION_SOFTWARE.image_src),
    image_alt: String(data.image_alt ?? DEFAULT_SOFTWARE_MODULES_SECTION_SOFTWARE.image_alt),
    image_url: data.image_url ? String(data.image_url) : null,
    modules: normalizeModules(data.modules),
  };
}

export function softwareModulesSectionSoftwareToPayload(
  data: SoftwareModulesSectionSoftwareData
): Record<string, unknown> {
  return { ...data };
}

export function mergeSoftwareModulesSectionSoftwareData(
  cmsData: SoftwareModulesSectionSoftwareData | null
): SoftwareModulesSectionSoftwareData {
  if (!cmsData) return DEFAULT_SOFTWARE_MODULES_SECTION_SOFTWARE;
  return normalizeSoftwareModulesSectionSoftwareData(cmsData);
}

export function softwareModulesImageSrc(section: SoftwareModulesSectionSoftwareData): string {
  if (section.image_url) return resolveCmsMediaUrl(section.image_url);
  return section.image_src;
}

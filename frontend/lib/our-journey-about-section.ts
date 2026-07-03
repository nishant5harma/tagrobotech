import { resolveCmsMediaUrl } from "@/lib/cms";

export type JourneyImageFit = "cover" | "contain";

export type OurJourneyItem = {
  year: string;
  title: string;
  description: string;
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
  image_url?: string | null;
  image_fit: JourneyImageFit;
};

export type OurJourneyAboutSectionData = {
  tagline: string;
  heading: string;
  description: string;
  items: OurJourneyItem[];
};

export const DEFAULT_OUR_JOURNEY_ABOUT_SECTION: OurJourneyAboutSectionData = {
  tagline: "Our Journey",
  heading: "A story told through capability, scale, and execution",
  description:
    "From barcode and RFID-led compliance to intelligence-rich, robotics-enabled operations, each phase of the journey added depth to what we deliver.",
  items: [
    {
      year: "2013",
      title: "Started with tracking, built for trust",
      description:
        "Headquartered in Gurgaon, we began with barcode and RFID-led asset and inventory tracking to help businesses meet compliance requirements with confidence.",
      image_media_id: null,
      image_src: "/assets-images/assets_tracking.jpeg",
      image_alt: "Early asset tracking solutions",
      image_fit: "cover",
    },
    {
      year: "2017",
      title: "Scaled across sectors and sites",
      description:
        "Our implementation footprint expanded across industries and locations, building the field execution teams and partner network needed to deliver tracking at enterprise scale.",
      image_media_id: null,
      image_src: "/assets-images/employee_tracking.jpg.jpeg",
      image_alt: "Field teams scaling tracking operations",
      image_fit: "cover",
    },
    {
      year: "2018",
      title: "Moved from audits to intelligence",
      description:
        "What started as physical verification evolved into meaningful insights, richer ground-level data, and systems that guide operations instead of just recording them.",
      image_media_id: null,
      image_src: "/assets-images/delivery_tracking.jpg.jpeg",
      image_alt: "Tracking intelligence across operations",
      image_fit: "cover",
    },
    {
      year: "2020",
      title: "Software became the command layer",
      description:
        "In-house platforms connected RFID, GPS, BLE, and field data into unified dashboards with ERP-ready integration for clients who needed more than point solutions.",
      image_media_id: null,
      image_src: "/assets-images/vehicle_tracking.jpg.jpeg",
      image_alt: "Integrated tracking software platform",
      image_fit: "cover",
    },
    {
      year: "2023",
      title: "Automating scale with robotics",
      description:
        "We combined modern tag technologies with robotics-led verification so clients can reconcile millions of quantities in hours—not months—across complex physical environments.",
      image_media_id: null,
      image_src: "/assets-images/laptop.png",
      image_alt: "Modern Tag RoBo Tech software and automation stack",
      image_fit: "contain",
    },
  ],
};

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

function asItems(value: unknown): OurJourneyItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_OUR_JOURNEY_ABOUT_SECTION.items];
  }

  return value.map((item, index) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_OUR_JOURNEY_ABOUT_SECTION.items[index] ?? {
      year: "",
      title: "",
      description: "",
      image_media_id: null,
      image_src: "",
      image_alt: "",
      image_fit: "cover" as JourneyImageFit,
    };

    return {
      year: String(row.year ?? fallback.year),
      title: String(row.title ?? fallback.title),
      description: String(row.description ?? fallback.description),
      image_media_id: row.image_media_id ? String(row.image_media_id) : null,
      image_src: String(row.image_src ?? fallback.image_src),
      image_alt: String(row.image_alt ?? fallback.image_alt),
      image_url: row.image_url ? String(row.image_url) : null,
      image_fit: row.image_fit === "contain" ? "contain" : "cover",
    };
  });
}

export function normalizeOurJourneyAboutSectionData(raw: unknown): OurJourneyAboutSectionData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_OUR_JOURNEY_ABOUT_SECTION.tagline),
    heading: String(data.heading ?? DEFAULT_OUR_JOURNEY_ABOUT_SECTION.heading),
    description: String(data.description ?? DEFAULT_OUR_JOURNEY_ABOUT_SECTION.description),
    items: asItems(data.items),
  };
}

export function mergeOurJourneyAboutSectionData(
  cmsData: OurJourneyAboutSectionData | null
): OurJourneyAboutSectionData {
  if (!cmsData) return DEFAULT_OUR_JOURNEY_ABOUT_SECTION;
  return normalizeOurJourneyAboutSectionData(cmsData);
}

export function journeyItemImageSrc(item: OurJourneyItem): string {
  if (item.image_url) return resolveCmsMediaUrl(item.image_url);
  return item.image_src;
}

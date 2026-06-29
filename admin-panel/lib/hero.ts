export type HeroButton = {
  text: string;
  link: string;
};

export type HeroStat = {
  value: string;
  label: string;
};

export type HeroSectionData = {
  background_type: "image" | "video";
  image_id: string | null;
  video_url: string | null;
  video_id: string | null;
  tagline: string;
  badge: string;
  heading: string;
  heading_accent: string;
  description: string;
  primary_button: HeroButton;
  secondary_button: HeroButton;
  stats: HeroStat[];
};

export const DEFAULT_HERO_DATA: HeroSectionData = {
  background_type: "video",
  image_id: null,
  video_url: "https://www.tagrobotech.com/videos/hero.mp4",
  video_id: null,
  tagline: "RFID • IoT • Asset Tracking • Automation",
  badge: "Industry pioneer",
  heading: "Transform Assets Into",
  heading_accent: "Real-Time Intelligence",
  description:
    "The first to bring integrated tag, robotics & technology tracking to enterprises. We help enterprises automate inventory, asset tracking, and operations using RFID, BLE, IoT, and AI-powered technologies.",
  primary_button: { text: "Get free consultation", link: "/contact" },
  secondary_button: { text: "Explore solutions", link: "#services" },
  stats: [
    { value: "500+", label: "Projects Delivered" },
    { value: "99%", label: "Tracking Accuracy" },
    { value: "Worldwide", label: "Support & Service" },
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

function asButton(value: unknown, fallback: HeroButton): HeroButton {
  if (value && typeof value === "object") {
    const btn = value as Record<string, unknown>;
    return {
      text: String(btn.text ?? fallback.text),
      link: String(btn.link ?? fallback.link),
    };
  }
  return fallback;
}

function asStats(value: unknown): HeroStat[] {
  if (!Array.isArray(value)) return DEFAULT_HERO_DATA.stats;
  return value.map((item, index) => {
    const stat = (item ?? {}) as Record<string, unknown>;
    const fallback = DEFAULT_HERO_DATA.stats[index] ?? { value: "", label: "" };
    return {
      value: String(stat.value ?? fallback.value),
      label: String(stat.label ?? fallback.label),
    };
  });
}

export function normalizeHeroData(raw: unknown): HeroSectionData {
  const data = asRecord(raw);

  const hasLegacyOnly =
    data.heading &&
    !data.heading_accent &&
    !data.tagline &&
    !data.primary_button;

  const legacyButton: HeroButton = {
    text: String(data.button_text ?? DEFAULT_HERO_DATA.primary_button.text),
    link: String(data.button_link ?? DEFAULT_HERO_DATA.primary_button.link),
  };

  return {
    background_type:
      data.background_type === "image" || data.background_type === "video"
        ? data.background_type
        : data.image_id
          ? "image"
          : DEFAULT_HERO_DATA.background_type,
    image_id: data.image_id ? String(data.image_id) : null,
    video_url: data.video_url ? String(data.video_url) : null,
    video_id: data.video_id ? String(data.video_id) : null,
    tagline: String(data.tagline ?? DEFAULT_HERO_DATA.tagline),
    badge: String(data.badge ?? DEFAULT_HERO_DATA.badge),
    heading: String(data.heading ?? DEFAULT_HERO_DATA.heading),
    heading_accent: hasLegacyOnly
      ? ""
      : String(data.heading_accent ?? DEFAULT_HERO_DATA.heading_accent),
    description: String(data.description ?? DEFAULT_HERO_DATA.description),
    primary_button: asButton(data.primary_button, legacyButton),
    secondary_button: asButton(data.secondary_button, DEFAULT_HERO_DATA.secondary_button),
    stats: asStats(data.stats).length ? asStats(data.stats) : DEFAULT_HERO_DATA.stats,
  };
}

export function heroDataToPayload(data: HeroSectionData): Record<string, unknown> {
  return { ...data };
}

import defaults from "@/lib/data/services-execution-section-service-page.json";

export type ServicesExecutionButton = {
  text: string;
  link: string;
};

export type ServicesExecutionSectionServicePageData = {
  tagline: string;
  heading: string;
  description: string;
  primary_button: ServicesExecutionButton;
  secondary_button: ServicesExecutionButton;
};

export const DEFAULT_SERVICES_EXECUTION_SECTION_SERVICE_PAGE: ServicesExecutionSectionServicePageData =
  defaults as ServicesExecutionSectionServicePageData;

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

function asButton(value: unknown, fallback: ServicesExecutionButton): ServicesExecutionButton {
  const row = (value ?? {}) as Record<string, unknown>;
  return {
    text: String(row.text ?? fallback.text),
    link: String(row.link ?? fallback.link),
  };
}

export function normalizeServicesExecutionSectionServicePageData(
  raw: unknown
): ServicesExecutionSectionServicePageData {
  const data = asRecord(raw);

  return {
    tagline: String(data.tagline ?? DEFAULT_SERVICES_EXECUTION_SECTION_SERVICE_PAGE.tagline),
    heading: String(data.heading ?? DEFAULT_SERVICES_EXECUTION_SECTION_SERVICE_PAGE.heading),
    description: String(
      data.description ?? DEFAULT_SERVICES_EXECUTION_SECTION_SERVICE_PAGE.description
    ),
    primary_button: asButton(
      data.primary_button,
      DEFAULT_SERVICES_EXECUTION_SECTION_SERVICE_PAGE.primary_button
    ),
    secondary_button: asButton(
      data.secondary_button,
      DEFAULT_SERVICES_EXECUTION_SECTION_SERVICE_PAGE.secondary_button
    ),
  };
}

export function servicesExecutionSectionServicePageToPayload(
  data: ServicesExecutionSectionServicePageData
): Record<string, unknown> {
  return { ...data };
}

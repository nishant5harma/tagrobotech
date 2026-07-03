export type FootprintFeatureIcon =
  | "map-pin"
  | "refresh"
  | "activity"
  | "wrench"
  | "clipboard"
  | "alert"
  | "map"
  | "file"
  | "plug";

export type FootprintFeature = {
  title: string;
  description: string;
  icon: FootprintFeatureIcon;
};

export const FOOTPRINTS_INTRO = {
  eyebrow: "Software",
  name: "Footprints",
  description:
    "We have an in-house software called Footprints, customised for each client based on their on-ground needs. The application has been designed with consumer need analysis.",
  tags: ["9 modules", "ERP via API", "Client-customised"],
} as const;

export const FOOTPRINT_PILLARS = [
  {
    title: "Customised per client",
    description:
      "Every deployment is shaped around your sites, assets, and operational workflows — not a one-size-fits-all template.",
  },
  {
    title: "Need-led design",
    description:
      "Built from consumer need analysis so teams get practical visibility, not cluttered dashboards.",
  },
  {
    title: "ERP-connected",
    description:
      "Seamless integration with your ERP via API for reconciled, audit-ready data flows.",
  },
] as const;

export const FOOTPRINT_FEATURES: FootprintFeature[] = [
  {
    title: "Item visibility & tracking",
    description:
      "You can view geo location where asset was last traced.",
    icon: "map-pin",
  },
  {
    title: "Auto reconciliation",
    description:
      "Reconciliation can be done between book data and physical count.",
    icon: "refresh",
  },
  {
    title: "Utilization monitoring",
    description: "You can identify unutilized assets.",
    icon: "activity",
  },
  {
    title: "Physical condition monitoring",
    description: "Not working assets can be identified.",
    icon: "wrench",
  },
  {
    title: "Maintenance log",
    description: "Check on maintenance records.",
    icon: "clipboard",
  },
  {
    title: "Incident management",
    description:
      "Log of past breakdown can be retrieved including repair details.",
    icon: "alert",
  },
  {
    title: "Location mapping",
    description: "Current location of item can be traced.",
    icon: "map",
  },
  {
    title: "Manual retrieval",
    description:
      "If you wish to retrieve any data point such as machine manual, this can be done very conveniently.",
    icon: "file",
  },
  {
    title: "Integration",
    description: "With your ERP via API.",
    icon: "plug",
  },
];

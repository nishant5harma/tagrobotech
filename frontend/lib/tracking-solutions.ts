export type TrackingSolutionIcon =
  | "building"
  | "box"
  | "handshake"
  | "wrench"
  | "cog"
  | "layers"
  | "store"
  | "truck"
  | "package"
  | "shield"
  | "file"
  | "users"
  | "heart"
  | "palette"
  | "plane"
  | "map"
  | "network"
  | "smartphone"
  | "key"
  | "bird";

export type TrackingSolution = {
  title: string;
  category: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  icon: TrackingSolutionIcon;
};

export const TRACKING_SOLUTIONS: TrackingSolution[] = [
  {
    title: "Fixed Assets",
    category: "Enterprise",
    description:
      "Track machinery, equipment, and capital assets with real-time location and lifecycle visibility.",
    imageSrc: "/assets-images/assets_tracking.jpeg",
    imageAlt: "Fixed assets in office environment",
    icon: "building",
  },
  {
    title: "Finished Goods",
    category: "Inventory",
    description:
      "Monitor finished products across warehouses, dispatch zones, and distribution channels.",
    imageSrc: "/assets-images/finished_goods_tracking.jpg.jpeg",
    imageAlt: "Finished goods in warehouse",
    icon: "box",
  },
  {
    title: "Leased Assets",
    category: "Enterprise",
    description:
      "Manage leased equipment with accurate custody, usage, and return tracking across sites.",
    imageSrc: "/assets-images/leased_assets.jpeg",
    imageAlt: "Leased assets documentation",
    icon: "handshake",
  },
  {
    title: "Tools",
    category: "Operations",
    description:
      "Prevent tool loss and downtime with check-in, check-out, and site-level tool tracking.",
    imageSrc: "/assets-images/tracking_tools.jpg.jpeg",
    imageAlt: "Industrial tools on workbench",
    icon: "wrench",
  },
  {
    title: "Parts & Consumables",
    category: "Inventory",
    description:
      "Track spare parts and consumables to reduce stockouts and optimize replenishment cycles.",
    imageSrc: "/assets-images/parts_consumables.jpeg",
    imageAlt: "Parts and consumables storage",
    icon: "cog",
  },
  {
    title: "Raw Material",
    category: "Manufacturing",
    description:
      "Gain visibility into raw material movement from intake to production and storage.",
    imageSrc: "/assets-images/raw_materials.jpg.jpeg",
    imageAlt: "Raw materials in factory",
    icon: "layers",
  },
  {
    title: "Marketing Assets–kiosks etc",
    category: "Retail",
    description:
      "Track kiosks, displays, and promotional assets deployed across retail and field locations.",
    imageSrc: "/assets-images/marketing_assets.jpg.jpeg",
    imageAlt: "Marketing kiosk in retail space",
    icon: "store",
  },
  {
    title: "Fleet/ Vehicle Tracking",
    category: "Logistics",
    description:
      "Live fleet visibility for route optimization, utilization, and vehicle accountability.",
    imageSrc: "/assets-images/vehicle_tracking.jpg.jpeg",
    imageAlt: "Fleet vehicles on road",
    icon: "truck",
  },
  {
    title: "Deliveries",
    category: "Logistics",
    description:
      "End-to-end delivery tracking from dispatch to proof of delivery and customer handoff.",
    imageSrc: "/assets-images/delivery_tracking.jpg.jpeg",
    imageAlt: "Delivery packages",
    icon: "package",
  },
  {
    title: "Military Equipment",
    category: "Defense",
    description:
      "Secure tracking for defense equipment with audit trails and controlled access visibility.",
    imageSrc: "/assets-images/military_equipment.jpg.jpeg",
    imageAlt: "Military equipment storage",
    icon: "shield",
  },
  {
    title: "Document Tracking",
    category: "Compliance",
    description:
      "Track critical documents through custody chains, approvals, and secure storage locations.",
    imageSrc: "/assets-images/document_tracking.jpg.jpeg",
    imageAlt: "Document tracking files",
    icon: "file",
  },
  {
    title: "Employee Tracking",
    category: "Workforce",
    description:
      "Improve workforce safety and coordination with location-aware employee visibility on site.",
    imageSrc: "/assets-images/employee_tracking.jpg.jpeg",
    imageAlt: "Employees collaborating at work",
    icon: "users",
  },
  {
    title: "Patient Tracking",
    category: "Healthcare",
    description:
      "Support healthcare operations with patient flow, equipment, and care-area tracking.",
    imageSrc: "/assets-images/patient_tracking.jpeg",
    imageAlt: "Patient care in hospital",
    icon: "heart",
  },
  {
    title: "Artwork Tracking",
    category: "Culture",
    description:
      "Protect high-value artwork with movement logs, storage visibility, and exhibition tracking.",
    imageSrc: "/assets-images/artwork_tracking.jpeg",
    imageAlt: "Artwork in gallery",
    icon: "palette",
  },
  {
    title: "Immigration Tracking",
    category: "Government",
    description:
      "Streamline immigration-related asset and document tracking across checkpoints and offices.",
    imageSrc: "/assets-images/immigration_tracking.jpg.jpeg",
    imageAlt: "Immigration and travel checkpoint",
    icon: "plane",
  },
  {
    title: "Landbank Tracking",
    category: "Real Estate",
    description:
      "Monitor land parcels, site assets, and field resources across large landbank portfolios.",
    imageSrc: "/assets-images/landbank_tracking.jpeg",
    imageAlt: "Landbank aerial view",
    icon: "map",
  },
  {
    title: "Supply Chain Tracking",
    category: "Logistics",
    description:
      "Connect suppliers, warehouses, and distribution nodes with unified supply chain visibility.",
    imageSrc:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Supply chain logistics hub",
    icon: "network",
  },
  {
    title: "Personal Tracker",
    category: "Safety",
    description:
      "Lightweight personal tracking for field staff, lone workers, and mobile personnel.",
    imageSrc: "/assets-images/personal___tracking.jpg.jpeg",
    imageAlt: "Personal tracker on mobile device",
    icon: "smartphone",
  },
  {
    title: "Key Tracker",
    category: "Security",
    description:
      "Track keys and access credentials with issue logs, returns, and custody accountability.",
    imageSrc: "/assets-images/key_tracker.jpeg",
    imageAlt: "Keys for access tracking",
    icon: "key",
  },
  {
    title: "Animal Migration Tracking",
    category: "Wildlife",
    description:
      "Monitor wildlife movement patterns with long-range tagging for research and conservation.",
    imageSrc: "/assets-images/animal_migration_tracker.jpeg",
    imageAlt: "Animal migration in nature",
    icon: "bird",
  },
];

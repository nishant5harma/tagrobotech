export type ServiceCategory =
  | "Enterprise"
  | "Inventory"
  | "Logistics"
  | "People"
  | "Specialized";

export type Service = {
  id: string;
  title: string;
  category: ServiceCategory;
  summary: string;
  highlights: string[];
  imageSrc: string;
  imageAlt: string;
  tags?: string[];
};

export const SERVICE_CATEGORIES: Array<{
  id: "all" | ServiceCategory;
  label: string;
}> = [
  { id: "all", label: "All services" },
  { id: "Enterprise", label: "Enterprise" },
  { id: "Inventory", label: "Inventory" },
  { id: "Logistics", label: "Logistics" },
  { id: "People", label: "People & safety" },
  { id: "Specialized", label: "Specialized" },
];

export const SERVICE_PROCESS = [
  {
    step: "01",
    title: "Reconcile",
    description: "Books vs physical reality across plants, offices, and sites.",
  },
  {
    step: "02",
    title: "Tag",
    description: "Bar code, QR, RFID, NFC, or GPS — matched to budget and use case.",
  },
  {
    step: "03",
    title: "Integrate",
    description: "Software and ERP sync for automated future reconciliations.",
  },
  {
    step: "04",
    title: "Monitor",
    description: "Live visibility, alerts, and operational intelligence at scale.",
  },
] as const;

export const SERVICES: Service[] = [
  {
    id: "asset-tracking",
    title: "Asset Tracking",
    category: "Enterprise",
    summary:
      "Reconcile fixed assets as per books versus what is physically present at plants, corporate offices, warehouses, and third-party sites.",
    highlights: [
      "Covers plant & machinery, IT assets, office equipment, furniture & fixtures, dies & moulds, vehicles, and more.",
      "Affix tags (bar code, QR code, RFID, NFC, GPS) based on suitability and budget; tag data is updated in the Fixed Asset Register.",
      "Implement software and ERP integration to enable automated reconciliations going forward.",
      "Supports corporate governance requirements — systematic asset reconciliation with 100% verification within a three-year span.",
    ],
    imageSrc: "/assets-images/assets_tracking.jpeg",
    imageAlt: "Enterprise asset tracking and reconciliation",
    tags: ["RFID", "ERP sync", "Compliance"],
  },
  {
    id: "finished-goods",
    title: "Finished Goods Tracking",
    category: "Inventory",
    summary:
      "Reconcile finished goods inventory as per books versus physical stock across factories, retail outlets, warehouses, and third-party sites.",
    highlights: [
      "Affix bar code, QR code, RFID, NFC, or GPS tags depending on what is most suitable and within budget.",
      "Implement software and ERP integration for automated reconciliations in future cycles.",
      "Ideal for manufacturing and retail environments with high-volume finished goods movement.",
    ],
    imageSrc: "/assets-images/finished_goods_tracking.jpg.jpeg",
    imageAlt: "Finished goods inventory tracking",
    tags: ["Manufacturing", "Retail"],
  },
  {
    id: "leased-assets",
    title: "Leased Assets",
    category: "Enterprise",
    summary:
      "For organizations that lease assets to third-party customers, our team verifies assets on site and affixes geo tags for remote verification.",
    highlights: [
      "On-ground site visits to confirm asset existence and condition.",
      "Geo-enabled tagging for continuous remote monitoring after verification.",
      "Supports asset-leasing businesses that need custody visibility across customer locations.",
    ],
    imageSrc: "/assets-images/leased_assets.jpeg",
    imageAlt: "Leased asset verification",
    tags: ["Geo tags", "Site visits"],
  },
  {
    id: "tools",
    title: "Tools Tracking",
    category: "Inventory",
    summary:
      "Track tools issued to ancillaries and third parties for production activities with verified custody and remote visibility.",
    highlights: [
      "Our team verifies tools on site and affixes geo tags for future remote verification.",
      "Reduces loss and ambiguity when tools move across vendor and production locations.",
      "Supports accountability for high-value or shared tooling across the supply chain.",
    ],
    imageSrc: "/assets-images/tracking_tools.jpg.jpeg",
    imageAlt: "Industrial tools tracking",
    tags: ["Geo tags", "Vendor sites"],
  },
  {
    id: "parts-consumables",
    title: "Parts & Consumables",
    category: "Inventory",
    summary:
      "Reconcile high-volume parts and consumables between books and physical quantities, then tag items for accurate consumption tracking.",
    highlights: [
      "Quantity reconciliation between ledger records and on-ground stock.",
      "Tagging of parts and consumables to improve consumption accuracy over time.",
      "Helps reduce write-offs, stockouts, and untracked usage across facilities.",
    ],
    imageSrc: "/assets-images/parts_consumables.jpeg",
    imageAlt: "Parts and consumables tracking",
    tags: ["Consumption", "Reconciliation"],
  },
  {
    id: "raw-material",
    title: "Raw Material",
    category: "Inventory",
    summary:
      "Reconcile large volumes of raw material between books and what is physically present across storage and production locations.",
    highlights: [
      "Handles high-volume raw material inventories with structured physical verification.",
      "Bridges the gap between accounting records and warehouse or yard-level reality.",
      "Foundation for tighter production planning and inventory control.",
    ],
    imageSrc: "/assets-images/raw_materials.jpg.jpeg",
    imageAlt: "Raw material inventory tracking",
    tags: ["Manufacturing", "Inventory"],
  },
  {
    id: "marketing-assets",
    title: "Marketing Assets",
    category: "Enterprise",
    summary:
      "Physically verify marketing and branding assets — including kiosks and premium signages — across dispersed locations and reconcile records.",
    highlights: [
      "Some marketing assets are extremely expensive; physical existence must be confirmed on site.",
      "Reconciliation of deployed branding assets across retail, field, and partner locations.",
      "Affix tags for remote monitoring after verification is complete.",
    ],
    imageSrc: "/assets-images/marketing_assets.jpg.jpeg",
    imageAlt: "Marketing assets and kiosk tracking",
    tags: ["Kiosks", "Signage"],
  },
  {
    id: "fleet-vehicle",
    title: "Fleet / Vehicle Tracking",
    category: "Logistics",
    summary:
      "GPS devices fitted in vehicles for route intelligence, driver safety, fuel monitoring, and real-time fleet visibility.",
    highlights: [
      "Pick less congested routes and monitor or control vehicle speed.",
      "Exact vehicle location, breakdown alerts, and assistance workflows.",
      "Vehicle stock handover status, driver health alerts, fuel tracking, and fitness alerts.",
    ],
    imageSrc: "/assets-images/vehicle_tracking.jpg.jpeg",
    imageAlt: "Fleet and vehicle GPS tracking",
    tags: ["GPS", "Fleet ops"],
  },
  {
    id: "deliveries",
    title: "Deliveries",
    category: "Logistics",
    summary:
      "Localize packages and parcels during sorting and delivery to verify movement, source, and estimated arrival windows.",
    highlights: [
      "Customers receive route details, delivery status, estimated delivery date, and time.",
      "Bar code systems combined with our application enable real-time delivery tracking.",
      "Improves last-mile transparency for courier and logistics operations.",
    ],
    imageSrc: "/assets-images/delivery_tracking.jpg.jpeg",
    imageAlt: "Courier and delivery tracking",
    tags: ["Last mile", "Real-time"],
  },
  {
    id: "military-equipment",
    title: "Military Equipment",
    category: "Specialized",
    summary:
      "Defense-grade asset tracking across a highly mobile supply chain that demands comprehensive oversight and auditability.",
    highlights: [
      "Mobility is a key differentiator in military applications — constant movement throughout the chain.",
      "Geo tags affixed on defence assets for real-time location monitoring.",
      "Designed for organizations that require rigorous asset visibility under demanding conditions.",
    ],
    imageSrc: "/assets-images/military_equipment.jpg.jpeg",
    imageAlt: "Military equipment tracking",
    tags: ["Defense", "Geo tags"],
  },
  {
    id: "document-tracking",
    title: "Document Tracking",
    category: "Specialized",
    summary:
      "RFID file tracking systems that reduce time spent managing hundreds or thousands of files in enterprise workplaces.",
    highlights: [
      "EPC numbers are associated with file metadata such as name, contents, and custody.",
      "Search by name or number in software, then locate files with an RFID handheld reader.",
      "Works with dedicated file-management software or structured Excel-based workflows.",
    ],
    imageSrc: "/assets-images/document_tracking.jpg.jpeg",
    imageAlt: "RFID document and file tracking",
    tags: ["RFID", "Files"],
  },
  {
    id: "employee-tracking",
    title: "Employee Tracking",
    category: "People",
    summary:
      "Real-time employee tracking using active RFID and Bluetooth Low Energy beacon technology on rechargeable ID badges.",
    highlights: [
      "Badges may include panic buttons and motion sensors for safety-critical environments.",
      "Receivers and RTLS anchors installed across the work area track badge movement.",
      "Supports workforce coordination, safety, and site-level personnel visibility.",
    ],
    imageSrc: "/assets-images/employee_tracking.jpg.jpeg",
    imageAlt: "Employee RTLS and badge tracking",
    tags: ["BLE", "RTLS"],
  },
  {
    id: "patient-tracking",
    title: "Patient Tracking",
    category: "People",
    summary:
      "RFID solutions for healthcare — improving patient safety, identification, inventory control, and staff coordination.",
    highlights: [
      "Patient identification and anti-counterfeiting across care workflows.",
      "Inventory management and tracking of healthcare staff movement where required.",
      "Supports hospitals and care facilities focused on safety and operational efficiency.",
    ],
    imageSrc: "/assets-images/patient_tracking.jpeg",
    imageAlt: "Healthcare patient tracking",
    tags: ["Healthcare", "RFID"],
  },
  {
    id: "artwork-tracking",
    title: "Artwork Tracking",
    category: "Specialized",
    summary:
      "RFID art tracking with camera integration for real-time asset management and built-in theft deterrent monitoring.",
    highlights: [
      "Artwork and high-value assets monitored on display, in storage, during transfer, or after sale.",
      "Authorities are quickly alerted to tampering or unauthorized movement.",
      "Designed for galleries, museums, and collectors managing valuable collections.",
    ],
    imageSrc: "/assets-images/artwork_tracking.jpeg",
    imageAlt: "Artwork and gallery asset tracking",
    tags: ["Galleries", "Security"],
  },
  {
    id: "immigration-tracking",
    title: "Immigration Tracking",
    category: "Specialized",
    summary:
      "Secure document tracking as governments modernize immigration systems beyond paper-only passports and visas.",
    highlights: [
      "Addresses forgery risks that allow illegal travel, residence, and unregulated work.",
      "RFID memory chips embedded in documents are a defining method in modern border systems.",
      "Supports agencies reforming immigration and migration verification infrastructure.",
    ],
    imageSrc: "/assets-images/immigration_tracking.jpg.jpeg",
    imageAlt: "Immigration document tracking",
    tags: ["Government", "RFID"],
  },
  {
    id: "landbank-tracking",
    title: "Landbank Tracking",
    category: "Enterprise",
    summary:
      "Precise land-bank area measurement for agriculture — because exact farming is impossible without knowing the real acreage.",
    highlights: [
      "Measure arable land by traversing boundaries with a mobile GPS area-measurement application.",
      "Create electronic field maps from satellite imagery inside the system interface.",
      "Partner-led orthophoto plans using drones to determine field area with high accuracy.",
    ],
    imageSrc: "/assets-images/landbank_tracking.jpeg",
    imageAlt: "Landbank and field area tracking",
    tags: ["Agriculture", "GPS"],
  },
  {
    id: "supply-chain",
    title: "Supply Chain Tracking",
    category: "Logistics",
    summary:
      "RFID tags on containers and goods eliminate manual scanning bottlenecks and reduce human error in warehouse movement.",
    highlights: [
      "Goods are automatically read as they pass readers — no barcode scan per item required.",
      "Saves hours previously lost searching for missing materials when tracking is skipped.",
      "Reduces data-entry errors every time inventory is added, moved, or updated.",
    ],
    imageSrc: "/assets-images/delivery_tracking.jpg.jpeg",
    imageAlt: "Supply chain and warehouse RFID tracking",
    tags: ["Warehouse", "RFID"],
  },
  {
    id: "personal-tracker",
    title: "Personal Tracker",
    category: "People",
    summary:
      "Personal trackers monitor people or pets through compact devices such as pocket chips or bracelets.",
    highlights: [
      "Devices are activated after deployment and followed remotely by authorized users.",
      "Suitable for lone workers, family safety, and pet monitoring use cases.",
      "Lightweight form factors designed for everyday carry or wear.",
    ],
    imageSrc: "/assets-images/personal___tracking.jpg.jpeg",
    imageAlt: "Personal GPS tracker device",
    tags: ["Safety", "Wearables"],
  },
  {
    id: "key-tracker",
    title: "Key Tracker",
    category: "Specialized",
    summary:
      "Compact Bluetooth tag trackers for keys, spectacles, wallets, flash drives, and everyday objects.",
    highlights: [
      "Avoid searching throughout the house — locate tagged items from a mobile app.",
      "Trackers are coin-sized and easily clipped or stuck onto daily essentials.",
      "Ideal for homes, offices, and shared facilities with high object mobility.",
    ],
    imageSrc: "/assets-images/key_tracker.jpeg",
    imageAlt: "Bluetooth key tracker",
    tags: ["Bluetooth", "Consumer"],
  },
  {
    id: "animal-migration",
    title: "Animal Migration Tracking",
    category: "Specialized",
    summary:
      "Satellite telemetry for wildlife research — tracking animal movement for extended periods without repeated capture.",
    highlights: [
      "Platform Transmitter Terminals (PTTs) attached externally or surgically implanted after capture.",
      "PTTs communicate via radio signals to orbiting satellites for latitude and longitude fixes.",
      "Widely used Argos satellite system receives signals when satellites are within PTT range.",
    ],
    imageSrc: "/assets-images/animal_migration_tracker.jpeg",
    imageAlt: "Wildlife migration satellite tracking",
    tags: ["Wildlife", "Satellite"],
  },
];

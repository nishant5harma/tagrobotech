export type TrackingTool = {
  id: string;
  title: string;
  summary: string;
  description: string;
  highlights: string[];
  steps?: string[];
  imageSrc: string;
  imageAlt: string;
  tags: string[];
};

export const TOOLS_INTRO = {
  eyebrow: "Tools",
  headline: "Tools that track?",
  description:
    "We have more than 100 tools and technologies from across the globe to help deliver your tracking requirements. Some of our flagship deployment tools are highlighted below.",
  stat: "100+",
  statLabel: "Tools & technologies worldwide",
} as const;

export const TRACKING_TOOLS: TrackingTool[] = [
  {
    id: "drone-scanning",
    title: "Drone Scanning",
    summary:
      "A modern, sophisticated approach to inventory and asset tracking — drones fitted with bar code or RFID scanners fly warehouse aisles and auto-sync scan data to your inventory system.",
    description:
      "Drones fly within warehouse aisles and scan tags; scan data is automatically transferred from drone memory to your inventory management system. Flights can be pre-timed at night or scheduled in dedicated slots. Best suited for environments where inventory is stacked properly.",
    highlights: [
      "Improve safety when counting inventory",
      "Make tasks less laborious",
      "Automate inventory tasks",
      "Avoid interrupting operations",
      "Reduce material resources and their occupancy rate",
      "Enrich inventory tasks and optimize human resources",
      "Automatically integrate data into your inventory management system",
    ],
    imageSrc:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Drone scanning inventory in a warehouse",
    tags: ["Warehouse", "RFID", "Automation"],
  },
  {
    id: "robotic-scanning",
    title: "Robotic Scanning",
    summary:
      "Ideal for retail — autonomous robots scan inventory and assets across outlets, plants, warehouses, and offices with advanced shelf and stock intelligence.",
    description:
      "Robotic scanners move through retail and industrial environments, reading tags and delivering operational insights beyond a simple stock count. Built for organizations that need continuous, repeatable verification at scale.",
    highlights: [
      "Conducting stock takes",
      "Identifying products kept out of place",
      "Identifying gap-fill points",
      "Highlighting shrinkages",
      "Safety stock reporting",
      "Out-of-stock reporting",
    ],
    imageSrc:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Robotic scanning in a retail environment",
    tags: ["Retail", "Robotics", "Stock take"],
  },
  {
    id: "rfid-fixed-readers",
    title: "RFID Fixed Readers",
    summary:
      "Installed at fixed entry, exit, and bay points — reads RFID tags on inventory and assets passing within proximity, with no line-of-sight scanning required.",
    description:
      "Suitable for factories, warehouses, and corporate offices. All items passing within approximately 10 metres can be read via this reader — a strong fit for high-volume inventory and asset movement zones.",
    highlights: [
      "Reading with no line-of-sight or item-by-item scans required",
      "Multiple tags can be read at a time",
      "Technology automates data collection and vastly reduces human effort and error",
    ],
    imageSrc: "/assets-images/finished_goods_tracking.jpg.jpeg",
    imageAlt: "RFID fixed reader at a warehouse entry point",
    tags: ["Fixed install", "10m range", "Gate reads"],
  },
  {
    id: "rfid-handheld-readers",
    title: "RFID Handheld Readers",
    summary:
      "The most common tool for stock and asset verification — with read range up to 10 metres and clear advantages over conventional bar code readers.",
    description:
      "Typically offering read range up to 10 metres, RFID handheld readers score over conventional bar code readers in terms of read range, read rate, and automated reconciliations.",
    steps: [
      "Asset or inventory information is uploaded in the scanner",
      "Tags are scanned by the handheld reader",
      "Upon scanning, asset or inventory records are auto-reconciled between book record and physical reading",
    ],
    highlights: [
      "Read range up to 10 metres",
      "Higher read rate than conventional bar code readers",
      "Auto reconciliation between books and physical stock",
      "Most widely deployed tool for field verification",
    ],
    imageSrc: "/assets-images/tracking_tools.jpg.jpeg",
    imageAlt: "RFID handheld reader for asset verification",
    tags: ["Handheld", "Verification", "Reconciliation"],
  },
  {
    id: "mobile-tag-scanning",
    title: "Mobile Tag Scanning",
    summary:
      "Lightweight mobile applications to scan bar code and QR code tags — linked to your stock or asset management application for instant reconciliation reports.",
    description:
      "A cost-effective entry point for organizations that need quick deployment, low reader investment, and semi-automated tracking workflows.",
    highlights: [
      "Software cost is very low",
      "Quick to implement",
      "Minimal investment in readers",
      "Semi-automation can be achieved",
      "Short, excess, and reconciled reports generated automatically",
    ],
    imageSrc: "/assets-images/personal___tracking.jpg.jpeg",
    imageAlt: "Mobile tag scanning application",
    tags: ["Mobile app", "Bar code", "QR code"],
  },
];

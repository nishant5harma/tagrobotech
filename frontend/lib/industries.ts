export type IndustryIcon =
  | "car"
  | "cup"
  | "monitor"
  | "factory"
  | "pill"
  | "shopping"
  | "package"
  | "sprout"
  | "hardhat"
  | "pickaxe"
  | "cog"
  | "radio"
  | "megaphone"
  | "building"
  | "trending"
  | "truck"
  | "health"
  | "network"
  | "flame"
  | "education"
  | "boxes";

export type Industry = {
  name: string;
  projects: string;
  icon: IndustryIcon;
  accent: string;
  imageSrc: string;
  imageAlt: string;
};

export const INDUSTRY_STATS = [
  { value: "18099+", label: "Projects" },
  { value: "6791+", label: "Locations" },
  { value: "5000+", label: "Alliances" },
  { value: "100M+", label: "Assets" },
] as const;

export const INDUSTRIES: Industry[] = [
  {
    name: "Auto OEM",
    projects: "800+",
    icon: "car",
    accent: "from-blue-600/80 to-blue-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Automotive manufacturing",
  },
  {
    name: "Beverages",
    projects: "450+",
    icon: "cup",
    accent: "from-amber-500/80 to-amber-800/40",
    imageSrc:
      "https://images.unsplash.com/photo-1546173159-3157242dee10?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Beverage production",
  },
  {
    name: "IT Companies",
    projects: "250+",
    icon: "monitor",
    accent: "from-sky-500/80 to-sky-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=700&q=80",
    imageAlt: "IT company workspace",
  },
  {
    name: "Food Processing",
    projects: "300+",
    icon: "factory",
    accent: "from-orange-500/80 to-orange-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1565514020176-7d0c8b8e3f1e?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Food processing facility",
  },
  {
    name: "Pharma",
    projects: "780+",
    icon: "pill",
    accent: "from-teal-500/80 to-teal-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Pharmaceutical industry",
  },
  {
    name: "Retail",
    projects: "960+",
    icon: "shopping",
    accent: "from-rose-500/80 to-rose-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Retail store",
  },
  {
    name: "FMCG",
    projects: "1100+",
    icon: "package",
    accent: "from-violet-500/80 to-violet-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80",
    imageAlt: "FMCG warehouse",
  },
  {
    name: "Agriculture",
    projects: "640+",
    icon: "sprout",
    accent: "from-green-500/80 to-green-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1500382017468-90403fed7ef7?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Agriculture fields",
  },
  {
    name: "Construction",
    projects: "520+",
    icon: "hardhat",
    accent: "from-yellow-500/80 to-yellow-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Construction site",
  },
  {
    name: "Mining",
    projects: "240+",
    icon: "pickaxe",
    accent: "from-stone-500/80 to-stone-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Mining operations",
  },
  {
    name: "Steel",
    projects: "130+",
    icon: "cog",
    accent: "from-slate-500/80 to-slate-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f04?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Steel industry",
  },
  {
    name: "Telecom",
    projects: "100+",
    icon: "radio",
    accent: "from-indigo-500/80 to-indigo-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Telecom infrastructure",
  },
  {
    name: "Advertising",
    projects: "600+",
    icon: "megaphone",
    accent: "from-fuchsia-500/80 to-fuchsia-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Advertising agency",
  },
  {
    name: "Real Estate",
    projects: "400+",
    icon: "building",
    accent: "from-cyan-500/80 to-cyan-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Real estate buildings",
  },
  {
    name: "Marketing",
    projects: "150+",
    icon: "trending",
    accent: "from-pink-500/80 to-pink-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Marketing analytics",
  },
  {
    name: "Transport",
    projects: "700+",
    icon: "truck",
    accent: "from-blue-500/80 to-blue-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1601584115197-04a0ed542f9f?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Transport logistics",
  },
  {
    name: "Health",
    projects: "200+",
    icon: "health",
    accent: "from-red-500/80 to-red-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508a1e?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Healthcare services",
  },
  {
    name: "Distribution",
    projects: "500+",
    icon: "network",
    accent: "from-emerald-500/80 to-emerald-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Distribution network",
  },
  {
    name: "Coal",
    projects: "300+",
    icon: "flame",
    accent: "from-neutral-600/80 to-neutral-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Energy sector",
  },
  {
    name: "Education",
    projects: "100+",
    icon: "education",
    accent: "from-purple-500/80 to-purple-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Education campus",
  },
  {
    name: "Commodity",
    projects: "350+",
    icon: "boxes",
    accent: "from-amber-600/80 to-amber-900/40",
    imageSrc:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Commodity storage",
  },
];

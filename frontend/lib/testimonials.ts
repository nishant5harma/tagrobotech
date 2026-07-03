export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  companyLogo?: string;
  rating: number;
  highlight?: string;
};

export const TESTIMONIAL_STATS = [
  { value: "4.9/5", label: "Client satisfaction" },
  { value: "500+", label: "Projects delivered" },
  { value: "10+", label: "Years of trust" },
] as const;

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "mahindra",
    quote:
      "Tag RoBo Tech transformed how we track fleet and fixed assets across plants. Real-time visibility cut audit time by 60% and gave our operations team confidence they never had before.",
    author: "Rajesh Mehta",
    role: "Head of Operations",
    company: "Mahindra",
    companyLogo: "/images/mahindra.png",
    rating: 5,
    highlight: "60% faster audits",
  },
  {
    id: "flipkart",
    quote:
      "From warehouse pallets to high-value equipment, their RFID and GPS stack scaled with us. Footprints software became our single source of truth for asset movement and accountability.",
    author: "Priya Sharma",
    role: "Supply Chain Director",
    company: "Flipkart",
    companyLogo: "/images/flipkart.png",
    rating: 5,
    highlight: "End-to-end visibility",
  },
  {
    id: "tata-capital",
    quote:
      "We needed enterprise-grade tracking without disrupting daily workflows. Tag RoBo delivered a tailored solution — deployment was smooth, support is responsive, and accuracy has been outstanding.",
    author: "Anil Verma",
    role: "IT Infrastructure Lead",
    company: "Tata Capital",
    companyLogo: "/images/tata__capital__logo.png",
    rating: 5,
    highlight: "Enterprise-ready rollout",
  },
  {
    id: "max-healthcare",
    quote:
      "Patient and equipment tracking in a hospital environment demands precision. Their team understood our compliance needs and built a system our staff actually enjoys using every day.",
    author: "Dr. Kavita Nair",
    role: "Hospital Administrator",
    company: "Max Healthcare",
    companyLogo: "/images/max.png",
    rating: 5,
    highlight: "Healthcare-grade accuracy",
  },
  {
    id: "hcl",
    quote:
      "Across multiple campuses, we finally have unified asset intelligence. The dashboards are intuitive, integrations were handled professionally, and ROI was visible within the first quarter.",
    author: "Suresh Iyer",
    role: "Facilities Manager",
    company: "HCL",
    companyLogo: "/images/hcl.png",
    rating: 5,
    highlight: "ROI in one quarter",
  },
];

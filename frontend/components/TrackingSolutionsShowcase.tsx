"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductHighlightCard } from "@/components/ui/product-card";
import type { TrackingSolutionCard } from "@/lib/track-section";

const FILTERS: Array<
  | { id: "all"; label: string }
  | { id: string; label: string; categories: string[] }
> = [
  { id: "all", label: "All solutions" },
  {
    id: "enterprise",
    label: "Enterprise",
    categories: ["Enterprise", "Inventory", "Manufacturing", "Operations", "Retail", "Real Estate"],
  },
  { id: "logistics", label: "Logistics", categories: ["Logistics"] },
  { id: "people", label: "People", categories: ["Workforce", "Healthcare", "Safety"] },
  {
    id: "specialized",
    label: "Specialized",
    categories: ["Defense", "Compliance", "Security", "Government", "Culture", "Wildlife"],
  },
];

type TrackingSolutionsShowcaseProps = {
  solutions: TrackingSolutionCard[];
};

export default function TrackingSolutionsShowcase({ solutions }: TrackingSolutionsShowcaseProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = useMemo(() => {
    if (activeFilter === "all") return solutions;
    const filter = FILTERS.find((item) => item.id === activeFilter);
    if (!filter || !("categories" in filter)) return solutions;
    return solutions.filter((item) => filter.categories.includes(item.category));
  }, [activeFilter, solutions]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-neutral-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] font-medium text-neutral-500">
          <span className="font-bold text-[#0f2744]">{filtered.length}</span> solutions shown
        </p>

        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${
                activeFilter === filter.id
                  ? "bg-[#0f2744] text-white shadow-[0_8px_20px_rgba(15,39,68,0.2)]"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <ProductHighlightCard
              key={`${product.title}-${product.category}`}
              title={product.title}
              description={product.description}
              imageSrc={product.imageSrc}
              imageAlt={product.imageAlt}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

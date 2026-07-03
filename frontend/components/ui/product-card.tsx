"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductHighlightCardProps {
  className?: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export const ProductHighlightCard = React.forwardRef<
  HTMLDivElement,
  ProductHighlightCardProps
>(
  (
    {
      className,
      title,
      description,
      imageSrc,
      imageAlt,
    },
    ref,
  ) => {
    return (
      <motion.article
        ref={ref}
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -6 }}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200/80 transition-shadow duration-300 hover:shadow-[0_24px_48px_rgba(15,39,68,0.12)]",
          className,
        )}
      >
        <div className="relative h-[168px] overflow-hidden sm:h-[180px]">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="line-clamp-3 flex-1 text-[13px] leading-6 text-neutral-600">
            {description}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
            <h3 className="text-[15px] font-bold leading-tight tracking-tight text-[#0f2744] sm:text-[16px]">
              {title}
            </h3>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f97316] text-white transition-transform duration-300 group-hover:scale-110">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </motion.article>
    );
  },
);

ProductHighlightCard.displayName = "ProductHighlightCard";

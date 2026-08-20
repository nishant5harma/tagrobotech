"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { featuredImageSrc, type MegaMenuData } from "@/lib/mega-menu";

type MegaMenuDropdownProps = {
  menu: MegaMenuData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isActive?: boolean;
};

export default function MegaMenuDropdown({
  menu,
  open,
  onOpenChange,
  isActive = false,
}: MegaMenuDropdownProps) {
  const featuredImage = featuredImageSrc(menu.featured);

  return (
    <li
      className="relative"
      onMouseEnter={() => onOpenChange(true)}
      onMouseLeave={() => onOpenChange(false)}
    >
      <button
        type="button"
        className={`relative inline-flex items-center gap-1 whitespace-nowrap px-3.5 py-2 text-[15px] tracking-[-0.015em] transition-colors ${
          isActive || open
            ? "font-semibold text-[#0f2744]"
            : "font-normal text-neutral-600 hover:text-[#0f2744]"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => onOpenChange(!open)}
      >
        {menu.label}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
        {isActive ? (
          <span
            className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-[#f97316]"
            aria-hidden="true"
          />
        ) : null}
      </button>

      <div
        className={`absolute left-1/2 top-full z-50 w-[min(96vw,1180px)] -translate-x-1/2 pt-3 transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-[1.25rem] border border-neutral-200 bg-white shadow-[0_24px_60px_rgba(15,39,68,0.12)]">
          <div className="grid lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)]">
            <aside className="border-b border-neutral-200 bg-[#f8fafc] px-5 py-5 lg:border-b-0 lg:border-r lg:px-6 lg:py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f97316]">
                {menu.intro_tagline}
              </p>
              <p className="mt-2 text-[13px] leading-5 text-neutral-600 line-clamp-3">
                {menu.intro_description}
              </p>

              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f97316]">
                  {menu.featured.tagline}
                </p>
                <Link
                  href={menu.featured.href || "#"}
                  className="mt-2.5 block overflow-hidden rounded-xl border border-[#0f2744]/10 bg-white shadow-[0_8px_20px_rgba(15,39,68,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,39,68,0.1)]"
                  onClick={() => onOpenChange(false)}
                >
                  <div className="relative h-24 bg-[#fff7ed]">
                    <Image
                      src={featuredImage}
                      alt={menu.featured.image_alt || menu.featured.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="text-[13px] font-semibold leading-5 text-[#0f2744] line-clamp-2">
                      {menu.featured.title}
                    </p>
                  </div>
                </Link>
              </div>
            </aside>

            <div className="grid gap-0 px-4 py-5 md:grid-cols-2 xl:grid-cols-3 xl:px-5">
              {menu.columns.map((column) => (
                <div
                  key={column.title}
                  className="border-neutral-200 px-3 py-1 md:border-r md:px-4 md:last:border-r-0 xl:px-5"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f97316]">
                    {column.title}
                  </p>
                  {column.subtitle ? (
                    <p className="mt-0.5 text-[11px] leading-4 text-neutral-500 line-clamp-1">
                      {column.subtitle}
                    </p>
                  ) : null}
                  <ul className="mt-3 space-y-2">
                    {column.items.map((item) => (
                      <li key={`${column.title}-${item.label}`}>
                        <Link
                          href={item.href || "#"}
                          className="group block transition-colors"
                          onClick={() => onOpenChange(false)}
                        >
                          <span className="block text-[13px] font-semibold leading-5 text-[#0f2744] group-hover:text-[#f97316]">
                            {item.label}
                          </span>
                          {item.description ? (
                            <span className="mt-0.5 block text-[11px] leading-4 text-neutral-500 line-clamp-1">
                              {item.description}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { featuredImageSrc, type ResourcesMegaMenuData } from "@/lib/resources-mega-menu";

type ResourcesMegaMenuProps = {
  menu: ResourcesMegaMenuData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isActive?: boolean;
};

export default function ResourcesMegaMenu({
  menu,
  open,
  onOpenChange,
  isActive = false,
}: ResourcesMegaMenuProps) {
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
        <div className="overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white shadow-[0_24px_60px_rgba(15,39,68,0.12)]">
          <div className="grid lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
            <aside className="border-b border-neutral-200 bg-[#f8fafc] p-8 lg:border-b-0 lg:border-r">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
                {menu.intro_tagline}
              </p>
              <p className="mt-4 text-[15px] leading-7 text-neutral-600">
                {menu.intro_description}
              </p>

              <div className="mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
                  {menu.featured.tagline}
                </p>
                <Link
                  href={menu.featured.href || "#"}
                  className="mt-4 block overflow-hidden rounded-[1.25rem] border border-[#0f2744]/10 bg-white shadow-[0_12px_30px_rgba(15,39,68,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,39,68,0.12)]"
                  onClick={() => onOpenChange(false)}
                >
                  <div className="relative h-36 bg-[#fff7ed]">
                    <Image
                      src={featuredImage}
                      alt={menu.featured.image_alt || menu.featured.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[14px] font-semibold leading-6 text-[#0f2744]">
                      {menu.featured.title}
                    </p>
                  </div>
                </Link>
              </div>
            </aside>

            <div className="grid gap-0 p-8 md:grid-cols-2 xl:grid-cols-3">
              {menu.columns.map((column) => (
                <div
                  key={column.title}
                  className="border-neutral-200 px-0 py-0 md:border-r md:px-6 md:last:border-r-0 xl:px-8"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
                    {column.title}
                  </p>
                  {column.subtitle ? (
                    <p className="mt-1 text-[12px] text-neutral-500">{column.subtitle}</p>
                  ) : null}
                  <ul className="mt-5 space-y-2.5">
                    {column.items.map((item) => (
                      <li key={`${column.title}-${item.label}`}>
                        <Link
                          href={item.href || "#"}
                          className="block text-[14px] font-medium text-[#0f2744] transition-colors hover:text-[#f97316]"
                          onClick={() => onOpenChange(false)}
                        >
                          {item.label}
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

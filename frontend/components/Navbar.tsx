"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CONTACT_PHONE,
  MEGA_MENU_ORDER,
  NAV_LINKS_AFTER_MEGA,
  NAV_LINKS_BEFORE_MEGA,
  SOCIAL_LINKS,
} from "@/lib/constants";
import MegaMenuDropdown from "@/components/MegaMenuDropdown";
import type { MegaMenuData, MegaMenuKind } from "@/lib/mega-menu";
import type { SiteBrandingSettings } from "@/lib/site-settings";

type NavbarProps = {
  visible?: boolean;
  megaMenus?: Partial<Record<MegaMenuKind, MegaMenuData>>;
  branding?: SiteBrandingSettings;
};

const HEADER_OFFSET = "top-[108px]";

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8a15.9 15.9 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 9.5V7.7c0-.8.6-1 1-.1h1.7V4h-2.3C12 4 10.5 5.5 10.5 7.9V9.5H8v2.8h2.5V20h3V12.3h2.2l.3-2.8H13.5z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 4H22l-6.8 7.8L22.7 20h-4.2l-3.3-4.3L10.8 20H4.7l7.3-8.3L4 4h4.3l3 3.9L18.9 4zm-1.5 14.3h1.2L7.8 5.6H6.5l10.9 12.7z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.5 9.5H9v10.5H6.5V9.5zM7.8 4a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11 9.5h2.4v1.4h.1c.3-.6 1.2-1.4 2.5-1.4 2.7 0 3.2 1.8 3.2 4.1V20H16.3v-5.2c0-1.2 0-2.8-1.7-2.8-1.7 0-2 1.3-2 2.7V20H11V9.5z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

const SOCIAL_ICONS = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  X: XIcon,
  LinkedIn: LinkedInIcon,
} as const;

export default function Navbar({ visible = true, megaMenus = {}, branding }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMegaMenu, setOpenMegaMenu] = useState<MegaMenuKind | null>(null);
  const [mobileOpenMegaMenu, setMobileOpenMegaMenu] = useState<MegaMenuKind | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href;
  };

  const isMegaMenuActive = (kind: MegaMenuKind) => pathname.startsWith(`/${kind}`);

  const navLinksBeforeMegaMenus = NAV_LINKS_BEFORE_MEGA;
  const navLinksAfterMegaMenus = NAV_LINKS_AFTER_MEGA;
  const navbarLogoSrc = branding?.navbar_logo_url || "/images/Tag-Robo-Tech.png";
  const navbarLogoAlt = branding?.navbar_logo_alt || branding?.site_name || "Tag RoBo Tech";
  const navbarLogoWidth = Math.max(80, Number(branding?.navbar_logo_width || 230));
  const navbarLogoHeight = Math.max(24, Number(branding?.navbar_logo_height || 39));

  function renderNavLink(
    link: (typeof NAV_LINKS_BEFORE_MEGA)[number] | (typeof NAV_LINKS_AFTER_MEGA)[number],
    mobile = false
  ) {
    if (mobile) {
      return (
        <li key={link.href}>
          <Link
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className={`block rounded-xl px-4 py-3.5 text-[16px] tracking-[-0.015em] transition-colors ${
              isActive(link.href)
                ? "bg-neutral-50 font-semibold text-[#0f2744]"
                : "font-normal text-neutral-700 hover:bg-neutral-50 hover:text-[#0f2744]"
            }`}
          >
            {link.label}
          </Link>
        </li>
      );
    }

    return (
      <li key={link.href}>
        <Link
          href={link.href}
          className={`relative whitespace-nowrap px-3.5 py-2 text-[15px] tracking-[-0.015em] transition-colors ${
            isActive(link.href)
              ? "font-semibold text-[#0f2744]"
              : "font-normal text-neutral-600 hover:text-[#0f2744]"
          }`}
        >
          {link.label}
          {isActive(link.href) ? (
            <span
              className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-[#f97316]"
              aria-hidden="true"
            />
          ) : null}
        </Link>
      </li>
    );
  }

  function renderMobileMegaMenu(kind: MegaMenuKind) {
    const menu = megaMenus[kind];
    if (!menu) return null;

    const isOpen = mobileOpenMegaMenu === kind;

    return (
      <li key={kind}>
        <button
          type="button"
          onClick={() => setMobileOpenMegaMenu(isOpen ? null : kind)}
          className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-[16px] tracking-[-0.015em] transition-colors ${
            isMegaMenuActive(kind)
              ? "bg-neutral-50 font-semibold text-[#0f2744]"
              : "font-normal text-neutral-700 hover:bg-neutral-50 hover:text-[#0f2744]"
          }`}
        >
          {menu.label}
          <span className="text-sm text-neutral-400">{isOpen ? "−" : "+"}</span>
        </button>

        {isOpen ? (
          <div className="mt-1 space-y-4 rounded-xl bg-neutral-50 px-4 py-4">
            <p className="text-[13px] leading-6 text-neutral-600">{menu.intro_description}</p>
            {menu.columns.map((column) => (
              <div key={column.title}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f97316]">
                  {column.title}
                </p>
                <ul className="mt-2 space-y-2">
                  {column.items.map((item) => (
                    <li key={`${column.title}-${item.label}`}>
                      <Link
                        href={item.href || "#"}
                        onClick={() => {
                          setMenuOpen(false);
                          setMobileOpenMegaMenu(null);
                        }}
                        className="block text-[14px] font-medium text-[#0f2744]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
      </li>
    );
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        {/* Top utility bar */}
        <div className="border-b border-neutral-100 bg-white">
          <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-10">
            <p className="hidden text-[12px] font-normal tracking-[0.02em] text-neutral-500 sm:block">
              Pioneers of enterprise asset tracking — tags, robotics &amp; technology
            </p>

            <div className="ml-auto flex items-center gap-4">
              <a
                href={`tel:+91${CONTACT_PHONE}`}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium tabular-nums tracking-[-0.01em] text-neutral-600 transition-colors hover:text-[#f97316]"
              >
                <PhoneIcon />
                <span className="hidden sm:inline">Contact</span>
                {CONTACT_PHONE}
              </a>

              <span className="hidden h-3.5 w-px bg-neutral-200 sm:block" aria-hidden="true" />

              <div className="flex items-center gap-1">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = SOCIAL_ICONS[social.label];
                  return (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <nav
          className={`bg-white transition-shadow duration-300 ${
            scrolled
              ? "shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              : "shadow-[0_1px_0_rgba(0,0,0,0.04)]"
          }`}
          aria-label="Main navigation"
        >
          <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-4 px-5 sm:px-8 lg:px-10">
            <Link href="/" className="relative z-10 shrink-0" aria-label="Tag RoBo Tech home">
              {navbarLogoSrc.startsWith("/") ? (
                <Image
                  src={navbarLogoSrc}
                  alt={navbarLogoAlt}
                  width={navbarLogoWidth}
                  height={navbarLogoHeight}
                  priority
                  className="block object-contain"
                  style={{ width: `${navbarLogoWidth}px`, height: `${navbarLogoHeight}px` }}
                />
              ) : (
                <img
                  src={navbarLogoSrc}
                  alt={navbarLogoAlt}
                  width={navbarLogoWidth}
                  height={navbarLogoHeight}
                  className="block object-contain"
                  style={{ width: `${navbarLogoWidth}px`, height: `${navbarLogoHeight}px` }}
                />
              )}
            </Link>

            <ul className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
              {navLinksBeforeMegaMenus.map((link) => renderNavLink(link))}
              {MEGA_MENU_ORDER.map((kind) =>
                megaMenus[kind] ? (
                  <MegaMenuDropdown
                    key={kind}
                    menu={megaMenus[kind]!}
                    open={openMegaMenu === kind}
                    onOpenChange={(open) => setOpenMegaMenu(open ? kind : null)}
                    isActive={isMegaMenuActive(kind)}
                  />
                ) : null
              )}
              {navLinksAfterMegaMenus.map((link) => renderNavLink(link))}
            </ul>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <Link
                href="/contact"
                className="hidden rounded-full bg-[#f97316] px-5 py-2.5 text-[14px] font-semibold tracking-[-0.01em] text-white shadow-[0_2px_12px_rgba(249,115,22,0.35)] transition-all hover:bg-[#ea580c] hover:shadow-[0_4px_16px_rgba(249,115,22,0.4)] sm:inline-flex"
              >
                Contact us
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-2.5 text-neutral-700 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md xl:hidden"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav-panel"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                <span className="text-[14px] font-medium tracking-[-0.01em]">Menu</span>
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-neutral-900/20 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />

      {/* Mobile drawer */}
      <div
        id="mobile-nav-panel"
        className={`fixed inset-x-0 ${HEADER_OFFSET} bottom-0 z-30 overflow-y-auto border-t border-neutral-100 bg-white px-5 py-6 transition-all duration-300 xl:hidden ${
          menuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <ul className="grid gap-1">
          {navLinksBeforeMegaMenus.map((link) => renderNavLink(link, true))}
          {MEGA_MENU_ORDER.map((kind) => renderMobileMegaMenu(kind))}
          {navLinksAfterMegaMenus.map((link) => renderNavLink(link, true))}
        </ul>

        <div className="mt-6 space-y-4 border-t border-neutral-100 pt-6">
          <a
            href={`tel:+91${CONTACT_PHONE}`}
            className="flex items-center gap-2 text-[15px] font-medium text-neutral-700"
          >
            <PhoneIcon />
            {CONTACT_PHONE}
          </a>

          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICONS[social.label];
              return (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900"
                >
                  <Icon />
                </a>
              );
            })}
          </div>

          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="flex w-full items-center justify-center rounded-full bg-[#f97316] px-5 py-3.5 text-[15px] font-semibold text-white"
          >
            Contact us
          </Link>
        </div>
      </div>
    </>
  );
}

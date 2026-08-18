"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { scrollToHash } from "@/lib/scroll";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { SITE } from "@/lib/site";

function navItemClass(active: boolean) {
  return [
    "rounded-lg px-3 py-2 text-[15px] font-medium transition-colors",
    active
      ? "bg-primary/5 text-primary"
      : "text-text-muted hover:bg-primary/5 hover:text-primary",
  ].join(" ");
}

function mobileNavItemClass(active: boolean) {
  return [
    "border-b border-gray-50 py-4 text-[15px] font-medium transition-colors",
    active ? "text-primary" : "text-text-muted hover:text-primary",
  ].join(" ");
}

export default function Navbar({
  dict,
  lang,
}: {
  dict: Dictionary["nav"];
  lang: Locale;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Danh sách mục điều hướng giờ đến từ dictionary, nên id section phải suy ra từ đó
  // thay vì lấy hằng số NAV_SECTION_IDS cũ.
  const sectionIds = dict.items.map((item) => item.href.slice(1));
  const { activeHref, activate } = useScrollSpy(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const goTo = (href: string) => {
    activate(href);
    scrollToHash(href);
  };

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-gray-100 bg-white/95 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="section-container relative flex h-[72px] items-center justify-between gap-8">
        <Link
          href={`/${lang}`}
          className="relative z-10 block w-25 shrink-0 md:w-32"
        >
          <Image
            src="/images/brand/logo-brand.png"
            alt={SITE.name}
            width={160}
            height={48}
            priority
            className="h-auto w-full object-contain"
          />
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-2 md:gap-4 lg:flex"
          aria-label={dict.mainNavLabel}
        >
          {dict.items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={navItemClass(activeHref === item.href)}
              aria-current={activeHref === item.href ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                goTo(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="relative z-10 hidden items-center gap-1 xl:flex">
          <LanguageSwitcher current={lang} label={dict.languageLabel} />
          <Button href="#contact" size="sm" iconRight={<ArrowRightIcon />}>
            {dict.contact}
          </Button>
        </div>

        <div className="relative z-10 flex items-center gap-1 xl:hidden pl-15">
          <LanguageSwitcher current={lang} label={dict.languageLabel} />
        </div>

        <button
          type="button"
          className="relative z-10 rounded-lg p-2 text-text-muted lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={dict.toggleMenu}
          aria-expanded={open}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            {open ? (
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-gray-100 bg-white px-6 pb-6 lg:hidden">
          <nav className="flex flex-col" aria-label={dict.mobileNavLabel}>
            {dict.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={mobileNavItemClass(activeHref === item.href)}
                aria-current={activeHref === item.href ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  goTo(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Button
            href="#contact"
            className="mt-5 w-full"
            iconRight={<ArrowRightIcon />}
            onClick={() => setOpen(false)}
          >
            {dict.contact}
          </Button>
        </div>
      ) : null}
    </header>
  );
}

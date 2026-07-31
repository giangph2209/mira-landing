"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { scrollToSection } from "@/components/utils/scrollToSection";

const HOME_SECTION_IDS = new Set([
  "hero",
  "services",
  "workflow",
  "capabilities",
  "projects",
  "certificates",
  "contact",
]);

const NAV_OFFSET_PX = 80;

function hashToSectionId(): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.location.hash.replace(/^#/, "").split("?")[0]?.trim();
  if (!raw || !HOME_SECTION_IDS.has(raw)) return null;
  return raw;
}

function runDeferredScrollTo(id: string) {
  const run = () => scrollToSection(id, NAV_OFFSET_PX);

  requestAnimationFrame(() => {
    requestAnimationFrame(run);
  });

  const timeouts = [0, 50, 120, 250, 450, 800].map((ms) =>
    window.setTimeout(run, ms),
  );

  return () => {
    for (const t of timeouts) clearTimeout(t);
  };
}

export function HomeHashScroll() {
  const pathname = usePathname();
  const cancelScheduledRef = useRef<(() => void) | null>(null);

  const startDeferred = useCallback((id: string) => {
    cancelScheduledRef.current?.();
    cancelScheduledRef.current = runDeferredScrollTo(id);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      cancelScheduledRef.current?.();
      cancelScheduledRef.current = null;
      return;
    }
    const id = hashToSectionId();
    if (!id) return;
    startDeferred(id);
    return () => {
      cancelScheduledRef.current?.();
      cancelScheduledRef.current = null;
    };
  }, [pathname, startDeferred]);

  useEffect(() => {
    if (pathname !== "/") return;

    const onHashChange = () => {
      const id = hashToSectionId();
      if (!id) return;
      startDeferred(id);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname, startDeferred]);

  return null;
}

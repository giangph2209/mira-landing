"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HEADER_OFFSET = 96;
/** Keep clicked item active while smooth scroll is in progress */
const CLICK_LOCK_MS = 1200;

export function useScrollSpy(sectionIds: readonly string[]) {
  const [activeHref, setActiveHref] = useState("");
  const lockedHref = useRef<string | null>(null);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activate = useCallback((href: string) => {
    lockedHref.current = href;
    setActiveHref(href);

    if (unlockTimer.current) clearTimeout(unlockTimer.current);
    unlockTimer.current = setTimeout(() => {
      lockedHref.current = null;
    }, CLICK_LOCK_MS);
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const updateActive = () => {
      if (lockedHref.current) return;

      const ordered = [...sections].sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
      );

      let current = "";
      for (const section of ordered) {
        if (section.getBoundingClientRect().top <= HEADER_OFFSET) {
          current = `#${section.id}`;
        }
      }

      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) {
        current = `#${ordered[ordered.length - 1].id}`;
      }

      setActiveHref(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
    };
  }, [sectionIds]);

  return { activeHref, activate };
}

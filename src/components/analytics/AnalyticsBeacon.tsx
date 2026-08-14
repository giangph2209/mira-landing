"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const ENDPOINT = "/api/e";

type Payload = Record<string, string | number | null>;

function send(payload: Payload) {
  const body = JSON.stringify(payload);

  // text/plain để không kích hoạt CORS preflight; sendBeacon sống sót cả khi trang unload
  if (typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
    if (navigator.sendBeacon(ENDPOINT, blob)) return;
  }

  void fetch(ENDPOINT, {
    method: "POST",
    body,
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    keepalive: true,
    credentials: "same-origin",
  }).catch(() => {});
}

function readUtm(): Payload {
  const params = new URLSearchParams(window.location.search);
  return {
    us: params.get("utm_source"),
    um: params.get("utm_medium"),
    uc: params.get("utm_campaign"),
  };
}

/**
 * Thu thập pageview phía client.
 *
 * Cố ý KHÔNG đo ở server: để lấy IP/UA phải đọc headers() trong root layout, và điều đó
 * làm "/" cùng "/privacy-policy" mất static generation. Client beacon giữ nguyên trang
 * tĩnh, đồng thời lọc bot gần như miễn phí (crawler không chạy JS).
 */
export default function AnalyticsBeacon() {
  const pathname = usePathname();
  const enteredAtRef = useRef<number>(0);
  const exitSentRef = useRef(false);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    enteredAtRef.current = Date.now();
    exitSentRef.current = false;

    send({
      e: "pageview",
      p: pathname,
      r: document.referrer || null,
      t: document.title || null,
      sw: window.screen?.width ?? null,
      l: navigator.language || null,
      ...readUtm(),
    });

    const sendExit = () => {
      if (exitSentRef.current) return;
      exitSentRef.current = true;

      send({
        e: "exit",
        p: pathname,
        d: Date.now() - enteredAtRef.current,
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendExit();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", sendExit);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", sendExit);
      // rời khỏi path này (điều hướng nội bộ) cũng tính là kết thúc lượt xem
      sendExit();
    };
  }, [pathname]);

  return null;
}

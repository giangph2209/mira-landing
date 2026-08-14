import type { TrafficChannel } from "@prisma/client";

const SEARCH_HOSTS = [
  "google.",
  "bing.com",
  "duckduckgo.com",
  "search.yahoo",
  "yandex.",
  "baidu.com",
  "coccoc.com",
  "ecosia.org",
  "brave.com",
];

const SOCIAL_HOSTS = [
  "facebook.com",
  "fb.com",
  "m.facebook.com",
  "l.facebook.com",
  "instagram.com",
  "linkedin.com",
  "lnkd.in",
  "twitter.com",
  "x.com",
  "t.co",
  "youtube.com",
  "tiktok.com",
  "zalo.me",
  "reddit.com",
  "threads.net",
  "pinterest.com",
];

const EMAIL_HOSTS = ["mail.google.com", "outlook.", "mail.yahoo."];

export function hostFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.startsWith("www.") ? host.slice(4) : host;
  } catch {
    return null;
  }
}

/**
 * Thuần tuý, không phụ thuộc I/O — phân loại nguồn truy cập.
 * UTM luôn thắng referrer vì đó là chủ đích của người chạy chiến dịch.
 */
export function classifyChannel(input: {
  referrerHost: string | null;
  siteHost: string | null;
  utmMedium?: string | null;
  utmSource?: string | null;
}): TrafficChannel {
  const medium = input.utmMedium?.toLowerCase().trim();
  const source = input.utmSource?.toLowerCase().trim();

  if (medium) {
    if (medium === "cpc" || medium === "ppc" || medium === "paid" || medium === "paidsearch") {
      return "PAID_SEARCH";
    }
    if (medium === "email" || medium === "newsletter") return "EMAIL";
    if (medium === "social" || medium === "social-media" || medium === "paid-social") {
      return "SOCIAL";
    }
    if (medium === "organic") return "ORGANIC_SEARCH";
    if (medium === "referral") return "REFERRAL";
  }

  if (source && SOCIAL_HOSTS.some((host) => source.includes(host.split(".")[0]))) {
    return "SOCIAL";
  }

  const host = input.referrerHost;
  if (!host) return "DIRECT";
  if (input.siteHost && (host === input.siteHost || host.endsWith(`.${input.siteHost}`))) {
    return "INTERNAL";
  }
  if (SEARCH_HOSTS.some((needle) => host.includes(needle))) return "ORGANIC_SEARCH";
  if (SOCIAL_HOSTS.some((needle) => host === needle || host.endsWith(`.${needle}`))) {
    return "SOCIAL";
  }
  if (EMAIL_HOSTS.some((needle) => host.includes(needle))) return "EMAIL";

  return "REFERRAL";
}

export const CHANNEL_LABEL: Record<TrafficChannel, string> = {
  DIRECT: "Truy cập trực tiếp",
  ORGANIC_SEARCH: "Tìm kiếm tự nhiên",
  PAID_SEARCH: "Quảng cáo tìm kiếm",
  SOCIAL: "Mạng xã hội",
  REFERRAL: "Trang giới thiệu",
  EMAIL: "Email",
  INTERNAL: "Nội bộ",
  OTHER: "Khác",
};

/**
 * Chuẩn hoá path trước khi lưu. Không có bước này, một con scanner quét
 * `/?a=1..99999` sẽ làm nổ cardinality của GROUP BY path.
 */
export function normalizePath(raw: string | null | undefined): string {
  if (!raw) return "/";

  let path = raw.split("#")[0].split("?")[0].trim().toLowerCase();
  if (!path.startsWith("/")) path = `/${path}`;
  // gộp trailing slash (trừ chính "/")
  if (path.length > 1) path = path.replace(/\/+$/, "") || "/";
  path = path.slice(0, 512);

  return /^\/[a-z0-9\-/._]*$/.test(path) ? path : "/_other";
}

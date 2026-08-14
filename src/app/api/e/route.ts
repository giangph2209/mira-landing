import { randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { after, userAgent, type NextRequest } from "next/server";
import type { DeviceType } from "@prisma/client";
import { collectPageview, flagSuspiciousSessions, type BeaconEvent } from "@/lib/analytics/collect";
import { hostFromUrl } from "@/lib/analytics/channel";
import { getClientIp, getGeoHint } from "@/lib/request-context";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  VISITOR_COOKIE,
  VISITOR_MAX_AGE,
  readTrackingId,
} from "@/lib/analytics/cookies";
import { SITE } from "@/lib/site";

// Đặt tên route là /api/e chứ không phải /api/track|/api/analytics|/api/collect:
// các rule EasyPrivacy/uBlock match đúng những chuỗi đó và sẽ chặn mất một phần traffic.

const MAX_BODY_BYTES = 4096;

const NO_CONTENT = () => new Response(null, { status: 204 });

type BeaconPayload = {
  p?: unknown; // path
  r?: unknown; // referrer
  t?: unknown; // title
  e?: unknown; // event
  d?: unknown; // duration ms
  sw?: unknown; // screen width
  l?: unknown; // language
  us?: unknown; // utm_source
  um?: unknown; // utm_medium
  uc?: unknown; // utm_campaign
};

function str(value: unknown, max = 1024): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function int(value: unknown, max: number): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const rounded = Math.round(value);
  if (rounded < 0) return null;
  return Math.min(rounded, max);
}

function deviceTypeFrom(device: { type?: string }): DeviceType {
  switch (device.type) {
    case "mobile":
      return "MOBILE";
    case "tablet":
      return "TABLET";
    case "console":
    case "smarttv":
    case "wearable":
    case "embedded":
      return "OTHER";
    case undefined:
      // ua-parser để trống type với desktop
      return "DESKTOP";
    default:
      return "OTHER";
  }
}

export async function POST(request: NextRequest) {
  // 1. Chặn rẻ tiền: chỉ nhận beacon từ chính site
  const origin = request.headers.get("origin");
  const siteHost = hostFromUrl(SITE.url);
  const originHost = hostFromUrl(origin);
  if (originHost && siteHost && originHost !== siteHost && originHost !== "localhost") {
    return NO_CONTENT();
  }

  // 2. Bot: chặn ngay tại cửa, không ghi row nào
  const ua = userAgent(request);
  if (ua.isBot) return NO_CONTENT();

  const userAgentString = request.headers.get("user-agent");
  if (!userAgentString) return NO_CONTENT();

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) return NO_CONTENT();

  let payload: BeaconPayload;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return NO_CONTENT();
    payload = JSON.parse(text) as BeaconPayload;
  } catch {
    return NO_CONTENT();
  }

  const path = str(payload.p, 512);
  if (!path) return NO_CONTENT();
  // Không tự theo dõi khu vực quản trị
  if (path.startsWith("/admin")) return NO_CONTENT();

  const event: BeaconEvent = payload.e === "exit" ? "exit" : "pageview";

  // 3-4. Đọc cookie, thiếu thì tự sinh id NGAY tại handler rồi set cookie.
  // Nhờ vậy cookie không phụ thuộc kết quả ghi DB, nên toàn bộ phần ghi có thể hoãn
  // vào after().
  const cookieStore = await cookies();
  const existingVisitorId = readTrackingId(cookieStore.get(VISITOR_COOKIE)?.value);
  const existingSessionId = readTrackingId(cookieStore.get(SESSION_COOKIE)?.value);

  const visitorId = existingVisitorId ?? randomUUID();
  const sessionId = existingSessionId ?? randomUUID();
  const secure = process.env.SESSION_COOKIE_SECURE !== "false";

  // httpOnly quan trọng: Safari ITP giới hạn cookie do script ghi còn 7 ngày,
  // cookie do server Set-Cookie thì không bị.
  cookieStore.set(VISITOR_COOKIE, visitorId, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: VISITOR_MAX_AGE,
  });
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  const headerList = await headers();
  const ip = getClientIp(headerList);
  const geo = getGeoHint(headerList);

  const input = {
    visitorId,
    sessionId,
    visitorIsNew: !existingVisitorId,
    sessionIsNew: !existingSessionId,
    event,
    path,
    title: str(payload.t, 256),
    referrer: str(payload.r, 1024),
    durationMs: int(payload.d, 2 * 60 * 60 * 1000),
    screenWidth: int(payload.sw, 20000),
    language: str(payload.l, 32),
    utmSource: str(payload.us, 128),
    utmMedium: str(payload.um, 128),
    utmCampaign: str(payload.uc, 128),
    ip,
    userAgent: userAgentString,
    deviceType: deviceTypeFrom(ua.device),
    browserName: ua.browser.name ?? null,
    osName: ua.os.name ?? null,
    country: geo.country,
    city: geo.city,
    siteHost,
  };

  // 5. Toàn bộ ghi DB chạy sau khi response đã trả. after() không làm route thành dynamic.
  after(async () => {
    try {
      await collectPageview(input);
      await flagSuspiciousSessions(ip);
    } catch (error) {
      console.error("[analytics] không ghi được beacon", error);
    }
  });

  return NO_CONTENT();
}

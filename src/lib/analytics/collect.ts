import "server-only";

import type { DeviceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { classifyChannel, hostFromUrl, normalizePath } from "@/lib/analytics/channel";

export type BeaconEvent = "pageview" | "exit";

export type CollectInput = {
  visitorId: string;
  sessionId: string;
  visitorIsNew: boolean;
  sessionIsNew: boolean;
  event: BeaconEvent;
  path: string;
  title: string | null;
  referrer: string | null;
  durationMs: number | null;
  screenWidth: number | null;
  language: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  ip: string | null;
  userAgent: string | null;
  deviceType: DeviceType;
  browserName: string | null;
  osName: string | null;
  country: string | null;
  city: string | null;
  siteHost: string | null;
};

function truncate(value: string | null, max: number): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

/**
 * Toàn bộ ghi DB của một beacon. Được gọi bên trong after() nên độ trễ response của
 * /api/e chỉ bằng RTT mạng.
 *
 * Dùng upsert theo primary key đã biết trước (id do handler tự sinh) nên hai beacon chạy
 * song song là idempotent — không race, không phải retry unique-violation.
 */
export async function collectPageview(input: CollectInput): Promise<void> {
  const now = new Date();
  const path = normalizePath(input.path);
  const referrer = truncate(input.referrer, 1024);
  const referrerHost = hostFromUrl(referrer);

  const channel = classifyChannel({
    referrerHost,
    siteHost: input.siteHost,
    utmMedium: input.utmMedium,
    utmSource: input.utmSource,
  });

  await prisma.$transaction(async (tx) => {
    // 1. Visitor
    await tx.visitor.upsert({
      where: { id: input.visitorId },
      create: {
        id: input.visitorId,
        lastIp: input.ip,
        lastUserAgent: truncate(input.userAgent, 512),
        country: input.country,
        city: input.city,
        sessionCount: 1,
      },
      update: {
        lastSeenAt: now,
        lastIp: input.ip,
        lastUserAgent: truncate(input.userAgent, 512),
        ...(input.country ? { country: input.country } : {}),
        ...(input.city ? { city: input.city } : {}),
        ...(input.sessionIsNew ? { sessionCount: { increment: 1 } } : {}),
      },
    });

    // sessionCountAtStart = 1 nghĩa là phiên đầu tiên của khách này
    let sessionCountAtStart = 1;
    if (input.sessionIsNew && !input.visitorIsNew) {
      const visitor = await tx.visitor.findUnique({
        where: { id: input.visitorId },
        select: { sessionCount: true },
      });
      sessionCountAtStart = visitor?.sessionCount ?? 1;
    }

    // 2. Session — chỉ sự kiện pageview mới tăng pageviewCount
    const isPageview = input.event === "pageview";

    await tx.visitorSession.upsert({
      where: { id: input.sessionId },
      create: {
        id: input.sessionId,
        visitorId: input.visitorId,
        pageviewCount: isPageview ? 1 : 0,
        sessionCountAtStart,
        entryPath: path,
        exitPath: path,
        referrer,
        referrerHost,
        channel,
        utmSource: truncate(input.utmSource, 128),
        utmMedium: truncate(input.utmMedium, 128),
        utmCampaign: truncate(input.utmCampaign, 128),
        ip: input.ip,
        userAgent: truncate(input.userAgent, 512),
        deviceType: input.deviceType,
        browserName: truncate(input.browserName, 64),
        osName: truncate(input.osName, 64),
        screenWidth: input.screenWidth,
        language: truncate(input.language, 32),
        country: input.country,
        city: input.city,
      },
      update: {
        lastEventAt: now,
        exitPath: path,
        ...(isPageview ? { pageviewCount: { increment: 1 } } : {}),
      },
    });

    // 3. PageView — sự kiện exit chỉ cập nhật thời lượng của lượt xem gần nhất
    if (isPageview) {
      await tx.pageView.create({
        data: {
          sessionId: input.sessionId,
          visitorId: input.visitorId,
          path,
          title: truncate(input.title, 256),
          referrer,
          occurredAt: now,
        },
      });
      return;
    }

    if (input.durationMs != null && input.durationMs > 0) {
      const last = await tx.pageView.findFirst({
        where: { sessionId: input.sessionId, path },
        orderBy: { occurredAt: "desc" },
        select: { id: true },
      });
      if (last) {
        await tx.pageView.update({
          where: { id: last.id },
          data: { durationMs: Math.min(input.durationMs, 2 * 60 * 60 * 1000) },
        });
      }
    }
  });
}

/**
 * Tầng lọc bot thứ ba (sau "không chạy JS" và userAgent().isBot): đánh cờ những phiên
 * có hành vi máy móc. Cố ý CHỈ đánh cờ, không xoá, để còn audit được cái gì bị loại.
 */
export async function flagSuspiciousSessions(ip: string | null): Promise<void> {
  if (!ip) return;

  const since = new Date(Date.now() - 60 * 1000);
  const burst = await prisma.pageView.count({
    where: {
      occurredAt: { gt: since },
      session: { ip },
    },
  });

  if (burst <= 30) return;

  const sessions = await prisma.visitorSession.findMany({
    where: { ip, isBot: false, lastEventAt: { gt: since } },
    select: { id: true, visitorId: true },
  });
  if (sessions.length === 0) return;

  const sessionIds = sessions.map((session) => session.id);
  const visitorIds = [...new Set(sessions.map((session) => session.visitorId))];

  await prisma.$transaction([
    prisma.visitorSession.updateMany({
      where: { id: { in: sessionIds } },
      data: { isBot: true },
    }),
    prisma.pageView.updateMany({
      where: { sessionId: { in: sessionIds } },
      data: { isBot: true },
    }),
    prisma.visitor.updateMany({
      where: { id: { in: visitorIds } },
      data: { isBot: true },
    }),
  ]);
}

import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { DateRange } from "@/lib/date-range";
import { TIMEZONE } from "@/lib/format";

/**
 * Toàn bộ tổng hợp đi qua $queryRaw với tagged template — groupBy của Prisma không làm
 * được date_trunc, FILTER hay COUNT(DISTINCT). $queryRawUnsafe bị cấm trong codebase này.
 *
 * Hai quy tắc bắt buộc, sai là hỏng âm thầm:
 *  1. Điều kiện WHERE luôn đặt trên cột timestamptz THÔ (sargable → dùng được index).
 *     Chỉ chuyển múi giờ ở SELECT/GROUP BY. Làm ngược lại biến index scan 5ms thành seq scan.
 *  2. Uniques theo ngày KHÔNG cộng lại thành uniques cả kỳ — luôn query riêng cho số tổng.
 */

export type KpiSummary = {
  sessions: number;
  visitors: number;
  pageviews: number;
  submissions: number;
  bounceRate: number | null;
  conversionRate: number | null;
  avgDurationSeconds: number | null;
  /** Trung bình chỉ tính phiên có >1 lượt xem — con số thực sự có ý nghĩa */
  avgEngagedDurationSeconds: number | null;
  newSessions: number;
};

type KpiRow = {
  sessions: bigint;
  visitors: bigint;
  pageviews: bigint;
  bounce_rate: number | null;
  avg_duration_s: number | null;
  avg_engaged_s: number | null;
  conversion_rate: number | null;
  new_sessions: bigint;
};

const num = (value: bigint | number | null | undefined): number => Number(value ?? 0);

export async function getKpiSummary(range: DateRange): Promise<KpiSummary> {
  // Một lần quét bảng duy nhất cho toàn bộ hàng KPI — nhờ đã denormalise mọi thứ lên
  // VisitorSession nên không phải join gì.
  const [row] = await prisma.$queryRaw<KpiRow[]>`
    SELECT
      count(*)                                                              AS sessions,
      count(DISTINCT "visitorId")                                           AS visitors,
      coalesce(sum("pageviewCount"), 0)                                     AS pageviews,
      (count(*) FILTER (WHERE "pageviewCount" <= 1))::float8
        / NULLIF(count(*), 0)                                               AS bounce_rate,
      (avg(EXTRACT(EPOCH FROM ("lastEventAt" - "startedAt"))))::float8      AS avg_duration_s,
      (avg(EXTRACT(EPOCH FROM ("lastEventAt" - "startedAt")))
        FILTER (WHERE "pageviewCount" > 1))::float8                         AS avg_engaged_s,
      (count(*) FILTER (WHERE "converted"))::float8
        / NULLIF(count(*), 0)                                               AS conversion_rate,
      count(*) FILTER (WHERE "sessionCountAtStart" <= 1)                    AS new_sessions
    FROM "VisitorSession"
    WHERE "isBot" = false
      AND "startedAt" >= ${range.start}
      AND "startedAt" <  ${range.end}
  `;

  const submissions = await prisma.contactSubmission.count({
    where: { createdAt: { gte: range.start, lt: range.end } },
  });

  return {
    sessions: num(row?.sessions),
    visitors: num(row?.visitors),
    pageviews: num(row?.pageviews),
    submissions,
    bounceRate: row?.bounce_rate ?? null,
    conversionRate: row?.conversion_rate ?? null,
    avgDurationSeconds: row?.avg_duration_s ?? null,
    avgEngagedDurationSeconds: row?.avg_engaged_s ?? null,
    newSessions: num(row?.new_sessions),
  };
}

export type TimeSeriesPoint = {
  day: string;
  pageviews: number;
  sessions: number;
};

export async function getTimeSeries(range: DateRange): Promise<TimeSeriesPoint[]> {
  // generate_series + LEFT JOIN là BẮT BUỘC: thiếu nó thì ngày không có traffic biến mất
  // khỏi kết quả và biểu đồ vẽ một đoạn thẳng vắt qua — biểu đồ nói dối.
  const rows = await prisma.$queryRaw<
    { day: Date; pageviews: bigint; sessions: bigint }[]
  >`
    WITH days AS (
      SELECT generate_series(
        ${range.fromDay}::date,
        ${range.toDay}::date,
        '1 day'::interval
      )::date AS d
    ),
    pv AS (
      SELECT (("occurredAt" AT TIME ZONE ${TIMEZONE})::date) AS d, count(*) AS c
      FROM "PageView"
      WHERE "isBot" = false
        AND "occurredAt" >= ${range.start}
        AND "occurredAt" <  ${range.end}
      GROUP BY 1
    ),
    ss AS (
      SELECT (("startedAt" AT TIME ZONE ${TIMEZONE})::date) AS d, count(*) AS c
      FROM "VisitorSession"
      WHERE "isBot" = false
        AND "startedAt" >= ${range.start}
        AND "startedAt" <  ${range.end}
      GROUP BY 1
    )
    SELECT days.d                        AS day,
           coalesce(pv.c, 0)             AS pageviews,
           coalesce(ss.c, 0)             AS sessions
    FROM days
    LEFT JOIN pv ON pv.d = days.d
    LEFT JOIN ss ON ss.d = days.d
    ORDER BY days.d
  `;

  return rows.map((row) => ({
    day: row.day.toISOString().slice(0, 10),
    pageviews: num(row.pageviews),
    sessions: num(row.sessions),
  }));
}

export type BreakdownItem = { label: string; value: number };

export async function getTopPages(range: DateRange, limit = 8): Promise<BreakdownItem[]> {
  const rows = await prisma.$queryRaw<{ label: string; value: bigint }[]>`
    SELECT "path" AS label, count(*) AS value
    FROM "PageView"
    WHERE "isBot" = false
      AND "occurredAt" >= ${range.start}
      AND "occurredAt" <  ${range.end}
    GROUP BY "path"
    ORDER BY value DESC
    LIMIT ${limit + 20}
  `;
  return rows.map((row) => ({ label: row.label, value: num(row.value) }));
}

async function sessionBreakdown(
  range: DateRange,
  column: Prisma.Sql,
  fallback: string,
): Promise<BreakdownItem[]> {
  const rows = await prisma.$queryRaw<{ label: string | null; value: bigint }[]>`
    SELECT ${column} AS label, count(*) AS value
    FROM "VisitorSession"
    WHERE "isBot" = false
      AND "startedAt" >= ${range.start}
      AND "startedAt" <  ${range.end}
    GROUP BY 1
    ORDER BY value DESC
    LIMIT 40
  `;
  return rows.map((row) => ({ label: row.label ?? fallback, value: num(row.value) }));
}

export function getChannelBreakdown(range: DateRange) {
  return sessionBreakdown(range, Prisma.sql`"channel"::text`, "OTHER");
}

export function getDeviceBreakdown(range: DateRange) {
  return sessionBreakdown(range, Prisma.sql`"deviceType"::text`, "OTHER");
}

export function getBrowserBreakdown(range: DateRange) {
  return sessionBreakdown(range, Prisma.sql`"browserName"`, "Không xác định");
}

export function getOsBreakdown(range: DateRange) {
  return sessionBreakdown(range, Prisma.sql`"osName"`, "Không xác định");
}

export function getCountryBreakdown(range: DateRange) {
  return sessionBreakdown(range, Prisma.sql`"country"`, "Không xác định");
}

export async function getTopReferrers(range: DateRange): Promise<BreakdownItem[]> {
  const rows = await prisma.$queryRaw<{ label: string; value: bigint }[]>`
    SELECT "referrerHost" AS label, count(*) AS value
    FROM "VisitorSession"
    WHERE "isBot" = false
      AND "referrerHost" IS NOT NULL
      AND "startedAt" >= ${range.start}
      AND "startedAt" <  ${range.end}
    GROUP BY 1
    ORDER BY value DESC
    LIMIT 40
  `;
  return rows.map((row) => ({ label: row.label, value: num(row.value) }));
}

export type VisitorSessionRow = {
  id: string;
  visitorId: string;
  startedAt: Date;
  lastEventAt: Date;
  pageviewCount: number;
  entryPath: string;
  exitPath: string;
  referrerHost: string | null;
  channel: string;
  deviceType: string;
  browserName: string | null;
  osName: string | null;
  ip: string | null;
  country: string | null;
  city: string | null;
  converted: boolean;
  isReturning: boolean;
};

export type VisitorPage = {
  rows: VisitorSessionRow[];
  nextCursor: string | null;
};

/**
 * Keyset pagination trên (startedAt DESC, id DESC). Không dùng OFFSET: OFFSET 50000 bắt
 * Postgres dựng đủ 50k dòng rồi vứt đi.
 */
export async function getVisitorSessions(input: {
  range: DateRange;
  cursor?: { startedAt: Date; id: string } | null;
  pageSize?: number;
  onlyConverted?: boolean;
  includeBots?: boolean;
}): Promise<VisitorPage> {
  const pageSize = input.pageSize ?? 50;

  const rows = await prisma.visitorSession.findMany({
    where: {
      startedAt: { gte: input.range.start, lt: input.range.end },
      ...(input.includeBots ? {} : { isBot: false }),
      ...(input.onlyConverted ? { converted: true } : {}),
      ...(input.cursor
        ? {
            OR: [
              { startedAt: { lt: input.cursor.startedAt } },
              { startedAt: input.cursor.startedAt, id: { lt: input.cursor.id } },
            ],
          }
        : {}),
    },
    orderBy: [{ startedAt: "desc" }, { id: "desc" }],
    take: pageSize + 1,
    select: {
      id: true,
      visitorId: true,
      startedAt: true,
      lastEventAt: true,
      pageviewCount: true,
      sessionCountAtStart: true,
      entryPath: true,
      exitPath: true,
      referrerHost: true,
      channel: true,
      deviceType: true,
      browserName: true,
      osName: true,
      ip: true,
      country: true,
      city: true,
      converted: true,
    },
  });

  const hasMore = rows.length > pageSize;
  const page = hasMore ? rows.slice(0, pageSize) : rows;
  const last = page[page.length - 1];

  return {
    rows: page.map((row) => ({
      id: row.id,
      visitorId: row.visitorId,
      startedAt: row.startedAt,
      lastEventAt: row.lastEventAt,
      pageviewCount: row.pageviewCount,
      entryPath: row.entryPath,
      exitPath: row.exitPath,
      referrerHost: row.referrerHost,
      channel: row.channel,
      deviceType: row.deviceType,
      browserName: row.browserName,
      osName: row.osName,
      ip: row.ip,
      country: row.country,
      city: row.city,
      converted: row.converted,
      isReturning: row.sessionCountAtStart > 1,
    })),
    nextCursor:
      hasMore && last ? `${last.startedAt.toISOString()}|${last.id}` : null,
  };
}

export function parseVisitorCursor(raw: string | undefined): { startedAt: Date; id: string } | null {
  if (!raw) return null;
  const [iso, id] = raw.split("|");
  if (!iso || !id) return null;
  const startedAt = new Date(iso);
  if (Number.isNaN(startedAt.getTime())) return null;
  return { startedAt, id };
}

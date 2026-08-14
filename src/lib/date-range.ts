import { TIMEZONE } from "@/lib/format";

/** COUNT(DISTINCT) là phép đắt duy nhất trong dashboard — kẹp khoảng ngày để nó luôn bị chặn trên */
export const MAX_RANGE_DAYS = 366;
const DAY_MS = 24 * 60 * 60 * 1000;

export type DateRange = {
  /** ngày bắt đầu, dạng YYYY-MM-DD theo TIMEZONE, bao gồm cả ngày này */
  fromDay: string;
  /** ngày kết thúc, bao gồm cả ngày này */
  toDay: string;
  /** mốc UTC bắt đầu (>=) để đưa vào WHERE */
  start: Date;
  /** mốc UTC kết thúc (<), đã cộng 1 ngày */
  end: Date;
  days: number;
  preset: RangePreset | null;
};

export type RangePreset = "today" | "7d" | "30d" | "90d" | "12m";

export const RANGE_PRESETS: { value: RangePreset; label: string }[] = [
  { value: "today", label: "Hôm nay" },
  { value: "7d", label: "7 ngày" },
  { value: "30d", label: "30 ngày" },
  { value: "90d", label: "90 ngày" },
  { value: "12m", label: "12 tháng" },
];

/** Lệch múi giờ (ms) tại đúng thời điểm `date` — dùng Intl nên tự đúng cả khi có DST */
function tzOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const map: Record<string, string> = {};
  for (const part of parts) map[part.type] = part.value;

  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour) % 24,
    Number(map.minute),
    Number(map.second),
  );

  return asUtc - date.getTime();
}

/** 00:00 của `isoDay` theo TIMEZONE, quy về mốc UTC */
export function zonedDayStart(isoDay: string): Date {
  const [year, month, day] = isoDay.split("-").map(Number);
  const guess = Date.UTC(year, month - 1, day, 0, 0, 0, 0);
  const offset = tzOffsetMs(new Date(guess), TIMEZONE);
  return new Date(guess - offset);
}

export function todayIso(): string {
  return toIsoDay(new Date());
}

export function toIsoDay(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  // en-CA cho sẵn dạng YYYY-MM-DD
  return parts;
}

export function addDaysIso(isoDay: string, days: number): string {
  const base = zonedDayStart(isoDay);
  return toIsoDay(new Date(base.getTime() + days * DAY_MS));
}

export function diffDaysIso(fromDay: string, toDay: string): number {
  const ms = zonedDayStart(toDay).getTime() - zonedDayStart(fromDay).getTime();
  return Math.round(ms / DAY_MS);
}

const ISO_DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDay(value: string | undefined): value is string {
  if (!value || !ISO_DAY_RE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && toIsoDay(date).length === 10;
}

function buildRange(fromDay: string, toDay: string, preset: RangePreset | null): DateRange {
  const start = zonedDayStart(fromDay);
  const end = zonedDayStart(addDaysIso(toDay, 1));
  return {
    fromDay,
    toDay,
    start,
    end,
    days: diffDaysIso(fromDay, toDay) + 1,
    preset,
  };
}

export function rangeFromPreset(preset: RangePreset): DateRange {
  const today = todayIso();

  switch (preset) {
    case "today":
      return buildRange(today, today, preset);
    case "7d":
      return buildRange(addDaysIso(today, -6), today, preset);
    case "90d":
      return buildRange(addDaysIso(today, -89), today, preset);
    case "12m":
      return buildRange(addDaysIso(today, -364), today, preset);
    case "30d":
    default:
      return buildRange(addDaysIso(today, -29), today, preset);
  }
}

/**
 * Đọc `?preset=` hoặc `?from=&to=`. Mọi giá trị sai đều rơi về mặc định 30 ngày thay vì
 * ném lỗi — searchParams là dữ liệu người dùng gửi lên.
 */
export function parseDateRange(searchParams: Record<string, string | string[] | undefined>): DateRange {
  const pick = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const preset = pick("preset");
  if (preset && RANGE_PRESETS.some((item) => item.value === preset)) {
    return rangeFromPreset(preset as RangePreset);
  }

  const from = pick("from");
  const to = pick("to");

  if (!isValidIsoDay(from) || !isValidIsoDay(to)) {
    return rangeFromPreset("30d");
  }

  let fromDay = from;
  let toDay = to;
  if (diffDaysIso(fromDay, toDay) < 0) {
    [fromDay, toDay] = [toDay, fromDay];
  }

  // Kẹp về MAX_RANGE_DAYS thay vì từ chối: người dùng vẫn thấy dữ liệu, chỉ bị cắt bớt
  if (diffDaysIso(fromDay, toDay) + 1 > MAX_RANGE_DAYS) {
    fromDay = addDaysIso(toDay, -(MAX_RANGE_DAYS - 1));
  }

  return buildRange(fromDay, toDay, null);
}

/** Kỳ liền trước, cùng độ dài — dùng để tính % thay đổi trên các thẻ KPI */
export function previousRange(range: DateRange): DateRange {
  const toDay = addDaysIso(range.fromDay, -1);
  const fromDay = addDaysIso(toDay, -(range.days - 1));
  return buildRange(fromDay, toDay, null);
}

/** Chuỗi query giữ nguyên khoảng ngày khi điều hướng sang trang khác */
export function rangeToQuery(range: DateRange): string {
  const params = new URLSearchParams(
    range.preset ? { preset: range.preset } : { from: range.fromDay, to: range.toDay },
  );
  return params.toString();
}

export const TIMEZONE = process.env.ANALYTICS_TIMEZONE || "Asia/Ho_Chi_Minh";
const LOCALE = "vi-VN";

const numberFormatter = new Intl.NumberFormat(LOCALE);
const percentFormatter = new Intl.NumberFormat(LOCALE, {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatNumber(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return "—";
  return numberFormatter.format(value);
}

/** `ratio` là tỉ lệ 0..1, không phải phần trăm */
export function formatPercent(ratio: number | null | undefined) {
  if (ratio == null || !Number.isFinite(ratio)) return "—";
  return percentFormatter.format(ratio);
}

export function formatDuration(seconds: number | null | undefined) {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return "—";

  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  if (h > 0) return `${h}h ${m}p`;
  if (m > 0) return `${m}p ${s}s`;
  return `${s}s`;
}

export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/** Nhãn ngắn cho trục X của biểu đồ: "14/08" */
export function formatDayLabel(isoDay: string) {
  const [, month, day] = isoDay.split("-");
  return `${day}/${month}`;
}

export function formatRelative(value: Date | string | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.round(diffMs / 60000);

  if (minutes < 1) return "vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days} ngày trước`;

  return formatDate(date);
}

/** Chênh lệch so với kỳ trước, trả về tỉ lệ 0..1 (null khi kỳ trước bằng 0) */
export function computeDelta(current: number, previous: number): number | null {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) return null;
  return (current - previous) / previous;
}

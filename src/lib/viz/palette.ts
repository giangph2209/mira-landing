/**
 * Bảng màu biểu đồ — đã kiểm tra tương phản, không phải chọn bằng mắt.
 *
 * Bộ categorical CHỈ dùng cho hình liền kề (thanh xếp chồng, nhiều đường): ở dạng liền kề
 * mọi cặp cạnh nhau đều đạt ΔE ≥ 22 kể cả với người mù màu. Khi so tất cả các cặp thì
 * bộ này TRƯỢT (#eb6834 ↔ #0e803f chỉ còn ΔE 3.9 dưới protanopia) — vì vậy không dùng
 * pie/donut ở bất kỳ đâu trong dashboard.
 */
export const VIZ_CATEGORICAL = ["#0e803f", "#2a78d6", "#eb6834", "#4a3aa7"] as const;

/** Thang tuần tự — L đơn điệu, mọi bước ΔL ≥ 0.06 */
export const VIZ_SEQUENTIAL = ["#7ac79a", "#48b177", "#199454", "#0e803f", "#06603c"] as const;

export const VIZ_STATUS = {
  good: "#0ca30c",
  warning: "#fab219",
  serious: "#ec835a",
  critical: "#d03b3b",
} as const;

export const VIZ_INK = {
  primary: "#1f2a37",
  secondary: "#52514e",
  muted: "#898781",
  grid: "#e1e0d9",
  baseline: "#c3c2b7",
  surface: "#ffffff",
} as const;

/** Màu duy nhất cho danh mục danh nghĩa (top trang, nguồn giới thiệu) — không dùng thang giá trị */
export const VIZ_BAR = VIZ_CATEGORICAL[0];

export function categoricalColor(index: number): string {
  return VIZ_CATEGORICAL[index % VIZ_CATEGORICAL.length];
}

/**
 * Ngưỡng đánh giá cho các meter. Bounce thấp là tốt nên thang bị đảo — tách riêng
 * để không ai vô tình dùng nhầm thang.
 */
export function rateTone(ratio: number, kind: "higher-better" | "lower-better"): string {
  const value = kind === "lower-better" ? 1 - ratio : ratio;
  if (value >= 0.5) return VIZ_STATUS.good;
  if (value >= 0.3) return VIZ_STATUS.warning;
  return VIZ_STATUS.serious;
}

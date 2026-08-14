/** Hàm thuần tuý dựng đường/thang cho SVG — không phụ thuộc DOM nên render được ở server */

export type Point = { x: number; y: number };

export function linearScale(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0;

  return (value: number): number => {
    if (span === 0) return (r0 + r1) / 2;
    const t = (value - d0) / span;
    return r0 + t * (r1 - r0);
  };
}

/**
 * Mốc trục "đẹp" (1/2/5 × 10^n). Luôn bắt đầu từ 0 vì mọi số liệu ở đây là đếm —
 * trục không bắt đầu từ 0 sẽ phóng đại chênh lệch.
 */
export function niceTicks(max: number, count = 4): number[] {
  if (!Number.isFinite(max) || max <= 0) return [0, 1];

  const rawStep = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;

  let step: number;
  if (normalized <= 1) step = magnitude;
  else if (normalized <= 2) step = 2 * magnitude;
  else if (normalized <= 5) step = 5 * magnitude;
  else step = 10 * magnitude;

  const ticks: number[] = [];
  for (let value = 0; value <= max + step / 2; value += step) {
    ticks.push(Math.round(value * 1000) / 1000);
  }
  if (ticks.length < 2) ticks.push(step);
  return ticks;
}

export function buildLinePath(points: Point[]): string {
  if (points.length === 0) return "";
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${round(point.x)} ${round(point.y)}`)
    .join(" ");
}

export function buildAreaPath(points: Point[], baselineY: number): string {
  if (points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  return [
    buildLinePath(points),
    `L${round(last.x)} ${round(baselineY)}`,
    `L${round(first.x)} ${round(baselineY)}`,
    "Z",
  ].join(" ");
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Gộp phần đuôi thành một dòng "Khác" tường minh — không bao giờ âm thầm cắt bỏ */
export function withOtherBucket<T extends { label: string; value: number }>(
  items: T[],
  limit: number,
): { label: string; value: number }[] {
  if (items.length <= limit) return items.map((item) => ({ label: item.label, value: item.value }));

  const head = items.slice(0, limit).map((item) => ({ label: item.label, value: item.value }));
  const tail = items.slice(limit).reduce((sum, item) => sum + item.value, 0);

  if (tail > 0) head.push({ label: "Khác", value: tail });
  return head;
}

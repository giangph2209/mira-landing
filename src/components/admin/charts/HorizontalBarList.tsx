import { VIZ_BAR, VIZ_INK } from "@/lib/viz/palette";
import { formatNumber, formatPercent } from "@/lib/format";

/**
 * Danh mục danh nghĩa (top trang, nguồn giới thiệu) dùng MỘT màu cho mọi thanh — tô thang
 * màu theo giá trị ở đây sẽ ngụ ý một thứ tự không có thật.
 */
export default function HorizontalBarList({
  items,
  emptyText = "Chưa có dữ liệu.",
}: {
  items: { label: string; value: number }[];
  emptyText?: string;
}) {
  if (items.length === 0) {
    return <p className="py-8 text-center text-sm text-text-gray">{emptyText}</p>;
  }

  const max = Math.max(...items.map((item) => item.value), 1);
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium text-text-dark" title={item.label}>
              {item.label}
            </span>
            <span className="shrink-0 tabular-nums text-text-gray">
              {formatNumber(item.value)}
              <span className="ml-1.5 text-xs" style={{ color: VIZ_INK.muted }}>
                {total > 0 ? formatPercent(item.value / total) : "—"}
              </span>
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#f1f3f2]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max((item.value / max) * 100, 1.5)}%`,
                backgroundColor: VIZ_BAR,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

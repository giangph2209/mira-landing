import { categoricalColor, VIZ_INK } from "@/lib/viz/palette";
import { formatNumber, formatPercent } from "@/lib/format";

/**
 * Thanh xếp chồng 100% thay cho pie/donut.
 *
 * Bộ màu categorical chỉ đạt kiểm tra tương phản ở dạng LIỀN KỀ; khi so tất cả các cặp
 * thì trượt dưới mù màu đỏ. Thanh xếp chồng chỉ đặt các màu cạnh nhau nên hợp lệ, còn
 * pie đặt mọi lát đối diện nhau nên không. Kèm bảng số bên dưới để không phải đọc bằng màu.
 */
export default function StackedBar({
  items,
  emptyText = "Chưa có dữ liệu.",
}: {
  items: { label: string; value: number }[];
  emptyText?: string;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return <p className="py-8 text-center text-sm text-text-gray">{emptyText}</p>;
  }

  return (
    <div>
      <div className="flex h-3.5 w-full gap-[2px] overflow-hidden rounded-full">
        {items.map((item, index) => (
          <div
            key={item.label}
            style={{
              width: `${(item.value / total) * 100}%`,
              backgroundColor: categoricalColor(index),
            }}
            title={`${item.label}: ${formatNumber(item.value)}`}
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2.5 text-sm">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: categoricalColor(index) }}
            />
            <span className="min-w-0 flex-1 truncate text-text-dark">{item.label}</span>
            <span className="shrink-0 tabular-nums text-text-gray">
              {formatNumber(item.value)}
            </span>
            <span
              className="w-14 shrink-0 text-right text-xs tabular-nums"
              style={{ color: VIZ_INK.muted }}
            >
              {formatPercent(item.value / total)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

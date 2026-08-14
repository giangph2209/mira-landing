import { VIZ_CATEGORICAL, VIZ_INK } from "@/lib/viz/palette";
import { buildAreaPath, buildLinePath, linearScale, niceTicks } from "@/lib/viz/scale";
import { formatDayLabel, formatNumber } from "@/lib/format";

const WIDTH = 760;
const HEIGHT = 240;
const PADDING = { top: 12, right: 12, bottom: 26, left: 46 };

/**
 * Một trục, một chuỗi. Cố ý không vẽ lượt xem và phiên chồng lên nhau — hai đại lượng
 * khác thang trên cùng một trục là cách nhanh nhất để đọc sai số liệu.
 */
export default function TimeSeriesChart({
  points,
  seriesLabel,
}: {
  points: { day: string; value: number }[];
  seriesLabel: string;
}) {
  if (points.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-text-gray">Chưa có dữ liệu trong khoảng này.</p>
    );
  }

  const values = points.map((point) => point.value);
  const max = Math.max(...values, 1);
  const ticks = niceTicks(max);
  const axisMax = ticks[ticks.length - 1];

  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;

  const x = linearScale([0, Math.max(points.length - 1, 1)], [
    PADDING.left,
    PADDING.left + innerWidth,
  ]);
  const y = linearScale([0, axisMax], [PADDING.top + innerHeight, PADDING.top]);

  const coords = points.map((point, index) => ({ x: x(index), y: y(point.value) }));
  const baselineY = PADDING.top + innerHeight;

  // nhãn trục X: chỉ hiện tối đa 6 mốc để không chồng chữ
  const labelStep = Math.max(1, Math.ceil(points.length / 6));

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-[240px] w-full min-w-[520px]"
        role="img"
        aria-label={`Biểu đồ ${seriesLabel} theo ngày`}
      >
        <defs>
          <linearGradient id="ts-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={VIZ_CATEGORICAL[0]} stopOpacity="0.18" />
            <stop offset="100%" stopColor={VIZ_CATEGORICAL[0]} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* lưới mảnh, lùi về sau */}
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING.left}
              x2={PADDING.left + innerWidth}
              y1={y(tick)}
              y2={y(tick)}
              stroke={tick === 0 ? VIZ_INK.baseline : VIZ_INK.grid}
              strokeWidth={1}
            />
            <text
              x={PADDING.left - 8}
              y={y(tick) + 4}
              textAnchor="end"
              fontSize="11"
              fill={VIZ_INK.muted}
            >
              {formatNumber(tick)}
            </text>
          </g>
        ))}

        <path d={buildAreaPath(coords, baselineY)} fill="url(#ts-area)" />
        <path
          d={buildLinePath(coords)}
          fill="none"
          stroke={VIZ_CATEGORICAL[0]}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* chỉ chấm điểm khi thưa, nếu không sẽ thành hàng rào */}
        {points.length <= 31
          ? coords.map((point, index) => (
              <circle
                key={points[index].day}
                cx={point.x}
                cy={point.y}
                r={3}
                fill={VIZ_INK.surface}
                stroke={VIZ_CATEGORICAL[0]}
                strokeWidth={2}
              >
                <title>{`${formatDayLabel(points[index].day)}: ${formatNumber(points[index].value)}`}</title>
              </circle>
            ))
          : null}

        {points.map((point, index) =>
          index % labelStep === 0 || index === points.length - 1 ? (
            <text
              key={point.day}
              x={x(index)}
              y={HEIGHT - 8}
              textAnchor="middle"
              fontSize="11"
              fill={VIZ_INK.muted}
            >
              {formatDayLabel(point.day)}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
}

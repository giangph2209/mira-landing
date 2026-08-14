import { VIZ_CATEGORICAL } from "@/lib/viz/palette";
import { buildLinePath, linearScale } from "@/lib/viz/scale";

const WIDTH = 120;
const HEIGHT = 32;

export default function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;

  const max = Math.max(...values, 1);
  const x = linearScale([0, values.length - 1], [1, WIDTH - 1]);
  const y = linearScale([0, max], [HEIGHT - 2, 2]);

  const points = values.map((value, index) => ({ x: x(index), y: y(value) }));

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-8 w-[120px]"
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        d={buildLinePath(points)}
        fill="none"
        stroke={VIZ_CATEGORICAL[0]}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      />
    </svg>
  );
}

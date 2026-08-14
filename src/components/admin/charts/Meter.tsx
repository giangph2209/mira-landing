import { VIZ_INK, rateTone } from "@/lib/viz/palette";
import { formatPercent } from "@/lib/format";

/** Đồng hồ một tỉ lệ — dùng cho bounce rate và tỷ lệ chuyển đổi */
export default function Meter({
  label,
  ratio,
  kind,
  hint,
}: {
  label: string;
  ratio: number | null;
  kind: "higher-better" | "lower-better";
  hint?: string;
}) {
  const value = ratio ?? 0;
  const color = ratio == null ? VIZ_INK.muted : rateTone(value, kind);

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-text-dark">{label}</span>
        <span className="font-heading text-lg font-bold tabular-nums" style={{ color: VIZ_INK.primary }}>
          {formatPercent(ratio)}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#f1f3f2]">
        <div
          className="h-full rounded-full transition-[width]"
          style={{ width: `${Math.min(Math.max(value, 0), 1) * 100}%`, backgroundColor: color }}
        />
      </div>
      {hint ? (
        <p className="mt-1.5 text-xs" style={{ color: VIZ_INK.muted }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

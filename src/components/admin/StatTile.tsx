import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import Sparkline from "@/components/admin/charts/Sparkline";
import { VIZ_INK, VIZ_STATUS } from "@/lib/viz/palette";
import { formatPercent } from "@/lib/format";

export default function StatTile({
  label,
  value,
  delta,
  /** với các chỉ số kiểu bounce rate thì tăng là xấu */
  deltaIsGood = true,
  hint,
  sparkline,
}: {
  label: string;
  value: string;
  delta?: number | null;
  deltaIsGood?: boolean;
  hint?: string;
  sparkline?: number[];
}) {
  const hasDelta = delta != null && Number.isFinite(delta);
  const positive = hasDelta && delta > 0;
  const flat = hasDelta && Math.abs(delta) < 0.001;

  const good = positive === deltaIsGood;
  const color = !hasDelta || flat ? VIZ_INK.muted : good ? VIZ_STATUS.good : VIZ_STATUS.critical;
  const Icon = !hasDelta || flat ? Minus : positive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="admin-surface flex flex-col gap-2 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: VIZ_INK.muted }}>
        {label}
      </p>

      <div className="flex items-end justify-between gap-3">
        <p className="font-heading text-2xl font-bold leading-none text-text-dark tabular-nums">
          {value}
        </p>
        {sparkline && sparkline.length > 1 ? <Sparkline values={sparkline} /> : null}
      </div>

      <div className="flex items-center gap-2 text-xs">
        {hasDelta ? (
          <span className="inline-flex items-center gap-1 font-semibold tabular-nums" style={{ color }}>
            <Icon size={14} aria-hidden />
            {formatPercent(Math.abs(delta))}
          </span>
        ) : null}
        <span style={{ color: VIZ_INK.muted }}>{hint ?? (hasDelta ? "so với kỳ trước" : "")}</span>
      </div>
    </div>
  );
}

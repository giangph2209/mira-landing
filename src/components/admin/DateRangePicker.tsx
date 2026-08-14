"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { RANGE_PRESETS, type RangePreset } from "@/lib/date-range";

export default function DateRangePicker({
  activePreset,
  fromDay,
  toDay,
}: {
  activePreset: RangePreset | null;
  fromDay: string;
  toDay: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const push = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    // đổi khoảng ngày thì con trỏ phân trang cũ không còn ý nghĩa
    params.delete("cursor");
    mutate(params);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2" data-pending={pending || undefined}>
      <div className="flex flex-wrap gap-1 rounded-lg bg-[#f1f3f2] p-1">
        {RANGE_PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() =>
              push((params) => {
                params.set("preset", preset.value);
                params.delete("from");
                params.delete("to");
              })
            }
            aria-pressed={activePreset === preset.value}
            className={[
              "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
              activePreset === preset.value
                ? "bg-white text-primary shadow-sm"
                : "text-text-gray hover:text-primary",
            ].join(" ")}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-text-gray">
        <input
          type="date"
          value={fromDay}
          max={toDay}
          onChange={(event) =>
            push((params) => {
              params.set("from", event.target.value);
              params.set("to", toDay);
              params.delete("preset");
            })
          }
          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-text-dark outline-none focus:border-primary"
          aria-label="Từ ngày"
        />
        <span>→</span>
        <input
          type="date"
          value={toDay}
          min={fromDay}
          onChange={(event) =>
            push((params) => {
              params.set("from", fromDay);
              params.set("to", event.target.value);
              params.delete("preset");
            })
          }
          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-text-dark outline-none focus:border-primary"
          aria-label="Đến ngày"
        />
      </div>
    </div>
  );
}

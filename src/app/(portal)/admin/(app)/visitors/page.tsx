import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import DateRangePicker from "@/components/admin/DateRangePicker";
import Pagination from "@/components/admin/Pagination";
import { requireAdmin } from "@/lib/dal";
import { parseDateRange } from "@/lib/date-range";
import { formatDateTime, formatDuration, formatNumber } from "@/lib/format";
import { CHANNEL_LABEL } from "@/lib/analytics/channel";
import { getVisitorSessions, parseVisitorCursor } from "@/lib/analytics/queries";
import type { TrafficChannel } from "@prisma/client";

export const metadata: Metadata = { title: "Khách truy cập" };

const PAGE_SIZE = 50;

const DEVICE_LABEL: Record<string, string> = {
  DESKTOP: "Máy tính",
  MOBILE: "Điện thoại",
  TABLET: "Máy tính bảng",
  OTHER: "Khác",
};

function pick(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function VisitorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const range = parseDateRange(params);
  const cursor = parseVisitorCursor(pick(params, "cursor"));
  const onlyConverted = pick(params, "converted") === "1";

  const { rows, nextCursor } = await getVisitorSessions({
    range,
    cursor,
    pageSize: PAGE_SIZE,
    onlyConverted,
  });

  const baseParams = new URLSearchParams();
  if (range.preset) baseParams.set("preset", range.preset);
  else {
    baseParams.set("from", range.fromDay);
    baseParams.set("to", range.toDay);
  }
  if (onlyConverted) baseParams.set("converted", "1");

  const nextHref = nextCursor
    ? `/admin/visitors?${new URLSearchParams({
        ...Object.fromEntries(baseParams),
        cursor: nextCursor,
      }).toString()}`
    : null;
  // Phân trang keyset chỉ đi tiến được; "Trước" đưa về đầu danh sách.
  const prevHref = cursor ? `/admin/visitors?${baseParams.toString()}` : null;

  const toggleHref = `/admin/visitors?${new URLSearchParams({
    ...Object.fromEntries(baseParams),
    ...(onlyConverted ? {} : { converted: "1" }),
  }).toString()}`;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-text-dark">Khách truy cập</h1>
          <p className="mt-0.5 text-sm text-text-gray">
            Từng phiên truy cập trong {range.days} ngày, mới nhất trước
          </p>
        </div>
        <DateRangePicker activePreset={range.preset} fromDay={range.fromDay} toDay={range.toDay} />
      </header>

      <div className="flex items-center gap-3">
        <a
          href={onlyConverted ? `/admin/visitors?${(() => {
            const next = new URLSearchParams(baseParams);
            next.delete("converted");
            return next.toString();
          })()}` : toggleHref}
          className={[
            "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
            onlyConverted
              ? "border-primary bg-primary/8 text-primary"
              : "border-gray-200 bg-white text-text-gray hover:border-primary hover:text-primary",
          ].join(" ")}
        >
          {onlyConverted ? "Đang lọc: có gửi form" : "Chỉ xem phiên có gửi form"}
        </a>
      </div>

      <DataTable
        headers={[
          "Bắt đầu",
          "IP",
          "Trang vào / ra",
          "Lượt xem",
          "Thời lượng",
          "Nguồn",
          "Thiết bị",
          "Gửi form",
        ]}
        isEmpty={rows.length === 0}
        empty="Chưa ghi nhận phiên truy cập nào trong khoảng thời gian này."
      >
        {rows.map((row) => {
          const durationSeconds =
            (row.lastEventAt.getTime() - row.startedAt.getTime()) / 1000;

          return (
            <tr key={row.id}>
              <td className="whitespace-nowrap">
                <div>{formatDateTime(row.startedAt)}</div>
                <div className="mt-0.5 text-xs text-text-gray">
                  {row.isReturning ? "Khách quay lại" : "Khách mới"}
                </div>
              </td>

              <td className="whitespace-nowrap font-mono text-xs">
                {row.ip ?? "—"}
                {row.country ? (
                  <div className="mt-0.5 font-sans text-xs text-text-gray">
                    {[row.city, row.country].filter(Boolean).join(", ")}
                  </div>
                ) : null}
              </td>

              <td className="max-w-[220px]">
                <div className="truncate" title={row.entryPath}>
                  {row.entryPath}
                </div>
                {row.exitPath !== row.entryPath ? (
                  <div className="mt-0.5 truncate text-xs text-text-gray" title={row.exitPath}>
                    → {row.exitPath}
                  </div>
                ) : null}
              </td>

              <td className="tabular-nums">{formatNumber(row.pageviewCount)}</td>
              <td className="whitespace-nowrap tabular-nums">{formatDuration(durationSeconds)}</td>

              <td className="max-w-[180px]">
                <div className="truncate">
                  {CHANNEL_LABEL[row.channel as TrafficChannel] ?? row.channel}
                </div>
                {row.referrerHost ? (
                  <div className="mt-0.5 truncate text-xs text-text-gray" title={row.referrerHost}>
                    {row.referrerHost}
                  </div>
                ) : null}
              </td>

              <td className="max-w-[160px]">
                <div className="truncate">{DEVICE_LABEL[row.deviceType] ?? row.deviceType}</div>
                <div className="mt-0.5 truncate text-xs text-text-gray">
                  {[row.browserName, row.osName].filter(Boolean).join(" · ") || "—"}
                </div>
              </td>

              <td>
                {row.converted ? (
                  <span className="status-pill status-pill--won">
                    <Check size={12} aria-hidden />
                    Có
                  </span>
                ) : (
                  <span className="text-text-gray">
                    <Minus size={14} aria-hidden />
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </DataTable>

      <Pagination
        prevHref={prevHref}
        nextHref={nextHref}
        summary={`Hiển thị ${rows.length} phiên · tối đa ${PAGE_SIZE} mỗi trang`}
      />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import DateRangePicker from "@/components/admin/DateRangePicker";
import StatTile from "@/components/admin/StatTile";
import ChartFrame from "@/components/admin/charts/ChartFrame";
import TimeSeriesChart from "@/components/admin/charts/TimeSeriesChart";
import HorizontalBarList from "@/components/admin/charts/HorizontalBarList";
import StackedBar from "@/components/admin/charts/StackedBar";
import Meter from "@/components/admin/charts/Meter";
import { requireAdmin } from "@/lib/dal";
import { parseDateRange, previousRange } from "@/lib/date-range";
import {
  computeDelta,
  formatDuration,
  formatNumber,
  formatPercent,
} from "@/lib/format";
import { CHANNEL_LABEL } from "@/lib/analytics/channel";
import {
  getBrowserBreakdown,
  getChannelBreakdown,
  getCountryBreakdown,
  getDeviceBreakdown,
  getKpiSummary,
  getOsBreakdown,
  getTimeSeries,
  getTopPages,
  getTopReferrers,
} from "@/lib/analytics/queries";
import { withOtherBucket } from "@/lib/viz/scale";
import type { TrafficChannel } from "@prisma/client";

export const metadata: Metadata = { title: "Tổng quan" };

const DEVICE_LABEL: Record<string, string> = {
  DESKTOP: "Máy tính",
  MOBILE: "Điện thoại",
  TABLET: "Máy tính bảng",
  OTHER: "Khác",
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Kiểm tra quyền ở chính page, không dựa vào layout
  await requireAdmin();

  const params = await searchParams;
  const range = parseDateRange(params);
  const prev = previousRange(range);

  // Chạy song song — 10 truy vấn độc lập, không cái nào phụ thuộc cái nào
  const [
    kpi,
    prevKpi,
    series,
    topPages,
    referrers,
    channels,
    devices,
    browsers,
    systems,
    countries,
  ] = await Promise.all([
    getKpiSummary(range),
    getKpiSummary(prev),
    getTimeSeries(range),
    getTopPages(range),
    getTopReferrers(range),
    getChannelBreakdown(range),
    getDeviceBreakdown(range),
    getBrowserBreakdown(range),
    getOsBreakdown(range),
    getCountryBreakdown(range),
  ]);

  const pageviewSeries = series.map((point) => ({ day: point.day, value: point.pageviews }));
  const sessionSpark = series.map((point) => point.sessions);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-text-dark">Tổng quan truy cập</h1>
          <p className="mt-0.5 text-sm text-text-gray">
            {range.days} ngày · đã loại các phiên bị nhận diện là bot
          </p>
        </div>
        <DateRangePicker
          activePreset={range.preset}
          fromDay={range.fromDay}
          toDay={range.toDay}
        />
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Lượt xem trang"
          value={formatNumber(kpi.pageviews)}
          delta={computeDelta(kpi.pageviews, prevKpi.pageviews)}
          sparkline={pageviewSeries.map((point) => point.value)}
        />
        <StatTile
          label="Khách duy nhất"
          value={formatNumber(kpi.visitors)}
          delta={computeDelta(kpi.visitors, prevKpi.visitors)}
        />
        <StatTile
          label="Phiên truy cập"
          value={formatNumber(kpi.sessions)}
          delta={computeDelta(kpi.sessions, prevKpi.sessions)}
          sparkline={sessionSpark}
        />
        <StatTile
          label="Yêu cầu liên hệ"
          value={formatNumber(kpi.submissions)}
          delta={computeDelta(kpi.submissions, prevKpi.submissions)}
        />
      </div>

      <ChartFrame
        title="Lượt xem trang theo ngày"
        subtitle="Một trục, một chuỗi — số phiên xem ở thẻ bên trên"
      >
        <TimeSeriesChart points={pageviewSeries} seriesLabel="lượt xem trang" />
      </ChartFrame>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="admin-surface flex flex-col gap-5 p-5">
          <h2 className="font-heading text-sm font-bold text-text-dark">Chất lượng truy cập</h2>

          <Meter
            label="Tỷ lệ thoát"
            ratio={kpi.bounceRate}
            kind="lower-better"
            hint="Phiên chỉ xem đúng 1 trang rồi rời đi"
          />
          <Meter
            label="Tỷ lệ chuyển đổi"
            ratio={kpi.conversionRate}
            kind="higher-better"
            hint="Phiên có gửi form liên hệ"
          />

          <div className="grid grid-cols-2 gap-4 border-t border-[#f1f3f2] pt-4">
            <div>
              <p className="text-xs text-text-gray">Thời lượng TB</p>
              <p className="mt-1 font-heading text-lg font-bold text-text-dark">
                {formatDuration(kpi.avgDurationSeconds)}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-gray">Phiên có tương tác</p>
              <p className="mt-1 font-heading text-lg font-bold text-text-dark">
                {formatDuration(kpi.avgEngagedDurationSeconds)}
              </p>
            </div>
          </div>
          <p className="-mt-2 text-xs leading-relaxed text-text-gray">
            Trung bình chung bị các phiên thoát ngay kéo về gần 0. Cột bên phải chỉ tính phiên
            xem từ 2 trang trở lên — đây mới là con số phản ánh mức độ quan tâm thật.
          </p>

          <div className="border-t border-[#f1f3f2] pt-4">
            <p className="text-xs text-text-gray">Khách mới trong kỳ</p>
            <p className="mt-1 font-heading text-lg font-bold text-text-dark">
              {formatNumber(kpi.newSessions)}
              <span className="ml-2 text-sm font-medium text-text-gray">
                {kpi.sessions > 0 ? formatPercent(kpi.newSessions / kpi.sessions) : "—"}
              </span>
            </p>
          </div>
        </section>

        <ChartFrame title="Nguồn truy cập" className="lg:col-span-2">
          <StackedBar
            items={withOtherBucket(
              channels.map((item) => ({
                label: CHANNEL_LABEL[item.label as TrafficChannel] ?? item.label,
                value: item.value,
              })),
              4,
            )}
          />
        </ChartFrame>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartFrame
          title="Trang được xem nhiều nhất"
          action={
            <Link href="/admin/visitors" className="text-xs font-semibold text-primary">
              Xem khách truy cập →
            </Link>
          }
        >
          <HorizontalBarList items={withOtherBucket(topPages, 8)} />
        </ChartFrame>

        <ChartFrame title="Trang giới thiệu" subtitle="Chỉ tính phiên có referrer">
          <HorizontalBarList
            items={withOtherBucket(referrers, 8)}
            emptyText="Chưa ghi nhận nguồn giới thiệu nào."
          />
        </ChartFrame>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartFrame title="Thiết bị">
          <StackedBar
            items={withOtherBucket(
              devices.map((item) => ({
                label: DEVICE_LABEL[item.label] ?? item.label,
                value: item.value,
              })),
              4,
            )}
          />
        </ChartFrame>

        <ChartFrame title="Trình duyệt">
          <StackedBar items={withOtherBucket(browsers, 4)} />
        </ChartFrame>

        <ChartFrame
          title="Quốc gia"
          subtitle="Chỉ có khi reverse proxy gửi kèm header vị trí"
        >
          <StackedBar
            items={withOtherBucket(countries, 4)}
            emptyText="Chưa có dữ liệu vị trí. Hệ thống hiện chỉ lưu địa chỉ IP."
          />
        </ChartFrame>
      </div>

      <ChartFrame title="Hệ điều hành">
        <StackedBar items={withOtherBucket(systems, 4)} />
      </ChartFrame>
    </div>
  );
}

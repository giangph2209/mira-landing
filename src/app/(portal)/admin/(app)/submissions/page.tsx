import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import FilterBar from "@/components/admin/FilterBar";
import Pagination from "@/components/admin/Pagination";
import StatusBadge from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/dal";
import { formatDateTime, formatNumber, formatRelative } from "@/lib/format";
import {
  SUBMISSION_PRIORITIES,
  SUBMISSION_STATUSES,
  priorityLabel,
} from "@/lib/submission-workflow";
import {
  getAssignableUsers,
  getServiceTypes,
  getSubmissionStats,
  listSubmissions,
  parseSubmissionFilters,
} from "@/lib/submissions";

export const metadata: Metadata = { title: "Yêu cầu liên hệ" };

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "updated", label: "Vừa cập nhật" },
];

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const filters = parseSubmissionFilters(params);

  const [{ rows, total, page, pageCount }, stats, serviceTypes, users] = await Promise.all([
    listSubmissions(filters),
    getSubmissionStats(),
    getServiceTypes(),
    getAssignableUsers(),
  ]);

  const buildHref = (overrides: Record<string, string | null>) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      const single = Array.isArray(value) ? value[0] : value;
      if (single) next.set(key, single);
    }
    for (const [key, value] of Object.entries(overrides)) {
      if (value === null) next.delete(key);
      else next.set(key, value);
    }
    const qs = next.toString();
    return qs ? `/admin/submissions?${qs}` : "/admin/submissions";
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-text-dark">Yêu cầu liên hệ</h1>
          <p className="mt-0.5 text-sm text-text-gray">
            {formatNumber(total)} yêu cầu khớp bộ lọc · tổng cộng {formatNumber(stats.total)}
          </p>
        </div>
        <Link
          href={buildHref({ page: null }).replace("/admin/submissions", "/admin/submissions/export")}
          prefetch={false}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-text-dark transition-colors hover:border-primary hover:text-primary"
        >
          <Download size={16} aria-hidden />
          Xuất CSV
        </Link>
      </header>

      {/* Tab trạng thái — chỉ hiện trạng thái đang có dữ liệu, cộng trạng thái đang lọc */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref({ status: null, page: null })}
          className={[
            "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
            filters.status === null
              ? "border-primary bg-primary/8 text-primary"
              : "border-gray-200 bg-white text-text-gray hover:border-primary hover:text-primary",
          ].join(" ")}
        >
          Tất cả ({formatNumber(stats.total)})
        </Link>

        {SUBMISSION_STATUSES.filter(
          (status) => (stats.counts.get(status.value) ?? 0) > 0 || filters.status === status.value,
        ).map((status) => (
          <Link
            key={status.value}
            href={buildHref({ status: status.value, page: null })}
            className={[
              "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
              filters.status === status.value
                ? "border-primary bg-primary/8 text-primary"
                : "border-gray-200 bg-white text-text-gray hover:border-primary hover:text-primary",
            ].join(" ")}
          >
            {status.label} ({formatNumber(stats.counts.get(status.value) ?? 0)})
          </Link>
        ))}
      </div>

      <FilterBar
        searchPlaceholder="Tìm theo tên, email, số điện thoại, công ty..."
        filters={[
          {
            key: "priority",
            label: "Ưu tiên",
            options: [
              { value: "", label: "Tất cả" },
              ...SUBMISSION_PRIORITIES.map((item) => ({
                value: item.value,
                label: item.label,
              })),
            ],
          },
          {
            key: "assignee",
            label: "Phụ trách",
            options: [
              { value: "", label: "Tất cả" },
              { value: "none", label: "Chưa phân công" },
              ...users.map((user) => ({ value: user.id, label: user.name })),
            ],
          },
          {
            key: "service",
            label: "Dịch vụ",
            options: [
              { value: "", label: "Tất cả" },
              ...serviceTypes.map((service) => ({ value: service, label: service })),
            ],
          },
          { key: "sort", label: "Sắp xếp", options: SORT_OPTIONS },
        ]}
      />

      <DataTable
        headers={["Khách hàng", "Dịch vụ quan tâm", "Trạng thái", "Ưu tiên", "Phụ trách", "Gửi lúc"]}
        isEmpty={rows.length === 0}
        empty="Không có yêu cầu nào khớp với bộ lọc hiện tại."
      >
        {rows.map((row) => (
          <tr key={row.id}>
            <td className="max-w-[260px]">
              <Link
                href={`/admin/submissions/${row.id}`}
                className="font-semibold text-primary hover:underline"
              >
                {row.name}
              </Link>
              <div className="mt-0.5 truncate text-xs text-text-gray" title={row.email}>
                {row.email} · {row.phone}
              </div>
              {row.company ? (
                <div className="mt-0.5 truncate text-xs text-text-gray">{row.company}</div>
              ) : null}
            </td>

            <td className="max-w-[220px]">
              <div className="truncate" title={row.serviceType}>
                {row.serviceType}
              </div>
              {row.referrerHost ? (
                <div className="mt-0.5 truncate text-xs text-text-gray">
                  từ {row.referrerHost}
                </div>
              ) : null}
            </td>

            <td>
              <StatusBadge status={row.status} />
            </td>

            <td className="whitespace-nowrap text-sm">{priorityLabel(row.priority)}</td>

            <td className="whitespace-nowrap text-sm">
              {row.assignedTo?.name ?? <span className="text-text-gray">Chưa phân công</span>}
            </td>

            <td className="whitespace-nowrap">
              <div>{formatDateTime(row.createdAt)}</div>
              <div className="mt-0.5 text-xs text-text-gray">{formatRelative(row.createdAt)}</div>
            </td>
          </tr>
        ))}
      </DataTable>

      <Pagination
        prevHref={page > 1 ? buildHref({ page: String(page - 1) }) : null}
        nextHref={page < pageCount ? buildHref({ page: String(page + 1) }) : null}
        summary={`Trang ${formatNumber(page)} / ${formatNumber(pageCount)}`}
      />
    </div>
  );
}

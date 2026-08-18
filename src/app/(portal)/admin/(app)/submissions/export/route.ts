import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/dal";
import { csvResponse, toCsv } from "@/lib/csv";
import { formatDateTime } from "@/lib/format";
import { priorityLabel, statusLabel } from "@/lib/submission-workflow";
import { listSubmissionsForExport, parseSubmissionFilters } from "@/lib/submissions";
import { todayIso } from "@/lib/date-range";

const HEADERS = [
  "ID",
  "Họ tên",
  "Email",
  "Điện thoại",
  "Công ty",
  "Dịch vụ quan tâm",
  "Lời nhắn",
  "Trạng thái",
  "Ưu tiên",
  "Phụ trách",
  "Trang vào đầu tiên",
  "Nguồn giới thiệu",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "IP",
  "Gửi lúc",
  "Liên hệ lần đầu",
  "Đóng lúc",
];

export async function GET(request: NextRequest) {
  // Route handler tự xác thực lại — proxy.ts chỉ kiểm tra cookie có tồn tại hay không
  await requireAdmin();

  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const filters = parseSubmissionFilters(params);
  const rows = await listSubmissionsForExport(filters);

  const body = toCsv(
    HEADERS,
    rows.map((row) => [
      row.id,
      row.name,
      row.email,
      row.phone,
      row.company ?? "",
      row.serviceType,
      row.message,
      statusLabel(row.status),
      priorityLabel(row.priority),
      row.assignedTo?.name ?? "",
      row.landingPath ?? "",
      row.referrerHost ?? "",
      row.utmSource ?? "",
      row.utmMedium ?? "",
      row.utmCampaign ?? "",
      row.ip ?? "",
      formatDateTime(row.createdAt),
      formatDateTime(row.contactedAt),
      formatDateTime(row.closedAt),
    ]),
  );

  return csvResponse(`yeu-cau-lien-he-${todayIso()}.csv`, body);
}

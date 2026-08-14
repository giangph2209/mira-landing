import type { SubmissionPriority, SubmissionStatus } from "@prisma/client";

export type StatusTone = "new" | "progress" | "won" | "lost" | "muted";

export const SUBMISSION_STATUSES: {
  value: SubmissionStatus;
  label: string;
  tone: StatusTone;
}[] = [
  { value: "NEW", label: "Mới", tone: "new" },
  { value: "CONTACTED", label: "Đã liên hệ", tone: "progress" },
  { value: "QUALIFIED", label: "Đủ điều kiện", tone: "progress" },
  { value: "PROPOSAL_SENT", label: "Đã gửi báo giá", tone: "progress" },
  { value: "NEGOTIATING", label: "Đang thương lượng", tone: "progress" },
  { value: "WON", label: "Chốt thành công", tone: "won" },
  { value: "LOST", label: "Không thành công", tone: "lost" },
  { value: "SPAM", label: "Spam", tone: "muted" },
  { value: "ARCHIVED", label: "Lưu trữ", tone: "muted" },
];

const STATUS_MAP = new Map(SUBMISSION_STATUSES.map((item) => [item.value, item]));

export function statusLabel(status: SubmissionStatus): string {
  return STATUS_MAP.get(status)?.label ?? status;
}

export function statusTone(status: SubmissionStatus): StatusTone {
  return STATUS_MAP.get(status)?.tone ?? "muted";
}

/**
 * Đồ thị chuyển trạng thái hợp lệ. Mục đích là chặn thao tác nhầm (ví dụ WON → NEW),
 * đồng thời giữ lịch sử SubmissionStatusEvent có ý nghĩa.
 *
 * SPAM và ARCHIVED luôn đi được từ mọi trạng thái, và luôn quay lại được NEW để sửa sai.
 */
const TRANSITIONS: Record<SubmissionStatus, SubmissionStatus[]> = {
  NEW: ["CONTACTED", "QUALIFIED", "LOST", "SPAM", "ARCHIVED"],
  CONTACTED: ["QUALIFIED", "PROPOSAL_SENT", "LOST", "SPAM", "ARCHIVED"],
  QUALIFIED: ["PROPOSAL_SENT", "NEGOTIATING", "LOST", "ARCHIVED"],
  PROPOSAL_SENT: ["NEGOTIATING", "WON", "LOST", "ARCHIVED"],
  NEGOTIATING: ["WON", "LOST", "PROPOSAL_SENT", "ARCHIVED"],
  WON: ["ARCHIVED"],
  LOST: ["CONTACTED", "ARCHIVED"],
  SPAM: ["NEW", "ARCHIVED"],
  ARCHIVED: ["NEW"],
};

export function allowedTransitions(from: SubmissionStatus): SubmissionStatus[] {
  return TRANSITIONS[from] ?? [];
}

export function canTransition(from: SubmissionStatus, to: SubmissionStatus): boolean {
  if (from === to) return false;
  return allowedTransitions(from).includes(to);
}

/** Trạng thái đóng — dùng để set closedAt */
export function isClosedStatus(status: SubmissionStatus): boolean {
  return status === "WON" || status === "LOST" || status === "SPAM" || status === "ARCHIVED";
}

/** Trạng thái tính là đã tiếp cận khách — dùng để set contactedAt lần đầu */
export function isContactedStatus(status: SubmissionStatus): boolean {
  return status !== "NEW" && status !== "SPAM" && status !== "ARCHIVED";
}

export const SUBMISSION_PRIORITIES: { value: SubmissionPriority; label: string }[] = [
  { value: "LOW", label: "Thấp" },
  { value: "NORMAL", label: "Bình thường" },
  { value: "HIGH", label: "Cao" },
  { value: "URGENT", label: "Khẩn cấp" },
];

export function priorityLabel(priority: SubmissionPriority): string {
  return SUBMISSION_PRIORITIES.find((item) => item.value === priority)?.label ?? priority;
}

export function isSubmissionStatus(value: unknown): value is SubmissionStatus {
  return typeof value === "string" && STATUS_MAP.has(value as SubmissionStatus);
}

export function isSubmissionPriority(value: unknown): value is SubmissionPriority {
  return (
    typeof value === "string" &&
    SUBMISSION_PRIORITIES.some((item) => item.value === (value as SubmissionPriority))
  );
}

"use server";

import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { canWrite, requireAdminSoft } from "@/lib/dal";
import {
  canTransition,
  isClosedStatus,
  isContactedStatus,
  isSubmissionPriority,
  isSubmissionStatus,
  statusLabel,
} from "@/lib/submission-workflow";

export type ActionState = { error?: string; success?: string };

const EXPIRED = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
const FORBIDDEN = "Tài khoản của bạn chỉ có quyền xem.";

/**
 * Server Action là POST vào chính path của page, nên matcher của proxy có match —
 * nhưng proxy chỉ kiểm tra cookie có tồn tại. Mọi action đều phải tự xác thực lại,
 * và trả lỗi vào state thay vì redirect để người dùng không mất dữ liệu đang nhập.
 */
async function guard() {
  const session = await requireAdminSoft();
  if (!session) return { error: EXPIRED } as const;
  if (!canWrite(session.user.role)) return { error: FORBIDDEN } as const;
  return { session } as const;
}

export async function changeStatus(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if ("error" in auth) return auth;

  const id = String(formData.get("id") ?? "");
  const toStatus = formData.get("status");
  const note = String(formData.get("note") ?? "").trim() || null;

  if (!id || !isSubmissionStatus(toStatus)) {
    return { error: "Dữ liệu không hợp lệ." };
  }

  const current = await prisma.contactSubmission.findUnique({
    where: { id },
    select: { status: true, contactedAt: true },
  });
  if (!current) return { error: "Không tìm thấy yêu cầu này." };

  if (!canTransition(current.status, toStatus)) {
    return {
      error: `Không thể chuyển từ "${statusLabel(current.status)}" sang "${statusLabel(toStatus)}".`,
    };
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.contactSubmission.update({
      where: { id },
      data: {
        status: toStatus,
        ...(isContactedStatus(toStatus) && !current.contactedAt ? { contactedAt: now } : {}),
        closedAt: isClosedStatus(toStatus) ? now : null,
      },
    }),
    prisma.submissionStatusEvent.create({
      data: {
        submissionId: id,
        fromStatus: current.status,
        toStatus,
        actorId: auth.session.user.id,
        note,
      },
    }),
  ]);

  // Trang admin luôn dynamic (đọc cookie) nên không có cache để invalidate;
  // refresh() là primitive đúng để render lại router phía client.
  refresh();
  return { success: `Đã chuyển sang "${statusLabel(toStatus)}".` };
}

export async function assignSubmission(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if ("error" in auth) return auth;

  const id = String(formData.get("id") ?? "");
  const raw = String(formData.get("assignedToId") ?? "");
  const assignedToId = raw === "" ? null : raw;

  if (!id) return { error: "Dữ liệu không hợp lệ." };

  if (assignedToId) {
    const exists = await prisma.adminUser.findUnique({
      where: { id: assignedToId },
      select: { id: true },
    });
    if (!exists) return { error: "Người phụ trách không tồn tại." };
  }

  await prisma.contactSubmission.update({ where: { id }, data: { assignedToId } });

  refresh();
  return { success: assignedToId ? "Đã giao phụ trách." : "Đã bỏ phân công." };
}

export async function setPriority(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if ("error" in auth) return auth;

  const id = String(formData.get("id") ?? "");
  const priority = formData.get("priority");

  if (!id || !isSubmissionPriority(priority)) return { error: "Dữ liệu không hợp lệ." };

  await prisma.contactSubmission.update({ where: { id }, data: { priority } });

  refresh();
  return { success: "Đã cập nhật mức ưu tiên." };
}

export async function addNote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await guard();
  if ("error" in auth) return auth;

  const id = String(formData.get("id") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (!id) return { error: "Dữ liệu không hợp lệ." };
  if (!body) return { error: "Nội dung ghi chú không được để trống." };
  if (body.length > 5000) return { error: "Ghi chú quá dài (tối đa 5000 ký tự)." };

  await prisma.submissionNote.create({
    data: { submissionId: id, authorId: auth.session.user.id, body },
  });

  refresh();
  return { success: "Đã thêm ghi chú." };
}

/**
 * Xoá toàn bộ dữ liệu theo dõi của một khách. IP là dữ liệu cá nhân theo Nghị định 13,
 * nên cần có đường để đáp ứng yêu cầu xoá của người dùng.
 */
export async function deleteVisitorData(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if ("error" in auth) return auth;
  if (auth.session.user.role !== "OWNER") {
    return { error: "Chỉ chủ sở hữu mới được xoá dữ liệu khách truy cập." };
  }

  const visitorId = String(formData.get("visitorId") ?? "");
  if (!visitorId) return { error: "Dữ liệu không hợp lệ." };

  // PageView và VisitorSession có onDelete: Cascade nên xoá Visitor là đủ
  await prisma.visitor.deleteMany({ where: { id: visitorId } });
  await prisma.contactSubmission.updateMany({
    where: { visitorId },
    data: { ip: null, userAgent: null, visitorId: null, sessionId: null },
  });

  refresh();
  return { success: "Đã xoá dữ liệu theo dõi của khách này." };
}

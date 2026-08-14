"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSoft } from "@/lib/dal";
import { hashPassword, verifyPassword } from "@/lib/password";
import { destroySession, revokeOtherSessions } from "@/lib/session";

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export type ChangePasswordState = { error?: string; success?: boolean };

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  // Server Action là POST vào chính path của page nên matcher của proxy có match, nhưng
  // proxy chỉ kiểm tra sự tồn tại của cookie — phải xác thực lại ở đây.
  const session = await requireAdminSoft();
  if (!session) {
    return { error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." };
  }

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!current || !next || !confirm) {
    return { error: "Vui lòng điền đầy đủ các ô." };
  }
  if (next.length < 10) {
    return { error: "Mật khẩu mới phải dài ít nhất 10 ký tự." };
  }
  if (next !== confirm) {
    return { error: "Mật khẩu xác nhận không khớp." };
  }

  const user = await prisma.adminUser.findUnique({ where: { id: session.user.id } });
  if (!user || !(await verifyPassword(current, user.passwordHash))) {
    return { error: "Mật khẩu hiện tại không đúng." };
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(next) },
  });

  // Đổi mật khẩu thì mọi phiên khác phải chết, giữ lại đúng phiên đang thao tác
  await revokeOtherSessions(user.id, session.sessionId);

  refresh();
  return { success: true };
}

import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AdminRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { IDLE_TIMEOUT_MS, SESSION_COOKIE, hashToken } from "@/lib/session";

export type AdminUserDTO = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
};

export type AdminSessionContext = {
  sessionId: string;
  user: AdminUserDTO;
};

/**
 * Tầng kiểm tra quyền THẬT (proxy.ts chỉ kiểm tra cookie có tồn tại hay không).
 *
 * Bọc trong React cache() nên nhiều lời gọi trong cùng một lượt render chỉ tốn 1 query.
 * redirect() KHÔNG được nằm trong này — redirect throw, mà throw bên trong memo của cache()
 * sẽ làm hỏng entry đã cache cho toàn bộ lượt render.
 */
export const verifySession = cache(async (): Promise<AdminSessionContext | null> => {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const row = await prisma.adminSession.findUnique({
    where: { tokenHash: hashToken(raw) },
    include: { user: true },
  });
  if (!row) return null;

  const now = Date.now();
  if (row.revokedAt) return null;
  if (row.expiresAt.getTime() < now) return null;
  if (now - row.lastSeenAt.getTime() > IDLE_TIMEOUT_MS) return null;
  if (!row.user.isActive) return null;

  // DTO — passwordHash không bao giờ ra khỏi đây
  return {
    sessionId: row.id,
    user: {
      id: row.user.id,
      email: row.user.email,
      name: row.user.name,
      role: row.user.role,
    },
  };
});

export const getCurrentUser = cache(async (): Promise<AdminUserDTO | null> => {
  return (await verifySession())?.user ?? null;
});

/**
 * Gọi từ MỌI page, MỌI Server Action, MỌI Route Handler của khu vực admin.
 *
 * Không bao giờ chỉ đặt ở layout: Partial Rendering làm layout không re-render khi điều
 * hướng phía client, nên kiểm tra ở layout là bỏ lọt. Ngoài ra Server Action là POST vào
 * chính path của page nên cũng phải tự kiểm tra lại.
 */
export async function requireAdmin(roles?: AdminRole[]): Promise<AdminSessionContext> {
  const session = await verifySession();

  if (!session) {
    redirect("/admin/login");
  }
  if (roles && !roles.includes(session.user.role)) {
    redirect("/admin?error=forbidden");
  }

  return session;
}

/** Bản không redirect — dùng trong Server Action để trả lỗi vào state thay vì đá trang */
export async function requireAdminSoft(): Promise<AdminSessionContext | null> {
  return verifySession();
}

export function canWrite(role: AdminRole) {
  return role === "OWNER" || role === "ADMIN";
}

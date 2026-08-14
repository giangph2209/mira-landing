import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "mira_admin_session";

/** Không hoạt động sau 12h không dùng — kiểm tra phía server qua AdminSession.lastSeenAt */
export const IDLE_TIMEOUT_MS = 12 * 60 * 60 * 1000;
/** Hạn tuyệt đối, khớp với maxAge của cookie */
export const ABSOLUTE_TIMEOUT_MS = 30 * 24 * 60 * 60 * 1000;

function isSecureCookie() {
  return process.env.SESSION_COOKIE_SECURE !== "false";
}

export function mintToken() {
  return randomBytes(32).toString("base64url");
}

export function hashToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

/**
 * Chỉ gọi được trong Server Action hoặc Route Handler — App Router không cho Set-Cookie
 * trong lúc render page.
 */
export async function createSession(input: {
  userId: string;
  ip: string | null;
  userAgent: string | null;
}) {
  const raw = mintToken();
  const expiresAt = new Date(Date.now() + ABSOLUTE_TIMEOUT_MS);

  await prisma.adminSession.create({
    data: {
      tokenHash: hashToken(raw),
      userId: input.userId,
      ip: input.ip,
      userAgent: input.userAgent?.slice(0, 512) ?? null,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, raw, {
    httpOnly: true,
    secure: isSecureCookie(),
    // "lax" chứ không "strict": Server Action là POST same-site, còn "strict" làm hỏng
    // redirect sau khi đăng nhập từ một tab mới.
    sameSite: "lax",
    // "/" chứ không "/admin": Server Action POST vào chính path của page, cookie giới hạn
    // theo path rất dễ vỡ khi đi qua ranh giới /admin.
    path: "/",
    maxAge: Math.floor(ABSOLUTE_TIMEOUT_MS / 1000),
  });

  return { expiresAt };
}

export async function destroySession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;

  if (raw) {
    await prisma.adminSession.updateMany({
      where: { tokenHash: hashToken(raw), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  cookieStore.delete(SESSION_COOKIE);
}

/** Thu hồi mọi phiên khác của cùng người dùng (đổi mật khẩu, "đăng xuất tất cả thiết bị") */
export async function revokeOtherSessions(userId: string, keepSessionId?: string) {
  await prisma.adminSession.updateMany({
    where: {
      userId,
      revokedAt: null,
      ...(keepSessionId ? { id: { not: keepSessionId } } : {}),
    },
    data: { revokedAt: new Date() },
  });
}

/** Bump mốc idle-timeout. Gọi trong after() nên không làm chậm response. */
export async function touchSession(sessionId: string) {
  await prisma.adminSession.update({
    where: { id: sessionId },
    data: { lastSeenAt: new Date() },
  });
}

import "server-only";

import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_PER_IP = 10;
const MAX_FAILED_PER_ACCOUNT = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const ATTEMPT_RETENTION_MS = 24 * 60 * 60 * 1000;

/**
 * Lưu ở DB chứ không dùng Map in-memory: Map mất sạch sau mỗi lần HMR và mỗi lần restart
 * container, tức là kẻ tấn công chỉ cần chờ một lần deploy.
 */
export async function isIpThrottled(ip: string | null): Promise<boolean> {
  if (!ip) return false;

  const failed = await prisma.loginAttempt.count({
    where: {
      ip,
      success: false,
      createdAt: { gt: new Date(Date.now() - WINDOW_MS) },
    },
  });

  return failed >= MAX_FAILED_PER_IP;
}

export async function recordLoginAttempt(input: {
  ip: string | null;
  email: string | null;
  success: boolean;
}) {
  await prisma.loginAttempt.create({
    data: {
      ip: input.ip ?? "unknown",
      email: input.email,
      success: input.success,
    },
  });
}

export function isAccountLocked(user: { lockedUntil: Date | null }): boolean {
  return Boolean(user.lockedUntil && user.lockedUntil.getTime() > Date.now());
}

export async function registerFailedAttempt(userId: string, currentFailedAttempts: number) {
  const next = currentFailedAttempts + 1;

  await prisma.adminUser.update({
    where: { id: userId },
    data: {
      failedAttempts: next,
      lockedUntil: next >= MAX_FAILED_PER_ACCOUNT ? new Date(Date.now() + LOCK_DURATION_MS) : null,
    },
  });
}

export async function clearFailedAttempts(userId: string) {
  await prisma.adminUser.update({
    where: { id: userId },
    data: { failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
  });
}

/** Gọi trong after() sau mỗi lần đăng nhập — giữ bảng luôn nhỏ mà không cần cron */
export async function pruneLoginAttempts() {
  await prisma.loginAttempt.deleteMany({
    where: { createdAt: { lt: new Date(Date.now() - ATTEMPT_RETENTION_MS) } },
  });
}

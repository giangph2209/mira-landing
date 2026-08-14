"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { DUMMY_HASH, verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import { getClientIp } from "@/lib/request-context";
import {
  clearFailedAttempts,
  isAccountLocked,
  isIpThrottled,
  pruneLoginAttempts,
  recordLoginAttempt,
  registerFailedAttempt,
} from "@/lib/rate-limit";

export type LoginState = {
  error?: string;
  email?: string;
};

// Một thông báo duy nhất cho mọi trường hợp thất bại — sai email, sai mật khẩu, tài khoản
// bị khoá hay bị vô hiệu hoá đều giống nhau, để không dò được tài khoản nào có thật.
const GENERIC_ERROR = "Email hoặc mật khẩu không đúng.";
const THROTTLED_ERROR =
  "Bạn đã thử sai quá nhiều lần. Vui lòng đợi 15 phút rồi thử lại.";

function safeNextPath(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "/admin";
  // chỉ chấp nhận đường dẫn nội bộ trong /admin — chặn open redirect
  if (!value.startsWith("/admin") || value.startsWith("//")) return "/admin";
  return value;
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = safeNextPath(formData.get("next"));

  if (!email || !password) {
    return { error: "Vui lòng nhập đầy đủ email và mật khẩu.", email };
  }

  const headerList = await headers();
  const ip = getClientIp(headerList);
  const userAgent = headerList.get("user-agent");

  if (await isIpThrottled(ip)) {
    return { error: THROTTLED_ERROR, email };
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });

  // Luôn chạy verifyPassword — kể cả khi không có user — để thời gian phản hồi không lộ
  // email nào tồn tại.
  const passwordOk = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !user.isActive || isAccountLocked(user) || !passwordOk) {
    if (user && user.isActive && !isAccountLocked(user) && !passwordOk) {
      await registerFailedAttempt(user.id, user.failedAttempts);
    }
    await recordLoginAttempt({ ip, email, success: false });
    return { error: GENERIC_ERROR, email };
  }

  await clearFailedAttempts(user.id);
  await recordLoginAttempt({ ip, email, success: true });
  await createSession({ userId: user.id, ip, userAgent });

  after(async () => {
    await pruneLoginAttempts();
  });

  // redirect() throw — phải nằm ngoài mọi try/catch, và là câu lệnh cuối cùng.
  redirect(nextPath);
}

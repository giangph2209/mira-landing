import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { after } from "next/server";
import AdminShell from "@/components/admin/AdminShell";
import { verifySession } from "@/lib/dal";
import { touchSession } from "@/lib/session";

export default async function AdminAppLayout({ children }: { children: ReactNode }) {
  // Layout KHÔNG phải là chốt bảo vệ: Partial Rendering làm layout không re-render khi
  // điều hướng phía client, nên mỗi page/action/route handler đều tự gọi requireAdmin().
  // Ở đây chỉ lấy thông tin để hiển thị, cộng một lần redirect cho trường hợp vào thẳng URL.
  const session = await verifySession();
  if (!session) {
    redirect("/admin/login");
  }

  // Bump mốc idle-timeout sau khi response đã trả — after() không làm route thành dynamic
  after(async () => {
    await touchSession(session.sessionId);
  });

  return <AdminShell user={session.user}>{children}</AdminShell>;
}

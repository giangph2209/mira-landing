import type { Metadata } from "next";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import DataTable from "@/components/admin/DataTable";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatRelative } from "@/lib/format";

export const metadata: Metadata = { title: "Tài khoản" };

const ROLE_LABEL: Record<string, string> = {
  OWNER: "Chủ sở hữu",
  ADMIN: "Quản trị viên",
  VIEWER: "Chỉ xem",
};

export default async function AccountPage() {
  const { user, sessionId } = await requireAdmin();

  const sessions = await prisma.adminSession.findMany({
    where: { userId: user.id, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { lastSeenAt: "desc" },
    take: 20,
    select: { id: true, ip: true, userAgent: true, createdAt: true, lastSeenAt: true },
  });

  return (
    <div className="flex max-w-4xl flex-col gap-5">
      <header>
        <h1 className="font-heading text-xl font-bold text-text-dark">Tài khoản</h1>
        <p className="mt-0.5 text-sm text-text-gray">
          {user.name} · {user.email} · {ROLE_LABEL[user.role] ?? user.role}
        </p>
      </header>

      <section className="admin-surface p-5">
        <h2 className="mb-4 font-heading text-sm font-bold text-text-dark">Đổi mật khẩu</h2>
        <ChangePasswordForm />
      </section>

      <section>
        <h2 className="mb-3 font-heading text-sm font-bold text-text-dark">
          Phiên đăng nhập đang hoạt động
        </h2>
        <DataTable
          headers={["Thiết bị", "IP", "Đăng nhập lúc", "Hoạt động cuối"]}
          isEmpty={sessions.length === 0}
          empty="Không có phiên nào."
        >
          {sessions.map((session) => (
            <tr key={session.id}>
              <td className="max-w-[380px]">
                <div className="truncate" title={session.userAgent ?? undefined}>
                  {session.userAgent ?? "Không rõ"}
                </div>
                {session.id === sessionId ? (
                  <span className="status-pill status-pill--won mt-1">Phiên hiện tại</span>
                ) : null}
              </td>
              <td className="whitespace-nowrap font-mono text-xs">{session.ip ?? "—"}</td>
              <td className="whitespace-nowrap">{formatDateTime(session.createdAt)}</td>
              <td className="whitespace-nowrap">{formatRelative(session.lastSeenAt)}</td>
            </tr>
          ))}
        </DataTable>
        <p className="mt-2 text-xs text-text-gray">
          Đổi mật khẩu sẽ đăng xuất toàn bộ phiên khác. Phiên tự hết hạn sau 12 giờ không hoạt
          động, và tối đa 30 ngày.
        </p>
      </section>
    </div>
  );
}

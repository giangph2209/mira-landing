import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập",
};

// searchParams là Promise ở Next 16
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // proxy.ts chỉ kiểm tra cookie có tồn tại; ở đây kiểm tra thật, nên cookie hỏng/hết hạn
  // vẫn vào được trang đăng nhập thay vì kẹt trong vòng lặp chuyển hướng.
  const session = await verifySession();
  if (session) {
    redirect("/admin");
  }

  const params = await searchParams;
  const nextPath =
    params.next && params.next.startsWith("/admin") && !params.next.startsWith("//")
      ? params.next
      : "/admin";

  return (
    <div className="admin-surface p-7 sm:p-8">
      <h1 className="font-heading text-xl font-bold text-text-dark">Đăng nhập quản trị</h1>
      <p className="mt-1.5 mb-6 text-sm text-text-gray">
        Khu vực nội bộ. Vui lòng đăng nhập bằng tài khoản được cấp.
      </p>
      <LoginForm nextPath={nextPath} />
    </div>
  );
}

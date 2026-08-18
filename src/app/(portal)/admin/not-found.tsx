import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-light px-6">
      <div className="admin-surface w-full max-w-md p-8 text-center">
        <p className="font-heading text-4xl font-bold text-primary">404</p>
        <h1 className="mt-2 font-heading text-xl font-bold text-text-dark">
          Không tìm thấy trang
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-gray">
          Đường dẫn này không tồn tại trong khu vực quản trị.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Về bảng điều khiển
        </Link>
      </div>
    </div>
  );
}

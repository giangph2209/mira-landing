"use client";

import Button from "@/components/ui/Button";

// Next 16.2: prop retry của error boundary là `unstable_retry`, không phải `reset`.
export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-light px-6">
      <div className="admin-surface w-full max-w-md p-8 text-center">
        <h1 className="font-heading text-xl font-bold text-text-dark">
          Đã có lỗi xảy ra
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-gray">
          Không tải được nội dung trang quản trị. Thử lại giúp bạn hoặc kiểm tra log máy chủ.
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-text-gray">Mã lỗi: {error.digest}</p>
        ) : null}
        <Button className="mt-6 w-full" onClick={() => unstable_retry()}>
          Thử lại
        </Button>
      </div>
    </div>
  );
}

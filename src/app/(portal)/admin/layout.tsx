import type { Metadata } from "next";
import type { ReactNode } from "react";

// Ghi đè `robots: index/follow` của root layout cho toàn bộ nhánh /admin.
// Đây là một trong 4 lớp chặn index: metadata (thẻ meta), header X-Robots-Tag từ
// src/proxy.ts (phủ cả response không phải HTML), robots.txt, và việc JSON-LD đã được
// dời khỏi root layout sang trang chủ.
export const metadata: Metadata = {
  title: {
    default: "Quản trị",
    template: "%s | Quản trị",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}

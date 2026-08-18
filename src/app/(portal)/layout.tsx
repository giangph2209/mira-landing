import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ibmPlexSans, roboto } from "@/lib/fonts";
import "../globals.css";

/**
 * Root layout riêng cho khu vực quản trị.
 *
 * Trước khi có i18n, /admin dùng chung root layout với trang công khai. Nay trang
 * công khai nằm dưới /[lang] và cần <html lang> đổi theo locale, nên hai nhánh tách
 * thành hai root layout riêng (đúng cách Next docs mô tả cho multiple root layouts).
 *
 * Khác biệt cố ý so với trang công khai: KHÔNG gắn AnalyticsBeacon. Trước đây beacon
 * nằm ở root layout dùng chung nên chính lượt truy cập của admin cũng bị ghi vào
 * thống kê khách truy cập.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function PortalRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${ibmPlexSans.variable} ${roboto.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

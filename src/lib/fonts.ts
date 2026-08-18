import { IBM_Plex_Sans, Noto_Sans_JP, Roboto } from "next/font/google";

export const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

export const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto",
  display: "swap",
});

/**
 * IBM Plex Sans và Roboto (subset latin + vietnamese) KHÔNG có glyph tiếng Nhật —
 * để nguyên thì trang /ja rơi về font mặc định của hệ điều hành, mỗi máy một kiểu.
 *
 * Chỉ gắn class này cho <html> khi lang="ja". next/font sinh @font-face sẵn nhưng
 * trình duyệt chỉ tải file font khi thực sự có phần tử dùng tới, nên người đọc bản
 * vi/en không phải tải thêm gì.
 */
export const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

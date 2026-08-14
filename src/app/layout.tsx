import type { Metadata } from "next";
import { IBM_Plex_Sans, Roboto } from "next/font/google";
import AnalyticsBeacon from "@/components/analytics/AnalyticsBeacon";
import { SITE } from "@/lib/site";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} – Đối tác triển khai phần mềm tin cậy`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} – Đối tác triển khai phần mềm tin cậy`,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} – Đối tác triển khai phần mềm tin cậy`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Organization đã được chuyển sang src/app/page.tsx: schema này thuộc về trang chủ,
// và để ở root layout thì nó rò cả sang /privacy-policy lẫn khu vực /admin.

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${ibmPlexSans.variable} ${roboto.variable}`}>
      <body className="antialiased">
        {children}
        {/* Client component nên KHÔNG làm layout server này thành dynamic —
            "/" và "/privacy-policy" vẫn được sinh tĩnh */}
        <AnalyticsBeacon />
      </body>
    </html>
  );
}

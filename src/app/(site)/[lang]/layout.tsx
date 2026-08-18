import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import AnalyticsBeacon from "@/components/analytics/AnalyticsBeacon";
import { ibmPlexSans, notoSansJP, roboto } from "@/lib/fonts";
import { HTML_LANG, LOCALES, OG_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SITE } from "@/lib/site";
import "../../globals.css";

// Sinh sẵn cả ba ngôn ngữ lúc build — trang landing không có dữ liệu động nên
// không có lý do gì phải render lúc chạy.
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

type LayoutParams = { params: Promise<{ lang: string }> };

/**
 * hreflang: mỗi bản dịch phải khai báo đủ ba URL anh em cộng x-default, nếu không
 * Google sẽ coi chúng là nội dung trùng lặp thay vì các phiên bản ngôn ngữ.
 */
function languageAlternates(path = "") {
  return Object.fromEntries(
    LOCALES.map((locale) => [HTML_LANG[locale], `/${locale}${path}`]),
  );
}

export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const { meta } = dict;

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: meta.defaultTitle,
      template: `%s | ${SITE.name}`,
    },
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: SITE.name }],
    creator: SITE.name,
    publisher: SITE.name,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ...languageAlternates(),
        // x-default trỏ về ngôn ngữ gốc cho khách không khớp locale nào
        "x-default": "/vi",
      },
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      url: `${SITE.url}/${lang}`,
      siteName: SITE.name,
      title: meta.defaultTitle,
      description: meta.description,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.defaultTitle,
      description: meta.description,
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
}

export default async function SiteRootLayout({
  children,
  params,
}: { children: ReactNode } & LayoutParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale: Locale = lang;

  const fontVars = [ibmPlexSans.variable, roboto.variable];
  // Chỉ nạp font Nhật cho /ja — xem chú thích ở src/lib/fonts.ts
  if (locale === "ja") fontVars.push(notoSansJP.variable);

  return (
    <html lang={HTML_LANG[locale]} className={fontVars.join(" ")}>
      <body className="antialiased">
        {children}
        {/* Client component nên KHÔNG làm layout server này thành dynamic —
            cả ba locale vẫn được sinh tĩnh */}
        <AnalyticsBeacon />
      </body>
    </html>
  );
}

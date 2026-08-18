import type { MetadataRoute } from "next";
import { HTML_LANG, LOCALES } from "@/lib/i18n/config";
import { SITE } from "@/lib/site";

/** Các trang công khai, tính theo đường dẫn SAU tiền tố locale. */
const PATHS = [
  { path: "", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/privacy-policy", changeFrequency: "yearly" as const, priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return LOCALES.flatMap((locale) =>
    PATHS.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE.url}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
      // Khai báo anh em ngôn ngữ ngay trong sitemap: Google dùng nó song song với
      // thẻ hreflang ở <head>, và sitemap là nơi bao phủ chắc chắn hơn.
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [HTML_LANG[l], `${SITE.url}/${l}${path}`]),
        ),
      },
    })),
  );
}

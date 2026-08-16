import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Dùng chung SITE.url với robots.ts và metadata — trước đây file này đọc
  // REACT_APP_BASE_URL riêng nên sitemap.xml trỏ sang domain khác hẳn phần còn lại.
  const baseUrl = SITE.url;

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
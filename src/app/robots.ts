import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Khu vực quản trị và các endpoint API không bao giờ được index.
      // Đây chỉ là một trong bốn lớp chặn — xem thêm metadata ở
      // src/app/(portal)/admin/layout.tsx và header X-Robots-Tag trong src/proxy.ts.
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}

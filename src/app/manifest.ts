import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Phục vụ tại /manifest.webmanifest.
 *
 * Đường dẫn có phần mở rộng nên isFileRequest() trong src/proxy.ts cho đi thẳng,
 * không bị chèn tiền tố locale.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.legalName,
    // "/" chứ không phải "/en": để proxy tự quyết ngôn ngữ, tránh việc cài app
    // rồi bị khoá cứng vào một locale.
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0e803f",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

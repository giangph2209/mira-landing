import "server-only";

import type { Locale } from "./config";
// import type: chỉ dùng để suy ra kiểu, bị xoá lúc biên dịch nên KHÔNG kéo vi.json
// vào bundle. Nội dung thật nạp bằng import() động bên dưới.
import type viDictionary from "./dictionaries/vi.json";

/**
 * Tiếng Việt là bản gốc — mọi ngôn ngữ khác phải khớp đúng hình dạng này, nên thiếu
 * key ở en/ja sẽ báo lỗi lúc biên dịch chứ không phải lúc chạy.
 */
export type Dictionary = typeof viDictionary;

/**
 * import() động chứ không phải import tĩnh: mỗi request chỉ nạp đúng một ngôn ngữ,
 * thay vì nhét cả ba vào bundle server.
 */
const DICTIONARIES: Record<Locale, () => Promise<Dictionary>> = {
  vi: () => import("./dictionaries/vi.json").then((m) => m.default as Dictionary),
  en: () => import("./dictionaries/en.json").then((m) => m.default as Dictionary),
  ja: () => import("./dictionaries/ja.json").then((m) => m.default as Dictionary),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return DICTIONARIES[locale]();
}

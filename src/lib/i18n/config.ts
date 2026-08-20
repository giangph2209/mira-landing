/**
 * Cấu hình locale dùng chung. File này CỐ Ý không có "server-only": proxy.ts và
 * component chuyển ngôn ngữ (client) đều phải import được.
 */

export const LOCALES = ["vi", "en", "ja"] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * Locale dùng khi không dò được gì từ cookie hay Accept-Language.
 *
 * Cũng là đích của hreflang x-default — hai chỗ phải luôn khớp nhau, nếu không
 * Google sẽ gửi khách không khớp ngôn ngữ nào tới một bản khác với bản mà proxy
 * thực sự chuyển hướng tới.
 */
export const DEFAULT_LOCALE: Locale = "en";

/** Nhãn hiển thị trong bộ chuyển ngôn ngữ — luôn viết bằng chính ngôn ngữ đó. */
export const LOCALE_LABELS: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
  ja: "日本語",
};

/** Nhãn ngắn cho màn hình hẹp. */
export const LOCALE_SHORT: Record<Locale, string> = {
  vi: "VI",
  en: "EN",
  ja: "JA",
};

/** Giá trị cho thuộc tính <html lang> và hreflang. */
export const HTML_LANG: Record<Locale, string> = {
  vi: "vi",
  en: "en",
  ja: "ja",
};

/** Định dạng riêng của Open Graph (ngôn ngữ_VÙNG), khác với hreflang. */
export const OG_LOCALE: Record<Locale, string> = {
  vi: "vi_VN",
  en: "en_US",
  ja: "ja_JP",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Class dùng chung cho input trên nền sáng.
 *
 * `.input-field` trong globals.css là bản cho nền tối (glass), không dùng được ở đây —
 * đó là lý do CTASection vốn tự khai báo chuỗi này. Tách ra để form liên hệ và toàn bộ
 * form khu vực admin dùng chung một định nghĩa.
 */
export const inputClass =
  "w-full rounded-xl border border-gray-200 bg-[#f7f9f8] px-4 py-3.5 text-[15px] text-text-dark outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 disabled:opacity-60";

/** Bản gọn hơn cho thanh công cụ/bộ lọc trong bảng dữ liệu */
export const inputClassSm =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-text-dark outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60";

export const labelClass = "mb-1.5 block text-sm font-semibold text-text-dark";

export const labelClassSm =
  "mb-1 block text-xs font-semibold uppercase tracking-wide text-text-gray";

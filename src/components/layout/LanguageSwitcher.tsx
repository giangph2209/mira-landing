"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT, type Locale } from "@/lib/i18n/config";

/** Cùng tên với LOCALE_COOKIE trong src/proxy.ts — proxy đọc lại giá trị này. */
const LOCALE_COOKIE = "NEXT_LOCALE";

export default function LanguageSwitcher({
  current,
  label,
}: {
  current: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function switchTo(next: Locale) {
    setOpen(false);
    if (next === current) return;

    // Ghi lựa chọn để lần sau vào "/" proxy không đoán lại theo Accept-Language.
    // max-age 1 năm, SameSite=Lax để vẫn gửi khi khách bấm link từ site khác.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;

    // pathname luôn có dạng /<locale>/... nên chỉ cần thay đoạn đầu; giữ nguyên
    // phần còn lại để khách đang ở /vi/privacy-policy sang /ja/privacy-policy.
    const rest = pathname.split("/").slice(2).join("/");
    router.push(rest ? `/${next}/${rest}` : `/${next}`);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[15px] font-medium text-text-muted transition-colors hover:bg-primary/5 hover:text-primary"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"
            stroke="currentColor"
            strokeWidth="1.7"
          />
        </svg>
        <span>{LOCALE_SHORT[current]}</span>
      </button>

      {open ? (
        <>
          {/* Lớp phủ trong suốt để bấm ra ngoài thì đóng, không cần listener document */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            aria-label={label}
            className="absolute right-0 z-20 mt-1 min-w-36 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
          >
            {LOCALES.map((locale) => (
              <li key={locale}>
                <button
                  type="button"
                  role="option"
                  aria-selected={locale === current}
                  onClick={() => switchTo(locale)}
                  className={[
                    "block w-full px-4 py-2 text-left text-sm transition-colors",
                    locale === current
                      ? "bg-primary/5 font-semibold text-primary"
                      : "text-text-muted hover:bg-primary/5 hover:text-primary",
                  ].join(" ")}
                >
                  {LOCALE_LABELS[locale]}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

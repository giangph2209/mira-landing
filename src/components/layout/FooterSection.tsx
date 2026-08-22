import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { t } from "@/lib/i18n/format";
import { SITE } from "@/lib/site";

type FooterLink = {
  label: string;
  /** omitted while the destination is still TBD — renders as plain text */
  href?: string;
};

type ContactItem = {
  label: string;
  /** null while the value is still TBD */
  value: string | null;
  href?: string;
};

/** Mọi dịch vụ cùng trỏ về #services; nhãn lấy theo thứ tự từ dictionary. */
const SERVICE_HREF = "#services";

/** Thứ tự cố định, khớp key trong dictionary. `href` thiếu = chưa có trang đích. */
const COMPANY_LINKS: {
  key: keyof Dictionary["footer"]["company"];
  href?: string;
}[] = [
  { key: "about", href: "#why-us" },
  { key: "team", href: "#team" },
  { key: "caseStudies", href: "#case-studies" },
];

// Thang mau footer, tat ca deu dat WCAG AA (>= 4.5:1) tren nen #0d1f17:
//   tieu de cot  white   17.14:1
//   link         /75     10.03:1
//   phu / meta   /60      6.82:1
//   chua kha dung /50     5.15:1  <- muc thap nhat con dat AA
const linkClass = "text-sm text-white/75 transition-colors hover:text-white";

function FooterLinkItem({
  label,
  href,
  comingSoon,
}: FooterLink & { comingSoon: string }) {
  if (!href) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-white/55">
        {label}
        <span className="rounded-full bg-white/12 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/60">
          {comingSoon}
        </span>
      </span>
    );
  }

  return (
    <Link href={href} className={linkClass}>
      {label}
    </Link>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[13px] font-bold uppercase tracking-widest text-white">
      {children}
    </h4>
  );
}

export default function FooterSection({
  dict,
  lang,
}: {
  dict: Dictionary["footer"];
  lang: Locale;
}) {
  const contactItems: ContactItem[] = [
    {
      label: dict.contact.email,
      value: SITE.email,
      href: `mailto:${SITE.email}`,
    },
    {
      label: dict.contact.phone,
      value: SITE.phone,
      href: `tel:${SITE.phoneHref}`,
    },
    { label: dict.contact.address, value: SITE.address.full },
  ];

  const legalLinks: FooterLink[] = [
    { label: dict.legal.privacy, href: `/${lang}/privacy-policy` },
    { label: dict.legal.terms },
  ];

  return (
    <footer className="bg-[#0d1f17]">
      <div className="section-container pb-8 pt-12 sm:pb-10 sm:pt-16 lg:pt-20">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 sm:gap-y-12 sm:pb-12 lg:grid-cols-12 lg:gap-8">
          {/* brand */}
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-3">
            <Link href={`/${lang}`}>
              <Image
                src="/images/dvl-logo.png"
                alt="DVL Tech"
                width={180}
                height={68}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>

            <div>
              {/* max-w ép tagline xuống dòng thay vì kéo dài một hàng */}
              <p className="max-w-56 font-heading text-base font-bold leading-snug text-white">
                {dict.tagline}
              </p>
              {/* Mỗi năng lực một dòng: trước đây nối bằng dấu · nên khi hẹp thì
                  dấu phân cách bị rớt xuống đầu dòng, nhìn như lỗi. */}
              <ul className="mt-3 flex flex-col gap-1.5 text-sm text-white/60">
                {dict.capabilities.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="h-1 w-1 shrink-0 rounded-full bg-primary-light"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              {dict.markets.map((market) => (
                <span
                  key={market}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold text-white/80"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-primary-light"
                    aria-hidden
                  />
                  {market}
                </span>
              ))}
            </div>
          </div>

          {/* services — two columns, it is the longest list */}
          {/* col-span-5 (trước là 4): tên dịch vụ dài như "Software project
              consulting" bị ngắt làm hai dòng khi cột hẹp. Lấy 1 cột từ khối
              thương hiệu bù sang đây, tổng vẫn đủ 12. */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-5">
            <SectionTitle>{dict.servicesTitle}</SectionTitle>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {dict.services.map((label) => (
                <li key={label}>
                  <FooterLinkItem
                    label={label}
                    href={SERVICE_HREF}
                    comingSoon={dict.comingSoon}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            <SectionTitle>{dict.companyTitle}</SectionTitle>
            <ul className="flex flex-col gap-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.key}>
                  <FooterLinkItem
                    label={dict.company[link.key]}
                    href={link.href}
                    comingSoon={dict.comingSoon}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            <SectionTitle>{dict.contactTitle}</SectionTitle>
            <ul className="flex flex-col gap-3">
              {contactItems.map((item) => (
                <li key={item.label} className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    {item.label}
                  </span>
                  {item.value && item.href ? (
                    <a href={item.href} className={linkClass}>
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-sm text-white/60">
                      {item.value ?? dict.updating}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-[13px] text-white/60">
              {t(dict.rights, { year: new Date().getFullYear() })}
            </p>
            <p className="text-center text-[13px] text-white/60 sm:text-left">
              {SITE.legalName}
            </p>
          </div>
          <div className="flex gap-6">
            {legalLinks.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[13px] text-white/65 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <span key={item.label} className="text-[13px] text-white/50">
                  {item.label}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

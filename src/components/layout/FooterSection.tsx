import Image from "next/image";
import Link from "next/link";
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

const SERVICE_LINKS: FooterLink[] = [
  { label: "Tư vấn xây dựng dự án phần mềm", href: "#services" },
  { label: "Phát triển phần mềm", href: "#services" },
  { label: "Tích hợp hệ thống", href: "#services" },
  { label: "Đánh giá & thẩm tra phần mềm", href: "#services" },
  { label: "Bảo trì & vận hành", href: "#services" },
  { label: "Bảo mật & an toàn thông tin", href: "#services" },
  { label: "Chuyển giao công nghệ", href: "#services" },
  { label: "Dữ liệu & cơ sở dữ liệu", href: "#services" },
];

const COMPANY_LINKS: FooterLink[] = [
  { label: "About DVL Tech", href: "#why-us" },
  { label: "Our Team", href: "#team" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Careers" },
];

const CONTACT_ITEMS: ContactItem[] = [
  { label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { label: "Phone", value: SITE.phone, href: `tel:${SITE.phoneHref}` },
  { label: "Address", value: SITE.address.full },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use" },
];

const CAPABILITIES = [
  "Tư vấn",
  "Phát triển phần mềm",
  "Tích hợp hệ thống",
  "Vận hành & Bảo trì",
];

const MARKETS = ["Vietnam", "Japan"];

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "#",
    path: "M15 2H3C2.4 2 2 2.4 2 3V15C2 15.6 2.4 16 3 16H15C15.6 16 16 15.6 16 15V3C16 2.4 15.6 2 15 2ZM6.3 13.5H4.3V7.2H6.3V13.5ZM5.3 6.3C4.7 6.3 4.2 5.8 4.2 5.2C4.2 4.6 4.7 4.1 5.3 4.1C5.9 4.1 6.4 4.6 6.4 5.2C6.4 5.8 5.9 6.3 5.3 6.3ZM14 13.5H12V10.4C12 9.5 11.5 9 10.7 9C9.9 9 9.5 9.5 9.5 10.4V13.5H7.5V7.2H9.5V8.1C9.9 7.5 10.6 7 11.5 7C13 7 14 8 14 9.9V13.5Z",
  },
  {
    label: "Twitter",
    href: "#",
    path: "M2 3L7.6 10.1L2 16H3.4L8.2 10.9L12.1 16H16.5L10.6 8.5L15.8 3H14.4L10 7.7L6.4 3H2ZM4.1 4H5.8L14.4 15H12.7L4.1 4Z",
  },
];

const linkClass = "text-sm text-white/50 transition-colors hover:text-white";

function FooterLinkItem({ label, href }: FooterLink) {
  if (!href) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-white/35">
        {label}
        <span className="rounded-full bg-white/8 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/40">
          Sắp có
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

export default function FooterSection() {
  return (
    <footer className="bg-[#0d1f17]">
      <div className="section-container pb-8 pt-12 sm:pb-10 sm:pt-16 lg:pt-20">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 sm:gap-y-12 sm:pb-12 lg:grid-cols-12 lg:gap-8">
          {/* brand */}
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-4">
            <Link href="/">
              <Image
                src="/images/brand/logo-brand.png"
                alt="DVL Tech"
                width={160}
                height={48}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>

            <div>
              <p className="font-heading text-base font-bold text-white">
                Software Consulting &amp; Development
              </p>
              <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5 text-sm text-white/50">
                {CAPABILITIES.map((item, index) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    {index > 0 ? (
                      <span className="text-white/25" aria-hidden>
                        ·
                      </span>
                    ) : null}
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {MARKETS.map((market) => (
                <span
                  key={market}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-primary-light"
                    aria-hidden
                  />
                  {market}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50 transition-all hover:bg-primary hover:text-white"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 18 18"
                    fill="none"
                    aria-hidden
                  >
                    <path d={social.path} fill="currentColor" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* services — two columns, it is the longest list */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-4">
            <SectionTitle>Dịch vụ</SectionTitle>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLinkItem {...link} />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            <SectionTitle>Công ty</SectionTitle>
            <ul className="flex flex-col gap-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLinkItem {...link} />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            <SectionTitle>Liên hệ</SectionTitle>
            <ul className="flex flex-col gap-3">
              {CONTACT_ITEMS.map((item) => (
                <li key={item.label} className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/40">
                    {item.label}
                  </span>
                  {item.value && item.href ? (
                    <a href={item.href} className={linkClass}>
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-sm text-white/35">
                      {item.value ?? "Đang cập nhật"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="text-[13px] text-white/30">
              © {new Date().getFullYear()} DVL Tech. All rights reserved.
            </p>
            <p className="text-center text-[13px] text-white/30 sm:text-left">
              {SITE.legalName} · Mã số thuế: {SITE.taxCode}
            </p>
          </div>
          <div className="flex gap-6">
            {LEGAL_LINKS.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[13px] text-white/30 transition-colors hover:text-white/60"
                >
                  {item.label}
                </Link>
              ) : (
                <span key={item.label} className="text-[13px] text-white/20">
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

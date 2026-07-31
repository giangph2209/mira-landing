export const SITE = {
  name: "Mura Tech",
  legalName: "Mura Tech",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://muratech.com",
  locale: "vi_VN",
  email: "contact@muratech.com",
  phone: "+84 000 000 000",
  description:
    "Mura Tech — đối tác triển khai phần mềm tin cậy. Phát triển phần mềm, outsource IT, giải pháp AI và tư vấn công nghệ cho doanh nghiệp Việt Nam và quốc tế.",
  ogImage: "/images/brand/logo-brand.png",
  keywords: [
    "Mura Tech",
    "phát triển phần mềm",
    "triển khai phần mềm",
    "outsource IT Việt Nam",
    "phần mềm tùy chỉnh",
    "custom software development",
    "AI software",
    "giải pháp AI",
    "software consulting",
    "đối tác công nghệ",
    "software implementation partner",
  ],
} as const;

export const NAV_ITEMS = [
  { label: "Dịch vụ", href: "#services" },
  { label: "Giải pháp", href: "#why-us" },
  { label: "Quy trình", href: "#process" },
  { label: "Năng lực", href: "#expertise" },
  { label: "Sản phẩm", href: "#case-studies" },
  { label: "Khách hàng", href: "#testimonials" },
] as const;

export const NAV_SECTION_IDS = NAV_ITEMS.map((item) => item.href.slice(1));

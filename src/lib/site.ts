export const SITE = {
  name: "Mura Tech",
  legalName: "CÔNG TY CỔ PHẦN CÔNG NGHỆ DVL",
  taxCode: "0111398643",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://muratech.com",
  locale: "vi_VN",
  email: "dvltechs@gmail.com",
  phone: "0387.989.300",
  /** dạng tel: — chỉ số, tiền tố quốc gia */
  phoneHref: "+84387989300",
  address: {
    full: "Tầng 10, Tòa nhà Việt Á, số 9 phố Duy Tân, Phường Cầu Giấy, TP Hà Nội, Việt Nam",
    street: "Tầng 10, Tòa nhà Việt Á, số 9 phố Duy Tân",
    district: "Phường Cầu Giấy",
    city: "TP Hà Nội",
    country: "VN",
  },
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
  { label: "Quy trình", href: "#process" },
  { label: "Năng lực", href: "#expertise" },
  { label: "Case study", href: "#case-studies" },
  { label: "Khách hàng", href: "#region" },
] as const;

export const NAV_SECTION_IDS = NAV_ITEMS.map((item) => item.href.slice(1));

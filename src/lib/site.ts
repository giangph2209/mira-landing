import type { Locale } from "@/lib/i18n/config";

export const SITE = {
  name: "DVL Tech",
  legalName: "CÔNG TY CỔ PHẦN CÔNG NGHỆ DVL",
  // `||` chứ không phải `??`: build arg không truyền sẽ inline thành chuỗi rỗng, và ""
  // lọt qua `??` — mọi URL tuyệt đối (canonical, OG, JSON-LD) sẽ hỏng im lặng.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dvltechco.com",
  email: "contact@dvltechco.com",
  /** dạng hiển thị — luôn dùng tiền tố quốc tế +84, không dùng số 0 đầu */
  phone: "+84 387 989 300",
  /** dạng tel: — chỉ số, tiền tố quốc gia */
  phoneHref: "+84387989300",
  address: {
    /** dạng hiển thị theo ngôn ngữ trang */
    full: {
      vi: "Tầng 10, Tòa nhà Việt Á, số 9 phố Duy Tân, Phường Cầu Giấy, TP Hà Nội, Việt Nam",
      en: "10th Floor, Viet A Building, No. 9 Duy Tan Street, Cau Giay Ward, Hanoi, Vietnam",
      ja: "ベトナム・ハノイ市カウザイ街区ズイタン通り9番地、ベトアビル10階",
    } satisfies Record<Locale, string>,
    street: "Tầng 10, Tòa nhà Việt Á, số 9 phố Duy Tân",
    district: "Phường Cầu Giấy",
    city: "TP Hà Nội",
    country: "VN",
  },
  ogImage: "/images/dvltech-og-image.png",
} as const;

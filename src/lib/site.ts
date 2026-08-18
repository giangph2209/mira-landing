export const SITE = {
  name: "DVL Tech",
  legalName: "CÔNG TY CỔ PHẦN CÔNG NGHỆ DVL",
  taxCode: "0111398643",
  // `||` chứ không phải `??`: build arg không truyền sẽ inline thành chuỗi rỗng, và ""
  // lọt qua `??` — mọi URL tuyệt đối (canonical, OG, JSON-LD) sẽ hỏng im lặng.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dvltechco.com",
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
  ogImage: "/images/brand/logo-brand.png",
} as const;

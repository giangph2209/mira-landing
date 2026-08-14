import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Calculator,
  Check,
  ClipboardCheck,
  CodeXml,
  Database,
  DraftingCompass,
  Globe,
  Handshake,
  Lightbulb,
  MonitorCog,
  PackageCheck,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";

type Service = {
  id: string;
  no: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  /** flagship service — green surface + decorative orb */
  featured?: boolean;
  badge?: string;
  cta?: { label: string; href: string };
  /** bento span applied to the grid cell */
  span?: string;
  /** two-column cards lay their icon beside the text on lg */
  wide?: boolean;
  /** sub-items — fills the taller/wider bento cells */
  highlights?: string[];
};

const SERVICES: Service[] = [
  {
    id: "project-consulting",
    no: "01",
    title: "Tư vấn xây dựng dự án phần mềm",
    description:
      "Phân tích nhu cầu, xác định phạm vi, xây dựng kế hoạch và định hướng giải pháp cho dự án phần mềm. \nDVL Tech giúp doanh nghiệp chuyển hóa bài toán nghiệp vụ thành một kế hoạch triển khai rõ ràng, khả thi và phù hợp với mục tiêu thực tế.",
    Icon: Lightbulb,
    featured: true,
    badge: "Dịch vụ trọng tâm",
    cta: { label: "Trao đổi về dự án", href: "#contact" },
    span: "sm:col-span-2 lg:col-span-2",
  },
  {
    id: "analysis-design",
    no: "02",
    title: "Tư vấn, phân tích & thiết kế",
    description:
      "Phân tích nghiệp vụ, yêu cầu hệ thống và xây dựng định hướng giải pháp công nghệ phù hợp với nhu cầu của doanh nghiệp.",
    Icon: DraftingCompass,
    highlights: [
      "Khảo sát hiện trạng và phân tích nghiệp vụ",
      "Đặc tả yêu cầu hệ thống chi tiết",
      "Tư vấn lựa chọn công nghệ phù hợp",
    ],
  },
  {
    id: "development",
    no: "03",
    title: "Phát triển & sản xuất phần mềm",
    description:
      "Thiết kế, phát triển và kiểm thử các sản phẩm, ứng dụng và hệ thống phần mềm theo yêu cầu.",
    Icon: CodeXml,
  },
  {
    id: "integration",
    no: "04",
    title: "Tích hợp hệ thống",
    description:
      "Tích hợp các hệ thống, ứng dụng và nguồn dữ liệu nhằm tạo ra môi trường vận hành thống nhất và hiệu quả.",
    Icon: Blocks,
  },
  {
    id: "operations",
    no: "05",
    title: "Quản lý & vận hành ứng dụng",
    description:
      "Hỗ trợ quản trị, bảo trì, cập nhật và duy trì hoạt động ổn định của hệ thống phần mềm sau triển khai.",
    Icon: MonitorCog,
  },
  {
    id: "security",
    no: "06",
    title: "Bảo mật & an toàn thông tin",
    description:
      "Hỗ trợ đảm bảo an toàn cho sản phẩm phần mềm, hệ thống thông tin và dữ liệu trong quá trình vận hành.",
    Icon: ShieldCheck,
  },
  {
    id: "quality",
    no: "07",
    title: "Đánh giá & thẩm tra chất lượng phần mềm",
    description:
      "Tư vấn, đánh giá và thẩm tra chất lượng phần mềm nhằm giúp doanh nghiệp kiểm soát chất lượng và giảm thiểu rủi ro trong dự án.",
    Icon: ClipboardCheck,
    span: "lg:col-span-2",
    wide: true,
    highlights: [
      "Kiểm thử chức năng và hiệu năng",
      "Rà soát, đánh giá chất lượng mã nguồn",
      "Thẩm tra tài liệu và quy trình dự án",
      "Báo cáo rủi ro và khuyến nghị cải tiến",
    ],
  },
  {
    id: "tech-transfer",
    no: "08",
    title: "Chuyển giao công nghệ",
    description:
      "Hỗ trợ chuyển giao công nghệ, hệ thống và kiến thức cần thiết để doanh nghiệp có thể chủ động vận hành và phát triển giải pháp.",
    Icon: Handshake,
  },
  {
    id: "pricing",
    no: "09",
    title: "Tư vấn định giá phần mềm",
    description:
      "Tư vấn và hỗ trợ đánh giá, định giá sản phẩm và giải pháp phần mềm theo nhu cầu của doanh nghiệp.",
    Icon: Calculator,
  },
  {
    id: "distribution",
    no: "10",
    title: "Phân phối & cung cấp sản phẩm phần mềm",
    description:
      "Cung cấp và phân phối các sản phẩm phần mềm phù hợp với nhu cầu sử dụng và vận hành của doanh nghiệp.",
    Icon: PackageCheck,
  },
  {
    id: "web",
    no: "11",
    title: "Website & hệ thống thông tin",
    description:
      "Thiết kế, lưu trữ, duy trì trang thông tin điện tử và các hệ thống thông tin phục vụ hoạt động của doanh nghiệp.",
    Icon: Globe,
    span: "lg:col-span-2",
    wide: true,
    highlights: [
      "Thiết kế và phát triển website",
      "Lưu trữ, vận hành hạ tầng hosting",
      "Xây dựng cổng thông tin nội bộ",
      "Bảo trì, cập nhật và tối ưu nội dung",
    ],
  },
  {
    id: "data",
    no: "12",
    title: "Dữ liệu & cơ sở dữ liệu",
    description:
      "Hỗ trợ cập nhật, tìm kiếm, lưu trữ, xử lý dữ liệu và khai thác cơ sở dữ liệu.",
    Icon: Database,
    span: "sm:col-span-2 lg:col-span-1",
  },
];

const DOT_GRID =
  "radial-gradient(circle at center, rgba(255,255,255,0.16) 1px, transparent 1px)";

function ServiceIcon({
  Icon,
  featured,
}: {
  Icon: LucideIcon;
  featured?: boolean;
}) {
  if (featured) {
    return (
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
        <Icon className="h-7 w-7 text-white" strokeWidth={1.7} aria-hidden />
      </div>
    );
  }

  return (
    <div className="relative flex h-13 w-13 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#eafaf0] to-[#cdf1d9] ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_10px_24px_rgba(14,128,63,0.28)] group-hover:ring-primary/25">
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-primary-light to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <Icon
        className="relative h-6 w-6 text-primary transition-colors duration-300 group-hover:text-white"
        strokeWidth={1.8}
        aria-hidden
      />
    </div>
  );
}

/** Purely decorative orb — replaces the old raster illustration */
function FeaturedOrb() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative hidden h-full min-h-[200px] items-center justify-center lg:flex"
    >
      <div className="relative h-52 w-52">
        <span className="absolute inset-0 rounded-full bg-primary-pale/20 blur-2xl" />
        <span className="absolute inset-0 animate-region-pulse rounded-full border border-white/25" />
        <span className="absolute inset-6 rounded-full border border-white/20" />
        <span className="absolute inset-12 rounded-full border border-white/15" />
        <span className="absolute inset-[4.5rem] rounded-full bg-white/12 backdrop-blur-sm" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-heading text-[3.5rem] font-bold leading-none text-white/90">
          01
        </span>
        <span className="absolute -right-1 top-10 h-2.5 w-2.5 animate-region-float rounded-full bg-primary-pale shadow-[0_0_16px_rgba(77,209,95,0.9)]" />
        <span className="absolute bottom-8 -left-2 h-2 w-2 rounded-full bg-white/70" />
        <span className="absolute bottom-0 right-10 h-1.5 w-1.5 rounded-full bg-primary-pale/80" />
      </div>
    </div>
  );
}

function FeaturedCard({ service }: { service: Service }) {
  const { Icon, no, title, description, badge, cta } = service;

  return (
    <article className="gradient-primary group relative flex h-full flex-col overflow-hidden rounded-[20px] p-6 shadow-[0_16px_44px_rgba(5,85,55,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_58px_rgba(5,85,55,0.4)] sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ backgroundImage: DOT_GRID, backgroundSize: "18px 18px" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-pale/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-16 h-56 w-56 rounded-full bg-primary-light/25 blur-3xl"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute right-5 top-3 font-heading text-[3.5rem] font-bold leading-none text-white/10 lg:hidden"
      >
        {no}
      </span>

      <div className="relative grid flex-1 grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-4">
            <ServiceIcon Icon={Icon} featured />
            {badge ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 ring-1 ring-white/20">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-pale" />
                {badge}
              </span>
            ) : null}
          </div>

          <h4 className="mt-5 font-heading text-[clamp(1.25rem,2.4vw,1.75rem)] font-bold leading-tight text-white">
            {title}
          </h4>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 whitespace-pre-line">
            {description}
          </p>

          {cta ? (
            <div className="mt-auto pt-6">
              <Link
                href={cta.href}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-[0_8px_20px_rgba(0,0,0,0.16)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                {cta.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          ) : null}
        </div>

        <FeaturedOrb />
      </div>
    </article>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const { Icon, no, title, description, wide, highlights } = service;

  return (
    <div className="group relative h-full">
      {/* gradient hairline that lights up on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[21px] bg-gradient-to-br from-primary-light via-primary-light/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <article className="relative flex h-full flex-col overflow-hidden rounded-[20px] border border-border-soft bg-white p-6 shadow-card transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-transparent group-hover:shadow-card-hover">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#f3fbf6] via-white to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1 bg-gradient-to-b from-primary/20 to-primary/0 bg-clip-text font-heading text-[3.5rem] font-bold leading-none text-transparent transition-all duration-300 group-hover:from-primary/35"
        >
          {no}
        </span>

        <div
          className={[
            "relative flex flex-1 flex-col gap-5",
            wide ? "lg:flex-row lg:items-start lg:gap-6" : "",
          ].join(" ")}
        >
          <ServiceIcon Icon={Icon} />

          <div className="flex min-w-0 flex-1 flex-col">
            <h4 className="pr-12 font-heading text-[17px] font-bold leading-snug text-primary-dark transition-colors duration-300 group-hover:text-primary">
              {title}
            </h4>
            <p className="mt-2.5 text-sm leading-relaxed text-gray-600">
              {description}
            </p>

            {highlights?.length ? (
              <ul
                className={[
                  "mt-4 grid gap-2 border-t border-border-soft pt-4",
                  wide ? "sm:grid-cols-2 sm:gap-x-6" : "",
                ].join(" ")}
              >
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[13px] leading-relaxed text-gray-600"
                  >
                    <Check
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-light"
                      strokeWidth={2.75}
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div aria-hidden className="relative mt-auto flex items-center pt-5">
          <span className="h-px w-8 rounded-full bg-primary-light/35 transition-all duration-300 group-hover:w-14 group-hover:bg-primary-light" />
        </div>
      </article>
    </div>
  );
}

export default function AIServicesSection() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-white py-12 sm:py-14 lg:py-16"
    >
      {/* soft background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-[#e6f7ed] opacity-60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-[#eefaf1] opacity-70 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-6">
        <Reveal>
          <SectionHeader
            className="!mb-0"
            eyebrow="Our services"
            title="Dịch vụ"
            description="DVL Tech cung cấp các dịch vụ công nghệ nhằm hỗ trợ doanh nghiệp từ giai đoạn hình thành ý tưởng đến phát triển, triển khai và vận hành hệ thống."
            tagline="Giải pháp công nghệ cho toàn bộ vòng đời dự án"
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {SERVICES.map((service, index) => (
            <Reveal
              key={service.id}
              className={["h-full", service.span].filter(Boolean).join(" ")}
              delay={(index % 3) * 80}
            >
              {service.featured ? (
                <FeaturedCard service={service} />
              ) : (
                <ServiceCard service={service} />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

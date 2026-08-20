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
import type { Dictionary } from "@/lib/i18n/dictionaries";

type ServiceId = keyof Dictionary["services"]["items"];

/** Phần copy của một dịch vụ; `highlights` chỉ có ở vài dịch vụ. */
type ServiceCopy = {
  title: string;
  description: string;
  highlights?: readonly string[];
};

type Service = {
  /** khớp key trong dictionary.services.items */
  id: ServiceId;
  no: string;
  Icon: LucideIcon;
  /** flagship service — green surface + decorative orb */
  featured?: boolean;
  /** bento span applied to the grid cell */
  span?: string;
  /** two-column cards lay their icon beside the text on lg */
  wide?: boolean;
};

const SERVICES: Service[] = [
  {
    id: "projectConsulting",
    no: "01",
    Icon: Lightbulb,
    featured: true,
    span: "sm:col-span-2 lg:col-span-2",
  },
  { id: "analysisDesign", no: "02", Icon: DraftingCompass },
  { id: "development", no: "03", Icon: CodeXml },
  { id: "integration", no: "04", Icon: Blocks },
  { id: "operations", no: "05", Icon: MonitorCog },
  { id: "security", no: "06", Icon: ShieldCheck },
  {
    id: "quality",
    no: "07",
    Icon: ClipboardCheck,
    span: "sm:col-span-2 lg:col-span-2",
    wide: true,
  },
  { id: "techTransfer", no: "08", Icon: Handshake },
  { id: "pricing", no: "09", Icon: Calculator },
  { id: "distribution", no: "10", Icon: PackageCheck },
  {
    id: "web",
    no: "11",
    Icon: Globe,
    span: "sm:col-span-2 lg:col-span-2",
    wide: true,
  },
  { id: "data", no: "12", Icon: Database },
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

function FeaturedCard({
  service,
  copy,
  badge,
  ctaLabel,
}: {
  service: Service;
  copy: ServiceCopy;
  badge: string;
  ctaLabel: string;
}) {
  const { Icon, no } = service;
  const { title, description } = copy;

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

          {/* FeaturedCard chỉ dùng cho dịch vụ trọng tâm nên CTA luôn hiển thị;
              trước đây `cta` là optional trên từng service. */}
          <div className="mt-auto pt-6">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-[0_8px_20px_rgba(0,0,0,0.16)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        <FeaturedOrb />
      </div>
    </article>
  );
}

function ServiceCard({
  service,
  copy,
}: {
  service: Service;
  copy: ServiceCopy;
}) {
  const { Icon, no, wide } = service;
  const { title, description, highlights } = copy;

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

        {/* Quầng sáng góc phải trên — HIỆN SẴN ở trạng thái tĩnh.
            Trước đây để opacity-0 và chỉ bật khi hover, nghĩa là suốt phần lớn thời
            gian thẻ vẫn phẳng trơn. Giờ nó là điểm nhấn thường trực, còn hover chỉ
            làm đậm và nở rộng thêm. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary-light/25 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:bg-primary-light/45"
        />

        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1 bg-gradient-to-br from-primary/25 via-primary-light/20 to-primary/0 bg-clip-text font-heading text-[3.9rem] font-bold leading-none tracking-tight text-transparent transition-all duration-300 group-hover:from-primary/45 group-hover:via-primary-light/35"
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

export default function AIServicesSection({
  dict,
}: {
  dict: Dictionary["services"];
}) {
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
            eyebrow={dict.eyebrow}
            title={dict.title}
            description={dict.description}
            tagline={dict.tagline}
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
                <FeaturedCard
                  service={service}
                  copy={dict.items[service.id]}
                  badge={dict.featuredBadge}
                  ctaLabel={dict.featuredCta}
                />
              ) : (
                <ServiceCard service={service} copy={dict.items[service.id]} />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

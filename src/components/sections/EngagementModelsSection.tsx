import Image from "next/image";
import ArrowActionButton from "@/components/ui/ArrowActionButton";
import Reveal from "@/components/ui/Reveal";

type CardVariant = "green" | "light";

type EngagementModel = {
  id: string;
  title: string;
  description: string;
  variant: CardVariant;
  iconSrc: string;
  filter?: string;
  /** columns taken on the lg 5-column grid */
  colSpan: 2 | 3;
  /** placeholder: gradient | image pattern */
  background: "gradient" | "image";
};

/** Tailwind needs the full class name, so spans are mapped rather than built */
const SPAN_CLASS: Record<EngagementModel["colSpan"], string> = {
  2: "lg:col-span-2",
  3: "lg:col-span-3",
};

const MODELS: EngagementModel[] = [
  {
    id: "project-based",
    title: "Project Based",
    description:
      "Phù hợp với các dự án có phạm vi và mục tiêu rõ ràng. DVL Tech đồng hành từ phân tích yêu cầu đến phát triển và triển khai hệ thống.",
    variant: "green",
    iconSrc: "/images/models/icon-1.png",
    colSpan: 3,
    background: "gradient",
    filter: "/images/bg/project-base.png",
  },
  {
    id: "dedicated-team",
    title: "Dedicated Team",
    description:
      "Cung cấp đội ngũ kỹ thuật theo nhu cầu của doanh nghiệp, phù hợp với các dự án cần nguồn lực phát triển lâu dài.",
    variant: "light",
    iconSrc: "/images/models/icon-4.png",
    colSpan: 2,
    background: "gradient",
  },
  {
    id: "software-consulting",
    title: "Software Consulting",
    description:
      "Tư vấn về giải pháp, kiến trúc, quy trình và định hướng xây dựng hệ thống phần mềm.",
    variant: "light",
    iconSrc: "/images/models/icon-2.png",
    colSpan: 2,
    background: "gradient",
  },
  {
    id: "maintenance-operation",
    title: "Maintenance & Operation",
    description:
      "Hỗ trợ bảo trì, vận hành, cập nhật và cải tiến hệ thống sau khi triển khai.",
    variant: "green",
    iconSrc: "/images/models/icon-5.png",
    colSpan: 3,
    background: "image",
    filter: "/images/bg/time_material.webp",
  },
];

function EngagementCard({ model }: { model: EngagementModel }) {
  const isGreen = model.variant === "green";

  const surfaceClass = isGreen
    ? model.background === "image"
      ? "bg-[#016D42] from-primary-dark via-primary to-primary-medium"
      : "bg-gradient-to-br from-primary-light via-primary to-primary-dark"
    : "bg-gradient-to-b from-white via-white to-[#e8f7ed]";

  return (
    <div
      className={[
        "relative flex min-h-0 flex-col justify-between overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] sm:min-h-50 sm:rounded-3xl lg:min-h-60",
        surfaceClass,
      ].join(" ")}
    >
      {model.filter && (
        <div
          className="absolute z-2 h-full w-full"
          style={{
            backgroundImage: `url(${model.filter})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
      <article className="p-5 sm:p-7 lg:p-9 relative z-3">
        <div className="relative z-1 flex flex-col gap-5">
          <Image
            src={model.iconSrc}
            alt={model.title}
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />

          <div className="flex max-w-105 flex-col gap-2">
            <h3
              className={[
                "font-heading text-lg font-bold leading-tight sm:text-xl lg:text-[28px]",
                isGreen ? "text-white" : "text-text-dark",
              ].join(" ")}
            >
              {model.title}
            </h3>
            <p
              className={[
                "text-sm leading-relaxed lg:text-[18px]",
                isGreen ? "text-white" : "text-text-dark",
              ].join(" ")}
            >
              {model.description}
            </p>
          </div>
        </div>

        <div className="relative z-1 flex justify-end pt-6">
          <ArrowActionButton
            href="#contact"
            variant={isGreen ? "inverse" : "default"}
            aria-label={`Learn more about ${model.title}`}
          />
        </div>
      </article>
    </div>
  );
}

export default function EngagementModelsSection() {
  return (
    <section id="engagement" className="bg-[#f8f9f8] py-14 lg:py-16">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <header className="mx-auto mb-12 max-w-180 text-center lg:mb-14">
            <h2 className="font-heading text-[clamp(2rem,4vw,2.75rem)] font-bold leading-tight text-primary">
              Mô hình hợp tác linh hoạt
            </h2>
            <p className="mt-4 text-base leading-relaxed text-text-gray lg:text-[17px]">
              DVL Tech có thể đồng hành với doanh nghiệp theo nhiều hình thức,
              tùy thuộc vào quy mô, mục tiêu và yêu cầu của từng dự án.
            </p>
          </header>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5 lg:gap-6">
          {MODELS.map((model, i) => (
            <Reveal
              key={model.id}
              delay={i * 70}
              className={SPAN_CLASS[model.colSpan]}
            >
              <EngagementCard model={model} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

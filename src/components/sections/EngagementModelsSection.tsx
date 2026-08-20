import Image from "next/image";
import ArrowActionButton from "@/components/ui/ArrowActionButton";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { t } from "@/lib/i18n/format";

type CardVariant = "green" | "light";

type ModelId = keyof Dictionary["engagement"]["models"];

type EngagementModel = {
  /** khớp key trong dictionary — title/description lấy từ đó */
  id: ModelId;
  variant: CardVariant;
  iconSrc: string;
  filter?: string;
  /** columns taken on the lg 5-column grid */
  colSpan: 2 | 3;
  /** placeholder: gradient | image pattern */
  background: "gradient" | "image";
};

/** Cùng giá trị với DOT_GRID ở TestimonialsSection để hoạ tiết đồng bộ toàn site. */
const DOT_GRID =
  "radial-gradient(circle at center, rgba(13,138,67,0.10) 1px, transparent 1px)";

/** Tailwind needs the full class name, so spans are mapped rather than built */
const SPAN_CLASS: Record<EngagementModel["colSpan"], string> = {
  2: "lg:col-span-2",
  3: "lg:col-span-3",
};

const MODELS: EngagementModel[] = [
  {
    id: "projectBased",
    variant: "green",
    iconSrc: "/images/models/icon-1.png",
    colSpan: 3,
    background: "gradient",
    filter: "/images/bg/project-base.png",
  },
  {
    id: "dedicatedTeam",
    variant: "light",
    iconSrc: "/images/models/icon-4.png",
    colSpan: 2,
    background: "gradient",
  },
  {
    id: "softwareConsulting",
    variant: "light",
    iconSrc: "/images/models/icon-2.png",
    colSpan: 2,
    background: "gradient",
  },
  {
    id: "maintenanceOperation",
    variant: "green",
    iconSrc: "/images/models/icon-5.png",
    colSpan: 3,
    background: "image",
    filter: "/images/bg/time_material.webp",
  },
];

function EngagementCard({
  model,
  dict,
}: {
  model: EngagementModel;
  dict: Dictionary["engagement"];
}) {
  const isGreen = model.variant === "green";
  const copy = dict.models[model.id];

  const surfaceClass = isGreen
    ? model.background === "image"
      ? "bg-[#016D42] from-primary-dark via-primary to-primary-medium"
      : "bg-gradient-to-br from-primary-light via-primary to-primary-dark"
    : "bg-gradient-to-b from-white via-white to-[#e8f7ed]";

  return (
    <div
      className={[
        // `group` BẮT BUỘC phải có: ArrowActionButton đã khai sẵn group-hover:scale-105
        // và group-hover:bg-*, nhưng trước đây thẻ cha không phải group nên toàn bộ
        // hiệu ứng đó chết, chỉ chạy khi rê thẳng vào mũi tên.
        "group relative flex min-h-0 flex-col justify-between overflow-hidden rounded-2xl",
        "shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300",
        "hover:-translate-y-1.5 hover:shadow-[0_18px_44px_rgba(5,85,55,0.22)]",
        "sm:min-h-50 sm:rounded-3xl lg:min-h-60",
        surfaceClass,
      ].join(" ")}
    >
      {/* ── Trang trí thấy được NGAY khi chưa hover ──────────────────────────
          Thẻ nền sáng trước đây trống trơn giữa thân, trong khi thẻ xanh có ảnh nền
          nên hai loại lệch hẳn nhau. Toàn bộ lớp dưới đây hiện ở trạng thái tĩnh. */}
      {!isGreen && (
        <>
          {/* Lưới chấm phủ nền */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: DOT_GRID, backgroundSize: "18px 18px" }}
          />

          {/* Hai vòng tròn viền lệch tâm ở góc — tạo chiều sâu hình học, cắt bởi
              bo góc thẻ vẫn đẹp vì chúng vốn là đường cong. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full border border-primary/12"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-20 h-40 w-40 rounded-full border border-primary/8"
          />

          {/* Khối màu mềm góc dưới phải, luôn hiện */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-primary-light/12 blur-3xl"
          />
        </>
      )}

      {/* Thẻ xanh: lớp sáng chéo rất nhẹ cho bề mặt bớt phẳng.
          PHẢI là z-3, không phải z-2: ảnh nền (model.filter) cũng z-2 và nằm SAU trong
          DOM nên sẽ vẽ đè lên, khiến lớp này vô hình trên đúng hai thẻ xanh. */}
      {isGreen && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-3 bg-gradient-to-tr from-transparent via-white/0 to-white/15"
        />
      )}

      {/* Quầng sáng theo màu thẻ, chỉ hiện khi hover */}
      <div
        aria-hidden
        className={[
          // z-3: ảnh nền của thẻ xanh nằm ở z-2 nên quầng sáng phải cao hơn, nếu không
          // sẽ bị che mất hoàn toàn. Vẫn nằm trước <article> (cũng z-3) trong DOM nên
          // phần chữ luôn vẽ đè lên trên.
          "pointer-events-none absolute -right-16 -top-16 z-3 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
          isGreen ? "bg-white/20" : "bg-primary-light/25",
        ].join(" ")}
      />
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
          {/* Bọc icon trong một quầng sáng tĩnh: trước đây icon nổi trơ trên nền
              trống, không có gì neo nó vào bố cục. */}
          <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center">
            <span
              aria-hidden
              className={[
                "absolute inset-0 -m-2 rounded-2xl",
                isGreen ? "bg-white/12" : "bg-primary/8",
              ].join(" ")}
            />
            <Image
              src={model.iconSrc}
              alt={copy.title}
              width={48}
              height={48}
              className="relative h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </span>

          <div className="flex max-w-105 flex-col gap-2">
            {/* Vạch nhấn tĩnh phía trên tiêu đề — giúp khối chữ có mốc bắt đầu rõ
                ràng thay vì trôi giữa khoảng trắng. */}
            <span
              aria-hidden
              className={[
                "h-1 w-10 rounded-full",
                isGreen
                  ? "bg-white/50"
                  : "bg-gradient-to-r from-primary-light to-primary",
              ].join(" ")}
            />
            <h3
              className={[
                "font-heading text-lg font-bold leading-tight sm:text-xl lg:text-[28px]",
                isGreen ? "text-white" : "text-text-dark",
              ].join(" ")}
            >
              {copy.title}
            </h3>
            <p
              className={[
                "text-sm leading-relaxed lg:text-[18px]",
                isGreen ? "text-white" : "text-text-dark",
              ].join(" ")}
            >
              {copy.description}
            </p>
          </div>
        </div>

        <div className="relative z-1 flex justify-end pt-6">
          <ArrowActionButton
            href="#contact"
            variant={isGreen ? "inverse" : "default"}
            aria-label={t(dict.learnMore, { title: copy.title })}
          />
        </div>
      </article>
    </div>
  );
}

export default function EngagementModelsSection({
  dict,
}: {
  dict: Dictionary["engagement"];
}) {
  return (
    <section id="engagement" className="bg-[#f8f9f8] py-14 lg:py-16">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            eyebrow={dict.eyebrow}
            title={
              <>
                {dict.titleBefore}
                <span className="text-accent">{dict.titleAccent}</span>
              </>
            }
            description={dict.description}
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5 lg:gap-6">
          {MODELS.map((model, i) => (
            <Reveal
              key={model.id}
              delay={i * 70}
              className={SPAN_CLASS[model.colSpan]}
            >
              <EngagementCard model={model} dict={dict} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

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
            alt={copy.title}
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

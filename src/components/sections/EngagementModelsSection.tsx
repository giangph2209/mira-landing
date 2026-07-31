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
  colSpan?: 1 | 2;
  /** placeholder: gradient | image pattern */
  background: "gradient" | "image";
};

const MODELS: EngagementModel[] = [
  {
    id: "project-based",
    title: "Project Based",
    description: "Ideal for short-term projects with defined scope and timeline.",
    variant: "green",
    iconSrc: "/images/models/icon-1.png",
    background: "gradient",
    filter: "/images/bg/project-base.png"
  },
  {
    id: "staff-augmentation",
    title: "Staff Augmentation",
    description: "Enhance your team with skilled professionals for specific tasks.",
    variant: "light",
    iconSrc: "/images/models/icon-2.png",
    background: "gradient",
  },
  {
    id: "development-hub",
    title: "Development Hub",
    description: "Establish a remote development center for long-term collaboration.",
    variant: "light",
    iconSrc: "/images/models/icon-3.png",
    background: "gradient",
  },
  {
    id: "dedicated-team",
    title: "Dedicated Team",
    description: "Build a dedicated team exclusively working on your projects.",
    variant: "light",
    iconSrc: "/images/models/icon-4.png",
    background: "gradient",
  },
  {
    id: "time-material",
    title: "Time & Material / Consulting",
    description: "Flexible support for ongoing projects and expert advice.",
    variant: "green",
    iconSrc: "/images/models/icon-5.png",
    colSpan: 2,
    background: "image",
    filter: "/images/bg/time_material.webp"
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
    <div className={[
      "relative flex min-h-0 flex-col justify-between overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] sm:min-h-50 sm:rounded-3xl lg:min-h-60",
      surfaceClass,
    ].join(" ")}>
      {model.filter && (
        <div className="absolute z-2 h-full w-full" style={{
          backgroundImage: `url(${model.filter})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }} />
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
    <section id="engagement" className="bg-[#f8f9f8] py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <header className="mx-auto mb-12 max-w-180 text-center lg:mb-14">
            <h2 className="font-heading text-[clamp(2rem,4vw,2.75rem)] font-bold leading-tight text-primary">
              Engagement Models
            </h2>
            <p className="mt-4 text-base leading-relaxed text-text-gray lg:text-[17px]">
              All Primitives share a common suite of platform features that enhance security and ensure Mura Tech
              fits neatly into your existing infrastructure.
            </p>
          </header>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {MODELS.map((model, i) => (
            <Reveal key={model.id} delay={i * 70} className={model.colSpan === 2 ? "lg:col-span-2" : ""}>
              <EngagementCard model={model} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

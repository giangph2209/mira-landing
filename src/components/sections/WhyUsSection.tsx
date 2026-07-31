import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

const FEATURE_CARDS = [
  {
    id: "left",
    variant: "left" as const,
    title: "One Team \n Mindset",
    description: "Collaboration for sustainable success",
    iconSrc: "/images/why-us/icon-1.png",
  },
  {
    id: "center",
    variant: "center" as const,
    title: "Commitment to Business Agenda",
    description: "Dedication to your value proposition",
    iconSrc: "/images/why-us/icon-2.png",
  },
  {
    id: "right",
    variant: "right" as const,
    title: "Global Network Support",
    description: "Global capabilities for local needs",
    iconSrc: "/images/why-us/icon-3.png",
  },
];

const STATS = [
  { value: "1300+", label: "Employees" },
  { value: "350+", label: "Clients" },
  { value: "30+", label: "Industries" },
  { value: "5", label: "Oversea Branches" },
];

const CARD_VARIANT_CLASSES = {
  left: [
    "z-[1] bg-gradient-primary-lime shadow-[0_10px_48px_rgba(0,0,0,0.08)]",
    "lg:[clip-path:polygon(0_0,100%_14%,100%_86%,0_100%)]",
    "max-lg:rounded-[20px]",
    "xl:max-w-[340px]",
  ].join(" "),
  center: [
    "z-[3] max-w-[380px] rounded-[20px] bg-white shadow-[0_10px_48px_rgba(0,0,0,0.08)]",
    "max-lg:order-first max-lg:max-w-none",
  ].join(" "),
  right: [
    "z-[1] bg-gradient-primary-lime shadow-[0_10px_48px_rgba(0,0,0,0.08)]",
    "lg:[clip-path:polygon(0_14%,100%_0,100%_100%,0_86%)]",
    "max-lg:rounded-[20px]",
    "xl:max-w-[340px]",
  ].join(" "),
};

function FeatureCard({
  title,
  description,
  variant,
  iconSrc,
}: {
  title: string;
  description: string;
  variant: "left" | "center" | "right";
  iconSrc: string;
}) {
  return (
    <article
      className={[
        "relative flex w-full max-w-none flex-col justify-center px-5 py-6 sm:px-7 sm:py-8 lg:min-h-[220px] lg:max-w-[320px] lg:px-[28px] lg:py-9 xl:max-w-[340px] xl:px-[30px] xl:py-10",
        CARD_VARIANT_CLASSES[variant],
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4 sm:gap-5">
        <div className="flex flex-1 flex-col gap-2.5 text-left">
          <h3 className="whitespace-pre-line font-heading text-lg font-bold leading-tight text-primary sm:text-xl lg:text-[22px]">
            {title}
          </h3>
        </div>
        <Image src={iconSrc} alt="" width={56} height={56} className="h-11 w-11 shrink-0 object-contain sm:h-14 sm:w-14" aria-hidden />
      </div>
      <p className="mt-3 text-sm leading-normal text-gray-600 sm:mt-4">{description}</p>
    </article>
  );
}

export default function WhyUsSection() {
  return (
    <section id="why-us" className="bg-[#f8f9f8] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <Reveal>
          <h2 className="mb-8 text-center font-heading text-[clamp(1.85rem,4vw,3rem)] font-bold leading-tight text-primary sm:mb-12 lg:mb-14">
            Why Us
          </h2>
        </Reveal>

        <Reveal>
          <div className="relative mb-10 flex flex-col items-stretch gap-4 sm:mb-12 sm:gap-5 lg:mb-14 lg:min-h-[200px] lg:flex-row lg:items-center lg:justify-center lg:gap-6 xl:gap-8">
            {FEATURE_CARDS.map((card) => (
              <FeatureCard
                key={card.id}
                title={card.title}
                description={card.description}
                variant={card.variant}
                iconSrc={card.iconSrc}
              />
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="grid grid-cols-2 gap-y-6 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
            {STATS.map((stat, index) => (
              <div key={stat.label} className="flex items-center justify-center">
                {index > 0 ? (
                  <div className="mx-0 hidden h-[52px] w-px shrink-0 bg-gray-300 lg:block" aria-hidden />
                ) : null}
                <div className="flex flex-col items-center gap-1.5 px-4 py-2 text-center sm:px-8 lg:px-10 lg:py-0">
                  <span className="font-heading text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-none text-primary-dark">
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium text-primary sm:text-[15px]">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

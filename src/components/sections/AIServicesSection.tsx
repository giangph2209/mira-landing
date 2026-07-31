import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

type ServiceList = {
  title: string;
  items: string[];
};

type ChallengeCard = {
  id: string;
  title: string;
  icon: string;
  underlineWord: string;
  columns: ServiceList[];
};

const CHALLENGE_CARDS: ChallengeCard[] = [
  {
    id: "strategic",
    title: "Strategic Challenges",
    icon: "/images/services/icon-1.png",
    underlineWord: "Challenges",
    columns: [
      {
        title: "Assessment & Consulting",
        items: [
          "Business understanding",
          "Feasibility assessment",
          "Strategy & roadmap design",
          "Technical advisory",
          "Capability building",
        ],
      },
    ],
  },
  {
    id: "resource",
    icon: "/images/services/icon-2.png",
    title: "Resource Challenges",
    underlineWord: "Challenges",
    columns: [
      {
        title: "Data Service",
        items: [
          "Data acquisition",
          "Data Entry",
          "OCR Processing",
          "Data Annotation",
          "Data Cleaning",
          "Segmentation",
          "Data Extraction",
          "Data Enrichment",
          "DaaS",
        ],
      },
      {
        title: "Implementation",
        items: [
          "Integration",
          "Deployment",
          "Edge Computing",
          "Monitoring, Maintenance & Support",
        ],
      },
    ],
  },
  {
    id: "capability",
    icon: "/images/services/icon-3.png",
    title: "Capability Challenges",
    underlineWord: "Challenges",
    columns: [
      {
        title: "Research & Development",
        items: [
          "Analytics",
          "Modelling",
          "Customization & Optimization",
          "Evaluation",
          "Proof of Concept",
        ],
      },
    ],
  },
];


function IconPlaceholder() {
  return <div className="h-20 w-20 shrink-0 rounded-full bg-gray-300 shadow-[0_8px_24px_rgba(14,128,63,0.18)]" />;
}

function ChallengeTitle({ title, underlineWord }: { title: string; underlineWord: string }) {
  const titlePrefix = title.replace(underlineWord, "").trim();

  return (
    <div className="flex flex-col">
      <h4 className="font-heading text-[clamp(1.35rem,2.2vw,1.75rem)] font-bold leading-tight text-primary-dark">
        {titlePrefix}
        <br />
        <span className="inline-block">
          {underlineWord}
          <span className="mt-2 block h-1 w-14 rounded-full bg-primary-light" />
        </span>
      </h4>
    </div>
  );
}

function ServiceListColumn({ title, items }: ServiceList) {
  return (
    <div className="min-w-0 flex-1">
      <h5 className="mb-3 text-base font-semibold text-[#1DB340]">{title}</h5>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-gray-700">
            <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gray-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChallengeCard({ card }: { card: ChallengeCard }) {
  const isMultiColumn = card.columns.length > 1;

  return (
    <article className="rounded-[1.5rem] bg-white p-5 shadow-[0_8px_40px_rgba(0,0,0,0.08)] sm:rounded-[2rem] sm:p-7 lg:rounded-[2.5rem] lg:p-10">
      <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:gap-10">
        <div className="flex w-full shrink-0 flex-col items-start gap-3 lg:w-[34%] lg:max-w-[240px]">
          <Image src={card.icon} alt={card.title} width={72} height={72} className="h-14 w-14 object-contain sm:h-[72px] sm:w-[72px]" />
          <ChallengeTitle title={card.title} underlineWord={card.underlineWord} />
        </div>

        <div
          className={[
            "flex min-w-0 flex-1 gap-8",
            isMultiColumn ? "flex-col sm:flex-row sm:gap-10 lg:gap-12" : "flex-col",
          ].join(" ")}
        >
          {card.columns.map((column) => (
            <ServiceListColumn key={column.title} {...column} />
          ))}
        </div>
      </div>
    </article>
  );
}

export default function AIServicesSection() {
  return (
    <section id="services" className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <Reveal>
          <header className="mx-auto max-w-[860px] text-center">
            <h2 className="font-heading text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-tight text-primary">
              Artificial Intelligence Services
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base lg:text-[17px]">
              Wherever you are on your journey—from accumulating the massive sources of data to constructing
              advanced AI models
            </p>
          </header>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-6">
          <Reveal className="hidden lg:col-span-5 lg:block" delay={80}>
            <Image
              src="/images/services/ai-service.webp"
              alt="Dịch vụ AI và phát triển phần mềm của Mura Tech"
              width={500}
              height={500}
              sizes="(max-width: 768px) 100vw, 500px"
              className="h-auto w-full object-cover"
            />
          </Reveal>

          <Reveal className="flex flex-col gap-6 sm:gap-8 lg:col-span-7" delay={140}>
            <h3 className="font-heading text-[clamp(1.35rem,3vw,2rem)] font-bold text-gradient-primary">
              Services that solve...
            </h3>

            <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8">
              {CHALLENGE_CARDS.map((card) => (
                <ChallengeCard key={card.id} card={card} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

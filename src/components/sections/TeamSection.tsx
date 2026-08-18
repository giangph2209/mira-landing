import {
  ClipboardList,
  CodeXml,
  SearchCheck,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type StatId = keyof Dictionary["team"]["stats"];
type RoleId = keyof Dictionary["team"]["roles"];

/** Con số không dịch; nhãn và diễn giải lấy từ dictionary theo id. */
const TEAM_STATS: { id: StatId; value: string }[] = [
  { id: "people", value: "20" },
  { id: "experience", value: "8–15" },
  { id: "projects", value: "5" },
  { id: "markets", value: "2" },
];

const TEAM_ROLES: { id: RoleId; count: string; Icon: LucideIcon }[] = [
  { id: "pm", count: "3", Icon: ClipboardList },
  { id: "dev", count: "12", Icon: CodeXml },
  { id: "qa", count: "5", Icon: SearchCheck },
];

const DOT_GRID =
  "radial-gradient(circle at center, rgba(255,255,255,0.16) 1px, transparent 1px)";

function StatsBand({ dict }: { dict: Dictionary["team"]["stats"] }) {
  return (
    <div className="gradient-primary relative overflow-hidden rounded-[24px] p-6 shadow-[0_18px_50px_rgba(5,85,55,0.28)] sm:rounded-[28px] sm:p-8 lg:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ backgroundImage: DOT_GRID, backgroundSize: "18px 18px" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-primary-pale/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-primary-light/25 blur-3xl"
      />

      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {TEAM_STATS.map((stat, index) => (
          <div
            key={stat.id}
            className={[
              "relative flex flex-col lg:px-7",
              index === 0 ? "lg:pl-0" : "",
              index === TEAM_STATS.length - 1 ? "lg:pr-0" : "",
            ].join(" ")}
          >
            {/* hairline that turns the four tiles into one band */}
            {index > 0 ? (
              <span
                aria-hidden
                className="absolute -left-px top-1 hidden h-[calc(100%-0.5rem)] w-px bg-white/20 lg:block"
              />
            ) : null}

            <span className="font-heading text-[clamp(2rem,4.6vw,3.25rem)] font-bold leading-none text-white">
              {stat.value}
            </span>
            <span className="mt-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-primary-pale sm:text-[15px]">
              {dict[stat.id].label}
            </span>
            <span className="mt-2 text-[13px] leading-relaxed text-white/75">
              {dict[stat.id].detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoleCard({
  role,
  copy,
  isLast,
}: {
  role: (typeof TEAM_ROLES)[number];
  copy: Dictionary["team"]["roles"][RoleId];
  isLast: boolean;
}) {
  const { Icon, count } = role;
  const { title, description } = copy;

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
          {count}
        </span>

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

        <h3 className="relative mt-5 pr-12 font-heading text-[17px] font-bold leading-snug text-primary-dark transition-colors duration-300 group-hover:text-primary">
          <span className="text-primary-light">{count}</span>
          <span className="mx-1.5 text-gray-300">—</span>
          {title}
        </h3>

        <p className="relative mt-2.5 text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      </article>

      {/* the three roles read as one pipeline: PM → Dev → QA */}
      {!isLast ? (
        <span
          aria-hidden
          className="absolute -right-[1.15rem] top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-border-soft bg-white text-primary shadow-[0_4px_12px_rgba(13,138,67,0.14)] lg:flex"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
        </span>
      ) : null}
    </div>
  );
}

export default function TeamSection({ dict }: { dict: Dictionary["team"] }) {
  return (
    <section
      id="team"
      className="relative overflow-hidden bg-white py-12 sm:py-14 lg:py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-[#e6f7ed] opacity-60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-[#eefaf1] opacity-70 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-6">
        <Reveal>
          <SectionHeader
            className="!mb-0"
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

        <Reveal className="mt-8 lg:mt-10" delay={80}>
          <StatsBand dict={dict.stats} />
        </Reveal>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:gap-5 lg:mt-6 lg:grid-cols-3 lg:gap-6">
          {TEAM_ROLES.map((role, index) => (
            <Reveal key={role.id} className="h-full" delay={index * 90}>
              <RoleCard
                role={role}
                copy={dict.roles[role.id]}
                isLast={index === TEAM_ROLES.length - 1}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

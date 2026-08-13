import {
  Award,
  BrainCircuit,
  Cpu,
  Globe,
  HandCoins,
  HeartHandshake,
  Layers,
  Rocket,
  Sparkles,
  Target,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";

type Reason = {
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  tags?: string[];
};

/** clockwise from the top of the wheel */
const REASONS: Reason[] = [
  {
    id: "capability",
    title: "Năng lực phát triển phần mềm",
    description:
      "Đội ngũ gồm PM, Developer và Tester/QA, giúp dự án được quản lý, phát triển và kiểm soát chất lượng theo quy trình rõ ràng.",
    Icon: UsersRound,
  },
  {
    id: "ai",
    title: "Ứng dụng AI",
    description:
      "DVL Tech chủ động ứng dụng AI vào quá trình phát triển phần mềm nhằm nâng cao năng suất và tối ưu thời gian triển khai.",
    Icon: BrainCircuit,
  },
  {
    id: "japan",
    title: "Kinh nghiệm với khách hàng Nhật Bản",
    description:
      "DVL Tech hiện đang hợp tác với khách hàng tại Nhật Bản và trực tiếp vận hành nhiều dự án phần mềm trong các lĩnh vực khác nhau.",
    Icon: Globe,
  },
  {
    id: "long-term",
    title: "Đồng hành lâu dài",
    description:
      "DVL Tech không chỉ phát triển và bàn giao phần mềm mà còn hỗ trợ bảo trì, cập nhật, vận hành và cải tiến hệ thống.",
    Icon: HeartHandshake,
  },
  {
    id: "speed",
    title: "Tốc độ triển khai",
    description:
      "Tập trung vào việc xác định đúng vấn đề, lựa chọn giải pháp phù hợp và triển khai hiệu quả.",
    Icon: Rocket,
  },
  {
    id: "cost",
    title: "Chi phí cạnh tranh",
    description:
      "Tối ưu nguồn lực và quy trình phát triển để mang lại giải pháp có chi phí phù hợp với nhu cầu và ngân sách của doanh nghiệp.",
    Icon: HandCoins,
  },
  {
    id: "stack",
    title: "Công nghệ đa dạng",
    description: "Đội ngũ có kinh nghiệm với nhiều công nghệ và nền tảng như:",
    Icon: Layers,
    tags: ["Java", "PHP", "Python", ".NET", "React", "Vue JS", "AWS"],
  },
  {
    id: "experience",
    title: "Kinh nghiệm thực tế",
    description:
      "DVL Tech được thành lập năm 2026, đội ngũ sáng lập và nhân sự chủ chốt đã có 8–15 năm kinh nghiệm trong lĩnh vực công nghệ thông tin và phát triển phần mềm.",
    Icon: Award,
  },
];

/* ---------- wheel geometry (percentages of the square wrapper) ---------- */

const SEG_ANGLE = 360 / REASONS.length;
const HALF_ANGLE = SEG_ANGLE / 2;
/** half the divider width, in % of the wheel — the gap keeps a constant width */
const GAP = 0.35;
/** how far past the circle the polygon reaches, so border-radius does the arc */
const OVERSHOOT = 150;
/** distance from the centre where each segment's content sits — pushed toward
 *  the rim, where the fan is wide enough for a roomier text block */
const LABEL_RADIUS = 37.5;
/** width of that text block, in % of the wheel */
const LABEL_WIDTH = 22;

const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
const unit = (deg: number) => ({
  x: Math.cos(rad(deg)),
  y: Math.sin(rad(deg)),
});

/** point at `radius` along `deg`, then pushed `shift` along `shiftDeg` */
function point(radius: number, deg: number, shift = 0, shiftDeg = 0) {
  const dir = unit(deg);
  const off = shift ? unit(shiftDeg) : { x: 0, y: 0 };
  return {
    x: 50 + radius * dir.x + shift * off.x,
    y: 50 + radius * dir.y + shift * off.y,
  };
}

const fmt = ({ x, y }: { x: number; y: number }) =>
  `${x.toFixed(2)}% ${y.toFixed(2)}%`;

/**
 * A pie slice whose two straight edges are pushed inward by `GAP`, so the
 * divider between neighbours is the same width from the core to the rim.
 * The apex lands slightly off-centre — hidden under the core disc — and the
 * wrapper's border-radius turns the outer edge into an arc.
 */
function wedgeClipPath(index: number) {
  const centre = index * SEG_ANGLE;
  const startDeg = centre - HALF_ANGLE;
  const endDeg = centre + HALF_ANGLE;

  const corners = [
    // where the two offset edges meet, on the bisector
    point(GAP / Math.sin((HALF_ANGLE * Math.PI) / 180), centre),
    point(OVERSHOOT, startDeg, GAP, startDeg + 90),
    point(OVERSHOOT, centre),
    point(OVERSHOOT, endDeg, GAP, endDeg - 90),
  ];

  return `polygon(${corners.map(fmt).join(", ")})`;
}

function labelPosition(index: number) {
  const { x, y } = point(LABEL_RADIUS, index * SEG_ANGLE);
  return { left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%` };
}

/** css `left`/`top` for a point on the wheel */
function positionAt(radius: number, deg: number) {
  const { x, y } = point(radius, deg);
  return { left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%` };
}

/** a marker on the rim wherever two segments meet */
const RIM_MARKERS = REASONS.map((_, index) => ({
  id: `rim-${index}`,
  position: positionAt(51.6, index * SEG_ANGLE + HALF_ANGLE),
  delay: `${index * 320}ms`,
}));

/** small glass chips parked in the corners the circle leaves empty */
const CORNER_CHIPS = [
  { id: "chip-ne", Icon: Sparkles, deg: 45, delay: "0ms" },
  { id: "chip-se", Icon: Cpu, deg: 135, delay: "800ms" },
  { id: "chip-sw", Icon: Target, deg: 225, delay: "400ms" },
  { id: "chip-nw", Icon: Zap, deg: 315, delay: "1200ms" },
].map((chip) => ({ ...chip, position: positionAt(58, chip.deg) }));

const SEGMENTS = REASONS.map((reason, index) => ({
  ...reason,
  clipPath: wedgeClipPath(index),
  position: labelPosition(index),
  /** alternating fill keeps the visual rhythm around the wheel */
  tinted: index % 2 === 0,
}));

const TINTED_FILL =
  "radial-gradient(circle at 50% 50%, #f0fbf4 22%, #d8f2e2 100%)";
const PLAIN_FILL =
  "radial-gradient(circle at 50% 50%, #ffffff 30%, #f2faf5 100%)";

/* ------------------------------- pieces -------------------------------- */

function SegmentIcon({ Icon }: { Icon: LucideIcon }) {
  return (
    <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/85 shadow-[0_4px_10px_rgba(13,138,67,0.14)] ring-1 ring-primary/10 lg:h-10 lg:w-10">
      <Icon
        className="h-[18px] w-[18px] text-primary lg:h-5 lg:w-5"
        strokeWidth={1.8}
        aria-hidden
      />
    </span>
  );
}

function WheelCore() {
  return (
    <div className="absolute left-1/2 top-1/2 aspect-square w-[36%] -translate-x-1/2 -translate-y-1/2">
      <span
        aria-hidden
        className="absolute -inset-4 rounded-full bg-primary/10 blur-2xl"
      />
      {/* white gap that separates the core from the ring */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-[#f8faf9] shadow-[0_2px_18px_rgba(13,138,67,0.08)]"
      />
      {/* dashed ring turning one way, thin ring the other — each carries a dot */}
      <div
        aria-hidden
        className="animate-orbit-slow absolute inset-[7%] rounded-full border border-dashed border-primary/25"
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-light shadow-[0_0_12px_rgba(29,179,64,0.9)]" />
      </div>
      <div
        aria-hidden
        className="animate-orbit-reverse absolute inset-[14%] rounded-full border border-primary/15"
      >
        <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary" />
        <span className="absolute left-0 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-pale" />
      </div>

      <div className="gradient-primary absolute inset-[18%] flex flex-col items-center justify-center rounded-full border-[6px] border-white text-center shadow-[0_16px_38px_rgba(13,138,67,0.32)]">
        <span className="font-heading text-[clamp(1.1rem,2.6vw,1.9rem)] font-bold leading-none text-white">
          DVL
        </span>
        <span className="mt-1 text-[clamp(0.5rem,0.9vw,0.65rem)] font-semibold uppercase tracking-[0.34em] text-white/85">
          Tech
        </span>
      </div>

      <span
        aria-hidden
        className="absolute right-[2%] top-[46%] h-1.5 w-1.5 rounded-full bg-primary-light"
      />
      <span
        aria-hidden
        className="absolute -right-[3%] top-[62%] h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(13,138,67,0.5)]"
      />
    </div>
  );
}

function CapabilityWheel() {
  return (
    <div className="relative mx-auto hidden aspect-square w-full max-w-[840px] md:block">
      {/* faint outline that closes the wheel */}
      <span
        aria-hidden
        className="absolute -inset-[1.5%] rounded-full border border-primary/10"
      />

      {/* outer dashed halo, slowly turning, with two travelling sparks */}
      <div
        aria-hidden
        className="animate-orbit-reverse absolute -inset-[5%] rounded-full border border-dashed border-primary/15"
      >
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-light shadow-[0_0_16px_rgba(29,179,64,0.85)]" />
        <span className="absolute bottom-[14%] right-[6%] h-1.5 w-1.5 rounded-full bg-primary/50" />
      </div>

      {/* thin ring turning the other way, marking the wheel's rim */}
      <div
        aria-hidden
        className="animate-orbit-fast absolute -inset-[2.5%] rounded-full"
      >
        <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary shadow-[0_0_12px_rgba(13,138,67,0.6)]" />
        <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary-pale" />
      </div>

      {/* a marker sitting on the rim above every divider */}
      {RIM_MARKERS.map((marker) => (
        <span
          key={marker.id}
          aria-hidden
          className="animate-region-pulse absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/35"
          style={{ ...marker.position, animationDelay: marker.delay }}
        />
      ))}

      {/* glass chips filling the corners the circle leaves empty */}
      {CORNER_CHIPS.map(({ id, Icon, position, delay }) => (
        <div
          key={id}
          aria-hidden
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={position}
        >
          <div
            className="animate-region-float flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/70 shadow-[0_8px_20px_rgba(13,138,67,0.14)] backdrop-blur-sm lg:h-11 lg:w-11"
            style={{ animationDelay: delay }}
          >
            <Icon className="h-4 w-4 text-primary lg:h-[18px] lg:w-[18px]" strokeWidth={1.9} />
          </div>
        </div>
      ))}

      {SEGMENTS.map((segment) => (
        // wrapper is NOT clipped, so the text below stays readable
        <div key={segment.id} className="absolute inset-0">
          {/* the fan-shaped surface of this segment */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              clipPath: segment.clipPath,
              background: segment.tinted ? TINTED_FILL : PLAIN_FILL,
              filter: "drop-shadow(0 1px 2px rgba(13,138,67,0.07))",
            }}
          />

          {/* content, dropped on the centroid of that fan */}
          <article
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ ...segment.position, width: `${LABEL_WIDTH}%` }}
          >
            <SegmentIcon Icon={segment.Icon} />

            <h3 className="mt-2 font-heading text-[clamp(0.75rem,1.35vw,0.98rem)] font-bold leading-tight text-primary">
              {segment.title}
            </h3>

            <p className="mt-1.5 text-[clamp(0.62rem,1.05vw,0.8rem)] leading-snug text-gray-600">
              {segment.description}
            </p>

            {segment.tags?.length ? (
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {segment.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-1.5 py-0.5 text-[clamp(0.52rem,0.85vw,0.66rem)] font-semibold text-primary-dark ring-1 ring-primary/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        </div>
      ))}

      <WheelCore />
    </div>
  );
}

/** below md the wheel is unreadable, so the same content stacks as cards */
function ReasonCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
      {SEGMENTS.map((segment) => (
        <article
          key={segment.id}
          className="rounded-[20px] p-5 shadow-[0_8px_28px_rgba(0,0,0,0.06)] ring-1 ring-primary/8"
          style={{
            background: segment.tinted ? TINTED_FILL : PLAIN_FILL,
          }}
        >
          <div className="flex items-center gap-3">
            <SegmentIcon Icon={segment.Icon} />
            <h3 className="font-heading text-base font-bold leading-tight text-primary">
              {segment.title}
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {segment.description}
          </p>
          {segment.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {segment.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-primary-dark ring-1 ring-primary/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export default function WhyUsSection() {
  return (
    <section id="why-us" className="bg-[#f8faf9] py-12 sm:py-14 lg:py-16">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <Reveal>
          <header className="mx-auto mb-8 max-w-[820px] text-center sm:mb-12 lg:mb-14">
            <h2 className="font-heading text-[clamp(1.85rem,4vw,3rem)] font-bold leading-tight text-primary">
              Why Us
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base lg:text-[17px]">
              Đội ngũ giàu kinh nghiệm. Quy trình chuyên nghiệp. Công nghệ phù
              hợp.
            </p>
          </header>
        </Reveal>

        <Reveal>
          <div className="mb-10 sm:mb-12 lg:mb-14">
            <CapabilityWheel />
            <ReasonCards />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

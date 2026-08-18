import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type StepId = keyof Dictionary["process"]["steps"];

// Chỉ giữ phần KHÔNG dịch được: số thứ tự và đường dẫn icon. Tiêu đề, phụ đề và
// mô tả lấy theo id từ dictionary.
const STEPS: { id: StepId; step: string; iconSrc: string }[] = [
  { id: "requirement", step: "01", iconSrc: "/images/process/1.png" },
  { id: "design", step: "02", iconSrc: "/images/process/2.png" },
  { id: "development", step: "03", iconSrc: "/images/process/3.png" },
  { id: "testing", step: "04", iconSrc: "/images/process/4.png" },
  { id: "deployment", step: "05", iconSrc: "/images/process/5.png" },
  { id: "operation", step: "06", iconSrc: "/images/process/6.png" },
  { id: "maintenance", step: "07", iconSrc: "/images/process/7.png" },
];

function ProcessCard({
  step,
  title,
  subtitle,
  description,
  iconSrc,
}: {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  iconSrc: string;
}) {
  return (
    <article className="relative flex h-full flex-col items-center overflow-visible rounded-[20px] bg-gradient-to-b from-white to-[#edf7f0] px-4 pb-6 pt-12 shadow-[0_12px_36px_rgba(72,160,120,0.16)] sm:px-6 sm:pb-8 sm:pt-14 lg:rounded-[24px] lg:px-8 lg:pb-10 lg:pt-16">
      <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-[0_6px_16px_rgba(14,128,63,0.28)] sm:left-4 sm:top-4 lg:h-11 lg:w-11">
        {step}
      </span>

      <div className="mb-4 flex h-[72px] w-full items-center justify-center sm:mb-5 sm:h-[88px] lg:mb-6 lg:h-[104px]">
        <Image
          src={iconSrc}
          alt={title}
          width={96}
          height={96}
          className="h-16 w-16 object-contain sm:h-[72px] sm:w-[72px] lg:h-20 lg:w-20"
        />
      </div>

      <h3 className="text-center font-heading text-base font-bold leading-snug text-primary sm:text-[17px] lg:text-lg">
        {title}
      </h3>
      {/* Bản tiếng Anh để subtitle rỗng vì title vốn đã là tiếng Anh — render
          thẳng sẽ tạo một dòng trống lệch layout. */}
      {subtitle ? (
        <p className="mt-1.5 text-center text-sm font-semibold leading-snug text-primary-light">
          {subtitle}
        </p>
      ) : null}
      <span
        className="mx-auto mt-3 block h-px w-10 bg-primary/15"
        aria-hidden
      />
      <p className="mt-3 text-center text-xs leading-relaxed text-text-gray sm:text-[13px]">
        {description}
      </p>
    </article>
  );
}

export default function DevelopmentProcessSection({
  dict,
}: {
  dict: Dictionary["process"];
}) {
  const firstRow = STEPS.slice(0, 4);
  const secondRow = STEPS.slice(4);

  return (
    <section id="process" className="bg-white py-14 lg:py-16">
      <div className="mx-auto w-full max-w-[1280px] px-6">
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

        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-12">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {firstRow.map((item, i) => (
              <Reveal key={item.id} delay={i * 60}>
                <ProcessCard step={item.step} iconSrc={item.iconSrc} {...dict.steps[item.id]} />
              </Reveal>
            ))}
          </div>

          <div className="flex justify-center">
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:w-[calc(75%-12px)] lg:grid-cols-3 lg:gap-8">
              {secondRow.map((item, index) => (
                <Reveal
                  key={item.id}
                  delay={(index + 4) * 60}
                  className={
                    index === secondRow.length - 1
                      ? "sm:col-span-2 sm:mx-auto sm:max-w-sm lg:col-span-1 lg:mx-0 lg:max-w-none"
                      : ""
                  }
                >
                  <ProcessCard step={item.step} iconSrc={item.iconSrc} {...dict.steps[item.id]} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { ArrowRightIcon, PlayOutlineIcon } from "@/components/ui/Icons";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export default function HeroSection({ dict }: { dict: Dictionary["hero"] }) {
  return (
    <section className="relative flex flex-col items-center px-5 pb-16 pt-10 text-center sm:px-6 sm:pb-20 sm:pt-14 md:pt-20 lg:pb-28 lg:pt-24">
      <Reveal className="flex max-w-[900px] flex-col items-center gap-4 sm:gap-6">
        <h1 className="text-[clamp(1.55rem,5vw,3.5rem)] font-bold leading-[1.15] tracking-tight">
          <span className="bg-gradient-to-r from-brand-blue to-primary bg-clip-text text-transparent">
            {dict.titleLine1}
          </span>
          <br />
          <span className="text-gradient-primary">{dict.titleLine2}</span>
        </h1>

        <p className="max-w-200 text-[15px] font-medium leading-relaxed text-text-muted sm:text-lg">
          {dict.lead}
        </p>

        <p className="max-w-200 text-[15px] font-medium leading-relaxed text-text-muted sm:text-lg">
          {dict.experienceBefore}
          <span className="text-gradient-primary">{dict.experienceHighlight}</span>
          {dict.experienceAfter}
        </p>

        <div className="mt-1 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Button
            href="#contact"
            size="lg"
            className="w-full border-1 sm:w-auto"
            iconRight={<ArrowRightIcon size={18} />}
          >
            {dict.ctaPrimary}
          </Button>
          <Button
            href="#services"
            variant="outline"
            size="lg"
            className="w-full border-1 sm:w-auto"
            iconRight={<PlayOutlineIcon />}
          >
            {dict.ctaSecondary}
          </Button>
        </div>
        {/* Trước đây là một <span> trần chứa chuỗi "Vietnam · Japan", không có style
            nào cả nên trông như chữ bị bỏ quên dưới hai nút CTA. Dùng lại đúng mẫu
            chip thị trường của FooterSection (viên thuốc + chấm), đổi màu cho nền sáng. */}
        <ul
          aria-label={dict.marketsLabel}
          className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:mt-2 sm:gap-2.5"
        >
          {dict.markets.map((market) => (
            <li
              key={market}
              className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-white/70 px-3.5 py-1.5 text-[13px] font-semibold text-primary-dark shadow-[0_2px_10px_rgba(14,128,63,0.06)] backdrop-blur-sm sm:text-sm"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light"
                aria-hidden
              />
              {market}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

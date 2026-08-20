import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { ArrowRightIcon, PlayOutlineIcon } from "@/components/ui/Icons";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export default function HeroSection({ dict }: { dict: Dictionary["hero"] }) {
  return (
    <section className="relative flex flex-col items-center overflow-hidden px-5 pb-16 pt-10 text-center sm:px-6 sm:pb-20 sm:pt-14 md:pt-20 lg:pb-28 lg:pt-24">
      {/* Khối sáng trôi chậm phía sau nội dung — tạo chuyển động nền cho banner
          vốn chỉ là ảnh tĩnh. Đặt dưới nội dung (z mặc định) và pointer-events-none
          nên không cản thao tác. Xem .hero-orb trong globals.css. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span
          className="hero-orb left-[8%] top-[12%] h-64 w-64 bg-primary-light/25"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="hero-orb right-[6%] top-[22%] h-72 w-72 bg-brand-blue/15"
          style={{ animationDelay: "-6s" }}
        />
        <span
          className="hero-orb bottom-[10%] left-[38%] h-56 w-56 bg-primary/20"
          style={{ animationDelay: "-12s" }}
        />
      </div>

      {/* Vào trang theo từng nhịp: trước đây cả khối nằm trong MỘT Reveal nên mọi
          thứ bật lên cùng lúc. Tách ra kèm delay tăng dần cho mắt đi theo thứ tự
          tiêu đề → mô tả → nút → thị trường. */}
      <div className="relative z-1 flex w-full max-w-[900px] flex-col items-center gap-4 sm:gap-6">
        <Reveal className="w-full">
        {/* font-heading (IBM Plex Sans) thay vì font-sans mặc định (Roboto): tiêu đề
            hero trước đây dùng chung font với body nên không có nét riêng nào.
            tracking âm nhẹ giúp dòng chữ lớn bớt rời rạc. */}
        <h1 className="font-heading text-[clamp(1.55rem,5vw,3.5rem)] font-bold leading-[1.12] tracking-[-0.025em]">
          <p className="text-gradient-animated bg-gradient-to-r from-brand-blue to-primary bg-clip-text text-transparent leading-18">
            {dict.titleLine1}
          </p>
          <span className="relative inline-block">
            <span className="text-gradient-primary text-gradient-animated">
              {dict.titleLine2}
            </span>
            {/* Gạch chân mềm chạy dưới dòng nhấn — mỏng dần về hai đầu để không
                thành một thanh đặc cứng nhắc. */}
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-transparent via-primary-light/60 to-transparent sm:-bottom-1.5"
            />
          </span>
          </h1>
        </Reveal>

        <Reveal className="w-full" delay={120}>
          <p className="mx-auto max-w-200 text-[15px] font-medium leading-relaxed text-text-muted sm:text-lg">
            {dict.lead}
          </p>
        </Reveal>

        <Reveal className="w-full" delay={200}>
          <p className="mx-auto max-w-200 text-[15px] font-medium leading-relaxed text-text-muted sm:text-lg">
          {dict.experienceBefore}
          <span className="text-gradient-primary">
            {dict.experienceHighlight}
          </span>
            {dict.experienceAfter}
          </p>
        </Reveal>

        <Reveal className="w-full" delay={290}>
          <div className="mt-1 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Button
            href="#contact"
            variant="gradient"
            size="lg"
            className="group w-full border-1 sm:w-auto"
            iconRight={
              <ArrowRightIcon
                size={18}
                // mũi tên nhích sang phải khi hover — gợi ý hướng đi tiếp
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            }
          >
            {dict.ctaPrimary}
          </Button>
          <Button
            href="#services"
            variant="outline"
            size="lg"
            className="w-full border-1 shadow-[0_2px_12px_rgba(14,128,63,0.08)] transition-shadow hover:shadow-[0_6px_20px_rgba(14,128,63,0.16)] sm:w-auto"
            iconRight={<PlayOutlineIcon />}
          >
            {dict.ctaSecondary}
          </Button>
          </div>
        </Reveal>

        <Reveal delay={380}>
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
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light border"
                aria-hidden
              />
              {market}
            </li>
          ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

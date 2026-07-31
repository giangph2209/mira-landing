import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { ArrowRightIcon, PlayOutlineIcon } from "@/components/ui/Icons";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center px-5 pb-16 pt-10 text-center sm:px-6 sm:pb-20 sm:pt-14 md:pt-20 lg:pb-28 lg:pt-24">
      <Reveal className="flex max-w-[900px] flex-col items-center gap-5 sm:gap-6">
        <h1 className="text-[clamp(1.85rem,5vw,3.5rem)] font-bold leading-[1.15] tracking-tight">
          <span className="bg-gradient-to-r from-brand-blue to-primary bg-clip-text text-transparent">
            Đối tác triển khai
          </span>
          <br />
          <span className="text-gradient-primary">Phần mềm tin cậy</span>
        </h1>

        <p className="max-w-[640px] text-base font-medium leading-relaxed text-text-muted sm:text-lg md:text-xl">
          Đồng hành cùng doanh nghiệp kiến tạo giá trị số bền vững.
        </p>

        <div className="mt-1 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Button href="#contact" size="lg" className="w-full border-1 sm:w-auto" iconRight={<ArrowRightIcon size={18} />}>
            Bắt đầu ngay
          </Button>
          <Button href="#process" variant="outline" size="lg" className="w-full border-1 sm:w-auto" iconRight={<PlayOutlineIcon />}>
            Tìm hiểu quy trình
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

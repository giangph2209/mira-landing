import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { ArrowRightIcon, PlayOutlineIcon } from "@/components/ui/Icons";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center px-5 pb-16 pt-10 text-center sm:px-6 sm:pb-20 sm:pt-14 md:pt-20 lg:pb-28 lg:pt-24">
      <Reveal className="flex max-w-[900px] flex-col items-center gap-4 sm:gap-6">
        <h1 className="text-[clamp(1.55rem,5vw,3.5rem)] font-bold leading-[1.15] tracking-tight">
          <span className="bg-gradient-to-r from-brand-blue to-primary bg-clip-text text-transparent">
            Biến ý tưởng
          </span>
          <br />
          <span className="text-gradient-primary">
            thành giải pháp phần mềm thực tế
          </span>
        </h1>

        <p className="max-w-200 text-[15px] font-medium leading-relaxed text-text-muted sm:text-lg">
          DVL Tech cung cấp dịch vụ tư vấn và phát triển phần mềm cho doanh
          nghiệp, từ phân tích nhu cầu, xây dựng kế hoạch đến triển khai và vận
          hành hệ thống.
        </p>

        <p className="max-w-200 text-[15px] font-medium leading-relaxed text-text-muted sm:text-lg">
          Với đội ngũ có{" "}
          <span className="text-gradient-primary">
            8–15 năm kinh nghiệm trong lĩnh vực công nghệ thông tin
          </span>
          , DVL Tech đồng hành cùng doanh nghiệp tại Việt Nam và Nhật Bản trong
          các dự án phần mềm và chuyển đổi số.
        </p>

        <div className="mt-1 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Button
            href="#contact"
            size="lg"
            className="w-full border-1 sm:w-auto"
            iconRight={<ArrowRightIcon size={18} />}
          >
            Trao đổi về dự án
          </Button>
          <Button
            href="#services"
            variant="outline"
            size="lg"
            className="w-full border-1 sm:w-auto"
            iconRight={<PlayOutlineIcon />}
          >
            Khám phá dịch vụ
          </Button>
        </div>
        <span>Vietnam · Japan</span>
      </Reveal>
    </section>
  );
}

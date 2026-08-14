"use client";

import { useState, type TouchEvent } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";
import Reveal from "@/components/ui/Reveal";
import { ArrowActionIcon } from "@/components/ui/ArrowActionButton";
import SectionHeader from "@/components/ui/SectionHeader";
import { scrollToHash } from "@/lib/scroll";

type CaseStudy = {
  id: string;
  /** hiển thị "CASE STUDY 01" */
  number: string;
  title: string;
  /** dòng mô tả ngắn dưới tiêu đề, chỉ một vài case có */
  subtitle?: string;
  desc: string;
  /** các tiện ích/điểm nổi bật, hiển thị dạng chip */
  features?: string[];
  problem: string;
  involvement: string[];
  tech: string[];
  /** case đang hoàn thiện nội dung có thể chưa có kết quả */
  result?: string;
  /** ảnh nền panel trái; gradient `tone` là lớp nền dự phòng khi thiếu ảnh */
  image?: string;
  tone: string;
};

const CASES: CaseStudy[] = [
  {
    id: "lifecycle",
    number: "01",
    title: "Lifecycle",
    subtitle: "Nền tảng tiện ích đô thị trên một ứng dụng",
    desc: "Lifecycle là hệ thống hỗ trợ quản lý và theo dõi các hoạt động trong một thành phố, đồng thời cung cấp nhiều tiện ích cho người dân.",
    features: [
      "Mua sắm",
      "Công viên",
      "Trường học",
      "Nơi trú ẩn",
      "Chat",
      "Call",
      "Liên hệ chính quyền thành phố",
    ],
    problem:
      "Tổng hợp các tiện ích và thông tin của thành phố trên một ứng dụng duy nhất, giúp người dân thuận tiện hơn trong việc tiếp cận các dịch vụ và thông tin cần thiết.",
    involvement: [
      "Phân tích yêu cầu",
      "Phát triển hệ thống",
      "Kiểm thử",
      "Vận hành & bảo trì",
    ],
    tech: ["Python", "Vue JS", "AWS"],
    result:
      "Hệ thống được đưa vào vận hành tại nhiều thành phố ở Nhật Bản và tiếp tục được DVL Tech hỗ trợ, bảo trì và cải tiến theo nhu cầu thực tế.",
    image: "/images/case-studies/lifecycle.webp",
    tone: "bg-gradient-to-br from-[#0b1f17] via-[#12402a] to-[#0e803f]",
  },
  {
    id: "food-waste",
    number: "02",
    title: "Ứng dụng hỗ trợ giảm lãng phí thực phẩm",
    desc: "Ứng dụng hỗ trợ kết nối các đơn vị cung cấp thực phẩm với người dùng, góp phần tận dụng các sản phẩm có nguy cơ bị lãng phí.",
    problem:
      "Giảm lượng thực phẩm bị bỏ đi và tạo ra một phương thức thuận tiện hơn để phân phối các sản phẩm thực phẩm còn giá trị sử dụng.",
    involvement: [
      "Phát triển hệ thống",
      "Xử lý chức năng nghiệp vụ",
      "Kiểm thử",
    ],
    tech: ["Python", "Vue JS", "AWS"],
    result:
      "Ứng dụng được xây dựng nhằm giải quyết một bài toán xã hội thực tế, kết hợp công nghệ với mục tiêu giảm lãng phí thực phẩm.",
    image: "/images/case-studies/food-waste.webp",
    tone: "bg-gradient-to-br from-primary-dark via-primary to-primary-light",
  },
  {
    id: "business-chat",
    number: "03",
    title: "Business Chat & Call Application",
    desc: "Ứng dụng hỗ trợ giao tiếp giữa các doanh nghiệp thông qua các tính năng nhắn tin và gọi điện. Hệ thống giúp người dùng trao đổi thông tin nhanh chóng và thuận tiện hơn trong quá trình làm việc.",
    problem:
      "Tạo một kênh giao tiếp tập trung cho các doanh nghiệp, giúp trao đổi thông tin thuận tiện và giảm sự phụ thuộc vào nhiều công cụ liên lạc khác nhau.",
    involvement: [
      "Phát triển chức năng",
      "Xử lý nghiệp vụ",
      "Kiểm thử",
      "Hỗ trợ vận hành",
    ],
    tech: ["Python", "Vue JS", "AWS"],
    result:
      "Hệ thống cung cấp các chức năng giao tiếp trực tiếp giữa doanh nghiệp, phục vụ nhu cầu trao đổi thông tin trong môi trường công việc.",
    image: "/images/case-studies/business-chat.webp",
    tone: "bg-gradient-to-br from-[#1a36a3] via-[#0e803f] to-[#055537]",
  },
  {
    id: "toy-label",
    number: "04",
    title: "Toy Label Management System",
    desc: "Hệ thống hỗ trợ quản lý thông tin và quy trình liên quan đến nhãn dán của các sản phẩm đồ chơi.",
    problem:
      "Quản lý tập trung thông tin nhãn dán, giảm việc xử lý thủ công và giúp người dùng dễ dàng theo dõi, cập nhật thông tin sản phẩm.",
    involvement: [
      "Phân tích yêu cầu",
      "Phát triển hệ thống",
      "Kiểm thử",
      "Hỗ trợ vận hành",
    ],
    tech: ["Python", "Vue JS", "AWS"],
    result:
      "Hệ thống giúp số hóa và tập trung hóa quá trình quản lý thông tin nhãn dán, hỗ trợ doanh nghiệp quản lý dữ liệu hiệu quả hơn.",
    image: "/images/case-studies/toy-label.webp",
    tone: "bg-gradient-to-br from-[#033d28] via-[#08904d] to-[#4dd15f]",
  },
  {
    id: "accessibility-support",
    number: "05",
    title: "Ứng dụng hỗ trợ người yếu thế",
    desc: "Ứng dụng được xây dựng nhằm hỗ trợ người yếu thế tiếp cận thông tin, dịch vụ hoặc các nguồn hỗ trợ phù hợp với nhu cầu của họ.",
    problem:
      "Tạo ra một công cụ công nghệ giúp người dùng dễ dàng tiếp cận các thông tin và dịch vụ hỗ trợ trong cuộc sống.",
    involvement: [
      "Phát triển hệ thống",
      "Xử lý chức năng nghiệp vụ",
      "Kiểm thử",
      "Hỗ trợ vận hành",
    ],
    tech: [],
    image: "/images/case-studies/accessibility-support.webp",
    tone: "bg-gradient-to-br from-[#0d3b66] via-[#0e803f] to-[#66c047]",
  },
];

const SWIPE_THRESHOLD = 48;

function BlockTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
      {children}
    </p>
  );
}

export default function CaseStudiesSection() {
  const [active, setActive] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const total = CASES.length;
  const isFirst = active === 0;
  const isLast = active === total - 1;

  const prev = () => {
    if (!isFirst) setActive((current) => current - 1);
  };

  const next = () => {
    if (!isLast) setActive((current) => current + 1);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (delta <= -SWIPE_THRESHOLD) next();
    if (delta >= SWIPE_THRESHOLD) prev();
    setTouchStartX(null);
  };

  const navButtonClass = (disabled: boolean) =>
    [
      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
      disabled
        ? "cursor-not-allowed border-gray-200 text-gray-300"
        : "border-primary text-primary hover:bg-primary/5",
    ].join(" ");

  return (
    <section id="case-studies" className="py-14 lg:py-16">
      <div className="section-container">
        <Reveal>
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-10 sm:gap-6 lg:mb-14 lg:flex-row lg:items-end">
            <SectionHeader
              align="left"
              className="!mb-0"
              eyebrow="Our work"
              title={
                <>
                  Case <span className="text-accent">Studies</span>
                </>
              }
            />
            <a
              href="#contact"
              className="group inline-flex shrink-0 items-center gap-3 text-[15px] font-semibold text-primary transition-colors hover:text-primary-dark"
              onClick={(e) => {
                e.preventDefault();
                scrollToHash("#contact");
              }}
            >
              Xem tất cả dự án
              <ArrowActionIcon size="sm" />
            </a>
          </div>
        </Reveal>

        <Reveal>
          <div className="card overflow-hidden !p-0">
            <div
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${active * 100}%)` }}
              >
                {CASES.map((item, index) => (
                  <article
                    key={item.id}
                    aria-hidden={index !== active}
                    className="flex w-full shrink-0 flex-col lg:flex-row"
                  >
                    {/* Left — nhận diện case */}
                    <div
                      className={`relative isolate flex min-h-[280px] shrink-0 flex-col gap-5 overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:min-h-[440px] lg:w-[38%] lg:px-10 lg:py-12 ${item.tone}`}
                    >
                      {item.image ? (
                        <>
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            sizes="(max-width: 1024px) 100vw, 38vw"
                            className="object-cover object-center"
                            aria-hidden
                          />
                          {/* duotone — kéo ảnh về đúng hệ xanh brand, giữ nguyên độ sáng tối */}
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-primary opacity-70 mix-blend-color"
                          />
                          {/* nhấn thêm sắc xanh sâu vào vùng tối của ảnh */}
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-primary-800/45 mix-blend-multiply"
                          />
                        </>
                      ) : null}

                      {/* bóng mờ — tối hai đầu cho chữ trắng nổi, chừa sáng ở giữa cho chủ thể */}
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(1,32,21,0.74)_40%,rgba(2,45,29,0.7)_50%,rgba(2,45,29,0.7)_50%,rgba(2,33,21,0.88)_78%,rgba(1,17,10,0.98)_100%)]"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-pale/25 blur-2xl"
                      />

                      <div className="relative z-1">
                        <span className="badge badge--white uppercase tracking-[0.18em]">
                          Case study {item.number}
                        </span>
                        <h3 className="mt-5 font-heading text-2xl font-bold leading-tight text-white lg:text-[1.75rem]">
                          {item.title}
                        </h3>
                        {item.subtitle ? (
                          <p className="mt-2 text-[15px] leading-relaxed text-white/75">
                            {item.subtitle}
                          </p>
                        ) : null}
                      </div>

                      <div className="relative z-1 mt-8">
                        {item.tech.length ? (
                          <>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">
                              Technology
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.tech.map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>

                    {/* Right — nội dung case */}
                    <div className="flex min-w-0 flex-1 flex-col gap-6 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                      <div>
                        <p className="text-sm leading-relaxed text-text-gray lg:text-[15px]">
                          {item.desc}
                        </p>

                        {item.features?.length ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.features.map((feature) => (
                              <span key={feature} className="tag">
                                {feature}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <BlockTitle>Bài toán</BlockTitle>
                          <p className="mt-2 text-sm leading-relaxed text-text-gray">
                            {item.problem}
                          </p>
                        </div>

                        <div>
                          <BlockTitle>DVL Tech tham gia</BlockTitle>
                          <ul className="mt-2 flex flex-col gap-1.5">
                            {item.involvement.map((step) => (
                              <li
                                key={step}
                                className="flex items-start gap-2 text-sm text-text-gray"
                              >
                                <span
                                  aria-hidden
                                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-light"
                                />
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {item.result ? (
                        <div className="rounded-2xl bg-primary/5 p-4 sm:p-5">
                          <BlockTitle>Kết quả</BlockTitle>
                          <p className="mt-2 text-sm leading-relaxed text-text-dark">
                            {item.result}
                          </p>
                        </div>
                      ) : null}

                      <a
                        href="#contact"
                        tabIndex={index === active ? undefined : -1}
                        className="group mt-auto inline-flex w-fit items-center gap-3 text-[15px] font-semibold text-primary transition-colors hover:text-primary-dark"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToHash("#contact");
                        }}
                      >
                        Xem Case Study
                        <ArrowActionIcon size="sm" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Controls — cố định, không trượt theo slide */}
            <div className="flex items-center justify-between gap-4 border-t border-gray-100 px-5 py-4 sm:px-8 sm:py-5 lg:px-10 lg:py-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {CASES.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActive(index)}
                      aria-label={`Xem case study ${index + 1}`}
                      aria-current={index === active ? "true" : undefined}
                      className={
                        index === active
                          ? "h-1.5 w-10 rounded-full bg-gradient-to-r from-primary-light to-primary transition-all"
                          : "h-2 w-2 rounded-full bg-gray-300 transition-all hover:bg-primary-light"
                      }
                    />
                  ))}
                </div>

                <span className="font-heading text-sm font-semibold text-gray-400">
                  <span className="text-primary">
                    {String(active + 1).padStart(2, "0")}
                  </span>
                  {` / ${String(total).padStart(2, "0")}`}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={prev}
                  disabled={isFirst}
                  aria-label="Case study trước"
                  className={navButtonClass(isFirst)}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={isLast}
                  aria-label="Case study tiếp theo"
                  className={navButtonClass(isLast)}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import Reveal from "@/components/ui/Reveal";
import { ArrowActionIcon } from "@/components/ui/ArrowActionButton";
import SectionHeader from "@/components/ui/SectionHeader";
import { scrollToHash } from "@/lib/scroll";

const CASES = [
  {
    tag: "FinTech",
    title: "UI/UX Product Experience",
    desc: "Thiết kế và phát triển toàn bộ trải nghiệm người dùng cho nền tảng FinTech hàng đầu tại châu Âu với tỉ lệ chuyển đổi tăng đáng kể.",
    tech: ["React", "Node.js", "AWS"],
    result: "40% tăng conversion rate",
    tone: "bg-gradient-to-br from-[#0b1f17] via-[#12402a] to-[#0e803f]",
  },
  {
    tag: "Healthcare",
    title: "AI Healthcare Platform",
    desc: "Xây dựng hệ thống AI hỗ trợ chẩn đoán bác sĩ tích hợp machine learning và xử lý ảnh y tế với độ chính xác cao.",
    tech: ["Python", "TensorFlow", "GCP"],
    result: "92% độ chính xác AI",
    tone: "bg-gradient-to-br from-primary-dark via-primary to-primary-light",
  },
  {
    tag: "E-Commerce",
    title: "Mobile App Builder",
    desc: "Phát triển ứng dụng di động đa nền tảng tích hợp AI recommendation engine, đạt 1M+ downloads trong 3 tháng.",
    tech: ["React Native", "Firebase", "Stripe"],
    result: "1M+ downloads",
    tone: "bg-gradient-to-br from-[#1a36a3] via-[#0e803f] to-[#055537]",
  },
  {
    tag: "Enterprise",
    title: "Digital Transformation",
    desc: "Triển khai nền tảng số hóa quy trình nội bộ cho tập đoàn lớn, tối ưu vận hành và giảm chi phí vận hành.",
    tech: ["Java", "Kubernetes", "Azure"],
    result: "35% giảm chi phí vận hành",
    tone: "bg-gradient-to-br from-[#033d28] via-[#08904d] to-[#4dd15f]",
  },
];

export default function CaseStudiesSection() {
  return (
    <section id="case-studies" className="section section--white">
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

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          {CASES.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <article className="group card card--interactive overflow-hidden !p-0">
                <div
                  className={`relative h-[180px] overflow-hidden sm:h-[220px] ${item.tone} transition-transform duration-500 group-hover:scale-[1.02]`}
                >
                  <div className="absolute inset-0 bg-black/15" />
                  <span className="badge badge--primary absolute left-4 top-4 !bg-primary/85 !text-white">
                    {item.tag}
                  </span>
                </div>

                <div className="flex flex-col gap-3 p-5 sm:p-8">
                  <h3 className="text-lg font-semibold text-text-dark transition-colors hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-gray">{item.desc}</p>

                  <div className="badge badge--primary w-fit">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path
                        d="M2 9L5.5 5.5L8 8L12 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    {item.result}
                  </div>

                  <div className="mt-1 flex flex-wrap gap-2">
                    {item.tech.map((tech) => (
                      <span key={tech} className="tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

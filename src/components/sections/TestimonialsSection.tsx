"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";
import Reveal from "@/components/ui/Reveal";

const TESTIMONIALS = [
  {
    paragraphs: [
      "When we assigned comprehensive quality evaluation to Mura System, I was also consulted through a third party. We appreciate Mura System's proactive approach and effective communication, and that they realized user-oriented system quality design and met our requirements.",
      "We will continue to leverage their talents and technology in our future projects with high expectations for their support. Mura System is a trusted partner, and I highly recommend their excellent service and team. / We are very satisfied with Mura System's services.",
    ],
    name: "Mr. Takeyama Kazuyuki, Manager",
    company: "Systena Corporation, Japan",
    logoSrc: "/images/bg/systena.png",
  },
  {
    paragraphs: [
      "Mura Solution's engineering team demonstrated exceptional expertise and always met deadlines. They truly understand our business and propose innovative solutions that deliver measurable results.",
      "Their collaborative approach and transparent communication made the entire engagement smooth and productive. We look forward to continuing our partnership on future initiatives.",
    ],
    name: "Sarah Johnson, VP Engineering",
    company: "Unqork, United States",
    logoSrc: "/images/bg/systena.png",
  },
  {
    paragraphs: [
      "We have partnered with Mura Solution for over three years, and every project has exceeded our expectations. The quality of their code and professional delivery process is outstanding.",
      "They consistently bring strong technical leadership and reliable execution. Mura Solution is a partner we trust for complex, mission-critical software development.",
    ],
    name: "Michael Torres, Director of Technology",
    company: "Ness, Global",
    logoSrc: "/images/bg/systena.png",
  },
];

const DOT_GRID =
  "radial-gradient(circle at center, rgba(13,138,67,0.10) 1px, transparent 1px)";

function OpenQuoteIcon() {
  return (
    <svg
      width="72"
      height="56"
      viewBox="0 0 72 56"
      fill="none"
      aria-hidden
      className="text-primary-light/50"
    >
      <path
        d="M0 56V34C0 22 5 13 16 6L18 10C12 14 9 19 9 24H16V56H0ZM32 56V34C32 22 37 13 48 6L50 10C44 14 41 19 41 24H48V56H32Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CloseQuoteDecor() {
  return (
    <svg
      width="120"
      height="96"
      viewBox="0 0 120 96"
      fill="none"
      aria-hidden
      className="pointer-events-none absolute bottom-4 right-4 hidden text-gray-200 sm:block lg:bottom-6 lg:right-8"
    >
      <path
        d="M40 96V62C40 44 48 30 64 20L68 26C58 32 52 40 52 50H64V96H40ZM88 96V62C88 44 96 30 112 20L116 26C106 32 100 40 100 50H112V96H88Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const total = TESTIMONIALS.length;
  const isFirst = active === 0;
  const isLast = active === total - 1;

  const prev = () => {
    if (!isFirst) setActive((current) => current - 1);
  };

  const next = () => {
    if (!isLast) setActive((current) => current + 1);
  };

  const navButtonClass = (disabled: boolean) =>
    [
      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
      disabled
        ? "cursor-not-allowed border-gray-200 text-gray-300"
        : "border-primary text-primary hover:bg-primary/5",
    ].join(" ");

  const current = TESTIMONIALS[active];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-12 sm:py-14 lg:py-16"
      style={{
        background: "linear-gradient(180deg, #f4fbf7 0%, #e7f4ed 100%)",
      }}
    >
      {/* texture + glows that lift the band off the white sections around it */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ backgroundImage: DOT_GRID, backgroundSize: "22px 22px" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary-pale/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 hidden -translate-x-1/2 text-[16rem] font-bold leading-none text-primary/5 lg:block"
        style={{ fontFamily: "Georgia, serif" }}
      >
        &ldquo;
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <Reveal>
          <header className="mx-auto mb-8 max-w-[820px] text-center sm:mb-10 lg:mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/12 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-light" />
              Testimonials
            </span>
            <h2 className="mt-4 font-heading text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight text-primary">
              Khách hàng nói gì về DVL Tech
            </h2>
          </header>
        </Reveal>

        <Reveal>
          {/* hairline ring around the card */}
          <div className="relative rounded-[1.6rem] bg-gradient-to-br from-white via-primary-light/25 to-white p-px shadow-[0_28px_70px_rgba(5,85,55,0.16)] sm:rounded-[2.1rem] lg:rounded-[2.6rem]">
              <div className="relative z-1 flex min-h-0 flex-col overflow-hidden rounded-[1.55rem] bg-white sm:rounded-[2.05rem] lg:min-h-[400px] lg:flex-row lg:rounded-[2.55rem]">
                {/* Left — who is speaking */}
                <aside className="relative flex w-full shrink-0 flex-col justify-end overflow-hidden bg-gradient-primary-lime px-5 py-8 sm:px-8 sm:py-10 lg:w-[34%] lg:px-10 lg:py-12 xl:px-12">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/40 blur-2xl"
                  />
                  <div className="absolute left-5 top-5 scale-75 sm:left-8 sm:top-8 sm:scale-100 lg:left-10 lg:top-10">
                    <OpenQuoteIcon />
                  </div>

                  <div className="relative z-1 mt-16 flex flex-col items-start sm:mt-20 lg:mt-24">
                    {current.logoSrc ? (
                      <span className="mb-5 inline-flex items-center rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_rgba(13,138,67,0.14)] ring-1 ring-primary/8">
                        <Image
                          src={current.logoSrc}
                          alt={current.company}
                          width={140}
                          height={40}
                          className="h-7 w-auto object-contain"
                        />
                      </span>
                    ) : null}

                    <p className="font-heading text-lg font-bold leading-tight text-primary-dark lg:text-xl">
                      {current.name}
                    </p>
                    <span
                      aria-hidden
                      className="my-2.5 block h-0.5 w-8 rounded-full bg-primary-light"
                    />
                    <p className="text-sm text-text-gray lg:text-[15px]">
                      {current.company}
                    </p>
                  </div>
                </aside>

              {/* Right — carousel */}
              <div className="relative flex min-w-0 flex-1 flex-col bg-white">
                <div className="relative flex-1 overflow-hidden">
                  <div
                    className="flex h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${active * 100}%)` }}
                  >
                    {TESTIMONIALS.map((item) => (
                      <article
                        key={item.name}
                        className="flex w-full shrink-0 flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10"
                      >
                        <div className="relative flex flex-1 flex-col justify-center gap-4 pr-0 sm:gap-5 sm:pr-4">
                          {item.paragraphs.map((paragraph) => (
                            <p
                              key={paragraph.slice(0, 32)}
                              className="text-sm leading-[1.75] text-text-dark sm:text-[15px] lg:text-base"
                            >
                              {paragraph}
                            </p>
                          ))}

                          <CloseQuoteDecor />
                        </div>
                      </article>
                    ))}
                  </div>
              </div>

              {/* Controls — fixed, không slide */}
              <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 sm:px-8 sm:py-5 lg:px-12 lg:py-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {TESTIMONIALS.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActive(index)}
                        aria-label={`Go to testimonial ${index + 1}`}
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
                    aria-label="Previous testimonial"
                    className={navButtonClass(isFirst)}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    disabled={isLast}
                    aria-label="Next testimonial"
                    className={navButtonClass(isLast)}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>
          <div className="absolute -bottom-20 left-0 h-40 w-full opacity-60">
            <img
              src="/images/bg/shadow.png"
              alt=""
              className="h-full w-full"
              aria-hidden
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { t } from "@/lib/i18n/format";

type TestimonialId = keyof Dictionary["testimonials"]["items"];

/** Thứ tự hiển thị + logo; lời chứng thực lấy theo id từ dictionary. */
const TESTIMONIALS: { id: TestimonialId; logoSrc: string }[] = [
  { id: "systena", logoSrc: "/images/bg/systena.png" },
  { id: "unqork", logoSrc: "/images/bg/systena.png" },
  { id: "ness", logoSrc: "/images/bg/systena.png" },
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

export default function TestimonialsSection({
  dict,
}: {
  dict: Dictionary["testimonials"];
}) {
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
  const currentCopy = dict.items[current.id];

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
          <SectionHeader
            eyebrow={dict.eyebrow}
            title={
              <>
                {dict.titleBefore}
                <span className="text-accent">{dict.titleAccent}</span>
              </>
            }
          />
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
                          alt={currentCopy.company}
                          width={140}
                          height={40}
                          className="h-7 w-auto object-contain"
                        />
                      </span>
                    ) : null}

                    <p className="font-heading text-lg font-bold leading-tight text-primary-dark lg:text-xl">
                      {currentCopy.name}
                    </p>
                    <span
                      aria-hidden
                      className="my-2.5 block h-0.5 w-8 rounded-full bg-primary-light"
                    />
                    <p className="text-sm text-text-gray lg:text-[15px]">
                      {currentCopy.company}
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
                        key={item.id}
                        className="flex w-full shrink-0 flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10"
                      >
                        <div className="relative flex flex-1 flex-col justify-center gap-4 pr-0 sm:gap-5 sm:pr-4">
                          {dict.items[item.id].paragraphs.map((paragraph) => (
                            <p
                              key={paragraph.slice(0, 32)}
                              className="text-sm leading-[1.75] text-text-dark sm:text-[15px] lg:text-base"
                            >
                              {paragraph}
                            </p>
                          ))}

                          {/* <CloseQuoteDecor /> */}
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
                        aria-label={t(dict.goTo, { index: index + 1 })}
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
                    aria-label={dict.previous}
                    className={navButtonClass(isFirst)}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    disabled={isLast}
                    aria-label={dict.next}
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

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";

export type CertItem = {
  id: string;
  /** LUÔN là tiếng Anh, không dịch */
  name: string;
  src: string;
  /** mô tả đầy đủ, đã dịch theo ngôn ngữ đang xem */
  detail: string;
};

type Labels = {
  prev: string;
  next: string;
  goToPage: string;
};

/** Số hàng của lưới — phải khớp với `grid-rows-2` bên dưới */
const ROWS = 2;
/** Số cột nhìn thấy ở mỗi breakpoint — phải khớp với các lớp `auto-cols-*` bên dưới */
const COLS_PER_VIEW = { base: 2, sm: 3, lg: 4 } as const;

function CertCard({ item }: { item: CertItem }) {
  return (
    <article
      // tabIndex để bàn phím và thiết bị cảm ứng (không có hover) vẫn mở được phần mô tả
      tabIndex={0}
      aria-label={item.name}
      aria-describedby={`cert-detail-${item.id}`}
      className="group flex h-full w-full cursor-pointer snap-start flex-col overflow-hidden rounded-2xl shadow-[0_10px_28px_rgba(14,128,63,0.1)] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="relative z-10 bg-white px-4 pt-6 sm:px-5 sm:pt-8">
        <div className="mx-auto mb-1 flex h-[80px] w-full items-center justify-center sm:h-[96px] lg:h-[110px]">
          <Image
            src={item.src}
            alt={item.name}
            width={160}
            height={110}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
            className="h-16 w-auto max-w-full object-contain sm:h-20 lg:h-[88px]"
          />
        </div>

        {/* Mô tả chi tiết hiện đè lên vùng logo.
            Cố ý KHÔNG dùng tooltip nổi ra ngoài thẻ: track của slider có overflow-x nên
            mọi thứ tràn ra khỏi khung đều bị cắt. */}
        <div
          id={`cert-detail-${item.id}`}
          role="tooltip"
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-primary-dark/95 px-3 text-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:px-4"
        >
          <p className="text-[11px] font-medium leading-snug text-white sm:text-xs">
            {item.detail}
          </p>
        </div>

        <div
          className="pointer-events-none absolute -bottom-5 left-1/2 z-30 h-10 w-[125%] -translate-x-1/2 rounded-[100%] bg-white shadow-[0_10px_18px_rgba(0,0,0,0.06)]"
          aria-hidden
        />
      </div>

      <div className="relative flex min-h-[64px] flex-1 items-center justify-center bg-[#edf7f0] px-3 pb-5 pt-9 sm:min-h-[72px] sm:pb-6 sm:pt-10">
        <p className="text-center text-xs font-medium leading-snug text-text-dark sm:text-sm">
          {item.name}
        </p>
      </div>
    </article>
  );
}

export default function CertificationsSlider({
  items,
  labels,
}: {
  items: CertItem[];
  labels: Labels;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(0);

  /*
   * Đệm cho tròn trang.
   *
   * Track là một vùng cuộn, nên vị trí cuộn tối đa luôn bị chặn ở `scrollWidth - clientWidth`.
   * Khi tổng số cột không chia hết cho số cột hiển thị, trang cuối bị kéo ngược lại và lặp
   * lại các thẻ của trang trước: 12 chứng chỉ = 6 cột, xem 4 cột/trang thì "trang 2" hiện
   * cột 3-6, tức 4 thẻ đầu bị trùng.
   *
   * Thêm cột trống vào cuối cho tổng số cột chia hết -> trang cuối rơi đúng vào thẻ tiếp
   * theo, không thẻ nào xuất hiện hai lần. Tính ở đây (không phải trong effect) nên server
   * và client cho kết quả giống hệt, không lệch khi hydrate.
   */
  const columns = Math.ceil(items.length / ROWS);
  const padFor = (perView: number) => (perView - (columns % perView)) % perView;
  const pad = {
    base: padFor(COLS_PER_VIEW.base),
    sm: padFor(COLS_PER_VIEW.sm),
    lg: padFor(COLS_PER_VIEW.lg),
  };
  const spacerColumns = Math.max(pad.base, pad.sm, pad.lg);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;

    const pages = Math.max(1, Math.round(el.scrollWidth / el.clientWidth));
    setPageCount(pages);
    setPage(Math.min(pages - 1, Math.round(el.scrollLeft / el.clientWidth)));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // ResizeObserver bắn ngay lần observe đầu tiên nên lo luôn phép đo ban đầu —
    // không cần gọi sync() thẳng trong thân effect (gây cascading render).
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    el.addEventListener("scroll", sync, { passive: true });

    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", sync);
    };
  }, [sync]);

  const goToPage = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  const atStart = page <= 0;
  const atEnd = page >= pageCount - 1;

  const navClass = (disabled: boolean) =>
    [
      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
      disabled
        ? "cursor-not-allowed border-gray-200 text-gray-300"
        : "border-primary text-primary hover:bg-primary/5",
    ].join(" ");

  // Cột đệm chỉ xuất hiện ở breakpoint thực sự cần. `display:none` thì phần tử không còn
  // là grid item nên không chiếm cột — nhờ vậy một markup phục vụ được cả ba breakpoint.
  const spacerClass = (index: number) =>
    [
      index < pad.base ? "block" : "hidden",
      index < pad.sm ? "sm:block" : "sm:hidden",
      index < pad.lg ? "lg:block" : "lg:hidden",
    ].join(" ");

  return (
    <div>
      {/*
        Grid cuộn ngang: grid-flow-col + grid-rows-2 xếp thẻ theo cột nên vẫn giữ bố cục
        2 hàng, còn auto-cols tính theo % chiều rộng khung nhìn nên số thẻ mỗi trang tự
        đổi theo breakpoint mà không cần đo bằng JS.
        Công thức bề rộng cột: 100%/N - gap*(N-1)/N.
      */}
      <div
        ref={trackRef}
        className="no-scrollbar grid snap-x snap-mandatory auto-cols-[calc(50%-6px)] grid-flow-col grid-rows-2 gap-3 overflow-x-auto py-2 sm:auto-cols-[calc(33.333%-10.667px)] sm:gap-4 lg:auto-cols-[calc(25%-15px)] lg:gap-5"
      >
        {items.map((item) => (
          <CertCard key={item.id} item={item} />
        ))}

        {Array.from({ length: spacerColumns }).flatMap((_, columnIndex) =>
          Array.from({ length: ROWS }).map((__, rowIndex) => (
            <div
              key={`spacer-${columnIndex}-${rowIndex}`}
              aria-hidden
              className={spacerClass(columnIndex)}
            />
          )),
        )}
      </div>

      {pageCount > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={atStart}
            aria-label={labels.prev}
            className={navClass(atStart)}
          >
            <ChevronLeftIcon />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pageCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToPage(index)}
                aria-label={labels.goToPage.replace("{n}", String(index + 1))}
                aria-current={index === page ? "true" : undefined}
                className={[
                  "h-2.5 rounded-full transition-all",
                  index === page ? "w-7 bg-primary" : "w-2.5 bg-gray-300 hover:bg-gray-400",
                ].join(" ")}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={atEnd}
            aria-label={labels.next}
            className={navClass(atEnd)}
          >
            <ChevronRightIcon />
          </button>
        </div>
      ) : null}
    </div>
  );
}

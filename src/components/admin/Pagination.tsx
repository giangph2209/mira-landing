import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const linkClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-text-dark transition-colors hover:border-primary hover:text-primary";
const disabledClass =
  "inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm font-medium text-gray-300";

/** Phân trang keyset — không dùng OFFSET nên không có khái niệm "trang số N" */
export default function Pagination({
  prevHref,
  nextHref,
  summary,
}: {
  prevHref: string | null;
  nextHref: string | null;
  summary?: string;
}) {
  if (!prevHref && !nextHref && !summary) return null;

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-xs text-text-gray">{summary}</p>
      <div className="flex gap-2">
        {prevHref ? (
          <Link href={prevHref} className={linkClass}>
            <ChevronLeft size={16} aria-hidden />
            Trước
          </Link>
        ) : (
          <span className={disabledClass}>
            <ChevronLeft size={16} aria-hidden />
            Trước
          </span>
        )}

        {nextHref ? (
          <Link href={nextHref} className={linkClass}>
            Sau
            <ChevronRight size={16} aria-hidden />
          </Link>
        ) : (
          <span className={disabledClass}>
            Sau
            <ChevronRight size={16} aria-hidden />
          </span>
        )}
      </div>
    </div>
  );
}

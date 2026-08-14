"use client";

import { useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { inputClassSm } from "@/components/ui/form-classes";

export type FilterOption = { value: string; label: string };

export type FilterConfig = {
  key: string;
  label: string;
  options: FilterOption[];
};

/**
 * Bộ lọc + tìm kiếm ghi thẳng vào searchParams, nên trang danh sách vẫn là server
 * component đọc dữ liệu trực tiếp từ DB — không cần state phía client hay API riêng.
 */
export default function FilterBar({
  filters,
  searchPlaceholder = "Tìm kiếm...",
}: {
  filters: FilterConfig[];
  searchPlaceholder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(currentQuery);
  const [syncedQuery, setSyncedQuery] = useState(currentQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Đồng bộ khi URL đổi từ bên ngoài (ví dụ bấm back). Chỉnh state ngay trong lúc render
  // theo đúng khuyến nghị của React — dùng useEffect ở đây sẽ tạo thêm một lượt render thừa.
  if (currentQuery !== syncedQuery) {
    setSyncedQuery(currentQuery);
    setQuery(currentQuery);
  }

  const apply = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("cursor");
    params.delete("page");
    mutate(params);
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  const onQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      apply((params) => {
        if (value.trim()) params.set("q", value.trim());
        else params.delete("q");
      });
    }, 350);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative min-w-0 flex-1 sm:max-w-xs">
        <Search
          size={16}
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className={`${inputClassSm} pl-9`}
        />
      </div>

      {filters.map((filter) => (
        <label key={filter.key} className="flex items-center gap-2 text-xs text-text-gray">
          <span className="whitespace-nowrap font-semibold">{filter.label}</span>
          <select
            value={searchParams.get(filter.key) ?? ""}
            onChange={(event) =>
              apply((params) => {
                if (event.target.value) params.set(filter.key, event.target.value);
                else params.delete(filter.key);
              })
            }
            className={`${inputClassSm} w-auto min-w-[140px]`}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}

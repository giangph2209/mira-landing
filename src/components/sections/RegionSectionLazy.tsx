"use client";

import dynamic from "next/dynamic";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const RegionSection = dynamic(() => import("@/components/sections/RegionSection"), {
  ssr: false,
  // giữ id để anchor "#region" và scroll spy hoạt động ngay cả khi chunk chưa tải xong
  loading: () => <div id="region" className="min-h-[320px] bg-white" aria-hidden />,
});

export default function RegionSectionLazy({
  dict,
}: {
  dict: Dictionary["region"];
}) {
  return <RegionSection dict={dict} />;
}

"use client";

import dynamic from "next/dynamic";

const RegionSection = dynamic(() => import("@/components/sections/RegionSection"), {
  ssr: false,
  loading: () => <div className="min-h-[320px] bg-white" aria-hidden />,
});

export default function RegionSectionLazy() {
  return <RegionSection />;
}

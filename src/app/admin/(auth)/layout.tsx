import Image from "next/image";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";

export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-light px-5 py-12">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/brand/logo-brand.png"
            alt={SITE.name}
            width={160}
            height={48}
            priority
            className="h-auto w-36 object-contain"
          />
        </div>
        {children}
      </div>
    </div>
  );
}

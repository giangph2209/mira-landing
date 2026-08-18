import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { t } from "@/lib/i18n/format";

const PARTNERS = [
  { name: "Sorare", src: "/svg/storage.svg", width: 120, height: 32 },
  { name: "Visa", src: "/svg/visa.svg", width: 80, height: 32 },
  { name: "Ness", src: "/svg/ness.svg", width: 90, height: 32 },
  { name: "SafetyWing", src: "/svg/safety-wing.svg", width: 140, height: 32 },
  { name: "Unqork", src: "/svg/unqork.svg", width: 110, height: 32 },
];

export default function PartnersSection({ dict }: { dict: Dictionary["partners"] }) {
  return (
    <section className="bg-white py-8 md:border-y md:border-gray-100">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-8 md:gap-10">
            {PARTNERS.map((partner) => (
              <div key={partner.name} className="flex min-w-25 flex-1 items-center justify-center">
                <Image
                  src={partner.src}
                  alt={t(dict.logoAlt, { name: partner.name })}
                  width={partner.width}
                  height={partner.height}
                  className="h-auto w-auto object-contain"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

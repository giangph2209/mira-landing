import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";

const CERTS = [
  {
    id: "1",
    name: "Cisco Certified CCNA",
    src: "/images/certifications/1.png",
  },
  {
    id: "2",
    name: "CompTIA A+",
    src: "/images/certifications/2.png",
  },
  {
    id: "3",
    name: "PMI Registered Education Provider",
    src: "/images/certifications/3.png",
  },
  {
    id: "4",
    name: "CompTIA Security+",
    src: "/images/certifications/4.png",
  },
  // {
  //   id: "5",
  //   name: "Microsoft Certified Technology Specialist",
  //   src: "/images/certifications/5.png",
  // },
];

function CertCard({ name, src }: { name: string; src: string }) {
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-2xl shadow-[0_10px_28px_rgba(14,128,63,0.1)]">
      <div className="relative z-10 bg-white px-4 pt-6 sm:px-5 sm:pt-8">
        <div className="mx-auto mb-1 flex h-[80px] w-full items-center justify-center sm:h-[96px] lg:h-[110px]">
          <Image
            src={src}
            alt={name}
            width={160}
            height={96}
            className="h-16 w-auto max-w-full object-contain sm:h-20"
          />
        </div>
        <div
          className="pointer-events-none absolute -bottom-5 left-1/2 h-10 w-[125%] -translate-x-1/2 rounded-[100%] bg-white shadow-[0_10px_18px_rgba(0,0,0,0.06)]"
          aria-hidden
        />
      </div>

      <div className="relative flex min-h-[64px] items-center justify-center bg-[#edf7f0] px-3 pb-5 pt-9 sm:min-h-[72px] sm:pb-6 sm:pt-10">
        <p className="text-center text-xs font-medium leading-snug text-text-dark sm:text-sm">
          {name}
        </p>
      </div>
    </article>
  );
}

export default function CertificationsSection() {
  return (
    <section id="certifications" className="bg-[#f5f6f5] py-14 lg:py-16">
      <div className="mx-auto w-full max-w-7xl section-container">
        <Reveal>
          <SectionHeader eyebrow="Credentials" title="Certifications" />
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-4 lg:gap-5">
          {CERTS.map((cert, i) => (
            <Reveal key={cert.id} delay={i * 50}>
              <CertCard name={cert.name} src={cert.src} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

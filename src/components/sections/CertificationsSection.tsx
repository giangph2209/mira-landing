import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import CertificationsSlider from "@/components/sections/CertificationsSlider";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type CertDetailKey = keyof Dictionary["certifications"]["details"];

/**
 * Tên chứng chỉ CỐ Ý để cứng ở đây thay vì đưa vào file ngôn ngữ: đây là tên riêng của
 * chứng chỉ, luôn hiển thị bằng tiếng Anh ở mọi ngôn ngữ. Chỉ phần mô tả chi tiết
 * (hiện khi rê chuột) mới được dịch — xem `certifications.details` trong dictionaries.
 */
const CERTS: { id: CertDetailKey; name: string; src: string }[] = [
  { id: "aws", name: "Amazon Associate", src: "/images/certifications/aws.webp" },
  { id: "java", name: "OCA / OCP Java SE", src: "/images/certifications/java.webp" },
  { id: "mongodb", name: "MongoDB", src: "/images/certifications/mongodb.webp" },
  { id: "n2", name: "N2 Japanese", src: "/images/certifications/n2.webp" },
  {
    id: "gcp",
    name: "Professional Cloud Developer",
    src: "/images/certifications/google.webp",
  },
  { id: "openstack", name: "COA", src: "/images/certifications/openstack.webp" },
  { id: "acp", name: "PMI-ACP", src: "/images/certifications/acp.webp" },
  { id: "oci", name: "OCI", src: "/images/certifications/oci.webp" },
  { id: "istqb", name: "ISTQB Foundation", src: "/images/certifications/istqb.webp" },
  {
    id: "istqbAdvanced",
    name: "ISTQB Advanced",
    src: "/images/certifications/istqb-advanced.webp",
  },
  { id: "nng", name: "NN/g UX Certified", src: "/images/certifications/ux.webp" },
  { id: "googleUx", name: "Google UX Design", src: "/images/certifications/ux-google.webp" },
];

export default function CertificationsSection({
  dict,
}: {
  dict: Dictionary["certifications"];
}) {
  const items = CERTS.map((cert) => ({
    ...cert,
    detail: dict.details[cert.id],
  }));

  return (
    <section id="certifications" className="bg-[#f5f6f5] py-14 lg:py-16">
      <div className="mx-auto w-full max-w-7xl section-container">
        <Reveal>
          <SectionHeader eyebrow={dict.eyebrow} title={dict.title} />
        </Reveal>

        <Reveal delay={80}>
          <CertificationsSlider
            items={items}
            labels={{ prev: dict.prev, next: dict.next, goToPage: dict.goToPage }}
          />
        </Reveal>
      </div>
    </section>
  );
}

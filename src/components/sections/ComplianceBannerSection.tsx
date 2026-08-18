import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowRightIcon } from "@/components/ui/Icons";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { t } from "@/lib/i18n/format";
import { SITE } from "@/lib/site";

export default function ComplianceBannerSection({
  dict,
}: {
  dict: Dictionary["compliance"];
}) {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl section-container">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[24px] border border-gray-200/80 bg-cover bg-center bg-no-repeat px-5 py-10 text-center sm:rounded-[28px] sm:px-10 sm:py-14 lg:rounded-[36px] lg:py-30"
            style={{ backgroundImage: "url(/images/bg/meet-bg.webp)" }}
          >
            <div className="relative z-1 mx-auto flex max-w-180 flex-col items-center">
              <SectionHeader
                className="!mb-0"
                title={
                  <>
                    {dict.titleLine1}
                    <br />
                    {dict.titleLine2Before}
                    <span className="text-accent">{dict.titleLine2Accent}</span>
                  </>
                }
                description={t(dict.description, { name: SITE.name })}
              />

              <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Button href="#contact" size="lg" className="w-full sm:w-auto" iconRight={<ArrowRightIcon size={18} />}>
                  {dict.ctaPrimary}
                </Button>
                <Button href="#contact" variant="outline" size="lg" className="w-full sm:w-auto">
                  {dict.ctaSecondary}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

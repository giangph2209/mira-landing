import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { SITE } from "@/lib/site";

export default function ComplianceBannerSection() {
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
                    Meet compliance requirements.
                    <br />
                    Build <span className="text-accent">smarter trust.</span>
                  </>
                }
                description={
                  <>
                    Use {SITE.name}&apos;s flexible building blocks to keep your
                    customers&apos; data secure and compliant at all times.
                  </>
                }
              />

              <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Button href="#contact" size="lg" className="w-full sm:w-auto" iconRight={<ArrowRightIcon size={18} />}>
                  Request a demo
                </Button>
                <Button href="#contact" variant="outline" size="lg" className="w-full sm:w-auto">
                  Call for us
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

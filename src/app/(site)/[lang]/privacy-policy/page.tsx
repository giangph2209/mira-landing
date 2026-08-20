import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, HTML_LANG, LOCALES, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { t } from "@/lib/i18n/format";
import { SITE } from "@/lib/site";

type PageParams = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return {
    title: dict.privacy.title,
    alternates: {
      canonical: `/${lang}/privacy-policy`,
      languages: {
        ...Object.fromEntries(
          LOCALES.map((l) => [HTML_LANG[l], `/${l}/privacy-policy`]),
        ),
        "x-default": `/${DEFAULT_LOCALE}/privacy-policy`,
      },
    },
  };
}

const BODY = "text-sm md:text-base text-[#1F2933]";
const HEADING = "text-xl font-semibold text-[#0B1F4A]";
const LIST = "list-disc pl-6 space-y-1 text-sm md:text-base text-[#1F2933]";

function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="space-y-4 mt-8">
      <h2 className={HEADING}>{heading}</h2>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className={LIST}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function PrivacyPolicyPage({ params }: PageParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const { privacy } = await getDictionary(lang);

  // Trang này trước đây ghi tên công ty khác hẳn ("DCSoftware — Digital Century
  // Software"), sót lại từ dự án landing cũ. Giờ lấy thẳng từ SITE để không bao giờ
  // lệch với phần còn lại của site nữa.
  const company = SITE.name;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-[#0B1F4A] mb-2">
          {privacy.title}
        </h1>
        <p className="text-sm text-[#64748B] mb-8">{privacy.lastUpdated}</p>

        {/* Tên công ty in đậm như bản gốc, nên tách chuỗi quanh {company} thay vì
            nội suy thẳng — cách này giữ được thẻ <strong> mà vẫn cho người dịch tự
            do đặt tên công ty ở bất kỳ vị trí nào trong câu. */}
        <p className={`${BODY} mb-4`}>
          {privacy.intro.split("{company}").map((part, index) => (
            <span key={index}>
              {index > 0 ? <strong>{company}</strong> : null}
              {part}
            </span>
          ))}
        </p>

        <Section heading={privacy.collect.heading}>
          <p className={BODY}>{privacy.collect.intro}</p>
          <Bullets items={privacy.collect.items} />
        </Section>

        <Section heading={privacy.purpose.heading}>
          <p className={BODY}>{privacy.purpose.intro}</p>
          <Bullets items={privacy.purpose.items} />
        </Section>

        <Section heading={privacy.sharing.heading}>
          <p className={BODY}>
            {t(privacy.sharing.noSellBefore, { company })}
            <strong>{privacy.sharing.noSellStrong}</strong>
            {privacy.sharing.noSellAfter}
          </p>
          <p className={BODY}>{privacy.sharing.casesIntro}</p>
          <Bullets items={privacy.sharing.items} />
        </Section>

        <Section heading={privacy.security.heading}>
          <p className={BODY}>{privacy.security.intro}</p>
          <Bullets items={privacy.security.items} />
          <p className={BODY}>{privacy.security.caveat}</p>
        </Section>

        <Section heading={privacy.cookies.heading}>
          <p className={BODY}>{privacy.cookies.intro}</p>
          <ul className={LIST}>
            {/* Tên cookie là định danh kỹ thuật, khớp VISITOR_COOKIE/SESSION_COOKIE
                trong src/lib/analytics/cookies.ts — không dịch. */}
            <li>
              <span className="font-mono text-xs">mira_vid</span> —{" "}
              {privacy.cookies.visitorCookie}
            </li>
            <li>
              <span className="font-mono text-xs">mira_sid</span> —{" "}
              {privacy.cookies.sessionCookie}
            </li>
          </ul>
          <p className={BODY}>{privacy.cookies.tracked}</p>
          <p className={BODY}>{privacy.cookies.retention}</p>
        </Section>

        <Section heading={privacy.thirdParty.heading}>
          <p className={BODY}>{t(privacy.thirdParty.body, { company })}</p>
        </Section>

        <Section heading={privacy.rights.heading}>
          <p className={BODY}>{privacy.rights.intro}</p>
          <Bullets items={privacy.rights.items} />
        </Section>

        <Section heading={privacy.contactSection.heading}>
          <p className={BODY}>{privacy.contactSection.intro}</p>
          <ul className={LIST}>
            <li>
              {privacy.contactSection.company}: {SITE.legalName}
            </li>
            <li>
              {privacy.contactSection.email}: {SITE.email}
            </li>
            <li>
              {privacy.contactSection.phone}: {SITE.phone}
            </li>
            <li>
              {privacy.contactSection.address}: {SITE.address.full}
            </li>
          </ul>
        </Section>

        <p className={`mt-10 ${BODY}`}>{t(privacy.updates, { company })}</p>
      </div>
    </main>
  );
}

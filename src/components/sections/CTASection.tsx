"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import { ArrowRightIcon } from "@/components/ui/Icons";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { inputClass, labelClass } from "@/components/ui/form-classes";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { SITE } from "@/lib/site";

type ContactId = keyof Dictionary["cta"]["contact"];
type ServiceId = keyof Dictionary["cta"]["serviceOptions"];

const CONTACT_ITEMS: { id: ContactId; value: string; Icon: typeof Mail }[] = [
  { id: "email", value: SITE.email, Icon: Mail },
  { id: "phone", value: SITE.phone, Icon: Phone },
  { id: "address", value: SITE.address.full, Icon: MapPin },
];

/**
 * `value` là thứ được GỬI LÊN API và lưu vào cột ContactSubmission.serviceType,
 * còn nhãn hiển thị mới lấy từ dictionary.
 *
 * Cố ý KHÔNG gửi nhãn đã dịch: admin nhóm và lọc theo giá trị này (xem
 * listServiceTypes trong src/lib/submissions.ts), dịch nó sẽ làm cùng một dịch vụ
 * bị tách thành ba nhóm khác nhau tùy ngôn ngữ khách đang xem.
 */
const SERVICE_OPTIONS: { id: ServiceId; value: string }[] = [
  { id: "consulting", value: "Tư vấn xây dựng dự án phần mềm" },
  { id: "development", value: "Phát triển phần mềm" },
  { id: "integration", value: "Tích hợp hệ thống" },
  { id: "maintenance", value: "Bảo trì & vận hành" },
  { id: "techAdvisory", value: "Tư vấn công nghệ" },
  { id: "other", value: "Khác" },
];

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  serviceType: string;
  message: string;
};

type SubmitStatus = {
  type: "success" | "error";
  message: string;
} | null;

export default function CTASection({ dict }: { dict: Dictionary["cta"] }) {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const update =
    (key: keyof FormState) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      if (submitStatus) setSubmitStatus(null);
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting || hasSubmitted) return;

    const name = form.fullName.trim();
    if (
      !name ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.serviceType ||
      !form.message.trim()
    ) {
      setSubmitStatus({
        type: "error",
        message: dict.errors.missingFields,
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setSubmitStatus({
        type: "error",
        message: dict.errors.invalidEmail,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus(null);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: form.phone.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          serviceType: form.serviceType,
          message: form.message.trim(),
        }),
      });

      // API trả message tiếng Việt cứng. Nếu hiển thị thẳng thì khách đọc bản
      // /en hay /ja sẽ thấy lỗi tiếng Việt, nên chỉ dùng statusCode và tự tra
      // chuỗi trong dictionary.
      const data = (await res.json().catch(() => null)) as {
        statusCode?: number;
      } | null;

      if (!data || data.statusCode !== 201) {
        setSubmitStatus({
          type: "error",
          message:
            data?.statusCode === 400 ? dict.errors.missingFields : dict.errors.server,
        });
        return;
      }

      setHasSubmitted(true);
      setSubmitStatus({ type: "success", message: dict.success.description });
    } catch {
      setSubmitStatus({
        type: "error",
        message: dict.errors.network,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-[#f7f8f7] py-16 lg:py-24">
      <div className="section-container mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <Reveal className="flex flex-col gap-8">
            <SectionHeader
              align="left"
              className="!mb-0 section-header--compact"
              eyebrow={dict.eyebrow}
              title={
                <>
                  {dict.titleLine1}
                  <br />
                  {/* Dòng thứ hai là lời mời hành động nên được nhấn gradient,
                      dòng đầu chỉ là câu hỏi dẫn dắt. */}
                  <span className="text-accent">{dict.titleLine2}</span>
                </>
              }
              description={dict.description}
            />

            <div className="flex flex-col gap-4">
              {CONTACT_ITEMS.map((item, index) => (
                <div
                  key={item.id}
                  className="relative flex items-center gap-4 rounded-2xl bg-white py-4 pl-5 pr-6 shadow-[0_8px_24px_rgba(14,128,63,0.08)]"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-[0_6px_16px_rgba(14,128,63,0.25)]"
                    style={{
                      background: `linear-gradient(145deg, #66c047 ${index * 10}%, #0e803f ${60 + index * 15}%)`,
                    }}
                  >
                    <item.Icon
                      className="h-5 w-5 text-white"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-primary">
                      {dict.contact[item.id]}
                    </p>
                    <p className=" text-[15px] font-semibold text-text-dark">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="flex flex-wrap items-center gap-4 pt-1">
              <span className="text-sm font-medium text-text-dark">
                Follow us
              </span>
              <div className="flex items-center gap-2.5">
                {SOCIALS.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-dark transition-colors hover:bg-primary"
                  >
                    <div
                      className="h-4 w-4 rounded-sm bg-white/35"
                      aria-hidden
                    />
                  </a>
                ))}
              </div>
            </div> */}
          </Reveal>

          <Reveal className="w-full" delay={100}>
            {hasSubmitted ? (
              <div className="rounded-[24px] bg-white p-6 text-center shadow-[0_16px_48px_rgba(14,128,63,0.1)] sm:rounded-[28px] sm:p-10 lg:p-12">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <div className="h-6 w-6 rounded bg-primary/40" aria-hidden />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary-dark">
                  {dict.success.title}
                </h3>
                <p className="mt-2 text-text-gray">
                  {submitStatus?.message || dict.success.description}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-[24px] bg-white p-5 shadow-[0_16px_48px_rgba(14,128,63,0.1)] sm:rounded-[28px] sm:p-9 lg:p-10"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      {dict.form.name} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder={dict.form.namePlaceholder}
                      value={form.fullName}
                      onChange={update("fullName")}
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>
                      {dict.form.phone} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder={dict.form.phonePlaceholder}
                      value={form.phone}
                      onChange={update("phone")}
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      {dict.form.email} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder={dict.form.emailPlaceholder}
                      value={form.email}
                      onChange={update("email")}
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-company" className={labelClass}>
                      {dict.form.company}
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      autoComplete="organization"
                      placeholder={dict.form.companyPlaceholder}
                      value={form.company}
                      onChange={update("company")}
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="contact-service" className={labelClass}>
                    {dict.form.service}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="contact-service"
                      required
                      value={form.serviceType}
                      onChange={update("serviceType")}
                      disabled={isSubmitting}
                      className={`${inputClass} appearance-none pr-11 ${
                        form.serviceType ? "" : "text-gray-400"
                      }`}
                    >
                      <option value="" disabled>
                        {dict.form.servicePlaceholder}
                      </option>
                      {SERVICE_OPTIONS.map((option) => (
                        <option
                          key={option.id}
                          value={option.value}
                          className="text-text-dark"
                        >
                          {dict.serviceOptions[option.id]}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="contact-message" className={labelClass}>
                    {dict.form.message} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    placeholder={dict.form.messagePlaceholder}
                    value={form.message}
                    onChange={update("message")}
                    disabled={isSubmitting}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-light to-primary-dark px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_28px_rgba(14,128,63,0.35)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:w-auto"
                >
                  {isSubmitting ? dict.form.submitting : dict.form.submit}
                  {!isSubmitting ? <ArrowRightIcon size={18} /> : null}
                </button>

                {submitStatus?.type === "error" ? (
                  <p
                    className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-600"
                    role="alert"
                  >
                    {submitStatus.message}
                  </p>
                ) : null}
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowRightIcon } from "@/components/ui/Icons";
import Reveal from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

const CONTACT_ITEMS = [
  { id: "email", label: "Email", value: SITE.email, iconSrc: null as string | null },
  { id: "phone", label: "Phone", value: SITE.phone, iconSrc: null },
  { id: "address", label: "Address", value: "Hanoi, Vietnam", iconSrc: null },
];

const SOCIALS = [
  { id: "github", label: "GitHub", href: "#" },
  { id: "x", label: "X", href: "#" },
  { id: "linkedin", label: "LinkedIn", href: "#" },
  { id: "slack", label: "Slack", href: "#" },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-[#f7f9f8] px-4 py-3.5 text-[15px] text-text-dark outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 disabled:opacity-60";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

type SubmitStatus = {
  type: "success" | "error";
  message: string;
} | null;

export default function CTASection() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const update =
    (key: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (submitStatus) setSubmitStatus(null);
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting || hasSubmitted) return;

    const name = `${form.firstName} ${form.lastName}`.trim();
    if (!name || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Vui lòng kiểm tra lại thông tin bắt buộc.",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setSubmitStatus({
        type: "error",
        message: "Email không hợp lệ.",
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
          message: form.message.trim(),
          serviceType: "Website inquiry",
        }),
      });

      const data = (await res.json().catch(() => null)) as {
        statusCode?: number;
        message?: string;
      } | null;

      if (!data || data.statusCode !== 201) {
        setSubmitStatus({
          type: "error",
          message: data?.message || "Đã xảy ra lỗi khi gửi yêu cầu, vui lòng thử lại sau.",
        });
        return;
      }

      setHasSubmitted(true);
      setSubmitStatus({
        type: "success",
        message: data.message || "Cảm ơn bạn đã liên hệ, chúng tôi sẽ phản hồi sớm nhất.",
      });
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Không thể kết nối tới máy chủ, vui lòng thử lại sau.",
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
            <div>
              <h2 className="font-heading text-[clamp(1.85rem,3.5vw,2.75rem)] font-bold leading-tight">
                <span className="text-primary-dark">Let&apos;s Connect &amp;</span>
                <br />
                <span className="text-primary-light">Build Something Great Together!</span>
              </h2>
              <p className="mt-4 max-w-[440px] text-[15px] leading-relaxed text-text-gray lg:text-base">
                Have a project in mind? Reach out to us and let&apos;s create something amazing!
              </p>
            </div>

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
                    {item.iconSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.iconSrc} alt="" className="h-6 w-6 object-contain" />
                    ) : (
                      <div className="h-5 w-5 rounded bg-white/40" aria-hidden />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-primary">{item.label}</p>
                    <p className="truncate text-[15px] font-semibold text-text-dark">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <span className="text-sm font-medium text-text-dark">Follow us</span>
              <div className="flex items-center gap-2.5">
                {SOCIALS.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-dark transition-colors hover:bg-primary"
                  >
                    <div className="h-4 w-4 rounded-sm bg-white/35" aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal className="w-full" delay={100}>
            {hasSubmitted ? (
              <div className="rounded-[24px] bg-white p-6 text-center shadow-[0_16px_48px_rgba(14,128,63,0.1)] sm:rounded-[28px] sm:p-10 lg:p-12">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <div className="h-6 w-6 rounded bg-primary/40" aria-hidden />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary-dark">Message sent!</h3>
                <p className="mt-2 text-text-gray">
                  {submitStatus?.message || "We usually respond within 24 hours."}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-[24px] bg-white p-5 shadow-[0_16px_48px_rgba(14,128,63,0.1)] sm:rounded-[28px] sm:p-9 lg:p-10"
              >
                <h3 className="font-heading text-2xl font-bold text-primary-dark">Send us a message</h3>
                <p className="mt-3 text-sm text-primary">
                  We usually respond within{" "}
                  <span className="font-semibold underline decoration-primary-light underline-offset-2">
                    24 hours
                  </span>
                </p>

                <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={update("firstName")}
                    disabled={isSubmitting}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={update("lastName")}
                    disabled={isSubmitting}
                    className={inputClass}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Work Email"
                    value={form.email}
                    onChange={update("email")}
                    disabled={isSubmitting}
                    className={inputClass}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={update("phone")}
                    disabled={isSubmitting}
                    className={inputClass}
                  />
                </div>

                <textarea
                  rows={5}
                  required
                  placeholder="Your Message"
                  value={form.message}
                  onChange={update("message")}
                  disabled={isSubmitting}
                  className={`${inputClass} mt-4 resize-none`}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-light to-primary-dark px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_28px_rgba(14,128,63,0.35)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:w-auto"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  {!isSubmitting ? <ArrowRightIcon size={18} /> : null}
                </button>

                {submitStatus?.type === "error" ? (
                  <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-600" role="alert">
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

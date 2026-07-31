import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = {
  "Dịch vụ": ["AI Consulting", "Staff Augmentation", "Dedicated Team", "Product Development", "QA & Testing"],
  "Công ty": ["About Us", "Our Team", "Careers", "Blog", "News"],
  "Tài nguyên": ["Case Studies", "Documentation", "Partners", "Certifications", "Privacy Policy"],
  "Liên hệ": ["Hanoi, Vietnam", "contact@muratech.com", "+123 456 7890", "Live Chat", "Support Center"],
};

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "#",
    path: "M15 2H3C2.4 2 2 2.4 2 3V15C2 15.6 2.4 16 3 16H15C15.6 16 16 15.6 16 15V3C16 2.4 15.6 2 15 2ZM6.3 13.5H4.3V7.2H6.3V13.5ZM5.3 6.3C4.7 6.3 4.2 5.8 4.2 5.2C4.2 4.6 4.7 4.1 5.3 4.1C5.9 4.1 6.4 4.6 6.4 5.2C6.4 5.8 5.9 6.3 5.3 6.3ZM14 13.5H12V10.4C12 9.5 11.5 9 10.7 9C9.9 9 9.5 9.5 9.5 10.4V13.5H7.5V7.2H9.5V8.1C9.9 7.5 10.6 7 11.5 7C13 7 14 8 14 9.9V13.5Z",
  },
  {
    label: "Twitter",
    href: "#",
    path: "M2 3L7.6 10.1L2 16H3.4L8.2 10.9L12.1 16H16.5L10.6 8.5L15.8 3H14.4L10 7.7L6.4 3H2ZM4.1 4H5.8L14.4 15H12.7L4.1 4Z",
  },
];

export default function FooterSection() {
  return (
    <footer className="bg-[#0d1f17]">
      <div className="section-container pb-8 pt-12 sm:pb-10 sm:pt-16 lg:pt-20">
        <div className="grid grid-cols-2 gap-8 border-b border-white/10 pb-10 sm:gap-10 sm:pb-12 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-5 lg:col-span-1">
            <Link href="/">
              <Image
                src="/images/brand/logo-brand.png"
                alt="Mura Tech"
                width={160}
                height={48}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/50">
              Mura Tech — trusted software implementation partner delivering AI-powered solutions globally.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50 transition-all hover:bg-primary hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d={social.path} fill="currentColor" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <h4 className="text-[13px] font-bold uppercase tracking-widest text-white">{category}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/50 transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row">
          <p className="text-[13px] text-white/30">
            © {new Date().getFullYear()} Mura Tech. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <a key={item} href="#" className="text-[13px] text-white/30 transition-colors hover:text-white/60">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

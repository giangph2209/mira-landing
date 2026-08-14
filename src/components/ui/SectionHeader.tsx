import type { ReactNode } from "react";

type SectionHeaderProps = {
  /** nhãn nhỏ dạng pill phía trên tiêu đề */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** dòng nhấn (gradient) đặt dưới mô tả */
  tagline?: ReactNode;
  align?: "center" | "left";
  /** dùng trên nền tối */
  theme?: "light" | "dark";
  /** ẩn gạch nhấn dưới tiêu đề */
  rule?: boolean;
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  tagline,
  align = "center",
  theme = "light",
  rule = true,
  className,
}: SectionHeaderProps) {
  const classes = [
    "section-header",
    align === "center" ? "section-header--center" : "section-header--left",
    theme === "dark" ? "section-header--dark" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={classes}>
      {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
      <h2 className="section-title">{title}</h2>
      {rule ? <span className="section-rule" aria-hidden /> : null}
      {description ? <p className="section-description">{description}</p> : null}
      {tagline ? <p className="section-tagline">{tagline}</p> : null}
    </header>
  );
}

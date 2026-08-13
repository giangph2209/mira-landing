import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  theme?: "light" | "dark";
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  theme = "light",
  className,
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "section-header--center" : "section-header--left";
  const themeClass = theme === "dark" ? "section-header--dark" : "";

  return (
    <div className={["section-header", alignClass, themeClass, className].filter(Boolean).join(" ")}>
      {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
      <h2 className="section-title">{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}

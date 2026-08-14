import type { ReactNode } from "react";

export default function ChartFrame({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={["admin-surface p-5", className].filter(Boolean).join(" ")}>
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-sm font-bold text-text-dark">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-text-gray">{subtitle}</p> : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

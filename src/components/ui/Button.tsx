"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { isHashHref, scrollToHash } from "@/lib/scroll";

// `gradient`: bản nhấn mạnh của primary, dùng cho CTA chính ở hero (xem .btn-gradient)
type ButtonVariant = "primary" | "gradient" | "outline" | "ghost" | "white" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
};

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
    /** hiện spinner và tự disable — dùng cho form đang submit */
    loading?: boolean;
  };

type ButtonAsLink = BaseProps & {
  href: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function buildClassName(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return ["btn", `btn-${size}`, `btn-${variant}`, className].filter(Boolean).join(" ");
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  iconRight,
  iconLeft,
  ...props
}: ButtonProps) {
  const classes = buildClassName(variant, size, className);

  if ("href" in props && props.href) {
    const { href, onClick } = props;

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (isHashHref(href)) {
        e.preventDefault();
        scrollToHash(href);
      }
      onClick?.(e);
    };

    return (
      <Link href={href} className={classes} onClick={handleClick}>
        {iconLeft}
        {children}
        {iconRight}
      </Link>
    );
  }

  const { type = "button", loading, disabled, ...buttonProps } = props as ButtonAsButton;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {loading ? <Spinner /> : iconLeft}
      {children}
      {loading ? null : iconRight}
    </button>
  );
}

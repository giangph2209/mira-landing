"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { isHashHref, scrollToHash } from "@/lib/scroll";

type ButtonVariant = "primary" | "outline" | "ghost" | "white";
type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
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

  const { type = "button", ...buttonProps } = props as ButtonAsButton;

  return (
    <button type={type} className={classes} {...buttonProps}>
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}

"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { isHashHref, scrollToHash } from "@/lib/scroll";

type ArrowActionStyleProps = {
  variant?: "default" | "inverse";
  size?: "sm" | "md";
  className?: string;
};

const VARIANT_CLASSES = {
  default:
    "text-primary group-hover:bg-primary/10 group-active:bg-primary/15 hover:bg-primary/10 active:bg-primary/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/40",
  inverse:
    "text-white group-hover:bg-white/20 group-active:bg-white/30 hover:bg-white/20 active:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50",
};

const SIZE_CLASSES = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
};

export function arrowActionClasses({
  variant = "default",
  size = "md",
  className,
}: ArrowActionStyleProps = {}) {
  return [
    "inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-200",
    "group-hover:scale-105 hover:scale-105 active:scale-95",
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

type ArrowActionIconProps = ArrowActionStyleProps;

export function ArrowActionIcon({ variant = "default", size = "md", className }: ArrowActionIconProps) {
  return (
    <span className={arrowActionClasses({ variant, size, className })} aria-hidden>
      <ArrowRightIcon size={size === "sm" ? 16 : 18} />
    </span>
  );
}

type ArrowActionButtonProps = ArrowActionStyleProps & {
  href?: string;
  "aria-label"?: string;
};

export default function ArrowActionButton({
  href = "#contact",
  variant = "default",
  size = "md",
  className,
  "aria-label": ariaLabel = "Learn more",
}: ArrowActionButtonProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isHashHref(href)) {
      e.preventDefault();
      scrollToHash(href);
    }
  };

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={arrowActionClasses({ variant, size, className })}
      onClick={handleClick}
    >
      <ArrowRightIcon size={size === "sm" ? 16 : 18} />
    </Link>
  );
}

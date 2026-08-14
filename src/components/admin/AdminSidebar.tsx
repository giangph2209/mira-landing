"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Inbox, UserRound, Users } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Tổng quan", icon: BarChart3, exact: true },
  { href: "/admin/submissions", label: "Yêu cầu liên hệ", icon: Inbox, exact: false },
  { href: "/admin/visitors", label: "Khách truy cập", icon: Users, exact: false },
  { href: "/admin/account", label: "Tài khoản", icon: UserRound, exact: false },
];

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Điều hướng quản trị">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={[
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/8 text-primary"
                : "text-text-gray hover:bg-primary/5 hover:text-primary",
            ].join(" ")}
          >
            <Icon size={18} strokeWidth={2} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

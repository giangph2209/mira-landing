"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/admin/LogoutButton";
import type { AdminUserDTO } from "@/lib/dal";
import { SITE } from "@/lib/site";

const ROLE_LABEL: Record<AdminUserDTO["role"], string> = {
  OWNER: "Chủ sở hữu",
  ADMIN: "Quản trị viên",
  VIEWER: "Chỉ xem",
};

export default function AdminShell({
  user,
  children,
}: {
  user: AdminUserDTO;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Sidebar cố định trên desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-[#e8ebe9] bg-white px-4 py-5 lg:flex">
        <Link href="/admin" className="mb-7 block px-2">
          <Image
            src="/images/dvl-logo.png"
            alt={SITE.name}
            width={160}
            height={48}
            priority
            className="h-auto w-28 object-contain"
          />
        </Link>

        <AdminSidebar />

        <div className="mt-auto border-t border-[#f1f3f2] pt-3">
          <div className="px-3 pb-2">
            <p className="truncate text-sm font-semibold text-text-dark">
              {user.name}
            </p>
            <p className="truncate text-xs text-text-gray">
              {ROLE_LABEL[user.role]}
            </p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Thanh trên cho mobile */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#e8ebe9] bg-white px-4 lg:hidden">
        <Link href="/admin">
          <Image
            src="/images/dvl-logo.png"
            alt={SITE.name}
            width={160}
            height={48}
            className="h-auto w-24 object-contain"
          />
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Mở menu quản trị"
          className="rounded-lg p-2 text-text-gray"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {menuOpen ? (
        <div className="sticky top-14 z-30 border-b border-[#e8ebe9] bg-white px-4 py-3 lg:hidden">
          <AdminSidebar onNavigate={() => setMenuOpen(false)} />
          <div className="mt-3 flex items-center justify-between border-t border-[#f1f3f2] pt-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-dark">
                {user.name}
              </p>
              <p className="truncate text-xs text-text-gray">{user.email}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      ) : null}

      <main className="px-4 py-6 sm:px-6 lg:ml-60 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}

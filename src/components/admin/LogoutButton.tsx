"use client";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";
import { logout } from "@/app/(portal)/admin/(app)/account/actions";

function Inner() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text-gray transition-colors hover:bg-[rgba(208,59,59,0.08)] hover:text-[#b32f2f] disabled:opacity-60"
    >
      <LogOut size={16} aria-hidden />
      {pending ? "Đang thoát..." : "Đăng xuất"}
    </button>
  );
}

export default function LogoutButton() {
  return (
    <form action={logout}>
      <Inner />
    </form>
  );
}

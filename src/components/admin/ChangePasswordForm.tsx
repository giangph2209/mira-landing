"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Button from "@/components/ui/Button";
import { inputClass, labelClass } from "@/components/ui/form-classes";
import {
  changePassword,
  type ChangePasswordState,
} from "@/app/admin/(app)/account/actions";

const initial: ChangePasswordState = {};

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending} className="self-start">
      Đổi mật khẩu
    </Button>
  );
}

export default function ChangePasswordForm() {
  const [state, action] = useActionState(changePassword, initial);

  return (
    <form action={action} className="flex max-w-md flex-col gap-4">
      <div>
        <label htmlFor="current-password" className={labelClass}>
          Mật khẩu hiện tại
        </label>
        <input
          id="current-password"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="new-password" className={labelClass}>
          Mật khẩu mới
        </label>
        <input
          id="new-password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-text-gray">Tối thiểu 10 ký tự.</p>
      </div>

      <div>
        <label htmlFor="confirm-password" className={labelClass}>
          Xác nhận mật khẩu mới
        </label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
          className={inputClass}
        />
      </div>

      {state.error ? (
        <p role="alert" className="text-sm font-medium text-[#b32f2f]">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="text-sm font-medium text-[#0a7a0a]">
          Đã đổi mật khẩu. Mọi phiên đăng nhập khác đã bị đăng xuất.
        </p>
      ) : null}

      <Submit />
    </form>
  );
}

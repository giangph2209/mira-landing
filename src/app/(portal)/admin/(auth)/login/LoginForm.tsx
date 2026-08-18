"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Button from "@/components/ui/Button";
import { inputClass, labelClass } from "@/components/ui/form-classes";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

function SubmitButton() {
  // useFormStatus bắt buộc phải nằm trong một component con của <form>
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="mt-2 w-full" loading={pending}>
      {pending ? "Đang đăng nhập..." : "Đăng nhập"}
    </Button>
  );
}

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={nextPath} />

      <div>
        <label htmlFor="admin-email" className={labelClass}>
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          defaultValue={state.email ?? ""}
          className={inputClass}
          placeholder="admin@dvltechco.com"
        />
      </div>

      <div>
        <label htmlFor="admin-password" className={labelClass}>
          Mật khẩu
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded-xl border border-[rgba(208,59,59,0.24)] bg-[rgba(208,59,59,0.08)] px-4 py-3 text-sm font-medium text-[#b32f2f]"
        >
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}

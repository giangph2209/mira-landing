"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { SubmissionPriority, SubmissionStatus } from "@prisma/client";
import Button from "@/components/ui/Button";
import { inputClassSm, labelClassSm } from "@/components/ui/form-classes";
import { SUBMISSION_PRIORITIES, statusLabel } from "@/lib/submission-workflow";
import {
  addNote,
  assignSubmission,
  changeStatus,
  setPriority,
  type ActionState,
} from "@/app/admin/(app)/submissions/actions";

const initial: ActionState = {};

function Feedback({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p role="alert" className="mt-2 text-xs font-medium text-[#b32f2f]">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return <p className="mt-2 text-xs font-medium text-[#0a7a0a]">{state.success}</p>;
  }
  return null;
}

function Submit({ label, block }: { label: string; block?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="sm"
      loading={pending}
      className={block ? "w-full" : undefined}
    >
      {label}
    </Button>
  );
}

export function StatusForm({
  id,
  current,
  allowed,
}: {
  id: string;
  current: SubmissionStatus;
  allowed: SubmissionStatus[];
}) {
  const [state, action] = useActionState(changeStatus, initial);

  if (allowed.length === 0) {
    return (
      <p className="text-xs text-text-gray">
        Trạng thái &ldquo;{statusLabel(current)}&rdquo; không còn bước chuyển tiếp nào.
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />

      <label htmlFor="status-select" className={labelClassSm}>
        Chuyển trạng thái
      </label>
      <select id="status-select" name="status" className={inputClassSm} defaultValue={allowed[0]}>
        {allowed.map((status) => (
          <option key={status} value={status}>
            {statusLabel(status)}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="note"
        placeholder="Ghi chú cho bước chuyển (không bắt buộc)"
        className={inputClassSm}
        maxLength={500}
      />

      <Submit label="Cập nhật trạng thái" block />
      <Feedback state={state} />
    </form>
  );
}

export function AssigneeForm({
  id,
  currentId,
  users,
}: {
  id: string;
  currentId: string | null;
  users: { id: string; name: string }[];
}) {
  const [state, action] = useActionState(assignSubmission, initial);

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />

      <label htmlFor="assignee-select" className={labelClassSm}>
        Người phụ trách
      </label>
      <select
        id="assignee-select"
        name="assignedToId"
        className={inputClassSm}
        defaultValue={currentId ?? ""}
      >
        <option value="">Chưa phân công</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      <Submit label="Lưu phân công" block />
      <Feedback state={state} />
    </form>
  );
}

export function PriorityForm({
  id,
  current,
}: {
  id: string;
  current: SubmissionPriority;
}) {
  const [state, action] = useActionState(setPriority, initial);

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />

      <label htmlFor="priority-select" className={labelClassSm}>
        Mức ưu tiên
      </label>
      <select id="priority-select" name="priority" className={inputClassSm} defaultValue={current}>
        {SUBMISSION_PRIORITIES.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <Submit label="Lưu ưu tiên" block />
      <Feedback state={state} />
    </form>
  );
}

export function NoteForm({ id }: { id: string }) {
  const [state, action] = useActionState(addNote, initial);

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />

      <label htmlFor="note-body" className={labelClassSm}>
        Thêm ghi chú
      </label>
      <textarea
        id="note-body"
        name="body"
        rows={3}
        maxLength={5000}
        required
        placeholder="Nội dung trao đổi, kết quả cuộc gọi..."
        className={`${inputClassSm} resize-y`}
      />

      <div className="flex justify-end">
        <Submit label="Lưu ghi chú" />
      </div>
      <Feedback state={state} />
    </form>
  );
}

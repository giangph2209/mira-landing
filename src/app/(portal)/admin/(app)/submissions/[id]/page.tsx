import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  AssigneeForm,
  NoteForm,
  PriorityForm,
  StatusForm,
} from "@/components/admin/SubmissionControls";
import { requireAdmin } from "@/lib/dal";
import { formatDateTime, formatDuration, formatNumber, formatRelative } from "@/lib/format";
import { CHANNEL_LABEL } from "@/lib/analytics/channel";
import { allowedTransitions, priorityLabel, statusLabel } from "@/lib/submission-workflow";
import { getAssignableUsers, getSubmissionDetail } from "@/lib/submissions";
import type { TrafficChannel } from "@prisma/client";

export const metadata: Metadata = { title: "Chi tiết yêu cầu" };

// params là Promise ở Next 16
export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const [detail, users] = await Promise.all([getSubmissionDetail(id), getAssignableUsers()]);

  if (!detail) notFound();

  const { submission, session } = detail;

  // Gộp ghi chú và sự kiện đổi trạng thái vào một dòng thời gian duy nhất
  const timeline = [
    ...submission.statusEvents.map((event) => ({
      kind: "status" as const,
      id: event.id,
      at: event.createdAt,
      actor: event.actor?.name ?? "Hệ thống",
      body: event.fromStatus
        ? `Chuyển từ "${statusLabel(event.fromStatus)}" sang "${statusLabel(event.toStatus)}"`
        : `Khởi tạo ở trạng thái "${statusLabel(event.toStatus)}"`,
      note: event.note,
    })),
    ...submission.notes.map((note) => ({
      kind: "note" as const,
      id: note.id,
      at: note.createdAt,
      actor: note.author?.name ?? "Không rõ",
      body: note.body,
      note: null,
    })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());

  const attribution: { label: string; value: string | null }[] = [
    { label: "Trang vào đầu tiên", value: submission.landingPath },
    { label: "Nguồn giới thiệu", value: submission.referrerHost },
    { label: "utm_source", value: submission.utmSource },
    { label: "utm_medium", value: submission.utmMedium },
    { label: "utm_campaign", value: submission.utmCampaign },
    { label: "Địa chỉ IP", value: submission.ip },
    {
      label: "Kênh truy cập",
      value: session ? (CHANNEL_LABEL[session.channel as TrafficChannel] ?? session.channel) : null,
    },
    {
      label: "Thiết bị",
      value: session
        ? [session.deviceType, session.browserName, session.osName].filter(Boolean).join(" · ")
        : null,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Link
          href="/admin/submissions"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-gray transition-colors hover:text-primary"
        >
          <ArrowLeft size={16} aria-hidden />
          Danh sách yêu cầu
        </Link>
      </div>

      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-xl font-bold text-text-dark">{submission.name}</h1>
            <StatusBadge status={submission.status} />
          </div>
          <p className="mt-1 text-sm text-text-gray">
            Gửi lúc {formatDateTime(submission.createdAt)} · {formatRelative(submission.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={`tel:${submission.phone}`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-text-dark transition-colors hover:border-primary hover:text-primary"
          >
            <Phone size={16} aria-hidden />
            {submission.phone}
          </a>
          <a
            href={`mailto:${submission.email}`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-text-dark transition-colors hover:border-primary hover:text-primary"
          >
            <Mail size={16} aria-hidden />
            {submission.email}
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <section className="admin-surface p-5">
            <h2 className="mb-4 font-heading text-sm font-bold text-text-dark">Nội dung yêu cầu</h2>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-gray">
                  Công ty
                </dt>
                <dd className="mt-1 text-sm text-text-dark">{submission.company || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-gray">
                  Dịch vụ quan tâm
                </dt>
                <dd className="mt-1 text-sm text-text-dark">{submission.serviceType}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-gray">
                  Mức ưu tiên
                </dt>
                <dd className="mt-1 text-sm text-text-dark">
                  {priorityLabel(submission.priority)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-text-gray">
                  Phụ trách
                </dt>
                <dd className="mt-1 text-sm text-text-dark">
                  {submission.assignedTo?.name ?? "Chưa phân công"}
                </dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-[#f1f3f2] pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-gray">
                Lời nhắn
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-text-dark">
                {submission.message || "—"}
              </p>
            </div>
          </section>

          <section className="admin-surface p-5">
            <h2 className="mb-4 font-heading text-sm font-bold text-text-dark">
              Nguồn gốc yêu cầu
            </h2>

            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {attribution.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-text-gray">
                    {item.label}
                  </dt>
                  <dd className="mt-0.5 break-all text-sm text-text-dark">{item.value || "—"}</dd>
                </div>
              ))}
            </dl>

            {session ? (
              <div className="mt-5 border-t border-[#f1f3f2] pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-gray">
                  Hành trình trước khi gửi form · {formatNumber(session.pageviewCount)} lượt xem
                </p>
                <ol className="mt-3 flex flex-col gap-2">
                  {session.pageViews.map((view) => (
                    <li key={view.id} className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="truncate text-text-dark">{view.path}</span>
                      <span className="shrink-0 text-xs tabular-nums text-text-gray">
                        {formatDateTime(view.occurredAt)}
                        {view.durationMs
                          ? ` · ${formatDuration(view.durationMs / 1000)}`
                          : ""}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <p className="mt-4 border-t border-[#f1f3f2] pt-4 text-xs leading-relaxed text-text-gray">
                Không có dữ liệu phiên truy cập kèm theo. Thường gặp khi khách chặn JavaScript,
                hoặc khi yêu cầu được gửi trước lúc hệ thống theo dõi được bật.
              </p>
            )}
          </section>

          <section className="admin-surface p-5">
            <h2 className="mb-4 font-heading text-sm font-bold text-text-dark">
              Lịch sử xử lý
            </h2>

            <NoteForm id={submission.id} />

            <ol className="mt-5 flex flex-col gap-4 border-t border-[#f1f3f2] pt-4">
              {timeline.length === 0 ? (
                <li className="text-sm text-text-gray">Chưa có hoạt động nào.</li>
              ) : null}

              {timeline.map((item) => (
                <li key={`${item.kind}-${item.id}`} className="flex gap-3">
                  <span
                    aria-hidden
                    className={[
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      item.kind === "status" ? "bg-primary" : "bg-[#c3c2b7]",
                    ].join(" ")}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="whitespace-pre-wrap text-sm text-text-dark">{item.body}</p>
                    {item.note ? (
                      <p className="mt-1 whitespace-pre-wrap text-sm text-text-gray">
                        “{item.note}”
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-text-gray">
                      {item.actor} · {formatDateTime(item.at)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          <section className="admin-surface p-5">
            <StatusForm
              id={submission.id}
              current={submission.status}
              allowed={allowedTransitions(submission.status)}
            />
          </section>

          <section className="admin-surface p-5">
            <AssigneeForm
              id={submission.id}
              currentId={submission.assignedToId}
              users={users}
            />
          </section>

          <section className="admin-surface p-5">
            <PriorityForm id={submission.id} current={submission.priority} />
          </section>

          <section className="admin-surface p-5">
            <h2 className="mb-3 font-heading text-sm font-bold text-text-dark">Mốc thời gian</h2>
            <dl className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-text-gray">Gửi lúc</dt>
                <dd className="text-right text-text-dark">{formatDateTime(submission.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-text-gray">Liên hệ lần đầu</dt>
                <dd className="text-right text-text-dark">
                  {formatDateTime(submission.contactedAt)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-text-gray">Đóng lúc</dt>
                <dd className="text-right text-text-dark">{formatDateTime(submission.closedAt)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-text-gray">Cập nhật cuối</dt>
                <dd className="text-right text-text-dark">{formatDateTime(submission.updatedAt)}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}

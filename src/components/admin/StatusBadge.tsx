import type { SubmissionStatus } from "@prisma/client";
import { statusLabel, statusTone } from "@/lib/submission-workflow";

export default function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span className={`status-pill status-pill--${statusTone(status)}`}>{statusLabel(status)}</span>
  );
}

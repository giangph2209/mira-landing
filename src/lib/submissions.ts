import "server-only";

import { Prisma, type SubmissionPriority, type SubmissionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isSubmissionPriority, isSubmissionStatus } from "@/lib/submission-workflow";

export const SUBMISSION_PAGE_SIZE = 25;

export type SubmissionSort = "newest" | "oldest" | "updated";

export type SubmissionFilters = {
  query: string | null;
  status: SubmissionStatus | null;
  priority: SubmissionPriority | null;
  serviceType: string | null;
  assignedToId: string | null;
  sort: SubmissionSort;
  page: number;
};

function pick(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  const single = Array.isArray(value) ? value[0] : value;
  return single?.trim() || null;
}

export function parseSubmissionFilters(
  params: Record<string, string | string[] | undefined>,
): SubmissionFilters {
  const sortRaw = pick(params, "sort");
  const pageRaw = Number(pick(params, "page") ?? 1);

  const statusRaw = pick(params, "status");
  const priorityRaw = pick(params, "priority");

  return {
    query: pick(params, "q")?.slice(0, 120) ?? null,
    status: isSubmissionStatus(statusRaw) ? statusRaw : null,
    priority: isSubmissionPriority(priorityRaw) ? priorityRaw : null,
    serviceType: pick(params, "service")?.slice(0, 200) ?? null,
    assignedToId: pick(params, "assignee")?.slice(0, 40) ?? null,
    sort: sortRaw === "oldest" || sortRaw === "updated" ? sortRaw : "newest",
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? Math.min(Math.floor(pageRaw), 400) : 1,
  };
}

function buildWhere(filters: SubmissionFilters): Prisma.ContactSubmissionWhereInput {
  const where: Prisma.ContactSubmissionWhereInput = {};

  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.serviceType) where.serviceType = filters.serviceType;
  if (filters.assignedToId) {
    where.assignedToId = filters.assignedToId === "none" ? null : filters.assignedToId;
  }

  if (filters.query) {
    // Chỉ mục GIN trgm trong migration phục vụ đúng dạng contains này
    where.OR = [
      { name: { contains: filters.query, mode: "insensitive" } },
      { email: { contains: filters.query, mode: "insensitive" } },
      { phone: { contains: filters.query, mode: "insensitive" } },
      { company: { contains: filters.query, mode: "insensitive" } },
    ];
  }

  return where;
}

function buildOrderBy(sort: SubmissionSort): Prisma.ContactSubmissionOrderByWithRelationInput {
  if (sort === "oldest") return { createdAt: "asc" };
  if (sort === "updated") return { updatedAt: "desc" };
  return { createdAt: "desc" };
}

export async function listSubmissions(filters: SubmissionFilters) {
  const where = buildWhere(filters);
  const skip = (filters.page - 1) * SUBMISSION_PAGE_SIZE;

  const [rows, total] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      orderBy: buildOrderBy(filters.sort),
      skip,
      take: SUBMISSION_PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        serviceType: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        referrerHost: true,
        assignedTo: { select: { id: true, name: true } },
      },
    }),
    prisma.contactSubmission.count({ where }),
  ]);

  return {
    rows,
    total,
    page: filters.page,
    pageCount: Math.max(1, Math.ceil(total / SUBMISSION_PAGE_SIZE)),
  };
}

export async function getSubmissionDetail(id: string) {
  const submission = await prisma.contactSubmission.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      notes: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { id: true, name: true } } },
      },
      statusEvents: {
        orderBy: { createdAt: "desc" },
        include: { actor: { select: { id: true, name: true } } },
      },
    },
  });

  if (!submission) return null;

  // sessionId cố ý không phải khoá ngoại (xem ghi chú trong schema) nên join thủ công
  const session = submission.sessionId
    ? await prisma.visitorSession.findUnique({
        where: { id: submission.sessionId },
        select: {
          id: true,
          startedAt: true,
          lastEventAt: true,
          pageviewCount: true,
          entryPath: true,
          exitPath: true,
          channel: true,
          referrerHost: true,
          deviceType: true,
          browserName: true,
          osName: true,
          language: true,
          screenWidth: true,
          pageViews: {
            orderBy: { occurredAt: "asc" },
            take: 40,
            select: { id: true, path: true, occurredAt: true, durationMs: true },
          },
        },
      })
    : null;

  return { submission, session };
}

export async function getSubmissionStats() {
  const grouped = await prisma.contactSubmission.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const counts = new Map(grouped.map((row) => [row.status, row._count._all]));
  const total = grouped.reduce((sum, row) => sum + row._count._all, 0);

  return { counts, total };
}

export async function getServiceTypes(): Promise<string[]> {
  const rows = await prisma.contactSubmission.findMany({
    distinct: ["serviceType"],
    select: { serviceType: true },
    orderBy: { serviceType: "asc" },
    take: 50,
  });
  return rows.map((row) => row.serviceType);
}

export async function getAssignableUsers() {
  return prisma.adminUser.findMany({
    where: { isActive: true },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

/** Dùng cho export CSV — không phân trang, nhưng có trần cứng để không kéo sập bộ nhớ */
export async function listSubmissionsForExport(filters: SubmissionFilters, limit = 5000) {
  return prisma.contactSubmission.findMany({
    where: buildWhere(filters),
    orderBy: buildOrderBy(filters.sort),
    take: limit,
    include: { assignedTo: { select: { name: true } } },
  });
}

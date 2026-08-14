-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('OWNER', 'ADMIN', 'VIEWER');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATING', 'WON', 'LOST', 'SPAM', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SubmissionPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "SubmissionSource" AS ENUM ('WEBSITE_FORM', 'MANUAL', 'IMPORT');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('DESKTOP', 'MOBILE', 'TABLET', 'OTHER');

-- CreateEnum
CREATE TYPE "TrafficChannel" AS ENUM ('DIRECT', 'ORGANIC_SEARCH', 'PAID_SEARCH', 'SOCIAL', 'REFERRAL', 'EMAIL', 'INTERNAL', 'OTHER');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMPTZ(3),
    "lastLoginAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "revokedAt" TIMESTAMPTZ(3),

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "email" TEXT,
    "success" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "serviceType" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
    "priority" "SubmissionPriority" NOT NULL DEFAULT 'NORMAL',
    "source" "SubmissionSource" NOT NULL DEFAULT 'WEBSITE_FORM',
    "assignedToId" TEXT,
    "visitorId" TEXT,
    "sessionId" TEXT,
    "landingPath" TEXT,
    "referrer" TEXT,
    "referrerHost" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "contactedAt" TIMESTAMPTZ(3),
    "closedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionNote" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "authorId" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionStatusEvent" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "fromStatus" "SubmissionStatus",
    "toStatus" "SubmissionStatus" NOT NULL,
    "actorId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionStatusEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionCount" INTEGER NOT NULL DEFAULT 0,
    "lastIp" TEXT,
    "lastUserAgent" TEXT,
    "country" TEXT,
    "city" TEXT,
    "isBot" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitorSession" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "startedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastEventAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pageviewCount" INTEGER NOT NULL DEFAULT 0,
    "sessionCountAtStart" INTEGER NOT NULL DEFAULT 1,
    "entryPath" TEXT NOT NULL,
    "exitPath" TEXT NOT NULL,
    "referrer" TEXT,
    "referrerHost" TEXT,
    "channel" "TrafficChannel" NOT NULL DEFAULT 'DIRECT',
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "deviceType" "DeviceType" NOT NULL DEFAULT 'OTHER',
    "browserName" TEXT,
    "osName" TEXT,
    "screenWidth" INTEGER,
    "language" TEXT,
    "country" TEXT,
    "city" TEXT,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "convertedAt" TIMESTAMPTZ(3),

    CONSTRAINT "VisitorSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT,
    "referrer" TEXT,
    "occurredAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMs" INTEGER,
    "isBot" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_tokenHash_key" ON "AdminSession"("tokenHash");

-- CreateIndex
CREATE INDEX "AdminSession_userId_idx" ON "AdminSession"("userId");

-- CreateIndex
CREATE INDEX "AdminSession_expiresAt_idx" ON "AdminSession"("expiresAt");

-- CreateIndex
CREATE INDEX "LoginAttempt_ip_createdAt_idx" ON "LoginAttempt"("ip", "createdAt");

-- CreateIndex
CREATE INDEX "LoginAttempt_email_createdAt_idx" ON "LoginAttempt"("email", "createdAt");

-- CreateIndex
CREATE INDEX "ContactSubmission_createdAt_idx" ON "ContactSubmission"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "ContactSubmission_status_createdAt_idx" ON "ContactSubmission"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ContactSubmission_assignedToId_status_createdAt_idx" ON "ContactSubmission"("assignedToId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ContactSubmission_serviceType_createdAt_idx" ON "ContactSubmission"("serviceType", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ContactSubmission_email_idx" ON "ContactSubmission"("email");

-- CreateIndex
CREATE INDEX "ContactSubmission_sessionId_idx" ON "ContactSubmission"("sessionId");

-- CreateIndex
CREATE INDEX "SubmissionNote_submissionId_createdAt_idx" ON "SubmissionNote"("submissionId", "createdAt");

-- CreateIndex
CREATE INDEX "SubmissionStatusEvent_submissionId_createdAt_idx" ON "SubmissionStatusEvent"("submissionId", "createdAt");

-- CreateIndex
CREATE INDEX "Visitor_firstSeenAt_idx" ON "Visitor"("firstSeenAt");

-- CreateIndex
CREATE INDEX "Visitor_lastSeenAt_idx" ON "Visitor"("lastSeenAt");

-- CreateIndex
CREATE INDEX "VisitorSession_startedAt_idx" ON "VisitorSession"("startedAt");

-- CreateIndex
CREATE INDEX "VisitorSession_visitorId_startedAt_idx" ON "VisitorSession"("visitorId", "startedAt");

-- CreateIndex
CREATE INDEX "PageView_occurredAt_path_idx" ON "PageView"("occurredAt", "path");

-- CreateIndex
CREATE INDEX "PageView_sessionId_occurredAt_idx" ON "PageView"("sessionId", "occurredAt");

-- AddForeignKey
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactSubmission" ADD CONSTRAINT "ContactSubmission_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionNote" ADD CONSTRAINT "SubmissionNote_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ContactSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionNote" ADD CONSTRAINT "SubmissionNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionStatusEvent" ADD CONSTRAINT "SubmissionStatusEvent_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ContactSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionStatusEvent" ADD CONSTRAINT "SubmissionStatusEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitorSession" ADD CONSTRAINT "VisitorSession_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VisitorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- ---------------------------------------------------------------------------
-- Bổ sung thủ công (Prisma không mô tả được các dạng index này)
-- ---------------------------------------------------------------------------

-- Tìm kiếm lead theo tên/email/phone/công ty: ILIKE '%x%' không bao giờ dùng được btree
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "contact_submission_search_trgm" ON "ContactSubmission" USING gin (
  (
    coalesce("name", '') || ' ' ||
    coalesce("email", '') || ' ' ||
    coalesce("phone", '') || ' ' ||
    coalesce("company", '')
  ) gin_trgm_ops
);

-- Partial index: ~100% query dashboard đều loại bot
CREATE INDEX "visitor_session_human_started_idx"
  ON "VisitorSession" ("startedAt") WHERE "isBot" = false;

CREATE INDEX "page_view_human_occurred_idx"
  ON "PageView" ("occurredAt", "path") WHERE "isBot" = false;

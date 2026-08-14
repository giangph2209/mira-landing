import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { hostFromUrl, normalizePath } from "@/lib/analytics/channel";
import { getClientIp } from "@/lib/request-context";
import { SESSION_COOKIE, VISITOR_COOKIE, readTrackingId } from "@/lib/analytics/cookies";

// Envelope giữ NGUYÊN như trước (luôn HTTP 200, statusCode nằm trong body) để
// CTASection.tsx không phải sửa dòng nào.
type ApiResult = { success: boolean; statusCode: number; message: string };

function reply(body: ApiResult) {
  return NextResponse.json(body, { status: 200 });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimmed(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as Record<string, unknown>;

    const name = trimmed(data.name, 200);
    const phone = trimmed(data.phone, 40);
    const email = trimmed(data.email, 200).toLowerCase();
    const company = trimmed(data.company, 200);
    const serviceType = trimmed(data.serviceType, 200);
    const message = trimmed(data.message, 5000);

    if (!name || !phone || !email || !serviceType) {
      return reply({
        success: false,
        statusCode: 400,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }
    if (!EMAIL_RE.test(email)) {
      return reply({ success: false, statusCode: 400, message: "Email không hợp lệ" });
    }

    // Attribution: fetch same-origin từ CTASection có gửi cookie sẵn
    const cookieStore = await cookies();
    const visitorId = readTrackingId(cookieStore.get(VISITOR_COOKIE)?.value);
    const sessionId = readTrackingId(cookieStore.get(SESSION_COOKIE)?.value);

    const headerList = await headers();
    const ip = getClientIp(headerList);
    const userAgent = headerList.get("user-agent")?.slice(0, 512) ?? null;
    const referer = headerList.get("referer");

    const session = sessionId
      ? await prisma.visitorSession.findUnique({
          where: { id: sessionId },
          select: {
            entryPath: true,
            referrer: true,
            referrerHost: true,
            utmSource: true,
            utmMedium: true,
            utmCampaign: true,
          },
        })
      : null;

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        phone,
        email,
        company: company || null,
        serviceType,
        message,
        visitorId,
        sessionId,
        landingPath: session?.entryPath ?? (referer ? normalizePath(new URL(referer).pathname) : null),
        referrer: session?.referrer ?? referer ?? null,
        referrerHost: session?.referrerHost ?? hostFromUrl(referer),
        utmSource: session?.utmSource ?? null,
        utmMedium: session?.utmMedium ?? null,
        utmCampaign: session?.utmCampaign ?? null,
        ip,
        userAgent,
      },
      select: { id: true },
    });

    after(async () => {
      try {
        await prisma.submissionStatusEvent.create({
          data: { submissionId: submission.id, toStatus: "NEW", note: "Khách gửi từ website" },
        });

        if (sessionId) {
          // updateMany chứ không update: nếu beacon chưa kịp ghi row session thì lệnh này
          // lặng lẽ không làm gì, thay vì throw P2025.
          await prisma.visitorSession.updateMany({
            where: { id: sessionId, converted: false },
            data: { converted: true, convertedAt: new Date() },
          });
        }
      } catch (error) {
        console.error("[contact] không ghi được dữ liệu phụ trợ", error);
      }
    });

    return reply({
      success: true,
      statusCode: 201,
      message: "Đã gửi yêu cầu, chúng tôi sẽ phản hồi sớm nhất",
    });
  } catch (error) {
    console.error("[contact] lỗi khi lưu yêu cầu liên hệ", error);
    return reply({
      success: false,
      statusCode: 500,
      message: "Có lỗi xảy ra, vui lòng thử lại sau",
    });
  }
}

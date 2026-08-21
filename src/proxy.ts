import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "@/lib/i18n/config";

// Next 16: `middleware.ts` đã được đổi tên thành `proxy.ts`. Runtime cố định là nodejs,
// khai báo `export const runtime` ở file này sẽ throw.

const SESSION_COOKIE = "mira_admin_session";

/** Ghi lựa chọn ngôn ngữ của khách để lần sau vào "/" không phải đoán lại. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

function withNoindex(response: NextResponse) {
  // Header phủ được cả response không phải HTML (ví dụ route export CSV), điều mà thẻ
  // <meta robots> từ metadata không làm được.
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

/**
 * Chọn locale cho khách vào đường dẫn chưa có tiền tố ngôn ngữ.
 *
 * CỐ Ý KHÔNG dò header Accept-Language.
 *
 * Bản trước có bước đó, nên trình duyệt cài tiếng Việt vào "/" sẽ bị đưa thẳng
 * sang /vi và không bao giờ nhìn thấy bản tiếng Anh — trong khi tiếng Anh mới là
 * ngôn ngữ mặc định của site. Giờ mọi khách đều vào DEFAULT_LOCALE, trừ khi họ đã
 * tự chọn ngôn ngữ khác (cookie do LanguageSwitcher ghi).
 */
function resolveLocale(request: NextRequest): Locale {
  const fromCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (fromCookie && isLocale(fromCookie)) return fromCookie;

  return DEFAULT_LOCALE;
}

function handleAdmin(request: NextRequest, pathname: string) {
  // CHỈ kiểm tra cookie có tồn tại hay không — cố ý không verify, không đụng DB.
  // Docs Next 16 yêu cầu proxy chỉ làm "optimistic check"; việc xác thực thật nằm ở
  // src/lib/dal.ts và được gọi lại trong từng page/action/route handler.
  const hasSessionCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  // /admin/login LUÔN đi qua, kể cả khi đã có cookie.
  //
  // Nếu ở đây chuyển hướng "có cookie thì về /admin", một cookie hết hạn hoặc đã bị thu hồi
  // sẽ tạo vòng lặp vô tận: /admin → DAL thấy phiên không hợp lệ → /admin/login → proxy thấy
  // vẫn còn cookie → /admin → ... Proxy không đọc được DB nên không phân biệt được cookie
  // còn hiệu lực hay không; việc đó để trang login tự làm bằng verifySession().
  if (pathname === "/admin/login") {
    return withNoindex(NextResponse.next());
  }

  if (!hasSessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    if (pathname !== "/admin") {
      loginUrl.searchParams.set("next", pathname);
    }
    return withNoindex(NextResponse.redirect(loginUrl));
  }

  return withNoindex(NextResponse.next());
}

/**
 * Đường dẫn trỏ tới một file, không phải một trang.
 *
 * Bắt buộc phải kiểm tra Ở ĐÂY chứ không chỉ trong `matcher`: Next biên dịch matcher
 * bằng path-to-regexp, không phải RegExp thuần, nên lookahead kiểu `(?!.*\.[\w]+$)`
 * bị bỏ qua. Đã dính đúng lỗi đó — /sitemap.xml và /robots.txt bị đá sang
 * /vi/sitemap.xml rồi 404, đủ để hỏng toàn bộ SEO mà không có dấu hiệu gì.
 */
function isFileRequest(pathname: string) {
  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  return lastSegment.includes(".");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // sitemap.xml, robots.txt, favicon.ico, icon.png, ảnh trong public/ ...
  if (isFileRequest(pathname)) return NextResponse.next();

  // Khu vực quản trị KHÔNG đa ngữ — giữ nguyên /admin, không chèn tiền tố locale.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return handleAdmin(request, pathname);
  }

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = resolveLocale(request);
  const url = request.nextUrl.clone();
  // pathname "/" -> "/en" (không phải "/en/"), các path khác giữ nguyên phần đuôi
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

// matcher bắt buộc phải là hằng số tĩnh để Next phân tích được lúc build
export const config = {
  matcher: [
    /*
     * Chỉ loại trừ hai tiền tố mà path-to-regexp xử lý được chắc chắn:
     *   _next  — asset build ra
     *   api    — route handler, không có giao diện để dịch
     *
     * File tĩnh (sitemap.xml, robots.txt, ảnh...) lọc bằng isFileRequest() bên
     * trong proxy(), KHÔNG lọc ở đây — xem chú thích tại hàm đó.
     */
    "/((?!_next/|api/).*)",
  ],
};

import { NextResponse, type NextRequest } from "next/server";

// Next 16: `middleware.ts` đã được đổi tên thành `proxy.ts`. Runtime cố định là nodejs,
// khai báo `export const runtime` ở file này sẽ throw.

const SESSION_COOKIE = "mira_admin_session";

function withNoindex(response: NextResponse) {
  // Header phủ được cả response không phải HTML (ví dụ route export CSV), điều mà thẻ
  // <meta robots> từ metadata không làm được.
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

// matcher bắt buộc phải là hằng số tĩnh để Next phân tích được lúc build
export const config = {
  matcher: ["/admin/:path*"],
};

import "server-only";

/**
 * Next 16 đã bỏ `request.ip` và `request.geo` — phải tự đọc header.
 *
 * Lấy entry ngoài cùng bên trái của x-forwarded-for. An toàn ở đây vì docker-compose
 * KHÔNG publish cổng 3000 ra host: reverse proxy trên network `web` là lối vào duy nhất,
 * nên header do chính nó ghi. Nếu sau này có đường vào khác chạm thẳng cổng 3000 thì
 * giá trị này giả mạo được.
 */
export function getClientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }

  const real = headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);

  const cf = headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf.slice(0, 64);

  return null;
}

/**
 * Không dùng dịch vụ geo-IP. Chỉ nhặt cơ hội header do reverse proxy/CDN gắn sẵn;
 * không có thì trả null và cột country/city trong DB để trống.
 *
 * Đây là chỗ cắm MaxMind GeoLite2 sau này — schema đã có sẵn cột nên không cần migration.
 */
export function getGeoHint(headers: Headers): { country: string | null; city: string | null } {
  const country =
    headers.get("cf-ipcountry") ??
    headers.get("x-vercel-ip-country") ??
    headers.get("x-geo-country");

  const city = headers.get("x-vercel-ip-city") ?? headers.get("x-geo-city");

  return {
    country: country && country !== "XX" ? country.slice(0, 8).toUpperCase() : null,
    city: city ? decodeURIComponent(city).slice(0, 128) : null,
  };
}

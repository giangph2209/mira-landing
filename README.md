# dvl-landing (dvltechco.com)

Landing page + khu vực quản trị của DVL Tech. Next.js 16 (App Router, Turbopack), React 19,
Tailwind v4, PostgreSQL + Prisma.

> ⚠️ Next.js 16 có nhiều thay đổi phá vỡ so với các đời trước (`middleware.ts` → `proxy.ts`,
> `cookies()`/`headers()`/`params` đều là async...). Đọc `AGENTS.md` và tài liệu đi kèm trong
> `node_modules/next/dist/docs/` trước khi sửa code.

## Chạy môi trường phát triển

```bash
cp .env.example .env      # rồi sửa DATABASE_URL trỏ về Postgres của bạn
npm install
npm run db:deploy         # áp dụng migration
npm run db:seed           # cần ADMIN_EMAIL + ADMIN_PASSWORD trong env
npm run dev
```

Chạy dev ngoài Docker thì `DATABASE_URL` phải trỏ `localhost:5432`, và đặt
`SESSION_COOKIE_SECURE=false` (cookie `Secure` không gửi được qua `http://`).

## Lệnh cơ sở dữ liệu

| Lệnh | Việc |
|---|---|
| `npm run db:migrate` | Tạo migration mới khi đổi `prisma/schema.prisma` (dev) |
| `npm run db:deploy` | Áp dụng migration đã có (production) |
| `npm run db:generate` | Sinh lại Prisma Client |
| `npm run db:seed` | Tạo tài khoản quản trị đầu tiên (idempotent) |
| `npm run db:studio` | Mở Prisma Studio để xem dữ liệu |

Migration `20260814000000_init` có phần SQL **viết tay** ở cuối file (extension `pg_trgm`,
chỉ mục GIN cho tìm kiếm, hai partial index loại bot). Khi tạo migration mới bằng
`prisma migrate dev`, đừng ghi đè file này.

## Triển khai

```bash
cp .env.example .env      # điền giá trị thật
./deploy.sh
```

`deploy.sh` dựng cả `postgres` lẫn `nextjs` bằng docker compose. Entrypoint của container app
tự chạy `prisma migrate deploy` trước khi khởi động, và compose chờ healthcheck của Postgres
nên không có chuyện app đua với DB lúc khởi động nguội.

Lần đầu triển khai, tạo tài khoản quản trị:

```bash
docker compose exec -e ADMIN_EMAIL=you@example.com -e ADMIN_PASSWORD='mat-khau-manh' \
  nextjs node prisma/seed.mjs
```

Postgres **không** publish cổng ra host — chỉ container app trong network `internal` truy cập
được. Việc này cũng là điều làm cho `x-forwarded-for` đáng tin: reverse proxy trên network
`web` là lối vào duy nhất.

## Khu vực quản trị

| Đường dẫn | Nội dung |
|---|---|
| `/admin/login` | Đăng nhập |
| `/admin` | Dashboard thống kê truy cập |
| `/admin/visitors` | Danh sách từng phiên truy cập kèm IP |
| `/admin/submissions` | Quản lý yêu cầu liên hệ, lọc/tìm/xuất CSV |
| `/admin/submissions/[id]` | Chi tiết, đổi trạng thái, phân công, ghi chú |
| `/admin/account` | Đổi mật khẩu, xem phiên đăng nhập |

### Cách bảo vệ hoạt động

Có **hai tầng**, cố ý tách rời:

- `src/proxy.ts` — chỉ kiểm tra cookie **có tồn tại hay không**. Không verify, không đụng DB
  (tài liệu Next 16 cấm gọi DB trong proxy). Việc của nó là tránh chớp giao diện admin và gắn
  header `X-Robots-Tag: noindex`.
- `src/lib/dal.ts` — kiểm tra thật: tra `tokenHash` trong DB, kiểm tra thu hồi / hạn tuyệt đối
  30 ngày / idle 12 giờ / tài khoản còn hoạt động.

`requireAdmin()` phải được gọi trong **từng page, từng Server Action, từng Route Handler** —
không bao giờ chỉ đặt ở layout. Lý do: Partial Rendering làm layout không re-render khi điều
hướng phía client, và Server Action là POST vào chính path của page nên có thể bị gọi trực tiếp.

Mật khẩu băm bằng scrypt của `node:crypto` (không dùng bcrypt/argon2 — đều là native module,
biên dịch trên alpine rất phiền). Session là token ngẫu nhiên 32 byte, DB chỉ lưu sha256 của nó.

## Thống kê truy cập

Tự thu thập, không dùng Google Analytics hay dịch vụ ngoài nào.

- `src/components/analytics/AnalyticsBeacon.tsx` bắn `navigator.sendBeacon` tới `POST /api/e`.
  Đo phía client chứ không phải server, vì đọc `headers()` trong root layout sẽ làm `/` và
  `/privacy-policy` mất static generation.
- Endpoint đặt tên `/api/e` chứ không phải `/api/track`: các rule EasyPrivacy/uBlock match đúng
  những chuỗi phổ biến đó.
- Toàn bộ ghi DB chạy trong `after()` nên độ trễ beacon chỉ bằng RTT mạng.
- Lọc bot ba tầng: crawler không chạy JS → `userAgent().isBot` phía server → quét hành vi
  (cùng IP >30 lượt xem trong 60 giây). Bot bị **đánh cờ**, không bị xoá, để còn audit được.
- **Không dùng dịch vụ geo-IP.** Chỉ lưu IP và user-agent. Cột `country`/`city` để trống, chỉ
  điền khi reverse proxy gửi header (`cf-ipcountry`...). Muốn thêm MaxMind sau này thì cắm vào
  `getGeoHint()` trong `src/lib/request-context.ts`, không cần migration.

Dữ liệu truy cập nên xoá sau 18 tháng:

```sql
DELETE FROM "PageView" WHERE "occurredAt" < now() - interval '18 months';
```

## Ghi chú kỹ thuật dễ vấp

- Mọi `DateTime` trong schema phải có `@db.Timestamptz(3)`. Mặc định của Prisma là timestamp
  không timezone, khi đó `AT TIME ZONE 'Asia/Ho_Chi_Minh'` lệch 7 tiếng và **mọi số liệu theo
  ngày đều sai** mà không báo lỗi.
- Trong query tổng hợp, điều kiện `WHERE` phải đặt trên cột timestamptz thô; chỉ chuyển múi giờ
  ở `SELECT`/`GROUP BY`. Làm ngược lại biến index scan thành seq scan.
- Biểu đồ theo thời gian bắt buộc gap-fill bằng `generate_series`, nếu không ngày 0 traffic sẽ
  biến mất và đường biểu đồ vẽ sai.
- Không thêm custom webpack config — Turbopack là mặc định ở Next 16 và sẽ làm build fail.
- `revalidateTag(tag)` một tham số giờ là lỗi TypeScript. Trang admin luôn dynamic nên dùng
  `refresh()` từ `next/cache` sau khi ghi dữ liệu.

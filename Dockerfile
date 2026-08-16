# setup
# Node 20 đã hết vòng đời hỗ trợ (04/2026); Next 16 yêu cầu >= 20.9 nên 22 LTS là mốc an toàn.
FROM node:22-alpine AS base

WORKDIR /app

# dependencies (chỉ prod — đây là node_modules sẽ đi vào image cuối)
FROM base AS deps

# CỐ Ý KHÔNG cài libc6-compat.
#
# libc6-compat dựng symlink ld-linux-x86-64.so.2, khiến detect-libc (npm dùng để lọc
# optionalDependencies) tưởng đây là glibc và cài @next/swc-linux-x64-gnu. Stage runner
# không có gói đó nên binary gnu không load được, Next tụt xuống fallback WASM, và vì
# `next start` cần SWC để transpile next.config.ts nên container chết ngay lúc khởi động.
#
# Bỏ libc6-compat -> detect-libc báo đúng musl -> npm cài @next/swc-linux-x64-musl.
# Prisma không cần nó: binaryTargets đã khai linux-musl-openssl-3.0.x, chỉ cần openssl.
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
# PHẢI copy prisma/ trước npm ci: postinstall của prisma chạy `prisma generate`,
# không có schema thì bước cài đặt sẽ lỗi.
COPY prisma ./prisma

RUN npm ci --omit=dev

# Chốt chặn: biến lỗi runtime im lặng ở trên thành lỗi build ồn ào.
RUN test -d node_modules/@next/swc-linux-x64-musl \
  || (echo "LOI: thieu @next/swc-linux-x64-musl (npm nhan nham libc?)"; ls node_modules/@next; exit 1)

# builder
FROM base AS builder

# Cùng lý do như stage deps — builder cũng cần SWC musl để `next build` chạy native
# thay vì bò qua fallback WASM.
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma
# `npm ci` (không --omit=dev) để có tailwind/typescript; dùng ci thay vì install để
# không âm thầm đổi package-lock.json giữa các lần build.
RUN npm ci

COPY . .

# DATABASE_URL giả: build KHÔNG được phép kết nối DB. Nếu có page nào cố kết nối thì
# nó sẽ fail ngay lúc build thay vì âm thầm nướng dữ liệu vào bundle.
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build

# NEXT_PUBLIC_* được inline vào bundle LÚC BUILD — đặt ở env_file lúc chạy là vô nghĩa.
# Truyền qua `build.args` trong docker-compose.yml.
ARG NEXT_PUBLIC_SITE_URL=https://dvltechco.com
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner

RUN apk add --no-cache openssl

ENV NODE_ENV=production

WORKDIR /app

# --chown ngay lúc COPY, không `chown -R` sau: chown -R trên node_modules đẻ thêm một
# layer nhân đôi vài trăm MB.
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
# prisma/ cần cho `prisma migrate deploy` ở entrypoint và cho lệnh seed
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/package.json ./package.json
# `next start` đọc lại next.config.ts TỪ ĐĨA lúc khởi động. Thiếu file này thì toàn bộ
# cấu hình images (avif/webp, dangerouslyAllowSVG, CSP) im lặng quay về mặc định.
COPY --from=builder --chown=node:node /app/next.config.ts ./next.config.ts
COPY --chown=node:node docker-entrypoint.sh ./docker-entrypoint.sh

# .next/cache là nơi Next ghi ảnh đã tối ưu lúc chạy; user `node` phải ghi được.
RUN chmod +x ./docker-entrypoint.sh && mkdir -p .next/cache && chown node:node .next/cache

USER node

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"]

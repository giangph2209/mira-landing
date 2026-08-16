# setup
# Node 20 đã hết vòng đời hỗ trợ (04/2026); Next 16 yêu cầu >= 20.9 nên 22 LTS là mốc an toàn.
FROM node:22-alpine AS base

WORKDIR /app

# dependencies (chỉ prod — đây là node_modules sẽ đi vào image cuối)
FROM base AS deps

# openssl: engine musl của Prisma link tới libssl
RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json ./
# PHẢI copy prisma/ trước npm ci: postinstall của prisma chạy `prisma generate`,
# không có schema thì bước cài đặt sẽ lỗi.
COPY prisma ./prisma

RUN npm ci --omit=dev

# builder
FROM base AS builder

RUN apk add --no-cache libc6-compat openssl

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

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# prisma/ cần cho `prisma migrate deploy` ở entrypoint và cho lệnh seed
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
# `next start` đọc lại next.config.ts TỪ ĐĨA lúc khởi động. Thiếu file này thì toàn bộ
# cấu hình images (avif/webp, dangerouslyAllowSVG, CSP) im lặng quay về mặc định.
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh \
  # .next/cache là nơi Next ghi ảnh đã tối ưu lúc chạy; user `node` phải ghi được.
  && mkdir -p .next/cache \
  && chown -R node:node /app/.next

USER node

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"]

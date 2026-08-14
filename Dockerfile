# setup
FROM node:20-alpine AS base

WORKDIR /app

# dependencies
FROM base AS deps

# openssl: engine musl của Prisma link tới libssl
RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json ./
# PHẢI copy prisma/ trước npm ci: postinstall của prisma chạy `prisma generate`,
# không có schema thì bước cài đặt sẽ lỗi.
COPY prisma ./prisma

RUN \
  if [ -f package-lock.json ]; then npm ci --omit=dev; \
  else npm install --omit=dev; \
  fi

# builder
FROM base AS builder

RUN apk add --no-cache libc6-compat openssl

COPY package.json ./
COPY . .

# DATABASE_URL giả: build KHÔNG được phép kết nối DB. Nếu có page nào cố kết nối thì
# nó sẽ fail ngay lúc build thay vì âm thầm nướng dữ liệu vào bundle.
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build

RUN npm install
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
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"]

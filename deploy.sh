#!/usr/bin/env bash

set -euo pipefail

# App giờ cần Postgres chạy cùng, nên không dùng `docker run` đơn lẻ được nữa —
# toàn bộ vòng đời do docker compose quản lý.

if [ ! -f .env ]; then
  echo "Thiếu file .env. Sao chép .env.example rồi điền giá trị thật:"
  echo "  cp .env.example .env"
  exit 1
fi

# network `web` là external (reverse proxy dùng chung), tạo nếu chưa có
if ! docker network inspect web >/dev/null 2>&1; then
  echo "Tạo docker network 'web'..."
  docker network create web
fi

echo "Build image..."
docker compose build

echo "Khởi động dịch vụ (entrypoint tự chạy prisma migrate deploy)..."
docker compose up -d

docker compose ps

echo
echo "Xong. Lần đầu triển khai, tạo tài khoản quản trị bằng lệnh:"
echo "  docker compose exec -e ADMIN_EMAIL=you@example.com -e ADMIN_PASSWORD='mat-khau-manh' nextjs node prisma/seed.mjs"

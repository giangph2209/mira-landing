#!/bin/sh
set -e

echo "==> Áp dụng migration cơ sở dữ liệu..."
npx prisma migrate deploy

echo "==> Khởi động ứng dụng..."
exec "$@"

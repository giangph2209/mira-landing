// Tạo tài khoản admin đầu tiên. Chạy được nhiều lần (upsert).
//
//   docker compose exec -e ADMIN_EMAIL=... -e ADMIN_PASSWORD=... nextjs node prisma/seed.mjs
//
// Cố ý viết bằng .mjs thay vì .ts: image production không có tsx/ts-node, và không đáng
// kéo cả bộ toolchain TypeScript vào chỉ để tạo một dòng dữ liệu.
// Phần scrypt dưới đây là bản sao của src/lib/password.ts — giữ đồng bộ khi sửa định dạng hash.

import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;

function hashPassword(plain) {
  const salt = randomBytes(16);
  const key = scryptSync(plain.normalize("NFKC"), salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: 256 * 1024 * 1024,
  });
  return [
    "scrypt",
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("base64"),
    key.toString("base64"),
  ].join("$");
}

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Quản trị viên";

  if (!email || !password) {
    console.error("Thiếu ADMIN_EMAIL hoặc ADMIN_PASSWORD.");
    process.exit(1);
  }
  if (password.length < 10) {
    console.error("ADMIN_PASSWORD phải dài ít nhất 10 ký tự.");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    const existing = await prisma.adminUser.findUnique({ where: { email } });

    if (existing) {
      console.log(`Tài khoản ${email} đã tồn tại — không thay đổi gì.`);
      return;
    }

    const user = await prisma.adminUser.create({
      data: {
        email,
        name,
        passwordHash: hashPassword(password),
        role: "OWNER",
      },
    });
    console.log(`Đã tạo tài khoản OWNER: ${user.email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

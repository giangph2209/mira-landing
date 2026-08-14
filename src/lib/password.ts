import "server-only";

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;
const MAXMEM = 256 * 1024 * 1024;

/** Định dạng: scrypt$N$r$p$<salt-b64>$<hash-b64> — giữ đồng bộ với prisma/seed.mjs */
export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(plain.normalize("NFKC"), salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: MAXMEM,
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

export async function verifyPassword(plain: string, encoded: string): Promise<boolean> {
  const parts = encoded.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, n, r, p, saltB64, hashB64] = parts;
  const N = Number(n);
  const R = Number(r);
  const P = Number(p);
  if (!Number.isFinite(N) || !Number.isFinite(R) || !Number.isFinite(P)) return false;

  let expected: Buffer;
  try {
    expected = Buffer.from(hashB64, "base64");
  } catch {
    return false;
  }
  if (expected.length === 0) return false;

  try {
    const actual = await scryptAsync(
      plain.normalize("NFKC"),
      Buffer.from(saltB64, "base64"),
      expected.length,
      { N, r: R, p: P, maxmem: MAXMEM },
    );
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/**
 * Hash của một mật khẩu không ai biết. Khi email đăng nhập không tồn tại ta vẫn chạy
 * verifyPassword với hash này, để thời gian phản hồi không cho phép dò xem tài khoản
 * nào có thật.
 */
export const DUMMY_HASH =
  "scrypt$16384$8$1$Z0hVQmZ2VXhRSGpMS3BOVw==$" +
  "Yk5FVHhZbFhqTUt4c1BqQ3ZuRHpXcUxhZ0RmS3BSdEJoTXlXY1RlUXhaSGtOdlBrTGRTZ0FvVWlSbUJqQ3c9PQ==";

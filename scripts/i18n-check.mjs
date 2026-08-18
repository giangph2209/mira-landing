// Đối chiếu hình dạng key giữa các dictionary. TypeScript đã bắt được thiếu key khi
// component truy cập, nhưng key THỪA hoặc lệch kiểu (mảng vs chuỗi) thì không —
// script này bắt nốt.
import { readFileSync } from "node:fs";

const LOCALES = ["vi", "en", "ja"];
const load = (l) =>
  JSON.parse(readFileSync(`src/lib/i18n/dictionaries/${l}.json`, "utf8"));

function shape(value, prefix = "") {
  if (Array.isArray(value)) return [`${prefix}[]`];
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .flatMap((k) => shape(value[k], prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

const base = shape(load("vi"));
let bad = 0;

for (const locale of LOCALES.slice(1)) {
  const other = shape(load(locale));
  const missing = base.filter((k) => !other.includes(k));
  const extra = other.filter((k) => !base.includes(k));
  if (missing.length || extra.length) {
    bad = 1;
    console.error(`\n[${locale}]`);
    missing.forEach((k) => console.error(`  THIEU so voi vi: ${k}`));
    extra.forEach((k) => console.error(`  THUA so voi vi : ${k}`));
  }
}

// Placeholder {name} bị dịch mất cũng là lỗi im lặng — kiểm luôn
const PLACEHOLDER = /\{(\w+)\}/g;
function placeholders(obj, path = "", out = new Map()) {
  if (typeof obj === "string") {
    const found = [...obj.matchAll(PLACEHOLDER)].map((m) => m[1]).sort();
    if (found.length) out.set(path, found.join(","));
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => placeholders(v, `${path}[${i}]`, out));
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) placeholders(v, path ? `${path}.${k}` : k, out);
  }
  return out;
}

const basePh = placeholders(load("vi"));
for (const locale of LOCALES.slice(1)) {
  const otherPh = placeholders(load(locale));
  for (const [path, ph] of basePh) {
    if (otherPh.get(path) !== ph) {
      bad = 1;
      console.error(`\n[${locale}] placeholder lech tai ${path}: vi="${ph}" ${locale}="${otherPh.get(path) ?? "(khong co)"}"`);
    }
  }
}

// Ký tự Cyrillic lọt vào bản dịch là dấu hiệu dịch máy hỏng hoặc gõ nhầm bảng mã —
// đã xảy ra hai lần khi soạn bản tiếng Nhật ("технолог", "управление"). Không ngôn ngữ
// nào của dự án dùng Cyrillic nên mọi ký tự trong dải này đều là lỗi.
const CYRILLIC = /[Ѐ-ӿ]/;

function scanCyrillic(value, locale, path = "") {
  if (typeof value === "string") {
    if (CYRILLIC.test(value)) {
      bad = 1;
      console.error(`\n[${locale}] ky tu Cyrillic tai ${path}: ${value.slice(0, 60)}`);
    }
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => scanCyrillic(v, locale, `${path}[${i}]`));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      scanCyrillic(v, locale, path ? `${path}.${k}` : k);
    }
  }
}

for (const locale of LOCALES) scanCyrillic(load(locale), locale);

console.log(
  bad ? "\nCO LOI" : "OK: hinh dang, placeholder va bang ma deu hop le",
);
process.exit(bad);

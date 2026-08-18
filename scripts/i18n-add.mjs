/**
 * Chèn một namespace vào cả ba dictionary, giữ nguyên thứ tự key.
 * Dùng: node scripts/i18n-add.mjs <namespace> <chen-truoc-key> <file-payload.json>
 * payload có dạng { vi: {...}, en: {...}, ja: {...} }
 */
import { readFileSync, writeFileSync } from "node:fs";

const [ns, before, payloadPath] = process.argv.slice(2);
const payload = JSON.parse(readFileSync(payloadPath, "utf8"));

for (const locale of ["vi", "en", "ja"]) {
  const p = `src/lib/i18n/dictionaries/${locale}.json`;
  const dict = JSON.parse(readFileSync(p, "utf8"));
  if (ns in dict) throw new Error(`${locale}: namespace "${ns}" da ton tai`);

  const out = {};
  for (const key of Object.keys(dict)) {
    if (key === before) out[ns] = payload[locale];
    out[key] = dict[key];
  }
  if (!(ns in out)) out[ns] = payload[locale];

  writeFileSync(p, JSON.stringify(out, null, 2) + "\n");
}
console.log(`da them namespace "${ns}" vao ca ba dictionary`);

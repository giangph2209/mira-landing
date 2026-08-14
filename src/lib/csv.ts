/** BOM UTF-8: thiếu byte này là Excel trên Windows đọc file thành mojibake với tiếng Việt */
const UTF8_BOM = "﻿";

function escapeCell(value: unknown): string {
  if (value == null) return "";

  const raw = value instanceof Date ? value.toISOString() : String(value);

  // Chặn công thức: một ô bắt đầu bằng = + - @ sẽ được Excel/Sheets thực thi
  const guarded = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;

  if (/[",\r\n]/.test(guarded)) {
    return `"${guarded.replace(/"/g, '""')}"`;
  }
  return guarded;
}

export function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(escapeCell).join(",")];
  for (const row of rows) {
    lines.push(row.map(escapeCell).join(","));
  }
  // CRLF theo RFC 4180
  return UTF8_BOM + lines.join("\r\n") + "\r\n";
}

export function csvResponse(filename: string, body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Thay {name} trong chuỗi dictionary bằng giá trị thật.
 *
 * Cố ý giữ ở mức tối thiểu: dự án không có nhu cầu số nhiều hay định dạng số theo
 * locale, nên không đáng kéo cả ICU MessageFormat vào.
 */
export function t(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

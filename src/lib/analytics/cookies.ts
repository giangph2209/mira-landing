/** Tên cookie theo dõi. Tách riêng để route handler nào cũng import được mà không kéo
 *  theo cả module route của nhau. */
export const VISITOR_COOKIE = "mira_vid";
export const SESSION_COOKIE = "mira_sid";

/** 400 ngày — server Set-Cookie httpOnly nên không bị Safari ITP cắt còn 7 ngày */
export const VISITOR_MAX_AGE = 400 * 24 * 60 * 60;
/** Cửa sổ phiên 30 phút, được cấp lại mỗi lần beacon bắn */
export const SESSION_MAX_AGE = 30 * 60;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Cookie giả mạo có thể tiêm primary key rác — chỉ chấp nhận đúng dạng uuid */
export function readTrackingId(value: string | undefined): string | null {
  return value && UUID_RE.test(value) ? value.toLowerCase() : null;
}

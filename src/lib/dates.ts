// Dates across the site are stored as "DD/MM/YYYY" strings.
const DATE_RE = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
const DAY_MS = 1440 * 60 * 1000;

function parseParts(value: string): [number, number, number] | null {
  const m = value.match(DATE_RE);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

export function parseDate(value: string): Date {
  const p = parseParts(value);
  return p ? new Date(p[2], p[1] - 1, p[0]) : new Date(NaN);
}

/** Sortable numeric key (YYYYMMDD); 0 when missing/invalid. */
export function dateKey(value?: string | null): number {
  const p = value ? parseParts(value) : null;
  return p ? p[2] * 10000 + p[1] * 100 + p[0] : 0;
}

/** "YYYY-MM-DD" for <time dateTime>. */
export function toIsoDate(value: string): string {
  const p = parseParts(value);
  if (!p) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${p[2]}-${pad(p[1])}-${pad(p[0])}`;
}

export function formatDate(value: string): string {
  return parseDate(value).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** "HOJE" / "ONTEM" / original string. */
export function relativeDate(value: string, now = new Date()): string {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((today.getTime() - parseDate(value).getTime()) / DAY_MS);
  return diff === 0 ? "HOJE" : diff === 1 ? "ONTEM" : value;
}

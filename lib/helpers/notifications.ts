export function normaliseSingle<T>(val: T | T[] | null): T | null {
  if (!val) return null;
  return Array.isArray(val) ? (val[0] ?? null) : val;
}

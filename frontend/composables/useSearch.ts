/**
 * matchesQuery – multi-word partial search helper
 *
 * Splits the query into individual words and returns true if ANY word appears
 * at least once somewhere in the provided field values (OR logic).
 *
 * Examples:
 *   matchesQuery('barca spain', ['Barcelona El Prat Airport', 'Barcelona', 'Spain'])  → true
 *   matchesQuery('icn incheon',  ['ICN', 'Incheon International Airport', 'Korea'])   → true
 *   matchesQuery('tokyo',        ['Narita', 'Japan'])                                  → false
 */
export function matchesQuery(rawQuery: string, fields: (string | null | undefined)[]): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  const haystack = fields
    .filter(Boolean)
    .map((f) => (f as string).toLowerCase())
    .join(' ');

  return q.split(/\s+/).some((word) => haystack.includes(word));
}

import { defineEventHandler, getQuery } from 'h3';
import airports from '../data/airports';

export default defineEventHandler((event) => {
  const { q } = getQuery(event);
  if (!q) return airports;
  const needle = String(q).toLowerCase();
  return (airports as any[]).filter((a) =>
    ['name', 'iata', 'city', 'country'].some((k) =>
      String(a[k] || '').toLowerCase().includes(needle)
    )
  );
});

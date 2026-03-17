import { defineEventHandler, getQuery } from 'h3';
import cruisePorts from '../data/cruise-ports';

export default defineEventHandler((event) => {
  const { q } = getQuery(event);
  if (!q) return cruisePorts;
  const needle = String(q).toLowerCase();
  return (cruisePorts as unknown as any[]).filter((p) =>
    ['name', 'city', 'country'].some((k) =>
      String(p[k] || '').toLowerCase().includes(needle)
    )
  );
});

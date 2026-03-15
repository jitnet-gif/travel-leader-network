import { defineEventHandler, getQuery } from 'h3';
import countries from '../data/countries';

export default defineEventHandler((event) => {
  const { q } = getQuery(event);
  if (!q) return countries;
  const needle = String(q).toLowerCase();
  return (countries as any[]).filter((c) =>
    String(c.name || '').toLowerCase().includes(needle)
  );
});

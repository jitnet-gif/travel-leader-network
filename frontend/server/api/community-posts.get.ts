import { defineEventHandler, getQuery } from 'h3';
import posts from '../data/community-posts';

export default defineEventHandler((event) => {
  const { q } = getQuery(event);
  if (!q) return posts;
  const needle = String(q).toLowerCase();
  return (posts as any[]).filter((p) =>
    String(p.title || '').toLowerCase().includes(needle)
  );
});

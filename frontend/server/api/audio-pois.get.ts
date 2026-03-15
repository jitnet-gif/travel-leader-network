import { defineEventHandler, getQuery } from 'h3';
import audioPois from '../data/audio-pois';

export default defineEventHandler((event) => {
  const { q } = getQuery(event);
  if (!q) return audioPois;
  const needle = String(q).toLowerCase();
  return (audioPois as any[]).filter((p) =>
    String(p.name || '').toLowerCase().includes(needle)
  );
});

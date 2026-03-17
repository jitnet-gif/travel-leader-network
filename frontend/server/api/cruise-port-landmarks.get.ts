// GET /api/cruise-port-landmarks?port=<portName>
import landmarks from '../data/cruise-port-landmarks';

export default defineEventHandler((event) => {
  const { port } = getQuery(event) as { port?: string };
  if (port) {
    const match = landmarks.find(
      (l) => l.portName.toLowerCase() === port.toLowerCase()
    );
    return match ?? null;
  }
  return landmarks;
});

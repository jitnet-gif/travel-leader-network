import { defineEventHandler, getQuery } from 'h3';
import { useRuntimeConfig } from '#imports';

const FALLBACK = [
  { id: 1, name: 'Vancouver Cruise Port', country: 'Canada', shuttle_bus: false, taxi: false, meeting_point: 'Main terminal gate' },
  { id: 2, name: 'Dubai Cruise Port', country: 'United Arab Emirates', shuttle_bus: true, taxi: true, meeting_point: 'Terminal B arrivals gate' },
  { id: 3, name: 'Singapore Cruise Port', country: 'Singapore', shuttle_bus: false, taxi: true, meeting_point: 'Main terminal gate' },
  { id: 4, name: 'Athens Cruise Port', country: 'Greece', shuttle_bus: false, taxi: true, meeting_point: 'Terminal B arrivals gate' },
  { id: 5, name: 'Istanbul Cruise Port', country: 'Turkey', shuttle_bus: true, taxi: false, meeting_point: 'Pier entrance signage' },
  { id: 6, name: 'Barcelona Cruise Port', country: 'Spain', shuttle_bus: true, taxi: false, meeting_point: 'Arrivals hall information desk' },
  { id: 7, name: 'Seattle Cruise Port', country: 'United States', shuttle_bus: false, taxi: false, meeting_point: 'Arrivals hall information desk' },
  { id: 8, name: 'Los Angeles Cruise Port', country: 'United States', shuttle_bus: false, taxi: false, meeting_point: 'Arrivals hall information desk' },
  { id: 9, name: 'Stockholm Cruise Port', country: 'Sweden', shuttle_bus: true, taxi: true, meeting_point: 'Main terminal gate' },
  { id: 10, name: 'Shanghai Cruise Port', country: 'China', shuttle_bus: false, taxi: false, meeting_point: 'Terminal B arrivals gate' },
  { id: 11, name: 'Hong Kong Cruise Port', country: 'Hong Kong', shuttle_bus: true, taxi: false, meeting_point: 'Main terminal gate' },
  { id: 12, name: 'Lisbon Cruise Port', country: 'Portugal', shuttle_bus: false, taxi: false, meeting_point: 'Terminal B arrivals gate' },
  { id: 13, name: 'Sydney Cruise Port', country: 'Australia', shuttle_bus: true, taxi: false, meeting_point: 'Pier entrance signage' },
  { id: 14, name: 'Tokyo Cruise Port', country: 'Japan', shuttle_bus: true, taxi: true, meeting_point: 'Pier entrance signage' },
  { id: 15, name: 'Venice Cruise Port', country: 'Italy', shuttle_bus: false, taxi: false, meeting_point: 'Pier entrance signage' },
  { id: 16, name: 'Miami Cruise Port', country: 'United States', shuttle_bus: true, taxi: true, meeting_point: 'Arrivals hall information desk' },
  { id: 17, name: 'Naples Cruise Port', country: 'Italy', shuttle_bus: true, taxi: false, meeting_point: 'Main terminal gate' },
  { id: 18, name: 'Rome Cruise Port', country: 'Italy', shuttle_bus: false, taxi: true, meeting_point: 'Arrivals hall information desk' },
  { id: 19, name: 'Copenhagen Cruise Port', country: 'Denmark', shuttle_bus: true, taxi: false, meeting_point: 'Arrivals hall information desk' },
];

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const base = config.public.apiBase || 'http://localhost:4000';
  const query = getQuery(event);

  const url = new URL('/api/cruise-ports', base);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  });

  try {
    return await $fetch(url.toString());
  } catch {
    return FALLBACK;
  }
});

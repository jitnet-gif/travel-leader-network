import { createError, defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.aerodataboxKey;
  const flight = event.context.params?.flight;

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'AeroDataBox key missing' });
  }
  if (!flight) {
    throw createError({ statusCode: 400, statusMessage: 'Flight number required' });
  }

  const query = getQuery(event);
  const date = typeof query.date === 'string' && query.date.length > 0 ? query.date : new Date().toISOString().slice(0, 10);

  const url = `https://aerodatabox.p.rapidapi.com/flights/number/${encodeURIComponent(flight)}/${date}`;

  try {
    const data: any = await $fetch(url, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
      },
      query: { withLocation: false, withAircraftImage: false }
    });

    const firstLeg = Array.isArray(data) ? data[0] : null;
    const arrival = firstLeg?.arrival || {};

    return {
      flight,
      date,
      status: firstLeg?.status || null,
      terminal: arrival?.terminal || null,
      gate: arrival?.gate || null,
      baggageBelt: arrival?.baggageBelt || null,
      scheduled: arrival?.scheduledTime?.local || null,
      estimated: arrival?.revisedTime?.local || null
    };
  } catch (error: any) {
    throw createError({
      statusCode: error?.response?.status || 500,
      statusMessage: error?.data?.message || error?.message || 'AeroDataBox request failed'
    });
  }
});

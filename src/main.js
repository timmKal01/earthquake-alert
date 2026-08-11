import { Actor, log } from 'apify';
import { fetchEarthquakes } from './usgs.js';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const { latitude, longitude, radiusKm = 300, minMagnitude = 4.5, alertLevel = 'all', daysBack = 7, maxResults = 25 } = input;

/** Must match the event name configured in this Actor's pay-per-event pricing on Apify. */
const EARTHQUAKE_SEARCH_EVENT = 'earthquake-search';

const endDate = new Date();
const startDate = new Date(endDate.getTime() - daysBack * 24 * 60 * 60 * 1000);

const earthquakes = await fetchEarthquakes({
    latitude,
    longitude,
    radiusKm,
    minMagnitude,
    alertLevel,
    startDate,
    endDate,
    limit: Math.min(maxResults, 100),
});

for (const eq of earthquakes) {
    await Actor.pushData(eq);
}

await Actor.charge({ eventName: EARTHQUAKE_SEARCH_EVENT });

log.info(`Pushed ${earthquakes.length} earthquake(s)`);

await Actor.exit();

const UA = 'EarthquakeAlert/0.1 (+contact: earthquake-alert-admin@example.com)';
const BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

const TRANSIENT_STATUSES = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 4;
const REQUEST_TIMEOUT_MS = 15_000;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options) {
    let lastError;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        let res;
        try {
            res = await fetch(url, { ...options, signal: controller.signal });
        } catch (err) {
            lastError = err.name === 'AbortError' ? new Error(`Request timed out after ${REQUEST_TIMEOUT_MS}ms: ${url}`) : err;
            if (attempt < MAX_ATTEMPTS) {
                await sleep(1000 * 2 ** (attempt - 1));
                continue;
            }
            throw lastError;
        } finally {
            clearTimeout(timeoutId);
        }
        if (res.ok) return res;
        if (!TRANSIENT_STATUSES.has(res.status)) {
            throw new Error(`USGS request failed: ${res.status} ${res.statusText}`);
        }
        lastError = new Error(`USGS request failed: ${res.status} ${res.statusText}`);
        if (attempt < MAX_ATTEMPTS) await sleep(1000 * 2 ** (attempt - 1));
    }
    throw lastError;
}

export async function fetchEarthquakes({ latitude, longitude, radiusKm, minMagnitude, alertLevel, startDate, endDate, limit }) {
    const params = {
        format: 'geojson',
        starttime: startDate.toISOString().slice(0, 10),
        endtime: endDate.toISOString().slice(0, 10),
        minmagnitude: String(minMagnitude),
        orderby: 'time',
        limit: String(limit),
    };
    if (latitude !== undefined && latitude !== null && longitude !== undefined && longitude !== null) {
        params.latitude = String(latitude);
        params.longitude = String(longitude);
        params.maxradiuskm = String(radiusKm);
    }
    if (alertLevel && alertLevel !== 'all') {
        params.alertlevel = alertLevel;
    }

    const res = await fetchWithRetry(`${BASE_URL}?${new URLSearchParams(params)}`, { headers: { 'User-Agent': UA } });
    const data = await res.json();
    return (data.features ?? []).map((f) => ({
        eventId: f.id,
        magnitude: f.properties.mag,
        magType: f.properties.magType,
        place: f.properties.place,
        time: new Date(f.properties.time).toISOString(),
        alertLevel: f.properties.alert,
        tsunami: f.properties.tsunami === 1,
        felt: f.properties.felt,
        cdi: f.properties.cdi,
        significance: f.properties.sig,
        status: f.properties.status,
        depthKm: f.geometry?.coordinates?.[2] ?? null,
        latitude: f.geometry?.coordinates?.[1] ?? null,
        longitude: f.geometry?.coordinates?.[0] ?? null,
        url: f.properties.url,
    }));
}

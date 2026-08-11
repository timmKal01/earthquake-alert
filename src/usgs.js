const UA = 'EarthquakeAlert/0.1 (+contact: earthquake-alert-admin@example.com)';
const BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

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

    const res = await fetch(`${BASE_URL}?${new URLSearchParams(params)}`, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`USGS request failed: ${res.status}`);

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

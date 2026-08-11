# Earthquake Alert — Recent Seismic Activity by Region

Search recent earthquakes worldwide by minimum magnitude, a region (radius
around a latitude/longitude), or USGS PAGER estimated-impact level. Get back
magnitude, location, depth, tsunami flag, and a link to the full USGS event
page — most recent first.

Built for catastrophe/insurance risk teams, logistics and supply-chain
monitoring, and disaster-response coordination watching a specific region.

## Input

```json
{
  "latitude": 34.0522,
  "longitude": -118.2437,
  "radiusKm": 300,
  "minMagnitude": 4.5,
  "alertLevel": "all",
  "daysBack": 7,
  "maxResults": 25
}
```

| Field | Type | Description |
|---|---|---|
| `latitude` / `longitude` | number | Center point for a regional search. Leave both blank for a worldwide search. |
| `radiusKm` | number | Search radius around the center point, in km. Only used with `latitude`/`longitude`. Default `300`. |
| `minMagnitude` | number | Only return earthquakes at or above this magnitude. Default `4.5`. |
| `alertLevel` | string | USGS PAGER estimated impact: `all`, `green`, `yellow`, `orange`, or `red`. Most earthquakes have no alert level — leave `all` unless specifically hunting for significant events. |
| `daysBack` | number | How many days back from today to search. Default `7`, max `365`. |
| `maxResults` | number | Max earthquakes to return, most recent first. Default `25`, max `100`. |

## Output

One record per earthquake:

```json
{
  "eventId": "us6000tjqj",
  "magnitude": 5.1,
  "magType": "mb",
  "place": "232 km SSW of Pagar Alam, Indonesia",
  "time": "2026-08-10T17:08:06.809Z",
  "alertLevel": null,
  "tsunami": false,
  "felt": null,
  "cdi": null,
  "significance": 400,
  "status": "reviewed",
  "depthKm": 21.72,
  "latitude": -5.9347,
  "longitude": 102.3607,
  "url": "https://earthquake.usgs.gov/earthquakes/eventpage/us6000tjqj"
}
```

## How it works

Direct calls to the official [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/)
FDSN event API — the same data source behind USGS's own earthquake maps. No
API key, no proxy, no login, no scraping.

## Pricing note

Billed per **search**, not per earthquake returned — one charge whether the
search returns 1 event or 100.

## Related products

Looking for other risk-monitoring signals?

- [Field Operations Risk Briefing](https://github.com/timmKal01/field-operations-risk-briefing) — weather + space-weather conditions by location
- [Space Weather Alert](https://github.com/timmKal01/space-weather-alert) — geomagnetic storm and radio-blackout conditions

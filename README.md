# Earthquake Tracker: Recent Quakes by Region

Recent earthquake data for insurance and catastrophe risk teams, supply
chain and logistics monitoring, and disaster response. Search earthquakes
worldwide by minimum magnitude, by region (a radius around a point) or by
USGS PAGER impact level, and get one row per quake from the official USGS
feed, most recent first.

## What you get

One row per earthquake:

- Magnitude, depth, place description and coordinates
- The time of the quake
- USGS PAGER alert level (estimated impact) and tsunami flag
- Felt reports and significance score
- A link to the full USGS event page

## Who this is for

- **Insurance and catastrophe risk teams** checking which quakes hit near insured locations.
- **Supply chain and logistics teams** watching regions where suppliers, warehouses or routes sit.
- **Disaster response coordinators** following significant quakes in their area.

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

- [Field Ops Risk Briefing](https://apify.com/m_ctim/field-operations-risk-briefing): weather + space-weather conditions by location
- [Space Weather Alerts](https://apify.com/m_ctim/space-weather-alert): geomagnetic storm and radio-blackout conditions

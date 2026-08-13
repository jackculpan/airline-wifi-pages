# Airline In-Flight WiFi — Programmatic SEO Pages (MER-3)

A repeatable content pipeline that turns SeatWiFi fleet data into one SEO page
per airline. Output: 26 airline pages + 1 hub page, served as a static site on
Render (own domain, own template, full SEO control).

## Pipeline

1. **Fetch** WiFi data per airline from the SeatWiFi MCP tools
   (`get_airline_wifi`, `get_rollouts`, `get_speed_stats`). Saved to
   `data/airlines.json`.
2. **Build** with `node src/build.js` (or `npm run build`). Reads
   `data/airlines.json`, writes:
   - `dist/<slug>.html` — one page per airline (served at `/<slug>`)
   - `dist/index.html` — the hub / comparison table (served at `/`)
   - `dist/sitemap.xml` — all page URLs
   - `dist/manifest.json` — slug, title, meta description, OG image, source file
3. **Publish** by deploying the repo as a Render static site. Render runs the
   build and serves `dist/` over its CDN with pretty URLs (`/united-airlines`).

## Deploy (Render static site)

- Build command: `node src/build.js`
- Publish path: `dist`
- Env var `SITE_URL` sets the canonical base URL (e.g. the onrender.com URL, or
  a custom domain later). The build reads it and writes correct canonical,
  Open Graph, sitemap, and internal-link URLs. No code change needed to move
  domains — set `SITE_URL` and redeploy.

## Files (all < 500 lines)

- `src/providers.js` — WiFi provider metadata (name, orbit, speed, description).
- `src/content.js` — derives cost, Starlink status, and FAQ from fleet data.
- `src/og.js` — builds OG meta image URLs via the OG image API.
- `src/template.js` — the airline page HTML template + inline CSS + JSON-LD.
- `src/hub.js` — the hub / comparison page template.
- `src/build.js` — orchestrator.

## SEO features per page

- Unique title, meta description, canonical URL.
- Open Graph + Twitter card meta with a generated OG image.
- `FAQPage` and `BreadcrumbList` JSON-LD structured data.
- Quick-facts table, provider explainer, Starlink section, FAQ.
- Internal links: hub ↔ page, and 6 related airlines per page.

## Refresh cadence

Re-run the fetch step and `node src/build.js` on a schedule (weekly is enough;
SeatWiFi data changes often). Add airlines by appending to `data/airlines.json`
— no template changes needed. A push to the repo redeploys the site.

const { esc, CSS, costBadge } = require("./template");

function hubHtml(rows, cfg) {
  const url = cfg.hubUrl;
  const title = "Airline In-Flight WiFi Guide: Providers, Cost & Starlink (2026)";
  const desc = `Compare in-flight WiFi across ${rows.length} airlines: provider, free or paid, speed, and Starlink rollout. Updated for 2026.`;
  const listItems = rows
    .map(
      (r) =>
        `<a href="${esc(cfg.hubUrl)}/${esc(r.a.slug)}">${esc(r.a.name)}<span>${esc(r.d.providerNames)} · ${esc(r.d.cost)}</span></a>`
    )
    .join("");
  const tableRows = rows
    .map(
      (r) =>
        `<tr><td><a href="${esc(cfg.hubUrl)}/${esc(r.a.slug)}">${esc(r.a.name)}</a></td><td>${esc(r.d.providerNames)}</td><td>${costBadge(r.d.cost)}</td><td>${r.d.starlink ? '<span class="badge b-star">Yes</span>' : (r.d.hasWifi ? "No" : "&mdash;")}</td></tr>`
    )
    .join("");
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: rows.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${r.a.name} in-flight WiFi`,
      url: `${cfg.hubUrl}/${r.a.slug}`,
    })),
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${esc(url)}">
<style>${CSS}</style>
<script type="application/ld+json">${JSON.stringify(itemListLd)}</script>
</head>
<body>
<div class="wrap">
<div class="crumbs">${esc(cfg.brand)} › Airline WiFi</div>
<h1>Airline In-Flight WiFi Guide</h1>
<p class="lede">Which airlines have free WiFi, which use Starlink, and how fast is it? Compare ${rows.length} major airlines below, then open any airline for the full picture.</p>
<table>
<tr><th style="width:auto">Airline</th><th style="width:auto;background:#f1f5f9">Provider</th><th style="width:auto;background:#f1f5f9">Cost</th><th style="width:auto;background:#f1f5f9">Starlink</th></tr>
${tableRows}
</table>
<h2>Browse airlines</h2>
<div class="grid">${listItems}</div>
<div class="cta">
<h2>Check WiFi for your exact flight</h2>
<p>Get the predicted WiFi provider and Starlink odds for your flight number, plus miles, points, and seat tips.</p>
<a href="${esc(cfg.siteUrl)}">Explore ${esc(cfg.brand)} →</a>
</div>
<p class="foot">WiFi availability is predicted from fleet data and changes often. Source: SeatWiFi. Part of ${esc(cfg.brand)}.</p>
</div>
</body>
</html>`;
}

module.exports = { hubHtml };

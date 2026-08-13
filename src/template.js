const { provider } = require("./providers");
const { ogImage } = require("./og");

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const CSS = `
*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#0f172a;background:#f8fafc;line-height:1.6}
.wrap{max-width:820px;margin:0 auto;padding:24px 20px 64px}
a{color:#1d4ed8;text-decoration:none}a:hover{text-decoration:underline}
.crumbs{font-size:13px;color:#64748b;margin-bottom:18px}
h1{font-size:32px;line-height:1.2;margin:0 0 8px}
h2{font-size:22px;margin:34px 0 12px;border-bottom:2px solid #e2e8f0;padding-bottom:6px}
.lede{font-size:18px;color:#334155;margin:0 0 20px}
.updated{font-size:13px;color:#64748b;margin-bottom:24px}
table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden}
th,td{text-align:left;padding:12px 16px;border-bottom:1px solid #eef2f7;font-size:15px}
th{width:38%;background:#f1f5f9;color:#475569;font-weight:600}
tr:last-child td,tr:last-child th{border-bottom:none}
.badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:13px;font-weight:600}
.b-star{background:#ecfdf5;color:#047857}.b-paid{background:#fef3c7;color:#92400e}.b-none{background:#fee2e2;color:#b91c1c}.b-free{background:#eff6ff;color:#1d4ed8}
.card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px 18px;margin:12px 0}
.card h3{margin:0 0 6px;font-size:17px}
.card p{margin:0;color:#475569;font-size:15px}
.card .meta{margin-top:8px;font-size:13px;color:#64748b}
.faq{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:6px 18px;margin:12px 0}
.faq details{border-bottom:1px solid #eef2f7;padding:12px 0}
.faq details:last-child{border-bottom:none}
.faq summary{font-weight:600;cursor:pointer;font-size:16px}
.faq p{color:#475569;margin:8px 0 0;font-size:15px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}
.grid a{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;display:block;font-weight:600;color:#0f172a}
.grid a:hover{border-color:#1d4ed8;text-decoration:none}
.grid a span{display:block;font-size:13px;color:#64748b;font-weight:400}
.cta{background:linear-gradient(135deg,#1e3a8a,#1d4ed8);color:#fff;border-radius:14px;padding:22px 24px;margin:34px 0 0}
.cta h2{color:#fff;border:none;margin:0 0 6px;padding:0}
.cta p{margin:0 0 14px;color:#dbeafe}
.cta a{display:inline-block;background:#fff;color:#1d4ed8;font-weight:700;padding:10px 18px;border-radius:8px}
.foot{margin-top:34px;font-size:13px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:16px}
@media(max-width:560px){.grid{grid-template-columns:1fr}h1{font-size:26px}th{width:46%}}
`;

function costBadge(cost) {
  if (/not available/i.test(cost)) return `<span class="badge b-none">${esc(cost)}</span>`;
  if (/paid/i.test(cost) && !/free/i.test(cost)) return `<span class="badge b-paid">${esc(cost)}</span>`;
  if (/free/i.test(cost)) return `<span class="badge b-free">${esc(cost)}</span>`;
  return `<span class="badge">${esc(cost)}</span>`;
}

function providerCards(a) {
  return a.providers
    .map((code) => {
      const p = provider(code);
      return `<div class="card"><h3>${esc(p.full)}</h3><p>${esc(p.desc)}</p><div class="meta">Type: ${esc(p.orbit)} &nbsp;·&nbsp; Speed: ${esc(p.speed)}</div></div>`;
    })
    .join("\n");
}

function faqSection(faqs) {
  const items = faqs
    .map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
    .join("\n");
  return `<div class="faq">${items}</div>`;
}

function relatedGrid(related) {
  return `<div class="grid">${related
    .map((r) => `<a href="${esc(r.url)}">${esc(r.name)}<span>In-flight WiFi guide</span></a>`)
    .join("")}</div>`;
}

function jsonLd(a, d, faqs, cfg, url) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Airline WiFi", item: cfg.hubUrl },
      { "@type": "ListItem", position: 2, name: `${a.name} WiFi`, item: url },
    ],
  };
  return (
    `<script type="application/ld+json">${JSON.stringify(faqLd)}</script>\n` +
    `<script type="application/ld+json">${JSON.stringify(crumbLd)}</script>`
  );
}

function pageHtml(a, d, faqs, related, cfg) {
  const url = `${cfg.hubUrl}/${a.slug}`;
  const title = `${a.name} In-Flight WiFi: Provider, Cost & Starlink (2026)`;
  const desc = `${a.name} in-flight WiFi guide: provider (${d.providerNames}), cost (${d.cost}), speed, and Starlink status. Updated ${a.lastUpdated}.`;
  const og = ogImage(a, d);
  const starRow = d.starlink
    ? `<tr><th>Starlink</th><td><span class="badge b-star">${esc(d.starlink)}</span></td></tr>`
    : "";

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
<meta property="og:type" content="article">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(og)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${esc(og)}">
<style>${CSS}</style>
${jsonLd(a, d, faqs, cfg, url)}
</head>
<body>
<div class="wrap">
<div class="crumbs"><a href="${esc(cfg.hubUrl)}">Airline WiFi</a> › ${esc(a.name)}</div>
<h1>${esc(a.name)} In-Flight WiFi</h1>
<p class="lede">Which WiFi provider does ${esc(a.name)} use, is it free, how fast is it, and does it have Starlink? Here is the current picture.</p>
<p class="updated">Last updated ${esc(a.lastUpdated)} · Data from SeatWiFi fleet tracking</p>

<table>
<tr><th>WiFi provider</th><td>${esc(d.providerNames)}</td></tr>
<tr><th>Cost</th><td>${costBadge(d.cost)}</td></tr>
<tr><th>Best for</th><td>${esc(d.hasWifi ? d.primary.grade : "Not available")}</td></tr>
<tr><th>Typical speed</th><td>${esc(d.hasWifi ? d.primary.speed : "Not available")}</td></tr>
${starRow}
<tr><th>Fleet notes</th><td>${esc(a.fleetInfo)}</td></tr>
</table>

<h2>What WiFi does ${esc(a.name)} use?</h2>
${providerCards(a)}

<h2>Is ${esc(a.name)} WiFi free?</h2>
<p>${costBadge(d.cost)} &nbsp; ${esc(a.fleetInfo)}</p>

${d.starlink ? `<h2>Does ${esc(a.name)} have Starlink?</h2>\n<p>Starlink status: <span class="badge b-star">${esc(d.starlink)}</span>. Starlink is a low-earth-orbit satellite network from SpaceX. It gives the fastest in-flight WiFi available, fast enough for streaming and video calls. ${esc(a.fleetInfo)}</p>` : ""}

<h2>How fast is ${esc(a.name)} WiFi?</h2>
<p>${esc(d.hasWifi ? d.primary.speed + ". It is generally good for " + d.primary.grade.toLowerCase() + "." : "WiFi is not currently available on " + a.name + ".")}</p>

<h2>${esc(a.name)} WiFi FAQ</h2>
${faqSection(faqs)}

<h2>Compare other airlines</h2>
${relatedGrid(related)}

<div class="cta">
<h2>Check WiFi before you fly</h2>
<p>Get the WiFi provider and Starlink odds for your exact flight, plus miles, points, and seat tips.</p>
<a href="${esc(cfg.siteUrl)}">Explore ${esc(cfg.brand)} →</a>
</div>

<p class="foot">WiFi availability is predicted from fleet data and changes often. Always confirm with ${esc(a.name)} before you rely on it. Source: SeatWiFi. Part of ${esc(cfg.brand)}.</p>
</div>
</body>
</html>`;
}

module.exports = { pageHtml, esc, CSS, costBadge };

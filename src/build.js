const fs = require("fs");
const path = require("path");
const { derive, faqs } = require("./content");
const { pageHtml } = require("./template");
const { hubHtml } = require("./hub");
const { ogImage } = require("./og");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const CFG = {
  brand: "Miles & Points Daily",
  siteUrl: (process.env.SITE_URL || "https://airline-wifi.onrender.com").replace(/\/+$/, ""),
  hubPath: "",
  get hubUrl() {
    return this.hubPath ? `${this.siteUrl}/${this.hubPath}` : this.siteUrl;
  },
};

function relatedFor(a, all, d) {
  const others = all.filter((x) => x.code !== a.code);
  const sameProvider = others.filter((x) => x.providers[0] === a.providers[0]);
  const rest = others.filter((x) => x.providers[0] !== a.providers[0]);
  const picked = [...sameProvider, ...rest].slice(0, 6);
  return picked.map((x) => ({
    name: x.name,
    url: `${CFG.hubUrl}/${x.slug}`,
  }));
}

function main() {
  const all = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "airlines.json"), "utf8"));
  if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

  const rows = [];
  const manifest = [];

  for (const a of all) {
    const d = derive(a);
    const f = faqs(a, d);
    const related = relatedFor(a, all, d);
    const html = pageHtml(a, d, f, related, CFG);
    const file = `${a.slug}.html`;
    fs.writeFileSync(path.join(DIST, file), html);
    rows.push({ a, d });
    manifest.push({
      code: a.code,
      slug: a.slug,
      name: a.name,
      title: `${a.name} In-Flight WiFi: Provider, Cost & Starlink (2026)`,
      description: `${a.name} in-flight WiFi guide: provider (${d.providerNames}), cost (${d.cost}), speed, and Starlink status. Updated ${a.lastUpdated}.`,
      ogImage: ogImage(a, d),
      file,
      parentPath: CFG.hubPath,
    });
  }

  const hub = hubHtml(rows, CFG);
  fs.writeFileSync(path.join(DIST, "index.html"), hub);
  manifest.unshift({
    code: "HUB",
    slug: CFG.hubPath,
    name: "Airline In-Flight WiFi Guide",
    title: "Airline In-Flight WiFi Guide: Providers, Cost & Starlink (2026)",
    description: `Compare in-flight WiFi across ${rows.length} airlines: provider, free or paid, speed, and Starlink rollout.`,
    ogImage: "",
    file: "index.html",
    parentPath: null,
  });

  const urls = [CFG.hubUrl, ...all.map((a) => `${CFG.hubUrl}/${a.slug}`)];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc></url>`)
    .join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);
  fs.writeFileSync(path.join(DIST, "manifest.json"), JSON.stringify(manifest, null, 2));

  const robots = `User-agent: *\nAllow: /\nSitemap: ${CFG.siteUrl}/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST, "robots.txt"), robots);

  console.log(`Built ${all.length} airline pages + hub + sitemap.`);
  console.log(`Output: ${DIST}`);
}

main();

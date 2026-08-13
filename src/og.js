const OG_BASE = "https://og-image-api.merchantai.workers.dev/";

function ogImage(a, d) {
  const params = new URLSearchParams({
    title: `${a.name} In-Flight WiFi`,
    subtitle: `${d.providerNames} • ${d.cost}`,
    template: "stats",
    stats: [
      `${d.primary.name}:Provider`,
      `${d.cost}:Cost`,
      d.starlink ? "Yes:Starlink" : (d.hasWifi ? "No:Starlink" : "None:WiFi"),
    ].join(","),
  });
  return OG_BASE + "?" + params.toString();
}

module.exports = { ogImage, OG_BASE };

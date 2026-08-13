const { provider } = require("./providers");

function costLabel(info, providers) {
  const hasFree = /\bfree\b/i.test(info);
  const hasPaid = /\bpaid\b|from \$|\$\d/i.test(info);
  if (providers.includes("none")) return "Not available";
  if (hasFree && hasPaid) return "Free and paid options";
  if (hasFree) return "Free (conditions apply)";
  if (hasPaid) return "Paid";
  return "Varies by route and fare";
}

function starlinkStatus(info, providers) {
  if (!providers.includes("starlink")) return null;
  const active = /active|live|equipped|since|operational|\d+\+? aircraft|first .*flight|world's largest/i.test(info);
  return active ? "Active and expanding" : "Announced, rollout underway";
}

function primaryProvider(providers) {
  return provider(providers[0]);
}

function derive(a) {
  const cost = costLabel(a.fleetInfo, a.providers);
  const starlink = starlinkStatus(a.fleetInfo, a.providers);
  const primary = primaryProvider(a.providers);
  const providerNames = a.providers.map((p) => provider(p).name).join(", ");
  const hasWifi = !a.providers.includes("none");
  return { cost, starlink, primary, providerNames, hasWifi };
}

function faqs(a, d) {
  const list = [];
  list.push({
    q: `What WiFi provider does ${a.name} use?`,
    a: d.hasWifi
      ? `${a.name} uses ${d.providerNames}. ${d.primary.desc}`
      : `${a.name} does not currently offer in-flight WiFi across its fleet. ${a.fleetInfo}`,
  });
  list.push({
    q: `Is ${a.name} in-flight WiFi free?`,
    a: `${d.cost}. ${a.fleetInfo}`,
  });
  if (d.starlink) {
    list.push({
      q: `Does ${a.name} have Starlink WiFi?`,
      a: `Yes. Starlink status: ${d.starlink}. ${a.fleetInfo}`,
    });
  }
  list.push({
    q: `How fast is ${a.name} in-flight WiFi?`,
    a: d.hasWifi
      ? `${d.primary.speed}. It is generally good for: ${d.primary.grade}.`
      : `Not available. ${a.name} does not currently offer in-flight WiFi.`,
  });
  return list;
}

module.exports = { derive, faqs, costLabel, starlinkStatus };

const PROVIDERS = {
  starlink: {
    name: "Starlink",
    full: "Starlink (SpaceX)",
    orbit: "Low Earth orbit (LEO) satellite",
    speed: "Very fast, typically 100-250 Mbps with low latency",
    grade: "Streaming and video calls",
    desc: "SpaceX's low-earth-orbit satellite network. It is the fastest in-flight WiFi available today. It is fast enough for HD streaming and video calls.",
  },
  viasat: {
    name: "Viasat",
    full: "Viasat (Ka-band)",
    orbit: "Geostationary satellite (Ka-band)",
    speed: "Fast, good for browsing and streaming",
    grade: "Browsing and streaming",
    desc: "A high-capacity geostationary Ka-band satellite network. It is reliable for browsing, email, and standard streaming.",
  },
  intelsat: {
    name: "Intelsat",
    full: "Intelsat 2Ku (formerly Gogo)",
    orbit: "Geostationary satellite (Ku-band)",
    speed: "Moderate, good for browsing and messaging",
    grade: "Browsing and messaging",
    desc: "Ku-band satellite WiFi, the former Gogo 2Ku system. It suits browsing, email, and light streaming.",
  },
  panasonic: {
    name: "Panasonic Avionics",
    full: "Panasonic Avionics (Ku-band)",
    orbit: "Geostationary satellite (Ku-band)",
    speed: "Moderate, good for browsing and streaming",
    grade: "Browsing and streaming",
    desc: "Ku-band satellite WiFi used across many long-haul fleets. It handles browsing, messaging, and streaming.",
  },
  inmarsat: {
    name: "Inmarsat GX",
    full: "Inmarsat GX Aviation (Ka-band)",
    orbit: "Geostationary satellite (Ka-band)",
    speed: "Fast, good for browsing and streaming",
    grade: "Browsing and streaming",
    desc: "Inmarsat's Global Xpress Ka-band network. It is reliable for short-haul and long-haul browsing and streaming.",
  },
  thales: {
    name: "Thales FlytLIVE",
    full: "Thales FlytLIVE (Ka-band)",
    orbit: "Geostationary satellite (Ka-band)",
    speed: "Fast, good for browsing and streaming",
    grade: "Browsing and streaming",
    desc: "Ka-band satellite WiFi used on several US narrowbody fleets.",
  },
  hughes: {
    name: "Hughes",
    full: "Hughes JUPITER (Ka-band)",
    orbit: "Geostationary satellite (Ka-band)",
    speed: "Moderate, good for browsing and streaming",
    grade: "Browsing and streaming",
    desc: "Ka-band satellite WiFi used on regional and older narrowbody aircraft.",
  },
  anuvu: {
    name: "Anuvu",
    full: "Anuvu (formerly Global Eagle)",
    orbit: "Geostationary satellite",
    speed: "Moderate, good for browsing",
    grade: "Browsing",
    desc: "Satellite WiFi provider used on several narrowbody fleets.",
  },
  intelsat_leo: {
    name: "Amazon Leo",
    full: "Amazon Leo (Project Kuiper)",
    orbit: "Low Earth orbit (LEO) satellite",
    speed: "Very fast (in development)",
    grade: "Streaming and video calls",
    desc: "Amazon's low-earth-orbit satellite network, planned for future in-flight use.",
  },
  none: {
    name: "No WiFi",
    full: "No in-flight WiFi",
    orbit: "Not applicable",
    speed: "Not available",
    grade: "Not available",
    desc: "This airline does not currently offer in-flight WiFi across its fleet.",
  },
  other: {
    name: "Other",
    full: "Other provider",
    orbit: "Varies",
    speed: "Varies by aircraft",
    grade: "Varies",
    desc: "This airline uses one or more connectivity providers that vary by aircraft type.",
  },
};

function provider(code) {
  return PROVIDERS[code] || PROVIDERS.other;
}

module.exports = { PROVIDERS, provider };

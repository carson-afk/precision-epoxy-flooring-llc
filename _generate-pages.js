#!/usr/bin/env node
/**
 * Generate programmatic SEO landing pages for Precision Epoxy Flooring LLC
 * Targets every (service x city) combo across Eastern Idaho + typo variants
 * Writes files to repo root + updates sitemap.xml
 */
const fs = require('fs');
const path = require('path');
const DIR = __dirname;

const BRAND = {
  name: "Precision Epoxy Flooring LLC",
  shortName: "Precision Epoxy",
  email: "reeganhampt@gmail.com",
  city: "Idaho Falls",
  state: "ID",
  region: "Eastern Idaho",
  domain: "https://precisionepoxyflooringllc.com",
};

/* ============================================================
   CITIES — Eastern Idaho service area
   ============================================================ */
const CITIES = [
  // Bonneville County
  { slug: 'idaho-falls',      name: 'Idaho Falls',    county: 'Bonneville County', zip: '83401', lat: 43.4917, lng: -112.0339 },
  { slug: 'ammon',            name: 'Ammon',          county: 'Bonneville County', zip: '83406', lat: 43.4732, lng: -111.9614 },
  { slug: 'iona',             name: 'Iona',           county: 'Bonneville County', zip: '83427', lat: 43.5274, lng: -111.9374 },
  { slug: 'ucon',             name: 'Ucon',           county: 'Bonneville County', zip: '83454', lat: 43.6024, lng: -111.9657 },
  { slug: 'lincoln-id',       name: 'Lincoln',        county: 'Bonneville County', zip: '83401', lat: 43.5158, lng: -112.0027 },
  { slug: 'irwin',            name: 'Irwin',          county: 'Bonneville County', zip: '83428', lat: 43.4254, lng: -111.2538 },
  { slug: 'swan-valley',      name: 'Swan Valley',    county: 'Bonneville County', zip: '83449', lat: 43.4615, lng: -111.3304 },
  // Madison County
  { slug: 'rexburg',          name: 'Rexburg',        county: 'Madison County',    zip: '83440', lat: 43.8260, lng: -111.7896 },
  { slug: 'sugar-city',       name: 'Sugar City',     county: 'Madison County',    zip: '83448', lat: 43.8716, lng: -111.7493 },
  { slug: 'newdale',          name: 'Newdale',        county: 'Madison County',    zip: '83436', lat: 43.8954, lng: -111.5888 },
  { slug: 'plano',            name: 'Plano',          county: 'Madison County',    zip: '83440', lat: 43.8513, lng: -111.7660 },
  // Bingham County
  { slug: 'blackfoot',        name: 'Blackfoot',      county: 'Bingham County',    zip: '83221', lat: 43.1905, lng: -112.3447 },
  { slug: 'shelley',          name: 'Shelley',        county: 'Bingham County',    zip: '83274', lat: 43.3815, lng: -112.1244 },
  { slug: 'firth',            name: 'Firth',          county: 'Bingham County',    zip: '83236', lat: 43.3093, lng: -112.1714 },
  { slug: 'aberdeen',         name: 'Aberdeen',       county: 'Bingham County',    zip: '83210', lat: 42.9444, lng: -112.8377 },
  { slug: 'atomic-city',      name: 'Atomic City',    county: 'Bingham County',    zip: '83215', lat: 43.4368, lng: -112.8141 },
  // Bannock County
  { slug: 'pocatello',        name: 'Pocatello',      county: 'Bannock County',    zip: '83201', lat: 42.8713, lng: -112.4455 },
  { slug: 'chubbuck',         name: 'Chubbuck',       county: 'Bannock County',    zip: '83202', lat: 42.9202, lng: -112.4654 },
  { slug: 'inkom',            name: 'Inkom',          county: 'Bannock County',    zip: '83245', lat: 42.7997, lng: -112.2518 },
  { slug: 'mccammon',         name: 'McCammon',       county: 'Bannock County',    zip: '83250', lat: 42.6499, lng: -112.1933 },
  { slug: 'lava-hot-springs', name: 'Lava Hot Springs',county: 'Bannock County',   zip: '83246', lat: 42.6196, lng: -112.0102 },
  { slug: 'downey',           name: 'Downey',         county: 'Bannock County',    zip: '83234', lat: 42.4321, lng: -112.1232 },
  // Jefferson County
  { slug: 'rigby',            name: 'Rigby',          county: 'Jefferson County',  zip: '83442', lat: 43.6724, lng: -111.9152 },
  { slug: 'menan',            name: 'Menan',          county: 'Jefferson County',  zip: '83434', lat: 43.7232, lng: -111.9938 },
  { slug: 'roberts',          name: 'Roberts',        county: 'Jefferson County',  zip: '83444', lat: 43.7180, lng: -112.1271 },
  { slug: 'lewisville',       name: 'Lewisville',     county: 'Jefferson County',  zip: '83431', lat: 43.6968, lng: -112.0349 },
  { slug: 'ririe',            name: 'Ririe',          county: 'Jefferson County',  zip: '83443', lat: 43.5824, lng: -111.7404 },
  { slug: 'mud-lake',         name: 'Mud Lake',       county: 'Jefferson County',  zip: '83450', lat: 43.8485, lng: -112.6291 },
  // Fremont County
  { slug: 'st-anthony',       name: 'St. Anthony',    county: 'Fremont County',    zip: '83445', lat: 43.9663, lng: -111.6824 },
  { slug: 'ashton',           name: 'Ashton',         county: 'Fremont County',    zip: '83420', lat: 44.0712, lng: -111.4474 },
  { slug: 'island-park',      name: 'Island Park',    county: 'Fremont County',    zip: '83429', lat: 44.4243, lng: -111.3690 },
  { slug: 'parker',           name: 'Parker',         county: 'Fremont County',    zip: '83438', lat: 43.9555, lng: -111.7327 },
  { slug: 'drummond',         name: 'Drummond',       county: 'Fremont County',    zip: '83423', lat: 44.0468, lng: -111.5482 },
  // Teton County
  { slug: 'driggs',           name: 'Driggs',         county: 'Teton County',      zip: '83422', lat: 43.7235, lng: -111.1115 },
  { slug: 'victor',           name: 'Victor',         county: 'Teton County',      zip: '83455', lat: 43.6018, lng: -111.1110 },
  { slug: 'tetonia',          name: 'Tetonia',        county: 'Teton County',      zip: '83452', lat: 43.8132, lng: -111.1685 },
  // Caribou County
  { slug: 'soda-springs',     name: 'Soda Springs',   county: 'Caribou County',    zip: '83276', lat: 42.6543, lng: -111.6043 },
  { slug: 'grace',            name: 'Grace',          county: 'Caribou County',    zip: '83241', lat: 42.5805, lng: -111.7305 },
  // Power County
  { slug: 'american-falls',   name: 'American Falls', county: 'Power County',      zip: '83211', lat: 42.7838, lng: -112.8576 },
  // Butte County
  { slug: 'arco',             name: 'Arco',           county: 'Butte County',      zip: '83213', lat: 43.6321, lng: -113.3000 },
  { slug: 'howe',             name: 'Howe',           county: 'Butte County',      zip: '83244', lat: 43.7890, lng: -113.0033 },
  { slug: 'moore',            name: 'Moore',          county: 'Butte County',      zip: '83255', lat: 43.7355, lng: -113.3854 },
  // Custer County
  { slug: 'mackay',           name: 'Mackay',         county: 'Custer County',     zip: '83251', lat: 43.9099, lng: -113.6118 },
  { slug: 'challis',          name: 'Challis',        county: 'Custer County',     zip: '83226', lat: 44.5076, lng: -114.2316 },
  // Lemhi County
  { slug: 'salmon',           name: 'Salmon',         county: 'Lemhi County',      zip: '83467', lat: 45.1755, lng: -113.8959 },
  // Cassia County
  { slug: 'burley',           name: 'Burley',         county: 'Cassia County',     zip: '83318', lat: 42.5358, lng: -113.7926 },
  { slug: 'albion',           name: 'Albion',         county: 'Cassia County',     zip: '83311', lat: 42.4124, lng: -113.5810 },
];

/* ============================================================
   SERVICES — every variant of epoxy/concrete coating queries
   ============================================================ */
const SERVICES = [
  { slug: 'garage-floor-epoxy',           name: 'Garage Floor Epoxy',           short: 'garage floor epoxy',           pitch: 'Decorative flake garage floor epoxy with polyaspartic top coats. Built for Idaho winters and warrantied for 10 years.' },
  { slug: 'garage-floor-coating',         name: 'Garage Floor Coating',         short: 'garage floor coating',         pitch: 'Premium garage floor coating systems &mdash; diamond grind prep, full broadcast, polyaspartic top coat.' },
  { slug: 'flake-floor',                  name: 'Flake Floor',                  short: 'flake floor',                  pitch: 'Decorative chip flake floors for garages, basements, and shops. Custom color blends, 10-year warranty.' },
  { slug: 'decorative-flake-floor',       name: 'Decorative Flake Floor',       short: 'decorative flake floor',       pitch: 'Decorative flake floors with vibrant chip blends &mdash; tougher than tile, cleaner than carpet.' },
  { slug: 'polyaspartic-coating',         name: 'Polyaspartic Coating',         short: 'polyaspartic coating',         pitch: 'UV-stable polyaspartic top coats &mdash; cure faster than epoxy, will not yellow, hold up against hot tires and UV.' },
  { slug: 'epoxy-floor-coating',          name: 'Epoxy Floor Coating',          short: 'epoxy floor coating',          pitch: 'Full-system epoxy floor coatings &mdash; commercial-grade resin, mechanically bonded to fully-prepped concrete.' },
  { slug: 'epoxy-flooring',               name: 'Epoxy Flooring',               short: 'epoxy flooring',               pitch: 'Premium epoxy flooring solutions for residential, commercial, and industrial spaces across Eastern Idaho.' },
  { slug: 'concrete-floor-coating',       name: 'Concrete Floor Coating',       short: 'concrete floor coating',       pitch: 'Concrete floor coating systems with full prep, repair, and high-build finishes that last decades.' },
  { slug: 'concrete-coatings',            name: 'Concrete Coatings',            short: 'concrete coatings',            pitch: 'Full-service concrete coatings &mdash; epoxy, polyaspartic, flake, sealing. One contractor, one warranty.' },
  { slug: 'basement-epoxy-floor',         name: 'Basement Epoxy Floor',         short: 'basement epoxy floor',         pitch: 'Basement epoxy floors that are easy to clean, look high-end, and handle moisture &mdash; a full alternative to carpet or tile.' },
  { slug: 'shop-floor-epoxy',             name: 'Shop Floor Epoxy',             short: 'shop floor epoxy',             pitch: 'Heavy-duty shop floor epoxy for workshops, detached buildings, and equipment storage. Built for real wear.' },
  { slug: 'pole-barn-floor-coating',      name: 'Pole Barn Floor Coating',      short: 'pole barn floor coating',      pitch: 'Pole barn and equipment building floor coatings &mdash; durable enough for tools, jacks, and dropped weights.' },
  { slug: 'commercial-epoxy-floor',       name: 'Commercial Epoxy Floor',       short: 'commercial epoxy floor',       pitch: 'Commercial epoxy floors for retail, showrooms, restaurants &mdash; brand color matching, slip-resistance available.' },
  { slug: 'metallic-epoxy-floor',         name: 'Metallic Epoxy Floor',         short: 'metallic epoxy floor',         pitch: 'Metallic epoxy floors with depth, color shift, and a high-gloss finish that looks custom every time.' },
  { slug: 'quartz-epoxy-floor',           name: 'Quartz Epoxy Floor',           short: 'quartz epoxy floor',           pitch: 'Broadcast quartz epoxy floors &mdash; slip-resistant, durable, and ideal for high-traffic commercial spaces.' },
  { slug: 'industrial-floor-coating',     name: 'Industrial Floor Coating',     short: 'industrial floor coating',     pitch: 'Industrial-grade floor coatings rated for forklifts, chemical exposure, and constant use.' },
  { slug: 'concrete-sealing',             name: 'Concrete Sealing',             short: 'concrete sealing',             pitch: 'Concrete sealing for garages, driveways, and patios. Locks out moisture, oil, and salt damage.' },
  { slug: 'concrete-staining',            name: 'Concrete Staining',            short: 'concrete staining',            pitch: 'Decorative concrete staining for indoor and outdoor surfaces &mdash; rich, variegated tones sealed for long-term wear.' },
  { slug: 'epoxy-contractor',             name: 'Epoxy Contractor',             short: 'epoxy contractor',             pitch: 'Idaho licensed and insured epoxy contractor specializing in flake floors and full-system coatings.' },
  // Common typo / alternate spellings
  { slug: 'epxoy-floor',                  name: 'Epoxy Floor',                  short: 'epxoy floor',                  pitch: 'Premium epoxy floor systems &mdash; often searched as "epxoy floor". Diamond-ground prep, polyaspartic top coats.' },
  { slug: 'expoxy-flooring',              name: 'Epoxy Flooring',               short: 'expoxy flooring',              pitch: 'Epoxy flooring (often searched as "expoxy") for garages, shops, basements, and commercial spaces.' },
  { slug: 'poly-aspartic-coating',        name: 'Polyaspartic Coating',         short: 'poly-aspartic coating',        pitch: 'Polyaspartic coatings (also written "poly-aspartic" or "poly aspartic") &mdash; the modern upgrade to traditional epoxy.' },
  { slug: 'garge-floor-coating',          name: 'Garage Floor Coating',         short: 'garge floor coating',          pitch: 'Garage floor coatings (often misspelled "garge floor coating") &mdash; full-system installs that hold up for a decade.' },
];

/* ============================================================
   PAGE TEMPLATES
   ============================================================ */

function head({ title, desc, canon, kw, schema }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<meta name="keywords" content="${kw}" />
<link rel="canonical" href="${canon}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
<link rel="stylesheet" href="/style.css" />
${schema || ''}
</head>`;
}

function chrome() {
  return `<div class="scroll-bar" aria-hidden="true"><div></div></div>
<div class="topbar"><div class="row">
  <div class="tb-left">
    <span><span class="tb-dot"></span>Idaho Falls, ID</span>
    <span><span class="tb-dot"></span>Mon-Sat 7a-7p</span>
    <span><span class="tb-dot"></span>Licensed &amp; Insured</span>
  </div>
  <a href="/contact.html" class="tb-phone">Free Estimate &rarr;</a>
</div></div>
<header class="site"><div class="nav-row">
  <a href="/" class="brand" aria-label="Precision Epoxy Flooring home">
    <span class="brand-mark"><img src="/images/precision-logo.svg" alt="Precision Epoxy Flooring logo" /></span>
    <span class="brand-type"><span class="big">Precision Epoxy</span><span class="small">Flooring LLC &middot; Idaho Falls, ID</span></span>
  </a>
  <button class="nav-toggle" data-menu-toggle aria-expanded="false">Menu</button>
  <nav class="nav-links" data-nav-links>
    <a href="/" class="">Home</a>
    <a href="/services.html" class="">Flake Floors</a>
    <a href="/gallery.html" class="">Gallery</a>
    <a href="/areas.html" class="active">Service Areas</a>
    <a href="/about.html" class="">About</a>
    <a href="/contact.html" class="nav-cta">Free Estimate <span class="arrow">&rarr;</span></a>
  </nav>
</div></header>`;
}

function footer() {
  return `<footer><div class="wrap-wide">
<div class="foot-grid">
<div><div class="foot-brand">Precision<br><span class="italic">Epoxy.</span></div><p class="foot-blurb">Idaho Falls' epoxy floor pros. One craft, done right. Decorative chip epoxy floors built for Idaho winters.</p></div>
<div><h5>Services</h5><ul><li><a href="/services/residential-garage.html">Residential Garage</a></li><li><a href="/services/shop-floor.html">Shops &amp; Work Areas</a></li><li><a href="/services/commercial-flake.html">Commercial Flake</a></li></ul></div>
<div><h5>Service Areas</h5><ul><li><a href="/areas/idaho-falls.html">Idaho Falls</a></li><li><a href="/areas/ammon.html">Ammon</a></li><li><a href="/areas/rigby.html">Rigby</a></li><li><a href="/areas/rexburg.html">Rexburg</a></li><li><a href="/areas/blackfoot.html">Blackfoot</a></li><li><a href="/areas/pocatello.html">Pocatello</a></li></ul></div>
<div><h5>Company</h5><ul><li><a href="/about.html">About</a></li><li><a href="/gallery.html">Gallery</a></li><li><a href="/contact.html">Contact</a></li><li><a href="mailto:${BRAND.email}">${BRAND.email}</a></li></ul></div>
</div>
<div class="foot-legal"><div>&copy; <span data-year>2026</span> ${BRAND.name} &middot; Idaho Falls, ID &middot; All rights reserved</div><div>Idaho Licensed &amp; Insured</div></div>
<div class="foot-credit">Website designed &amp; built by <a href="https://blackboxadvancements.com" target="_blank" rel="noopener">Blackbox Advancements</a></div>
</div></footer>
<div class="mobile-cta"><span>Free flake floor estimate?</span><a href="/contact.html" class="m-phone">Get Quote &rarr;</a></div>
<script src="/script.js" defer></script>`;
}

function renderGeoServicePage(service, city) {
  const slug = `${service.slug}-${city.slug}-id`;
  const canon = `${BRAND.domain}/${slug}.html`;
  const title = `${service.name} in ${city.name}, ID | ${BRAND.name}`;
  const desc = `${service.name} in ${city.name}, ${city.county}. ${service.pitch.replace(/<\/?[^>]+>/g, '').slice(0, 140)} Free estimate &mdash; reach ${BRAND.shortName}.`;
  const kw = `${service.short} ${city.name}, ${service.short} ${city.name} ID, ${service.short} ${city.name} Idaho, ${service.short} near me ${city.name}, epoxy floor ${city.name}`;
  const schema = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${BRAND.name} - ${city.name}`,
    "url": canon,
    "image": `${BRAND.domain}/images/flake-floors.jpg`,
    "description": `${service.name} in ${city.name}, Idaho. ${service.pitch.replace(/<\/?[^>]+>/g, '')}`,
    "address": {"@type": "PostalAddress", "addressLocality": city.name, "addressRegion": "ID", "postalCode": city.zip, "addressCountry": "US"},
    "geo": {"@type": "GeoCoordinates", "latitude": city.lat, "longitude": city.lng},
    "areaServed": {"@type": "City", "name": city.name},
    "makesOffer": {"@type": "Offer", "itemOffered": {"@type": "Service", "name": service.name}}
  })}</script>
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": BRAND.domain + "/"},
      {"@type": "ListItem", "position": 2, "name": "Service Areas", "item": BRAND.domain + "/areas.html"},
      {"@type": "ListItem", "position": 3, "name": city.name, "item": BRAND.domain + "/areas/" + city.slug + ".html"},
      {"@type": "ListItem", "position": 4, "name": service.name, "item": canon}
    ]
  })}</script>`;

  // Pick 4 nearby cities in the same county for cross-links
  const nearby = CITIES.filter(c => c.county === city.county && c.slug !== city.slug).slice(0, 5);

  return head({ title, desc, canon, kw, schema }) + `
<body>
${chrome()}

<section class="page-head">
  <div class="page-head-img" style="background-image:url('/images/flake-floors.jpg')"></div>
  <div class="wrap">
    <div class="crumb"><a href="/">Home</a> &rsaquo; <a href="/areas.html">Service Areas</a> &rsaquo; <a href="/areas/${city.slug}.html">${city.name}</a> &rsaquo; ${service.name}</div>
    <h1>${service.name} in <span class="italic">${city.name}, ID.</span></h1>
    <p class="lead">${service.pitch} Serving ${city.name} and the surrounding ${city.county} area.</p>
  </div>
</section>

<section class="section"><div class="prose" data-reveal>
  <h2>${service.name} for <span class="italic">${city.name}</span> homes &amp; businesses.</h2>
  <p>${BRAND.shortName} is the go-to ${service.short} contractor in ${city.name}, ${city.county}. Every project gets the same systematic install: industrial diamond grinding, full crack and spall repair, high-build base coat, decorative flake or finish broadcast (per spec), and a UV-stable polyaspartic top coat. We do not acid-etch and we do not use roll-on kits.</p>
  <p>If you are searching for &ldquo;${service.short} near me&rdquo; in ${city.name}, you are in the right place. We dispatch from Idaho Falls and cover ${city.name} and the rest of ${city.region || 'Eastern Idaho'} for free on-site walkthroughs and written quotes within 48 hours.</p>

  <h2>Why ${city.name} chooses <span class="italic">Precision Epoxy.</span></h2>
  <ul>
    <li><strong>Diamond grind every floor.</strong> Mechanical bond is the only way coatings last 10+ years on Idaho slabs.</li>
    <li><strong>Polyaspartic top coats.</strong> UV-stable, no yellowing, faster cure than legacy epoxy.</li>
    <li><strong>10-year warranty.</strong> We stand behind every ${service.short} install in ${city.name}.</li>
    <li><strong>Owner-operated.</strong> The person quoting your floor is the person doing the work. No subs.</li>
    <li><strong>Idaho licensed and insured.</strong> Local crew, local accountability.</li>
  </ul>

  <h2>Free ${service.short} estimate in ${city.name}.</h2>
  <p>Two ways to get a number for your ${city.name} project: try our <a href="/#estimator">60-second instant estimator</a> for a wide ballpark, or <a href="/contact.html">send us a note</a> and we will schedule a free on-site walkthrough.</p>

  <div class="estimate-cta">
    <span class="eyebrow">Free Estimate</span>
    <h3>Ready for your <span class="italic">free walkthrough?</span></h3>
    <p>We&rsquo;ll come measure the slab, talk colors and finishes, and send a written line-item quote within 48 hours. No pressure, no hard-sell.</p>
    <a href="/contact.html" class="btn btn-cop btn-big">Get a Free Estimate &rarr;</a>
    <span class="cta-secondary">Free on-site walkthrough &middot; Response within 1 business day</span>
  </div>

  <h2>Other ${city.county} cities <span class="italic">we serve.</span></h2>
  <ul>
    ${nearby.map(c => `<li><a href="/${service.slug}-${c.slug}-id.html">${service.name} in ${c.name}</a></li>`).join('\n    ')}
  </ul>

  <h2>Related <span class="italic">services.</span></h2>
  <ul>
    ${SERVICES.filter(s => s.slug !== service.slug).slice(0, 6).map(s =>
      `<li><a href="/${s.slug}-${city.slug}-id.html">${s.name} in ${city.name}</a></li>`
    ).join('\n    ')}
  </ul>

  <div class="callout" data-label="Idaho licensed + insured">
    <p>${BRAND.name} &middot; Based in Idaho Falls &middot; Serving ${city.name} and the full Eastern Idaho region with premium ${service.short}.</p>
  </div>
</div></section>

${footer()}
</body></html>`;
}

/* ============================================================
   SITEMAP
   ============================================================ */
function renderSitemap() {
  const baseUrls = [
    '', 'services.html', 'gallery.html', 'about.html', 'contact.html', 'areas.html',
    'services/residential-garage.html', 'services/shop-floor.html', 'services/commercial-flake.html',
  ];
  const cityPages = CITIES.map(c => `areas/${c.slug}.html`);
  const geoServicePages = [];
  CITIES.forEach(city => SERVICES.forEach(service => {
    geoServicePages.push(`${service.slug}-${city.slug}-id.html`);
  }));

  const all = [...baseUrls, ...cityPages, ...geoServicePages];
  const lastmod = new Date().toISOString().slice(0, 10);
  const entries = all.map(u =>
    `  <url><loc>${BRAND.domain}/${u}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>${u === '' ? '1.0' : '0.7'}</priority></url>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

/* ============================================================
   EXECUTE
   ============================================================ */
let count = 0;

// Generate every (service x city) combo
CITIES.forEach(city => {
  SERVICES.forEach(service => {
    const slug = `${service.slug}-${city.slug}-id`;
    fs.writeFileSync(path.join(DIR, `${slug}.html`), renderGeoServicePage(service, city));
    count++;
  });
});
console.log(`Wrote ${count} programmatic geo+service pages (${CITIES.length} cities x ${SERVICES.length} services)`);

// Generate area pages for any new cities not yet covered
const existingAreas = fs.readdirSync(path.join(DIR, 'areas')).map(f => f.replace('.html', ''));
let newAreas = 0;
CITIES.forEach(city => {
  if (!existingAreas.includes(city.slug)) {
    // Generate a simple area page using the renderGeoServicePage pattern but as a city overview
    const overviewService = { slug: 'flake-floor', name: 'Epoxy & Flake Floors', short: 'epoxy and flake floor coatings', pitch: `Premium epoxy and flake floor coatings in ${city.name}, Idaho. Garage, shop, basement, and commercial floor systems with diamond grind prep, custom flake blends, and 10-year warranty.` };
    const html = renderGeoServicePage(overviewService, city);
    // Adjust paths: this is at /areas/{slug}.html, so prefix asset paths with ../
    const adjusted = html
      .replace(/href="\//g, 'href="/')  // keep root-relative absolute paths working
      .replace(/src="\//g, 'src="/')
      .replace(/url\('\//g, "url('/");
    fs.writeFileSync(path.join(DIR, 'areas', `${city.slug}.html`), adjusted);
    newAreas++;
  }
});
console.log(`Wrote ${newAreas} new city area pages`);

// Update sitemap
fs.writeFileSync(path.join(DIR, 'sitemap.xml'), renderSitemap());
console.log(`Updated sitemap.xml with ${(CITIES.length * SERVICES.length) + 9 + CITIES.length} URLs`);

console.log('\nDone.');

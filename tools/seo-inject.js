// Outil de développement : régénère le <head> (SEO, réseaux sociaux, données structurées)
// et applique quelques optimisations de balisage sur toutes les pages publiques.
// Usage : node tools/seo-inject.js   (idempotent : peut être relancé après modification du contenu)
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://lesclesdelareussite-conciergerie.com';
const TODAY = new Date().toISOString().slice(0, 10);
const OG_IMAGE = `${BASE}/assets/img/og-image.jpg`;
const BRAND = 'Les Clés de la Réussite';

const pages = [
  { file: 'index.html', url: '/', type: 'WebPage',
    title: `${BRAND} | Conciergerie Airbnb et Booking en Yvelines`,
    desc: "Conciergerie à Guyancourt pour votre location Airbnb ou Booking : annonces, voyageurs, ménage, tarifs et suivi. Estimation gratuite du potentiel de votre logement.",
    crumbs: [] },
  { file: 'nos-services/index.html', url: '/nos-services', type: 'WebPage',
    title: `Services de conciergerie Airbnb | ${BRAND}`,
    desc: "Création d'annonce, réservations, communication voyageurs, ménage, linge, tarification dynamique, maintenance et suivi : tout ce que nous prenons en charge.",
    crumbs: [['Services', '/nos-services']] },
  { file: 'tarifs/index.html', url: '/tarifs', type: 'WebPage',
    title: `Tarifs de conciergerie Airbnb | ${BRAND}`,
    desc: "Une commission sur les recettes locatives : 14 % jusqu'à 600 €, 18 % de 601 € à 1 300 €, 23 % au-delà. Pas d'abonnement fixe. Voir ce qui est inclus.",
    crumbs: [['Tarifs', '/tarifs']] },
  { file: 'zones-intervention/index.html', url: '/zones-intervention', type: 'CollectionPage',
    title: `Zones d'intervention en Yvelines | ${BRAND}`,
    desc: "Conciergerie de proximité basée à Guyancourt : accompagnement des propriétaires à Guyancourt, Saint-Quentin-en-Yvelines, Versailles et communes voisines.",
    crumbs: [["Zones d'intervention", '/zones-intervention']] },
  { file: 'conciergerie-guyancourt/index.html', url: '/conciergerie-guyancourt', type: 'WebPage', area: 'guyancourt',
    title: `Conciergerie Airbnb à Guyancourt (78280) | ${BRAND}`,
    desc: "Propriétaire à Guyancourt ? Gestion Airbnb et Booking de proximité : annonce, tarifs, voyageurs, ménage et suivi. Demandez une estimation gratuite.",
    crumbs: [["Zones d'intervention", '/zones-intervention'], ['Guyancourt', '/conciergerie-guyancourt']] },
  { file: 'conciergerie-saint-quentin-en-yvelines/index.html', url: '/conciergerie-saint-quentin-en-yvelines', type: 'WebPage', area: 'sqy',
    title: `Conciergerie Airbnb à Saint-Quentin-en-Yvelines | ${BRAND}`,
    desc: "Votre logement à Saint-Quentin-en-Yvelines en location courte durée : voyageurs d'affaires, familles, événements. Gestion complète et estimation gratuite.",
    crumbs: [["Zones d'intervention", '/zones-intervention'], ['Saint-Quentin-en-Yvelines', '/conciergerie-saint-quentin-en-yvelines']] },
  { file: 'conciergerie-versailles/index.html', url: '/conciergerie-versailles', type: 'WebPage', area: 'versailles',
    title: `Conciergerie Airbnb à Versailles | ${BRAND}`,
    desc: "Louer votre logement à Versailles sur Airbnb ou Booking : clientèle touristique et professionnelle, tarification adaptée, gestion complète. Estimation gratuite.",
    crumbs: [["Zones d'intervention", '/zones-intervention'], ['Versailles', '/conciergerie-versailles']] },
  { file: 'faq/index.html', url: '/faq', type: 'FAQPage',
    title: `FAQ conciergerie Airbnb : tarifs, gestion | ${BRAND}`,
    desc: "17 réponses sur la rentabilité, la gestion au quotidien, les tarifs, les frais à votre charge, les villes desservies et la façon de démarrer.",
    crumbs: [['FAQ', '/faq']] },
  { file: 'a-propos/index.html', url: '/a-propos', type: 'AboutPage',
    title: `À propos de ${BRAND}, conciergerie à Guyancourt`,
    desc: "Découvrez Saïd, fondateur et propriétaire à Guyancourt, et notre conciergerie locale créée en 2025 pour gérer votre location courte durée avec rigueur.",
    crumbs: [['À propos', '/a-propos']] },
  { file: 'contact/index.html', url: '/contact', type: 'ContactPage',
    title: `Estimation gratuite et contact | ${BRAND}`,
    desc: "Demandez l'estimation gratuite et sans engagement du potentiel de votre logement, ou appelez-nous au 07 46 28 69 10. Réponse rapide.",
    crumbs: [['Contact', '/contact']] },
  { file: 'mentions-legales/index.html', url: '/mentions-legales', type: 'WebPage',
    title: `Mentions légales | ${BRAND}`,
    desc: "Éditeur, directrice de la publication, hébergeur et informations légales du site de la conciergerie Les Clés de la Réussite (Guyancourt).",
    crumbs: [['Mentions légales', '/mentions-legales']] },
  { file: 'politique-confidentialite/index.html', url: '/politique-confidentialite', type: 'WebPage',
    title: `Politique de confidentialité | ${BRAND}`,
    desc: "Données collectées, finalités, durées de conservation et exercice de vos droits (RGPD) pour le site de la conciergerie Les Clés de la Réussite.",
    crumbs: [['Politique de confidentialité', '/politique-confidentialite']] },
  { file: 'politique-cookies/index.html', url: '/politique-cookies', type: 'WebPage',
    title: `Politique de cookies | ${BRAND}`,
    desc: "Traceurs utilisés (ou non) sur le site Les Clés de la Réussite : inventaire, finalités et gestion de vos choix.",
    crumbs: [['Politique de cookies', '/politique-cookies']] },
];

const areas = {
  guyancourt: { '@type': 'City', name: 'Guyancourt', address: { '@type': 'PostalAddress', postalCode: '78280', addressCountry: 'FR' } },
  sqy: { '@type': 'AdministrativeArea', name: 'Saint-Quentin-en-Yvelines' },
  versailles: { '@type': 'City', name: 'Versailles' },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (html) => decode(html.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ')).replace(/👉/g, '').replace(/\s+/g, ' ').trim();
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

function faqEntities() {
  const html = read('faq/index.html');
  const out = [];
  for (const m of html.matchAll(/<details class="faq-item">([\s\S]*?)<\/details>/g)) {
    const q = text((m[1].match(/<summary>([\s\S]*?)<\/summary>/) || [])[1] || '');
    const a = text((m[1].match(/<div class="faq-answer">([\s\S]*?)<\/div>/) || [])[1] || '');
    if (q && a) out.push({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } });
  }
  return out;
}

function serviceItems() {
  const html = read('nos-services/index.html');
  const out = [];
  for (const m of html.matchAll(/<div class="card-body">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)) {
    out.push({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: text(m[1]), description: text(m[2]) } });
  }
  return out;
}

const services = serviceItems();

const orgNode = {
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${BASE}/#organization`,
  name: BRAND,
  legalName: 'Conciergerie les Clés de la Réussite',
  url: `${BASE}/`,
  logo: { '@type': 'ImageObject', url: `${BASE}/assets/img/logo/logo-vert-400.png`, width: 400, height: 139 },
  image: OG_IMAGE,
  description: "Conciergerie locale basée à Guyancourt, spécialisée dans la gestion de locations courte durée (Airbnb, Booking) pour les propriétaires de Guyancourt, Saint-Quentin-en-Yvelines, Versailles et des communes voisines.",
  telephone: '+33746286910',
  email: 'contact@lesclesdelareussite-conciergerie.com',
  address: { '@type': 'PostalAddress', streetAddress: '73 rue Eugène Viollet-le-Duc', postalCode: '78280', addressLocality: 'Guyancourt', addressRegion: 'Île-de-France', addressCountry: 'FR' },
  areaServed: [areas.guyancourt, areas.sqy, areas.versailles],
  foundingDate: '2025',
  vatID: 'FR69995151925',
  founder: { '@type': 'Person', name: 'Saïd', jobTitle: 'Fondateur' },
  knowsAbout: ['Location courte durée', 'Gestion Airbnb', 'Gestion Booking', 'Tarification dynamique', 'Conciergerie', 'Ménage et linge de location saisonnière'],
  contactPoint: { '@type': 'ContactPoint', telephone: '+33746286910', email: 'contact@lesclesdelareussite-conciergerie.com', contactType: 'customer service', areaServed: 'FR', availableLanguage: 'fr' },
  sameAs: [
    'https://www.ville-guyancourt.fr/fiche-annuaire/conciergerie-les-cles-de-la-reussite/',
    'https://www.versailles-tourisme.com/conciergerie-les-cles-de-la-reussite.html',
  ],
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Services de conciergerie', itemListElement: services },
};

const websiteNode = { '@type': 'WebSite', '@id': `${BASE}/#website`, url: `${BASE}/`, name: BRAND, inLanguage: 'fr-FR', publisher: { '@id': `${BASE}/#organization` } };

function graphFor(p) {
  const url = BASE + (p.url === '/' ? '/' : p.url);
  const g = [orgNode, websiteNode];
  const page = {
    '@type': p.type, '@id': `${url}#webpage`, url, name: p.title, description: p.desc,
    inLanguage: 'fr-FR', isPartOf: { '@id': `${BASE}/#website` }, about: { '@id': `${BASE}/#organization` },
    primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE }, dateModified: TODAY,
  };
  if (p.crumbs.length) page.breadcrumb = { '@id': `${url}#breadcrumb` };
  if (p.type === 'FAQPage') page.mainEntity = faqEntities();
  if (p.type === 'AboutPage') page.mainEntity = { '@type': 'Person', name: 'Saïd', jobTitle: 'Fondateur de Les Clés de la Réussite', description: "Propriétaire à Guyancourt, parcours en direction financière et expérience d'agent immobilier indépendant.", image: `${BASE}/assets/img/said-fondateur.webp`, worksFor: { '@id': `${BASE}/#organization` } };
  g.push(page);
  if (p.crumbs.length) {
    const items = [['Accueil', '/'], ...p.crumbs].map(([name, u], i) => ({ '@type': 'ListItem', position: i + 1, name, item: BASE + (u === '/' ? '/' : u) }));
    g.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: items });
  }
  if (p.area) {
    g.push({ '@type': 'Service', '@id': `${url}#service`, name: `Conciergerie Airbnb et Booking à ${areas[p.area].name}`, serviceType: 'Gestion de location courte durée', description: p.desc, provider: { '@id': `${BASE}/#organization` }, areaServed: areas[p.area] });
  }
  if (p.url === '/nos-services') {
    g.push({ '@type': 'Service', '@id': `${url}#service`, name: 'Gestion complète de location courte durée', serviceType: 'Conciergerie Airbnb et Booking', provider: { '@id': `${BASE}/#organization` }, areaServed: [areas.guyancourt, areas.sqy, areas.versailles], hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Prestations', itemListElement: services } });
  }
  if (p.url === '/tarifs') {
    g.push({ '@type': 'Service', '@id': `${url}#service`, name: 'Gestion de location courte durée à la commission', serviceType: 'Conciergerie Airbnb et Booking', description: "Rémunération à la commission sur les recettes locatives mensuelles, sans abonnement fixe ; grille publiée sur la page.", provider: { '@id': `${BASE}/#organization` } });
  }
  return { '@context': 'https://schema.org', '@graph': g };
}

function headFor(p) {
  const url = BASE + (p.url === '/' ? '/' : p.url);
  const lines = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${esc(p.title)}</title>`,
    `<meta name="description" content="${esc(p.desc)}">`,
    `<link rel="canonical" href="${url}">`,
    `<link rel="alternate" hreflang="fr-FR" href="${url}">`,
    `<link rel="alternate" hreflang="x-default" href="${url}">`,
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">',
    '<meta name="theme-color" content="#173F35">',
    `<meta property="og:locale" content="fr_FR">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${BRAND}">`,
    `<meta property="og:title" content="${esc(p.title)}">`,
    `<meta property="og:description" content="${esc(p.desc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${OG_IMAGE}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="Remise des clés d'un logement à ses propriétaires, dans un intérieur lumineux">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(p.title)}">`,
    `<meta name="twitter:description" content="${esc(p.desc)}">`,
    `<meta name="twitter:image" content="${OG_IMAGE}">`,
    '<link rel="icon" href="/favicon.ico" sizes="48x48">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/icons/favicon-32.png">',
    '<link rel="apple-touch-icon" href="/assets/img/icons/apple-touch-icon.png">',
    '<link rel="manifest" href="/site.webmanifest">',
    '<link rel="preload" href="/assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>',
    '<link rel="preload" href="/assets/fonts/libre-baskerville-latin.woff2" as="font" type="font/woff2" crossorigin>',
  ];
  if (p.url === '/') {
    lines.push('<link rel="preload" as="image" href="/assets/img/homepage-1031.webp" imagesrcset="/assets/img/homepage-640.webp 640w, /assets/img/homepage-1031.webp 1031w" imagesizes="(min-width: 960px) 540px, 100vw" fetchpriority="high">');
  }
  lines.push('<link rel="stylesheet" href="/assets/css/style.css">');
  lines.push(`<script type="application/ld+json">\n${JSON.stringify(graphFor(p), null, 1)}\n</script>`);
  return lines.join('\n');
}

const relatedLinks = {
  guyancourt: 'Nous intervenons également à <a href="/conciergerie-saint-quentin-en-yvelines">Saint-Quentin-en-Yvelines</a> et à <a href="/conciergerie-versailles">Versailles</a>. Pour connaître notre rémunération, consultez nos <a href="/tarifs">tarifs</a>&nbsp;; pour les questions fréquentes, la <a href="/faq">FAQ</a>.',
  sqy: 'Nous intervenons également à <a href="/conciergerie-guyancourt">Guyancourt</a> et à <a href="/conciergerie-versailles">Versailles</a>. Pour connaître notre rémunération, consultez nos <a href="/tarifs">tarifs</a>&nbsp;; pour les questions fréquentes, la <a href="/faq">FAQ</a>.',
  versailles: 'Nous intervenons également à <a href="/conciergerie-guyancourt">Guyancourt</a> et à <a href="/conciergerie-saint-quentin-en-yvelines">Saint-Quentin-en-Yvelines</a>. Pour connaître notre rémunération, consultez nos <a href="/tarifs">tarifs</a>&nbsp;; pour les questions fréquentes, la <a href="/faq">FAQ</a>.',
};

let changed = 0;
for (const p of pages) {
  const fp = path.join(ROOT, p.file);
  let html = fs.readFileSync(fp, 'utf8');
  const before = html;

  html = html.replace(/<head>[\s\S]*?<\/head>/, `<head>\n${headFor(p)}\n</head>`);

  // Images optimisées (WebP + srcset)
  html = html.replace(/<img src="\/assets\/img\/homepage(?:-1031)?\.(?:png|webp)"[^>]*>/,
    '<img src="/assets/img/homepage-1031.webp" srcset="/assets/img/homepage-640.webp 640w, /assets/img/homepage-1031.webp 1031w" sizes="(min-width: 960px) 540px, 100vw" alt="Remise des clés d\'un logement à ses propriétaires, dans un intérieur lumineux" width="1031" height="717" fetchpriority="high" loading="eager" decoding="async">');
  html = html.replace(/src="\/assets\/img\/services\/([a-z0-9-]+?)(?:-800)?\.(?:png|webp)"(?: srcset="[^"]*" sizes="[^"]*" decoding="async")?/g,
    (m, n) => `src="/assets/img/services/${n}-800.webp" srcset="/assets/img/services/${n}-480.webp 480w, /assets/img/services/${n}-800.webp 800w" sizes="(min-width: 900px) 370px, (min-width: 640px) 50vw, 100vw" decoding="async"`);
  html = html.replace(/\/assets\/img\/logo\/logo-vert(?:-400)?\.png/g, '/assets/img/logo/logo-vert-400.png');
  html = html.replace(/\/assets\/img\/logo\/logo-blanc(?:-400)?\.png/g, '/assets/img/logo/logo-blanc-400.png');

  // Script différé
  html = html.replace(/<script src="\/assets\/js\/main\.js"( defer)?><\/script>/, '<script src="/assets/js/main.js" defer></script>');

  // Maillage interne des pages locales
  if (p.area && !html.includes('related-zones')) {
    html = html.replace(/(\r?\n    <\/div>\r?\n  <\/section>\r?\n\r?\n  <section class="section-alt">)/,
      `\n      <div class="section-head related-zones"><p>${relatedLinks[p.area]}</p></div>$1`);
  }

  // Politique de cookies : polices désormais hébergées localement
  if (p.url === '/politique-cookies') {
    html = html.replace(/<li>Le site charge les polices de caractères via Google Fonts[\s\S]*?<\/li>/,
      "<li>Les polices de caractères (Libre Baskerville et Manrope, sous licence libre SIL OFL) sont hébergées sur le site lui-même&nbsp;: aucun appel à un serveur tiers (type Google Fonts) n'est effectué pour les afficher, et aucune donnée n'est transmise à ce titre.</li>");
  }

  if (html !== before) { fs.writeFileSync(fp, html, 'utf8'); changed++; }
}

// Pages techniques : polices locales + favicon uniquement
for (const f of ['404.html', 'about/index.html', 'nos-logements/index.html']) {
  const fp = path.join(ROOT, f);
  let html = fs.readFileSync(fp, 'utf8');
  const before = html;
  html = html.replace(/<link rel="preconnect"[^>]*>\s*/g, '').replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\s*/g, '');
  if (!html.includes('rel="icon"')) html = html.replace('</head>', '<link rel="icon" href="/favicon.ico" sizes="48x48">\n</head>');
  html = html.replace(/\/assets\/img\/logo\/logo-vert(?:-400)?\.png/g, '/assets/img/logo/logo-vert-400.png').replace(/\/assets\/img\/logo\/logo-blanc(?:-400)?\.png/g, '/assets/img/logo/logo-blanc-400.png');
  if (html !== before) { fs.writeFileSync(fp, html, 'utf8'); changed++; }
}

// Fichiers racine
const urls = pages.map((p) => ({ loc: BASE + (p.url === '/' ? '/' : p.url), pr: p.url === '/' ? '1.0' : /mentions|politique/.test(p.url) ? '0.3' : /contact|tarifs|services/.test(p.url) ? '0.9' : '0.8' }));
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${TODAY}</lastmod><priority>${u.pr}</priority></url>`).join('\n') + '\n</urlset>\n');

console.log('pages modifiées :', changed);

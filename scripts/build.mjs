// Builds every generated page of clearfood.app. No dependencies — run with
//   node scripts/build.mjs
// Edit the copy here (homepage) or in content/ (food pages), never the
// generated HTML: index.html, de/, foods/, android/ and sitemap.xml are
// overwritten on every run. The legal pages and admin.html are hand-made.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FOODS } from '../content/food-list.mjs';
import { COPY, SOURCES } from '../content/food-copy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.clearfood.app';
const APP = 'https://apps.apple.com/de/app/clear-food-glowup-your-skin/id6779364653';
const TODAY = new Date().toISOString().slice(0, 10);
const SCANS = JSON.parse(await readFile(join(ROOT, 'content/scans.json'), 'utf8'));

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const IOS_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.1 12.3c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.2-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.6 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.2 1.2 0 1.6-.7 3.1-.7s1.9.7 3.1.7c1.3 0 2.1-1.1 2.8-2.2.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.9-1.1-2.9-3.9M15 5.7c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3"/></svg>';
const AND_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m7 4-1-2 .8-.4L8 3.8a10 10 0 0 1 8 0l1.2-2.2.8.4-1 2a7 7 0 0 1 4 6H3a7 7 0 0 1 4-6ZM3 11h18v9H3zm4-5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m10 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>';
const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.2l-5.8 3.2 1.2-6.5L2.6 9.4l6.5-.8z"/></svg>';
const STARS = STAR.repeat(5);
const GOAL_KEYS = ['clear_skin', 'body_fat', 'build_muscle', 'less_bloat'];
// Same thresholds as ratingColor() in the app (lib/rating.js).
const ratingColor = (s) => (s >= 67 ? '#3DAF7A' : s >= 34 ? '#FFA63E' : '#E0605A');

// ── Words ────────────────────────────────────────────────────────────────
const L = {
  en: {
    home: '/', foods: '/foods', foodPath: (f) => `/foods/${f.slug}`, other: 'de', otherLabel: 'Deutsch',
    nav: { scan: 'The scan', foods: 'Food scores', reviews: 'Reviews', faq: 'FAQ', cta: 'Get the app', ctaMenu: 'Get the app on iPhone', android: 'Join the Android waitlist' },
    goals: { clear_skin: 'Clear skin', body_fat: 'Body fat', build_muscle: 'Muscle', less_bloat: 'Less bloat' },
    macros: { cal: 'kcal', protein: 'protein', carbs: 'carbs', fat: 'fat' },
    footer: { cta: 'Download on iPhone', privacy: 'Privacy policy', terms: 'Terms of use' },
    country: { Germany: 'Germany', Poland: 'Poland' },
  },
  de: {
    home: '/de', foods: '/de/lebensmittel', foodPath: (f) => `/de/lebensmittel/${f.de}`, other: 'en', otherLabel: 'English',
    nav: { scan: 'Der Scan', foods: 'Lebensmittel', reviews: 'Bewertungen', faq: 'FAQ', cta: 'App laden', ctaMenu: 'App fürs iPhone laden', android: 'Android-Warteliste' },
    goals: { clear_skin: 'Klare Haut', body_fat: 'Körperfett', build_muscle: 'Muskeln', less_bloat: 'Bloating' },
    macros: { cal: 'kcal', protein: 'Protein', carbs: 'Kohlenhydrate', fat: 'Fett' },
    footer: { cta: 'Auf dem iPhone laden', privacy: 'Datenschutz', terms: 'Nutzungsbedingungen' },
    country: { Germany: 'Deutschland', Poland: 'Polen' },
  },
};

const HOME = {
  en: {
    title: 'Clear Food – Food Scanner App for Clearer Skin & Less Bloating',
    desc: 'Take a photo of any meal and Clear Food scores it from 1 to 100 for your goals: clear skin, less bloat, muscle and body fat. On iPhone now, Android coming soon.',
    ogTitle: 'Clear Food – see what your food does to your skin',
    ogDesc: 'Snap a meal, get a score from 1 to 100 for clear skin, less bloat, muscle and body fat.',
    h1: 'See what your food does to your skin', rating: '4.9 AVERAGE RATING', ratingLabel: 'Rated 4.9 out of 5 on the App Store',
    androidBtn: '<small>COMING SOON</small>Android waitlist', iosBtn: '<small>AVAILABLE ON iOS</small>Get the app',
    early: 'Android is coming. Join the waitlist and get <strong>1 month free</strong> at launch.',
    scanH2: 'Every meal gets a score from 1&nbsp;to&nbsp;100', bowl: 'Beef &amp; potato bowl',
    bowlAlt: 'Bowl with minced beef, roast potatoes, avocado, diced tomato and spinach',
    bowlText: '<strong>Beef &amp; potato bowl</strong> · Minced beef, roast potatoes, avocado, tomato and spinach, about 750&nbsp;kcal. Lots of protein, so Muscle scores highest. The potatoes and the creamy sauce pull Less bloat down to&nbsp;70.',
    realScan: 'Real scan from the Clear Food app', goalsTitle: 'YOUR GOALS', goalsMeta: '45 G PROTEIN · 750 KCAL', scroll: 'SCROLL TO SCAN',
    reviewsH2: '4.9 on the App Store', reviewsLead: 'Reviews from the App Store, copied as written.', reviewsAll: 'Read all reviews on the App Store ↗',
    faqH2: 'FAQ', faqAndroid: 'Join the Android waitlist →',
    faq: [
      ['What is Clear Food?', 'Clear Food is a food scanner app for iPhone. Take a photo of a meal, a snack or a packaged product and you get a score from 1 to 100, a separate score for each of your goals, and the calories, protein, carbs and fat.'],
      ['How is the score calculated?', 'Two things count most: how far a food is from its natural form, and how hard it hits your blood sugar. Unprocessed food like eggs, fish or fruit lands between 78 and 100. Heavily processed snacks and soft drinks land far lower. Your goals then decide which of these points weigh most for you.'],
      ['Can food really affect acne and bloating?', 'Food is one factor among several. Studies link diets high in sugar and fast carbs to more acne in some people, and some foods bloat more than others. Clear Food shows you which of your meals fall into those groups. It does not diagnose skin or gut conditions.'],
      ['Is Clear Food free?', 'Your first 3 scans are free. After that you need Clear Food Pro. The yearly plan starts with a free trial. Prices depend on your country and are shown in the app before you pay.'],
      ['Is Clear Food on Android?', 'Not yet. Join the Android waitlist and we\'ll email you on launch day. Everyone on the list gets 1 month free.'],
      ['What happens to my photos?', 'Your photo is sent to our server to be scored and is not kept after the result comes back. Your scan history is saved on your phone.'],
      ['Which languages does it support?', 'English, German, French, Italian, Spanish, Dutch, Polish, Hungarian and Turkish. The scan results come in your language too.'],
      ['Is this medical advice?', 'No. Scores are estimates to help with everyday food choices. For allergies, a skin condition or a diet your doctor gave you, talk to a doctor or dietitian.'],
    ],
  },
  de: {
    title: 'Clear Food – Food-Scanner-App für reine Haut & weniger Blähbauch',
    desc: 'Fotografier dein Essen und Clear Food bewertet es von 1 bis 100 für deine Ziele: klare Haut, weniger Bloating, Muskeln und Körperfett. Fürs iPhone, Android folgt.',
    ogTitle: 'Clear Food – sieh, was dein Essen mit deiner Haut macht',
    ogDesc: 'Essen fotografieren, Score von 1 bis 100 bekommen: für klare Haut, weniger Bloating, Muskeln und Körperfett.',
    h1: 'Sieh, was dein Essen mit deiner Haut macht', rating: '4,9 DURCHSCHNITTSBEWERTUNG', ratingLabel: 'Im App Store mit 4,9 von 5 bewertet',
    androidBtn: '<small>BALD VERFÜGBAR</small>Android-Warteliste', iosBtn: '<small>FÜR iOS</small>App laden',
    early: 'Android kommt. Trag dich ein und bekomm zum Start <strong>1 Monat gratis</strong>.',
    scanH2: 'Jede Mahlzeit bekommt einen Score von 1&nbsp;bis&nbsp;100', bowl: 'Bowl mit Hack &amp; Kartoffeln',
    bowlAlt: 'Bowl mit Rinderhack, Ofenkartoffeln, Avocado, Tomatenwürfeln und Spinat',
    bowlText: '<strong>Bowl mit Hack &amp; Kartoffeln</strong> · Rinderhack, Ofenkartoffeln, Avocado, Tomate und Spinat, rund 750&nbsp;kcal. Viel Eiweiß, deshalb schneiden Muskeln am besten ab. Die Kartoffeln und die cremige Soße drücken Bloating auf&nbsp;70.',
    realScan: 'Echter Scan aus der Clear-Food-App', goalsTitle: 'DEINE ZIELE', goalsMeta: '45 G PROTEIN · 750 KCAL', scroll: 'SCROLLEN ZUM SCANNEN',
    reviewsH2: '4,9 im App Store', reviewsLead: 'Bewertungen aus dem App Store, so wie sie geschrieben wurden.', reviewsAll: 'Alle Bewertungen im App Store ↗',
    faqH2: 'FAQ', faqAndroid: 'Zur Android-Warteliste →',
    faq: [
      ['Was ist Clear Food?', 'Clear Food ist eine Food-Scanner-App fürs iPhone. Du fotografierst eine Mahlzeit, einen Snack oder ein verpacktes Produkt und bekommst einen Score von 1 bis 100, einen eigenen Score für jedes deiner Ziele und Kalorien, Protein, Kohlenhydrate und Fett.'],
      ['Wie wird der Score berechnet?', 'Zwei Dinge zählen am meisten: wie weit ein Lebensmittel von seiner natürlichen Form entfernt ist und wie stark es deinen Blutzucker hochtreibt. Unverarbeitetes wie Eier, Fisch oder Obst landet zwischen 78 und 100. Stark verarbeitete Snacks und Softdrinks landen weit darunter. Deine Ziele entscheiden dann, was davon für dich am meisten zählt.'],
      ['Kann Essen wirklich Pickel und Blähbauch machen?', 'Essen ist ein Faktor unter mehreren. Studien bringen viel Zucker und schnelle Kohlenhydrate bei manchen Menschen mit mehr Akne in Verbindung, und manche Lebensmittel blähen mehr als andere. Clear Food zeigt dir, welche deiner Mahlzeiten in diese Gruppen fallen. Eine Diagnose für Haut oder Darm ist es nicht.'],
      ['Ist Clear Food kostenlos?', 'Deine ersten 3 Scans sind gratis. Danach brauchst du Clear Food Pro. Das Jahresabo startet mit einer Gratis-Testphase. Die Preise hängen von deinem Land ab und stehen in der App, bevor du zahlst.'],
      ['Gibt es Clear Food für Android?', 'Noch nicht. Trag dich in die Android-Warteliste ein, dann schreiben wir dir am Starttag. Alle auf der Liste bekommen 1 Monat gratis.'],
      ['Was passiert mit meinen Fotos?', 'Dein Foto geht zur Bewertung an unseren Server und wird nicht gespeichert, sobald das Ergebnis da ist. Deine Scan-Historie bleibt auf deinem Handy.'],
      ['Welche Sprachen gibt es?', 'Deutsch, Englisch, Französisch, Italienisch, Spanisch, Niederländisch, Polnisch, Ungarisch und Türkisch. Auch die Scan-Ergebnisse kommen in deiner Sprache.'],
      ['Ist das medizinischer Rat?', 'Nein. Die Scores sind Schätzungen für deine Essensentscheidungen im Alltag. Bei Allergien, einer Hauterkrankung oder einer Diät vom Arzt sprich mit einem Arzt oder einer Ernährungsfachkraft.'],
    ],
  },
};

// Real App Store reviews, verbatim (typos and emoji included). Joke reviews
// ("I grew to 200cm") are left out on purpose.
const REVIEWS = [
  ['maxs.018', 'Germany', 'Beste App seit langem', 'Seit 3 Monaten benutze ich jetzt schon diese App und seit dem hat sich meine Haut um einiges verbessert. Kann die App jedem empfehlen der sein aussehen verbessern will👌🏻💯'],
  ['Emmon12', 'Germany', 'Lost alot of weight', 'i tried loosing weight with this app and it actually worked.. it took a lot of discipline but the calorie tracking really helped! Clear recommendation!'],
  ['anciiiiiiiiiii7', 'Germany', 'tolle app, sehr zu empfehlen!', 'Sehr coole App, einfach und verständlich und an die individuellen Bedürfnisse angepasst. Viel besser als diese overhyped apps und finde die Ergebnisse auch wissenschaftlich gesehen sehr akkurat!! Habe viele ähnliche schon ausprobiert gehabt und finde diese bis jetzt am besten 😍😍'],
  ['Staszek11111', 'Poland', 'is the app good?', 'Yes i is very good for bloated face and body fat.'],
  ['Elli_wie heißt ist Magma', 'Germany', 'Beste App jemals', 'Die App ist perfekt für mein Leben geeignet. Wenn ich fertig gekocht, oder mein Essen bestellt habe, freue ich mich immer richtig aufs scannen um zu sehen wie gut meine Ernährung ist. Clear Food  hat mir echt die Augen geöffnet'],
  ['AlmondDaughterSkincare', 'Germany', 'Very Good', 'The Scan is very accurate'],
  ['HeisenbergSigma', 'Germany', 'FINALLY!!!', 'I waited for excactly this App… I have no Acne anymore :)'],
  ['landigsorpender', 'Germany', 'Lohnt sich zu 100%', 'Nutze die app jetzt schon etwas länger und habe sichtbare Fortschritte gesehen, wenn man sich lange an den plan hält dann denke ich wird es Leben verändern‼️🏆 kann ich auf jedenfall empfehlen 👍'],
];

const FOOD_UI = {
  en: {
    hubTitle: 'Food scores: which foods are good or bad for your skin? | Clear Food',
    hubDesc: 'Milk, whey, energy drinks, fries, Nutella and more, scored from 1 to 100 by the Clear Food app for clear skin, body fat, muscle and bloating.',
    hubH1: 'Which foods are good or bad for your skin?',
    hubLead: 'We ran the foods people ask about most through the Clear Food scan, with the same four goals as in the app. Tap a food to see why it scores the way it does.',
    crumbHome: 'Home', crumbFoods: 'Food scores',
    scanned: (d) => `Scanned with the Clear Food app on ${new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}. Values are estimates.`,
    likes: 'What the scan likes', dislikes: 'What pulls the score down',
    swapH2: 'Better swap', swapPoints: (n) => `${n > 0 ? '+' : ''}${n} points`,
    sourcesH2: 'Sources', ctaH2: 'Scan your own food', ctaLead: 'Take a photo of any meal and get the same score, goals and macros in a few seconds.',
    moreH2: 'More food scores', note: 'Not medical advice.',
    scoreLabel: (n) => `Score ${n} out of 100`, perServing: 'per serving',
  },
  de: {
    hubTitle: 'Lebensmittel-Check: Was ist gut oder schlecht für die Haut? | Clear Food',
    hubDesc: 'Milch, Whey, Energy Drinks, Pommes, Nutella und mehr, von der Clear-Food-App bewertet von 1 bis 100 für klare Haut, Körperfett, Muskeln und Bloating.',
    hubH1: 'Welche Lebensmittel sind gut oder schlecht für die Haut?',
    hubLead: 'Wir haben die Lebensmittel, nach denen am meisten gefragt wird, durch den Clear-Food-Scan geschickt, mit denselben vier Zielen wie in der App. Tipp ein Lebensmittel an, um zu sehen, woher der Score kommt.',
    crumbHome: 'Start', crumbFoods: 'Lebensmittel',
    scanned: (d) => `Gescannt mit der Clear-Food-App am ${d.split('-').reverse().join('.')}. Die Werte sind Schätzungen.`,
    likes: 'Was der Scan gut findet', dislikes: 'Was den Score drückt',
    swapH2: 'Bessere Alternative', swapPoints: (n) => `${n > 0 ? '+' : ''}${n} Punkte`,
    sourcesH2: 'Quellen', ctaH2: 'Scanne dein eigenes Essen', ctaLead: 'Fotografier irgendeine Mahlzeit und bekomm in ein paar Sekunden denselben Score, deine Ziele und die Makros.',
    moreH2: 'Weitere Lebensmittel', note: 'Kein medizinischer Rat.',
    scoreLabel: (n) => `Score ${n} von 100`, perServing: 'pro Portion',
  },
};

// ── Shared building blocks ───────────────────────────────────────────────
function head(lang, { title, desc, path, alt, ogTitle, ogDesc, ld, preload = '', robots = 'index, follow, max-image-preview:large' }) {
  const alts = alt
    ? `<link rel="alternate" hreflang="en" href="${SITE}${alt.en}">\n<link rel="alternate" hreflang="de" href="${SITE}${alt.de}">\n<link rel="alternate" hreflang="x-default" href="${SITE}${alt.en}">\n`
    : '';
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${path}">
${alts}<meta name="robots" content="${robots}">
<meta name="theme-color" content="#4e5d75">
<meta name="apple-itunes-app" content="app-id=6779364653">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Clear Food">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:title" content="${esc(ogTitle || title)}">
<meta property="og:description" content="${esc(ogDesc || desc)}">
<meta property="og:image" content="${SITE}/assets/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${lang === 'de' ? 'de_DE' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<link rel="apple-touch-icon" href="/assets/icon-180.png">
${preload}<link rel="stylesheet" href="/oasis.css">
<script src="/waitlist.js" defer></script>
<script src="/app.js" defer></script>
<script src="/script.js" defer></script>
${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n` : ''}</head>`;
}

function nav(lang, onHome) {
  const t = L[lang].nav;
  const base = onHome ? '' : L[lang].home;
  const link = (hash) => (onHome ? hash : `${base}${hash}`);
  const items = `<a href="${link('#scan')}">${t.scan}</a><a href="${L[lang].foods}">${t.foods}</a><a href="${link('#reviews')}">${t.reviews}</a><a href="${link('#faq')}">${t.faq}</a>`;
  return `<a class="skip" href="#main">${lang === 'de' ? 'Zum Inhalt' : 'Skip to content'}</a>
<header class="nav-wrap"><nav class="nav" aria-label="Main">
    <a class="brand" href="${L[lang].home}" aria-label="Clear Food"><img src="/assets/clearfood-icon.png" alt="" width="30" height="30"><span>Clear Food</span></a>
    <div class="nav-links">${items}</div>
    <a class="nav-cta" href="${APP}" target="_blank" rel="noopener">${t.cta}</a>
    <button class="menu-toggle" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
  </nav><div id="mobile-menu" hidden>${items}<a href="${APP}" target="_blank" rel="noopener">${t.ctaMenu}</a><button data-waitlist>${t.android}</button></div></header>`;
}

function footer(lang, otherPath) {
  const t = L[lang].footer;
  return `<footer class="footer">
  <a class="brand" href="${L[lang].home}"><img src="/assets/clearfood-icon.png" alt="" width="28" height="28">Clear Food</a>
  <a class="footer-cta" href="${APP}" target="_blank" rel="noopener">${IOS_SVG}${t.cta}</a>
  <div class="footer-links"><a href="${L[lang].foods}">${L[lang].nav.foods}</a><a href="/privacy-policy">${t.privacy}</a><a href="/terms">${t.terms}</a><a href="${otherPath}" hreflang="${L[lang].other}" lang="${L[lang].other}">${L[lang].otherLabel}</a><span>© 2026 Clear Food</span></div>
</footer>
<dialog id="waitlist"></dialog>
</body></html>
`;
}

const goalBars = (lang, goals, colored) =>
  `<ul class="goal-bars">${GOAL_KEYS.map((k) => `<li style="--score:${goals[k]}${colored ? `;--bar:${ratingColor(goals[k])}` : ''}"><span>${L[lang].goals[k]}</span><i aria-hidden="true"><b></b></i><em>${goals[k]}</em></li>`).join('')}</ul>`;

const ring = (score, label, colored) =>
  `<span class="score-ring" style="--score:${score}${colored ? `;--ring:${ratingColor(score)}` : ''}" role="img" aria-label="${esc(label)}"><svg viewBox="0 0 64 64" aria-hidden="true"><circle class="ring-track" cx="32" cy="32" r="27" pathLength="100"/><circle class="ring-fill" cx="32" cy="32" r="27" pathLength="100"/></svg><b>${score}</b></span>`;

async function write(path, html) {
  const file = join(ROOT, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

// ── Homepage ─────────────────────────────────────────────────────────────
function homePage(lang) {
  const t = HOME[lang];
  const path = L[lang].home;
  const faqLd = { '@type': 'FAQPage', '@id': `${SITE}${path}#faq`, inLanguage: lang, mainEntity: t.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': `${SITE}/#org`, name: 'Clear Food', url: `${SITE}/`, logo: `${SITE}/assets/icon-default-1024.png`, sameAs: [APP] },
    { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Clear Food', inLanguage: ['en', 'de'], publisher: { '@id': `${SITE}/#org` } },
    { '@type': 'MobileApplication', '@id': `${SITE}/#app`, name: 'Clear Food', operatingSystem: 'iOS', applicationCategory: 'HealthApplication', description: 'Food scanner app: take a photo of a meal and get a score from 1 to 100 plus scores for clear skin, body fat, muscle and less bloat, with calories and macros.', url: `${SITE}/`, installUrl: APP, downloadUrl: APP, image: `${SITE}/assets/app-preview.jpg`, inLanguage: ['en', 'de', 'fr', 'it', 'es', 'nl', 'pl', 'hu', 'tr'], offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', description: 'Free download with 3 free scans. Clear Food Pro is an in-app subscription.' }, publisher: { '@id': `${SITE}/#org` } },
    faqLd,
  ] };
  const reviews = REVIEWS.map(([n, c, ti, b]) => `    <figure class="review"><span class="rating-stars" role="img" aria-label="5/5">${STARS}</span><blockquote><p class="review-title">${esc(ti)}</p><p>${esc(b)}</p></blockquote><figcaption>${esc(n)} · ${L[lang].country[c]}</figcaption></figure>`).join('\n');
  const faq = t.faq.map(([q, a], i) => `    <details><summary>${esc(q)}<span aria-hidden="true">+</span></summary><p>${esc(a)}</p>${i === 4 ? `<button class="text-button" data-waitlist>${t.faqAndroid}</button>` : ''}</details>`).join('\n');
  return `${head(lang, { title: t.title, desc: t.desc, path, alt: { en: '/', de: '/de' }, ogTitle: t.ogTitle, ogDesc: t.ogDesc, ld,
    preload: '<link rel="preload" as="image" href="/assets/bowl.webp" imagesrcset="/assets/bowl-480.webp 480w, /assets/bowl.webp 731w" imagesizes="(max-width: 760px) 340px, 560px" fetchpriority="high">\n' })}
<body>
${nav(lang, true)}
<main id="main">
<div class="sky">
  <section class="hero" aria-labelledby="hero-title">
    <h1 id="hero-title">${t.h1}</h1>
    <div class="rating" role="img" aria-label="${t.ratingLabel}"><span class="rating-stars">${STARS}</span><span class="rating-text">${t.rating}</span></div>
    <div class="store-actions">
      <button class="store-button android" data-waitlist>${AND_SVG}<span>${t.androidBtn}</span></button>
      <a class="store-button ios" data-hold-link href="${APP}" target="_blank" rel="noopener">${IOS_SVG}<span>${t.iosBtn}</span></a>
    </div>
    <p class="early-note">${t.early}</p>
  </section>
  <section class="food-showcase" id="scan" aria-labelledby="scan-title">
    <div class="showcase-sticky">
      <div class="food-heading"><h2 id="scan-title">${t.scanH2}</h2></div>
      <div class="product-glass">
        <div class="product-label"><span class="product-name">${t.bowl}</span>
          ${ring(78, FOOD_UI[lang].scoreLabel(78), false)}
        </div>
        <div class="scan-line" aria-hidden="true"></div>
      </div>
      <img class="food-cutout" src="/assets/bowl.webp" srcset="/assets/bowl-480.webp 480w, /assets/bowl.webp 731w" sizes="(max-width: 760px) 340px, 560px" alt="${t.bowlAlt}" width="731" height="731" fetchpriority="high">
      <div class="food-description"><p>${t.bowlText}</p><p class="sample-label">${t.realScan}</p></div>
      <div class="nutrient-glass goals-card">
        <div class="nutrient-top"><span>${t.goalsTitle}</span><span>${t.goalsMeta}</span></div>
        ${goalBars(lang, { clear_skin: 80, body_fat: 75, build_muscle: 85, less_bloat: 70 }, false)}
      </div>
      <p class="scroll-caption" aria-hidden="true">${t.scroll} <span>↓</span></p>
    </div>
  </section>
</div>
<section class="reviews section" id="reviews" aria-labelledby="reviews-title">
  <div class="reviews-head">
    <span class="rating-stars" aria-hidden="true">${STARS}</span>
    <h2 id="reviews-title">${t.reviewsH2}</h2>
    <p>${t.reviewsLead}</p>
  </div>
  <div class="review-wall">
${reviews}
  </div>
  <a class="reviews-link" href="${APP}" target="_blank" rel="noopener">${t.reviewsAll}</a>
</section>
<section class="faq section" id="faq" aria-labelledby="faq-title">
  <h2 id="faq-title">${t.faqH2}</h2>
  <div class="faq-list">
${faq}
  </div>
</section>
</main>
${footer(lang, lang === 'en' ? '/de' : '/')}`;
}

// ── Food pages ───────────────────────────────────────────────────────────
function fill(text, s) {
  return text
    .replace(/\{score\}/g, s.score)
    .replace(/\{swapScore\}/g, s.swap?.score ?? '')
    .replace(/\{(sugar|cal|protein|carbs|fat)\}/g, (_, k) => s.macros[k])
    .replace(/\{goal:(\w+)\}/g, (_, k) => s.goals[k]);
}

function foodPage(lang, f) {
  const s = SCANS[f.slug]; const c = COPY[f.slug]; const u = FOOD_UI[lang]; const tx = c[lang];
  const path = L[lang].foodPath(f);
  const answer = fill(tx.a, s);
  const m = s.macros; const mt = L[lang].macros;
  const showSwap = s.swap && c.showSwap !== false;
  const others = FOODS.filter((x) => x.slug !== f.slug);
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', headline: tx.q, description: answer.slice(0, 155), inLanguage: lang, datePublished: s.scannedAt, dateModified: s.scannedAt, author: { '@type': 'Organization', name: 'Clear Food', url: `${SITE}/` }, publisher: { '@id': `${SITE}/#org` }, mainEntityOfPage: `${SITE}${path}`, image: `${SITE}/assets/og.jpg`, citation: c.sources.map((k) => SOURCES[k].url) },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: u.crumbHome, item: `${SITE}${L[lang].home === '/' ? '/' : L[lang].home}` },
      { '@type': 'ListItem', position: 2, name: u.crumbFoods, item: `${SITE}${L[lang].foods}` },
      { '@type': 'ListItem', position: 3, name: f.name[lang], item: `${SITE}${path}` },
    ] },
  ] };
  const list = (items) => `<ul>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  return `${head(lang, { title: `${tx.q} Score ${s.score}/100 | Clear Food`, desc: answer.length > 158 ? answer.slice(0, answer.lastIndexOf(' ', 155)) + '…' : answer, path, alt: { en: L.en.foodPath(f), de: L.de.foodPath(f) }, ld })}
<body class="subpage">
${nav(lang, false)}
<main id="main" class="food-page">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="${L[lang].home}">${u.crumbHome}</a> › <a href="${L[lang].foods}">${u.crumbFoods}</a> › <span>${esc(f.name[lang])}</span></nav>
  <h1>${esc(tx.q)}</h1>
  <p class="fp-answer">${esc(answer)}</p>
  <section class="fp-card" aria-label="${esc(f.name[lang])}">
    <div class="fp-card-top"><div><strong>${esc(f.name[lang])}</strong><span>${s.servingGrams ? `${s.servingGrams} ${s.servingUnit} · ` : ''}${m.cal} ${mt.cal}</span></div>${ring(s.score, u.scoreLabel(s.score), true)}</div>
    ${goalBars(lang, s.goals, true)}
    <p class="fp-macros">${m.protein} g ${mt.protein} · ${m.carbs} g ${mt.carbs} · ${m.fat} g ${mt.fat} <span>${u.perServing}</span></p>
  </section>
  <div class="fp-proscons">
    <section><h2>${u.likes}</h2>${list(s.why[lang])}</section>
    <section><h2>${u.dislikes}</h2>${list(s.cautions[lang])}</section>
  </div>
  ${showSwap ? `<section class="fp-swap"><h2>${u.swapH2}</h2><div class="fp-swap-card">${ring(s.swap.score, u.scoreLabel(s.swap.score), true)}<div><strong>${esc(f.swap.name[lang])}</strong><span>${u.swapPoints(s.swap.score - s.score)} · ${L[lang].goals.clear_skin} ${s.swap.goals.clear_skin}</span></div></div></section>` : ''}
  <section class="fp-sources"><h2>${u.sourcesH2}</h2><ul>${c.sources.map((k) => `<li><a href="${SOURCES[k].url}" target="_blank" rel="noopener">${esc(SOURCES[k].title)}</a><span>${esc(SOURCES[k].by)}</span></li>`).join('')}</ul></section>
  <section class="fp-cta"><h2>${u.ctaH2}</h2><p>${u.ctaLead}</p><div class="store-actions"><button class="store-button android" data-waitlist>${AND_SVG}<span>${HOME[lang].androidBtn}</span></button><a class="store-button ios" href="${APP}" target="_blank" rel="noopener">${IOS_SVG}<span>${HOME[lang].iosBtn}</span></a></div></section>
  <section class="fp-more"><h2>${u.moreH2}</h2><div class="food-chips">${others.map((o) => `<a class="food-chip" href="${L[lang].foodPath(o)}">${ring(SCANS[o.slug].score, u.scoreLabel(SCANS[o.slug].score), true)}<span>${esc(o.name[lang])}</span></a>`).join('')}</div></section>
  <p class="fp-note">${u.scanned(s.scannedAt)} ${u.note}</p>
</main>
${footer(lang, lang === 'en' ? L.de.foodPath(f) : L.en.foodPath(f))}`;
}

function hubPage(lang) {
  const u = FOOD_UI[lang]; const path = L[lang].foods;
  const sorted = [...FOODS].sort((a, b) => SCANS[b.slug].score - SCANS[a.slug].score);
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: u.hubH1, description: u.hubDesc, inLanguage: lang, url: `${SITE}${path}`, publisher: { '@id': `${SITE}/#org` } },
    { '@type': 'ItemList', itemListElement: sorted.map((f, i) => ({ '@type': 'ListItem', position: i + 1, name: COPY[f.slug][lang].q, url: `${SITE}${L[lang].foodPath(f)}` })) },
  ] };
  return `${head(lang, { title: u.hubTitle, desc: u.hubDesc, path, alt: { en: L.en.foods, de: L.de.foods }, ld })}
<body class="subpage">
${nav(lang, false)}
<main id="main" class="food-page">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="${L[lang].home}">${u.crumbHome}</a> › <span>${u.crumbFoods}</span></nav>
  <h1>${u.hubH1}</h1>
  <p class="fp-answer">${u.hubLead}</p>
  <ol class="hub-list">
${sorted.map((f) => { const s = SCANS[f.slug]; return `    <li><a href="${L[lang].foodPath(f)}">${ring(s.score, u.scoreLabel(s.score), true)}<span><strong>${esc(f.name[lang])}</strong><em>${esc(COPY[f.slug][lang].q)}</em></span><i aria-hidden="true">→</i></a></li>`; }).join('\n')}
  </ol>
  <p class="fp-note">${u.note}</p>
</main>
${footer(lang, lang === 'en' ? L.de.foods : L.en.foods)}`;
}

// ── /android — nothing but the waitlist ──────────────────────────────────
// One URL for everyone (bio links, invite links): the language follows the
// visitor's browser via data-autolang, see waitlist.js.
function androidPage() {
  return `<!doctype html>
<html lang="en" data-autolang>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Clear Food for Android – join the waitlist</title>
<meta name="description" content="Clear Food is coming to Android. Join the waitlist and get 1 month free at launch.">
<link rel="canonical" href="${SITE}/android">
<meta name="theme-color" content="#4b6183">
<meta property="og:title" content="Clear Food for Android – join the waitlist">
<meta property="og:description" content="Join the waitlist and get 1 month free at launch.">
<meta property="og:image" content="${SITE}/assets/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<link rel="stylesheet" href="/oasis.css">
<script src="/waitlist.js" defer></script>
</head>
<body class="android-page">
<main id="waitlist" aria-live="polite"></main>
</body></html>
`;
}

// ── Write everything ─────────────────────────────────────────────────────
await write('index.html', homePage('en'));
await write('de/index.html', homePage('de'));
await write('foods/index.html', hubPage('en'));
await write('de/lebensmittel/index.html', hubPage('de'));
for (const f of FOODS) {
  if (!SCANS[f.slug] || !COPY[f.slug]) throw new Error(`${f.slug}: missing scan or copy — run scripts/scan-foods.mjs and add it to content/food-copy.mjs`);
  await write(`foods/${f.slug}/index.html`, foodPage('en', f));
  await write(`de/lebensmittel/${f.de}/index.html`, foodPage('de', f));
}
await write('android/index.html', androidPage());

const urls = [
  ['/', '/de'], ['/foods', '/de/lebensmittel'],
  ...FOODS.map((f) => [L.en.foodPath(f), L.de.foodPath(f)]),
];
const alt = (en, de) => `<xhtml:link rel="alternate" hreflang="en" href="${SITE}${en}"/><xhtml:link rel="alternate" hreflang="de" href="${SITE}${de}"/>`;
await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.flatMap(([en, de]) => [en, de].map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${TODAY}</lastmod>${alt(en, de)}</url>`)).join('\n')}
  <url><loc>${SITE}/android</loc><lastmod>${TODAY}</lastmod></url>
  <url><loc>${SITE}/privacy-policy</loc><lastmod>2026-09-27</lastmod></url>
  <url><loc>${SITE}/terms</loc><lastmod>2026-06-23</lastmod></url>
</urlset>
`);
console.log(`built ${4 + FOODS.length * 2 + 1} pages + sitemap`);

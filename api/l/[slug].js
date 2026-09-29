// Referral landing page: /marvin, /jenna, etc. — served via the rewrite
// in vercel.json (/:slug -> /api/l/:slug). Renders the exact same
// index.html, counts one visit server-side, and tags the page with the
// slug so script.js can attribute a click if the visitor downloads.

const fs = require("fs");
const path = require("path");
const { kv } = require("../_kv");

const APP_STORE = "https://apps.apple.com/de/app/clear-food-glowup-your-skin/id6779364653";
const SLUG_RE = /^[a-z0-9-]{1,40}$/;
// In-app browsers of TikTok (BytedanceWebview / musical_ly), Instagram, Facebook, Snapchat.
const IN_APP_RE = /BytedanceWebview|musical_ly|TikTok|Instagram|FBAN|FBAV|Snapchat/i;

function inAppPage(de) {
  const t = de
    ? { title: "Clear Food im App Store öffnen", lead: "Sieh, was dein Essen mit deiner Haut macht", store: "Im App Store öffnen", safari: "In Safari öffnen", hint: "Passiert nichts? Tippe oben rechts auf <b>•••</b> und dann auf <b>Im Browser öffnen</b>.", hold: "Oder diesen Link gedrückt halten → Öffnen" }
    : { title: "Open Clear Food in the App Store", lead: "See what your food does to your skin", store: "Open in the App Store", safari: "Open in Safari", hint: "Nothing happens? Tap <b>•••</b> at the top right, then <b>Open in browser</b>.", hold: "Or press and hold this link → Open" };
  return `<!doctype html><html lang="${de ? "de" : "en"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${t.title}</title>
<style>*{box-sizing:border-box}body{margin:0;min-height:100dvh;display:grid;place-items:center;padding:24px;font-family:-apple-system,Inter,sans-serif;color:#fff;background:linear-gradient(180deg,#4e5d75,#517099 45%,#7492bb)}main{width:min(360px,100%);text-align:center}img{width:84px;height:84px}h1{font-size:2.25rem;letter-spacing:-.04em;margin:14px 0 6px}p{margin:0;color:#dce7f4;line-height:1.5}a.btn{display:block;margin-top:14px;padding:16px;border-radius:100px;font-weight:600;font-size:1.0625rem;text-decoration:none}.primary{background:#fff;color:#10233c;margin-top:30px!important}.secondary{border:1px solid #ffffff80;color:#fff}.hint{margin-top:26px;font-size:.875rem}.hold{display:inline-block;margin-top:10px;color:#fff;font-size:.8125rem}</style></head>
<body><main><img src="/assets/app-icon-256.webp" alt=""><h1>Clear Food</h1><p>${t.lead}</p>
<a class="btn primary" data-t="dl-appstore" href="itms-apps://apps.apple.com/app/id6779364653">${t.store}</a>
<a class="btn secondary" data-t="dl-safari" href="x-safari-https://www.clearfood.app/download">${t.safari}</a>
<p class="hint">${t.hint}</p><a class="hold" data-t="dl-https" href="${APP_STORE}">${t.hold}</a></main>
<script>document.querySelectorAll("[data-t]").forEach(function(a){a.addEventListener("click",function(){try{navigator.sendBeacon("/api/track",new Blob([JSON.stringify({slug:a.dataset.t,type:"click"})],{type:"application/json"}))}catch(e){}})});</script>
</body></html>`;
}
const RESERVED = new Set(["admin", "api", "assets", "favicon.ico", "robots.txt", "index.html", "privacy-policy", "terms", "content", "de", "foods", "android", "sitemap.xml"]);

module.exports = async (req, res) => {
  const slug = String(req.query.slug || "").toLowerCase();

  // clearfood.app/download — one link for bios: iPhone → App Store,
  // Android → the waitlist page, everything else → the homepage. Counted per
  // platform (cf:download:ios / :ios-inapp / :android / :other), shown nowhere yet —
  // read them with the same KV as the referral stats.
  if (slug === "download") {
    const ua = String(req.headers["user-agent"] || "");
    const platform = /android/i.test(ua) ? "android" : /iphone|ipad|ipod/i.test(ua) ? "ios" : "other";
    try {
      await kv("incr", `cf:download:${platform}`);
    } catch (err) {
      console.error("[download] count failed", err);
    }
    // TikTok/Instagram open links in their own browser, and on iPhone that
    // browser shows a white page instead of opening the App Store. There we
    // serve a small page with three ways out; which one works is counted
    // (dl-appstore / dl-safari / dl-https in /admin).
    if (platform === "ios" && IN_APP_RE.test(ua)) {
      try {
        await kv("incr", "cf:download:ios-inapp");
      } catch (err) {
        console.error("[download] count failed", err);
      }
      const de = /^de\b/i.test(String(req.headers["accept-language"] || ""));
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.status(200).send(inAppPage(de));
      return;
    }
    const target = { ios: APP_STORE, android: "/android", other: "/" }[platform];
    res.writeHead(302, { Location: target, "Cache-Control": "no-store" });
    res.end();
    return;
  }

  if (!SLUG_RE.test(slug) || RESERVED.has(slug)) {
    res.writeHead(302, { Location: "/" });
    res.end();
    return;
  }

  try {
    await Promise.all([
      kv("incr", `cf:link:${slug}:visits`),
      kv("sadd", "cf:links", slug),
    ]);
  } catch (err) {
    console.error("[track] visit failed", err);
  }

  const filePath = path.join(process.cwd(), "index.html");
  const html = fs
    .readFileSync(filePath, "utf8")
    .replace("</head>", `<script>window.__CF_REF=${JSON.stringify(slug)};</script>\n</head>`);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(html);
};

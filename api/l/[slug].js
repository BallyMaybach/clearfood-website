// Referral landing page: /marvin, /jenna, etc. — served via the rewrite
// in vercel.json (/:slug -> /api/l/:slug). Renders the exact same
// index.html, counts one visit server-side, and tags the page with the
// slug so script.js can attribute a click if the visitor downloads.

const fs = require("fs");
const path = require("path");
const { kv } = require("../_kv");

const APP_STORE = "https://apps.apple.com/de/app/clear-food-glowup-your-skin/id6779364653";
const SLUG_RE = /^[a-z0-9-]{1,40}$/;
const RESERVED = new Set(["admin", "api", "assets", "favicon.ico", "robots.txt", "index.html", "privacy-policy", "terms", "content", "de", "foods", "android", "sitemap.xml"]);

module.exports = async (req, res) => {
  const slug = String(req.query.slug || "").toLowerCase();

  // clearfood.app/download — one link for bios: iPhone → App Store,
  // Android → the waitlist page, everything else → the homepage. Counted per
  // platform (cf:download:ios / :android / :other), shown nowhere yet —
  // read them with the same KV as the referral stats.
  if (slug === "download") {
    const ua = String(req.headers["user-agent"] || "");
    const platform = /android/i.test(ua) ? "android" : /iphone|ipad|ipod/i.test(ua) ? "ios" : "other";
    try {
      await kv("incr", `cf:download:${platform}`);
    } catch (err) {
      console.error("[download] count failed", err);
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

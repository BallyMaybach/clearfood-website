// Referral landing page: /marvin, /jenna, etc. — served via the rewrite
// in vercel.json (/:slug -> /api/l/:slug). Renders the exact same
// index.html, counts one visit server-side, and tags the page with the
// slug so script.js can attribute a click if the visitor downloads.

const fs = require("fs");
const path = require("path");
const { kv } = require("../_kv");

const SLUG_RE = /^[a-z0-9-]{1,40}$/;
const RESERVED = new Set(["admin", "api", "assets", "favicon.ico", "robots.txt", "index.html"]);

module.exports = async (req, res) => {
  const slug = String(req.query.slug || "").toLowerCase();

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

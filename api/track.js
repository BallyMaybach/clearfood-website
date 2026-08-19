// Client-side beacon for click tracking (visits are counted server-side
// in api/l/[slug].js — only clicks on the download CTA need a client call).

const { kv } = require("./_kv");

const SLUG_RE = /^[a-z0-9-]{1,40}$/;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  let body = req.body;
  if (!body || typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch {
      body = {};
    }
  }

  const slug = String(body.slug || "").toLowerCase();
  const type = body.type === "click" ? "click" : null;

  if (!SLUG_RE.test(slug) || !type) {
    res.status(400).json({ error: "invalid" });
    return;
  }

  try {
    await Promise.all([
      kv("incr", `cf:link:${slug}:clicks`),
      kv("sadd", "cf:links", slug),
    ]);
  } catch (err) {
    console.error("[track] click failed", err);
    res.status(500).json({ error: "kv_failed" });
    return;
  }

  res.status(204).end();
};

// Admin dashboard data source. Auth: ?key= or x-admin-key header, checked
// against ADMIN_SECRET (set as a Vercel env var, never in the repo).

const { kv } = require("./_kv");

module.exports = async (req, res) => {
  const key = req.query.key || req.headers["x-admin-key"];

  if (!process.env.ADMIN_SECRET || key !== process.env.ADMIN_SECRET) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  const slugs = (await kv("smembers", "cf:links")) || [];

  const links = await Promise.all(
    slugs.map(async (slug) => {
      const [visits, clicks] = await Promise.all([
        kv("get", `cf:link:${slug}:visits`),
        kv("get", `cf:link:${slug}:clicks`),
      ]);
      return {
        slug,
        visits: Number(visits) || 0,
        clicks: Number(clicks) || 0,
      };
    })
  );

  links.sort((a, b) => b.visits - a.visits);

  res.status(200).json({ links });
};

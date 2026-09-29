# clearfood.app

Marketing landing page for Clear Food (iOS food scanner). Plain HTML/CSS/JS — no build step, no framework, deploys to Vercel as-is. Layout mirrors calai.app section-for-section (nav → hero → features → cause → CTA → footer), light mode, minus pages we don't have (FAQ/Blog/Press/Login/Android).

## Structure

Most pages are **generated** — edit the source, then run `node scripts/build.mjs` (no install needed):

- `scripts/build.mjs` — homepage (EN `/`, DE `/de`), food pages (`/foods/*`, `/de/lebensmittel/*`), `/android`, `sitemap.xml`. Homepage copy lives at the top of this file.
- `content/food-list.mjs` — which foods get a page and what is sent to the scan.
- `content/food-copy.mjs` — the hand-written answer per food + sources (same list as the app's "Sources & science").
- `content/scans.json` — real Clear Food scan results. `node scripts/scan-foods.mjs` scans foods that are missing (delete an entry to rescan).
- `waitlist.js` — Android waitlist (Supabase `android_waitlist`), popup on normal pages, full screen on `/android`, EN/DE.
- `app.js` — menu, FAQ, scroll-driven scan. `script.js` — referral click tracking + TikTok hold-to-open.
- Hand-made, not generated: `privacy-policy/`, `terms/`, `admin.html`, `robots.txt`.

**New food:** add it to `food-list.mjs`, run `scan-foods.mjs`, write its copy in `food-copy.mjs`, run `build.mjs`.

## Links for bios

`clearfood.app/download` — iPhone → App Store, Android → `/android`, everything else → homepage. Counted per platform in KV (`cf:download:ios|android|other`).

## Referral links + admin dashboard

Every `clearfood.app/<name>` (e.g. `/marvin`) serves the exact same `index.html` (via the rewrite in `vercel.json` → `api/l/[slug].js`), counts a visit server-side, and tags the page so a click on any App Store CTA reports back to `/api/track`. `/admin` shows a table of all links with visits/clicks/CTR.

- `api/_kv.js` — thin fetch wrapper around the Vercel KV (Upstash Redis) REST API, no SDK dependency.
- `api/l/[slug].js` — the referral landing page (counts the visit, injects `window.__CF_REF`).
- `api/track.js` — click beacon, called from `script.js` via `sendBeacon`.
- `api/stats.js` — admin data source, guarded by `ADMIN_SECRET`.
- `admin.html` — the dashboard at `/admin` (key stored in `sessionStorage`, not in the URL by default).

**One-time setup in the Vercel dashboard (can't be done via CLI/API):**
1. Project → Storage → Create Database → **Upstash Redis** (the "KV" successor) → connect it to `clearfood-website`. This auto-adds `KV_REST_API_URL` / `KV_REST_API_TOKEN` as env vars.
2. Project → Settings → Environment Variables → add `ADMIN_SECRET` (any long random string) for Production + Preview.

No pre-registration needed — a link starts counting the moment someone opens it; `/admin` just lists whatever the KV set `cf:links` has seen. `assets`, `api`, `admin`, `favicon.ico`, `robots.txt` are reserved and can't be used as referral names.

# clearfood.app

Marketing landing page for Clear Food (iOS food scanner). Plain HTML/CSS/JS — no build step, no framework, deploys to Vercel as-is. Layout mirrors calai.app section-for-section (nav → hero → features → cause → CTA → footer), light mode, minus pages we don't have (FAQ/Blog/Press/Login/Android).

## Structure

- `index.html` — the whole page (nav → hero → reviews → footer)
- `styles.css` — design tokens mirror the app's light palette (`Clear-Food-App/lib/theme.js`); the reviews section deliberately breaks to the app's dark palette for contrast
- `script.js` — hold-to-open interaction for the download CTAs (nav mobile + hero), no dependencies
- `assets/` — real app icon + hero mockup already in place, see `assets/README.md`

App Store link is live: `https://apps.apple.com/de/app/clear-food-glowup-your-skin/id6779364653`. Reviews in the "What users say about us" section are real ASC customer reviews (verbatim, incl. typos) — refresh via `node scripts/asc.mjs GET /v1/apps/6779364653/customerReviews --all` in the Clear-Food-App repo if new ones come in.

## Still needed before launch

- [ ] `assets/og-image.png` — 1200×630 social preview card
- [ ] Final copy review (current copy is a first draft grounded in the app's actual features/thesis, not yet reviewed)

## Local preview

Just open `index.html` in a browser, or serve it:

```bash
npx serve .
```

## Deploy

Push to GitHub, then import the repo in Vercel — no config needed, it's detected as a static site automatically. Point the `clearfood.app` domain at the Vercel project once purchased.

# clearfood.app

Marketing landing page for Clear Food (iOS food scanner). Plain HTML/CSS/JS — no build step, no framework, deploys to Vercel as-is. Layout mirrors calai.app section-for-section (nav → hero → features → cause → CTA → footer), light mode, minus pages we don't have (FAQ/Blog/Press/Login/Android).

## Structure

- `index.html` — the whole page
- `styles.css` — design tokens mirror the app's light palette (`Clear-Food-App/lib/theme.js`)
- `script.js` — scroll-reveal for feature cards, no dependencies
- `assets/` — real app icon + hero mockup already in place, see `assets/README.md`

## Still needed before launch

- [ ] Real App Store URL (three `href="#"` placeholders in `index.html`, marked `TODO`)
- [ ] `assets/og-image.png` — 1200×630 social preview card
- [ ] Final copy review (current copy is a first draft grounded in the app's actual features/thesis, not yet reviewed)

## Local preview

Just open `index.html` in a browser, or serve it:

```bash
npx serve .
```

## Deploy

Push to GitHub, then import the repo in Vercel — no config needed, it's detected as a static site automatically. Point the `clearfood.app` domain at the Vercel project once purchased.

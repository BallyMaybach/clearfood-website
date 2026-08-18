# clearfood.app

Marketing landing page for [Clear Food](https://github.com/) (iOS food scanner). Plain HTML/CSS/JS — no build step, no framework, deploys to Vercel as-is.

## Structure

- `index.html` — the whole page (nav, hero, features, cause section, CTA band, footer)
- `styles.css` — design tokens mirror the app's dark palette (`Clear-Food-App/lib/theme.js`)
- `script.js` — score-ring draw-in animation + scroll-reveal, no dependencies
- `assets/` — see `assets/README.md` for what's still needed

## Still needed before launch

- [ ] Real App Store URL (two `href="#"` placeholders in `index.html`, marked `TODO`)
- [ ] `assets/hero-mockup.png` — a real result-screen screenshot
- [ ] `assets/favicon.png`, `assets/og-image.png`
- [ ] Final copy review (current copy is a first draft grounded in the app's actual features/thesis, not yet reviewed)

## Local preview

Just open `index.html` in a browser, or serve it:

```bash
npx serve .
```

## Deploy

Push to GitHub, then import the repo in Vercel — no config needed, it's detected as a static site automatically. Point the `clearfood.app` domain at the Vercel project once purchased.

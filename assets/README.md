# Assets needed

Drop these in here (same filenames — the HTML already points at them):

- `hero-mockup.png` — a real scan-result screenshot from the app (ideally the light-mode result screen with a good score, ~750×1624 or any 375:812 ratio). Once added, swap the placeholder `<div class="placeholder-label">` in `index.html`'s `.phone-slot` for `<img src="assets/hero-mockup.png" alt="Clear Food scan result">`.
- `favicon.png` — small square export of the app icon.
- `og-image.png` — 1200×630 social preview card (screenshot + wordmark works fine).

Nothing renders broken without these — the hero falls back to a labeled placeholder box until you add `hero-mockup.png`.

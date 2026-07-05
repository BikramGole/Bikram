# DevXtechnic.github.io — Project Wiki

## Stack
- **Frontend:** Vanilla HTML, CSS, JavaScript (no framework)
- **Deployment:** GitHub Pages
- **Error Tracking:** Sentry (CDN)
- **Testing:** Playwright (e2e tests)

## Structure
- `index.html` — Main landing page (33KB minified, critical CSS inlined)
- `about.html` — About page (14KB minified, critical CSS inlined)
- `contact.html` — Contact page (14KB minified, critical CSS inlined)
- `styles.css` — All styles (~110KB, minified, loaded async via `media="print"`)
- `script.js` — All JavaScript (~90KB, minified, deferred)
- `tests/` — Playwright e2e tests
- `playwright.config.mjs` — Playwright configuration

## Performance
- Critical CSS inlined in `<head>` — base vars, layout, header, hero, buttons, avatar card, section rail
- `styles.css` loaded async (`media="print" onload="this.media='all'"`) — non-render-blocking
- `script.js` deferred — downloads in parallel, executes after HTML parse
- Google Fonts loaded async — non-render-blocking with `display=swap`
- Sentry CDN deferred — init moved into `script.js`
- Images: bikram.jpeg 400px, logos resized to 400px max, all compressed
- `loading="lazy"` on all 5 spotlight logos
- Theme init default changed to "neo" (matches critical CSS vars); mint vars also inlined
- All files minified
- Playwright uses Chrome for Testing binary (headless shell not available)

## Key Details
- Personal website "The Aura" — AI insights, Linux, coding
- Static site hosted on GitHub Pages (`.nojekyll` file present)
- All pages are separate HTML files
- Tests run via `npm run test:e2e` (Playwright)

## Workflows
- `.github/workflows/opencode-autofix.yml` — Auto-fix Sentry errors
- `.github/workflows/sentry-event-checker.yml` — Polls Sentry API

# DevXtechnic.github.io — Project Wiki

## Stack
- **Frontend:** Vanilla HTML, CSS, JavaScript (no framework)
- **Deployment:** GitHub Pages
- **Error Tracking:** Sentry (CDN)
- **Testing:** Playwright (e2e tests)

## Structure
- `index.html` — Main landing page
- `about.html` — About page
- `contact.html` — Contact page
- `styles.css` — All styles (~138KB)
- `script.js` — All JavaScript (~125KB)
- `tests/` — Playwright e2e tests
- `playwright.config.mjs` — Playwright configuration

## Key Details
- Personal website "The Aura" — AI insights, Linux, coding
- Static site hosted on GitHub Pages (`.nojekyll` file present)
- All pages are separate HTML files
- Tests run via `npm run test:e2e` (Playwright)

## Workflows
- `.github/workflows/opencode-autofix.yml` — Auto-fix Sentry errors
- `.github/workflows/sentry-event-checker.yml` — Polls Sentry API

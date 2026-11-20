# Bikram Gole — Site Design System

The site is a personal portfolio for Bikram Gole, an AI-leaning student builder from Gongabu, Kathmandu. Its voice stays curious, direct, and a little playful. The visual redesign moves the site from a layered space-and-terminal skin to a clear editorial layout while keeping its content, routes, and interactions.

## Stack and delivery

- Vanilla HTML, CSS, and JavaScript, served as separate static pages on GitHub Pages.
- GitHub REST API powers live repository and contribution details.
- Sentry loads from its CDN for error tracking.
- Existing canvas, Web Audio, Nepali date, terminal, quiz, and audio player integrations remain in `script.js`.
- Playwright end-to-end coverage lives in `tests/` and runs with `npm run test:e2e`.
- Shared styles live in `styles.css`; `tokens.css` defines the palette and type system, and `base.css` supplies the reset and base rules.

## Routes and content

| Page | Main content |
| --- | --- |
| `index.html` | Hero, CLI snapshot, mission console, project spotlight, AI constellation, culture and brain fuel, mini terminal, persona quiz, and live GitHub data |
| `about.html` | Hero, identity snapshot, strengths, influences, and common questions |
| `contact.html` | Hero and six direct contact links |
| `404.html` | Not-found message, navigation, and timed return countdown |

## Visual system

- Genre: modern-minimal; first-page shape: Signal Archive, a personal hero followed by technical snapshots, selected work, influences, and interactive experiments.
- Default palette: Cobalt, a cool paper surface with a contrast-safe electric-blue accent.
- Theme picker: the existing Neo, Mint, Sunset, Midnight, Ember, Arctic, Grape, Toxic, Ocean, Blood Moon, Zen, Liquid Glass, Material 3, Paper, Black Flag, and Macchiato palettes remain selectable.
- Display: Familjen Grotesk. Body: IBM Plex Sans. Code and measured values: JetBrains Mono. Fonts are self-hosted in `assets/fonts/`.
- Surfaces use hairline rules and quiet paper steps. Cards use an 8px radius; controls use 6px.
- The real portrait and terminal snapshot anchor the hero. No stock imagery is used.
- The responsive header keeps primary navigation, theme selection, and music controls. The section rail, command palette, and dialogs retain their script hooks.

## Controls and motion

- Primary action: solid accent with readable paired ink; secondary action: paper fill and ruled edge.
- Focus: visible 2px outline using the focus token.
- Control feedback uses short transform and color transitions. Content is visible without JavaScript, and reduced-motion preferences remove animation.

## Files

- `styles.css` — page compositions, components, and responsive rules.
- `tokens.css` — color, typography, spacing, shape, and motion tokens plus theme palettes.
- `base.css` — reset and base typography.
- `.hallmark/log.json` — redesign decision and review record.

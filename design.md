# Bikram Gole (Aura Farmer) — Website Design Brief

## Overview
Personal portfolio site for Bikram Gole, a 16-year-old Nepali student builder from Gongabu, KTM. The site lives at `devxtechnic.github.io` and brands the owner as **"Neo"** / **"Aura Farmer"** — a dark, playful, hacker-infused personal web experiment.

**Vibe:** Dark space + terminal aesthetic, chaotic fun, "aura farming," debate-mode energy. Low corporate, high personality.

---

## Pages

| Page | Slug | Sections |
|------|------|----------|
| Home | `index.html` | Hero, CLI Snapshot, Mission Console (pulse/launch system), Project Spotlight (3 projects), AI Constellation (influences/stack), Culture + Brain Fuel (books/movies/games/anime), Neo Terminal (interactive mini-shell), Persona Quiz, Live GitHub (API-fetched repos) |
| About | `about.html` | Hero, Identity Snapshot (grid cards), Strengths (4 cards), AI + Influence Stack |
| Contact | `contact.html` | Hero, Direct Links (2 emails, GitHub, LeetCode) |

---

## Tech Stack

- **Vanilla HTML / CSS / JS** — no frameworks, no build step, no SPA
- **GitHub Pages** for hosting (static only)
- **GitHub REST API** — live repo fetching
- **Google Fonts:** Space Grotesk (body), Syne (headings)
- **Nerd Fonts** — terminal theming (JetBrains Mono, FiraCode)
- **Nepali Date Library** (CDN import) — live BS date on penguin avatar
- **Web Audio API** — pulse sound effects
- **Canvas API** — animated starfield + shooting stars

---

## Current Design System

### Typography
- **Headings:** Syne (700, 800) — geometric, bold
- **Body:** Space Grotesk (400, 500, 700) — clean sans-serif
- **Code/Terminal:** JetBrains Mono / FiraCode / Courier New (monospace stack)
- **Base size:** 16px, clamped with `clamp()` for responsiveness

### Color System
- All colors are CSS custom properties, swapped per theme
- Core tokens: `--bg-0`, `--bg-1`, `--bg-2`, `--ink`, `--muted`, `--blue`, `--blue-2`, `--orange`, `--orange-2`, `--card`, `--border`, `--header`
- Every theme redefines these 12 tokens

### Theme Engine (15 themes)
| Theme Key | Display Name | Personality |
|-----------|-------------|-------------|
| `mint` | Mint Matrix | Green-cyan, default |
| `neo` | Neo Blue | Blue-orange, original |
| `sunset` | Sunset Warp | Warm pink-orange |
| `midnight` | Midnight Ice | Cool blue, deeper bg |
| `ember` | Ember Core | Red-orange, fire |
| `arctic` | Arctic Pulse | Cyan-teal, cold |
| `grape` | Grape Nebula | Purple-violet |
| `toxic` | Toxic Lime | Neon green |
| `ocean` | Ocean Drift | Blue-teal |
| `bloodmoon` | Blood Moon | Red-crimson |
| `zen` | Zen Temple | Warm earth tones, cozy |
| `liquidglass` | Liquid Glass | Frosted glass, translucent |
| `material3` | Material 3 | M3-inspired, Android |
| `paper` | Paper Link | Light mode, paper texture |
| `blackflag` | Black Flag Uprising | Pirate/anarchist, gold+red |

Theme persistence via `localStorage` + URL `?theme=` parameter.

### Layout
- Single-column, centered max-width (`1200px`)
- Sticky header with nav + theme controls
- Fixed bottom section-rail (scroll-based active section navigation)
- Cards use `--page-gutter` (1.15rem) for padding
- Sections separated by subtle borders + backdrop blur

### Interactive Components
1. **Starfield** — Canvas-based parallax stars + shooting stars
2. **Tilt cards** — mousemove 3D rotation on cards (disabled on mobile/reduced-motion)
3. **Scroll reveals** — IntersectionObserver + opacity/translate/filter reveal animations
4. **Pulse system** — counter with audio, backdrop wave animation, milestone unlocks (Music at 10, ISTJ Grid at 15, Matrix Rain at 20)
5. **Neo Terminal** — functional mini-shell with ~50 commands, history, autocomplete
6. **Persona Quiz** — 86 questions, random 10-per-session, inline game
7. **Command Palette** — Ctrl+K panel with searchable actions
8. **Page transitions** — fade-out on internal link navigation
9. **Name pronunciation** — plays audio file on click
10. **Typewriter effects** — hero name, status line, CLI snapshot, quotes
11. **Mascot avatars** — CSS-only penguin (default), android (Material 3 theme), zen monk (Zen theme)
12. **Blackflag gunfire** — click-to-shoot easter egg on Black Flag theme
13. **Matrix rain** — canvas column-drop effect (unlocked at 20 pulses)

---

## Key UX Observations & Opportunities

### Strengths
- Extremely high personality and uniqueness
- Rich interactive experience that impresses visitors
- Theme system is a major differentiator
- Terminal and quiz are genuinely engaging

### UX Pain Points

**Information Architecture**
- Home page is very long (9+ sections) — visitors may feel overwhelmed
- No clear primary call-to-action hierarchy
- Contact page is sparse (just 4 links, no form)
- Projects blend into the long scroll

**Visual Design**
- 5842 lines of CSS — monolithic, hard to maintain
- Many effects running simultaneously (tilt + starfield + noise + glow + pulse + typewriter) can feel busy
- Card hover effects depend on mouse tracking (`--mx`/`--my`) but this doesn't work on touch
- Typography hierarchy could be sharper (only Syne for all heading levels)
- Section headings use `h2::after` gradient line — clever but inconsistent alignment
- Some color contrast may be insufficient on certain themes

**Mobile / Responsive**
- The site is functional on mobile but feels desktop-first
- Section rail is a single row on desktop but 2 rows on home — cramped on small screens
- Avatar cards (penguin/android/zen) take space but serve minimal info
- Hero grid is 2-column — can stack awkwardly

**Performance**
- Canvas starfield + noise overlay + multiple CSS animations simultaneously
- No lazy loading for sections beyond initial viewport (though `content-visibility: auto` helps)
- Font loading with Google Fonts + Nerd Fonts
- Large CSS file delivered for every page (no code splitting)

**Accessibility**
- Some text relies on color alone to convey meaning
- Quiz option selected state could be more prominent
- Theme select dropdown has 15 options with no visual preview
- Motion-heavy (though `prefers-reduced-motion` is respected)
- No skip-to-content link visible by default (uses off-screen technique)

**Brand Clarity**
- "Neo" (brand name in header) vs "Aura Farmer" (tagline) vs "Bikram Gole" (legal name) — three identities
- Site purpose isn't immediately clear to first-time visitors
- The "aura farmer" concept is central but never explained

---

## Design Goals for Improvement

1. **Simplify the visual density** — reduce competing effects, let core content breathe
2. **Improve mobile UX** — reflow hero, compress section rail, simplify avatar display
3. **Strengthen information hierarchy** — clearer CTAs, better section rhythm, less scroll fatigue
4. **Modernize the design system** — introduce spacing scale, refined typography, better color contrast rules
5. **Add a contact form** — the contact page needs more utility
6. **Make themes more accessible** — ensure contrast works across all 15 themes
7. **Improve performance** — lazy-load heavy effects, reduce CSS size, optimize animations
8. **Refine brand clarity** — unify "Neo / Aura Farmer / Bikram Gole" into a coherent brand voice
9. **Better project showcase** — the 3 spotlight projects deserve more visual prominence
10. **Add a blog or notes section** — the site lacks a place for writing/updates

---

## Reference Files

```
index.html     — Home page (541 lines)
about.html     — About page (173 lines)
contact.html   — Contact page (189 lines)
styles.css     — All styles, ~5842 lines, 15 themes inline
script.js      — All JS, ~2600+ lines, no modules
```

---

## Design Constraints

- **Static hosting** (GitHub Pages) — no backend, no SSR, no API routes
- **No frameworks** — pure HTML/CSS/JS (or minimal if adding tooling)
- **Must preserve all 15 themes** — the theme engine is a key differentiator
- **Must preserve terminal, quiz, pulse** — core interactive features
- **Must remain lightweight** for a personal project
- **Dark-first** — light mode is optional (only Paper theme exists)

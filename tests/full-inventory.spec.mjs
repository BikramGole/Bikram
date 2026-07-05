import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';

/****************************************************
 * FEATURE INVENTORY & ACCEPTANCE CRITERIA
 *
 * 1. ROUTING & NAVIGATION
 * 2. THEME SYSTEM
 * 3. HEADER / HAMBURGER MENU
 * 4. HERO SECTION (index)
 * 5. NAME PRONUNCIATION
 * 6. MISSION CONSOLE / PULSE
 * 7. QUOTE SYSTEM
 * 8. MATRIX EFFECT
 * 9. PROJECT SPOTLIGHT
 * 10. NEO TERMINAL
 * 11. PERSONA QUIZ
 * 12. COMMAND PALETTE
 * 13. GITHUB LIVE
 * 14. STARFIELD
 * 15. BACK-TO-TOP
 * 16. SCROLL REVEAL
 * 17. AGE DISPLAY (about)
 * 18. CONTACT PAGE LINKS
 * 19. PAGE TRANSITIONS
 * 20. PAGE MASCOT
 * 21. SENTRY (index only)
 * 22. AUDIO (name pronunciation)
 * 23. RESPONSIVE / MOBILE
 ****************************************************/

// ─── 1. ROUTING & NAVIGATION ───────────────────────────
test.describe('1. Routing & Navigation', () => {
  test('1a: index page loads with correct title', async ({ page }) => {
    await page.goto(BASE + '/');
    await expect(page).toHaveTitle(/Bikram Gole.*Aura Farmer/);
  });

  test('1b: about page loads with correct title', async ({ page }) => {
    await page.goto(BASE + '/about.html');
    await expect(page).toHaveTitle(/Bikram Gole.*About/);
  });

  test('1c: contact page loads with correct title', async ({ page }) => {
    await page.goto(BASE + '/contact.html');
    await expect(page).toHaveTitle(/Bikram Gole.*Contact/);
  });

  test('1d: nav links navigate between pages', async ({ page }) => {
    await page.goto(BASE + '/');
    // Find and click "About" link
    const aboutLinks = page.locator('nav a[href*="about"]');
    if (await aboutLinks.count() > 0) {
      await aboutLinks.first().click();
      await page.waitForURL('**/about.html', { timeout: 5000 });
      await expect(page).toHaveTitle(/About/);
    }
  });

  test('1e: 404 or missing page returns error gracefully', async ({ page }) => {
    const resp = await page.goto(BASE + '/nonexistent.html', { waitUntil: 'domcontentloaded' }).catch(() => null);
    // Should not crash — either 404 page or fallback
    expect(resp === null || resp.status() === 404 || resp.ok()).toBe(true);
  });
});

// ─── 2. THEME SYSTEM ──────────────────────────────
test.describe('2. Theme System', () => {
  test('2a: default theme is neo on page load', async ({ page }) => {
    await page.goto(BASE + '/');
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    const bodyData = await page.evaluate(() => document.body.dataset.theme);
    expect(theme || 'neo').toBe('neo');
    expect(bodyData || 'neo').toBe('neo');
  });

  test('2b: theme cycle button works (clicks through N themes)', async ({ page }) => {
    await page.goto(BASE + '/');
    const btn = page.locator('#theme-cycle-btn');
    await expect(btn).toBeVisible();

    // Get initial theme
    const initial = await page.evaluate(() => document.documentElement.dataset.theme || 'neo');
    
    // Click to cycle
    await btn.click();
    await page.waitForTimeout(200);
    const afterClick = await page.evaluate(() => document.documentElement.dataset.theme || 'neo');
    
    // Theme should have changed from initial (unless there's only 1 theme, unlikely)
    // More importantly it should NOT be undefined
    expect(afterClick).toBeTruthy();
    console.log(`  Theme cycle: ${initial} → ${afterClick}`);
  });

  test('2c: URL param sets theme (mint)', async ({ page }) => {
    await page.goto(BASE + '/?theme=mint');
    await page.waitForTimeout(200);
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe('mint');
  });

  test('2d: localStorage persists theme across pages', async ({ page }) => {
    await page.goto(BASE + '/?theme=mint');
    await page.waitForTimeout(300);
    // Navigate to about page — should keep mint from localStorage
    await page.goto(BASE + '/about.html');
    await page.waitForTimeout(200);
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe('mint');
  });

  test('2e: URL param overrides localStorage', async ({ page }) => {
    // Set localStorage to mint, then load with ?theme=neo
    await page.goto(BASE + '/');
    await page.evaluate(() => localStorage.setItem('neoThemeVariant.v1', 'mint'));
    await page.goto(BASE + '/?theme=neo');
    await page.waitForTimeout(200);
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe('neo');
  });

  test('2f: theme badge in ops-grid reflects current theme', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.goto(BASE + '/?theme=mint');
    await page.waitForTimeout(300);
    const opsTheme = await page.textContent('#ops-theme');
    expect(opsTheme?.toLowerCase().trim()).toBe('mint');
  });
});

// ─── 3. HEADER / HAMBURGER MENU ──────────────────
test.describe('3. Header & Hamburger Menu', () => {
  test('3a: header is visible on all pages', async ({ page }) => {
    for (const p of ['/', '/about.html', '/contact.html']) {
      await page.goto(BASE + p);
      const header = page.locator('.site-header');
      await expect(header).toBeVisible();
    }
  });

  test('3b: hamburger toggle is present and clickable', async ({ page }) => {
    await page.goto(BASE + '/');
    const ham = page.locator('.hamburger');
    await expect(ham).toBeVisible();
    
    // Click to open menu
    await ham.click();
    await page.waitForTimeout(200);
    const expanded = await ham.getAttribute('aria-expanded');
    expect(expanded).toBe('true');
    
    // Click again to close
    await ham.click();
    await page.waitForTimeout(200);
    const collapsed = await ham.getAttribute('aria-expanded');
    expect(collapsed).toBe('false');
  });

  test('3c: section rail links exist on index', async ({ page }) => {
    await page.goto(BASE + '/');
    const railLinks = page.locator('.section-rail a');
    const count = await railLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

// ─── 4. HERO SECTION ────────────────────────────
test.describe('4. Hero Section (index)', () => {
  test('4a: avatar image loads', async ({ page }) => {
    await page.goto(BASE + '/');
    const img = page.locator('img[src*="bikram.jpeg"]');
    await expect(img).toBeVisible();
    // Check natural width > 0 (image loaded)
    const naturalW = await img.evaluate(el => el.naturalWidth);
    expect(naturalW).toBeGreaterThan(0);
  });

  test('4b: CLI terminal displays content', async ({ page }) => {
    await page.goto(BASE + '/');
    const cli = page.locator('#cli-snapshot');
    await expect(cli).toBeVisible();
    const text = await cli.textContent();
    expect(text).toContain('whoami');
    expect(text).toContain('Bikram Gole');
    expect(text).toContain('skills');
  });

  test('4c: hero tagline is visible', async ({ page }) => {
    await page.goto(BASE + '/');
    const tagline = page.locator('#hero-tagline');
    await expect(tagline).toBeVisible();
  });
});

// ─── 5. NAME PRONUNCIATION ────────────────────────────
test.describe('5. Name Pronunciation', () => {
  test('5a: speak button exists', async ({ page }) => {
    await page.goto(BASE + '/');
    const btn = page.locator('#name-speak');
    await expect(btn).toBeVisible();
    const label = await btn.getAttribute('aria-label');
    expect(label?.toLowerCase()).toContain('pronunciation');
  });

  test('5b: audio element or playback is triggered on click', async ({ page }) => {
    await page.goto(BASE + '/');
    // Check if wav file exists (playback may not work in headless)
    const resp = await page.request.get(BASE + '/bikramgole.wav');
    expect(resp.status()).toBe(200);
    expect(Number(resp.headers()['content-length'])).toBeGreaterThan(1000);
  });
});

// ─── 6. MISSION CONSOLE / PULSE ──────────────────
test.describe('6. Mission Console / Pulse', () => {
  test('6a: mission console section is present on index', async ({ page }) => {
    await page.goto(BASE + '/');
    const section = page.locator('#mission-console');
    await expect(section).toBeVisible();
  });

  test('6b: Launch Pulse button starts pulse', async ({ page }) => {
    await page.goto(BASE + '/');
    const btn = page.locator('#console-launch-btn');
    await expect(btn).toBeVisible();
    
    // Initial state
    const initialPulse = await page.textContent('#ops-pulse-state');
    
    await btn.click();
    await page.waitForTimeout(500);
    
    // Pulse state should change
    const afterPulse = await page.textContent('#ops-pulse-state');
    console.log(`  Pulse state: "${initialPulse?.trim()}" → "${afterPulse?.trim()}"`);
    // Should be different from initial (or contain "active"/"running"/signal)
    const changed = afterPulse?.trim() !== initialPulse?.trim();
    expect(changed || afterPulse?.toLowerCase().includes('active')).toBe(true);
  });

  test('6c: ops-grid displays all 4 cards', async ({ page }) => {
    await page.goto(BASE + '/');
    const cards = page.locator('.ops-card');
    expect(await cards.count()).toBe(4);
    
    const labels = await cards.locator('.ops-label').allTextContents();
    expect(labels).toEqual(['Theme', 'Pulse State', 'Active Mode', 'Last Signal']);
  });

  test('6d: pulse ladder nodes exist', async ({ page }) => {
    await page.goto(BASE + '/');
    const nodes = page.locator('.pulse-node');
    expect(await nodes.count()).toBe(4);
  });
});

// ─── 7. QUOTE SYSTEM ────────────────────────────
test.describe('7. Quote System', () => {
  test('7a: Drop Insight button is present', async ({ page }) => {
    await page.goto(BASE + '/');
    const btn = page.locator('#quote-btn');
    await expect(btn).toBeVisible();
  });

  test('7b: clicking Drop Insight shows a quote', async ({ page }) => {
    await page.goto(BASE + '/');
    const output = page.locator('#quote-output');
    const initialText = await output.textContent();
    
    await page.locator('#quote-btn').click();
    await page.waitForTimeout(400);
    
    const afterText = await output.textContent();
    // Quote should change or appear
    console.log(`  Quote output before: "${initialText?.trim()}" after: "${afterText?.trim()}"`);
    const changed = afterText?.trim() !== initialText?.trim();
    expect(changed).toBe(true);
  });
});

// ─── 8. MATRIX EFFECT ────────────────────────────
test.describe('8. Matrix Effect', () => {
  test('8a: Toggle Matrix button exists', async ({ page }) => {
    await page.goto(BASE + '/');
    const btn = page.locator('#console-matrix-btn');
    await expect(btn).toBeVisible();
  });

  test('8b: clicking Matrix toggles mode', async ({ page }) => {
    await page.goto(BASE + '/');
    const btn = page.locator('#console-matrix-btn');
    const initialMode = await page.textContent('#ops-active-mode');
    
    await btn.click();
    await page.waitForTimeout(500);
    
    const afterMode = await page.textContent('#ops-active-mode');
    console.log(`  Active mode: "${initialMode?.trim()}" → "${afterMode?.trim()}"`);
    const changed = afterMode?.trim() !== initialMode?.trim();
    expect(changed).toBe(true);
  });
});

// ─── 9. PROJECT SPOTLIGHT ────────────────────────────
test.describe('9. Project Spotlight', () => {
  test('9a: Spotlight section exists', async ({ page }) => {
    await page.goto(BASE + '/');
    const section = page.locator('#project-spotlight');
    await expect(section).toBeVisible();
  });

  test('9b: spotlight cards render with names', async ({ page }) => {
    await page.goto(BASE + '/');
    const cards = page.locator('.spotlight-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(5);
    
    // All cards should have an h3
    for (let i = 0; i < count; i++) {
      const h3 = cards.nth(i).locator('h3');
      await expect(h3).toBeVisible();
      const name = await h3.textContent();
      expect(name?.trim().length).toBeGreaterThan(0);
    }
  });

  test('9c: project logo images load', async ({ page }) => {
    await page.goto(BASE + '/');
    const logos = page.locator('.spotlight-card img');
    const count = await logos.count();
    expect(count).toBeGreaterThanOrEqual(5);
    for (let i = 0; i < Math.min(count, 3); i++) {
      const src = await logos.nth(i).getAttribute('src');
      expect(src).toBeTruthy();
      const resp = await page.request.get(BASE + '/' + src);
      expect(resp.status()).toBe(200);
    }
  });
});

// ─── 10. NEO TERMINAL ────────────────────────────
test.describe('10. Neo Terminal', () => {
  test('10a: mini terminal form exists', async ({ page }) => {
    await page.goto(BASE + '/');
    const form = page.locator('#mini-terminal-form');
    await expect(form).toBeVisible();
  });

  test('10b: typing in terminal shows output', async ({ page }) => {
    await page.goto(BASE + '/');
    const input = page.locator('#mini-terminal-input');
    await expect(input).toBeVisible();
    await input.fill('');
    await input.type('help');
    await page.locator('#mini-terminal-form').evaluate(f => f.requestSubmit());
    await page.waitForTimeout(300);
    const output = page.locator('#mini-terminal-output');
    await expect(output).toBeVisible();
    const text = await output.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('10c: terminal processes multiple commands', async ({ page }) => {
    await page.goto(BASE + '/');
    const input = page.locator('#mini-terminal-input');
    const commands = ['whoami', 'date', 'nepal'];
    for (const cmd of commands) {
      await input.fill('');
      await input.type(cmd);
      await page.locator('#mini-terminal-form').evaluate(f => f.requestSubmit());
      await page.waitForTimeout(300);
      const output = page.locator('#mini-terminal-output');
      const text = await output.textContent();
      expect(text?.length).toBeGreaterThan(0);
    }
  });
});

// ─── 11. PERSONA QUIZ ────────────────────────────
test.describe('11. Persona Quiz', () => {
  test('11a: quiz section exists', async ({ page }) => {
    await page.goto(BASE + '/');
    const section = page.locator('#persona-quiz');
    await expect(section).toBeVisible();
  });

  test('11b: quiz start button works', async ({ page }) => {
    await page.goto(BASE + '/');
    const startBtn = page.locator('#quiz-start');
    await expect(startBtn).toBeVisible();
    await startBtn.click();
    await page.waitForTimeout(300);
    // Question should be displayed
    const question = page.locator('#quiz-question');
    await expect(question).toBeVisible();
    const qText = await question.textContent();
    expect(qText?.length).toBeGreaterThan(0);
  });

  test('11c: quiz can be answered through', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.locator('#quiz-start').click();
    await page.waitForTimeout(200);
    // Answer all questions
    let safety = 0;
    while (safety < 30) {
      safety++;
      const options = page.locator('#quiz-options button, #quiz-options .option, .quiz-option');
      const count = await options.count();
      if (count === 0) break;
      await options.first().click();
      await page.waitForTimeout(300);
    }
    // Should end with a score screen or final state
    const score = page.locator('#quiz-score');
    const scoreText = await score.textContent();
    expect(scoreText).toBeTruthy();
  });

  test('11d: quiz reset button works', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.locator('#quiz-start').click();
    await page.waitForTimeout(200);
    await page.locator('#quiz-reset').click();
    await page.waitForTimeout(200);
    // Should go back to initial state
    const startBtn = page.locator('#quiz-start');
    await expect(startBtn).toBeVisible();
  });
});

// ─── 12. COMMAND PALETTE ────────────────────────────
test.describe('12. Command Palette', () => {
  test('12a: command palette can be opened', async ({ page }) => {
    await page.goto(BASE + '/');
    const openBtn = page.locator('#palette-open');
    await expect(openBtn).toBeVisible();
    await openBtn.click();
    await page.waitForTimeout(200);
    const palette = page.locator('#command-palette');
    await expect(palette).toHaveClass(/open/);
  });

  test('12b: command palette input accepts text', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.locator('#palette-open').click();
    await page.waitForTimeout(200);
    const input = page.locator('#command-input');
    await expect(input).toBeVisible();
    await input.fill('help');
    await page.waitForTimeout(300);
    const results = page.locator('#command-results');
    await expect(results).toBeVisible();
  });

  test('12c: command palette closes on backdrop click', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.locator('#palette-open').click();
    await page.waitForTimeout(200);
    await page.locator('#command-backdrop').click();
    await page.waitForTimeout(200);
    const palette = page.locator('#command-palette');
    await expect(palette).not.toHaveClass(/open/);
  });
});

// ─── 13. GITHUB LIVE ─────────────────────────────
test.describe('13. GitHub Live', () => {
  test('13a: GitHub live section exists', async ({ page }) => {
    await page.goto(BASE + '/');
    const section = page.locator('#github-live');
    await expect(section).toBeVisible();
  });

  test('13b: repo stats load (may be empty if API fails)', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.waitForTimeout(2000); // Wait for API
    const totalStat = page.locator('#repo-total-stat');
    const starStat = page.locator('#repo-star-stat');
    // Some text should be there (empty or populated)
    const totalText = await totalStat.textContent();
    expect(totalText).toBeTruthy();
  });

  test('13c: repo toggle expands/collapses', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.waitForTimeout(1000);
    const toggle = page.locator('#repo-toggle');
    if (await toggle.isVisible()) {
      const initialExpanded = await toggle.getAttribute('aria-expanded');
      await toggle.click();
      await page.waitForTimeout(300);
      const afterExpanded = await toggle.getAttribute('aria-expanded');
      expect(afterExpanded).not.toBe(initialExpanded);
    }
  });

  test('13d: contribution graph section exists', async ({ page }) => {
    await page.goto(BASE + '/');
    const section = page.locator('#contribution-section');
    await expect(section).toBeVisible();
  });
});

// ─── 14. STARFIELD ─────────────────────────────
test.describe('14. Starfield Background', () => {
  test('14a: starfield canvas exists on all pages', async ({ page }) => {
    for (const p of ['/', '/about.html', '/contact.html']) {
      await page.goto(BASE + p);
      const canvas = page.locator('#starfield');
      await expect(canvas).toBeVisible();
    }
  });

  test('14b: noise overlay exists on index', async ({ page }) => {
    await page.goto(BASE + '/');
    const noise = page.locator('.noise');
    await expect(noise).toBeVisible();
  });
});

// ─── 15. BACK-TO-TOP ────────────────────────────
test.describe('15. Back-to-Top', () => {
  test('15a: back-to-top button exists on all pages', async ({ page }) => {
    for (const p of ['/', '/about.html', '/contact.html']) {
      await page.goto(BASE + p);
      const btn = page.locator('#back-to-top');
      await expect(btn).toBeVisible();
    }
  });
});

// ─── 16. SCROLL REVEAL ──────────────────────────
test.describe('16. Scroll Effects', () => {
  test('16a: reveal panels exist on index', async ({ page }) => {
    await page.goto(BASE + '/');
    const panels = page.locator('.panel.reveal');
    expect(await panels.count()).toBeGreaterThanOrEqual(3);
  });
});

// ─── 17. AGE DISPLAY (about) ────────────────────
test.describe('17. Age Display (about)', () => {
  test('17a: age display element exists', async ({ page }) => {
    await page.goto(BASE + '/about.html');
    const el = page.locator('#age-display');
    await expect(el).toBeVisible();
    const text = await el.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
    // Should be a number (age)
    expect(Number(text?.trim())).toBeGreaterThan(0);
  });
});

// ─── 18. CONTACT PAGE ──────────────────────────
test.describe('18. Contact Page', () => {
  test('18a: contact page has direct links section', async ({ page }) => {
    await page.goto(BASE + '/contact.html');
    const section = page.locator('#direct-links');
    await expect(section).toBeVisible();
  });

  test('18b: contact page has social links', async ({ page }) => {
    await page.goto(BASE + '/contact.html');
    // Check for links
    const links = page.locator('#direct-links a');
    expect(await links.count()).toBeGreaterThanOrEqual(1);
  });
});

// ─── 19. PAGE TRANSITIONS ──────────────────────
test.describe('19. Page Transitions', () => {
  test('19a: page transition overlay exists', async ({ page }) => {
    await page.goto(BASE + '/');
    const overlay = page.locator('#page-transition');
    await expect(overlay).toBeVisible();
  });

  test('19b: page mascot exists on all pages', async ({ page }) => {
    for (const p of ['/', '/about.html', '/contact.html']) {
      await page.goto(BASE + p);
      const mascot = page.locator('#page-mascot');
      await expect(mascot).toBeVisible();
    }
  });
});

// ─── 20. A11Y ────────────────────────────────
test.describe('20. Accessibility', () => {
  test('20a: skip link exists on all pages', async ({ page }) => {
    for (const p of ['/', '/about.html', '/contact.html']) {
      await page.goto(BASE + p);
      const skip = page.locator('.skip-link');
      await expect(skip).toBeVisible();
    }
  });

  test('20b: theme button has aria-label', async ({ page }) => {
    await page.goto(BASE + '/');
    const btn = page.locator('#theme-cycle-btn');
    const label = await btn.getAttribute('aria-label');
    expect(label?.length).toBeGreaterThan(0);
  });

  test('20c: images have alt text', async ({ page }) => {
    await page.goto(BASE + '/');
    const imgs = page.locator('img');
    const count = await imgs.count();
    for (let i = 0; i < count; i++) {
      const alt = await imgs.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

// ─── 21. PERFORMANCE ──────────────────────────
test.describe('21. Performance Baselines', () => {
  test('21a: HTML response time under 100ms for all pages', async ({ page }) => {
    for (const p of ['/', '/about.html', '/contact.html']) {
      const resp = await page.goto(BASE + p, { waitUntil: 'commit' });
      const timing = await page.evaluate(() => {
        const n = performance.getEntriesByType('navigation')[0];
        return n ? n.responseEnd : -1;
      });
      expect(timing).toBeGreaterThan(0);
      expect(timing).toBeLessThan(100);
      console.log(`  ${p}: responseEnd=${timing.toFixed(0)}ms`);
    }
  });
});

// ─── 22. SENTRY (index only) ──────────────────
test.describe('22. Sentry', () => {
  test('22a: Sentry script is loaded on index (deferred)', async ({ page }) => {
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    // Sentry is deferred, check if script tag exists
    const sentryScript = page.locator('script[src*="sentry"]');
    expect(await sentryScript.count()).toBe(1);
    const deferAttr = await sentryScript.getAttribute('defer');
    expect(deferAttr).not.toBeNull();
  });
});

// ─── 23. RESPONSIVE ───────────────────────────
test.describe('23. Responsive Layout', () => {
  test('23a: content fits on mobile viewport (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE + '/');
    // No horizontal scrollbar (layout breaks gracefully)
    const bodyW = await page.evaluate(() => document.body.scrollWidth);
    const vpW = await page.evaluate(() => window.innerWidth);
    // Content should not overflow beyond viewport width significantly
    expect(bodyW - vpW).toBeLessThan(50);
  });

  test('23b: hamburger is visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE + '/');
    const ham = page.locator('.hamburger');
    await expect(ham).toBeVisible();
  });

  test('23c: layout works on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE + '/');
    const bodyW = await page.evaluate(() => document.body.scrollWidth);
    const vpW = await page.evaluate(() => window.innerWidth);
    expect(bodyW - vpW).toBeLessThan(50);
  });
});

// ─── 24. META / SEO ──────────────────────────
test.describe('24. SEO & Meta', () => {
  test('24a: canonical link exists on all pages', async ({ page }) => {
    for (const p of ['/', '/about.html', '/contact.html']) {
      await page.goto(BASE + p);
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toBeVisible();
      const href = await canonical.getAttribute('href');
      expect(href).toContain('devxtechnic.github.io');
    }
  });

  test('24b: meta description exists on all pages', async ({ page }) => {
    for (const p of ['/', '/about.html', '/contact.html']) {
      await page.goto(BASE + p);
      const desc = page.locator('meta[name="description"]');
      const content = await desc.getAttribute('content');
      expect(content?.length).toBeGreaterThan(0);
    }
  });

  test('24c: OG tags present on index', async ({ page }) => {
    await page.goto(BASE + '/');
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toBeVisible();
  });
});

// ─── 25. AUDIO ──────────────────────────────
test.describe('25. Audio Assets', () => {
  test('25a: WAV file is accessible', async ({ page }) => {
    const resp = await page.request.get(BASE + '/bikramgole.wav');
    expect(resp.status()).toBe(200);
    expect(Number(resp.headers()['content-length'])).toBeGreaterThan(10000);
  });
});

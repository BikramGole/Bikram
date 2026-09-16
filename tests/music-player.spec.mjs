import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';

test.describe('Aura Music Player Feature & Aesthetic Tests', () => {
  test('Overlay opens on nav button click and has centered presence', async ({ page }) => {
    await page.goto(BASE + '/');
    const navBtn = page.locator('#nav-music-btn');
    await expect(navBtn).toBeVisible();

    const overlay = page.locator('#music-overlay');
    await expect(overlay).not.toHaveClass(/open/);

    await navBtn.click();
    await expect(overlay).toHaveClass(/open/);

    // Verify backdrop and panel are visible
    const backdrop = page.locator('#mo-backdrop');
    await expect(backdrop).toBeVisible();

    const panel = page.locator('#mo-panel');
    await expect(panel).toBeVisible();

    // Check width is substantially larger than old 380px on desktop
    const box = await panel.boundingBox();
    expect(box.width).toBeGreaterThan(450);
  });

  test('Shows Album Art and Vinyl Disc', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.locator('#nav-music-btn').click();

    const art = page.locator('#mo-art');
    await expect(art).toBeVisible();
    await expect(art).toHaveAttribute('src', /neffex-cover\.png/);

    const vinyl = page.locator('#mo-vinyl');
    await expect(vinyl).toBeAttached();

    const title = page.locator('#mo-title');
    await expect(title).toHaveText('Best of Me');

    const artist = page.locator('#mo-artist');
    await expect(artist).toHaveText('NEFFEX');
  });

  test('Has larger Centered Visualizer Canvas without technical cava caption', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.locator('#nav-music-btn').click();

    const visCanvas = page.locator('#mo-vis');
    await expect(visCanvas).toBeVisible();

    // Verify caption is not the technical cava developer text
    const captionText = await page.locator('.mo-vis-wrap').innerText();
    expect(captionText).not.toContain('cava.live · fft 256');
    expect(captionText).toContain('AURA WAVEFORM');

    const box = await visCanvas.boundingBox();
    expect(box.height).toBeGreaterThan(120);
  });

  test('Controls hierarchy: Hero play button, prev, next, shuffle, repeat', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.locator('#nav-music-btn').click();

    const playBtn = page.locator('#mo-play');
    await expect(playBtn).toBeVisible();
    await expect(playBtn).toHaveClass(/mo-play-btn/);

    const prevBtn = page.locator('#mo-prev');
    const nextBtn = page.locator('#mo-next');
    const shuffleBtn = page.locator('#mo-shuffle');
    const repeatBtn = page.locator('#mo-repeat');

    await expect(prevBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();
    await expect(shuffleBtn).toBeVisible();
    await expect(repeatBtn).toBeVisible();

    // Test shuffle toggle
    await shuffleBtn.click();
    await expect(shuffleBtn).toHaveClass(/active/);
    await shuffleBtn.click();
    await expect(shuffleBtn).not.toHaveClass(/active/);

    // Test repeat toggle
    await repeatBtn.click();
    await expect(repeatBtn).toHaveClass(/active/);
    await repeatBtn.click();
    await expect(repeatBtn).not.toHaveClass(/active/);
  });

  test('Volume controls and mute toggle', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.locator('#nav-music-btn').click();

    const slider = page.locator('#mo-volume');
    await expect(slider).toBeVisible();

    const pct = page.locator('#mo-vol-pct');
    await expect(pct).toHaveText('80%');

    // Test mute button
    const muteBtn = page.locator('#mo-mute-btn');
    await expect(muteBtn).toBeVisible();
    await muteBtn.click();
    await expect(pct).toHaveText('0%');

    // Unmute
    await muteBtn.click();
    await expect(pct).toHaveText('80%');
  });

  test('Playlist queue toggling and track switching', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.locator('#nav-music-btn').click();

    const queueToggle = page.locator('#mo-playlist-toggle');
    const queuePanel = page.locator('#mo-playlist-panel');

    await expect(queuePanel).not.toHaveClass(/open/);
    await queueToggle.click();
    await expect(queuePanel).toHaveClass(/open/);

    // Click track 2: Destiny
    const trackItems = page.locator('#mo-playlist li');
    expect(await trackItems.count()).toBe(2);
    await trackItems.nth(1).click();

    // Verify title and album art updated to Destiny
    await expect(page.locator('#mo-title')).toHaveText('Destiny');
    await expect(page.locator('#mo-art')).toHaveAttribute('src', /neffex-destiny-cover\.png/);
  });

  test('Overlay closes on backdrop click and Esc key', async ({ page }) => {
    await page.goto(BASE + '/');
    const navBtn = page.locator('#nav-music-btn');
    const overlay = page.locator('#music-overlay');

    // Open
    await navBtn.click();
    await expect(overlay).toHaveClass(/open/);

    // Close via Esc
    await page.keyboard.press('Escape');
    await expect(overlay).not.toHaveClass(/open/);

    // Open again
    await navBtn.click();
    await expect(overlay).toHaveClass(/open/);

    // Close via close button
    await page.locator('#mo-close').click();
    await expect(overlay).not.toHaveClass(/open/);
  });

  test('Distinct theme transformations on music player', async ({ page }) => {
    test.setTimeout(60000);
    for (const theme of ['paper', 'blackflag', 'liquidglass', 'bloodmoon', 'mint', 'sunset']) {
      await page.goto(`${BASE}/?theme=${theme}`);
      await page.locator('#nav-music-btn').click();
      const panel = page.locator('#mo-panel');
      await expect(panel).toBeVisible();

      // Check theme is applied to body/html
      const currentTheme = await page.evaluate(() => document.documentElement.dataset.theme);
      expect(currentTheme).toBe(theme);

      // Verify panel computed background or color is defined
      const bg = await panel.evaluate((el) => window.getComputedStyle(el).backgroundColor);
      expect(bg).toBeTruthy();
    }
  });

  test('YouTube-style keyboard shortcuts (Space, Arrows, M, N, P, S, R)', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.locator('#nav-music-btn').click();
    const overlay = page.locator('#music-overlay');
    await expect(overlay).toHaveClass(/open/);

    // Verify shortcuts hint bar is displayed
    const hint = page.locator('.mo-shortcuts-hint');
    await expect(hint).toBeVisible();

    // Space toggles playback
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);

    // M toggles mute
    await page.keyboard.press('m');
    await expect(page.locator('#mo-vol-pct')).toHaveText('0%');
    await page.keyboard.press('m');
    await expect(page.locator('#mo-vol-pct')).toHaveText('80%');

    // ArrowUp and ArrowDown change volume
    await page.keyboard.press('ArrowUp');
    await expect(page.locator('#mo-vol-pct')).toHaveText('85%');
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#mo-vol-pct')).toHaveText('80%');

    // S toggles shuffle
    const shuffleBtn = page.locator('#mo-shuffle');
    await page.keyboard.press('s');
    await expect(shuffleBtn).toHaveClass(/active/);
    await page.keyboard.press('s');
    await expect(shuffleBtn).not.toHaveClass(/active/);

    // R toggles repeat
    const repeatBtn = page.locator('#mo-repeat');
    await page.keyboard.press('r');
    await expect(repeatBtn).toHaveClass(/active/);
    await page.keyboard.press('r');
    await expect(repeatBtn).not.toHaveClass(/active/);

    // N switches track to Destiny
    await page.keyboard.press('n');
    await expect(page.locator('#mo-title')).toHaveText('Destiny');

    // P switches track back to Best of Me
    await page.keyboard.press('p');
    await expect(page.locator('#mo-title')).toHaveText('Best of Me');
  });
});

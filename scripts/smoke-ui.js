const { spawn } = require('node:child_process');
const { chromium } = require('playwright');

const port = 3101;
const baseURL = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'production' },
});

const waitForServer = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('Production server did not become ready');
};

(async () => {
  let browser;
  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      serviceWorkers: 'block',
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const failures = [];
    page.on('pageerror', (error) => failures.push(`page: ${error.message}`));
    page.on('requestfailed', (request) => failures.push(`request: ${request.url()} — ${request.failure()?.errorText}`));
    page.on('console', (message) => {
      if (message.type() === 'error') failures.push(`console: ${message.text()}`);
    });

    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /start a training shift/i }).click();
    await page.waitForURL('**/lab');
    await page.getByRole('button', { name: /enter the lab in guest mode/i }).click();
    await page.getByRole('button', { name: /queue/i }).first().waitFor();

    const closeGuide = page.getByRole('button', { name: 'Close training guide' });
    await page.waitForTimeout(600);
    if (await closeGuide.isVisible().catch(() => false)) await closeGuide.click();

    const ticket = page.locator('button').filter({ hasText: /(?:ENTRA|INTUNE|EXCH|M365|TEAMS)-\d{3}/ }).first();
    await ticket.waitFor();
    await ticket.click();

    for (const label of ['Directory', 'Comms', 'Clients', 'Report', 'Overview']) {
      const tab = page.getByRole('button', { name: new RegExp(label, 'i') }).first();
      await tab.click();
      await page.waitForTimeout(100);
    }

    if (failures.length) throw new Error(`Browser failures:\n${failures.join('\n')}`);
    console.log('OrbitDesk production UI smoke test passed: landing → lab → guest → ticket → all primary workspaces.');
    await context.close();
  } finally {
    if (browser) await browser.close();
    server.kill('SIGTERM');
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

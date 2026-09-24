const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: { dir: path.join(__dirname, 'public'), size: { width: 1280, height: 720 } },
    viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce'
  });
  const page = await context.newPage();
  page.setDefaultTimeout(3000);
  await page.goto('http://localhost:3000/lab', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  const enter = page.getByRole('button', { name: /Enter the lab in guest mode/i });
  if (await enter.isVisible()) await enter.click();
  await page.waitForTimeout(2000);
  await page.keyboard.press('Escape');
  const stages = ['Overview', 'Queue', 'Directory', 'Clients', 'Comms', 'Assessment'];
  for (const stage of stages) {
    const tab = page.getByRole('button', { name: new RegExp(stage, 'i') }).first();
    try { if (await tab.isVisible()) { await tab.click(); await page.waitForTimeout(2400); } } catch {}
  }
  await page.waitForTimeout(1000);
  await context.close();
  await browser.close();
})();

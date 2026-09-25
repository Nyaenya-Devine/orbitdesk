const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const pause = (page, ms) => page.waitForTimeout(ms);

(async () => {
  const outputDir = path.join(__dirname, 'artifacts', 'demo-capture');
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: { dir: outputDir, size: { width: 1440, height: 810 } },
    viewport: { width: 1440, height: 810 },
    reducedMotion: 'reduce',
    colorScheme: 'dark',
    serviceWorkers: 'block',
  });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  // Keep the recording deterministic; update lifecycle is tested separately.
  await page.route('**/sw.js', (route) => route.abort());

  await page.addInitScript(() => {
    localStorage.setItem('orbitdesk_user_profile', JSON.stringify({
      name: 'Amina K.', role: 'student', experience: 'junior',
      goal: 'Modern Workplace operations', joinedAt: Date.now(), track: 'operations',
    }));
    localStorage.setItem('orbitdesk_guide_seen', '1');
  });

  const caption = async (eyebrow, title, detail) => {
    await page.evaluate(({ eyebrow, title, detail }) => {
      document.getElementById('film-caption')?.remove();
      const el = document.createElement('div');
      el.id = 'film-caption';
      el.style.cssText = 'position:fixed;left:32px;bottom:28px;z-index:99999;width:480px;padding:16px 18px;border:1px solid rgba(167,139,250,.35);border-radius:14px;background:rgba(7,7,10,.92);box-shadow:0 18px 60px rgba(0,0,0,.55);backdrop-filter:blur(18px);color:white;font-family:Inter,system-ui,sans-serif;pointer-events:none';
      el.innerHTML = `<div style="font:700 9px/1.2 ui-monospace,monospace;letter-spacing:.18em;color:#a78bfa;text-transform:uppercase">${eyebrow}</div><div style="font:650 18px/1.25 system-ui;margin-top:7px">${title}</div><div style="font:400 12px/1.55 system-ui;margin-top:6px;color:#a1a1aa">${detail}</div>`;
      document.body.appendChild(el);
    }, { eyebrow, title, detail });
  };

  const clickTab = async (name) => {
    const tab = page.getByRole('button', { name: new RegExp(name, 'i') }).first();
    if (await tab.isVisible()) await tab.click();
  };

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await caption('OrbitDesk', 'A shift begins with the operational picture', 'A local training environment for identity, endpoint and service-desk judgment.');
  await pause(page, 5000);

  await page.goto('http://localhost:3000/lab', { waitUntil: 'networkidle' });
  await caption('01 · Intake', 'Prioritise the live queue', 'Read impact, urgency and remaining SLA before opening the first case.');
  await pause(page, 4500);

  const ticketButtons = page.locator('button').filter({ hasText: /(?:ENTRA|INTUNE|EXCH|M365|TEAMS)-\d{3}/ });
  if (await ticketButtons.count()) {
    await ticketButtons.first().click();
    await caption('02 · Evidence', 'Open the case, then inspect its context', 'The ticket carries the user, client, priority and required control plane into the investigation.');
    await pause(page, 5000);
  }

  await clickTab('Directory');
  await caption('03 · Directory', 'Confirm identity and organisational scope', 'Use the OU tree and user properties before deciding whether the fault is identity, policy or device state.');
  await pause(page, 5000);
  const treeItem = page.getByRole('button').filter({ hasText: /Users|Workstations|Finance|Operations/i }).first();
  try { if (await treeItem.isVisible()) await treeItem.click(); } catch {}
  await pause(page, 2500);

  const entra = page.getByRole('button', { name: /Entra ID/i }).first();
  try { if (await entra.isVisible()) await entra.click(); } catch {}
  await caption('04 · Entra ID', 'Correlate sign-in and Conditional Access evidence', 'A blocked sign-in should be explained before any exception or policy change is considered.');
  await pause(page, 5500);

  await clickTab('Clients');
  await caption('05 · Endpoint', 'Move from identity signal to device posture', 'Check compliance, encryption and sync state. Keep the remediation bounded to the affected object.');
  await pause(page, 5500);
  const intune = page.getByRole('button', { name: /Intune/i }).first();
  try { if (await intune.isVisible()) await intune.click(); } catch {}
  await pause(page, 3500);

  await clickTab('Comms');
  await caption('06 · Communication', 'Explain impact, action and verification', 'The client update records what was found, what changed and what must be confirmed next.');
  await pause(page, 5500);

  await clickTab('Report');
  await caption('07 · Assessment', 'Review operational judgment, not tab clicks', 'OrbitDesk scores SLA handling, technical sequence and communication quality across the shift.');
  await pause(page, 6500);

  await clickTab('Overview');
  await caption('OrbitDesk', 'Run the shift. Defend the change. Prove the outcome.', 'Modern Workplace operations practice without a production tenant.');
  await pause(page, 5000);

  const video = page.video();
  await context.close();
  await browser.close();
  console.log(await video.path());
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

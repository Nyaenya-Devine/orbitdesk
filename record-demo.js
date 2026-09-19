const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: path.join(__dirname, 'public'),
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();
  
  console.log('Navigating to local dev server...');
  // Wait for dev server
  let retries = 30;
  while (retries > 0) {
    try {
      await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 5000 });
      break;
    } catch (e) {
      console.log(`Waiting for dev server... ${retries}`);
      await new Promise(r => setTimeout(r, 2000));
      retries--;
    }
  }
  
  console.log('Recording demo flow...');
  await page.waitForTimeout(3000);
  
  // Step 1: Landing page
  console.log('Step 1: Landing');
  await page.waitForTimeout(2000);
  
  // Step 2: Go to lab
  await page.goto('http://localhost:3000/lab', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  // Step 3: Try to find Skip button and click (AuthGate)
  try {
    const skipBtn = page.locator('text=Skip').first();
    if (await skipBtn.isVisible({ timeout: 3000 })) {
      console.log('Found Skip button, clicking');
      await skipBtn.click();
      await page.waitForTimeout(1000);
    }
    const enterBtn = page.locator('text=Enter Lab Now').first();
    if (await enterBtn.isVisible({ timeout: 3000 })) {
      console.log('Found Enter Lab Now, clicking');
      await enterBtn.click();
      await page.waitForTimeout(2000);
    }
  } catch (e) { console.log('AuthGate skip failed', e.message); }
  
  // Step 4: Overview
  console.log('Step 4: Overview tab');
  try {
    const overviewTab = page.locator('button:has-text("Overview")').first();
    if (await overviewTab.isVisible({ timeout: 2000 })) {
      await overviewTab.click();
      await page.waitForTimeout(2000);
    }
  } catch {}
  
  // Step 5: Queue
  console.log('Step 5: Queue tab');
  try {
    const queueTab = page.locator('button:has-text("Queue")').first();
    if (await queueTab.isVisible({ timeout: 2000 })) {
      await queueTab.click();
      await page.waitForTimeout(2000);
      // Click first ticket
      const firstTicket = page.locator('[class*="ticket"], [class*="Ticket"]').first();
      // Try to click any ticket-like element
      const tickets = page.locator('div').filter({ hasText: 'P1' }).first();
      if (await tickets.isVisible({ timeout: 2000 })) {
        await tickets.click();
        await page.waitForTimeout(1500);
      }
    }
  } catch {}
  
  // Step 6: Directory
  console.log('Step 6: Directory');
  try {
    const dirTab = page.locator('button:has-text("Directory")').first();
    if (await dirTab.isVisible({ timeout: 2000 })) {
      await dirTab.click();
      await page.waitForTimeout(2000);
    }
  } catch {}
  
  // Step 7: Policies & Devices / Entra
  console.log('Step 7: Policies');
  try {
    const policiesTab = page.locator('button:has-text("Policies")').first();
    if (await policiesTab.isVisible({ timeout: 2000 })) {
      await policiesTab.click();
      await page.waitForTimeout(2000);
    }
    const clientsTab = page.locator('button:has-text("Clients")').first();
    if (await clientsTab.isVisible({ timeout: 1000 })) {
      await clientsTab.click();
      await page.waitForTimeout(2000);
    }
  } catch {}
  
  // Step 8: Communication
  console.log('Step 8: Comms');
  try {
    const commsTab = page.locator('button:has-text("Comms")').first();
    if (await commsTab.isVisible({ timeout: 2000 })) {
      await commsTab.click();
      await page.waitForTimeout(2000);
    }
  } catch {}
  
  // Step 9: Class
  console.log('Step 9: Class');
  try {
    const classTab = page.locator('button:has-text("Class")').first();
    if (await classTab.isVisible({ timeout: 2000 })) {
      await classTab.click();
      await page.waitForTimeout(2000);
    }
  } catch {}
  
  await page.waitForTimeout(2000);
  console.log('Demo recording complete, closing...');
  
  await context.close();
  await browser.close();
  console.log('Browser closed, video should be in public/');
})();

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Navigating to live site for mobile...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('https://owgtofficial.wixstudio.com/owgt', { waitUntil: 'domcontentloaded' });

  console.log('Scrolling down for mobile...');
  for (let i = 0; i < 25; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1000);
  }

  console.log('Taking mobile screenshot...');
  await page.screenshot({ path: 'reference-images/reference_live_mobile.png', fullPage: true });

  await browser.close();
  console.log('Done!');
})();

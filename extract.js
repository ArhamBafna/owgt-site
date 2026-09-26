const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Navigating to live site...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://owgtofficial.wixstudio.com/owgt', { waitUntil: 'networkidle' });

  console.log('Scrolling down for desktop...');
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1000);
  }

  console.log('Taking desktop screenshot...');
  await page.screenshot({ path: 'reference-images/reference_live_desktop.png', fullPage: true });

  const html = await page.content();
  fs.writeFileSync('raw-source-code/hydrated-index.html', html);

  console.log('Extracting image URLs...');
  const imgs = await page.$$eval('img', imgs => imgs.map(i => i.src));
  const bgImgs = await page.evaluate(() => {
    const els = [...document.querySelectorAll('*')];
    return els.map(el => window.getComputedStyle(el).backgroundImage)
              .filter(bg => bg && bg !== 'none');
  });
  fs.writeFileSync('raw-source-code/image-urls.json', JSON.stringify({ imgs, bgImgs }, null, 2));

  console.log('Navigating to live site for mobile...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('https://owgtofficial.wixstudio.com/owgt', { waitUntil: 'networkidle' });

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

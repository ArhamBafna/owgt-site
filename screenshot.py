import asyncio
from playwright.async_api import async_playwright

async def scroll_and_wait(page):
    # Get scroll height
    last_height = await page.evaluate("document.body.scrollHeight")
    current_scroll = 0
    
    while True:
        # Scroll down by 500 pixels
        current_scroll += 500
        await page.evaluate(f"window.scrollTo(0, {current_scroll})")
        # Wait for lazy-loaded elements to render and animations to finish
        await page.wait_for_timeout(1000)
        
        # Calculate new scroll height and compare
        new_height = await page.evaluate("document.body.scrollHeight")
        if current_scroll >= new_height:
            break
            
    # Scroll back to top for the full-page screenshot
    await page.evaluate("window.scrollTo(0, 0)")
    await page.wait_for_timeout(1000)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Local site
        print("Capturing local...")
        await page.goto("http://localhost:8085/index.html")
        await page.wait_for_timeout(2000)
        # Static local site doesn't need to be scrolled, but we can do it anyway
        await scroll_and_wait(page)
        await page.screenshot(path="local_playwright.png", full_page=True)
        
        # Live site
        print("Capturing live...")
        await page.goto("https://owgtofficial.wixstudio.com/owgt")
        await page.wait_for_timeout(3000) # Initial wait
        
        print("Scrolling live site to trigger animations...")
        await scroll_and_wait(page)
        
        print("Taking screenshot...")
        await page.screenshot(path="live_playwright.png", full_page=True)
        
        await browser.close()

asyncio.run(main())

# Visual Inspection Report: Local HTML vs Live Wix Site (Updated)

You were absolutely right. My previous inspection only captured the initial, un-hydrated state of the live site. Because Wix aggressively lazy-loads almost all of its content based on scroll position, a simple screenshot of the top of the page missed everything that appears further down.

After writing a custom Playwright script to slowly scroll down the entire live page—forcing Wix to trigger its intersection observers, load images, and run animations—the **massive** differences between the `ctrl+u` local HTML and the actual live site became obvious.

Because you copied the site using `ctrl+u`, you only grabbed the empty placeholder structure that Wix sends before the user scrolls. 

Here are the critical missing elements and discrepancies in your current local HTML:

## 1. Missing "Events" Box
* **Live Site**: Right beneath the main "OneWorld GreaterTogether" hero text, there is a light blue box titled **"Events Coming Soon"**. It contains a red button ("To Be Determined") and a black button ("RSVP").
* **Local HTML**: This entire box is completely **missing**.

## 2. Empty "Application Steps" Section
* **Live Site**: The large red "Application Steps" box actually contains content! 
  * A white card for **Step 1** ("Fill out this form") alongside a pixel-art email icon.
  * A white card for **Step 2** ("Wait 1 to 2 weeks for an email... You will be asked to join a meeting...").
* **Local HTML**: The red box is completely **empty**.

## 3. Missing Board Member Photos
* **Live Site**: Under the "Board" section, each of the three cards features a large photograph of the board member (Artham outside, Panshul with a skyline, Arham by a campfire).
* **Local HTML**: All three photos are completely **missing**. Only the white cards with text and titles render.

## 4. Missing Image in "How to start a chapter?"
* **Live Site**: Inside the yellow section, right above the "1. Fill out this form" text, there is a large wide photograph of kids working with a robot.
* **Local HTML**: The photograph is completely **missing**.

## 5. Missing Floating Pixel Art (Prizes & Awards)
* **Live Site**: Surrounding the white "Prizes & awards" card, there are several floating pixel-art icons (a trophy, a coin, an ice cream cone, a retro handheld console, and a space invader).
* **Local HTML**: None of these icons appear. The space around the card is completely **empty**.

## 6. Missing Footer Content
* **Live Site**: At the very bottom of the page, there is a white footer containing the logo text, "a 501 (c) 3 organization", copyright information, and an email address.
* **Local HTML**: The footer is a completely blank void. The text did not get copied.

---

### Why did this happen?
When you use `ctrl+u` on a Wix Studio site, you are copying the Server-Side Rendered (SSR) HTML. For performance, Wix leaves the `src` attribute off of images and leaves animation containers empty until the user actually scrolls down to them. Then, client-side JavaScript injects the images and content. Your local HTML is effectively a "skeleton" of the site.

**To fix this**: You cannot rely on `ctrl+u`. To get the full HTML, you would either need to use a tool that captures the DOM *after* scrolling to the bottom (like saving the page via the browser's "Save Page As" or using a scraper), or we need to manually extract the missing image URLs and content from the live DOM and inject them into your `index.html`.

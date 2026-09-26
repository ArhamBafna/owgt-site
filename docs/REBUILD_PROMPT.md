# MASTER PROMPT: 1-to-1 Clean Rebuild of OneWorldGreaterTogether (OWGT) Website

> **How to use this prompt:**  
> Copy and paste the entire text block below directly into your coding agent (Claude Code, Antigravity, Cursor, Windsurf, etc.). Make sure the agent has access to terminal execution, file system operations, and web/browser tools.

---

```markdown
You are an expert frontend engineer and visual replication specialist.
Your mission is to perform a complete, clean, pixel-perfect 1:1 rebuild of the OneWorldGreaterTogether (OWGT) website matching the live Wix Studio site.

### CONTEXT & PRE-EXISTING WORKSPACE ASSETS
The workspace has already been organized with existing references:
* **Live Site URL**: https://owgtofficial.wixstudio.com/owgt
* **Reference Live Screenshot**: `reference-images/live_playwright.png` (Full desktop view of the live Wix site)
* **Visual Audit Report**: `docs/visual_discrepancies.md` (Detailed checklist of elements missing from previous attempts)
* **Original Wix SSR Code**: `raw-source-code/wix-index.html` (Original raw source code for reference copy/text)
* **Social Links Reference**: `raw-source-code/linktree.html`

### TARGET SPECIFICATIONS
* **Target Viewports**: 
  1. Desktop: 1440px width
  2. Mobile: 390px width
* **Stack**: Semantic HTML5 (`index.html`), clean vanilla CSS3 (`style.css`), native JS for micro-interactions/modals. Zero external runtime dependencies, zero Wix scripts.
* **Output Structure**:
  * `index.html` (clean semantic markup in project root)
  * `style.css` (custom design system, responsive breakpoints in project root)
  * `assets/images/` (downloaded high-res photos and graphics)
  * `assets/icons/` (downloaded or crisp SVG pixel art)

---

### PHASE 0: SETUP
1. Check if `index.html` already exists in the project root. If present, back it up to `raw-source-code/index.backup.html`.
2. Ensure destination directories exist: `assets/images/` and `assets/icons/`.
3. Read `docs/visual_discrepancies.md` to review the 6 critical missing sections before writing any code.

---

### PHASE 1: ASSET & STYLE EXTRACTION (NO GUESSING)
Open `https://owgtofficial.wixstudio.com/owgt` using your browser automation / Playwright / scraping tooling.
Because Wix aggressively lazy-loads images and hydrates content on scroll, you MUST:
1. Set viewport to 1440x900.
2. Slowly scroll from top to bottom (scroll down 500px, wait 1 second, repeat until footer) to force all intersection observers, lazy images, and animations to load.
3. Save full-page reference screenshot as `reference-images/reference_live_desktop.png`.
4. Resize viewport to 390x844 (mobile), scroll top to bottom, and save reference screenshot as `reference-images/reference_live_mobile.png`.
5. Extract exact computed styles and assets directly from the DOM:
   * **Typography**: Identify exact font families used (e.g. Google Fonts or webfonts). Add the appropriate `@import` or `<link>` tags in CSS/HTML. Extract exact `font-size`, `font-weight`, `line-height`, and `letter-spacing` for headings and body copy.
   * **Color Palette**: Extract exact hex/RGB values for page backgrounds, card colors (light blue, yellow, red, dark panels), button colors, borders, and text colors. Store them in CSS variables in `:root`.
   * **Images & Media**: Download the original high-resolution files directly from the Wix CDN into `assets/`:
     * The 3 Board member portraits (Artham, Panshul, Arham).
     * The chapter robot photograph (kids working with a robot in the yellow section).
     * All floating pixel-art icons (trophy, coin, retro handheld game console, ice cream cone, space invader, pixel email icon).
     * Official OWGT logos / badges.

---

### PHASE 2: HTML STRUCTURE & SECTIONS (`index.html`)
Build clean, semantic HTML in `index.html` covering the full page hierarchy:
1. **Header / Navbar**:
   * OWGT logo lockup and navigation items.
2. **Hero Section**:
   * Main title: "OneWorld GreaterTogether" with accurate styling, subtitle, and primary call-to-actions.
3. **Events Section (CRITICAL - DO NOT OMIT)**:
   * Light blue card container titled "Events Coming Soon".
   * Red badge/button ("To Be Determined").
   * Action button ("RSVP").
4. **Application Steps Section (CRITICAL - DO NOT OMIT)**:
   * Large red container titled "Application Steps".
   * White Step 1 Card: "Fill out this form" accompanied by the pixel-art email icon.
   * White Step 2 Card: "Wait 1 to 2 weeks for an email... You will be asked to join a meeting...".
5. **Board of Directors Section (CRITICAL - DO NOT OMIT)**:
   * Three distinct profile cards.
   * Each card must display the real downloaded photograph of the board member at the top, followed by their name and role.
6. **Prizes & Awards Section (CRITICAL - DO NOT OMIT)**:
   * White center card with awards details.
   * Floating pixel-art graphics arranged around the perimeter of the card matching the live site layout.
7. **"How to start a chapter?" Section (CRITICAL - DO NOT OMIT)**:
   * Vibrant yellow section.
   * Full-width downloaded robot photograph positioned above the step instructions.
   * Numbered steps list.
8. **Footer (CRITICAL - DO NOT OMIT)**:
   * OWGT branding, 501(c)(3) non-profit status statement, copyright notice, contact email, and social media links.

#### BUTTON & FORM INTERACTION REQUIREMENT:
* Any button that leads to an external form or action (e.g., "RSVP", "Fill out this form") must NOT lead to a dead 404 link.
* Implement a visible modal or toast notification that fires when clicked:
  *"This is a placeholder button. Contact site owner for the live destination URL."*
* Include clear code comments directly above each link:
  `<!-- PLACEHOLDER LINK: Agent, do not invent dummy URLs. Ask user for real destination link before replacing this placeholder. -->`

---

### PHASE 3: STYLING & RESPONSIVENESS (`style.css`)
1. Define a comprehensive `:root` token system (colors, typography, spacing, shadows, border-radii).
2. Reset default browser margins/paddings and set `box-sizing: border-box`.
3. Implement clean CSS Grid / Flexbox layouts replicating the exact Wix Studio alignment and spacing.
4. Position the floating pixel-art icons cleanly using relative/absolute containers so they do not overlap text or break on screen resizing.
5. Add responsive media queries (`@media (max-width: 768px)`) to ensure every card, grid, image, and font size reorganizes cleanly to match `reference-images/reference_live_mobile.png`.

---

### PHASE 4: VISUAL VERIFICATION LOOP
1. Launch local preview or open `index.html` in browser.
2. Capture full-page screenshots:
   * `reference-images/local_rebuild_desktop.png` (at 1440px)
   * `reference-images/local_rebuild_mobile.png` (at 390px)
3. Compare local screenshots side-by-side with reference live screenshots (`reference-images/reference_live_desktop.png` and `reference-images/reference_live_mobile.png`).
4. Specifically audit the 6 critical zones from `docs/visual_discrepancies.md`:
   * [ ] Events box visible under hero?
   * [ ] Application Steps cards populated inside red section?
   * [ ] Board member photos loaded and sized accurately?
   * [ ] Robot image displayed in chapter section?
   * [ ] Floating pixel art icons positioned around prizes card?
   * [ ] Complete footer text and copyright present?
5. Fix any visual discrepancies in CSS or HTML, re-capture screenshots, and repeat until the rebuild achieves a true 1:1 match.

---

### PHASE 5: COMPLETION DELIVERABLES
Provide a concise summary:
1. Confirmation of clean `index.html` and `style.css` created in project root.
2. List of all extracted media files in `assets/`.
3. Confirmation of visual match for both Desktop (1440px) and Mobile (390px) against `docs/visual_discrepancies.md`.
```

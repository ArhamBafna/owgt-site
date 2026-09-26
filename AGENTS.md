# AGENTS.md - OneWorld GreaterTogether (OWGT) Project Reference & Context

This repository is a clean, dependency-free 1:1 rebuild of the official OneWorldGreaterTogether Wix Studio website.

---

## 1. Project Philosophy & Stack
- **Zero Framework Runtime**: Pure semantic HTML5 (`index.html`), vanilla CSS3 (`style.css`), and minimal native JavaScript for modals/interactions. No external JS libraries or Wix runtime bloat.
- **Hosted On**: Static site hosting (e.g. Vercel).
- **Target Viewports**:
  - Desktop: `1440px`
  - Mobile: `390px`

---

## 2. Directory Structure & Key Files

```text
main-site/
├── AGENTS.md                   # This file (primary orientation for AI agents & developers)
├── index.html                  # Production semantic HTML document
├── style.css                   # Custom design system, responsive styles, & sticky animations
├── assets/
│   ├── icons/                  # Authentic SVG vector icons & pixel art extracted from live Wix DOM
│   │   ├── arrow_down.svg      # Bouncing hero scroll arrow
│   │   ├── badge_gold.svg      # President badge on Artham's card
│   │   ├── badge_ribbon.svg    # Vice President ribbon badge
│   │   ├── coin.svg            # Floating pixel art coin
│   │   ├── console.svg         # Floating pixel art retro handheld game console
│   │   ├── email_envelope.svg  # Pixel art envelope for Step 1
│   │   ├── hero_trophy.svg     # Pixel art trophy in hero title
│   │   ├── icecream.svg        # Floating pixel art ice cream cone
│   │   ├── spaceinvader.svg    # Floating pixel art space invader
│   │   ├── trophy.svg          # Floating pixel art trophy (left)
│   │   └── trophy_right.svg    # Floating pixel art trophy (right)
│   └── images/                 # Downloaded high-resolution photographic assets
│       ├── board_member_1.jpg  # Artham Juvariwala portrait
│       ├── board_member_2.jpg  # Panshul Kadam portrait
│       ├── board_member_3.jpg  # Arham Bafna portrait
│       ├── chapter_robot.jpg   # Kids programming robotics in classroom (Chapter section)
│       ├── hero_bg.png         # Pastel watercolor clouds hero background
│       ├── owgt-logo.png       # Official OWGT logo lockup
│       └── volunteer_hackathon.jpg # Group working around laptop (Volunteer section)
├── reference-images/           # Visual ground truth screenshots
│   ├── live_playwright.png     # Full-page screenshot of the hydrated live Wix site (THE benchmark)
│   ├── local_playwright_new.png# Full-page screenshot of the rebuilt local website
│   ├── reference_live_desktop.png # Desktop live snapshot
│   └── reference_live_mobile.png  # Mobile live snapshot
├── raw-source-code/            # Original source references for copy, metadata, and styles
│   ├── wix-index.html          # Full raw source code from actual Wix site (inspect for exact text/SVGs/CSS)
│   ├── linktree.html           # Original Linktree source code (social links & metadata)
│   ├── hydrated-index.html     # Client-side hydrated DOM dump after scroll
│   ├── extracted-text.txt      # Clean extracted text content
│   └── image-urls.json         # Raw image URLs dump from Wix CDN
├── docs/
│   ├── visual_discrepancies.md # Audit log of differences caught between unhydrated vs live Wix
│   └── REBUILD_PROMPT.md       # Master specification prompt guiding rebuild
└── placeholder/                # Previous Next.js exploration folder (keep intact as reference)
```

---

## 3. Visual & Interactive Benchmarks

### Ground Truth Reference
- **`reference-images/live_playwright.png`**: This image shows exactly how the website is intended to look visually when fully hydrated and rendered on desktop. Any visual adjustments should be compared against this screenshot.
- **`raw-source-code/wix-index.html`**: The exact HTML/CSS extracted from the live Wix website. If in doubt regarding wording, exact color hexes, SVG geometry, or layout parameters, consult this file.

### Critical Interactions to Preserve
1. **Board Section Cascading Sticky Scroll**:
   - As the user scrolls through the Board section, the title `"Board"` remains sticky (`top: 80px`).
   - The three board member cards are contained in `.board-sticky-row` containers (`position: sticky; top: 180px`).
   - Card 1 (Artham) docks on the left.
   - Continuing the scroll brings in Card 2 (Panshul), docking in the center.
   - Further scroll brings in Card 3 (Arham), docking on the right.
   - Do **not** collapse these cards into a static 3-column grid without maintaining the desktop sticky scroll cascade.

2. **Hero Title Styling**:
   - Title uses the serif font `crave-fine` (700 bold).
   - The pixel art trophy (`assets/icons/hero_trophy.svg`) is positioned inside the title text near `"GreaterTogether"`.
   - The arrow below bounces gently to indicate scrolling downward.

3. **Top Marquee Ticker**:
   - An infinite seamless marquee banner at the very top displaying `🏆 Empowering Through Technology`.

4. **Action Buttons / Form Placeholders**:
   - Links like "RSVP", "Fill out this form", and "Download this document" currently open a placeholder toast modal (`#toast-modal`).
   - Do not invent dummy URLs. Ask the user for real destination URLs before replacing placeholders.

---

## 4. Instructions for Future Agents & Developers
1. **Small change = commit, big change = push**: Keep git commits clean and concise.
2. **Consult references first**: Check `raw-source-code/wix-index.html` and `reference-images/live_playwright.png` before guessing styles or layout.
3. **Preserve responsiveness**: Always verify that desktop (1440px) and mobile (390px) views remain intact.

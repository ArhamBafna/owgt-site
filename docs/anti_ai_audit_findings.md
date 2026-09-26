# anti-ai-audit findings — OneWorldGreaterTogether (Curated Filtered List)

Filtered audit findings based on selected scope. All other findings removed.

---

# PART 1 — BLOCKERS

## A. Content & Integrity Issues

| # | Problem | Where | What to do |
|---|---|---|---|
| **A5** | 🔴 **Developer placeholder text is live on the public page.** Clicking *"2. Download this document"* shows a popup reading: **"This is a placeholder button. Contact site owner for the live destination URL."** | `index.html:243` → `447` | Give the link a real URL, or delete the sentence. |
| **A6** | 🔴 **An instruction-to-AI comment is live in your HTML.** `<!-- PLACEHOLDER LINK: Agent, do not invent dummy URLs. Ask user for real destination link before replacing this placeholder. -->` — visible to anyone who views source. | `index.html:242` | Delete it. |
| **A7** | 🔴 **The newsletter section is copy for a completely different product.** *"keeping up with AI will DRAIN you… unless you get EVERYTHING YOU NEED TO KNOW… read while having your morning coffee. once a week."* plus `NEW: instantly get access to`. This is aggressive growth-hacker copy on a page for a youth volunteer nonprofit collecting emails from minors. | `index.html:293-313` | Rewrite to match OWGT's mission and youth education tone. |
| **A9** | 🟠 **Your footer social links are missing.** | `index.html:398-401` | Add genuine OWGT links (Discord, WhatsApp, TikTok, X, Instagram, YouTube). Do not copy advertiser links from raw Linktree scrape. |
| **A10** | 🟠 **Your own mission statement is missing from the site.** The hero has only the wordmark and no tagline explaining what OWGT does. | absent, after `index.html:55` | Add mission tagline under the h1: `Empowering students through education in Technology and STEM.` |

---

## B. Copy & Phrasing Flaws

| # | Problem | Where | Fix |
|---|---|---|---|
| **B1** | 🟠 **"you too can make a difference"** — overused nonprofit cliché, plus "our dedicated team", "hard workers who are truly passionate about making an impact", and passive "hours and recognition will be given". | `index.html:73-75` | Rewrite in clear, active, human voice. |
| **B2** | 🟠 **"sharing educating through the media"** — broken grammar from two concatenated Wix text boxes. | `index.html:179` | Fix Panshul bio to proper English. |
| **B3** | 🟠 **"focusing on new events and expanding."** — incomplete thought; `expanding` has no object. | `index.html:157-158` | Complete Arham bio sentence. |
| **B4** | 🟠 **Two humans, one identical sentence.** Arham and Panshul bios start with identical robotic template ("Hey my name is X, one of the two vice presidents at OWGT"). | `index.html:157` + `178` | Differentiate both introductions. |
| **B5** | 🟠 **"Want to volunteer?" asks a question and never answers it.** No button, link, or pointer to the volunteer form below. | `index.html:72` | Add a button or link pointing to `#join`. |
| **B8** | 🟡 **Google/Wix account ID leaked into a published URL.** `ouid=103293439982167147921` is a Wix scrape artifact. | `index.html:97` | Strip `&ouid=...` parameter. |
| **B10** | 🟡 **Developer control exposed in the hero.** `<button>Reset Colors</button>` canvas debug button is visible. | `index.html:42` | Rename or remove. |

---

## C. Silent Data-Loss Bug

- 🔴 **C1 — The RSVP form reports success on failure.** `index.html:514-525`
  If network drops, ad blocker blocks Brevo, or the server errors, the catch block still runs `successView.style.display = 'block'`. The visitor is told "You're on the list!" while their signup was lost silently.
  **Fix:** On error or `!res.ok`, display an error message with a fallback contact email.

---

## D. Deploy & Repository Leaks

- 🔴 **D1 — No root deploy configuration exists.** 22 MB of internal files (`raw-source-code/`, `reference-images/`, `graphify-out/`, `docs/`, `placeholder/`) are currently deployable and publicly accessible at guessable URLs. Add a root `.vercelignore`.
- 🔴 **D2 — Two orphan `.bak` PNGs ship today (2.9 MB).** `hero_bg.bak.png` (1.3 MB) and `hero_bg_og.bak.png` (1.6 MB) are unreferenced.
- 🟠 **D3 — `graphify-out/` has 81 tracked files.** Cache files continue to track and dirty git. Untrack from git and ignore.
- 🟠 **D4 — `AGENTS.md` is modified-but-uncommitted,** and contains a typo (`EXPLICETLY` → `EXPLICITLY`).
- 🟡 **D6 — Three conflicting favicons.** Root `favicon.ico`, `placeholder/public/favicon.ico`, and `assets/images/favicon.png` (190 KB). Competing declarations cause browser to download a 190 KB image for a 16px tab icon.

---

# PART 2 — HIGH-VALUE FIXES

## E. Links & Social Previews

- 🟠 **E2 — No `mailto:` link anywhere.** Contact email `oneworldgreatertogether@gmail.com` in footer is plain unclickable text.
- 🟠 **E3 — OG social preview card exists but is not wired up.** `assets/images/hero_bg_og.bak.png` exists. Re-encode to 1200×630 JPEG (~17 KB) and connect `<meta property="og:image">` and Twitter card tags so shared links display an image.

---

## F. Performance & Asset Weight

**Site size is 22.52 MB (target is under 1.5–3 MB).**

| File | Current Size | Rendered At | Issue |
|---|---:|---|---|
| `chapter_robot.jpg` | **12,443 KB** | ~610×420 | 54% of entire site weight |
| `board_member_2.jpg` | **2,419 KB** | 380×360 | 10.6× linear oversized |
| `board_member_1.jpg` | **2,336 KB** | 380×360 | 10.6× linear oversized |
| `hero_bg.png` | **1,298 KB** | 1920w cover | Uncompressed PNG |
| `owgt-logo.png` | **695 KB** | ~512w | Uncompressed PNG |
| `volunteer_hackathon.jpg` | **622 KB** | 1240w | Oversized JPEG |
| `favicon.png` | **190 KB** | 16px | 190 KB downloaded for 16px icon |
| `board_member_3.jpg` | **311 KB** | 380×360 | 6.6× oversized |

- **Image Re-encoding Win:** Converting the 8 images to modern WebP / AVIF at actual display dimensions reduces weight from **17.7 MB to ~123–181 KB (99.3% reduction)**.
- 🔴 **Missing `width` and `height` on all 17 `<img>` elements:** Browser cannot reserve layout space, causing content to shift (CLS) as images load.
- 🔴 **Missing `loading="lazy"` on all 17 images:** Board photos and below-fold assets load immediately on initial page load.
- 🟠 **Missing `decoding="async"` on images:** Causes main-thread decode stutter.
- 🟠 **Missing `fetchpriority` on LCP image:** Hero image lacks priority signal.
- **Cold-cache LCP on 4G is ~14 seconds.**
- **Render-blocking CSS:** External stylesheets block initial paint.
- **Unused Google Fonts:** Five unused `Inter` weights and unused italic axis in font URL.

---

## G. Accessibility & Mobile Usability

- 🔴 **G1 — Navbar overflows 390px viewport target by ~53px.** Computed minimum navbar width is 443px. The RSVP button on the far right gets clipped and pushed off-screen on mobile devices.
- 🔴 **G2 — Six contrast failures:**
  - Newsletter input placeholder (`#c0ccda` on white = 1.63:1, requires 4.5:1).
  - Newsletter link "390+ AI resources" (`#2BB2FC` on `#EBF8E7` = 2.15:1, requires 4.5:1).
  - Nav RSVP button (white on `#F73D18` = 3.73:1, requires 4.5:1).
  - Events button (white on `#E63B2E` = 4.18:1, requires 4.5:1).
  - Mobile join button (white on `#0f9992` = 3.50:1, requires 4.5:1).
- 🔴 **G3 — No keyboard focus outline on any button or link.** Zero `focus-visible` styling on navigation links, logo, buttons, or modal triggers. Keyboard tab navigation is invisible.
- 🔴 **G4 — RSVP modal dialog accessibility flaws:**
  - No focus trap: Tab key escapes the modal into the obscured page behind it.
  - No scroll lock: Background page still scrolls while modal is open.
  - No focus restoration: Closing modal drops focus to page top instead of the triggering button.
- 🔴 **G5 — Invisible hero reset button is still keyboard-focusable.** Uses `opacity: 0` instead of `visibility: hidden` or `display: none`, making keyboard tab focus disappear into a hidden element.
- 🔴 **G6 — Both email inputs lack `<label>` tags.** Only have placeholders, causing screen readers to announce unhelpful "edit text".

---

# PART 3 — CODE & STYLES

## H. JavaScript Defects

- 🟠 **H2 — No Device Pixel Ratio (DPR) scaling on hero canvas.** Renders at CSS pixels and stretches, looking blurry on retina and mobile screens.
- 🟠 **H3 — Window resize wipes canvas scratch progress without debounce.** Triggers full redraw on every resize event, clearing revealed pixels.
- 🟠 **H4 — Unthrottled `mousemove` calculations.** Evaluates media queries and `getBoundingClientRect` on every mouse move without `requestAnimationFrame`.
- 🟠 **H6 — 265-character Brevo endpoint duplicated verbatim.** Declared in `index.html:287` and `508`. Risk of endpoints diverging onto different lists.
- 🟠 **H7 — Form lacks fallback `action`/`method`.** Form submission does nothing if JavaScript fails to load or is disabled.
- 🟠 **H8 — Global namespace pollution.** Modal functions and variables sit on window scope alongside third-party vendor scripts.
- 🟡 **H9 — Dead error strings.** Code defines error messages for SMS, phone numbers, and dates that do not exist on the form.
- 🟡 **H10 — `autocomplete="off"` on email input.** Breaks browser autofill for visitors.
- 🟡 **H11–H13 — Script hygiene:** `bgImg.onload` clobbered on redraw, `ctx.filter` unsupported on older Safari, missing `'use strict'`, and `closeToast` used before declaration.

---

## I. Vendor Form Style Clashes

- **17 separate `!important` declarations in `style.css` solely to fight `sibforms.com` vendor stylesheet.**
- Newsletter form structure is scattered across 5 places: HTML markup, 17 inline `style=""` attributes, a 321-line CSS override block, global window variables, and an external 461 KB vendor script bundle.

---

## J. Design System & Styling Inconsistencies

- 🟠 **J5 — Five competing reds:** `#E63B2E`, `#F73D18`, `#F75F40`, `#fd0009`, and `#d93025` used inconsistently across buttons and states.
- 🟠 **J6–J7 — Eight button definitions & mismatched RSVP modal:** Six pill buttons and two squared buttons with inconsistent corner radii and colors. RSVP modal uses an unrelated blue palette.
- 🟠 **J8 — `transition: all` on 15 elements:** Transitions all properties including layout dimensions (`width`, `height`, `padding`), degrading smoothness.
- 🟠 **J10 — Desktop `!important` kills mobile rule:** Base `padding: 0 !important` permanently overrides mobile media query padding rule.
- 🟠 **J11 — Six permanent infinite animations:** Run continuously with `will-change: transform`, draining device battery.
- 🟡 **J12 — Dead `:hover` rule:** `.hero-scroll-indicator:hover` transform is completely overridden by active keyframe animation.
- 🟡 **J13 — Dead CSS:** Rules for non-existent `.events-card`, 4 redundant container resets, and dead IE placeholder rules.
- 🟡 **J14 — Unused CSS class hooks:** 7 class hooks in HTML (such as `card-left`, `card-center`, `card-right`) have zero CSS rules attached.
- 🔴 **Fake Button (Hallmark Tell):** `<span class="btn-tbd">None yet, check back soon...</span>` is styled identically to a primary red button (color, pill shape, shadow) but is completely inert.

# Graph Report - main-site  (2026-09-26)

## Corpus Check
- 19 files · ~1,331,171 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 3, .ico 2, .css 2)

## Summary
- 531 nodes · 960 edges · 31 communities (24 shown, 7 thin omitted)
- Extraction: 68% EXTRACTED · 31% INFERRED · 2% AMBIGUOUS · INFERRED: 293 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `836bc6e4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Out of Scope
- OWGT Rebuild Document (index.html)
- SITE_CONTAINER / site-root / masterPage DOM Skeleton
- package.json
- Live Wix Site - Full-Page Screenshot @1280px
- Coin Icon (Pixel Ring + Star Face)
- compilerOptions
- OWGT Linktree Profile (linktr.ee/owgt)
- OWGT Brand Identity
- <main id='PAGE_SECTIONSalkfk'> (data-main-content-parent)
- Section comp-m0ap5cxi - Text Marquee Ticker
- Site Footer (wixui-footer)
- #SITE_CONTAINER Root Wrapper
- StylableHorizontalMenu Site Nav (Welcome / Join / Chapter)
- vercel.json
- Link Card Glass Style (GLASS / stack / ROUNDED_LG / SHADOW_SM)
- layout.tsx
- .eslintrc.json
- postcss.config.mjs
- next.config.ts
- tailwind.config.ts
- PHASE 5 â€” CSS
- PHASE 7 â€” SEO, social previews, and final verification
- PHASE 3 â€” Copy and content
- PHASE 4 â€” HTML semantics and accessibility
- SPEC.md
- PHASE 1 â€” Repository and deploy hygiene
- PHASE 2 â€” Images and assets
- PHASE 6 â€” JavaScript

## God Nodes (most connected - your core abstractions)
1. `OWGT Linktree Profile (linktr.ee/owgt)` - 31 edges
2. `Live Wix Site - Full-Page Screenshot @1280px` - 23 edges
3. `Local Rebuild - Full-Page Screenshot @1440px (v2)` - 22 edges
4. `Live Wix Site - Desktop Ground Truth @1440px` - 22 edges
5. `OWGT Rebuild Document (index.html)` - 21 edges
6. `Live Wix Site - Mobile Ground Truth @390px` - 20 edges
7. `PHASE 5 â€” CSS` - 19 edges
8. `Out of Scope` - 19 edges
9. `Local Rebuild - Full-Page Screenshot @1280px (v1)` - 17 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Technology Stack Decision` --semantically_similar_to--> `OWGT Rebuild Document (index.html)`  [AMBIGUOUS] [semantically similar]
  placeholder/docs/owgt-placeholder-spec.md → index.html
- `Target Viewports 1440px / 390px` --semantically_similar_to--> `Target Viewports (Desktop 1440px, Mobile 390px)`  [INFERRED] [semantically similar]
  AGENTS.md → docs/REBUILD_PROMPT.md
- `Top-Left OWGT Identity Lockup` --semantically_similar_to--> `Header / Navbar`  [INFERRED] [semantically similar]
  placeholder/docs/owgt-placeholder-spec.md → index.html
- `Layout Architecture (single viewport, centered)` --semantically_similar_to--> `OWGT Rebuild Document (index.html)`  [INFERRED] [semantically similar]
  placeholder/docs/owgt-placeholder-spec.md → index.html
- `Header / Navbar` --semantically_similar_to--> `Out of Scope: About / Mission / Features Sections`  [INFERRED] [semantically similar]
  index.html → placeholder/docs/owgt-placeholder-spec.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **OWGT In-Page Anchor Navigation System** — raw_source_code_hydrated_index_horizontal_menu, raw_source_code_hydrated_index_vertical_menu, raw_source_code_hydrated_index_anchor_join, raw_source_code_hydrated_index_anchor_chapter, raw_source_code_hydrated_index_anchor_rsvp, raw_source_code_hydrated_index_same_page_anchor_guard [EXTRACTED 1.00]
- **OWGT Home Page Section Order (header → hero → events → volunteer → board → chapter → prizes → footer)** — raw_source_code_wix_index_header_section, raw_source_code_wix_index_hero_section, raw_source_code_wix_index_events_section, raw_source_code_wix_index_volunteer_section, raw_source_code_wix_index_board_section, raw_source_code_wix_index_chapter_section, raw_source_code_wix_index_prizes_awards_section, raw_source_code_wix_index_footer_section [EXTRACTED 1.00]
- **Shared Visual Systems Reproduced in Every Capture** — announcement_ticker_band, sticky_header_nav, volunteer_cta_section, application_steps_block, board_sticky_scroll_section, board_member_card, chapter_howto_band, prizes_awards_pixelart, footer_email_signup_legal, typography_display_serif, color_palette_pastel_orange [EXTRACTED 1.00]
- **Six Critical Missing Zones (Live vs ctrl+u Copy)** — docs_rebuild_prompt_six_critical_zones, docs_visual_discrepancies_missing_events_box, docs_visual_discrepancies_empty_application_steps, docs_visual_discrepancies_missing_board_photos, docs_visual_discrepancies_missing_chapter_robot_image, docs_visual_discrepancies_missing_pixel_art, docs_visual_discrepancies_missing_footer_content, docs_visual_discrepancies_ssr_skeleton_cause [EXTRACTED 1.00]
- **Achievement Badge Pair (medal podium + ribbon disc)** — assets_icons_badge_gold_goldmedalbadgeicon, assets_icons_badge_ribbon_ribbonbadgeicon, assets_icons_badge_gold_gold_badge_palette, assets_icons_badge_ribbon_badge_medallion_disc [INFERRED 0.85]
- **Human Presence Through Real Photography** — assets_images_board_member_1_portrait, assets_images_board_member_2_portrait, assets_images_board_member_3_portrait, assets_images_chapter_robot_chapter_activity_photo, assets_images_volunteer_hackathon_event_photo, assets_images_board_member_1_photographic_portrait_convention, assets_images_chapter_robot_photographic_documentary_style [INFERRED 0.85]
- **Local Rebuild Pixel Parity Audit (v1 vs v2 vs Live)** — reference_images_local_playwright_local_rebuild_capture_1280, reference_images_local_playwright_new_local_rebuild_capture_1440, reference_images_reference_live_desktop_live_desktop_ground_truth, discrepancy_v1_to_v2_progress_delta, discrepancy_page_height_shortfall, discrepancy_ticker_gradient_lost, pixel_parity_goal [INFERRED 0.85]
- **OWGT Brand Mark System (mascot + wordmark + accent)** — assets_images_owgt_logo_owgt_wordmark, placeholder_public_owgt_logo_owgt_wordmark, assets_images_owgt_logo_robot_mascot_mark, assets_images_owgt_logo_brand_blue_accent_palette, assets_images_owgt_logo_owgt_brand_identity, assets_images_owgt_logo_logo_asset_duplication [INFERRED 0.85]
- **OWGT Cross-Property Outbound Link Graph (Wix site <-> Linktree)** — raw_source_code_linktree_owgt_profile, raw_source_code_linktree_link_website, raw_source_code_linktree_link_join_the_team, raw_source_code_linktree_link_discord, raw_source_code_linktree_social_instagram, raw_source_code_linktree_social_youtube, raw_source_code_hydrated_index_wix_thunderbolt_hydrated_dom, raw_source_code_hydrated_index_volunteer_google_form [INFERRED 0.85]
- **OWGT Site Visual Asset Suite** — assets_images_hero_bg_hero_background, assets_images_owgt_logo_owgt_wordmark, assets_images_chapter_robot_chapter_activity_photo, assets_images_volunteer_hackathon_event_photo, assets_images_board_member_1_portrait, assets_images_board_member_2_portrait, assets_images_board_member_3_portrait [INFERRED 0.85]
- **OWGT Volunteer Recruitment Funnel (pitch -> steps -> form -> email -> reward)** — raw_source_code_hydrated_index_volunteer_section, raw_source_code_hydrated_index_application_steps_section, raw_source_code_hydrated_index_volunteer_google_form, raw_source_code_hydrated_index_contact_email, raw_source_code_hydrated_index_prizes_awards_section, raw_source_code_hydrated_index_volunteer_hours_incentive [INFERRED 0.85]
- **OWGT Volunteer Recruitment Funnel (promise → form → chapter path → recognition payoff)** — raw_source_code_wix_index_volunteer_section, raw_source_code_wix_index_application_steps_repeater, raw_source_code_wix_index_google_form_link, raw_source_code_wix_index_chapter_section, raw_source_code_wix_index_prizes_awards_section, raw_source_code_wix_index_discord_guidelines_pdf_link [INFERRED 0.85]
- **Trophy Award Triad (hero / right / inline variants)** — assets_icons_hero_trophy_herotrophyicon, assets_icons_trophy_right_trophyrighticon, assets_icons_trophy_trophyicon, assets_icons_hero_trophy_trophy_award_motif [INFERRED 0.85]
- **Live Site Visual Ground Truth Across Both Target Viewports** — reference_images_live_playwright_live_site_capture_1280, reference_images_reference_live_desktop_live_desktop_ground_truth, reference_images_reference_live_mobile_live_mobile_ground_truth, pixel_parity_goal, desktop_layout_1440, mobile_layout_390 [INFERRED 0.95]
- **No-Dead-Link Placeholder Interaction Pattern** — docs_rebuild_prompt_placeholder_button_modal, docs_rebuild_prompt_placeholder_link_comment, index_placeholder_link_convention, index_toast_modal, index_showtoast, index_closetoast [INFERRED 0.95]
- **OWGT Rebuild Page Section Hierarchy** — index_announcement_bar, index_navbar, index_hero_section, index_events_section, index_volunteer_section, index_application_steps_section, index_board_section, index_chapter_section, index_prizes_section, index_footer [INFERRED 0.95]
- **Pixel Arcade Sprite Family (shared 10-unit raster grid)** — assets_icons_spaceinvader_spaceinvadersprite, assets_icons_console_consoleicon, assets_icons_coin_coinicon, assets_icons_icecream_icecreamicons, assets_icons_coin_pixel_grid_raster_construction, assets_icons_spaceinvader_retro_arcade_iconography [INFERRED 0.95]
- **Pixel-Grid Brand Art System (uniform square <path> rects, data-color 1/2/3 palette)** — raw_source_code_wix_index_qr_code_vector, raw_source_code_wix_index_prizes_vector_sprite, raw_source_code_wix_index_brand_pink, raw_source_code_wix_index_brand_yellow, raw_source_code_wix_index_brand_accent_orange [INFERRED 0.95]

## Communities (31 total, 7 thin omitted)

### Community 0 - "Out of Scope"
Cohesion: 0.06
Nodes (60): Static Site Hosting (Vercel), Color Palette Extraction into :root CSS Variables, Phase 3 Styling & Responsiveness, :root Design Token System, Google Fonts: Familjen Grotesk + Inter fallback, style.css Design System Stylesheet, Accessibility Requirements (WCAG AA), Animation & Motion (draw-in, boil 0.3, hover re-sketch) (+52 more)

### Community 1 - "OWGT Rebuild Document (index.html)"
Cohesion: 0.07
Nodes (63): Ground Truth Screenshot live_playwright.png, OWGT Project Philosophy & Stack, Target Viewports 1440px / 390px, Ground Truth Source raw-source-code/wix-index.html, Zero Framework Runtime, Destination Directories assets/images and assets/icons, Assets & Media Download from Wix CDN, Board Member Portraits (Artham, Panshul, Arham) (+55 more)

### Community 2 - "SITE_CONTAINER / site-root / masterPage DOM Skeleton"
Cohesion: 0.07
Nodes (53): Board Roster Text (3 members, names + titles + bios), 'How to start a chapter?' Instructions (fill form + download doc), Contact Email oneworldgreatertogether@gmail.com, Events Placeholder ('Events Coming Soon' / 'To Be Determined'), Footer Block (© 2026 by OWGT / email / 501(c)(3) status), Hero Tagline 'Empowering Through Technology', Hero Wordmark 'OneWorld GreaterTogether', OWGT Home Page Visible Text (Flattened) (+45 more)

### Community 3 - "package.json"
Cohesion: 0.05
Nodes (41): autoprefixer, drawably, eslint, eslint-config-next, next, author, dependencies, drawably (+33 more)

### Community 4 - "Live Wix Site - Full-Page Screenshot @1280px"
Cohesion: 0.18
Nodes (41): Ambiguity: Tall White Void Above Board Cards in Captures, Ambiguity: Copyright Year Reads 2025 (desktop) vs 2024 (mobile), Ambiguity: Envelope Icon Bleeds Across Section Boundary on Mobile, Announcement Ticker Band ('Empowering Through Technology'), Application Steps Block, Board Member Profile Card, Board Cards Staggered Two-Column Layout (live @1280px), Board Section (Sticky / Pinned Scroll Region) (+33 more)

### Community 5 - "Coin Icon (Pixel Ring + Star Face)"
Cohesion: 0.21
Nodes (29): Arrow Down Icon (Downward Scroll Cue), Uncolored Inherited-Fill Silhouette Style, Gold Badge Palette (#F1A41D / #F4B70F / #FFEC40), Gold Medal Badge Icon (Podium Stand), Podium Step Colorway (#13336E / #E75639 / #F1A41D), Accent Blue Token #4F80FF, Badge Medallion Disc + Rank Bars, Ribbon Medal Badge Icon (Blue Tails + Gold Disc) (+21 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (27): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+19 more)

### Community 7 - "OWGT Linktree Profile (linktr.ee/owgt)"
Cohesion: 0.15
Nodes (23): Speculation Rules (mpa-prefetch-eager, excludes /owgt), Wix Thunderbolt Fully Hydrated DOM (HOME | OWGT), Bio 'Empowering students through education in Technology and STEM.', JSON-LD BreadcrumbList (Linktree > OneWorldGreaterTogether), Chatbase AI Help Link 543100115 ('Questions? Ask our AI.'), Subscribe / Follow Button (disabled), Link Card 543098713 - Instagram (@oneworldgreatertogether), Link Card 543079124 - TikTok (@oneworldgreatertogether) (+15 more)

### Community 8 - "OWGT Brand Identity"
Cohesion: 0.17
Nodes (23): Board Member Story (leadership roster section), Real-Photography Portrait Convention, Board Member Portrait 1 (night street, formal suit), EXIF Orientation Not Applied (asset defect), Board Member Portrait 2 (glasses, hazy skyline, EXIF-rotated), Board Member Portrait 3 (campfire, hoodie, night forest), Chapter Activity Photo (children building a robot in a classroom), Documentary Photography Style (+15 more)

### Community 9 - "<main id='PAGE_SECTIONSalkfk'> (data-main-content-parent)"
Cohesion: 0.15
Nodes (19): Section comp-m0awavx1 - 'Application Steps', Arham Bafna - Vice President (Operations / New Events / Expansion), Artham Juvariwala - President / Founder, Panshul Kadam - Vice President (Marketing / Media), Section comp-m029jcz0 - 'Board', OWGT_Chapter_Official_Guidlines_and_Outline.pdf (Discord CDN), Chapter Start Form (forms.gle/krULzEFWJ2JaJBEb9), oneworldgreatertogether@gmail.com (+11 more)

### Community 10 - "Section comp-m0ap5cxi - Text Marquee Ticker"
Cohesion: 0.21
Nodes (13): Brand Palette (#1C1C1C ink, #FCED54 yellow, #FF49A6 pink, #F73D18 close red), DIN Next W01 Light (Wix-hosted woff2, 3 unicode subsets), Familjen Grotesk (italic 400/700, latin + latin-ext), Header Wordmark Rich Text (comp-lzqr65v4, font_6), DOM-Store Separator SVG c837a6_... (172x172, 3 brand colors), Marquee Pause-on-Hover (--marquee-clicked), Marquee Play/Pause Toggle (aria-label='Play Marquee', aria-pressed), Section comp-m0ap5cxi - Text Marquee Ticker (+5 more)

### Community 11 - "Site Footer (wixui-footer)"
Cohesion: 0.20
Nodes (10): Brand Mission Line 'Empowering Through Technology', Footer Statement 'a 501 (c) 3 organization', Footer Copyright 'c 2026 by OWGT', Hero Decorative Vector Images (comp-m09mbnqx, comp-m0us2vqs), Section comp-lzqoqdk9 - Hero h1 'OneWorld GreaterTogether', Motion Enter Clip Wipe (--motion-clip-start, data-motion-enter), Site Footer (wixui-footer), Caudex Profile Typography (--profileFontFamilyThemed) (+2 more)

### Community 12 - "#SITE_CONTAINER Root Wrapper"
Cohesion: 0.29
Nodes (8): Forced-Colors Focus Ring (#a11y-contrast block), SCROLL_TO_BOTTOM Landmark Region, SCROLL_TO_TOP Landmark Region, #SITE_CONTAINER Root Wrapper, SKIP_TO_CONTENT_BTN (Skip to Main Content), WIX_ADS Freemium Banner ('Built on Wix Studio'), Geo Consent Banner (geo-consent.js + dg-consent-custom-style), Verified Tick (avatarVerifiedTick / verificationTick)

### Community 13 - "StylableHorizontalMenu Site Nav (Welcome / Join / Chapter)"
Cohesion: 0.43
Nodes (7): Anchor anchors-mry539lr (Chapter), Anchor anchors-m0awavx65 (Join), StylableHorizontalMenu Site Nav (Welcome / Join / Chapter), Mobile Menu Dialog (role=dialog, aria-label='Site navigation'), Pinned Layer (comp-lzf9niav-pinned-layer), Same-Page Anchor Guard (window.__tbAnchorGuard), StylableVerticalMenu Items (aria-current=page on Welcome)

### Community 14 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, devCommand, framework, installCommand, outputDirectory

### Community 15 - "Link Card Glass Style (GLASS / stack / ROUNDED_LG / SHADOW_SM)"
Cohesion: 0.33
Nodes (6): Anchor anchors-ms6p477e (RSVP), Section comp-ms6p46mm (empty trailing section), RSVP Button (comp-m0c54tyd, data-semantic-classname='button'), StylableButton2545352419 Token Pattern, Link Card Glass Style (GLASS / stack / ROUNDED_LG / SHADOW_SM), Link Card 597869028 - OWGT Newsletter (Sibforms embed)

### Community 23 - "PHASE 5 â€” CSS"
Cohesion: 0.11
Nodes (19): 5.10 Respect reduced-motion preferences (J11), 5.11 Make the navbar work at 390 px (G1), 5.12 Delete the dead CSS (J12, J13), 5.13 Delete the unused class hooks (J14), 5.14 Add the new styles from Phase 3 and 4, 5.15 Delete the placeholder toast CSS, 5.16 Self-host the fonts and drop the unused family, 5.17 The one thing deliberately not being fixed (+11 more)

### Community 24 - "PHASE 7 â€” SEO, social previews, and final verification"
Cohesion: 0.18
Nodes (11): 10. Owner visual-verification checklist, 11. Finding-to-task traceability, 12. Open items for the site owner, 7.1 Replace the `<head>` block, 7.2 Create `robots.txt` (repo root), 7.3 Create `sitemap.xml` (repo root), 7.4 Final full-repo verification, 7.5 Commit and push (+3 more)

### Community 25 - "PHASE 3 â€” Copy and content"
Cohesion: 0.18
Nodes (11): 3.10 Verification for Phase 3, 3.1 Add the mission tagline (A10) â€” after `index.html` line 50, 3.2 Fix the chapter document link (A5, A6), 3.3 Rewrite the volunteer paragraph (B1), 3.4 Add the volunteer button (B5), 3.5 Rewrite all three board bios (B2, B3, B4), 3.6 Strip the Wix tracking parameter (B8), 3.7 Make the two email addresses clickable (E2) (+3 more)

### Community 26 - "PHASE 4 â€” HTML semantics and accessibility"
Cohesion: 0.18
Nodes (11): 4.10 Verification for Phase 4, 4.1 Wrap the page content in `<main>`, 4.2 Convert the two fake RSVP links into real buttons, 4.3 Add the mobile nav toggle (G1), 4.4 Label both email fields (G6), 4.5 Give the RSVP form a no-JavaScript fallback (H7), 4.6 Delete the placeholder toast modal (A5 follow-through), 4.7 Remove every inline event handler (+3 more)

### Community 27 - "SPEC.md"
Cohesion: 0.25
Nodes (7): 0. How to use this document, 1.1 You must, 1.2 You must not, 1.3 The visual-verification rule, 1.4 Environment facts (verified â€” do not re-investigate), 1. Ground rules, 2. Design tokens â€” the single source of truth for the rest of this document

### Community 28 - "PHASE 1 â€” Repository and deploy hygiene"
Cohesion: 0.25
Nodes (8): 1.1 Rewrite `.gitignore`, 1.2 Untrack the internal directories, 1.3 Delete the orphan images, 1.4 Create `.vercelignore` (new file, repo root), 1.5 Create `vercel.json` (new file, repo root), 1.6 Fix `AGENTS.md`, 1.7 Verification for Phase 1, PHASE 1 â€” Repository and deploy hygiene

### Community 29 - "PHASE 2 â€” Images and assets"
Cohesion: 0.29
Nodes (7): 2.1 Create `scripts/optimize_images.py`, 2.2 Delete the originals, 2.3 Point every reference at the `.webp` files, 2.4 Add `width`, `height`, `loading`, `decoding` to all 17 `<img>` elements, 2.5 Priority-hint the LCP image, 2.6 Verification for Phase 2, PHASE 2 â€” Images and assets

### Community 30 - "PHASE 6 â€” JavaScript"
Cohesion: 0.29
Nodes (7): 6.1 Create `assets/js/brevo-globals.js`, 6.2 Create `assets/js/modal.js`, 6.3 Create `assets/js/hero-canvas.js`, 6.4 Create `assets/js/nav.js`, 6.5 Delete the old inline scripts and rewire the page, 6.6 Verification for Phase 6, PHASE 6 â€” JavaScript

## Ambiguous Edges - Review These
- `style.css Design System Stylesheet` → `Vercel Deployment Path`  [AMBIGUOUS]
  placeholder/README.md · relation: conceptually_related_to
- `Technology Stack Decision` → `OWGT Rebuild Document (index.html)`  [AMBIGUOUS]
  placeholder/docs/owgt-placeholder-spec.md · relation: semantically_similar_to
- `Secondary CTA to Existing Newsletter` → `Site Footer (501(c)(3), copyright, email)`  [AMBIGUOUS]
  placeholder/README.md · relation: conceptually_related_to
- `Placeholder Tech Stack (Next.js 15, React 19, TypeScript, Tailwind, Drawably, Inter)` → `Zero Framework Runtime`  [AMBIGUOUS]
  AGENTS.md · relation: conceptually_related_to
- `In-Page Anchor Navigation Scheme` → `Sticky Board Scroll Track (Cascading Cards)`  [AMBIGUOUS]
  index.html · relation: conceptually_related_to
- `Prizes & Awards Section` → `Placeholder Link Convention in Markup`  [AMBIGUOUS]
  index.html · relation: conceptually_related_to
- `Marquee Ticker (Empowering Through Technology)` → `Phase 2 HTML Structure & Sections`  [AMBIGUOUS]
  index.html · relation: conceptually_related_to
- `Section comp-ms6p46mm (empty trailing section)` → `Anchor anchors-ms6p477e (RSVP)`  [AMBIGUOUS]
  raw-source-code/hydrated-index.html · relation: conceptually_related_to
- `Link Card 597869028 - OWGT Newsletter (Sibforms embed)` → `oneworldgreatertogether@gmail.com`  [AMBIGUOUS]
  raw-source-code/linktree.html · relation: conceptually_related_to
- `In-Page Anchor Link System (data-anchor + anchors-* ids)` → `Pixel-Grid QR Code Vector (comp-m09mbnqx / dom-store c837a6 symbol)`  [AMBIGUOUS]
  raw-source-code/wix-index.html · relation: conceptually_related_to
- `Site Footer Section (comp-lzf9niar)` → `Skip to Main Content Link`  [AMBIGUOUS]
  raw-source-code/wix-index.html · relation: conceptually_related_to
- `owgt-logo.png Hero Image (comp-mserjfwn)` → `Pixel-Grid QR Code Vector (comp-m09mbnqx / dom-store c837a6 symbol)`  [AMBIGUOUS]
  raw-source-code/wix-index.html · relation: conceptually_related_to
- `Events Coming Soon / RSVP Card` → `Live Wix Site - Mobile Ground Truth @390px`  [AMBIGUOUS]
  reference-images/reference_live_mobile.png · relation: references
- `Hero Section: OneWorld GreaterTogether Display Wordmark` → `Live Wix Site - Mobile Ground Truth @390px`  [AMBIGUOUS]
  reference-images/reference_live_mobile.png · relation: references
- `Contact CTA Iconography` → `Hero Trophy Icon (Hero-Scale Sprite)`  [AMBIGUOUS]
  assets/icons/hero_trophy.svg · relation: conceptually_related_to
- `OWGT Brand Identity` → `Hackathon Venue Co-Branding (third-party lanyards)`  [AMBIGUOUS]
  assets/images/volunteer_hackathon.jpg · relation: conceptually_related_to
- `Hackathon Venue Co-Branding (third-party lanyards)` → `Volunteer Hackathon Event Photo (three volunteers at a laptop)`  [AMBIGUOUS]
  assets/images/volunteer_hackathon.jpg · relation: implements

## Knowledge Gaps
- **153 isolated node(s):** `0. How to use this document`, `1.1 You must`, `1.2 You must not`, `1.3 The visual-verification rule`, `1.4 Environment facts (verified â€” do not re-investigate)` (+148 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 162 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `style.css Design System Stylesheet` and `Vercel Deployment Path`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Technology Stack Decision` and `OWGT Rebuild Document (index.html)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `Secondary CTA to Existing Newsletter` and `Site Footer (501(c)(3), copyright, email)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Placeholder Tech Stack (Next.js 15, React 19, TypeScript, Tailwind, Drawably, Inter)` and `Zero Framework Runtime`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `In-Page Anchor Navigation Scheme` and `Sticky Board Scroll Track (Cascading Cards)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Prizes & Awards Section` and `Placeholder Link Convention in Markup`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Marquee Ticker (Empowering Through Technology)` and `Phase 2 HTML Structure & Sections`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
# Graph Report - main-site  (2026-09-26)

## Corpus Check
- Large corpus: 45 files · ~1,215,733 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 451 nodes · 883 edges · 23 communities (18 shown, 5 thin omitted)
- Extraction: 65% EXTRACTED · 33% INFERRED · 2% AMBIGUOUS · INFERRED: 295 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

> ### ⚠️ Token cost above is a MEASUREMENT FAILURE, not a real zero
>
> **AI was absolutely used to build this graph. The `0 input · 0 output` figure is wrong and must not be read as "this was free."**
>
> - Real work performed: **6 LLM subagents** (general-purpose) ran semantic extraction over 34 documents and images, producing 357 nodes / 818 edges / 18 hyperedges. The AST pass (94 nodes) was deterministic and genuinely free, but it is only 21% of the graph.
> - Why the counter reads zero: token accounting was delegated to each subagent's own `usage` field, and the host agent's Task tool did not expose that field. The chunk files therefore retained their `input_tokens: 0` / `output_tokens: 0` placeholders, and `cost.json` summed those placeholders.
> - What this means for you: **treat the true cost of this run as unknown and non-zero.** Do not use this report to estimate what a re-run would cost. A `--mode deep` re-run over this corpus will spend real tokens on the 34 semantic files.
> - What *is* trustworthy: the 34-file extraction cache in `graphify-out/cache/` (content-hashed, repo-relative). A re-run that hits the cache pays **zero** LLM tokens for those files, so incremental rebuilds are genuinely cheap even though this report cannot prove it.

## Community Hubs (Navigation)
- Placeholder Page Build Spec
- Static Rebuild Page Structure
- Wix Source Ground Truth
- Placeholder NPM Dependencies
- Visual Parity & Discrepancies
- Pixel-Art Icon System
- TypeScript Compiler Config
- Linktree Profile & Socials
- Brand Photography & Assets
- Live Page Sections & Board
- Typography & Brand Tokens
- Header Footer & Mission Copy
- Wix Shell & A11y Landmarks
- Site Navigation & Anchors
- Vercel Deployment Config
- Buttons & Link Cards
- Next.js Root Layout
- ESLint Configuration
- PostCSS Configuration
- Next.js Build Config
- Tailwind Config

## God Nodes (most connected - your core abstractions)
1. `OWGT Linktree Profile (linktr.ee/owgt)` - 31 edges
2. `Live Wix Site - Full-Page Screenshot @1280px` - 23 edges
3. `Local Rebuild - Full-Page Screenshot @1440px (v2)` - 22 edges
4. `Live Wix Site - Desktop Ground Truth @1440px` - 22 edges
5. `OWGT Rebuild Document (index.html)` - 21 edges
6. `Live Wix Site - Mobile Ground Truth @390px` - 20 edges
7. `Out of Scope` - 19 edges
8. `Local Rebuild - Full-Page Screenshot @1280px (v1)` - 17 edges
9. `compilerOptions` - 16 edges
10. `MASTER PROMPT: 1-to-1 Clean Rebuild` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Technology Stack Decision` --semantically_similar_to--> `OWGT Rebuild Document (index.html)`  [AMBIGUOUS] [semantically similar]
  placeholder/docs/owgt-placeholder-spec.md → index.html
- `Target Viewports 1440px / 390px` --semantically_similar_to--> `Target Viewports (Desktop 1440px, Mobile 390px)`  [INFERRED] [semantically similar]
  AGENTS.md → docs/REBUILD_PROMPT.md
- `Layout Architecture (single viewport, centered)` --semantically_similar_to--> `OWGT Rebuild Document (index.html)`  [INFERRED] [semantically similar]
  placeholder/docs/owgt-placeholder-spec.md → index.html
- `Header / Navbar` --semantically_similar_to--> `Out of Scope: About / Mission / Features Sections`  [INFERRED] [semantically similar]
  index.html → placeholder/docs/owgt-placeholder-spec.md
- `Top-Left OWGT Identity Lockup` --semantically_similar_to--> `Header / Navbar`  [INFERRED] [semantically similar]
  placeholder/docs/owgt-placeholder-spec.md → index.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **OWGT Rebuild Page Section Hierarchy** — index_announcement_bar, index_navbar, index_hero_section, index_events_section, index_volunteer_section, index_application_steps_section, index_board_section, index_chapter_section, index_prizes_section, index_footer [INFERRED 0.95]
- **Six Critical Missing Zones (Live vs ctrl+u Copy)** — docs_rebuild_prompt_six_critical_zones, docs_visual_discrepancies_missing_events_box, docs_visual_discrepancies_empty_application_steps, docs_visual_discrepancies_missing_board_photos, docs_visual_discrepancies_missing_chapter_robot_image, docs_visual_discrepancies_missing_pixel_art, docs_visual_discrepancies_missing_footer_content, docs_visual_discrepancies_ssr_skeleton_cause [EXTRACTED 1.00]
- **No-Dead-Link Placeholder Interaction Pattern** — docs_rebuild_prompt_placeholder_button_modal, docs_rebuild_prompt_placeholder_link_comment, index_placeholder_link_convention, index_toast_modal, index_showtoast, index_closetoast [INFERRED 0.95]
- **OWGT Home Page Section Order (header → hero → events → volunteer → board → chapter → prizes → footer)** — raw_source_code_wix_index_header_section, raw_source_code_wix_index_hero_section, raw_source_code_wix_index_events_section, raw_source_code_wix_index_volunteer_section, raw_source_code_wix_index_board_section, raw_source_code_wix_index_chapter_section, raw_source_code_wix_index_prizes_awards_section, raw_source_code_wix_index_footer_section [EXTRACTED 1.00]
- **Pixel-Grid Brand Art System (uniform square <path> rects, data-color 1/2/3 palette)** — raw_source_code_wix_index_qr_code_vector, raw_source_code_wix_index_prizes_vector_sprite, raw_source_code_wix_index_brand_pink, raw_source_code_wix_index_brand_yellow, raw_source_code_wix_index_brand_accent_orange [INFERRED 0.95]
- **OWGT Volunteer Recruitment Funnel (promise → form → chapter path → recognition payoff)** — raw_source_code_wix_index_volunteer_section, raw_source_code_wix_index_application_steps_repeater, raw_source_code_wix_index_google_form_link, raw_source_code_wix_index_chapter_section, raw_source_code_wix_index_prizes_awards_section, raw_source_code_wix_index_discord_guidelines_pdf_link [INFERRED 0.85]
- **OWGT In-Page Anchor Navigation System** — raw_source_code_hydrated_index_horizontal_menu, raw_source_code_hydrated_index_vertical_menu, raw_source_code_hydrated_index_anchor_join, raw_source_code_hydrated_index_anchor_chapter, raw_source_code_hydrated_index_anchor_rsvp, raw_source_code_hydrated_index_same_page_anchor_guard [EXTRACTED 1.00]
- **OWGT Volunteer Recruitment Funnel (pitch -> steps -> form -> email -> reward)** — raw_source_code_hydrated_index_volunteer_section, raw_source_code_hydrated_index_application_steps_section, raw_source_code_hydrated_index_volunteer_google_form, raw_source_code_hydrated_index_contact_email, raw_source_code_hydrated_index_prizes_awards_section, raw_source_code_hydrated_index_volunteer_hours_incentive [INFERRED 0.85]
- **OWGT Cross-Property Outbound Link Graph (Wix site <-> Linktree)** — raw_source_code_linktree_owgt_profile, raw_source_code_linktree_link_website, raw_source_code_linktree_link_join_the_team, raw_source_code_linktree_link_discord, raw_source_code_linktree_social_instagram, raw_source_code_linktree_social_youtube, raw_source_code_hydrated_index_wix_thunderbolt_hydrated_dom, raw_source_code_hydrated_index_volunteer_google_form [INFERRED 0.85]
- **Trophy Award Triad (hero / right / inline variants)** — assets_icons_hero_trophy_herotrophyicon, assets_icons_trophy_right_trophyrighticon, assets_icons_trophy_trophyicon, assets_icons_hero_trophy_trophy_award_motif [INFERRED 0.85]
- **Pixel Arcade Sprite Family (shared 10-unit raster grid)** — assets_icons_spaceinvader_spaceinvadersprite, assets_icons_console_consoleicon, assets_icons_coin_coinicon, assets_icons_icecream_icecreamicons, assets_icons_coin_pixel_grid_raster_construction, assets_icons_spaceinvader_retro_arcade_iconography [INFERRED 0.95]
- **Achievement Badge Pair (medal podium + ribbon disc)** — assets_icons_badge_gold_goldmedalbadgeicon, assets_icons_badge_ribbon_ribbonbadgeicon, assets_icons_badge_gold_gold_badge_palette, assets_icons_badge_ribbon_badge_medallion_disc [INFERRED 0.85]
- **OWGT Site Visual Asset Suite** — assets_images_hero_bg_hero_background, assets_images_owgt_logo_owgt_wordmark, assets_images_chapter_robot_chapter_activity_photo, assets_images_volunteer_hackathon_event_photo, assets_images_board_member_1_portrait, assets_images_board_member_2_portrait, assets_images_board_member_3_portrait [INFERRED 0.85]
- **Human Presence Through Real Photography** — assets_images_board_member_1_portrait, assets_images_board_member_2_portrait, assets_images_board_member_3_portrait, assets_images_chapter_robot_chapter_activity_photo, assets_images_volunteer_hackathon_event_photo, assets_images_board_member_1_photographic_portrait_convention, assets_images_chapter_robot_photographic_documentary_style [INFERRED 0.85]
- **OWGT Brand Mark System (mascot + wordmark + accent)** — assets_images_owgt_logo_owgt_wordmark, placeholder_public_owgt_logo_owgt_wordmark, assets_images_owgt_logo_robot_mascot_mark, assets_images_owgt_logo_brand_blue_accent_palette, assets_images_owgt_logo_owgt_brand_identity, assets_images_owgt_logo_logo_asset_duplication [INFERRED 0.85]
- **Live Site Visual Ground Truth Across Both Target Viewports** — reference_images_live_playwright_live_site_capture_1280, reference_images_reference_live_desktop_live_desktop_ground_truth, reference_images_reference_live_mobile_live_mobile_ground_truth, pixel_parity_goal, desktop_layout_1440, mobile_layout_390 [INFERRED 0.95]
- **Shared Visual Systems Reproduced in Every Capture** — announcement_ticker_band, sticky_header_nav, volunteer_cta_section, application_steps_block, board_sticky_scroll_section, board_member_card, chapter_howto_band, prizes_awards_pixelart, footer_email_signup_legal, typography_display_serif, color_palette_pastel_orange [EXTRACTED 1.00]
- **Local Rebuild Pixel Parity Audit (v1 vs v2 vs Live)** — reference_images_local_playwright_local_rebuild_capture_1280, reference_images_local_playwright_new_local_rebuild_capture_1440, reference_images_reference_live_desktop_live_desktop_ground_truth, discrepancy_v1_to_v2_progress_delta, discrepancy_page_height_shortfall, discrepancy_ticker_gradient_lost, pixel_parity_goal [INFERRED 0.85]

## Communities (23 total, 5 thin omitted)

### Community 0 - "Placeholder Page Build Spec"
Cohesion: 0.06
Nodes (66): Target Viewports 1440px / 390px, Color Palette Extraction into :root CSS Variables, Responsive Media Queries at max-width 768px, Phase 1 Asset & Style Extraction (No Guessing), Phase 3 Styling & Responsiveness, Phase 4 Visual Verification Loop, :root Design Token System, Typography Extraction (font families, size, weight, line-height, letter-spacing) (+58 more)

### Community 1 - "Static Rebuild Page Structure"
Cohesion: 0.08
Nodes (57): Ground Truth Screenshot live_playwright.png, OWGT Project Philosophy & Stack, Static Site Hosting (Vercel), Ground Truth Source raw-source-code/wix-index.html, Zero Framework Runtime, Destination Directories assets/images and assets/icons, Assets & Media Download from Wix CDN, Board Member Portraits (Artham, Panshul, Arham) (+49 more)

### Community 2 - "Wix Source Ground Truth"
Cohesion: 0.07
Nodes (54): Board Roster Text (3 members, names + titles + bios), 'How to start a chapter?' Instructions (fill form + download doc), Contact Email oneworldgreatertogether@gmail.com, Events Placeholder ('Events Coming Soon' / 'To Be Determined'), Footer Block (© 2026 by OWGT / email / 501(c)(3) status), Hero Tagline 'Empowering Through Technology', Hero Wordmark 'OneWorld GreaterTogether', OWGT Home Page Visible Text (Flattened) (+46 more)

### Community 3 - "Placeholder NPM Dependencies"
Cohesion: 0.05
Nodes (41): autoprefixer, drawably, eslint, eslint-config-next, next, author, dependencies, drawably (+33 more)

### Community 4 - "Visual Parity & Discrepancies"
Cohesion: 0.18
Nodes (41): Ambiguity: Tall White Void Above Board Cards in Captures, Ambiguity: Copyright Year Reads 2025 (desktop) vs 2024 (mobile), Ambiguity: Envelope Icon Bleeds Across Section Boundary on Mobile, Announcement Ticker Band ('Empowering Through Technology'), Application Steps Block, Board Member Profile Card, Board Cards Staggered Two-Column Layout (live @1280px), Board Section (Sticky / Pinned Scroll Region) (+33 more)

### Community 5 - "Pixel-Art Icon System"
Cohesion: 0.21
Nodes (29): Arrow Down Icon (Downward Scroll Cue), Uncolored Inherited-Fill Silhouette Style, Gold Badge Palette (#F1A41D / #F4B70F / #FFEC40), Gold Medal Badge Icon (Podium Stand), Podium Step Colorway (#13336E / #E75639 / #F1A41D), Accent Blue Token #4F80FF, Badge Medallion Disc + Rank Bars, Ribbon Medal Badge Icon (Blue Tails + Gold Disc) (+21 more)

### Community 6 - "TypeScript Compiler Config"
Cohesion: 0.07
Nodes (27): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+19 more)

### Community 7 - "Linktree Profile & Socials"
Cohesion: 0.13
Nodes (27): OWGT_Chapter_Official_Guidlines_and_Outline.pdf (Discord CDN), Speculation Rules (mpa-prefetch-eager, excludes /owgt), Wix Thunderbolt Fully Hydrated DOM (HOME | OWGT), Bio 'Empowering students through education in Technology and STEM.', JSON-LD BreadcrumbList (Linktree > OneWorldGreaterTogether), Chatbase AI Help Link 543100115 ('Questions? Ask our AI.'), Subscribe / Follow Button (disabled), Link Card 543097423 - Discord (+19 more)

### Community 8 - "Brand Photography & Assets"
Cohesion: 0.17
Nodes (23): Board Member Story (leadership roster section), Real-Photography Portrait Convention, Board Member Portrait 1 (night street, formal suit), EXIF Orientation Not Applied (asset defect), Board Member Portrait 2 (glasses, hazy skyline, EXIF-rotated), Board Member Portrait 3 (campfire, hoodie, night forest), Chapter Activity Photo (children building a robot in a classroom), Documentary Photography Style (+15 more)

### Community 9 - "Live Page Sections & Board"
Cohesion: 0.20
Nodes (15): Section comp-m0awavx1 - 'Application Steps', Arham Bafna - Vice President (Operations / New Events / Expansion), Artham Juvariwala - President / Founder, Panshul Kadam - Vice President (Marketing / Media), Section comp-m029jcz0 - 'Board', Chapter Start Form (forms.gle/krULzEFWJ2JaJBEb9), oneworldgreatertogether@gmail.com, Section comp-lzf9ni60 - Events 'Events Coming Soon / To Be Determined' (+7 more)

### Community 10 - "Typography & Brand Tokens"
Cohesion: 0.21
Nodes (13): Brand Palette (#1C1C1C ink, #FCED54 yellow, #FF49A6 pink, #F73D18 close red), DIN Next W01 Light (Wix-hosted woff2, 3 unicode subsets), Familjen Grotesk (italic 400/700, latin + latin-ext), Header Wordmark Rich Text (comp-lzqr65v4, font_6), DOM-Store Separator SVG c837a6_... (172x172, 3 brand colors), Marquee Pause-on-Hover (--marquee-clicked), Marquee Play/Pause Toggle (aria-label='Play Marquee', aria-pressed), Section comp-m0ap5cxi - Text Marquee Ticker (+5 more)

### Community 11 - "Header Footer & Mission Copy"
Cohesion: 0.20
Nodes (10): Brand Mission Line 'Empowering Through Technology', Footer Statement 'a 501 (c) 3 organization', Footer Copyright 'c 2026 by OWGT', Hero Decorative Vector Images (comp-m09mbnqx, comp-m0us2vqs), Section comp-lzqoqdk9 - Hero h1 'OneWorld GreaterTogether', Motion Enter Clip Wipe (--motion-clip-start, data-motion-enter), Site Footer (wixui-footer), Caudex Profile Typography (--profileFontFamilyThemed) (+2 more)

### Community 12 - "Wix Shell & A11y Landmarks"
Cohesion: 0.29
Nodes (8): Forced-Colors Focus Ring (#a11y-contrast block), SCROLL_TO_BOTTOM Landmark Region, SCROLL_TO_TOP Landmark Region, #SITE_CONTAINER Root Wrapper, SKIP_TO_CONTENT_BTN (Skip to Main Content), WIX_ADS Freemium Banner ('Built on Wix Studio'), Geo Consent Banner (geo-consent.js + dg-consent-custom-style), Verified Tick (avatarVerifiedTick / verificationTick)

### Community 13 - "Site Navigation & Anchors"
Cohesion: 0.43
Nodes (7): Anchor anchors-mry539lr (Chapter), Anchor anchors-m0awavx65 (Join), StylableHorizontalMenu Site Nav (Welcome / Join / Chapter), Mobile Menu Dialog (role=dialog, aria-label='Site navigation'), Pinned Layer (comp-lzf9niav-pinned-layer), Same-Page Anchor Guard (window.__tbAnchorGuard), StylableVerticalMenu Items (aria-current=page on Welcome)

### Community 14 - "Vercel Deployment Config"
Cohesion: 0.33
Nodes (5): buildCommand, devCommand, framework, installCommand, outputDirectory

### Community 15 - "Buttons & Link Cards"
Cohesion: 0.33
Nodes (6): Anchor anchors-ms6p477e (RSVP), Section comp-ms6p46mm (empty trailing section), RSVP Button (comp-m0c54tyd, data-semantic-classname='button'), StylableButton2545352419 Token Pattern, Link Card Glass Style (GLASS / stack / ROUNDED_LG / SHADOW_SM), Link Card 597869028 - OWGT Newsletter (Sibforms embed)

## Ambiguous Edges - Review These
- `Zero Framework Runtime` → `Placeholder Tech Stack (Next.js 15, React 19, TypeScript, Tailwind, Drawably, Inter)`  [AMBIGUOUS]
  AGENTS.md · relation: conceptually_related_to
- `Phase 2 HTML Structure & Sections` → `Marquee Ticker (Empowering Through Technology)`  [AMBIGUOUS]
  index.html · relation: conceptually_related_to
- `OWGT Rebuild Document (index.html)` → `Technology Stack Decision`  [AMBIGUOUS]
  placeholder/docs/owgt-placeholder-spec.md · relation: semantically_similar_to
- `In-Page Anchor Navigation Scheme` → `Sticky Board Scroll Track (Cascading Cards)`  [AMBIGUOUS]
  index.html · relation: conceptually_related_to
- `Placeholder Link Convention in Markup` → `Prizes & Awards Section`  [AMBIGUOUS]
  index.html · relation: conceptually_related_to
- `Site Footer (501(c)(3), copyright, email)` → `Secondary CTA to Existing Newsletter`  [AMBIGUOUS]
  placeholder/README.md · relation: conceptually_related_to
- `style.css Design System Stylesheet` → `Vercel Deployment Path`  [AMBIGUOUS]
  placeholder/README.md · relation: conceptually_related_to
- `Skip to Main Content Link` → `Site Footer Section (comp-lzf9niar)`  [AMBIGUOUS]
  raw-source-code/wix-index.html · relation: conceptually_related_to
- `Pixel-Grid QR Code Vector (comp-m09mbnqx / dom-store c837a6 symbol)` → `owgt-logo.png Hero Image (comp-mserjfwn)`  [AMBIGUOUS]
  raw-source-code/wix-index.html · relation: conceptually_related_to
- `Pixel-Grid QR Code Vector (comp-m09mbnqx / dom-store c837a6 symbol)` → `In-Page Anchor Link System (data-anchor + anchors-* ids)`  [AMBIGUOUS]
  raw-source-code/wix-index.html · relation: conceptually_related_to
- `Anchor anchors-ms6p477e (RSVP)` → `Section comp-ms6p46mm (empty trailing section)`  [AMBIGUOUS]
  raw-source-code/hydrated-index.html · relation: conceptually_related_to
- `oneworldgreatertogether@gmail.com` → `Link Card 597869028 - OWGT Newsletter (Sibforms embed)`  [AMBIGUOUS]
  raw-source-code/linktree.html · relation: conceptually_related_to
- `Contact CTA Iconography` → `Hero Trophy Icon (Hero-Scale Sprite)`  [AMBIGUOUS]
  assets/icons/hero_trophy.svg · relation: conceptually_related_to
- `Volunteer Hackathon Event Photo (three volunteers at a laptop)` → `Hackathon Venue Co-Branding (third-party lanyards)`  [AMBIGUOUS]
  assets/images/volunteer_hackathon.jpg · relation: implements
- `OWGT Brand Identity` → `Hackathon Venue Co-Branding (third-party lanyards)`  [AMBIGUOUS]
  assets/images/volunteer_hackathon.jpg · relation: conceptually_related_to
- `Live Wix Site - Mobile Ground Truth @390px` → `Events Coming Soon / RSVP Card`  [AMBIGUOUS]
  reference-images/reference_live_mobile.png · relation: references
- `Live Wix Site - Mobile Ground Truth @390px` → `Hero Section: OneWorld GreaterTogether Display Wordmark`  [AMBIGUOUS]
  reference-images/reference_live_mobile.png · relation: references

## Knowledge Gaps
- **80 isolated node(s):** `extends`, `next/core-web-vitals`, `inter`, `metadata`, `nextConfig` (+75 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Zero Framework Runtime` and `Placeholder Tech Stack (Next.js 15, React 19, TypeScript, Tailwind, Drawably, Inter)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Phase 2 HTML Structure & Sections` and `Marquee Ticker (Empowering Through Technology)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `OWGT Rebuild Document (index.html)` and `Technology Stack Decision`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `In-Page Anchor Navigation Scheme` and `Sticky Board Scroll Track (Cascading Cards)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Placeholder Link Convention in Markup` and `Prizes & Awards Section`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Site Footer (501(c)(3), copyright, email)` and `Secondary CTA to Existing Newsletter`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `style.css Design System Stylesheet` and `Vercel Deployment Path`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
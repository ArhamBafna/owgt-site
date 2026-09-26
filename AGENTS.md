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

## 2. Visual & Ground Truth References

### Ground Truth Reference
- **`reference-images/live_playwright.png`**: This image shows exactly how the website is intended to look visually when fully hydrated and rendered on desktop. Any visual adjustments should be compared against this screenshot.
- **`raw-source-code/wix-index.html`**: The exact HTML/CSS extracted from the live Wix website. If in doubt regarding wording, exact color hexes, SVG geometry, or layout parameters, consult this file.

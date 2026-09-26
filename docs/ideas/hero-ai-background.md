# Hero Background "AI" Cloud Integration

## Problem Statement
Show subtle AI identity inside hero background without adding extra text or cluttering page headline.

## Recommended Direction
Generate new pastel landscape image matching current warm aesthetic (soft gold, peach, cream, lavender sky). 
Center-upper area contains natural cloud vapors forming soft, organic "A" and "I". 
Positioned vertically between top navigation bar and "OneWorld" title.

## Key Assumptions to Validate
- [ ] Cloud letters stay recognizable as "AI" when viewed at normal desktop zoom (1440px).
- [ ] Background center stays centered on mobile (390px) without letters getting cut off or hidden behind text.
- [ ] White text and dark "#111111" hero title keep high contrast against clouds.

## MVP Scope
- IN: 1 fresh landscape image with centered cloud "AI" vapor.
- IN: Test image in desktop (1440px) and mobile (390px) views against current layout.
- OUT: No code or CSS changes needed if image dimensions match current 1920x1080 ratio.

## Not Doing (and Why)
- Not using hard font watermark — looks like stock photo copyright stamp.
- Not using neon/cyber glow — breaks warm, human non-profit visual identity.
- Not adding floating HTML/DOM text elements — keeps hero DOM simple and fast.

## Open Questions
- Exact letter style preference: lowercase ("ai"), capital ("AI"), or abstract organic shapes that hint at letters?
- Color tint preference: warm golden sunlight clouds or cooler lilac/sky-blue mist?

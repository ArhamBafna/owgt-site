# OWGT Placeholder / Coming Soon Page

## Problem Statement

OWGT (OneWorldGreaterTogether) is an organization empowering students through technology, STEM, and education. They currently have an active newsletter and a separate rewards experience, but no main website. They need a temporary placeholder page that:

- Makes visitors feel like they've discovered something interesting before launch
- Captures early interest through email signups
- Maintains a memorable, polished, human aesthetic
- Directs visitors to the existing newsletter as a secondary option
- Creates psychological engagement through intentional interaction design

The page must not look like a traditional nonprofit landing page or generic "under construction" template. It should feel deliberately designed and make visitors want to be "one of the first people there."

## Solution

A single-viewport, playful hand-drawn placeholder page using the Drawably UI library that:

- Uses OWGT's red and blue brand colors with hand-drawn, sketchy aesthetics
- Presents minimal, focused copy that takes 20-30 seconds to understand
- Includes an optional checkbox for psychological commitment ("I want VERY early special access")
- Captures email addresses with validation
- Transitions to a success state with social sharing capability
- Links to the existing newsletter as a secondary CTA
- Requires no scrolling on desktop and minimal scrolling on mobile

## User Stories

1. As a visitor discovering OWGT early, I want to immediately understand what OWGT is about, so that I know if I'm interested
2. As a visitor, I want to feel like I'm discovering something new and interesting, so that I feel excited about being early
3. As a visitor, I want to sign up for early access, so that I can be notified when the main site launches
4. As a visitor, I want to optionally indicate special interest through a checkbox, so that I can express stronger commitment
5. As a visitor, I want my email validated before submission, so that I don't accidentally submit an invalid address
6. As a visitor who can't wait, I want to access the newsletter immediately, so that I can engage with OWGT content now
7. As a visitor who just signed up, I want confirmation that my signup worked, so that I know I'm on the list
8. As a visitor who just signed up, I want to share OWGT with others, so that I can invite friends to join early
9. As a mobile visitor, I want the page to be fully responsive, so that I can easily read and interact on my phone
10. As a visitor using assistive technology, I want proper keyboard navigation and focus states, so that I can complete signup
11. As a visitor with reduced motion preferences, I want animations to respect my settings, so that I'm not distracted
12. As a visitor, I want the page to load quickly, so that I don't lose interest while waiting
13. As a visitor, I want clear visual hierarchy, so that I know what to read first and what actions to take
14. As a visitor, I want the brand identity to be clear but not overwhelming, so that I understand who OWGT is without distraction
15. As a visitor, I want interactive elements to have clear hover and press states, so that I know what's clickable
16. As a visitor on mobile, I want touch targets to be large enough, so that I can easily tap buttons and checkboxes
17. As a visitor who submitted the form, I want to share via native sharing if available, so that I can use my preferred sharing method
18. As a visitor who submitted the form on desktop, I want a clipboard fallback for sharing, so that I can still share the link
19. As a visitor with visual impairments, I want sufficient color contrast, so that I can read all text clearly
20. As a visitor, I want the page to feel cohesive and intentional, so that I trust OWGT as a credible organization

## Implementation Decisions

### Technology Stack
- **Framework:** Next.js 15+ with React 19+ and TypeScript for type safety and modern development experience
- **UI Library:** Drawably npm package (`drawably/react`) for hand-drawn, playful UI components
- **Styling:** Tailwind CSS for utility-first styling + Drawably's CSS variables for theming
- **Font:** Inter (Drawably's default recommendation) loaded via next/font
- **Deployment:** Vercel (consistent with existing newsletter infrastructure)
- **Form Handling:** Client-side only with dummy submission (real backend to be added later)

### Color System
- **Blue (`#2563EB`):** OWGT brand identity, logo, supporting text accents
- **Red (`#EF4444`):** Interactive elements (primary button, checked checkbox, share button when appropriate)
- **Black:** Body text and neutral content
- **White:** Background (`--drawably-paper`)
- No additional color palette or gradient overlays

### Layout Architecture
- **Single-viewport design:** All content fits within one screen on desktop
- **Centered composition:** Main content occupies central area with generous whitespace
- **Top-left identity lockup:** "OWGT" (larger) stacked over "OneWorldGreaterTogether" (smaller), both in blue
- **No traditional navigation:** No navbar, footer, or multi-section layout

### Component Structure
- **OWGT Identity:** Fixed or static position in top-left corner
- **Hero Headline:** "Oh... you found us early." — primary visual focus
- **Supporting Copy:** "We're building something new to empower students through technology, STEM, and education."
- **Transition Text:** "Be part of it." with Drawably underline decoration
- **Signup Form:**
  - DrawablyCheckbox: "I want VERY early special access" (optional, does not gate submission)
  - DrawablyInput: Email address field with validation
  - DrawablyButton: "Count me in →" (red, solid variant)
- **Secondary CTA:** "Can't wait? Check out the newsletter →" (text link with rough underline on hover, links to https://owgt-newsletter-rewards.vercel.app/)
- **Success State:** Replaces main content after submission:
  - "You're in."
  - "Good timing."
  - DrawablyButton: "Share OWGT →" (outline, neutral tone)

### Form Behavior
- **Email validation:** Required, must match basic email format (`@` and `.` present), block submission on invalid
- **Checkbox:** Optional psychological commitment element, does not affect submission
- **Submit action:** Dummy function that transitions to success state, no data persistence (localStorage or backend to be added later)
- **Success state:** Smooth transition animation, replaces form content

### Share Functionality
- **Primary:** Web Share API where supported (mobile browsers)
- **Fallback:** Copy link to clipboard with visual feedback (toast/confirmation)
- **Shared URL:** Current page URL (placeholder domain)
- **No social share modal:** Keep it simple with native sharing or clipboard

### Responsive Strategy
- **Desktop:** Generous whitespace, content centered, all elements visible without scroll
- **Tablet:** Maintain hierarchy with adjusted spacing
- **Mobile:** Light scroll acceptable on small devices (iPhone SE), reduce headline size moderately, maintain readable body text (16px minimum), ensure 48px minimum touch targets

### Animation & Motion
- **Entrance:** Fast draw-in animation (<1s total) where Drawably components animate their strokes
- **Boil:** Default Drawably boil value (0.3) for subtle hand-drawn flicker
- **Interactions:** Hover re-sketches on buttons, underlines, and checkboxes per Drawably defaults
- **State transitions:** Smooth fade between form and success state
- **Accessibility:** Respect `prefers-reduced-motion` (Drawably handles this automatically)

### Accessibility Requirements
- **Keyboard navigation:** All interactive elements focusable and operable via keyboard
- **Focus indicators:** Visible focus states on all inputs and buttons
- **Color contrast:** WCAG AA compliance (4.5:1 for body text, 3:1 for large text)
- **Semantic HTML:** Proper form labels, button types, and ARIA attributes where necessary
- **Screen readers:** Descriptive labels and error messages

### Typography Hierarchy
- **Headline ("Oh... you found us early."):** Large size (~48px desktop, ~32px mobile), primary attention
- **Supporting text:** Medium size (~18-20px), noticeably quieter than headline
- **"Be part of it":** Medium-large (~24px), with Drawably underline for emphasis
- **Form labels/inputs:** Standard readable size (~16-18px)
- **Newsletter link:** Small but clear (~14-16px)
- **Success confirmation:** Large headline style for "You're in", smaller for "Good timing"

### Drawably Configuration
- **Import:** `import "drawably/style.css"` in global styles
- **CSS Variables:**
  - `--drawably-stroke`: Used for outlines and interactive states
  - `--drawably-fill`: Used for button fills
  - `--drawably-paper`: White background
  - `--drawably-width`: Default stroke width
- **Components Used:**
  - `DrawablyButton` (solid variant for primary CTA, outline for share)
  - `DrawablyCheckbox` (optional commitment checkbox)
  - `DrawablyInput` (email field)
  - `DrawablyUnderline` (for "Be part of it" and newsletter link hover)

## Testing Decisions

Since this is a temporary placeholder with dummy backend, testing will focus on:

### What Makes a Good Test
- Test external behavior and user-facing functionality, not implementation details
- Test accessibility features (keyboard navigation, focus management)
- Test responsive behavior at key breakpoints
- Test form validation logic
- Avoid testing Drawably library internals

### Manual Testing Checklist
- **Desktop layout:** Content centered, no horizontal scroll, fits in viewport
- **Mobile layout (iPhone SE, iPhone Pro Max):** Readable text, proper touch targets, minimal scroll acceptable
- **Tablet layout (iPad):** Proper spacing and hierarchy maintained
- **Email validation:** Invalid formats rejected, valid formats accepted
- **Checkbox interaction:** Can check/uncheck, doesn't block submission
- **Form submission:** Smooth transition to success state
- **Newsletter link:** Opens correct URL in new tab
- **Share button (mobile):** Web Share API triggers
- **Share button (desktop):** Clipboard copy with feedback
- **Keyboard navigation:** Tab through all interactive elements, Enter/Space activate
- **Focus states:** Visible focus indicators on all elements
- **Color contrast:** Text readable against background (use browser DevTools or contrast checker)
- **Reduced motion:** Animations disabled when `prefers-reduced-motion: reduce` is set
- **No console errors:** Clean browser console on load and interaction
- **No layout overflow:** No unexpected scrollbars or cut-off content

### Automated Testing (Future)
When backend is implemented:
- E2E tests for signup flow (Playwright/Cypress)
- Email validation unit tests
- API integration tests for email submission

## Out of Scope

The following are explicitly NOT included in this spec:

- **Real backend/database:** Form submission is dummy, no data persistence
- **Email service integration:** No actual email capture or mailing list signup
- **Analytics tracking:** No Google Analytics, Plausible, or event tracking
- **Newsletter signup form:** Newsletter exists separately, we only link to it
- **About/Mission/Features sections:** This is intentionally minimal
- **Team section, testimonials, blog, FAQ:** Not a traditional landing page
- **Social media integration:** No social feed, no extensive share options
- **Countdown timer or launch date:** No specific date mentioned
- **Rewards experience integration:** That exists separately
- **Custom domain setup:** Will be configured outside of this implementation
- **SEO optimization:** Basic meta tags only, no comprehensive SEO strategy
- **A/B testing or conversion optimization:** Single version only
- **User authentication or accounts:** No login, no user tracking beyond email
- **GDPR/privacy policy compliance:** To be added when real backend is implemented
- **Multi-language support:** English only
- **Dark mode:** White background only
- **Advanced animations or micro-interactions:** Keep it simple and fast
- **Video background or parallax effects:** Static, simple design only

## Further Notes

### Design Philosophy
This placeholder intentionally embraces Drawably's playful, hand-drawn aesthetic to make OWGT feel approachable and human rather than corporate. The "Oh... you found us early" framing creates a sense of discovery and exclusivity.

### Timeline Constraints
The main OWGT website is expected to launch in approximately 1 month or less. This placeholder is truly temporary and should be built with that in mind—no over-engineering.

### Future Backend Integration
When implementing the real backend later, the form should:
- Store emails with timestamp
- Track checkbox state ("very early special access" flag)
- Send confirmation email
- Optionally integrate with existing newsletter/rewards system

### Deployment
The Next.js app should be configured for seamless Vercel deployment:
- `vercel.json` if needed for custom configuration
- Environment variables prepared (even if unused initially)
- Build optimizations enabled

### Brand Consistency
While this is a temporary placeholder, the red + blue color system and playful aesthetic should inform future OWGT brand development. The hand-drawn style positions OWGT as friendly, accessible, and human-centered.

### Success Metrics (When Backend Implemented)
- Email signup conversion rate
- "Very early special access" checkbox selection rate
- Share button usage
- Newsletter link click-through rate
- Mobile vs desktop signup rates

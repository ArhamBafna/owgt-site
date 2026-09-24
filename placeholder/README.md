# OWGT Placeholder / Coming Soon Page

A temporary placeholder page for OneWorldGreaterTogether (OWGT) - an organization empowering students through technology, STEM, and education.

## Features

- **Hand-drawn aesthetic** using the Drawably UI library
- **Email signup** with validation (dummy submission - backend to be added)
- **Optional early access checkbox** for psychological commitment
- **Success state** with social sharing (Web Share API + clipboard fallback)
- **Secondary CTA** linking to existing newsletter
- **Fully responsive** (mobile to desktop)
- **Accessible** (keyboard navigation, ARIA labels, screen reader support)
- **Fast loading** with optimized Next.js 15 and React 19

## Tech Stack

- **Next.js 15+** with App Router
- **React 19+**
- **TypeScript**
- **Tailwind CSS**
- **Drawably UI Library** for hand-drawn components
- **Inter font** via next/font

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

## Deployment

This project is configured for seamless deployment on Vercel:

1. Push to GitHub repository
2. Import project in Vercel dashboard
3. Deploy automatically

Alternatively, use the Vercel CLI:

```bash
vercel
```

## Brand Colors

- **Blue (#2563EB)**: OWGT brand identity, logo, supporting text
- **Red (#EF4444)**: Interactive elements (buttons, checkboxes)
- **Black**: Body text
- **White**: Background

## Project Structure

```
.
├── app/
│   ├── layout.tsx       # Root layout with Inter font
│   ├── page.tsx         # Main placeholder page
│   └── globals.css      # Global styles + Drawably config
├── public/              # Static assets (if needed)
├── .kiro/              # Kiro IDE configuration
├── next.config.ts      # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vercel.json         # Vercel deployment configuration
```

## Future Enhancements

When implementing the real backend:
- Store emails with timestamp
- Track "very early special access" checkbox state
- Send confirmation emails
- Integrate with existing newsletter/rewards system
- Add analytics tracking

## Manual Testing Checklist

- [ ] Desktop layout (content centered, no scroll)
- [ ] Mobile layout (iPhone SE, iPhone Pro Max)
- [ ] Tablet layout (iPad)
- [ ] Email validation (invalid formats rejected)
- [ ] Checkbox interaction (check/uncheck)
- [ ] Form submission (smooth transition)
- [ ] Newsletter link (opens in new tab)
- [ ] Share button (mobile: Web Share API, desktop: clipboard)
- [ ] Keyboard navigation (tab through all elements)
- [ ] Focus states (visible on all interactive elements)
- [ ] Color contrast (WCAG AA compliance)
- [ ] Reduced motion (animations disabled when preferred)
- [ ] No console errors

## License

Private - OWGT Organization

## Contact

For questions about OWGT, visit the newsletter at: https://owgt-newsletter-rewards.vercel.app/

# CLAUDE.md — GenZVoter

## Project Overview

**GenZ Voter App** — A mobile-first Progressive Web App (PWA) designed to get Kenyan Gen Z youth registered to vote for the 2027 elections. The app prioritizes ADHD-friendly UX, gamification, and a playful Gen Z Kenya tone (Swahili/Sheng sprinkled in).

Full spec: `GenZVoter_spec.md`

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (preferred) or Nuxt.js |
| Styling | Tailwind CSS |
| Platform | Full PWA (installable on phones) |
| CMS | Simple headless CMS (registration centres, myth cards, copy) |
| Analytics | Anonymous card-interaction tracking |

---

## Critical Architecture Rules

### Mobile and Desktop are INDEPENDENT implementations

- **Do not share page/screen components between mobile and desktop.**
- They live in separate directories with separate routing and layout logic.
- Mobile and desktop have fundamentally different UX philosophies:

| | Mobile | Desktop |
|--|--------|---------|
| Target user | ADHD-heavy, low attention | Can read long text and articles |
| Content style | 1–2 lines per screen, swipeable stories | Long-form, detailed |
| Navigation | Bottom nav, 3 icons only | Standard nav |
| Interaction | Tap-first, swipe-first | Click, scroll |

### Planned Directory Structure

```
/src
  /mobile        # Mobile-only pages and components
  /desktop       # Desktop-only pages and components
  /shared        # Shared logic: API calls, types, utilities, hooks
  /cms           # CMS schema and content configs
/public
```

---

## Dev Commands

> Update these once the project is initialized.

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Lint
npm test         # Run tests
```

---

## Coding Guidelines

### Mobile Components
- Every mobile screen/card should show **1–2 lines of text maximum** — no walls of text.
- Navigation must be reachable in **2 taps or fewer**.
- Bottom nav has **3 icons only**: Home (countdown), Register, Info.
- No map components — registration centres are displayed as **text lists with descriptions only**.

### Gamification & Micro-interactions
- Implement **button wiggle** if untouched for 3 seconds (CSS/JS idle timer).
- Show **confetti animation** when users complete a pledge or level.
- Use a **progress ring/bar** to show "Adulting level" (0% → 100% when registered).
- Gamified registration explainer uses **4 levels with XP/badges**:
  1. Get ID
  2. Find centre
  3. Register (3 taps: Go → Give ID → Fingerprint & photo → Get slip)
  4. Show up & vote

### Integrations
- **IEBC status check**: Embed `https://verify.iebc.or.ke` in a webview — do NOT build a custom checker.
- **Registration centres**: Pull and update via **cron job** from IEBC website — do not hardcode.
- **WhatsApp share**: Auto-generate a countdown poster image for sharing.
- **IEBC registration dates**: Pull live from IEBC news endpoints so the "ongoing?" tile is always accurate.

### Myths vs Reality Cards
- Horizontal swipe gallery with flip-card pattern.
- Each card: myth on front → stat + blunt line on back.
- Use heavy Gen Z tone on the back of each card.

---

## Tone & Copy Guide

Write app copy in **playful, Gen Z Kenya English** with light Swahili/Sheng. Do not overdo the slang — sprinkle, don't saturate.

**Tagline examples:**
- "2027 Toke na Mbogi 👀"
- "Ni Mbaya na Lazima You Decide"
- "Sisi ndio majority, bado tuna behave kama visitors"
- "If you can queue for Nyege Nyege tickets, you can queue once to register. Acha jokes."

**CTA button copy:**
- "Cheki Status Yangu"
- "Niite Directions"
- "Sawa, Nitaenda Kuji-register"

**Myth card tone:**
- "You'll March on X/TikTok but ignore ballot? Make it make sense."
- "Cheki, complaining on X bila kura ni noise pollution."

---

## Key External Links

| Resource | URL |
|----------|-----|
| IEBC registration status | `https://verify.iebc.or.ke` |
| IEBC registration centres | `https://kiongozi.online/iebc-constituency-offices` |
| IEBC news / dates | `https://www.iebc.or.ke/news/?Register_Today` |
| How to register | `https://www.iebc.or.ke/registration/?how` |

---

## Environment Variables

```
# .env (gitignored — never commit)
# Add keys here as integrations are set up:
# NEXT_PUBLIC_CMS_URL=
# NEXT_PUBLIC_ANALYTICS_ID=
# CRON_SECRET=
```

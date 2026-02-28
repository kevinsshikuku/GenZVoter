Genz Voter APP.

## Core concept and vibe

- Mobile‑first, vertical layout, swipeable like stories, with super short text chunks and bold visuals.  
- Mobile and desktop view shoult sit on diffrent files  in the codebase and be independent of each other.
- Web and desktop versions should be thought of diffrently. (Mobile is for ADHD heavy users, desktop is for those who want to learn more and able to read long texts and articles)
- Tone: playful, slightly chaotic, very Gen Z Kenya: “Sijui politics? Relax, tufanye hii kitu haraka haraka.”  
- Structure everything  for ADHD and low attention users. 

-  No maps just list of centres and description of where they are located.


Example tagline on hero:  
> “2027 Toke na Mbogi 👀”

## Key sections (for “brain rot” users)

Think  not long pages. Each card is tappable, full-screen, with big icons and 1–2 lines only.

1. **Countdown & hype**
   - Big live countdown to Election Day in days/hours: “2027 Elections in 521 days – Ni Mbaya”  
   - Micro-animation each time they open the site (confetti, vibrating numbers). 


2. **“Am I registered?” quick check**
   - One big button: “Cheki Status Yako" 
   - ( ID. Na date of Birth )
   - The button should lead to IEBC portal for verification webview on my app for nice UI/UX.

3. **“Where do I register today?”**
   - A list of all IEBC  registration centres in Kenya and their current status: “Use  IEBC offical listed centres desk. this should be done by a cron job to check required updates from IEBC website.
   

4. **“What do I need?” ultra‑short requirements**
   - Two swipe cards only:
     - “To **register**: Kenyan ID or valid passport, be 18+ and of sound mind, not registered elsewhere.” [iebc.or](https://www.iebc.or.ke/registration/?how)
     - “To **vote**: Just show up na ID or passport at your polling station. Acknowledgment slip si lazima.” [thestar.co](https://thestar.co.ke/voter-registration-in-kenya-step-by-step-guide/)
   - Use icons for ID, age, brain, location; almost no text.

5. **Registration & voting explainer – as a game**
   - Instead of paragraphs, do a story / quest:
     - Level 1: “Get ID” (with note about ID delays being a real barrier – “Sisi tunajua ni struggle, but start early.”). [africasacountry](https://africasacountry.com/2026/02/gen-zs-electoral-dilemma)
     - Level 2: “Find centre” (uses your “where do I register” logic).  
     - Level 3: “Register” (3 taps: “Go,” “Give ID,” “Fingerprint & photo,” “Get slip”). [iebc.or](https://www.iebc.or.ke/uploads/resources/OFt91j0dYQ.pdf)
     - Level 4: “Show up & vote.”  
   - Each level completion gives a little badge, animation, or “XP points.” [imaginovation](https://imaginovation.net/blog/gamification-adhd-apps-user-retention/)

6. **Myths vs reality (swipe memes)**
   - Horizontal swipe gallery:
     - Card: “My vote haiwezi change anything.” → flip: short stat + blunt line.  
       - E.g., “In 2022, only 2.3M youth 18–24 registered – youth ended up being <10% of votes, so obviously msiaskizwe.” [africasacountry](https://africasacountry.com/2026/02/gen-zs-electoral-dilemma)
     - Card: “Politics ni for boomers.” → flip: “But 75% of Kenya is under 35. Ukiwachia boomers kura, unawachia life decisions pia.” [nation](https://nation.africa/kenya/news/gen-z-power-why-7-in-10-plan-to-vote-in-2027--5273070)
   - Use heavy Gen Z tone: “You’ll March on X/TikTok but ignore ballot? Make it make sense.”

## UX patterns for ADHD / low attention

- **Chunk everything** into 1–2 line screens with a big “Next” or swipe cue, rather than a scroll wall. [blog.pixelfreestudio](https://blog.pixelfreestudio.com/how-to-use-micro-interactions-for-gamification-in-web-design/)
- **Micro‑interactions**:
  - Buttons wiggle slightly if untouched for 3 seconds.  
  - Progress bar or ring for “Adulting level: 35% → 100% when you’re registered.” [imaginovation](https://imaginovation.net/blog/gamification-adhd-apps-user-retention/)
- **Instant feedback**:
  - After they tap “I pledge to register,” show confetti + “Screenshot this receipt and send to squad.”  
- **Low‑friction nav**:
  - Bottom nav with 3 icons only: “Home (countdown), Register, Info.”  
  - Everything reachable within 2 taps.

## Kenyan Gen Z lingo ideas (tone guide)

Don’t overdo it, but sprinkle like this:

- Ni Mbaya na Lazima You Decide.”  
- “Sisi ndio majority, bado tuna behave kama visitors.”  
- “Cheki, complaining on X bila kura ni noise pollution.”  
- CTA buttons:
  - “Cheki status yangu.”
  - “Niite directions.”
  - “Sawa, nitaenda kuji-register.”  

Example hero micro-copy:

> “If you can queue for Nyege Nyege tickets, you can queue once to register. Acha jokes.”

## Data & integrations to plan

- Pull **official dates** for current continuous voter registration phases and by‑election blackouts from IEBC news endpoints/pages so the “ongoing?” tile is always accurate. [iebc.or](https://www.iebc.or.ke/news/?Register_Today)
- Store a simple **CMS** for:
  - Registration centres and Huduma Centres with geolocation and status flags. [kiongozi](https://kiongozi.online/iebc-constituency-offices)
  - Myth‑busting cards and lingo snippets so non‑devs can tweak the copy as vibes change.  
- External links:
  - IEBC verification portal inside webview for “Am I registered?” [verify.iebc.or](https://verify.iebc.or.ke)
  - Deep links to IEBC social/media campaigns targeting youth so they see it’s official. [kenyanews.go](https://www.kenyanews.go.ke/iebc-to-boost-youth-voter-registration/)

## Tech stack suggestion
- Full blown PWA
- Frontend: Next.js or Nuxt, Tailwind, PWA setup so it feels like an app on phones.  
- Optional fun:  
  - Anonymous analytics for which cards Gen Z actually interact with.  
  - Simple sharing: “Share this countdown to WhatsApp” (auto‑generate a tiny poster).

If you want, next step I can help you draft actual screen flows (wireframe-level) and sample copy for each key screen in Kenyan Gen Z English + some Swahili sheng.
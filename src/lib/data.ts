import type { MythCard, GameLevel } from "./types";

export const ELECTION_DATE = new Date("2027-08-10T07:00:00+03:00");

export const MYTH_CARDS: MythCard[] = [
  {
    id: "1",
    myth: "My vote haiwezi change anything.",
    reality:
      "In 2022 only 2.3M youth aged 18-24 registered.\nout of 8M eligible\nManze tokea tu uone Change",
    stat: "",
    emoji: "🗳️",
  },
  {
    id: "2",
    myth: "Politics ni for boomers.",
    reality:
      "75% of Kenya is under 35.\nUkiwachia boomers kura,\nunawachia boomers life decisions pia.\nSimple maths.",
    stat: "75% of Kenya is under 35",
    emoji: "📊",
  },
  {
    id: "3",
    myth: "All politicians are the same, what's the point?",
    reality:
      "Kura yako decides who controls\nthe budgets for roads, hospitals,\nSchools in your area.\nChuja wote weka new faces!",
    emoji: "🏥",
  },
  {
    id: "4",
    myth: "Nitatumia X/TikTok kuleta change.",
    reality:
      "You'll march online but ignore the ballot?\nMake it make sense.\nTikTok views don't count\nat tallying centres.",
    emoji: "📱",
  },
  {
    id: "5",
    myth: "Registration process ni ngumu sana.",
    reality:
      "Show up na ID.\nGive it to the officer.\nFingerprint. Photo. Get your slip.\nLess steps than creating a TikTok account.",
    emoji: "✅",
  },
  {
    id: "6",
    myth: "Sitaki kushinda line ndefu.",
    reality:
      "Kama unaeza Queue line ya Super-Metro Daily Tao.\nLine ya kura ni easy\njuu ni once in 5 Years.",
    emoji: "⏳",
  },
];

export const GAME_LEVELS: GameLevel[] = [
  {
    id: 1,
    title: "Get Your ID",
    subtitle: "The starter pack",
    steps: [
      "Visit any Huduma Centre or Sub-County offices",
      "Bring your birth certificate + 2 passport photos",
      "Fill the ID application form",
      "Wait 2–3 weeks for collection",
    ],
    emoji: "🪪",
    xp: 100,
    badge: "ID Holder",
    note: "Tunajua ni struggle – ID delays are real. Start early, like NOW. Don't wait until 2026.",
  },
  {
    id: 2,
    title: "Find Your Centre",
    subtitle: "Know where to go",
    steps: [
      "Check the registration centres list in this app",
      "Find one nearest to you",
      "Note the hours (usually Mon–Fri, 8am–5pm)",
      "Save the address or screenshot it",
    ],
    emoji: "📍",
    xp: 150,
    badge: "Scout",
  },
  {
    id: 3,
    title: "Register",
    subtitle: "The main event – 4 taps",
    steps: [
      "Go to the registration centre",
      "Give your ID or valid passport to the officer",
      "Fingerprint scan + passport photo taken",
      "Receive your acknowledgment slip – keep it safe",
    ],
    emoji: "🖐️",
    xp: 300,
    badge: "Registered Voter",
    note: "Your acknowledgment slip is proof you registered. Screenshot or photocopy it.",
  },
  {
    id: 4,
    title: "Show Up & Vote",
    subtitle: "Election Day – the final boss",
    steps: [
      "Bring your ID or valid passport",
      "Go to your designated polling station",
      "Queue up and wait your turn",
      "Mark your ballot papers and deposit them",
    ],
    emoji: "🗳️",
    xp: 500,
    badge: "2027 Voter",
    note: "Acknowledgment slip si lazima on election day – your ID is enough. Just show up.",
  },
];

/* ─────────────────────────────────────────────────────────────
   REGISTRATION CENTRES — imported from the versioned data file.
   Edit src/lib/centres-data.ts to add / update centres.
───────────────────────────────────────────────────────────── */
export { default as REGISTRATION_CENTRES } from "./centres-data";

export const REQUIREMENTS = {
  toRegister: [
    { icon: "🪪", text: "Kenyan National ID or valid passport" },
    { icon: "🎂", text: "Must be 18 years or older" },
    { icon: "🧠", text: "Of sound mind" },
    { icon: "📍", text: "Not registered as a voter elsewhere" },
  ],
  toVote: [
    { icon: "🪪", text: "Your Kenyan ID or valid passport" },
    { icon: "📍", text: "Show up at your designated polling station" },
    { icon: "✅", text: "Acknowledgment slip si lazima – ID is enough" },
  ],
};

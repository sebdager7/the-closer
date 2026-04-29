// ─── Elite Closer Quotes ─────────────────────────────────────────────────────
export const ELITE_QUOTES = {
  z1: [
    { q: "People buy on emotion and justify with logic.", a: "— Andy Elliott" },
    { q: "The only way someone buys from you is if they trust you first.", a: "— Andy Elliott" },
    { q: "Rapport is not small talk. Rapport is making someone feel that you truly see them.", a: "— Jordan Belfort" },
    { q: "You must make the prospect believe in the certainty of the outcome.", a: "— Jordan Belfort" },
  ],
  z2: [
    { q: "Your words create pictures. Make sure those pictures sell.", a: "— Grant Cardone" },
    { q: "Weak language is weak closing. Every word either builds conviction or destroys it.", a: "— Andy Elliott" },
    { q: "Don't say cost — say investment. Don't say sign — say get started.", a: "— Jordan Belfort" },
    { q: "The right phrase at the right moment is worth ten minutes of pitch.", a: "— Zig Ziglar" },
  ],
  z3: [
    { q: "Social proof is the most powerful force in sales. One client story beats all your facts.", a: "— Alex Hormozi" },
    { q: "Urgency isn't manipulation — it's doing the prospect a favor by helping them decide now.", a: "— Grant Cardone" },
    { q: "When you become genuinely interested in others, they become interested in you.", a: "— Dale Carnegie" },
    { q: "Create the fear of missing out without the fear of being pressured.", a: "— Andy Elliott" },
  ],
  z4: [
    { q: "Amateurs compete. Professionals close. The mindset is everything before the words.", a: "— Grant Cardone" },
    { q: "The close starts at the very beginning of the conversation, not at the end.", a: "— Jordan Belfort" },
    { q: "You can have everything you want if you help enough other people get what they want.", a: "— Zig Ziglar" },
    { q: "The #1 reason people don't close is their own fear of rejection.", a: "— Andy Elliott" },
  ],
}

// ─── Sonic Zone Map Data ──────────────────────────────────────────────────────
export const ZONES = [
  {
    id: 'z1',
    icon: '🧠',
    nameColor: '#5aae4a',
    platColor: '#4a8a2a',
    bgClass: 'zone-z1',
    gndColor: '#3a6e2a',
    name: 'Green Hill Zone',
    sub: 'Psychology of Trust',
    locked: false,
    acts: [
      { id: 'a1', name: 'Why People Buy', type: 'Learn', xp: 30, stars: 3 },
      { id: 'a2', name: 'Trust Triangle', type: 'Quiz', xp: 40, stars: 2 },
      { id: 'a3', name: 'Mirror & Match', type: 'Fill-in', xp: 50, stars: 0 },
      { id: 'a4', name: 'Vocal Tonality', type: 'Quiz', xp: 40, stars: 0 },
    ],
  },
  {
    id: 'z2',
    icon: '🎯',
    nameColor: '#ff8050',
    platColor: '#c07030',
    bgClass: 'zone-z2',
    gndColor: '#8a4a10',
    name: 'Lava Valley Zone',
    sub: 'Power Vocabulary',
    locked: false,
    acts: [
      { id: 'a5', name: 'Words That Sell', type: 'Match', xp: 40, stars: 0 },
      { id: 'a6', name: 'Killer Phrases', type: 'Quiz', xp: 40, stars: 0 },
      { id: 'a7', name: 'Certainty Language', type: 'Fill-in', xp: 50, stars: 0 },
      { id: 'a8', name: 'Emotional Triggers', type: 'Learn', xp: 30, stars: 0 },
    ],
  },
  {
    id: 'z3',
    icon: '⚡',
    nameColor: '#a060f0',
    platColor: '#6a2a9a',
    bgClass: 'zone-z3',
    gndColor: '#2a1a5a',
    name: 'Storm Cloud Zone',
    sub: 'Influence & Persuasion',
    locked: true,
    acts: [
      { id: 'a9', name: 'Reciprocity', type: 'Learn', xp: 30, stars: 0 },
      { id: 'a10', name: 'Social Proof', type: 'Quiz', xp: 40, stars: 0 },
      { id: 'a11', name: 'Scarcity & Urgency', type: 'Fill-in', xp: 50, stars: 0 },
      { id: 'a12', name: 'Commitment Ladder', type: 'Match', xp: 50, stars: 0 },
    ],
  },
  {
    id: 'z4',
    icon: '🔥',
    nameColor: '#ff4444',
    platColor: '#3a1a1a',
    bgClass: 'zone-z4',
    gndColor: '#1a0808',
    name: 'Final Boss Zone',
    sub: 'The Close Mindset',
    locked: true,
    acts: [
      { id: 'a13', name: 'Fear vs Confidence', type: 'Learn', xp: 30, stars: 0 },
      { id: 'a14', name: 'Assumptive Selling', type: 'Quiz', xp: 40, stars: 0 },
      { id: 'a15', name: 'Body Language', type: 'Match', xp: 50, stars: 0 },
      { id: 'a16', name: 'Elite Mindset', type: 'Learn', xp: 60, stars: 0 },
    ],
  },
]

// ─── Lesson Content ───────────────────────────────────────────────────────────
export const LESSON_DATA = {
  a3: [
    {
      type: 'learn',
      title: 'Mirror & Match',
      content: "Andy Elliott: <em>'When you match someone's energy, they subconsciously feel you're like them — and people buy from people like them.'</em>",
      cards: [
        { h: 'Mirror the pace', p: "If they speak slowly — slow down. Match their energy exactly.", q: "— Andy Elliott" },
        { h: 'Mirror vocabulary', p: "They say 'house', you say 'house'. Their exact words trigger familiarity.", q: "— Jordan Belfort" },
      ],
    },
    {
      type: 'quiz',
      question: "Andy Elliott's best move when your prospect speaks slowly and deliberately:",
      options: ["Talk faster to show urgency", "Match their calm pace and tone", "Use loud energy", "Stay completely silent"],
      correct: 1,
      explanation: "Matching energy creates subconscious rapport — the foundation of every close.",
    },
    {
      type: 'fill',
      question: "Complete the Belfort Mirror Rule:",
      before: "Use the prospect's exact",
      after: "— never substitute synonyms.",
      answer: "words",
      hint: "vocabulary",
      explanation: "Exact word matching triggers unconscious familiarity and trust.",
    },
    {
      type: 'quiz',
      question: "Prospect says: 'Not sure about the timing.' Best mirror close?",
      options: ["'The timing is actually perfect!'", "'What specifically feels off about timing?'", "'We need to move quickly.'", "'Everyone feels that way.'"],
      correct: 1,
      explanation: "Reflecting their concern back shows you heard them — Andy Elliott's rapport principle.",
    },
  ],
  a5: [
    {
      type: 'learn',
      title: "Belfort's Language of Certainty",
      content: "Jordan Belfort: <em>'Your words create a movie in the prospect's mind. Make sure that movie ends with a yes.'</em>",
      cards: [
        { h: "'Cost' → 'Investment'", p: "'Cost' triggers pain. 'Investment' frames it as future value.", q: "— Jordan Belfort" },
        { h: "'Sign' → 'Get started'", p: "'Sign' feels like a trap. 'Get started today' feels collaborative.", q: "— Andy Elliott" },
        { h: "'Buy' → 'Own'", p: "Ownership feels earned. Buying feels transactional.", q: "— Grant Cardone" },
      ],
    },
    {
      type: 'match',
      question: "Match each weak word to its power replacement:",
      pairs: [
        { left: 'Cost', right: 'Investment' },
        { left: 'Sign', right: 'Get Started' },
        { left: 'Buy', right: 'Own' },
        { left: 'Cheap', right: 'Affordable' },
      ],
    },
    {
      type: 'quiz',
      question: "Prospect hesitates on price. Cardone's most powerful frame?",
      options: ["'The price is very reasonable.'", "'Can you afford NOT to?'", "'I can get you a discount.'", "'It doesn't cost that much.'"],
      correct: 1,
      explanation: "Cardone flips cost conversation into cost-of-inaction — a core elite closer pattern.",
    },
  ],
  a2: [
    {
      type: 'learn',
      title: "The Trust Triangle",
      content: "Belfort's Trust Triangle: Credibility, Reliability, and Connection. Every purchase requires all three.",
      cards: [
        { h: 'Credibility', p: "Know your product better than anyone.", q: "— Jordan Belfort" },
        { h: 'Reliability', p: "Do what you said. Show up when you said.", q: "— Andy Elliott" },
        { h: 'Connection', p: "People don't care how much you know until they know how much you care.", q: "— Zig Ziglar" },
      ],
    },
    {
      type: 'quiz',
      question: "The Trust Triangle has 3 pillars. Which is NOT one of them?",
      options: ["Credibility", "Reliability", "Pressure", "Connection"],
      correct: 2,
      explanation: "Trust Triangle = Credibility + Reliability + Connection. Pressure destroys all three.",
    },
    {
      type: 'fill',
      question: "Complete Zig Ziglar's core principle:",
      before: "People don't care how much you know until they know how much you",
      after: ".",
      answer: "care",
      hint: "genuine concern",
      explanation: "Emotional connection precedes every transaction.",
    },
  ],
}

// ─── Training Modes ───────────────────────────────────────────────────────────
export const TRAINING_MODES = [
  {
    id: 'std',
    icon: '🎯',
    name: 'Standard',
    desc: 'AI prospect + tone bar + Deal Autopsy',
    blitzMsg: 'Standard mode — real AI prospect, tone detection, Deal Autopsy after. Loop: practice → feedback → retry.',
  },
  {
    id: 'bru',
    icon: '😤',
    name: 'Brutal Coach',
    desc: 'Zero sugar — Blitz calls out every weak word',
    className: 'brutal',
    blitzMsg: 'BRUTAL MODE. I will call out every weak word, stutter, and filler. No sugar. No handholding. You asked for it.',
  },
  {
    id: 'one',
    icon: '🎰',
    name: 'One Shot Close',
    desc: 'One chance. Clock runs. Score kills the deal',
    className: 'oneshot',
    blitzMsg: 'ONE SHOT CLOSE. 90 seconds. One shot. Score determines if this deal lives or dies.',
  },
  {
    id: 'rfm',
    icon: '⚡',
    name: 'Instant Reframe',
    desc: 'Blitz detects objections — tap for 3 reframes',
    blitzMsg: 'Instant Reframe — I detect objections live. Tap my popup for 3 elite reframes. Elliott. Belfort. Cardone.',
  },
]

export const DIFFICULTY_MAP = {
  1: 'Beginner',
  2: 'Beginner+',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Elite Closer',
}

export const INDUSTRIES = [
  'Door-to-Door',
  'Life Insurance',
  'Car Sales',
  'Real Estate',
  'Solar',
  'B2B / SaaS',
  'General Sales',
]

export const PROSPECTS = [
  'Skeptical homeowner',
  'Busy business owner',
  'Price-sensitive buyer',
  'Very direct / blunt',
  'Friendly but hesitant',
]

export const PITCH_FRAMEWORKS = [
  'Andy Elliott 10-Step',
  'Belfort Straight Line',
  'Cardone Tonality',
  'Ziglar Story-Close',
  'Hormozi Value Stack',
  'Problem/Agitate/Solve',
]

export const REBUILD_FRAMEWORKS = [
  'Andy Elliott patterns',
  'Belfort certainty framework',
  'Cardone aggression',
  'Hormozi value stacking',
]

export const LANGUAGES = [
  { code: 'English', label: '🌐 EN' },
  { code: 'Spanish', label: '🇪🇸 ES' },
  { code: 'Portuguese', label: '🇧🇷 PT' },
  { code: 'French', label: '🇫🇷 FR' },
  { code: 'German', label: '🇩🇪 DE' },
  { code: 'Italian', label: '🇮🇹 IT' },
  { code: 'Mandarin Chinese', label: '🇨🇳 ZH' },
  { code: 'Japanese', label: '🇯🇵 JA' },
  { code: 'Arabic', label: '🇸🇦 AR' },
  { code: 'Hindi', label: '🇮🇳 HI' },
]

// ─── PLANS ────────────────────────────────────────────────────────────────────
export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceDisplay: '$0',
    period: 'forever',
    badge: null,
    features: ['5 rebuttals/day', '3 pitches/day', 'Zones 1–2 only'],
    locked: ['AI Training', 'Deal Autopsy', 'Agency Program', 'Team Chat'],
  },
  {
    id: 'pro',
    name: 'Pro Closer',
    price: 17.99,
    priceDisplay: '$17.99',
    period: '/month',
    badge: 'Most Popular',
    badgeColor: 'blue',
    features: [
      'Unlimited rebuttals & pitches',
      'All 4 Psychology zones',
      'AI Training — all 4 modes',
      'Tone Detection + Deal Autopsy',
      'Confidence Tracker',
      'Custom Brain upload',
    ],
    locked: ['Agency Growth Program', 'Voice calls'],
  },
  {
    id: 'elite',
    name: 'Elite Closer',
    price: 49.99,
    priceDisplay: '$49.99',
    period: '/month',
    badge: 'Elite Closer',
    badgeColor: 'gold',
    features: [
      'Everything in Pro',
      'Agency Growth Program',
      'Team Chat + Deal Board',
      'AI Voice training calls',
      'Unlimited lives + modes',
      'White-label options',
    ],
    locked: [],
    agencyNote: '🏢 Agency Growth Program eligible. Earn 20–35% monthly recurring per member you bring in.',
  },
]

// ─── AGENCY TIERS ─────────────────────────────────────────────────────────────
export const AGENCY_TIERS = [
  {
    id: 't1',
    tier: 'Tier 1 — Starter',
    name: 'Growth Partner',
    req: '1–9 active members',
    pct: 20,
    detail: 'Monthly recurring',
    perks: ['Pro: $3.60/user/mo', 'Elite: $10.00/user/mo', 'Team dashboard', 'Shareable code'],
    style: 't1',
  },
  {
    id: 't2',
    tier: 'Tier 2 — Agency',
    name: 'Agency Director',
    req: '10–49 active members',
    pct: 30,
    detail: 'Monthly recurring',
    perks: ['Pro: $5.40/user/mo', 'Elite: $15.00/user/mo', 'Priority support', 'Custom team code'],
    style: 't2',
  },
  {
    id: 't3',
    tier: 'Tier 3 — Elite',
    name: 'Elite Partner',
    req: '50+ active members',
    pct: 35,
    detail: 'Forever recurring',
    perks: ['Pro: $7.20/user/mo', 'Elite: $20.00/user/mo', 'White-label', 'Dedicated account mgr'],
    style: 't3',
  },
]

// ─── TEAM CHAT SEED DATA ──────────────────────────────────────────────────────
export const CHAT_USERS = {
  mt: { name: 'Marcus T.', initials: 'MT', color: '#1a6bbf', role: 'upline' },
  jr: { name: 'Jordan R.', initials: 'JR', color: '#e74c3c', role: 'rep' },
  pk: { name: 'Priya K.', initials: 'PK', color: '#8b5cf6', role: 'rep' },
  dm: { name: 'Devon M.', initials: 'DM', color: '#0891b2', role: 'upline' },
  aw: { name: 'Aisha W.', initials: 'AW', color: '#059669', role: 'rep' },
}

export const CHAT_META = {
  general: { icon: '#', name: 'general', desc: 'Agency-wide · 34 members', action: 'Post Deal', canAnnounce: true },
  announcements: { icon: '📢', name: 'announcements', desc: 'Official leadership announcements', action: 'Announce', canAnnounce: true },
  deals: { icon: '💰', name: 'deal board', desc: 'Post every closed deal here', action: 'Log Deal', canAnnounce: false },
  'team-a': { icon: '⚡', name: 'Team Alpha', desc: 'Marcus T. upline · 12 reps', action: 'Post Deal', canAnnounce: true },
  'team-b': { icon: '🔥', name: 'Team Bravo', desc: 'Devon M. upline · 9 reps', action: 'Post Deal', canAnnounce: true },
  training: { icon: '🎯', name: 'training tips', desc: 'Share scripts and wins', action: null, canAnnounce: false },
  'dm-marcus': { icon: '💬', name: 'Marcus T.', desc: 'Direct message', action: null, canAnnounce: false },
  'dm-jordan': { icon: '💬', name: 'Jordan R.', desc: 'Direct message', action: null, canAnnounce: false },
}

export const INITIAL_CHAT_DATA = {
  general: [
    { type: 'sys', text: 'Agency Growth Program activated' },
    { type: 'msg', user: 'mt', text: "Morning team! Big week ahead. Anyone who closed yesterday — post it on the deal board. Let's see that board light up.", time: '8:04 AM', rxns: [{ e: '🔥', n: 5 }, { e: '💪', n: 3 }] },
    { type: 'msg', user: 'dm', text: "Team Bravo had 3 closes on Monday. @Marcus how's Alpha looking?", time: '8:17 AM', rxns: [{ e: '💰', n: 2 }] },
    { type: 'msg', user: 'mt', text: "Alpha is at 4 closes this week. Priya used the Belfort certainty frame on a price objection and the guy didn't even flinch. That's what training is for.", time: '8:31 AM', rxns: [{ e: '🔥', n: 6 }, { e: '👏', n: 4 }] },
    { type: 'msg', user: 'pk', text: "Brutal Coach mode in training changed my whole approach. Zero tolerance for filler words after one week of it. Highly recommend.", time: '9:02 AM', rxns: [{ e: '💯', n: 7 }] },
  ],
  announcements: [
    { type: 'sys', text: 'Only uplines and owners can post announcements' },
    { type: 'ann', user: 'me', text: "Monthly leaderboard resets this Friday. Top closer gets a $500 bonus. Post every deal on the board — it counts toward your ranking.", time: 'Mon 9:00 AM', pinned: true },
    { type: 'ann', user: 'mt', text: "Team training call tonight at 7PM. We're going through One Shot Close mode together. Bring a tough prospect scenario. Attendance mandatory for Alpha reps.", time: 'Today 8:15 AM' },
  ],
  deals: [
    { type: 'sys', text: 'Every real closed deal goes here' },
    { type: 'deal', user: 'pk', amount: 12400, industry: 'Solar', client: 'Homeowner', ttc: '2 calls / 4 days', note: "Overcame 'need to think' with Cardone's urgency frame — called exactly on the promised follow-up time.", time: 'Today 7:42 AM', rxns: [{ e: '🔥', n: 9 }, { e: '💰', n: 6 }, { e: '🏆', n: 4 }] },
    { type: 'deal', user: 'mt', amount: 8750, industry: 'Life Insurance', client: 'Family of 4', ttc: 'Same call', note: "Elliott's mirror-and-match on a skeptical husband. Once he felt understood, all objections dropped.", time: 'Yesterday 4:15 PM', rxns: [{ e: '🔥', n: 7 }, { e: '💪', n: 5 }] },
    { type: 'deal', user: 'aw', amount: 5200, industry: 'B2B / SaaS', client: 'Small biz owner', ttc: '3 calls', note: "Hormozi value stacking — laid out ROI before mentioning price. Never had a real objection after that.", time: 'Yesterday 11:30 AM', rxns: [{ e: '💯', n: 4 }, { e: '🔥', n: 3 }] },
  ],
  'team-a': [
    { type: 'sys', text: 'Team Alpha — Marcus T. upline' },
    { type: 'msg', user: 'mt', text: "Alpha — daily check-in. Who has calls booked today? Tell me before you go out.", time: '7:55 AM', rxns: [] },
    { type: 'msg', user: 'pk', text: "3 appointments. 10, 1, and 3. Running the 10-step Elliott flow and it's clicking.", time: '8:10 AM', rxns: [{ e: '💪', n: 2 }] },
  ],
  'team-b': [
    { type: 'sys', text: 'Team Bravo — Devon M. upline' },
    { type: 'msg', user: 'dm', text: "Bravo — big push this week. Every rep does 2 training calls a day before hitting the field. Use Brutal Mode. Not standard. Brutal.", time: '8:00 AM', rxns: [{ e: '🔥', n: 4 }] },
  ],
  training: [
    { type: 'sys', text: 'Share scripts, techniques, and wins from training' },
    { type: 'msg', user: 'jr', text: "Quick tip: if you get 'I need to think about it', try: 'What specifically are you thinking about?' One question eliminates 60% of stall tactics.", time: 'Yesterday 6:30 PM', rxns: [{ e: '💯', n: 8 }, { e: '🔥', n: 5 }] },
    { type: 'msg', user: 'pk', text: "The tone detection bar in AI training is insane. Could see exactly which lines killed the deal. Fixed 2 bad habits in one session.", time: 'Yesterday 8:00 PM', rxns: [{ e: '💡', n: 6 }] },
  ],
  'dm-marcus': [
    { type: 'msg', user: 'mt', text: "Hey — Jordan had a rough call today. Worth checking in before tonight's team call. He's close to a breakthrough.", time: '2:14 PM', rxns: [] },
  ],
  'dm-jordan': [],
}

export const TEAM_MEMBERS = [
  { name: 'Marcus T.', plan: 'Elite', close: 72, status: 'active', trend: 14 },
  { name: 'Jordan R.', plan: 'Elite', close: 68, status: 'active', trend: 11 },
  { name: 'Priya K.', plan: 'Pro', close: 51, status: 'active', trend: 8 },
  { name: 'Devon M.', plan: 'Pro', close: 44, status: 'active', trend: 6 },
  { name: 'Carlos S.', plan: 'Pro', close: 38, status: 'active', trend: 3 },
  { name: 'Aisha W.', plan: 'Elite', close: 65, status: 'active', trend: 9 },
  { name: 'Tyler B.', plan: 'Pro', close: 29, status: 'active', trend: 2 },
  { name: 'Lena F.', plan: 'Pro', close: 0, status: 'pending', trend: 0 },
]

export const CONF_METRICS = [
  { key: 'closeRate', lbl: 'Close rate' },
  { key: 'objectionWin', lbl: 'Objection win %' },
  { key: 'toneStrength', lbl: 'Tone strength' },
  { key: 'avgDealValue', lbl: 'Avg deal value' },
  { key: 'oneShotClose', lbl: 'One Shot Close %' },
]

export const PROSPECT_NAMES = [
  ['James Mitchell', 'JM'],
  ['Sarah Patterson', 'SP'],
  ['Robert Chen', 'RC'],
  ['Maria Gonzalez', 'MG'],
  ['David Thompson', 'DT'],
  ['Karen Williams', 'KW'],
]

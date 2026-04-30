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
      title: "Belfort's Trust Triangle",
      content: "Jordan Belfort's Straight Line System says every prospect needs to score you a 10 out of 10 on THREE things before they buy. Miss any one and the sale dies.",
      cards: [
        { h: 'Ten #1 — Your Product', p: 'They must believe your product/service is the best solution for their problem. Logic + emotion.', q: '— Jordan Belfort' },
        { h: 'Ten #2 — You', p: 'They must trust YOU specifically. Are you sharp, enthusiastic, an expert?', q: '— Jordan Belfort' },
        { h: 'Ten #3 — Your Company', p: 'They must trust your company will be there to back it up. Credibility and track record.', q: '— Jordan Belfort' },
      ],
    },
    {
      type: 'quiz',
      question: 'A prospect loves the product and trusts the company but does not trust you personally. What happens?',
      options: ['They buy anyway', 'They buy but feel uneasy', 'They do not buy — all three tens are required', 'They ask for a supervisor'],
      correct: 2,
      explanation: "All three tens must be present. One missing ten kills the sale every time.",
    },
    {
      type: 'match',
      question: 'Match each Ten to what builds it:',
      pairs: [
        { left: 'Ten on Product', right: 'Features + outcome story' },
        { left: 'Ten on You', right: 'Energy, expertise, confidence' },
        { left: 'Ten on Company', right: 'Track record, testimonials' },
      ],
    },
    {
      type: 'fill',
      question: 'Complete the Belfort certainty rule:',
      before: 'Your tone of voice communicates',
      after: 'before your words ever land.',
      answer: 'certainty',
      hint: 'confidence / belief',
      explanation: 'Certainty is transferred through tone. Sound certain and they feel certain.',
    },
  ],

  a1: [
    {
      type: 'learn',
      title: 'Why People Really Buy',
      content: "People don't buy products. They buy feelings, outcomes, and identity. Andy Elliott says: 'Nobody buys a drill — they buy a hole in the wall. Nobody buys insurance — they buy peace of mind at 2am.'",
      cards: [
        { h: 'They buy feelings first', p: 'Every purchase starts with an emotion. Logic comes AFTER to justify what emotion already decided.', q: '— Andy Elliott' },
        { h: 'They buy outcomes', p: "Don't sell the product. Sell the life they have after owning it. Paint that picture vividly.", q: '— Zig Ziglar' },
        { h: 'They buy identity', p: "People buy things that match who they want to BE. 'Someone like me owns this.'", q: '— Jordan Belfort' },
      ],
    },
    {
      type: 'quiz',
      question: 'A customer says they want to think about it. What are they REALLY telling you?',
      options: [
        'They need more time to decide',
        'They are not yet emotionally sold — logic alone is not enough',
        'They want a lower price',
        'They are definitely not buying',
      ],
      correct: 1,
      explanation: "Stalls mean the emotional case was not made strong enough. They have not pictured their life after the purchase yet.",
    },
    {
      type: 'quiz',
      question: 'According to Zig Ziglar, what should you always sell FIRST?',
      options: ['The price', 'The features', 'The sizzle — the outcome and feeling', 'The company credentials'],
      correct: 2,
      explanation: "Sell the sizzle not the steak. Lead with the feeling and outcome, let features support it.",
    },
    {
      type: 'fill',
      question: 'Complete the core sales truth:',
      before: 'People buy on',
      after: 'and justify with logic.',
      answer: 'emotion',
      hint: 'feeling / heart',
      explanation: 'Emotion drives the decision. Logic closes the loop. Always lead with emotion.',
    },
  ],

  a4: [
    {
      type: 'learn',
      title: 'The Power of Tonality',
      content: "Research shows 93% of communication is NON-verbal. Your words are only 7% of your impact. Belfort built his entire system on tonality because it transfers certainty directly into the prospect's nervous system.",
      cards: [
        { h: 'Declarative statement tone', p: "Drop your voice at the END of sentences. This sounds certain. Raising it makes you sound like you are asking for permission.", q: '— Jordan Belfort' },
        { h: 'Scarcity tone', p: 'Slow down slightly and lower volume when mentioning scarcity or urgency. Calm certainty is more powerful than excitement.', q: '— Andy Elliott' },
        { h: 'Empathy tone', p: "When handling objections go SOFTER first. Match their concern emotionally before you redirect.", q: '— Chris Voss' },
      ],
    },
    {
      type: 'quiz',
      question: 'You are closing and you say "We only have two spots left this month." What tone should you use?',
      options: ['High energy and excited', 'Calm, slow, slightly lower volume', 'Fast and urgent to create pressure', 'Same tone as your pitch'],
      correct: 1,
      explanation: "Calm certainty creates real urgency. Excitement sounds salesy and fake. Slow it down and let the scarcity land.",
    },
    {
      type: 'quiz',
      question: 'A prospect gives you an objection. What is your FIRST tonal move?',
      options: ['Fire back with facts immediately', 'Match their emotional energy — go softer, show you heard them', 'Speed up to keep momentum', 'Stay exactly the same'],
      correct: 1,
      explanation: "Chris Voss and Andy Elliott both teach: match their emotion first. Empathy before logic every time.",
    },
    {
      type: 'fill',
      question: 'Complete the tonality rule:',
      before: 'Drop your voice at the',
      after: 'of sentences to sound certain, not questioning.',
      answer: 'end',
      hint: 'finish / conclusion',
      explanation: "Ending sentences by raising your pitch makes statements sound like questions — it destroys certainty.",
    },
  ],

  a6: [
    {
      type: 'learn',
      title: 'Killer Phrases That Close',
      content: "These are real documented phrases used by top closers that have been proven to move deals forward. Memorize them until they come out automatically.",
      cards: [
        { h: '"Help me understand..."', p: 'Chris Voss opener. Gets them talking and positions you as collaborative not adversarial.', q: '— Chris Voss' },
        { h: '"Most people in your situation..."', p: "Social proof embedded in a phrase. Normalizes buying. 'Most homeowners I work with had the same concern...'", q: '— Andy Elliott' },
        { h: '"What would it mean for you if..."', p: 'Makes them visualize the outcome. Sells the dream before the close.', q: '— Zig Ziglar' },
        { h: '"The only question is..."', p: "Belfort's assumptive setup. Moves past IF they buy to WHICH option or WHEN they start.", q: '— Jordan Belfort' },
      ],
    },
    {
      type: 'match',
      question: 'Match each killer phrase to its closer:',
      pairs: [
        { left: '"Help me understand"', right: 'Chris Voss' },
        { left: '"Most people in your situation"', right: 'Andy Elliott' },
        { left: '"The only question is"', right: 'Jordan Belfort' },
        { left: '"Picture yourself six months from now"', right: 'Zig Ziglar' },
      ],
    },
    {
      type: 'quiz',
      question: 'You want to assume the sale and move toward close. Which phrase works best?',
      options: [
        '"Would you like to move forward?"',
        '"Do you think this could work for you?"',
        '"The only question is do you want the basic or premium package?"',
        '"What do you think?"',
      ],
      correct: 2,
      explanation: "Belfort's assumptive framing bypasses the yes/no decision entirely. You are already past IF — you are at WHICH.",
    },
    {
      type: 'fill',
      question: 'Complete the social proof phrase:',
      before: 'Most people in your',
      after: 'had the same concern at first.',
      answer: 'situation',
      hint: 'position / place',
      explanation: "This phrase normalizes their objection and sets up the feel-felt-found reframe.",
    },
  ],

  a7: [
    {
      type: 'learn',
      title: 'Language of Certainty',
      content: "Jordan Belfort discovered that certainty is contagious. When you speak with absolute certainty about the outcome, the prospect borrows your certainty. Your words must eliminate doubt.",
      cards: [
        { h: 'Replace "I think" with "I know"', p: '"I think this could work for you" = doubt. "I know this will work for you" = certainty.', q: '— Jordan Belfort' },
        { h: 'Replace "hopefully" with "when"', p: '"Hopefully you will see results" = weak. "When you start seeing results in the first 30 days..." = certain.', q: '— Andy Elliott' },
        { h: 'Replace "if" with "when"', p: '"If you decide to move forward" = uncertainty. "When we get started" = assumed sale.', q: '— Grant Cardone' },
      ],
    },
    {
      type: 'match',
      question: 'Match the weak word to its power replacement:',
      pairs: [
        { left: 'I think', right: 'I know' },
        { left: 'Hopefully', right: 'When' },
        { left: 'If you decide', right: 'When we get started' },
        { left: 'Try', right: 'Guarantee' },
      ],
    },
    {
      type: 'quiz',
      question: 'Which closing line shows the most certainty?',
      options: [
        '"If this seems like a good fit we could maybe get started"',
        '"I think you might like this"',
        '"When we get you started this week you will see results in 30 days"',
        '"Would you like to think about it and let me know?"',
      ],
      correct: 2,
      explanation: "Future pacing with certainty. 'When we get you started' assumes the sale. '30 days' is specific and confident.",
    },
    {
      type: 'fill',
      question: 'Replace the weak word — complete the Belfort rule:',
      before: 'Never say IF you decide. Always say',
      after: 'we get started.',
      answer: 'when',
      hint: 'the word that assumes the sale',
      explanation: "'When' assumes the sale is already decided. 'If' puts doubt back in their mind.",
    },
  ],

  a8: [
    {
      type: 'learn',
      title: 'The 6 Emotional Buying Triggers',
      content: "Every human buying decision is driven by one or more of these 6 core emotional triggers. Identify which one your prospect responds to and speak directly to it.",
      cards: [
        { h: 'Fear of Loss', p: "The most powerful trigger. 'Most people who wait 6 months call me back wishing they had not.' — Grant Cardone", q: '— Grant Cardone' },
        { h: 'Desire for Gain', p: "Paint the dream outcome vividly. What does their life look like when this works?", q: '— Zig Ziglar' },
        { h: 'Social Proof', p: "'Last month I helped a family just like yours in this exact situation...' — makes it real.", q: '— Andy Elliott' },
        { h: 'Scarcity', p: "Real or deadline-based scarcity forces a decision. Indecision is the enemy of the close.", q: '— Jordan Belfort' },
        { h: 'Authority', p: "Credibility markers make them trust the outcome. Awards, years in business, client numbers.", q: '— Robert Cialdini' },
        { h: 'Reciprocity', p: "Give real value first. When you genuinely help someone they feel compelled to give back.", q: '— Robert Cialdini' },
      ],
    },
    {
      type: 'quiz',
      question: 'A prospect keeps delaying and saying they will think about it. Which trigger is most powerful here?',
      options: ['Desire for Gain', 'Fear of Loss', 'Authority', 'Reciprocity'],
      correct: 1,
      explanation: "Cardone and Belfort both say fear of loss is the #1 trigger for stalling prospects. Make the cost of waiting real and specific.",
    },
    {
      type: 'quiz',
      question: 'You share a story about a client who got results. Which trigger are you using?',
      options: ['Scarcity', 'Authority', 'Social Proof', 'Reciprocity'],
      correct: 2,
      explanation: "Social proof — a real story from a real customer like them is worth more than all your facts combined.",
    },
    {
      type: 'fill',
      question: 'Complete the Cardone fear of loss line:',
      before: 'Most people who wait end up calling me back and wishing they had not',
      after: 'so long.',
      answer: 'waited',
      hint: 'the action they regret',
      explanation: "Make the pain of waiting concrete and real. They need to feel the cost of inaction.",
    },
  ],

  a9: [
    {
      type: 'learn',
      title: 'Reciprocity — Give First, Close Second',
      content: "Robert Cialdini's research proved that when you genuinely give value first, humans feel psychologically compelled to give back. The best closers lead with real value before asking for anything.",
      cards: [
        { h: 'Give real value first', p: "Teach them something. Solve a small problem for free. Make them feel you are on their side.", q: '— Robert Cialdini' },
        { h: 'Personalize the gift', p: "Generic value triggers weak reciprocity. Personalized value — something specifically useful to THEM — creates strong obligation.", q: '— Alex Hormozi' },
        { h: 'Do not keep score out loud', p: "Never say 'I gave you that so now...' — destroys the effect. Give freely and let it work.", q: '— Robert Cialdini' },
      ],
    },
    {
      type: 'quiz',
      question: 'You want to use reciprocity in your opener. What is the best approach?',
      options: [
        'Tell them you have a special deal just for them',
        'Immediately pitch your product',
        'Share one genuinely useful insight about their industry before pitching anything',
        'Ask if they have time to talk',
      ],
      correct: 2,
      explanation: "Lead with real value specific to their situation. This triggers reciprocity before you ever mention your product.",
    },
    {
      type: 'fill',
      question: 'Complete the Cialdini reciprocity rule:',
      before: 'The more',
      after: 'the gift, the stronger the reciprocity response.',
      answer: 'personalized',
      hint: 'specific / tailored / customized',
      explanation: "Generic value = weak obligation. Personal value = strong compulsion to give back.",
    },
  ],

  a10: [
    {
      type: 'learn',
      title: 'Social Proof — The Herd Instinct',
      content: "Cialdini proved that when people are uncertain, they look to what others are doing. One real client story beats 10 minutes of facts. The more specific the story the more powerful the proof.",
      cards: [
        { h: 'Specific beats generic', p: "'Hundreds of clients' is weak. 'Last Tuesday I helped a family in [city] save $340 a month' is powerful.", q: '— Andy Elliott' },
        { h: 'Similar beats different', p: "Find the story where the client is most similar to your prospect. Age, situation, objection they had.", q: '— Jordan Belfort' },
        { h: 'Numbers build credibility', p: "Specific numbers feel true. Round numbers feel made up. '$10,000' feels less real than '$9,847'.", q: '— Alex Hormozi' },
      ],
    },
    {
      type: 'quiz',
      question: 'Which social proof statement is most convincing?',
      options: [
        '"We have helped thousands of customers"',
        '"Last month a homeowner in Phoenix saved $318 a month — he had the exact same concern you have"',
        '"Our product has great reviews"',
        '"Most people love what we do"',
      ],
      correct: 1,
      explanation: "Specific, similar, and numbered. City, dollar amount, same objection. This is Andy Elliott social proof.",
    },
    {
      type: 'fill',
      question: 'Complete the social proof formula:',
      before: 'Use a story where the client had the',
      after: 'concern your current prospect has right now.',
      answer: 'same',
      hint: 'identical / exact / matching',
      explanation: "Mirror their situation in the story. They see themselves in it and think: if it worked for them it can work for me.",
    },
  ],

  a11: [
    {
      type: 'learn',
      title: 'Real Urgency vs Fake Pressure',
      content: "Grant Cardone and Belfort both say urgency is the engine of the close. But fake pressure destroys trust. Real urgency — tied to a real reason — is doing the prospect a FAVOR.",
      cards: [
        { h: 'Time-based urgency', p: "Prices change, offers expire, slots fill. These are real. State them calmly — not frantically.", q: '— Grant Cardone' },
        { h: 'Cost of waiting', p: "What does every day of delay cost them? In dollars, in pain, in missed opportunity. Make it specific.", q: '— Andy Elliott' },
        { h: 'Never fake scarcity', p: "If you say 2 spots left and they find out it is not true, the sale and the relationship die instantly.", q: '— Jordan Belfort' },
      ],
    },
    {
      type: 'quiz',
      question: 'Best way to create genuine urgency without being pushy?',
      options: [
        '"We only have 2 spots left" (even if untrue)',
        '"Act now before it is too late"',
        '"Every month you wait on this costs you approximately $X in [specific consequence]"',
        '"This offer expires tonight"',
      ],
      correct: 2,
      explanation: "Calculate the real cost of delay in their specific terms. This is fact-based urgency that serves them — not pressure tactics.",
    },
    {
      type: 'fill',
      question: 'Complete the urgency principle:',
      before: 'Urgency is not manipulation — it is doing the prospect a',
      after: 'by helping them decide now.',
      answer: 'favor',
      hint: 'service / kindness / benefit',
      explanation: "Reframe urgency as an act of service. You are protecting them from the cost of delay.",
    },
  ],

  a12: [
    {
      type: 'learn',
      title: 'The Commitment Ladder',
      content: "Cialdini's consistency principle: once someone commits to something small they will behave consistently with that commitment. Every yes builds toward the final yes.",
      cards: [
        { h: 'Start with micro-commitments', p: "'That makes sense, right?' — small agreements stack up. Each one makes the final close feel natural.", q: '— Andy Elliott' },
        { h: 'Get them describing their problem', p: "When they articulate their own pain in their own words they have committed to the fact that the problem is real.", q: '— Chris Voss' },
        { h: 'Yes momentum', p: "Ask 5-7 questions you KNOW they will say yes to before the close. Build a rhythm of agreement.", q: '— Zig Ziglar' },
      ],
    },
    {
      type: 'quiz',
      question: 'Before you close, you want to build yes momentum. Best approach?',
      options: [
        'Ask the big closing question immediately',
        'Ask 5-6 small questions you know they agree with before the main close',
        'Tell them about your company history',
        'Offer a discount to make the close easier',
      ],
      correct: 1,
      explanation: "Yes momentum from Ziglar and Elliott. Small agreements stack up and make the final yes feel natural and consistent.",
    },
    {
      type: 'match',
      question: 'Match each commitment technique to its purpose:',
      pairs: [
        { left: 'Micro-commitments', right: 'Build yes momentum' },
        { left: 'They describe their pain', right: 'Commits them to the problem' },
        { left: 'Agreement questions', right: 'Creates consistency pattern' },
        { left: 'Assumptive language', right: 'Skips the yes/no decision' },
      ],
    },
  ],

  a13: [
    {
      type: 'learn',
      title: 'Fear is the #1 Closer Killer',
      content: "Andy Elliott says the number one reason salespeople fail has nothing to do with the prospect — it is the rep's own fear of rejection. Fear changes your tonality, your body language, and your close before you even open your mouth.",
      cards: [
        { h: 'Fear changes your tone', p: "When you fear rejection your voice goes up at the end of sentences. You sound uncertain. The prospect feels it immediately.", q: '— Andy Elliott' },
        { h: 'Rejection is data', p: "Every no tells you what to fix. Closers who close 70%+ have been rejected more than anyone — they learned more.", q: '— Grant Cardone' },
        { h: 'Confidence is a skill', p: "Cardone says confidence is not something you have — it is something you BUILD through reps. You train it like a muscle.", q: '— Grant Cardone' },
      ],
    },
    {
      type: 'quiz',
      question: 'You are about to close a big deal and you feel nervous. According to Cardone, what is the right move?',
      options: [
        'Wait until you feel confident to ask for the close',
        'Ask for the close anyway — confidence comes from doing, not waiting',
        'Offer a discount to reduce the pressure',
        'Build more rapport first',
      ],
      correct: 1,
      explanation: "Cardone says act confident before you feel confident. The action creates the feeling — not the other way around.",
    },
    {
      type: 'fill',
      question: 'Complete the Elliott fear principle:',
      before: 'The number one reason people do not close is their own',
      after: 'of rejection.',
      answer: 'fear',
      hint: 'worry / anxiety / dread',
      explanation: "Fear is the only thing standing between most reps and elite performance. Address it first.",
    },
  ],

  a14: [
    {
      type: 'learn',
      title: 'Assume the Sale — Always',
      content: "The assumptive close is the foundation of elite selling. You never ask IF they want to buy. You speak and act as though the decision has already been made — because in your mind, it has.",
      cards: [
        { h: 'Language assumes the sale', p: "'When we get you started' not 'if you decide to move forward'. Every word you use should assume yes.", q: '— Andy Elliott' },
        { h: 'Actions assume the sale', p: "Start filling out the paperwork. Pull up the calendar. Act as if — and they follow your lead.", q: '— Grant Cardone' },
        { h: 'Questions assume the sale', p: "'Do you want to start Monday or Wednesday?' not 'Do you want to start?' The choice is WHICH — not WHETHER.", q: '— Jordan Belfort' },
      ],
    },
    {
      type: 'match',
      question: 'Convert these weak closes to assumptive closes:',
      pairs: [
        { left: 'Would you like to move forward?', right: 'When we get you started...' },
        { left: 'Do you want to sign up?', right: 'Which package works for you?' },
        { left: 'Are you interested?', right: 'The only question is timing' },
        { left: 'Should we do this?', right: 'Let me get your details down' },
      ],
    },
    {
      type: 'quiz',
      question: 'You want to use an alternative choice close. Which is best?',
      options: [
        '"Do you want to buy this?"',
        '"Are you interested in moving forward?"',
        '"Do you want to start this Friday or would Monday work better for you?"',
        '"What do you think?"',
      ],
      correct: 2,
      explanation: "The alternative choice close by Belfort and Elliott. Both options are yes — you are choosing WHICH, not WHETHER.",
    },
  ],

  a15: [
    {
      type: 'learn',
      title: 'Body Language in Sales',
      content: "55% of communication is body language. Before you say a single word your posture, eye contact, and presence are already either building or destroying trust.",
      cards: [
        { h: 'Power posture', p: "Stand or sit with your spine straight, shoulders back. This projects confidence AND changes your own internal state.", q: '— Tony Robbins' },
        { h: 'Eye contact closes deals', p: "Hold eye contact when you make a key claim or close. Looking away in that moment telegraphs doubt.", q: '— Andy Elliott' },
        { h: 'Lean in for emphasis', p: "A slight forward lean when making an important point shows engagement and conviction. Pull back to let points land.", q: '— Chris Voss' },
      ],
    },
    {
      type: 'quiz',
      question: 'You are delivering your close. Where should your eyes be?',
      options: [
        'Looking down at your materials',
        'Looking around the room naturally',
        'Holding steady confident eye contact with the prospect',
        'Looking to the side thoughtfully',
      ],
      correct: 2,
      explanation: "Andy Elliott: eye contact during the close communicates absolute certainty. Looking away reads as doubt.",
    },
    {
      type: 'fill',
      question: 'Complete the body language principle:',
      before: '55% of communication is',
      after: '— before you say a word you are already being read.',
      answer: 'body language',
      hint: 'non-verbal / physical / posture',
      explanation: "Mehrabian's research: 55% body language, 38% tonality, 7% words. Most reps only train the 7%.",
    },
  ],

  a16: [
    {
      type: 'learn',
      title: 'The Elite Closer Mindset',
      content: "Every closer on this list built their wealth on one belief: selling is the highest paid profession in the world IF you treat it like a profession. Not a job. A craft. Something you obsessively perfect.",
      cards: [
        { h: 'Obsession is the requirement', p: "'Be obsessed or be average.' There is no middle ground at the top. — Grant Cardone", q: '— Grant Cardone' },
        { h: 'Daily training is non-negotiable', p: "'If you are not training every day, someone else is and they are coming for your customers.' — Andy Elliott", q: '— Andy Elliott' },
        { h: 'Every no is tuition', p: "Rejection is the price of admission to elite performance. The more nos you collect, the better you get.", q: '— Jordan Belfort' },
        { h: 'You are the product', p: "Before the prospect buys your product they buy YOU. Invest in yourself first.", q: '— Alex Hormozi' },
      ],
    },
    {
      type: 'quiz',
      question: 'Grant Cardone says the difference between average and elite is:',
      options: [
        'Natural talent and charisma',
        'Having the right product',
        'Obsession — treating sales as your craft not your job',
        'Being in the right market',
      ],
      correct: 2,
      explanation: "Cardone: Be obsessed or be average. Obsession with craft is the only separator at the top level.",
    },
    {
      type: 'quiz',
      question: 'According to Andy Elliott, what separates the top 1% of closers?',
      options: [
        'Better scripts',
        'Higher quality leads',
        'Daily training — treating every day as practice for the real thing',
        'Naturally high confidence',
      ],
      correct: 2,
      explanation: "Elliott built his entire brand on this: daily training is what separates closers. Scripts fail without reps.",
    },
    {
      type: 'fill',
      question: 'Complete the Hormozi investment principle:',
      before: 'Before the prospect buys your product they buy',
      after: '— invest in yourself first.',
      answer: 'you',
      hint: 'yourself / the rep / the closer',
      explanation: "You are the product. Personal development is not optional at elite level — it is the job.",
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

export const PROSPECT_NAMES = {
  male: [
    ['James Mitchell', 'JM'],
    ['Robert Chen', 'RC'],
    ['David Thompson', 'DT'],
    ['Marcus Wright', 'MW'],
    ['Carlos Rivera', 'CR'],
    ['Tyler Brooks', 'TB'],
    ['Kevin Hayes', 'KH'],
    ['Brian Foster', 'BF'],
  ],
  female: [
    ['Sarah Patterson', 'SP'],
    ['Maria Gonzalez', 'MG'],
    ['Karen Williams', 'KW'],
    ['Aisha Johnson', 'AJ'],
    ['Priya Patel', 'PP'],
    ['Jessica Moore', 'JM'],
    ['Rachel Torres', 'RT'],
    ['Amanda Chen', 'AC'],
  ],
}

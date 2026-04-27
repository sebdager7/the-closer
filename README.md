# The Closer — Elite Sales Intelligence Platform

> AI-powered sales coaching app built with React + Vite + TailwindCSS, featuring Blitz the panther mascot, live AI training calls, Sonic-style psychology zone map, pitch maker, objection handler, agency growth program, and team chat.

---

## 🚀 Quick Start (Local Dev)

### Prerequisites
- Node.js 18+ (check: `node -v`)
- npm 9+ (check: `npm -v`)

### 1. Install dependencies
```bash
cd the-closer
npm install
```

### 2. Start dev server
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

---

## 🔑 Anthropic API Key

The app calls the Claude API directly from the browser. You need to add your API key.

### Option A — Environment Variable (recommended for dev)
Create a `.env` file in the project root:
```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Then update `src/utils/api.js` — add this header to all fetch calls:
```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true',
}
```

### Option B — Cloudflare Worker Proxy (recommended for production)
Create a Cloudflare Worker that forwards requests to the Anthropic API and injects the API key server-side. This keeps your key secret.

---

## 🏗️ Build for Production
```bash
npm run build
```
Output goes to `dist/`. The `public/_redirects` file handles SPA routing on Cloudflare Pages.

---

## ☁️ Deploy to Cloudflare Pages

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — The Closer v1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/the-closer.git
git push -u origin main
```

### Step 2 — Connect to Cloudflare Pages
1. Log in to https://dash.cloudflare.com
2. Go to **Workers & Pages** → **Create Application** → **Pages**
3. Click **Connect to Git** → authorize GitHub → select your repo
4. Configure build settings:
   - **Framework preset**: None
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Add environment variable: `VITE_ANTHROPIC_API_KEY` = your key
6. Click **Save and Deploy**

### Step 3 — Auto-deploy on push
Every `git push` to `main` triggers a new deploy automatically.

---

## 📁 Project Structure

```
the-closer/
├── public/
│   ├── _redirects          # Cloudflare SPA routing
│   ├── favicon.svg
│   └── manifest.json       # PWA manifest
├── src/
│   ├── App.jsx             # Main router + AppRouter
│   ├── main.jsx            # React entry point
│   ├── index.css           # Global styles + Tailwind
│   ├── context/
│   │   └── AppContext.jsx  # Global state (React Context + localStorage)
│   ├── data/
│   │   └── constants.js    # All zones, quotes, lessons, chat data, plans
│   ├── utils/
│   │   └── api.js          # Anthropic API calls (rebuttal, pitch, training, autopsy)
│   ├── components/
│   │   └── layout/
│   │       ├── BlitzIcon.jsx    # Blitz mascot SVG
│   │       ├── BlitzBar.jsx     # Blitz message bubble
│   │       ├── TopBar.jsx       # Header with logo + controls
│   │       └── BottomNav.jsx    # Mobile tab navigation
│   └── screens/
│       ├── LoginScreen.jsx       # Auth + plan selection + billing + tutorial
│       ├── ObjectionsScreen.jsx  # Objection handler (3 styles)
│       ├── PitchScreen.jsx       # Pitch builder + rebuilder
│       ├── PsychologyScreen.jsx  # Sonic zone map + lesson engine
│       ├── TrainingScreen.jsx    # AI training calls (4 modes) + Deal Autopsy
│       ├── ProgressScreen.jsx    # Performance metrics + session stats
│       ├── BrainScreen.jsx       # Custom brain upload
│       ├── AgencyScreen.jsx      # Agency Growth Program + partner dashboard
│       ├── TeamChatScreen.jsx    # Team chat with channels + deal board
│       └── PlansScreen.jsx       # Pricing plans
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

---

## 🎮 Features

### 💬 Objections Tab
- Industry selector (D2D, Insurance, Solar, B2B, etc.)
- Type any objection → get 3 rebuttals:
  - Andy Elliott soft close
  - Jordan Belfort direct
  - Grant Cardone aggressive
- Custom brain injection (uses your offer + ICP)
- 14 language support

### ✍️ Pitch Maker
- Build from scratch using real frameworks:
  - Andy Elliott 10-Step
  - Belfort Straight Line
  - Cardone Tonality
  - Ziglar Story-Close
  - Hormozi Value Stack
- Rebuild/improve your existing pitch
- Scores: Hook, Confidence, Close Power (0–100)
- Copy + Redo buttons

### 🎮 Psychology (Sonic Zone Map)
- 4 dark pixel-art zones: Green Hill, Lava Valley, Storm Cloud, Final Boss
- Blitz mascot bounces on the active act
- Real elite closer quotes on every act panel
- Lesson engine: Learn → Quiz → Fill-in → Match
- XP, rings, lives, streak HUD

### 🤖 AI Training
- **Standard**: Real AI prospect + tone detection
- **Brutal Coach**: Blitz calls out weak words every 3 messages
- **One Shot Close**: 90-second countdown, one chance
- **Instant Reframe**: Objection detection → Blitz popup with 3 reframes
- Tone bar (color-coded close probability %)
- Deal Autopsy after every call:
  - Score + revenue impact
  - Key moments with timestamps
  - Elite version of weak lines
  - Biggest mistake + top strength

### 📈 Progress
- Animated performance bars
- Session stats: calls, closes, revenue, streak
- XP progress + gems + streak

### 🧠 My Brain
- Upload offer, ICP, top objections
- Injected into all AI calls automatically

### 🏢 Agency Growth Program
- 3 tiers: 20% (1-9), 30% (10-49), 40% forever (50+)
- Pricing: Pro $17.99 / Elite $49.99
- Partner code dashboard with earnings
- Apply form (blocks non-Elite)
- Team table with close % bars

### 💬 Team Chat
- Channels: #general, #announcements, #deal-board, Team Alpha, Team Bravo, #training-tips, DMs
- Role badges: Owner / Upline / Rep
- Deal posting form (auto-posts to deal board)
- Announcement form (pinned, gold banner)
- Emoji reactions with click to react
- @ mentions

### 📋 Plans
- Free ($0), Pro ($17.99), Elite ($49.99)
- Plan switching from UI

---

## 🤖 Using Claude Code

Once you've opened this folder in VS Code with Claude Code:

```
claude
```

Example prompts for Claude Code:
- "Add a leaderboard to the Team Chat screen showing top closers this week"
- "Make the psychology zones unlockable based on completing previous zones"
- "Add a settings screen with notification preferences"
- "Create a voice mode for training calls using the Web Speech API"
- "Add persistence for chat messages using localStorage"

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| React Router v6 | SPA routing |
| TailwindCSS v3 | Utility-first styling |
| Vite | Build tool + dev server |
| Framer Motion | Animations (optional) |
| Lucide React | Icons (optional) |
| Anthropic API | All AI features |
| Cloudflare Pages | Hosting |

---

## 📝 License
Private — all rights reserved.
# the-closer
# the-closer
# the-closer
# the-closer
# the-closer

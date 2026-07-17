# CricIQ 🏏

**CricIQ** is an advanced, conversational sports intelligence and analytical simulation platform designed for cricket enthusiasts, analysts, and fans. Focused on both the **Indian Premier League (IPL)** and **International Cricket**, CricIQ brings together deep player profile statistics, live-match simulations, interactive win-probability engines, predictive AI tooling, and global news/standings in a unified, premium, dark-themed dashboard.

---

## 🎨 Visual Identity & Theme

CricIQ is designed with a **highly-immersive Slate and Cosmic Emerald visual theme**:
- **Backgrounds**: Deep, cohesive off-blacks and textured slates (`bg-slate-950`, `bg-slate-900/40`) that minimize eye strain during long analytical sessions.
- **Accents**: Neon Emerald (`text-emerald-400`, `bg-emerald-500`) and Bright Teal highlight key metrics, active tab states, and positive performance rates.
- **Typography**: Paired display typography with spacious paddings, clean card layouts, and subtle borders (`border-slate-800`) to create a high-contrast, modern "bento-grid" interface.

---

## 🧠 Core Interactive Features

CricIQ is composed of multiple dedicated high-fidelity workspaces, each serving a specific analytical dimension:

### 1. 📊 Interactive Stats Dashboard
- **Dynamic Heatmaps**: View structured charts of run distribution by side (Off-side, Leg-side, Straight) for different batting and bowling archetypes.
- **Key Performance Indicators (KPIs)**: High-level cards tracking average strike rates, run rates, economy levels, and boundary rates across teams.
- **Detailed Player Scatter Plots**: Track career performance metrics side-by-side using custom interactive charts.

### 2. ⚡ Live Match Center & Match Simulator
- **Live Ball-by-Ball Simulator**: Start a real-time match simulation between IPL franchises or international teams. Watch deliveries, run scoring, and wickets fall dynamically.
- **Real-Time Win Probability Engine**: Interactive charts showing changing win probabilities ball-by-ball, mimicking state-of-the-art sports telemetry models.
- **Interactive Scorecards & Wagon Wheels**: Drill down into live partnerships, individual strike rates, and custom pitching lengths.

### 3. 🔮 AI-Powered Prediction Engine
- **Pre-Match Simulation**: Input specific matchups (e.g., Bowler vs. Batsman, Pitch Condition, Weather, Target score) and let CricIQ's custom simulation logic project outcomes.
- **Matchup Strengths and Weaknesses**: Evaluates specific batsman weaknesses (e.g., *extreme pace over 145km/h bouncers* or *early lateral swing*) against specialized bowler strong points.

### 4. 👤 Interactive Player Profiles
- **Multi-Format Career Statistics**: Explore comprehensive stats for test, ODI, and T20 categories dynamically.
- **Interactive Radar Chart**: Compare batting averages, strike rates, catching success rates, dot-ball percentages, and current form indexes visually.
- **Detailed Match Logs & Bio Card**: Read player-specific play styles, strong point areas, and historical match logs.

### 5. 🏆 ICC Standings & News Center
- **Live ICC Team Rankings**: Stay up to date with official Test, ODI, and T20 international standings.
- **Curated Cricket News Feed**: Read mock real-time updates and tactical articles detailing active squad injuries, match previews, and tournament updates.

### 6. 🗳️ Interactive Fan Polls & Community Hub
- **Dynamic Fan Polls**: Express opinion on upcoming matches, player of the tournament votes, and tactical debates with real-time feedback meters.
- **Custom Notifications**: Real-time alerts system to keep track of simulation events, score landmarks, and trending cricket debates.

---

## 🛠️ Technology Stack & Architecture

The application is built using modern front-end standards:
- **Framework**: React 18+ paired with TypeScript for rigorous type-safety.
- **Build System**: Vite (configured for fast, optimized, HMR-disabled development environments).
- **Styling**: Tailwind CSS for highly-responsive, clean layout structures.
- **Icons**: Icons are imported strictly from `lucide-react` to ensure visual consistency.
- **Animations**: Fluid layouts, tab switches, and simulation state transitions powered by `motion` (`motion/react`).
- **Data Visualization**: Custom interactive charts, radar graphs, and win probability timelines rendered via standard dashboard UI practices.

---

## 🗃️ Codebase Structure

```bash
├── package.json          # Dependency and script manager
├── metadata.json          # App name, description, and permissions configuration
├── src/
│   ├── main.tsx          # Main React application mount point
│   ├── App.tsx           # Layout, sidebar, workspace routing, and root state manager
│   ├── types.ts          # Shared TypeScript contracts, interfaces, and enums
│   ├── index.css         # Global style sheet integrating Tailwind CSS imports and fonts
│   ├── components/       # Reusable, self-contained interactive views
│   │   ├── MyDashboard.tsx          # Primary user landing and analytics overview
│   │   ├── StatsDashboard.tsx       # Team/Player performance KPIs and stats graphs
│   │   ├── LiveMatchCenter.tsx      # Real-time simulation and ball-by-ball tracker
│   │   ├── AIPredictor.tsx          # Matchup simulation and analytics projections
│   │   ├── PlayerProfiles.tsx       # Stats breakdown and interactive radar analysis
│   │   ├── ICCStandingsAndNews.tsx  # Rankings table and news cards
│   │   ├── FanPoll.tsx              # Dynamic community polls
│   │   └── NotificationCenter.tsx   # Inline notification center
│   └── data/
│       └── cricketData.ts           # Predefined team squads, player metrics, and format histories
```

---

## 🚀 How to Run the Project Locally

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

3. **Build the Application**:
   ```bash
   npm run build
   ```
   This generates compiled, production-ready static files inside the `dist/` folder.

4. **Lint the Codebase**:
   ```bash
   npm run lint
   ```
   Runs ESLint and TypeScript compilation checks to ensure everything builds successfully without type errors.

export const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    title: "Habit Tracker",
    status: "ABANDONED",
    startedDate: "2026-02-10",
    stalledDate: "2026-03-04",
    wantedToBuild: "A gamified daily habit tracker with social leaderboards, AI coaching, and custom streak reminders.",
    completedWork: "Built the core Streak Calendar heatmap UI and local habit check-in state.",
    unfinishedWork: "OAuth backend, real-time friend leaderboards, push notification worker.",
    failureReasons: ["Scope too large", "Deadlines & time crunch"],
    story: "Started with huge energy during semester break. Kept adding social features until the backend complexity crushed momentum.",
    effortRemaining: 4,
    interestLevel: 2,
    revivalPath: "Repurpose",
    dnaParts: [
      { id: "dna-101", name: "Streak calendar", type: "UI", description: "Interactive GitHub-style daily consistency grid component." },
      { id: "dna-102", name: "Local streak calculator", type: "Code", description: "Zero-dependency date diffing helper function." }
    ]
  },
  {
    id: "proj-2",
    title: "Flashcard App",
    status: "ABANDONED",
    startedDate: "2026-05-14",
    stalledDate: "2026-05-29",
    wantedToBuild: "Spaced-repetition study platform with PDF-to-deck generation.",
    completedWork: "3D CSS Flip-card review interface and keyboard shortcut navigation (Space/1/2/3).",
    unfinishedWork: "PDF parsing pipeline, user accounts, cloud deck marketplace.",
    failureReasons: ["No clear MVP", "Technical blocker"],
    story: "Built a super smooth card flipping UI on day one, then got stuck trying to parse messy college PDFs on the client side.",
    effortRemaining: 4,
    interestLevel: 3,
    revivalPath: "Change",
    dnaParts: [
      { id: "dna-201", name: "Flip-card review", type: "UI", description: "3D hardware-accelerated card flip component with hotkey bindings." },
      { id: "dna-202", name: "SM-2 Interval Logic", type: "Idea", description: "Simplified spaced-repetition scheduling algorithm." }
    ]
  },
  {
    id: "proj-3",
    title: "Notes Platform",
    status: "ABANDONED",
    startedDate: "2026-08-01",
    stalledDate: "2026-08-19",
    wantedToBuild: "Full collaborative markdown workspace for engineering students.",
    completedWork: "Instant fuzzy search bar and multi-tag filter system.",
    unfinishedWork: "Real-time CRDT multiplayer sync, LaTeX block renderer, folder permissions.",
    failureReasons: ["Scope too large", "No clear MVP"],
    story: "Tried to clone Notion in a weekend. The search and tagging system worked great, but multiplayer sync broke everything.",
    effortRemaining: 5,
    interestLevel: 2,
    revivalPath: "Repurpose",
    dnaParts: [
      { id: "dna-301", name: "Search + tags", type: "Code", description: "Fast client-side tag filtering and instant keyword highlight hook." }
    ]
  }
];

export const INITIAL_RECOMBINATIONS = [
  {
    id: "recomb-1",
    title: "Daily Study Notebook",
    description: "3 dead projects → 1 realistic MVP. Uses the Streak Calendar for daily study consistency, Flip-card review for active recall, and Search + tags for quick lecture notes.",
    createdAt: "2026-10-20",
    parts: [
      { id: "dna-101", name: "Streak calendar", sourceProject: "Habit Tracker", type: "UI" },
      { id: "dna-201", name: "Flip-card review", sourceProject: "Flashcard App", type: "UI" },
      { id: "dna-301", name: "Search + tags", sourceProject: "Notes Platform", type: "Code" }
    ]
  }
];

export const FAILURE_OPTIONS = [
  "Scope too large",
  "No clear MVP",
  "Deadlines & time crunch",
  "Technical blocker",
  "Lost interest / Shiny object",
  "Solo burnout"
];

export const PATH_BADGES = {
  Restart: { color: "bg-blue-500/15 text-blue-300 border-blue-500/30", desc: "Start fresh with a strict, smaller scope." },
  Continue: { color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", desc: "Pick up where you left off and ship it." },
  Change: { color: "bg-amber-500/15 text-amber-300 border-amber-500/30", desc: "Pivot the core direction around what worked." },
  Repurpose: { color: "bg-purple-500/15 text-purple-300 border-purple-500/30", desc: "Extract the surviving DNA parts for new builds." },
  Archive: { color: "bg-slate-500/15 text-slate-300 border-slate-500/30", desc: "Keep as a respectful record and lesson learned." }
};
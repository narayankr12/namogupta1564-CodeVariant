# RE:CODE

### Project Autopsy & DNA Recombination

> **Your abandoned projects are not failures. They are evidence.**

**RE:CODE** is a reflection-first frontend experience for people who have unfinished projects sitting in old folders, abandoned repositories, or forgotten notes. It helps users understand why a project stalled, identify what still has value, and decide what should happen next.

---

## Problem Statement

**PS-05 — The Project Graveyard**

Most unfinished projects are not completely useless. They often contain a good idea, a working interface, reusable code, or valuable research. RE:CODE turns that unfinished work into insight and gives it a possible second life.

RE:CODE is **not** another project-management or task-management tool. It is a space for reflection, recovery, and creative reuse.

## How It Works

1. **Capture** an unfinished project and its history.
2. **Tell the story** of what was built and what remained unfinished.
3. **Run an autopsy** to identify the reasons it stalled.
4. **Extract surviving DNA** such as UI components, code, ideas, and research.
5. **Choose a revival path**: Restart, Continue, Change, Repurpose, or Archive.
6. **Recombine useful parts** from multiple projects into a smaller, realistic MVP.

## Core Features

- **Project Graveyard** — Browse unfinished projects in a focused archive.
- **Lifecycle Timeline** — See when a project started, what was completed, and where it stalled.
- **Guided Project Autopsy** — Use short, reflective prompts instead of a long administrative form.
- **Deterministic Revival Rule Engine** — Generate a recommendation from effort, excitement, failure causes, and reusable parts.
- **Project DNA Extraction** — Record valuable UI, code, ideas, and research from an unfinished project.
- **DNA Recombination Lab** — Combine parts from multiple projects to create a focused new MVP.
- **Failure Patterns** — See recurring reasons behind stalled projects and turn them into future guardrails.
- **Seeded Demo Data** — The app opens with example projects so the main experience is immediately testable.

## Canvas Protocol

The mid-hackathon Variant Factor introduces a drag-and-drop interaction model for primary actions. Data cards are dragged into clearly labelled Action Zones instead of using standard submit/save controls.

- Drag a project card to **Inspect**.
- Drag **New Autopsy** to **Start Autopsy**.
- Drag a DNA card to **Stage DNA**.
- Drag **Commit Autopsy** to **Commit Record**.
- Drag **Synthesize MVP** to **Synthesize**.
- Drag **Failure Patterns** to **View Patterns**.

The original product purpose remains unchanged: RE:CODE still helps users understand, recover, and recombine unfinished work.

## Revival Paths

The rule engine recommends one of five paths:

| Path | Meaning |
| --- | --- |
| **Continue** | The idea still has energy and is close to completion. |
| **Restart** | Begin again with a smaller scope or a cleaner technical direction. |
| **Change** | Adjust the direction because the original MVP was unclear. |
| **Repurpose** | Reuse the strongest surviving parts in a new project. |
| **Archive** | Preserve the learning and close the project intentionally. |

## Tech Stack

- **Frontend:** React 18
- **Build tool:** Vite
- **Styling:** Tailwind CSS via CDN and custom CSS
- **Icons:** Lucide React
- **State:** React state and derived views
- **Persistence:** Browser `localStorage`
- **Deployment:** Static hosting such as Vercel or Netlify
- **Backend:** None required
- **External APIs:** None required

## Project Structure

```text
Recode/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── data/
    │   └── seedData.js
    └── utils/
        └── ruleEngine.js
```

## Run Locally

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite in your terminal.

## Production Build

```bash
npm run build
npm run preview
```

The production files are generated in the `dist/` folder.

## Demo Flow

For a quick demonstration:

1. Open the **Project Graveyard** dashboard.
2. Drag a seeded project card into the **Inspect** Action Zone to inspect its timeline and revival path.
3. Drag **New Autopsy** into the **Start Autopsy** Action Zone and complete the guided flow.
4. Review the deterministic recommendation.
5. Drag a new DNA card into **Stage New DNA** and then drag **Commit Autopsy** into **Commit Record**.
6. Open **DNA Recombination** and drag reusable parts into **Stage DNA**.
7. Enter a new focused MVP title, then drag **Synthesize MVP** into **Synthesize**.
8. Drag **Failure Patterns** into **View Patterns** to review recurring project risks.

## Reviewer Quick Check

Anyone can verify the complete workflow with this short example:

### Example project: FocusFlow

In **Project Autopsy**, enter:

| Field | Example value |
| --- | --- |
| Project title | `FocusFlow` |
| What I wanted to build | `A focused work timer with daily progress tracking.` |
| Completed work | `Timer screen and basic session state.` |
| Unfinished work | `Analytics, reminders, and account sync.` |
| Story | `The scope expanded before a small MVP was shipped.` |
| Failure reasons | `Scope too large` and `No clear MVP` |
| Remaining effort | `3/5` |
| Current motivation | `3/5` |

Then:

1. Add a DNA module named `Focus Session Timer`.
2. Drag the draft DNA card to **Stage New DNA**.
3. Continue to the verdict and confirm the recommended path is **Change**.
4. Drag **Commit Autopsy** to **Commit Record**.
5. In **DNA Recombination**, stage at least two DNA cards.
6. Use the title `FocusFlow Lite` and the description `A small timer with streak tracking.`
7. Drag **Synthesize MVP** to **Synthesize**.
8. Confirm that a new synthesized blueprint appears under **Synthesized MVPs**.

This check verifies the archive, autopsy, deterministic rule engine, DNA extraction, persistence, and recombination workflow without requiring an account or external API.

## Data and Privacy

RE:CODE runs in the browser. Project data is stored locally using `localStorage`; no backend or external API is required for the core experience.

Use **Reset Demo Data** inside the app to restore the original seeded examples.

## License

This project was created for the Code Variant — Build 01 frontend building contest.

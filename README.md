# RE:CODE

### Project Autopsy & DNA Recombination

> **Your abandoned projects are not failures. They are evidence.**

**RE:CODE** is a reflection-first frontend experience for people who have unfinished projects sitting in old folders, abandoned repositories, or forgotten notes. It helps users understand why a project stalled, identify what still has value, and decide what should happen next.

Built by **Team namogupta1564** · Narula Institute of Technology

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
2. Select a seeded project to inspect its timeline and revival path.
3. Open **Run Autopsy** and complete the guided flow.
4. Review the deterministic recommendation.
5. Open **DNA Recombination** and select reusable parts from multiple projects.
6. Create a new focused MVP.
7. Open **Failure Patterns** to review recurring project risks.

## Data and Privacy

RE:CODE runs in the browser. Project data is stored locally using `localStorage`; no backend or external API is required for the core experience.

Use **Reset Demo Data** inside the app to restore the original seeded examples.

## Team

**Team namogupta1564**  
Narula Institute of Technology

## License

This project was created for the Code Variant — Build 01 frontend building contest.

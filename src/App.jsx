import React, { useState, useEffect, useMemo } from "react";
import {
  FolderGit2,
  Stethoscope,
  Dna,
  Activity,
  Plus,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Sparkles,
  Calendar,
  AlertTriangle,
  Layers,
  Code2,
  Layout,
  Lightbulb,
  BookOpen
} from "lucide-react";
import {
  INITIAL_PROJECTS,
  INITIAL_RECOMBINATIONS,
  FAILURE_OPTIONS,
  PATH_BADGES
} from "./data/seedData";
import { calculateRecommendedPath } from "./utils/ruleEngine";

const TYPE_ICONS = {
  UI: Layout,
  Code: Code2,
  Idea: Lightbulb,
  Research: BookOpen
};

export default function App() {
  const [activeTab, setActiveTab] = useState("graveyard");
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("recode_projects_v1");
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [recombinations, setRecombinations] = useState(() => {
    const saved = localStorage.getItem("recode_recomb_v1");
    return saved ? JSON.parse(saved) : INITIAL_RECOMBINATIONS;
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterReason, setFilterReason] = useState("ALL");
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // DNA Recombination Builder State
  const [selectedDnaIds, setSelectedDnaIds] = useState(["dna-101", "dna-201", "dna-301"]);
  const [newSynthesisTitle, setNewSynthesisTitle] = useState("");
  const [newSynthesisDesc, setNewSynthesisDesc] = useState("");

  // Guided Autopsy Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [draft, setDraft] = useState({
    title: "",
    startedDate: "2026-09-01",
    stalledDate: "2026-10-01",
    wantedToBuild: "",
    completedWork: "",
    unfinishedWork: "",
    story: "",
    failureReasons: ["Scope too large"],
    effortRemaining: 3,
    interestLevel: 3,
    dnaInputName: "",
    dnaInputType: "UI",
    dnaInputDesc: "",
    dnaParts: [],
    revivalPath: ""
  });

  useEffect(() => {
    localStorage.setItem("recode_projects_v1", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("recode_recomb_v1", JSON.stringify(recombinations));
  }, [recombinations]);

  // Interactive Mouse Spotlight Tracker (Human-crafted detail)
  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--x", `${x}px`);
    e.currentTarget.style.setProperty("--y", `${y}px`);
  };

  // Derived Stats
  const allDnaParts = useMemo(() => {
    return projects.flatMap(p =>
      p.dnaParts.map(d => ({ ...d, sourceProject: p.title, projectId: p.id }))
    );
  }, [projects]);

  const failureStats = useMemo(() => {
    const counts = {};
    projects.forEach(p => {
      p.failureReasons.forEach(r => {
        counts[r] = (counts[r] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([reason, count]) => ({
        reason,
        count,
        pct: Math.round((count / Math.max(projects.length, 1)) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }, [projects]);

  const resetDemoData = () => {
    localStorage.removeItem("recode_projects_v1");
    localStorage.removeItem("recode_recomb_v1");
    setProjects(INITIAL_PROJECTS);
    setRecombinations(INITIAL_RECOMBINATIONS);
    setSelectedProject(null);
  };

  const handleAddDnaToDraft = () => {
    if (!draft.dnaInputName.trim()) return;
    setDraft(prev => ({
      ...prev,
      dnaParts: [
        ...prev.dnaParts,
        {
          id: "dna-" + Date.now(),
          name: prev.dnaInputName.trim(),
          type: prev.dnaInputType,
          description: prev.dnaInputDesc.trim() || "Reusable component salvaged during autopsy"
        }
      ],
      dnaInputName: "",
      dnaInputDesc: ""
    }));
  };

  const handleFinishAutopsy = () => {
    const recommended = calculateRecommendedPath(
      draft.interestLevel,
      draft.effortRemaining,
      draft.failureReasons,
      draft.dnaParts.length
    );
    const finalPath = draft.revivalPath || recommended;
    const newProj = {
      id: "proj-" + Date.now(),
      title: draft.title || "Untitled Workspace",
      status: finalPath === "Continue" ? "REVIVING" : "ABANDONED",
      startedDate: draft.startedDate,
      stalledDate: draft.stalledDate,
      wantedToBuild: draft.wantedToBuild || "Scoped side project experiment",
      completedWork: draft.completedWork || "Core UI layout and local state",
      unfinishedWork: draft.unfinishedWork || "Backend integration and edge cases",
      failureReasons: draft.failureReasons.length ? draft.failureReasons : ["Scope too large"],
      story: draft.story || "Momentum slowed down when external priorities took over.",
      effortRemaining: draft.effortRemaining,
      interestLevel: draft.interestLevel,
      revivalPath: finalPath,
      dnaParts: draft.dnaParts.length
        ? draft.dnaParts
        : [{ id: "dna-" + Date.now(), name: "Core Layout Shell", type: "UI", description: "Responsive starter view" }]
    };
    setProjects([newProj, ...projects]);
    setWizardStep(1);
    setDraft({
      title: "",
      startedDate: "2026-09-01",
      stalledDate: "2026-10-01",
      wantedToBuild: "",
      completedWork: "",
      unfinishedWork: "",
      story: "",
      failureReasons: ["Scope too large"],
      effortRemaining: 3,
      interestLevel: 3,
      dnaInputName: "",
      dnaInputType: "UI",
      dnaInputDesc: "",
      dnaParts: [],
      revivalPath: ""
    });
    setActiveTab("graveyard");
  };

  const toggleDnaSelection = (id) => {
    setSelectedDnaIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCreateRecombination = (e) => {
    e.preventDefault();
    if (!newSynthesisTitle.trim() || selectedDnaIds.length < 2) return;
    setIsSynthesizing(true);
    setTimeout(() => {
      const chosenParts = allDnaParts.filter(d => selectedDnaIds.includes(d.id));
      const newRecomb = {
        id: "recomb-" + Date.now(),
        title: newSynthesisTitle.trim(),
        description:
          newSynthesisDesc.trim() ||
          `Synthesized from ${chosenParts.length} battle-tested modules to ship without backend bloat.`,
        createdAt: new Date().toISOString().slice(0, 10),
        parts: chosenParts
      };
      setRecombinations([newRecomb, ...recombinations]);
      setNewSynthesisTitle("");
      setNewSynthesisDesc("");
      setIsSynthesizing(false);
    }, 450);
  };

  const filteredProjects = useMemo(() => {
    if (filterReason === "ALL") return projects;
    return projects.filter(p => p.failureReasons.includes(filterReason));
  }, [projects, filterReason]);

  const navItems = [
    { id: "graveyard", label: "Graveyard Archive", icon: FolderGit2 },
    { id: "autopsy", label: "Project Autopsy", icon: Stethoscope },
    { id: "dna", label: "DNA Recombination", icon: Dna },
    { id: "patterns", label: "Failure Patterns", icon: Activity }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-dots">
      {/* Ambient Top Light */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[180px] bg-teal-500/10 blur-[120px] rounded-full z-0" />

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0b0c10]/85 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shadow-inner">
              <Dna className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
  <span className="font-bold tracking-tight text-white text-base">RE:CODE</span>
  <span className="text-[11px] mono text-teal-400/90 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded">
    Autopsy & DNA Lab
  </span>
</div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Your abandoned projects are not failures. They are evidence.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    active
                      ? "bg-zinc-100 text-zinc-950 shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-teal-600" : "text-zinc-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={resetDemoData}
            className="flex items-center gap-1.5 text-xs mono text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 px-3 py-1.5 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Seed</span>
          </button>
        </div>
      </header>

      {/* Telemetry Strip */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-7 pb-3 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onMouseMove={handleCardMouseMove}
            onClick={() => setActiveTab("graveyard")}
            className="spotlight-card cursor-pointer rounded-xl bg-zinc-900/50 border border-zinc-800/90 p-5 animate-fade-up"
          >
            <div className="flex items-center justify-between text-xs text-zinc-400 mono">
              <span>CATALOGED REPOS</span>
              <FolderGit2 className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2.5">
              <span className="text-3xl font-bold text-white mono">{projects.length}</span>
              <span className="text-xs text-zinc-400">unfinished builds analyzed</span>
            </div>
          </div>

          <div
            onMouseMove={handleCardMouseMove}
            onClick={() => setActiveTab("dna")}
            className="spotlight-card cursor-pointer rounded-xl bg-zinc-900/50 border border-zinc-800/90 p-5 animate-fade-up delay-1"
          >
            <div className="flex items-center justify-between text-xs text-teal-400 mono">
              <span>SURVIVING PROJECT DNA</span>
              <Dna className="w-4 h-4 text-teal-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2.5">
              <span className="text-3xl font-bold text-white mono">{allDnaParts.length}</span>
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                reusable modules extracted <ArrowRight className="w-3 h-3 text-teal-400" />
              </span>
            </div>
          </div>

          <div
            onMouseMove={handleCardMouseMove}
            onClick={() => setActiveTab("patterns")}
            className="spotlight-card cursor-pointer rounded-xl bg-zinc-900/50 border border-zinc-800/90 p-5 animate-fade-up delay-2"
          >
            <div className="flex items-center justify-between text-xs text-amber-400 mono">
              <span>PRIMARY BLINDSPOT</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2.5">
              <span className="text-lg font-bold text-white truncate">
                {failureStats[0]?.reason || "No pattern yet"}
              </span>
              <span className="text-xs text-zinc-400 mono">
                ({failureStats[0]?.pct || 0}% rate)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-5 flex-1 relative z-10">
        {/* TAB 1: GRAVEYARD ARCHIVE */}
        {activeTab === "graveyard" && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">Project Graveyard</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Inspect stalled repositories, review their lifecycle timeline, or harvest surviving components.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <select
                  value={filterReason}
                  onChange={e => setFilterReason(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-teal-500"
                >
                  <option value="ALL">All Stall Causes ({projects.length})</option>
                  {FAILURE_OPTIONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <button
                  onClick={() => setActiveTab("autopsy")}
                  className="flex items-center gap-1.5 bg-teal-400 hover:bg-teal-300 text-zinc-950 font-semibold text-xs px-3.5 py-2 rounded-lg transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>New Autopsy</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredProjects.map((project, idx) => {
                const badge = PATH_BADGES[project.revivalPath] || PATH_BADGES.Archive;
                return (
                  <div
                    key={project.id}
                    onMouseMove={handleCardMouseMove}
                    onClick={() => setSelectedProject(project)}
                    style={{ animationDelay: `${idx * 65}ms` }}
                    className="spotlight-card animate-fade-up cursor-pointer rounded-xl bg-zinc-900/60 border border-zinc-800/90 p-5 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                            <span className="text-[10px] mono uppercase tracking-wider text-zinc-400">
                              {project.status}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white mt-1.5 group-hover:text-teal-300">
                            {project.title}
                          </h3>
                        </div>
                        <span className={`text-[11px] mono px-2.5 py-0.5 rounded-md border ${badge.color}`}>
                          {project.revivalPath}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {project.wantedToBuild}
                      </p>

                      {/* Failure Tags */}
                      <div>
                        <div className="text-[10px] mono text-zinc-500 uppercase mb-1.5">Stall factors</div>
                        <div className="flex flex-wrap gap-1.5">
                          {project.failureReasons.map(reason => (
                            <span
                              key={reason}
                              className="inline-flex items-center gap-1 text-[11px] bg-zinc-800/70 border border-zinc-700/60 text-zinc-300 px-2 py-0.5 rounded"
                            >
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Surviving DNA */}
                      <div className="pt-3 border-t border-zinc-800/80">
                        <div className="text-[10px] mono text-teal-400 uppercase mb-2 flex items-center justify-between">
                          <span>Surviving DNA ({project.dnaParts.length})</span>
                          <span className="text-zinc-500">Inspect →</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {project.dnaParts.map(dna => {
                            const TypeIcon = TYPE_ICONS[dna.type] || Layers;
                            return (
                              <span
                                key={dna.id}
                                className="inline-flex items-center gap-1.5 text-xs bg-teal-500/10 border border-teal-500/25 text-teal-200 px-2.5 py-1 rounded-md"
                              >
                                <TypeIcon className="w-3 h-3 text-teal-400" />
                                {dna.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-zinc-800/50 flex items-center justify-between text-[11px] mono text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {project.startedDate}
                      </span>
                      <span>Stalled {project.stalledDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Project Dossier Modal */}
            {selectedProject && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
                  <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
                    <div>
                      <span className="text-[11px] mono uppercase text-teal-400">Autopsy Dossier</span>
                      <h3 className="text-xl font-bold text-white mt-0.5">{selectedProject.title}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="p-1.5 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Lifecycle Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      <div className="mono text-[10px] text-zinc-400 uppercase">01 · Initial Commit</div>
                      <div className="font-semibold text-white mt-1">{selectedProject.startedDate}</div>
                      <p className="text-zinc-400 mt-1.5 leading-relaxed">{selectedProject.wantedToBuild}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-zinc-950 border border-teal-500/25">
                      <div className="mono text-[10px] text-teal-400 uppercase">02 · What Survived</div>
                      <div className="font-semibold text-white mt-1">Completed Scope</div>
                      <p className="text-zinc-300 mt-1.5 leading-relaxed">{selectedProject.completedWork}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-zinc-950 border border-rose-500/25">
                      <div className="mono text-[10px] text-rose-400 uppercase">03 · Stall Point</div>
                      <div className="font-semibold text-white mt-1">{selectedProject.stalledDate}</div>
                      <p className="text-zinc-400 mt-1.5 leading-relaxed">{selectedProject.unfinishedWork}</p>
                    </div>
                  </div>

                  <div className="bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-xl space-y-1">
                    <div className="text-[10px] mono uppercase text-zinc-500">Developer Post-Mortem Note</div>
                    <p className="text-xs text-zinc-300 leading-relaxed">“{selectedProject.story}”</p>
                  </div>

                  {/* Revival Path Selector */}
                  <div className="space-y-2">
                    <div className="text-[11px] mono uppercase text-zinc-400">
                      Active Revival Decision: <span className="text-teal-400">{selectedProject.revivalPath}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {Object.keys(PATH_BADGES).map(path => (
                        <button
                          key={path}
                          onClick={() => {
                            const updated = projects.map(p =>
                              p.id === selectedProject.id ? { ...p, revivalPath: path } : p
                            );
                            setProjects(updated);
                            setSelectedProject({ ...selectedProject, revivalPath: path });
                          }}
                          className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${
                            selectedProject.revivalPath === path
                              ? "bg-teal-400 text-zinc-950 border-teal-300 font-semibold"
                              : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {path}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-zinc-400">{PATH_BADGES[selectedProject.revivalPath]?.desc}</p>
                  </div>

                  <div className="flex justify-end pt-3 border-t border-zinc-800">
                    <button
                      onClick={() => {
                        setSelectedProject(null);
                        setActiveTab("dna");
                      }}
                      className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs px-4 py-2 rounded-lg transition"
                    >
                      <span>Open Parts in DNA Recombination Lab</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GUIDED AUTOPSY WIZARD */}
        {activeTab === "autopsy" && (
          <div className="max-w-2xl mx-auto bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-up">
            {/* Step Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs mono text-zinc-400">
                <span>STEP 0{wizardStep} / 05</span>
                <span>Reflection first. Decision last.</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map(step => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      step <= wizardStep ? "bg-teal-400" : "bg-zinc-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div key={wizardStep} className="space-y-5 animate-slide-step">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white">Capture the Unfinished Project</h2>
                  <div>
                    <label className="block text-xs mono text-zinc-400 mb-1.5">Repository / Project Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Markdown Knowledge Graph"
                      value={draft.title}
                      onChange={e => setDraft({ ...draft, title: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-teal-400 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mono text-zinc-400 mb-1.5">Original Vision</label>
                    <textarea
                      rows="3"
                      placeholder="What were you hoping to build when you ran git init?"
                      value={draft.wantedToBuild}
                      onChange={e => setDraft({ ...draft, wantedToBuild: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-teal-400 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs mono text-zinc-400 mb-1.5">Started On</label>
                      <input
                        type="date"
                        value={draft.startedDate}
                        onChange={e => setDraft({ ...draft, startedDate: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs mono text-zinc-400 mb-1.5">Stalled On</label>
                      <input
                        type="date"
                        value={draft.stalledDate}
                        onChange={e => setDraft({ ...draft, stalledDate: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white">Separate What Worked from What Stalled</h2>
                  <div>
                    <label className="block text-xs mono text-teal-400 mb-1.5">Completed & Working</label>
                    <textarea
                      rows="2"
                      placeholder="Which views, scripts, or components actually worked?"
                      value={draft.completedWork}
                      onChange={e => setDraft({ ...draft, completedWork: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mono text-rose-400 mb-1.5">Unfinished Scope</label>
                    <textarea
                      rows="2"
                      placeholder="Where did complexity pile up?"
                      value={draft.unfinishedWork}
                      onChange={e => setDraft({ ...draft, unfinishedWork: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mono text-zinc-400 mb-1.5">Autopsy Notes</label>
                    <textarea
                      rows="2"
                      placeholder="Be honest: why did you stop opening the repo?"
                      value={draft.story}
                      onChange={e => setDraft({ ...draft, story: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-white">Diagnose Root Causes</h2>
                  <div className="grid grid-cols-2 gap-2.5">
                    {FAILURE_OPTIONS.map(reason => {
                      const active = draft.failureReasons.includes(reason);
                      return (
                        <button
                          type="button"
                          key={reason}
                          onClick={() => {
                            const exists = draft.failureReasons.includes(reason);
                            setDraft({
                              ...draft,
                              failureReasons: exists
                                ? draft.failureReasons.filter(r => r !== reason)
                                : [...draft.failureReasons, reason]
                            });
                          }}
                          className={`p-3 rounded-lg border text-left text-xs flex items-center justify-between transition ${
                            active
                              ? "bg-amber-500/15 border-amber-400/60 text-amber-200 font-medium"
                              : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          <span>{reason}</span>
                          {active && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      <label className="block text-xs mono text-zinc-400">
                        Remaining Effort: <span className="text-white font-semibold">{draft.effortRemaining}/5</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={draft.effortRemaining}
                        onChange={e => setDraft({ ...draft, effortRemaining: Number(e.target.value) })}
                        className="w-full mt-2 accent-teal-400"
                      />
                    </div>
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      <label className="block text-xs mono text-zinc-400">
                        Current Motivation: <span className="text-white font-semibold">{draft.interestLevel}/5</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={draft.interestLevel}
                        onChange={e => setDraft({ ...draft, interestLevel: Number(e.target.value) })}
                        className="w-full mt-2 accent-teal-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white">Extract Surviving Project DNA</h2>
                  <p className="text-xs text-zinc-400">
                    Log individual UI widgets, hooks, or algorithms worth salvaging for future builds.
                  </p>
                  <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    <input
                      type="text"
                      placeholder="Module name (e.g., Hotkey Command Bar)"
                      value={draft.dnaInputName}
                      onChange={e => setDraft({ ...draft, dnaInputName: e.target.value })}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <select
                      value={draft.dnaInputType}
                      onChange={e => setDraft({ ...draft, dnaInputType: e.target.value })}
                      className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300"
                    >
                      <option value="UI">UI Component</option>
                      <option value="Code">Code Logic</option>
                      <option value="Idea">Core Concept</option>
                      <option value="Research">Research</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddDnaToDraft}
                      className="bg-teal-400 text-zinc-950 font-semibold text-xs px-4 py-2 rounded-lg"
                    >
                      Add Part
                    </button>
                  </div>

                  <div className="space-y-2 pt-2">
                    {draft.dnaParts.length === 0 ? (
                      <div className="text-xs text-zinc-500 p-4 border border-dashed border-zinc-800 rounded-xl text-center">
                        No DNA modules added yet.
                      </div>
                    ) : (
                      draft.dnaParts.map(part => (
                        <div
                          key={part.id}
                          className="flex items-center justify-between bg-zinc-950 border border-zinc-800 px-3.5 py-2.5 rounded-lg text-xs"
                        >
                          <span className="text-teal-300 font-medium">
                            {part.name} <span className="mono text-[10px] text-zinc-500 ml-1">[{part.type}]</span>
                          </span>
                          <button
                            onClick={() =>
                              setDraft({ ...draft, dnaParts: draft.dnaParts.filter(p => p.id !== part.id) })
                            }
                            className="text-zinc-500 hover:text-rose-400"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white">Rule Engine Verdict</h2>
                  {(() => {
                    const rec = calculateRecommendedPath(
                      draft.interestLevel,
                      draft.effortRemaining,
                      draft.failureReasons,
                      draft.dnaParts.length
                    );
                    return (
                      <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 space-y-1.5">
                        <div className="text-[11px] mono uppercase text-teal-400">Calculated Revival Path</div>
                        <div className="text-lg font-bold text-white">{rec}</div>
                        <p className="text-xs text-zinc-300">{PATH_BADGES[rec]?.desc}</p>
                      </div>
                    );
                  })()}

                  <div>
                    <label className="block text-xs mono text-zinc-400 mb-2">Override Decision (Optional)</label>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.keys(PATH_BADGES).map(path => (
                        <button
                          key={path}
                          type="button"
                          onClick={() => setDraft({ ...draft, revivalPath: path })}
                          className={`py-2 px-2.5 rounded-lg border text-xs font-medium ${
                            draft.revivalPath === path
                              ? "bg-zinc-100 text-zinc-950 font-semibold border-white"
                              : "bg-zinc-950 border-zinc-800 text-zinc-400"
                          }`}
                        >
                          {path}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(s => s - 1)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs bg-zinc-800/70 text-zinc-300 disabled:opacity-30"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              {wizardStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(s => s + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs bg-zinc-100 text-zinc-950 font-semibold"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishAutopsy}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs bg-teal-400 text-zinc-950 font-bold"
                >
                  <Check className="w-4 h-4" /> Commit Autopsy Record
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DNA RECOMBINATION LAB */}
        {activeTab === "dna" && (
          <div className="space-y-8 animate-fade-up">
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] mono uppercase text-teal-400">Component Synthesis</span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  DNA Recombination Lab
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Combine proven fragments from separate dead repositories into a single realistic weekend build.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs mono bg-zinc-950 border border-zinc-800 px-3.5 py-2 rounded-xl">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>{selectedDnaIds.length} DNA modules staged</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Pool */}
              <div className="lg:col-span-7 space-y-3">
                <div className="text-xs mono uppercase text-zinc-400">
                  1. Select Surviving Parts Across Projects
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allDnaParts.map(dna => {
                    const isSelected = selectedDnaIds.includes(dna.id);
                    const TypeIcon = TYPE_ICONS[dna.type] || Layers;
                    return (
                      <div
                        key={dna.id}
                        onMouseMove={handleCardMouseMove}
                        onClick={() => toggleDnaSelection(dna.id)}
                        className={`spotlight-card cursor-pointer p-4 rounded-xl border transition ${
                          isSelected
                            ? "bg-teal-500/10 border-teal-400/60"
                            : "bg-zinc-900/50 border-zinc-800/90"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                            {dna.sourceProject}
                          </span>
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isSelected
                                ? "bg-teal-400 border-teal-400 text-zinc-950"
                                : "border-zinc-700"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-white mt-2.5">
                          <TypeIcon className="w-4 h-4 text-teal-400" />
                          <span>{dna.name}</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{dna.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Synthesis Form */}
              <div className="lg:col-span-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4 h-fit">
                <div className="text-xs mono uppercase text-teal-400">2. Synthesize New MVP</div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 min-h-[60px] flex flex-wrap items-center gap-2">
                  {selectedDnaIds.length === 0 ? (
                    <span className="text-xs text-zinc-500">Select at least 2 modules on the left...</span>
                  ) : (
                    allDnaParts
                      .filter(d => selectedDnaIds.includes(d.id))
                      .map((part, idx, arr) => (
                        <React.Fragment key={part.id}>
                          <span className="text-xs bg-zinc-900 text-teal-300 border border-teal-500/30 px-2.5 py-1 rounded-md font-medium">
                            {part.name}
                          </span>
                          {idx < arr.length - 1 && <Plus className="w-3.5 h-3.5 text-zinc-500" />}
                        </React.Fragment>
                      ))
                  )}
                </div>

                <form onSubmit={handleCreateRecombination} className="space-y-3">
                  <div>
                    <label className="block text-xs mono text-zinc-400 mb-1">New Project Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Daily Study Notebook"
                      value={newSynthesisTitle}
                      onChange={e => setNewSynthesisTitle(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mono text-zinc-400 mb-1">Scoped Architecture Note</label>
                    <textarea
                      rows="2"
                      placeholder="How these parts fit together into a shippable build..."
                      value={newSynthesisDesc}
                      onChange={e => setNewSynthesisDesc(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={selectedDnaIds.length < 2 || isSynthesizing}
                    className="w-full py-2.5 rounded-lg bg-teal-400 hover:bg-teal-300 disabled:opacity-40 text-zinc-950 font-bold text-xs transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {isSynthesizing
                        ? "Synthesizing Blueprint..."
                        : `Recombine ${selectedDnaIds.length} Modules`}
                    </span>
                  </button>
                </form>
              </div>
            </div>

            {/* Spawned Recombinations */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <div className="text-xs mono uppercase text-zinc-400">Synthesized MVPs</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recombinations.map(rec => (
                  <div
                    key={rec.id}
                    onMouseMove={handleCardMouseMove}
                    className="spotlight-card p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] mono uppercase px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
                        Recombined Blueprint
                      </span>
                      <span className="text-xs mono text-zinc-500">{rec.createdAt}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{rec.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{rec.description}</p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-800/80">
                      {rec.parts.map((p, i) => (
                        <React.Fragment key={p.id}>
                          <span className="text-xs bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded text-zinc-200">
                            {p.name} <span className="text-zinc-500">({p.sourceProject})</span>
                          </span>
                          {i < rec.parts.length - 1 && <Plus className="w-3 h-3 text-zinc-600" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FAILURE PATTERNS */}
        {activeTab === "patterns" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
            <div>
              <h2 className="text-lg font-bold text-white">Recurring Failure Patterns</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Empirical breakdown of why your projects stall across {projects.length} recorded autopsies.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
              {failureStats.map(stat => (
                <div key={stat.reason} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-200">{stat.reason}</span>
                    <span className="mono text-teal-400">
                      {stat.count} repos ({stat.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="h-full bg-teal-400 rounded-full transition-all duration-700"
                      style={{ width: `${stat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-900 py-5 mt-12 text-center text-xs text-zinc-500 mono">
        RE:CODE · Built by Team Fork & Revive
      </footer>
    </div>
  );
}
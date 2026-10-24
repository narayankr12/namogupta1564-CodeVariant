/**
 * Deterministic Rule Engine for Project Revival Paths
 * Evaluates excitement, remaining effort, abandonment causes, and extracted DNA count
 */
export function calculateRecommendedPath(interest, effort, reasons, dnaCount) {
  if (interest >= 4 && effort <= 2) return "Continue";
  if (interest >= 4 && reasons.includes("Scope too large")) return "Restart";
  if (interest >= 3 && reasons.includes("No clear MVP")) return "Change";
  if (dnaCount > 0 && interest <= 3) return "Repurpose";
  return "Archive";
}
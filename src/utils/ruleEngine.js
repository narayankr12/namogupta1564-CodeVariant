/**
 * Deterministic Rule Engine for Project Revival Paths
 * Matches the official RE:CODE rulebook logic.
 */
export function calculateRecommendedPath(interest, effort, reasons, dnaCount) {
  if (interest >= 4 && effort <= 2) {
    return "Continue";
  }

  if (
    interest >= 4 &&
    (reasons.includes("Scope too large") ||
      reasons.includes("Technical blocker"))
  ) {
    return "Restart";
  }

  if (interest === 3 && reasons.includes("No clear MVP")) {
    return "Change";
  }

  if (interest <= 2 && dnaCount >= 1) {
    return "Repurpose";
  }

  if (interest <= 2 && dnaCount === 0) {
    return "Archive";
  }

  return "Archive";
}
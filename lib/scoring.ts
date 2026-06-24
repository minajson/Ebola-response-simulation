// ─────────────────────────────────────────────────────────────────────────────
// SCORING CONSTANTS
// Adjust these values to change the scoring behaviour for the game.
// ─────────────────────────────────────────────────────────────────────────────

/** Points awarded for a correct answer */
export const CORRECT_POINTS = 10;

/** Points deducted for a wrong answer */
export const WRONG_PENALTY = -5;

/** Bonus added when all questions are answered before time expires */
export const COMPLETION_BONUS = 5;

/** Starting exposure level (0–100 scale) */
export const INITIAL_EXPOSURE = 10;

// ─────────────────────────────────────────────────────────────────────────────
// EXPOSURE THRESHOLDS
// ─────────────────────────────────────────────────────────────────────────────

export type ExposureLabel = "Low" | "Moderate" | "High";

export function getExposureLabel(exposure: number): ExposureLabel {
  if (exposure <= 20) return "Low";
  if (exposure <= 50) return "Moderate";
  return "High";
}

export function getExposureColor(label: ExposureLabel): string {
  if (label === "Low") return "bg-green-500";
  if (label === "Moderate") return "bg-yellow-500";
  return "bg-red-500";
}

export function getExposureTextColor(label: ExposureLabel): string {
  if (label === "Low") return "text-green-400";
  if (label === "Moderate") return "text-yellow-400";
  return "text-red-400";
}

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT OUTCOME THRESHOLDS
// Adjust the score cut-offs below to make outcomes easier or harder to achieve.
// ─────────────────────────────────────────────────────────────────────────────

export type PatientOutcomeLabel =
  | "Stabilized and safely evacuated"
  | "Critical — containment partially achieved"
  | "Failed evacuation — outbreak escalation risk";

export function getPatientOutcome(score: number): PatientOutcomeLabel {
  if (score >= 60) return "Stabilized and safely evacuated";
  if (score >= 35) return "Critical — containment partially achieved";
  return "Failed evacuation — outbreak escalation risk";
}

export function getOutcomeColor(label: PatientOutcomeLabel): string {
  if (label === "Stabilized and safely evacuated") return "text-green-400";
  if (label === "Critical — containment partially achieved") return "text-yellow-400";
  return "text-red-400";
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE CALCULATIONS
// ─────────────────────────────────────────────────────────────────────────────

export function calculateScoreDelta(isCorrect: boolean): number {
  return isCorrect ? CORRECT_POINTS : WRONG_PENALTY;
}

export function clampExposure(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function getOutbreakRisk(exposure: number): number {
  // Outbreak risk scales with exposure — capped at 100
  return Math.min(100, Math.round(exposure * 1.2));
}

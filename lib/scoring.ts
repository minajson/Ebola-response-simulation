// ─────────────────────────────────────────────────────────────────────────────
// SCORING CONSTANTS
// Adjust these values to change the scoring behaviour for the game.
// The same rules apply to both teams.
// ─────────────────────────────────────────────────────────────────────────────

/** Points awarded for a correct answer */
export const CORRECT_POINTS = 10;

/** Points deducted for a wrong answer */
export const WRONG_PENALTY = -5;

/** Points for a scenario left unanswered when time expires (never counted as correct) */
export const UNANSWERED_POINTS = 0;

/** Bonus added when all questions are answered before time expires */
export const COMPLETION_BONUS = 5;

/** Starting exposure level (0–100 scale) */
export const INITIAL_EXPOSURE = 10;

// ─────────────────────────────────────────────────────────────────────────────
// EXPOSURE THRESHOLDS
// These are simulation indicators, not infection probabilities.
// ─────────────────────────────────────────────────────────────────────────────

export type ExposureLabel = "Low" | "Moderate" | "High";

export function getExposureLabel(exposure: number): ExposureLabel {
  if (exposure <= 20) return "Low";
  if (exposure <= 50) return "Moderate";
  return "High";
}

// ─────────────────────────────────────────────────────────────────────────────
// OUTBREAK RISK
// ─────────────────────────────────────────────────────────────────────────────

export type OutbreakLabel = "Controlled" | "Elevated" | "Critical";

export function getOutbreakRisk(exposure: number): number {
  // Outbreak risk scales with exposure — capped at 100
  return Math.min(100, Math.round(exposure * 1.2));
}

export function getOutbreakLabel(risk: number): OutbreakLabel {
  if (risk >= 60) return "Critical";
  if (risk >= 35) return "Elevated";
  return "Controlled";
}

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT MANAGEMENT PERFORMANCE (final rating shown on the results screen)
// A simulated rating of decision quality — not a prediction of patient survival.
// Adjust the score cut-offs below to make ratings easier or harder to achieve.
// ─────────────────────────────────────────────────────────────────────────────

export type PatientOutcomeLabel = "Strong" | "Partial" | "Weak";

export function getPatientOutcome(score: number): PatientOutcomeLabel {
  if (score >= 60) return "Strong";
  if (score >= 35) return "Partial";
  return "Weak";
}

export const PATIENT_OUTCOME_DETAIL: Record<PatientOutcomeLabel, string> = {
  Strong: "Safe isolation and transfer decisions throughout",
  Partial: "Some protective decisions missed",
  Weak: "Critical protective decisions missed",
};

// ─────────────────────────────────────────────────────────────────────────────
// SCORE CALCULATIONS
// ─────────────────────────────────────────────────────────────────────────────

export function calculateScoreDelta(isCorrect: boolean): number {
  return isCorrect ? CORRECT_POINTS : WRONG_PENALTY;
}

export function clampExposure(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function formatPoints(points: number): string {
  if (points > 0) return `+${points}`;
  if (points < 0) return `−${Math.abs(points)}`;
  return "0";
}

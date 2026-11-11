// ─────────────────────────────────────────────────────────────────────────────
// GAME CONFIGURATION
// Timing and flow settings. Every value here applies identically to both teams.
// ─────────────────────────────────────────────────────────────────────────────

import type { Team } from "@/data/questions";

/** Seconds on the clock for each team's round. */
export const ROUND_SECONDS = 150;

/** Timer turns amber and plays one warning tone at this many seconds remaining. */
export const TIMER_AMBER_AT = 45;

/** Timer turns red and plays a stronger warning at this many seconds remaining. */
export const TIMER_RED_AT = 20;

/** Audible countdown beeps start at this many seconds remaining. */
export const COUNTDOWN_BEEPS_FROM = 10;

/** The final, stronger countdown beeps start at this many seconds remaining. */
export const COUNTDOWN_FINAL_FROM = 3;

/** How long a locked answer stays on screen before the next scenario appears. */
export const LOCK_TRANSITION_MS = 900;

/** How long the "time expired" notice holds before the round closes. */
export const TIMEOUT_HOLD_MS = 1800;

export const TEAM_INFO: Record<Team, { name: string; round: string }> = {
  A: { name: "Team A", round: "Clinic Walk-In" },
  B: { name: "Team B", round: "Catering Facility" },
};

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

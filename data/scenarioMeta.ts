// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO PRESENTATION DATA
// Supplements data/questions.ts without modifying it. Keyed by question id.
// • scene     — which atmospheric photo to show (see data/scenes.ts)
// • keyPoint  — one-line AAR learning point, condensed from that question's
//               existing `lesson` text (the full lesson is still shown in
//               the AAR facilitator notes).
// ─────────────────────────────────────────────────────────────────────────────

import type { SceneSlug } from "@/data/scenes";

export interface ScenarioMeta {
  scene: SceneSlug;
  keyPoint: string;
}

export const SCENARIO_META: Record<number, ScenarioMeta> = {
  // Team A — Clinic Walk-In
  1: { scene: "ppe-team", keyPoint: "Isolate and put on full PPE before any clinical contact." },
  2: { scene: "clinic-waiting", keyPoint: "No isolation room? Clear the area and improvise isolation at once." },
  3: { scene: "decon-station", keyPoint: "Unprotected contact: decontaminate, report and start 21-day monitoring." },
  4: { scene: "ppe-donning", keyPoint: "No invasive procedures without full Ebola-level PPE." },
  5: { scene: "canteen", keyPoint: "Trace and separate contacts on suspicion — don't wait for the lab." },
  6: { scene: "clinic-waiting", keyPoint: "No visitors during isolation — communicate through proper channels." },
  7: { scene: "ambulance", keyPoint: "Stop the transfer until the crew has the full Ebola PPE ensemble." },
  // Team B — Catering Facility
  8: { scene: "kitchen", keyPoint: "Travel history plus symptoms: isolate and activate the alert immediately." },
  9: { scene: "canteen", keyPoint: "Halt food service and notify everyone potentially exposed." },
  10: { scene: "decon-station", keyPoint: "Treat facilities a suspected case used as contaminated: seal and clean." },
  11: { scene: "kitchen", keyPoint: "Infection-control authority overrides line management in an emergency." },
  12: { scene: "locker-room", keyPoint: "Shared towels or personal items are high-risk contact: monitor 21 days." },
  13: { scene: "contact-tracing", keyPoint: "Share contacts with the health authority — address stigma, but trace everyone." },
  14: { scene: "contact-tracing", keyPoint: "Assess symptomatic household contacts at home — never send them to a clinic." },
};

const FALLBACK_META: ScenarioMeta = { scene: "ppe-team", keyPoint: "Review this decision against your site's Ebola protocol." };

export function getScenarioMeta(questionId: number): ScenarioMeta {
  return SCENARIO_META[questionId] ?? FALLBACK_META;
}

/** Core preparedness lessons (from the original final-results takeaways). */
export const CORE_LESSONS: string[] = [
  "Full PPE must be donned before any contact with a suspected Ebola patient — no exceptions.",
  "Contact tracing and isolation begin on suspicion — never wait for laboratory confirmation.",
  "Health authority supersedes line management during infectious disease emergencies.",
  "No visitor access, no transport without proper PPE, no unmonitored exposed workers.",
  "Symptomatic household contacts must be assessed at home — never directed to travel to a clinic.",
];

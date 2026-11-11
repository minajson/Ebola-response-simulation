// Logic and content-integrity regression tests (no browser).
import { expect, test } from "@playwright/test";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ALL_QUESTIONS, getQuestionsForTeam, type OptionKey, type Question } from "../../data/questions";
import { CORE_LESSONS, SCENARIO_META } from "../../data/scenarioMeta";
import {
  COUNTDOWN_BEEPS_FROM,
  COUNTDOWN_FINAL_FROM,
  ROUND_SECONDS,
  TIMER_AMBER_AT,
  TIMER_RED_AT,
} from "../../lib/config";
import { buildTeamResult, decideWinner, initialProgress, recordDecision, type RoundProgress } from "../../lib/round";
import {
  COMPLETION_BONUS,
  CORRECT_POINTS,
  getPatientOutcome,
  INITIAL_EXPOSURE,
  UNANSWERED_POINTS,
  WRONG_PENALTY,
} from "../../lib/scoring";

const ROOT = join(__dirname, "..", "..");
const A = getQuestionsForTeam("A");
const B = getQuestionsForTeam("B");
const wrong = (q: Question): OptionKey => (["A", "B", "C", "D"] as OptionKey[]).find((k) => k !== q.correctAnswer)!;

function play(questions: Question[], picks: Array<"right" | "wrong">): RoundProgress {
  return picks.reduce(
    (p, pick, i) => recordDecision(p, questions[i], pick === "right" ? questions[i].correctAnswer : wrong(questions[i])),
    initialProgress(),
  );
}

// ── Locked content ──────────────────────────────────────────────────────────

test.describe("content integrity", () => {
  test("14 scenarios in the original order, 7 per team", () => {
    expect(ALL_QUESTIONS.map((q) => q.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    expect(A.map((q) => q.id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(B.map((q) => q.id)).toEqual([8, 9, 10, 11, 12, 13, 14]);
  });

  test("answer key is unchanged", () => {
    expect(ALL_QUESTIONS.map((q) => q.correctAnswer).join("")).toBe("CADBADCBCADBAC");
  });

  test("scenario titles are unchanged", () => {
    expect(ALL_QUESTIONS.map((q) => q.scenario)).toEqual([
      "Initial Triage — Suspected Ebola Presentation",
      "No Isolation Room — Crowded Waiting Area",
      "Accidental Unprotected Contact",
      "IV Access Without Proper PPE",
      "Workplace Contact Tracing — Lunchroom",
      "Family Visit Request During Isolation",
      "EMS Transfer — Inadequate PPE",
      "Hidden Exposure — Catering Worker Presentation",
      "Food Service Contamination Risk — 200 Employees",
      "Shared Restroom Contamination",
      "Supervisor Overrides Infection Control Decision",
      "Shared Personal Items — Locker Room",
      "Contact List Refusal — Privacy Objection",
      "Household Secondary Case — Spouse Symptomatic",
    ]);
  });

  test("every scenario has a question, four distinct options and complete feedback fields", () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.question.trim().length, `Q${q.id} question`).toBeGreaterThan(20);
      const opts = (["A", "B", "C", "D"] as OptionKey[]).map((k) => q.options[k]?.trim());
      expect(opts.every((o) => o && o.length > 5), `Q${q.id} options`).toBe(true);
      expect(new Set(opts).size, `Q${q.id} distinct options`).toBe(4);
      for (const s of [q.lesson, q.patientImpact.correct, q.patientImpact.wrong, q.containmentImpact.correct, q.containmentImpact.wrong]) {
        expect(s?.trim().length, `Q${q.id} feedback text`).toBeGreaterThan(5);
      }
    }
  });

  test("every scenario has a short AAR key point and a scene", () => {
    for (const q of ALL_QUESTIONS) {
      const meta = SCENARIO_META[q.id];
      expect(meta, `meta for Q${q.id}`).toBeTruthy();
      expect(meta.keyPoint.length, `Q${q.id} key point length`).toBeLessThanOrEqual(90);
    }
    expect(CORE_LESSONS).toHaveLength(5);
  });

  test("no 'Occupational Health' wording remains in content or UI", () => {
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.(ts|tsx|css)$/.test(name)) files.push(p);
      }
    };
    ["app", "components", "lib", "data"].forEach((d) => walk(join(ROOT, d)));
    const hits = files.filter((f) => /occupational/i.test(readFileSync(f, "utf8")));
    expect(hits).toEqual([]);
  });

  test("corrected guidance does not reintroduce flagged wording", () => {
    const text = JSON.stringify(ALL_QUESTIONS);
    for (const phrase of ["near-certain transmission", "Level C/D", "GDPR", "Ebola-endemic", "most efficient Ebola environmental", "legally mandatory", "N95/P100", "quarantine exposed"]) {
      expect(text, phrase).not.toContain(phrase);
    }
  });

  test("approved answer-option wording (sign-off 2026-11-11)", () => {
    const opt = (id: number, k: OptionKey) => ALL_QUESTIONS.find((q) => q.id === id)!.options[k];
    expect(opt(6, "D")).toContain("direct the family to the site Health team for updates");
    expect(opt(9, "C")).toContain("remove exposed kitchen staff from duty pending exposure assessment and appropriate 21-day monitoring");
    expect(opt(12, "B")).toContain("assess exposure and apply appropriate work restrictions and 21-day monitoring");
    expect(opt(13, "A")).not.toMatch(/mandatory/i);
    expect(opt(7, "C")).toMatch(/medical mask or respirator/);
  });

  test("scene photos are bundled locally with credits", () => {
    const src = readFileSync(join(ROOT, "data", "scenes.ts"), "utf8");
    const imports = [...src.matchAll(/from "@\/assets\/scenes\/([\w-]+\.jpg)"/g)].map((m) => m[1]);
    expect(imports).toHaveLength(10);
    for (const f of imports) {
      const p = join(ROOT, "assets", "scenes", f);
      expect(existsSync(p), f).toBe(true);
      expect(statSync(p).size, `${f} size`).toBeLessThan(300_000);
    }
    expect((src.match(/credit: \{/g) ?? []).length).toBe(10);
    expect(src).not.toMatch(/https?:\/\/(?!commons\.wikimedia\.org|creativecommons\.org)/);
  });
});

// ── Scoring and round rules ─────────────────────────────────────────────────

test.describe("scoring rules", () => {
  test("constants and timer configuration", () => {
    expect([CORRECT_POINTS, WRONG_PENALTY, UNANSWERED_POINTS, COMPLETION_BONUS, INITIAL_EXPOSURE]).toEqual([10, -5, 0, 5, 10]);
    expect([ROUND_SECONDS, TIMER_AMBER_AT, TIMER_RED_AT, COUNTDOWN_BEEPS_FROM, COUNTDOWN_FINAL_FROM]).toEqual([150, 45, 20, 10, 3]);
  });

  test("all correct before time = 70 + 5 speed bonus", () => {
    const r = buildTeamResult("A", A, play(A, Array(7).fill("right")), true, 60);
    expect([r.score, r.decisionPoints, r.speedBonus, r.correctAnswers, r.unanswered]).toEqual([75, 70, 5, 7, 0]);
  });

  test("timeout with zero answers: all unanswered, never correct, no bonus", () => {
    const r = buildTeamResult("B", B, initialProgress(), false, 0);
    expect(r.score).toBe(0);
    expect(r.unanswered).toBe(7);
    expect(r.answers.every((a) => a.outcome === "unanswered" && !a.isCorrect && a.selectedAnswer === null)).toBe(true);
    expect(r.completedBeforeTime).toBe(false);
  });

  test("partial round: unanswered score 0 and no bonus even if flagged complete", () => {
    const r = buildTeamResult("A", A, play(A, ["right", "wrong", "right"]), true, 0);
    expect([r.score, r.correctAnswers, r.incorrectAnswers, r.unanswered, r.speedBonus]).toEqual([15, 2, 1, 4, 0]);
    expect(r.answers.map((a) => a.outcome)).toEqual(["correct", "incorrect", "correct", "unanswered", "unanswered", "unanswered", "unanswered"]);
  });

  test("speed bonus rule is identical for both teams", () => {
    const picks = ["right", "wrong", "right", "right", "wrong", "right", "right"] as const;
    const a = buildTeamResult("A", A, play(A, [...picks]), true, 30);
    const b = buildTeamResult("B", B, play(B, [...picks]), true, 30);
    expect(a.score).toBe(b.score);
    expect(a.speedBonus).toBe(b.speedBonus);
  });

  test("a scenario can only be decided once", () => {
    const p1 = recordDecision(initialProgress(), A[0], A[0].correctAnswer);
    const p2 = recordDecision(p1, A[0], wrong(A[0]));
    expect(p2).toBe(p1);
  });

  test("exposure is clamped to 0–100 and follows the original deltas", () => {
    const allWrong = play(B, Array(7).fill("wrong"));
    expect(allWrong.exposure).toBe(100);
    const allRight = play(A, Array(7).fill("right"));
    expect(allRight.exposure).toBe(0);
  });

  test("winner by higher score; equal scores are a tie", () => {
    const a = buildTeamResult("A", A, play(A, Array(7).fill("right")), true, 10);
    const b = buildTeamResult("B", B, play(B, Array(7).fill("right")), true, 10);
    expect(decideWinner(a, b)).toBe("TIE");
    const b2 = buildTeamResult("B", B, play(B, ["wrong", ...Array(6).fill("right")]), true, 10);
    expect(decideWinner(a, b2)).toBe("A");
    expect(decideWinner(b2, a)).toBe("B");
  });

  test("Patient Management Performance bands keep the original cut-offs", () => {
    expect([getPatientOutcome(75), getPatientOutcome(60), getPatientOutcome(59), getPatientOutcome(35), getPatientOutcome(34)]).toEqual([
      "Strong",
      "Strong",
      "Partial",
      "Partial",
      "Weak",
    ]);
  });
});

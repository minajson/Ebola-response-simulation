// ─────────────────────────────────────────────────────────────────────────────
// ROUND LOGIC — pure functions, shared by both teams.
// ─────────────────────────────────────────────────────────────────────────────

import type { OptionKey, Question, Team } from "@/data/questions";
import type { AnswerRecord, TeamResult } from "@/lib/types";
import {
  calculateScoreDelta,
  clampExposure,
  COMPLETION_BONUS,
  INITIAL_EXPOSURE,
} from "@/lib/scoring";

export interface RoundProgress {
  records: AnswerRecord[];
  /** Decision points so far (bonus is added only at the end). */
  score: number;
  exposure: number;
}

export function initialProgress(initialExposure: number = INITIAL_EXPOSURE): RoundProgress {
  return { records: [], score: 0, exposure: clampExposure(initialExposure) };
}

/** Lock one decision. Scoring and exposure deltas are unchanged from the original game. */
export function recordDecision(
  progress: RoundProgress,
  question: Question,
  selected: OptionKey,
): RoundProgress {
  if (progress.records.some((r) => r.questionId === question.id)) return progress;
  const isCorrect = selected === question.correctAnswer;
  const exposureDelta = isCorrect ? question.exposureImpact.correct : question.exposureImpact.wrong;
  return {
    records: [
      ...progress.records,
      {
        questionId: question.id,
        selectedAnswer: selected,
        outcome: isCorrect ? "correct" : "incorrect",
        isCorrect,
      },
    ],
    score: progress.score + calculateScoreDelta(isCorrect),
    exposure: clampExposure(progress.exposure + exposureDelta),
  };
}

/**
 * Close the round. Scenarios without a decision are recorded as unanswered
 * (0 points, never correct). The speed bonus applies only when every scenario
 * was answered before the timer expired — the same rule for both teams.
 */
export function buildTeamResult(
  team: Team,
  questions: Question[],
  progress: RoundProgress,
  completedBeforeTime: boolean,
  secondsRemaining: number,
): TeamResult {
  const byId = new Map(progress.records.map((r) => [r.questionId, r]));
  const answers: AnswerRecord[] = questions.map(
    (q) =>
      byId.get(q.id) ?? {
        questionId: q.id,
        selectedAnswer: null,
        outcome: "unanswered",
        isCorrect: false,
      },
  );
  const correctAnswers = answers.filter((a) => a.outcome === "correct").length;
  const incorrectAnswers = answers.filter((a) => a.outcome === "incorrect").length;
  const unanswered = answers.filter((a) => a.outcome === "unanswered").length;
  const earnedBonus = completedBeforeTime && unanswered === 0;
  const speedBonus = earnedBonus ? COMPLETION_BONUS : 0;

  return {
    team,
    score: progress.score + speedBonus,
    decisionPoints: progress.score,
    speedBonus,
    correctAnswers,
    incorrectAnswers,
    unanswered,
    exposureLevel: clampExposure(progress.exposure),
    answers,
    completedBeforeTime: earnedBonus,
    secondsRemaining: Math.max(0, secondsRemaining),
  };
}

export type Winner = Team | "TIE";

/** Higher final score wins; equal scores are a tie. No hidden tie-breakers. */
export function decideWinner(a: TeamResult, b: TeamResult): Winner {
  if (a.score > b.score) return "A";
  if (b.score > a.score) return "B";
  return "TIE";
}

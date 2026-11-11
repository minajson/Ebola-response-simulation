import type { OptionKey, Team } from "@/data/questions";

export type DecisionOutcome = "correct" | "incorrect" | "unanswered";

/** One team's decision on one scenario. Unanswered scenarios have no selection. */
export interface AnswerRecord {
  questionId: number;
  selectedAnswer: OptionKey | null;
  outcome: DecisionOutcome;
  isCorrect: boolean;
}

/** The full record for one team's completed round. */
export interface TeamResult {
  team: Team;
  /** Final score, including any speed bonus. */
  score: number;
  /** Points from decisions only (+10 correct, −5 incorrect, 0 unanswered). */
  decisionPoints: number;
  speedBonus: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  exposureLevel: number;
  /** One record per scenario, in scenario order. */
  answers: AnswerRecord[];
  completedBeforeTime: boolean;
  secondsRemaining: number;
}

"use client";

import { useState } from "react";
import { getQuestionsForTeam, type Team } from "@/data/questions";
import { getScenarioMeta } from "@/data/scenarioMeta";
import type { SceneSlug } from "@/data/scenes";
import type { TeamResult } from "@/lib/types";
import WelcomeScreen from "@/components/WelcomeScreen";
import TeamRound from "@/components/TeamRound";
import RoundCompleteScreen from "@/components/RoundCompleteScreen";
import ReviewScreen from "@/components/ReviewScreen";
import WinnerScreen from "@/components/WinnerScreen";
import { unlockAudio } from "@/lib/sound";

export type { AnswerRecord, TeamResult } from "@/lib/types";

// Game flow (facilitator-controlled at every hand-over):
// welcome → roundA → doneA → roundB → doneB → review (combined AAR) → winner → restart
type Phase = "welcome" | "roundA" | "doneA" | "roundB" | "doneB" | "review" | "winner";

const QUESTIONS: Record<Team, ReturnType<typeof getQuestionsForTeam>> = {
  A: getQuestionsForTeam("A"),
  B: getQuestionsForTeam("B"),
};

function scenesFor(team: Team): SceneSlug[] {
  return QUESTIONS[team].map((q) => getScenarioMeta(q.id).scene);
}

export default function GameShell() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [results, setResults] = useState<Partial<Record<Team, TeamResult>>>({});
  const [session, setSession] = useState(0);
  const [reviewStep, setReviewStep] = useState(0);

  function startRound(team: Team) {
    unlockAudio(); // user gesture: unlocks Web Audio on the presenting computer
    setPhase(team === "A" ? "roundA" : "roundB");
  }

  function handleRoundComplete(result: TeamResult) {
    setResults((r) => ({ ...r, [result.team]: result }));
    setPhase(result.team === "A" ? "doneA" : "doneB");
  }

  function restart() {
    setResults({});
    setReviewStep(0);
    setSession((s) => s + 1);
    setPhase("welcome");
  }

  switch (phase) {
    case "welcome":
      return <WelcomeScreen key={session} onStart={() => startRound("A")} preloadScenes={scenesFor("A")} />;
    case "roundA":
      return <TeamRound key={`A-${session}`} team="A" questions={QUESTIONS.A} onComplete={handleRoundComplete} />;
    case "doneA":
      return (
        <RoundCompleteScreen team="A" nextTeam="B" onContinue={() => startRound("B")} preloadScenes={scenesFor("B")} />
      );
    case "roundB":
      return <TeamRound key={`B-${session}`} team="B" questions={QUESTIONS.B} onComplete={handleRoundComplete} />;
    case "doneB":
      return <RoundCompleteScreen team="B" nextTeam={null} onContinue={() => setPhase("review")} />;
    case "review":
      if (!results.A || !results.B) return null;
      return (
        <ReviewScreen
          teamAResult={results.A}
          teamBResult={results.B}
          questions={QUESTIONS}
          step={reviewStep}
          onStepChange={setReviewStep}
          onRevealWinner={() => setPhase("winner")}
        />
      );
    case "winner":
      if (!results.A || !results.B) return null;
      return (
        <WinnerScreen
          teamAResult={results.A}
          teamBResult={results.B}
          onRestart={restart}
          onBackToReview={() => setPhase("review")}
        />
      );
  }
}

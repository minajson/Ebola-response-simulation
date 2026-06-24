"use client";

import { useState } from "react";
import { getQuestionsForTeam, OptionKey } from "@/data/questions";
import TeamRound from "@/components/TeamRound";
import ReviewScreen from "@/components/ReviewScreen";
import WinnerScreen from "@/components/WinnerScreen";
import { COMPLETION_BONUS, INITIAL_EXPOSURE } from "@/lib/scoring";

// ─────────────────────────────────────────────────────────────────────────────
// TeamResult — the full record for one team's completed round
// ─────────────────────────────────────────────────────────────────────────────
export interface AnswerRecord {
  questionId: number;
  selectedAnswer: OptionKey;
  isCorrect: boolean;
}

export interface TeamResult {
  team: "A" | "B";
  score: number;
  correctAnswers: number;
  exposureLevel: number;
  answers: AnswerRecord[];
  completedBeforeTime: boolean;
}

// Game phase state machine:
// intro → teamA → teamAReview → teamB → teamBReview → winner
type Phase =
  | "intro"
  | "teamA"
  | "teamAReview"
  | "teamB"
  | "teamBReview"
  | "winner";

const teamAQuestions = getQuestionsForTeam("A");
const teamBQuestions = getQuestionsForTeam("B");

export default function GameShell() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [teamAResult, setTeamAResult] = useState<TeamResult | null>(null);
  const [teamBResult, setTeamBResult] = useState<TeamResult | null>(null);

  function handleTeamRoundComplete(result: TeamResult) {
    if (result.team === "A") {
      setTeamAResult(result);
      setPhase("teamAReview");
    } else {
      setTeamBResult(result);
      setPhase("teamBReview");
    }
  }

  function handleRestart() {
    setTeamAResult(null);
    setTeamBResult(null);
    setPhase("intro");
  }

  if (phase === "intro") {
    return <IntroScreen onStart={() => setPhase("teamA")} />;
  }

  if (phase === "teamA") {
    return (
      <TeamRound
        team="A"
        questions={teamAQuestions}
        initialExposure={INITIAL_EXPOSURE}
        onComplete={handleTeamRoundComplete}
      />
    );
  }

  if (phase === "teamAReview" && teamAResult) {
    return (
      <ReviewScreen
        result={teamAResult}
        questions={teamAQuestions}
        onContinue={() => setPhase("teamB")}
        continueLabel="Continue → Team B Round"
      />
    );
  }

  if (phase === "teamB") {
    return (
      <TeamRound
        team="B"
        questions={teamBQuestions}
        initialExposure={INITIAL_EXPOSURE}
        onComplete={handleTeamRoundComplete}
      />
    );
  }

  if (phase === "teamBReview" && teamBResult) {
    return (
      <ReviewScreen
        result={teamBResult}
        questions={teamBQuestions}
        onContinue={() => setPhase("winner")}
        continueLabel="See Final Results →"
      />
    );
  }

  if (phase === "winner" && teamAResult && teamBResult) {
    return (
      <WinnerScreen
        teamAResult={teamAResult}
        teamBResult={teamBResult}
        onRestart={handleRestart}
      />
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Intro / Landing Screen
// ─────────────────────────────────────────────────────────────────────────────
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      {/* Hazard banner */}
      <div className="mb-8 flex items-center gap-3">
        <div className="h-px flex-1 max-w-16 bg-amber-400" />
        <span className="text-xs uppercase tracking-[0.3em] text-amber-600 font-bold">
          ⚠ Industrial Site — Occupational Health Training
        </span>
        <div className="h-px flex-1 max-w-16 bg-amber-400" />
      </div>

      {/* Title */}
      <h1 className="text-center text-4xl sm:text-5xl font-extrabold text-slate-800 mb-3 leading-tight">
        Ebola Response:
        <br />
        <span className="text-orange-500">Contain or Collapse</span>
      </h1>
      <p className="text-slate-500 text-center text-base max-w-lg mb-10 leading-relaxed">
        A high-stakes Ebola preparedness decision simulation for industrial Occupational Health
        teams. Two teams. Seven scenarios each. Three minutes on the clock.
      </p>

      {/* How it works */}
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-slate-50 p-6 mb-10 space-y-3 shadow-sm">
        <h2 className="text-sm uppercase tracking-widest text-orange-600 font-bold mb-4">
          How It Works
        </h2>
        {[
          ["Team A plays first", "7 Clinic Walk-In scenarios — 3-minute round"],
          ["Team B plays second", "7 Catering Facility Exposure scenarios — 3-minute round"],
          ["After each round", "Review every decision and its real-world consequence"],
          ["After both rounds", "Final results — winner declared"],
        ].map(([title, desc]) => (
          <div key={title} className="flex gap-3 items-start">
            <span className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center">
              <span className="block h-1.5 w-1.5 rounded-full bg-orange-500" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">{title}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scoring legend */}
      <div className="w-full max-w-xl grid grid-cols-3 gap-3 mb-10">
        <div className="rounded-xl border border-green-300 bg-green-50 p-3 text-center">
          <p className="text-xl font-bold text-green-600">+10</p>
          <p className="text-xs text-slate-500 mt-1">Correct action</p>
        </div>
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-center">
          <p className="text-xl font-bold text-red-600">−5</p>
          <p className="text-xs text-slate-500 mt-1">Wrong action</p>
        </div>
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-center">
          <p className="text-xl font-bold text-amber-600">+{COMPLETION_BONUS}</p>
          <p className="text-xs text-slate-500 mt-1">Speed bonus</p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="rounded-xl bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-extrabold text-lg px-14 py-4 transition-colors shadow-lg shadow-orange-200"
      >
        Start Team A Round →
      </button>

      <p className="mt-4 text-xs text-slate-400 text-center">
        Team B: hand the device to Team B only after Team A review is complete.
      </p>
    </div>
  );
}

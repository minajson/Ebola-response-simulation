"use client";

import { useEffect } from "react";
import { TeamResult } from "@/components/GameShell";
import {
  clampExposure,
  getExposureLabel,
  getExposureTextColor,
  getOutcomeColor,
  getPatientOutcome,
} from "@/lib/scoring";
import { playWinner } from "@/lib/sound";

interface WinnerScreenProps {
  teamAResult: TeamResult;
  teamBResult: TeamResult;
  onRestart: () => void;
}

export default function WinnerScreen({ teamAResult, teamBResult, onRestart }: WinnerScreenProps) {
  useEffect(() => {
    playWinner();
  }, []);

  const winner: "A" | "B" | "TIE" =
    teamAResult.score > teamBResult.score
      ? "A"
      : teamBResult.score > teamAResult.score
      ? "B"
      : "TIE";

  const winnerMessage = {
    A: "Team A demonstrated superior Ebola response decision-making. Excellent containment protocol execution!",
    B: "Team B demonstrated superior Ebola response decision-making. Excellent containment protocol execution!",
    TIE: "Both teams showed equal command of Ebola response protocols. Outstanding performance from all participants!",
  }[winner];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10 px-4">
      {/* Winner banner */}
      <div className="w-full max-w-2xl text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 mb-5 shadow-sm">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">
            Simulation Complete — Final Results
          </span>
        </div>

        {winner === "TIE" ? (
          <>
            <div className="text-6xl mb-4">🤝</div>
            <h1 className="text-4xl font-bold text-slate-800 mb-3">It&apos;s a Tie!</h1>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-4xl font-bold text-slate-800 mb-3">
              Team{" "}
              <span className={winner === "A" ? "text-orange-500" : "text-blue-600"}>
                {winner}
              </span>{" "}
              Wins!
            </h1>
          </>
        )}

        <p className="text-slate-600 text-base leading-relaxed max-w-lg mx-auto">
          {winnerMessage}
        </p>
      </div>

      {/* Side-by-side comparison */}
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <TeamSummaryCard result={teamAResult} winner={winner} />
        <TeamSummaryCard result={teamBResult} winner={winner} />
      </div>

      {/* Key takeaways */}
      <div className="w-full max-w-3xl rounded-xl border border-amber-200 bg-amber-50 p-6 mb-10">
        <h2 className="text-sm uppercase tracking-widest text-amber-700 font-bold mb-3">
          Key Training Takeaways
        </h2>
        <ul className="space-y-2 text-sm text-slate-700 leading-relaxed">
          <li className="flex gap-2">
            <span className="text-amber-500 flex-shrink-0">▶</span>
            Full PPE must be donned BEFORE any contact with a suspected Ebola patient — no exceptions.
          </li>
          <li className="flex gap-2">
            <span className="text-amber-500 flex-shrink-0">▶</span>
            Contact tracing and isolation begin on SUSPICION — never wait for laboratory confirmation.
          </li>
          <li className="flex gap-2">
            <span className="text-amber-500 flex-shrink-0">▶</span>
            Occupational health authority supersedes line management during infectious disease emergencies.
          </li>
          <li className="flex gap-2">
            <span className="text-amber-500 flex-shrink-0">▶</span>
            No visitor access, no transport without proper PPE, no unmonitored exposed workers.
          </li>
          <li className="flex gap-2">
            <span className="text-amber-500 flex-shrink-0">▶</span>
            Symptomatic household contacts must be assessed at home — never directed to travel to a clinic.
          </li>
        </ul>
      </div>

      <button
        onClick={onRestart}
        className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold px-10 py-4 text-base transition-colors border border-slate-600 shadow-md"
      >
        Play Again
      </button>
    </div>
  );
}

function TeamSummaryCard({
  result,
  winner,
}: {
  result: TeamResult;
  winner: "A" | "B" | "TIE";
}) {
  const isWinner = winner !== "TIE" && winner === result.team;
  const exposure = clampExposure(result.exposureLevel);
  const exposureLabel = getExposureLabel(exposure);
  const exposureColor = getExposureTextColor(exposureLabel);
  const outcome = getPatientOutcome(result.score);
  const outcomeColor = getOutcomeColor(outcome);

  const teamColor = result.team === "A" ? "text-orange-600" : "text-blue-600";
  const winnerBorder =
    result.team === "A"
      ? "border-orange-400 shadow-lg shadow-orange-100"
      : "border-blue-400 shadow-lg shadow-blue-100";
  const winnerBadge =
    result.team === "A"
      ? "text-orange-600 border-orange-300 bg-orange-50"
      : "text-blue-600 border-blue-300 bg-blue-50";

  return (
    <div
      className={`rounded-2xl border p-6 bg-white transition-all ${
        isWinner ? winnerBorder : "border-slate-200 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold ${teamColor}`}>Team {result.team}</h3>
        {isWinner && (
          <span
            className={`text-xs uppercase tracking-widest font-bold border rounded-full px-2 py-0.5 ${winnerBadge}`}
          >
            Winner
          </span>
        )}
      </div>

      <div className="space-y-3 text-sm">
        <Row
          label="Score"
          value={String(result.score)}
          valueClass={
            result.score >= 60
              ? "text-green-600"
              : result.score >= 35
              ? "text-amber-600"
              : "text-red-600"
          }
        />
        <Row label="Correct Answers" value={`${result.correctAnswers} / 7`} valueClass="text-slate-800" />
        <Row label="HW Exposure Level" value={exposureLabel} valueClass={exposureColor} />
        <Row
          label="Time Bonus"
          value={result.completedBeforeTime ? "Yes (+5)" : "No"}
          valueClass={result.completedBeforeTime ? "text-green-600" : "text-slate-400"}
        />
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-400 mb-1">Patient Outcome</p>
        <p className={`text-sm font-semibold leading-tight ${outcomeColor}`}>{outcome}</p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500">{label}</span>
      <span className={`font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}

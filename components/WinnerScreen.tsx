"use client";

import { useEffect, useRef, useState } from "react";
import type { Team } from "@/data/questions";
import type { TeamResult } from "@/lib/types";
import TopBar from "@/components/TopBar";
import Trophy from "@/components/Trophy";
import Confetti from "@/components/Confetti";
import Button from "@/components/ui/Button";
import { Kicker, TeamChip } from "@/components/ui/Brand";
import { ArrowLeftIcon, CompressIcon, ExpandIcon, ReplayIcon } from "@/components/ui/icons";
import { TEAM_INFO } from "@/lib/config";
import { usePreferences } from "@/lib/preferences";
import { decideWinner, type Winner } from "@/lib/round";
import {
  formatPoints,
  getExposureLabel,
  getOutbreakLabel,
  getOutbreakRisk,
  getPatientOutcome,
  PATIENT_OUTCOME_DETAIL,
} from "@/lib/scoring";
import { playCue } from "@/lib/sound";

interface WinnerScreenProps {
  teamAResult: TeamResult;
  teamBResult: TeamResult;
  onRestart: () => void;
  onBackToReview: () => void;
}

const COUNT_MS = 1600;
const REVEAL_PAUSE_MS = 450;

export default function WinnerScreen({ teamAResult, teamBResult, onRestart, onBackToReview }: WinnerScreenProps) {
  const prefs = usePreferences();
  const winner = decideWinner(teamAResult, teamBResult);
  const [shown, setShown] = useState<Record<Team, number>>({ A: 0, B: 0 });
  const [revealed, setRevealed] = useState(false);
  const revealSoundRef = useRef(false);
  const celebrateSoundRef = useRef(false);
  const reduceMotionRef = useRef(prefs.reduceMotion);

  // Count-up reveal. Sounds are ref-guarded so StrictMode/re-renders never repeat them.
  useEffect(() => {
    const finalScores = { A: teamAResult.score, B: teamBResult.score };
    const celebrate = () => {
      setRevealed(true);
      if (!celebrateSoundRef.current) {
        celebrateSoundRef.current = true;
        playCue("celebrate");
      }
    };
    if (reduceMotionRef.current) {
      setShown(finalScores);
      celebrate();
      return;
    }
    if (!revealSoundRef.current) {
      revealSoundRef.current = true;
      playCue("reveal");
    }
    const start = performance.now();
    let raf = 0;
    let timeout = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown({ A: Math.round(finalScores.A * eased), B: Math.round(finalScores.B * eased) });
      if (t < 1) raf = requestAnimationFrame(step);
      else timeout = window.setTimeout(celebrate, REVEAL_PAUSE_MS);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [teamAResult.score, teamBResult.score]);

  const headline = winner === "TIE" ? "It’s a tie" : `${TEAM_INFO[winner].name} wins`;
  const message =
    winner === "TIE"
      ? `Both teams finished level on ${formatPoints(teamAResult.score)} points. Congratulations to everyone — shared honours.`
      : `Congratulations, ${TEAM_INFO[winner].name} — the strongest set of response decisions in today’s simulation. Well played, ${
          TEAM_INFO[winner === "A" ? "B" : "A"].name
        }: every decision reviewed today strengthens site preparedness.`;

  return (
    <div className="relative flex h-[100dvh] flex-col bg-canvas">
      <TopBar />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-[1240px] flex-col justify-center gap-[clamp(12px,2vh,26px)] px-5 py-[clamp(12px,2.2vh,30px)] sm:px-8">
          <section className="flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-8 sm:text-left" aria-live="polite">
            <div className={`flex-none transition-all duration-700 ${revealed ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
              <Trophy className="h-[clamp(80px,13vh,176px)] w-auto" label={winner === "TIE" ? "Shared trophy" : `${headline} trophy`} />
            </div>
            <div className="min-w-0">
              <Kicker>Final results</Kicker>
              {revealed ? (
                <div className="animate-reveal-in">
                  <h1 className="mt-1 text-[clamp(38px,4.2vw,76px)] font-extrabold leading-[1.02] tracking-[-0.025em] text-ink">
                    {headline}
                  </h1>
                  <p className="mt-2 max-w-[72ch] text-[clamp(17px,1.35vw,23px)] font-medium leading-snug text-ink-2">{message}</p>
                </div>
              ) : (
                <div>
                  <h1 className="mt-1 text-[clamp(38px,4.2vw,76px)] font-extrabold leading-[1.02] tracking-[-0.025em] text-ink-3">
                    Final scores
                  </h1>
                  <p className="mt-2 text-[clamp(17px,1.35vw,23px)] font-medium text-ink-3">Revealing…</p>
                </div>
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6" aria-label="Team results">
            <ScorePanel result={teamAResult} shownScore={shown.A} winner={winner} revealed={revealed} />
            <ScorePanel result={teamBResult} shownScore={shown.B} winner={winner} revealed={revealed} />
          </section>

          <p className="text-center text-[13px] font-medium leading-snug text-ink-3">
            Scores and ratings reflect decisions made in this training simulation. They do not predict real-world patient
            survival or infection risk.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pb-2">
            <Button variant="primary" size="lg" onClick={onRestart} className="px-8">
              <ReplayIcon className="h-5 w-5" />
              Replay Game
            </Button>
            <Button size="lg" onClick={onBackToReview}>
              <ArrowLeftIcon className="h-5 w-5" />
              Back to review
            </Button>
            {prefs.fullscreenSupported && (
              <Button size="lg" onClick={prefs.toggleFullscreen} aria-pressed={prefs.isFullscreen}>
                {prefs.isFullscreen ? <CompressIcon className="h-5 w-5" /> : <ExpandIcon className="h-5 w-5" />}
                {prefs.isFullscreen ? "Exit full screen" : "Full screen"}
              </Button>
            )}
          </div>
        </div>
      </main>

      {revealed && !prefs.reduceMotion && <Confetti />}
    </div>
  );
}

type Tone = "safe" | "caution" | "alert" | "ink";
const TONE_TEXT: Record<Tone, string> = { safe: "text-safe", caution: "text-caution", alert: "text-alert", ink: "text-ink" };

function containmentPerformance(result: TeamResult): { text: string; tone: Tone } {
  const label = getOutbreakLabel(getOutbreakRisk(result.exposureLevel));
  // Unmade decisions can't count as control: don't report "Controlled" for an incomplete round.
  if (result.unanswered > 0 && label === "Controlled") return { text: "Incomplete", tone: "caution" };
  return { text: label, tone: label === "Controlled" ? "safe" : label === "Elevated" ? "caution" : "alert" };
}

function ScorePanel({
  result,
  shownScore,
  winner,
  revealed,
}: {
  result: TeamResult;
  shownScore: number;
  winner: Winner;
  revealed: boolean;
}) {
  const isWinner = winner === result.team;
  const isTie = winner === "TIE";
  const highlighted = revealed && (isWinner || isTie);
  const total = result.answers.length;
  const exposureLabel = getExposureLabel(result.exposureLevel);
  const exposureTone: Tone = exposureLabel === "Low" ? "safe" : exposureLabel === "Moderate" ? "caution" : "alert";
  const containment = containmentPerformance(result);
  const patient = getPatientOutcome(result.score);
  const patientTone: Tone = patient === "Strong" ? "safe" : patient === "Partial" ? "caution" : "alert";

  const rows: Array<{ label: string; value: string; tone: Tone; note?: string }> = [
    { label: "Correct answers", value: `${result.correctAnswers} / ${total}`, tone: "ink" },
    {
      label: "Health worker exposure",
      value: `${exposureLabel} · ${Math.round(result.exposureLevel)}`,
      tone: exposureTone,
      note: result.unanswered > 0 ? `Based on ${total - result.unanswered} of ${total} decisions made` : undefined,
    },
    {
      label: "Containment performance",
      value: containment.text,
      tone: containment.tone,
      note: result.unanswered > 0 ? `${result.unanswered} unanswered at time-out` : undefined,
    },
    { label: "Patient Management Performance", value: patient, tone: patientTone, note: PATIENT_OUTCOME_DETAIL[patient] },
  ];

  return (
    <article
      className={`rounded-2xl border-2 bg-surface px-6 py-4 transition-[border-color,box-shadow] duration-700 ${
        highlighted ? "border-gold-fill shadow-[0_0_0_6px_#F8F0DC]" : "border-line shadow-card"
      }`}
      aria-label={`${TEAM_INFO[result.team].name} results`}
    >
      <div className="flex items-center justify-between gap-3">
        <TeamChip team={result.team} />
        {revealed && (isWinner || isTie) && (
          <span className="animate-fade-in rounded-lg border border-gold-line bg-gold-soft px-3 py-1 text-[14px] font-bold uppercase tracking-[0.12em] text-gold">
            {isTie ? "Shared honours" : "Winner"}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-3">Final score</p>
          <p className="mt-1 font-mono text-[clamp(48px,5vw,100px)] font-bold leading-none text-ink tabular">
            {formatPoints(shownScore)}
          </p>
        </div>
        <p className={`pb-2 text-right text-[15px] font-medium leading-snug text-ink-2 transition-opacity duration-500 ${revealed ? "opacity-100" : "opacity-0"}`}>
          Decisions {formatPoints(result.decisionPoints)}
          <br />
          Speed bonus {result.speedBonus > 0 ? formatPoints(result.speedBonus) : "—"}
        </p>
      </div>

      <dl className={`mt-3 divide-y divide-line border-t border-line transition-opacity duration-700 ${revealed ? "opacity-100" : "opacity-0"}`}>
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-4 py-1.5">
            <dt className="flex-none whitespace-nowrap text-[15px] font-semibold text-ink-2">{r.label}</dt>
            <dd className="text-right">
              <span className={`text-[18px] font-bold ${TONE_TEXT[r.tone]}`}>{r.value}</span>
              {r.note && <span className="block text-[13px] font-medium text-ink-3">{r.note}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

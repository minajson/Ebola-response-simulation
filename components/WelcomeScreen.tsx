"use client";

import type { SceneSlug } from "@/data/scenes";
import TopBar from "@/components/TopBar";
import SceneImage, { SCENE_HERO_SIZES, ScenePreloader } from "@/components/SceneImage";
import { HeroIntro, PhotoCredits, TrainingFootnote } from "@/components/Hero";
import Button from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { formatClock, ROUND_SECONDS, TEAM_INFO } from "@/lib/config";
import { COMPLETION_BONUS, CORRECT_POINTS, UNANSWERED_POINTS, WRONG_PENALTY, formatPoints } from "@/lib/scoring";

interface WelcomeScreenProps {
  onStart: () => void;
  preloadScenes: SceneSlug[];
}

export default function WelcomeScreen({ onStart, preloadScenes }: WelcomeScreenProps) {
  const clock = formatClock(ROUND_SECONDS);
  const steps = [
    { title: `${TEAM_INFO.A.name} round`, detail: `${TEAM_INFO.A.round} · 7 scenarios · ${clock}` },
    { title: `${TEAM_INFO.B.name} round`, detail: `${TEAM_INFO.B.round} · 7 scenarios · ${clock}` },
    { title: "After-action review", detail: "Both teams, one scenario at a time" },
    { title: "Winner reveal", detail: "Final scores side by side" },
  ];
  const rules = [
    { points: formatPoints(CORRECT_POINTS), label: "Correct action", tone: "text-safe" },
    { points: formatPoints(WRONG_PENALTY), label: "Incorrect action", tone: "text-alert" },
    { points: formatPoints(UNANSWERED_POINTS), label: "Unanswered", tone: "text-ink-2" },
    { points: formatPoints(COMPLETION_BONUS), label: "Bonus: all 7 in time", tone: "text-caution" },
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas">
      <TopBar />

      <main className="mx-auto grid w-full max-w-[1680px] flex-1 grid-cols-1 items-center gap-8 px-5 py-[clamp(14px,2.8vh,32px)] sm:px-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-12 lg:px-12">
        <div className="flex min-w-0 flex-col gap-[clamp(12px,2.2vh,32px)]">
          <HeroIntro />

          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="How the session runs">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-xl border border-line bg-surface px-3.5 py-2.5 shadow-card">
                <p className="font-mono text-[13px] font-bold text-alert">0{i + 1}</p>
                <p className="mt-0.5 text-[17px] font-bold leading-tight text-ink">{s.title}</p>
                <p className="mt-1 text-[14px] font-medium leading-snug text-ink-2">{s.detail}</p>
              </li>
            ))}
          </ol>

          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-3">
              Scoring — identical for both teams
            </p>
            <ul className="mt-2 grid grid-cols-2 gap-2 xl:grid-cols-4">
              {rules.map((r) => (
                <li key={r.label} className="rounded-lg border border-line bg-surface px-3 py-2">
                  <span className={`block font-mono text-[20px] font-bold leading-tight ${r.tone}`}>{r.points}</span>
                  <span className="block text-[14px] font-medium leading-snug text-ink-2">{r.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="xl" onClick={onStart}>
              Start {TEAM_INFO.A.name} Round
              <ArrowRightIcon className="h-6 w-6" />
            </Button>
            <p className="max-w-[32ch] text-[14px] font-medium leading-snug text-ink-3">
              Starts the {clock} clock and enables sound on this computer. Answers stay hidden until both teams finish.
            </p>
          </div>
        </div>

        <figure className="hidden h-[min(72vh,680px)] min-h-[360px] lg:block">
          <SceneImage slug="ppe-team" sizes={SCENE_HERO_SIZES} priority className="h-full w-full" />
        </figure>
      </main>

      <footer className="flex flex-col gap-2 border-t border-line px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <TrainingFootnote />
        <PhotoCredits />
      </footer>

      <ScenePreloader slugs={preloadScenes} />
    </div>
  );
}

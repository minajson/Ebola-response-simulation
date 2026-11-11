"use client";

import type { Team } from "@/data/questions";
import type { SceneSlug } from "@/data/scenes";
import TopBar from "@/components/TopBar";
import { ScenePreloader } from "@/components/SceneImage";
import Button from "@/components/ui/Button";
import { Kicker, TeamChip } from "@/components/ui/Brand";
import { ArrowRightIcon, SealIcon } from "@/components/ui/icons";
import { formatClock, ROUND_SECONDS, TEAM_INFO } from "@/lib/config";

interface RoundCompleteScreenProps {
  team: Team;
  /** The team that plays next, or null when both rounds are done. */
  nextTeam: Team | null;
  onContinue: () => void;
  preloadScenes?: SceneSlug[];
}

/**
 * Facilitator-controlled hand-over. Deliberately shows no score, no correct
 * count and no answers — results stay sealed until both teams have played.
 */
export default function RoundCompleteScreen({ team, nextTeam, onContinue, preloadScenes = [] }: RoundCompleteScreenProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas">
      <TopBar />
      <main className="flex flex-1 items-center justify-center px-5 py-8">
        <div className="w-full max-w-3xl animate-fade-up">
          <div className="rounded-2xl border border-line bg-surface px-6 py-8 shadow-raised sm:px-12 sm:py-12">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-ink text-white">
                <SealIcon className="h-8 w-8" />
              </span>
              <div>
                <Kicker>Round complete</Kicker>
                <div className="mt-1.5">
                  <TeamChip team={team} size="lg" />
                </div>
              </div>
            </div>

            <h1 className="mt-7 text-[clamp(32px,3.4vw,52px)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
              {TEAM_INFO[team].name} decisions recorded and sealed.
            </h1>
            <p className="mt-4 text-[clamp(18px,1.4vw,24px)] font-medium leading-snug text-ink-2">
              {nextTeam
                ? "Scores and answers stay hidden until both teams have played."
                : "Both rounds are complete. The after-action review is ready."}
            </p>

            <div className="mt-8 rounded-xl border border-line bg-canvas px-5 py-5 sm:px-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-3">Facilitator</p>
              {nextTeam ? (
                <>
                  <p className="mt-1.5 text-[19px] font-semibold leading-snug text-ink">
                    Up next: {TEAM_INFO[nextTeam].name} · {TEAM_INFO[nextTeam].round} · 7 scenarios ·{" "}
                    {formatClock(ROUND_SECONDS)} on the clock
                  </p>
                  <p className="mt-1 text-[16px] font-medium text-ink-2">
                    Start the round when {TEAM_INFO[nextTeam].name} is ready and can see the screen.
                  </p>
                </>
              ) : (
                <p className="mt-1.5 text-[19px] font-semibold leading-snug text-ink">
                  Review each scenario with both teams, then reveal the winner.
                </p>
              )}
              <div className="mt-5">
                <Button variant="primary" size="xl" onClick={onContinue}>
                  {nextTeam ? `Start ${TEAM_INFO[nextTeam].name} Round` : "Open After-Action Review"}
                  <ArrowRightIcon className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {preloadScenes.length > 0 && <ScenePreloader slugs={preloadScenes} />}
    </div>
  );
}

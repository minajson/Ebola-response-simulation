"use client";

import type { Team } from "@/data/questions";
import ControlBar from "@/components/ControlBar";
import Timer, { TimeBar } from "@/components/Timer";
import { BrandMark, TeamChip } from "@/components/ui/Brand";
import { formatPoints } from "@/lib/scoring";

interface RoundHeaderProps {
  team: Team;
  scenarioNumber: number;
  totalScenarios: number;
  score: number;
  seconds: number;
}

/** Compact horizontal header: team · scenario · score · large countdown. */
export default function RoundHeader({ team, scenarioNumber, totalScenarios, score, seconds }: RoundHeaderProps) {
  return (
    <div className="flex-none">
      <header className="flex items-center gap-3 border-b border-line bg-surface px-4 py-2 lg:gap-5 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <BrandMark className="h-8 w-8 flex-none" />
          <div className="hidden min-w-0 leading-tight 2xl:block">
            <p className="truncate text-[14px] font-bold text-ink">Ebola Response</p>
            <p className="truncate text-[12px] font-medium text-ink-3">Contain or Collapse</p>
          </div>
        </div>

        <TeamChip team={team} />

        <div className="flex items-baseline gap-2 border-l border-line pl-3 lg:pl-5">
          <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-3">Scenario</span>
          <span className="font-mono text-[26px] font-bold leading-none text-ink tabular">
            {scenarioNumber}
            <span className="text-[18px] text-ink-3">/{totalScenarios}</span>
          </span>
        </div>

        <div className="ml-auto flex items-center gap-3 lg:gap-4">
          <div className="text-right leading-none">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-3">Score</p>
            <p
              className={`mt-1 font-mono text-[28px] font-bold leading-none tabular ${
                score < 0 ? "text-alert" : "text-ink"
              }`}
              aria-live="polite"
            >
              {formatPoints(score)}
            </p>
          </div>
          <Timer seconds={seconds} />
          <ControlBar compact />
        </div>
      </header>
      <TimeBar seconds={seconds} />
    </div>
  );
}

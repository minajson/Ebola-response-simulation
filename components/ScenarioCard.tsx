"use client";

import type { OptionKey, Question } from "@/data/questions";
import { getScenarioMeta } from "@/data/scenarioMeta";
import ScenePanel from "@/components/ScenePanel";
import { LockIcon } from "@/components/ui/icons";

/** Options are always shown in their original order — never shuffled. */
export const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

interface ScenarioCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  lockedKey: OptionKey | null;
  disabled: boolean;
  onSelect: (key: OptionKey) => void;
}

/**
 * Scenario + four options. Selecting an option locks it in a neutral style —
 * the correct answer is never revealed during gameplay.
 */
export default function ScenarioCard({
  question,
  questionNumber,
  totalQuestions,
  lockedKey,
  disabled,
  onSelect,
}: ScenarioCardProps) {
  const meta = getScenarioMeta(question.id);

  return (
    <section
      aria-labelledby={`scenario-${question.id}-text`}
      className="flex h-full min-h-0 flex-col overflow-y-auto rounded-2xl border border-line bg-surface shadow-card"
    >
      <ScenePanel
        key={`scene-${question.id}`}
        slug={meta.scene}
        className="mx-3 mt-3 flex-none animate-fade-in [@media(max-height:700px)]:hidden"
      />

      <div key={question.id} className="my-auto flex flex-none animate-fade-up flex-col px-5 pb-4 pt-4 lg:px-7 lg:pb-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[14px] font-bold uppercase tracking-[0.16em] text-alert">
            Scenario {questionNumber} of {totalQuestions}
          </span>
          <span className="text-[17px] font-semibold text-ink-2 lg:text-[19px]">{question.scenario}</span>
        </div>

        <p
          id={`scenario-${question.id}-text`}
          className="mt-2 text-[clamp(22px,calc(1.25vw+8px),34px)] font-semibold leading-[1.28] tracking-[-0.01em] text-ink"
        >
          {question.question}
        </p>

        <div
          role="group"
          aria-label="Response options"
          className="mt-[clamp(12px,2.2vh,26px)] flex flex-col gap-[clamp(8px,1.3vh,14px)]"
        >
          {OPTION_KEYS.map((key) => {
            const isLocked = lockedKey === key;
            const dimmed = lockedKey !== null && !isLocked;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(key)}
                disabled={disabled}
                aria-pressed={isLocked}
                aria-keyshortcuts={key}
                className={`flex w-full items-center gap-4 rounded-xl border-2 px-4 py-[clamp(8px,1.35vh,14px)] text-left transition-[background-color,border-color,opacity,color] duration-200 disabled:cursor-default ${
                  isLocked
                    ? "border-ink bg-ink text-white"
                    : dimmed
                    ? "border-line bg-surface text-ink opacity-40"
                    : "border-line bg-surface text-ink enabled:hover:border-ink-2 enabled:hover:bg-canvas enabled:active:bg-sunken"
                }`}
              >
                <span
                  className={`flex h-11 w-11 flex-none items-center justify-center rounded-lg border-2 font-mono text-[20px] font-bold ${
                    isLocked ? "border-white bg-white text-ink" : "border-line-strong bg-canvas text-ink"
                  }`}
                  aria-hidden="true"
                >
                  {key}
                </span>
                <span className="flex-1 text-[clamp(18px,calc(0.6vw+12px),23px)] font-medium leading-[1.32]">
                  <span className="sr-only-live">Option {key}: </span>
                  {question.options[key]}
                </span>
                {isLocked && (
                  <span className="flex flex-none items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.14em]">
                    <LockIcon className="h-4 w-4" />
                    Locked
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-[14px] font-medium text-ink-3 [@media(max-height:740px)]:hidden">
          Tap or click an option, or press <Kbd>A</Kbd>–<Kbd>D</Kbd>. Each decision locks immediately.
        </p>
      </div>
    </section>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-line-strong bg-canvas px-1.5 py-0.5 font-mono text-[12px] font-semibold text-ink-2">
      {children}
    </kbd>
  );
}

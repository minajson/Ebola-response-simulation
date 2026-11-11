"use client";

import { useCallback, useEffect, useState } from "react";
import type { OptionKey, Question, Team } from "@/data/questions";
import { CORE_LESSONS, getScenarioMeta } from "@/data/scenarioMeta";
import type { AnswerRecord, DecisionOutcome, TeamResult } from "@/lib/types";
import TopBar from "@/components/TopBar";
import Button from "@/components/ui/Button";
import { Kicker, TeamChip } from "@/components/ui/Brand";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CrossIcon, DashIcon } from "@/components/ui/icons";
import { TEAM_INFO } from "@/lib/config";

interface ReviewScreenProps {
  teamAResult: TeamResult;
  teamBResult: TeamResult;
  questions: Record<Team, Question[]>;
  /** 0 = overview, 1–7 = Team A scenarios, 8–14 = Team B scenarios */
  step: number;
  onStepChange: (step: number) => void;
  onRevealWinner: () => void;
}

type View = { kind: "overview" } | { kind: "scenario"; team: Team; index: number };

const OUTCOME_STYLE: Record<DecisionOutcome, { label: string; badge: string; chip: string; Icon: typeof CheckIcon }> = {
  correct: {
    label: "Correct",
    badge: "border-safe-line bg-safe-soft text-safe",
    chip: "border-safe-line bg-safe-soft text-safe",
    Icon: CheckIcon,
  },
  incorrect: {
    label: "Incorrect",
    badge: "border-alert-line bg-alert-soft text-alert",
    chip: "border-alert-line bg-alert-soft text-alert",
    Icon: CrossIcon,
  },
  unanswered: {
    label: "Unanswered",
    badge: "border-caution-line bg-caution-soft text-caution",
    chip: "border-caution-line border-dashed bg-caution-soft text-caution",
    Icon: DashIcon,
  },
};

export default function ReviewScreen({
  teamAResult,
  teamBResult,
  questions,
  step,
  onStepChange,
  onRevealWinner,
}: ReviewScreenProps) {
  const perTeam = questions.A.length;
  const lastStep = questions.A.length + questions.B.length;
  const results: Record<Team, TeamResult> = { A: teamAResult, B: teamBResult };

  const view: View =
    step <= 0
      ? { kind: "overview" }
      : step <= perTeam
      ? { kind: "scenario", team: "A", index: step - 1 }
      : { kind: "scenario", team: "B", index: step - perTeam - 1 };

  const stepFor = useCallback(
    (team: Team, index: number) => (team === "A" ? 1 + index : 1 + perTeam + index),
    [perTeam],
  );

  const go = useCallback(
    (next: number) => onStepChange(Math.max(0, Math.min(lastStep, next))),
    [onStepChange, lastStep],
  );

  // Presenter keys: ← / → and PageUp / PageDown (clickers).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        if (step < lastStep) go(step + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(step - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, lastStep, go]);

  const switchTo = (target: "overview" | Team) => {
    if (target === "overview") return go(0);
    const index = view.kind === "scenario" ? view.index : 0;
    go(stepFor(target, Math.min(index, questions[target].length - 1)));
  };

  const activeTab = view.kind === "overview" ? "overview" : view.team;
  const stepLabel =
    view.kind === "overview" ? "Overview" : `${TEAM_INFO[view.team].name} · ${view.index + 1} of ${perTeam}`;

  return (
    <div className="flex h-[100dvh] flex-col bg-canvas">
      <TopBar
        center={
          <div role="tablist" aria-label="Review section" className="flex rounded-xl border border-line bg-canvas p-1">
            {(["overview", "A", "B"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={activeTab === t}
                onClick={() => switchTo(t)}
                className={`min-h-[40px] rounded-lg px-4 text-[15px] font-semibold transition-colors ${
                  activeTab === t ? "bg-ink text-white" : "text-ink-2 hover:bg-sunken"
                }`}
              >
                {t === "overview" ? "Overview" : TEAM_INFO[t].name}
              </button>
            ))}
          </div>
        }
      />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-[clamp(10px,2.2vh,24px)] sm:px-8">
          {view.kind === "overview" ? (
            <Overview results={results} questions={questions} onJump={(team, i) => go(stepFor(team, i))} />
          ) : (
            <ScenarioReview
              key={`${view.team}-${view.index}`}
              team={view.team}
              index={view.index}
              total={questions[view.team].length}
              question={questions[view.team][view.index]}
              answer={results[view.team].answers[view.index]}
              allAnswers={results[view.team].answers}
              onJump={(i) => go(stepFor(view.team, i))}
            />
          )}
        </div>
      </main>

      <nav
        aria-label="Review navigation"
        className="flex flex-none items-center justify-between gap-3 border-t border-line bg-surface px-4 py-3 sm:px-8"
      >
        <Button size="lg" onClick={() => go(step - 1)} disabled={step === 0} aria-label="Previous">
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <p className="text-center text-[16px] font-semibold text-ink-2" aria-live="polite">
          {stepLabel}
        </p>
        {step < lastStep ? (
          <Button size="lg" variant="dark" onClick={() => go(step + 1)}>
            {step === 0 ? "Begin scenario review" : step === perTeam ? `Next: ${TEAM_INFO.B.name}` : "Next"}
            <ArrowRightIcon className="h-5 w-5" />
          </Button>
        ) : (
          <Button size="lg" variant="primary" onClick={onRevealWinner}>
            Reveal Winner
            <ArrowRightIcon className="h-5 w-5" />
          </Button>
        )}
      </nav>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Overview — counts per team and the core preparedness lessons. No scores here:
// scores are revealed on the winner screen.
// ─────────────────────────────────────────────────────────────────────────────

function Overview({
  results,
  questions,
  onJump,
}: {
  results: Record<Team, TeamResult>;
  questions: Record<Team, Question[]>;
  onJump: (team: Team, index: number) => void;
}) {
  return (
    <div className="animate-fade-up">
      <Kicker className="[@media(max-height:760px)]:hidden">Both rounds complete</Kicker>
      <h1 className="mt-1 text-[clamp(30px,2.6vw,46px)] font-extrabold leading-tight tracking-[-0.02em] text-ink">
        After-action review
      </h1>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 [@media(max-height:760px)]:mt-3">
        {(["A", "B"] as const).map((team) => (
          <TeamOverview key={team} result={results[team]} questions={questions[team]} onJump={(i) => onJump(team, i)} />
        ))}
      </div>

      <section className="mt-4 rounded-2xl border border-line bg-surface px-6 py-4 shadow-card [@media(max-height:760px)]:mt-3 [@media(max-height:760px)]:py-3">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-ink-3">Core preparedness lessons</h2>
        <ol className="mt-2.5 space-y-2">
          {CORE_LESSONS.map((lesson, i) => (
            <li key={lesson} className="flex gap-4">
              <span className="w-6 flex-none pt-0.5 font-mono text-[17px] font-bold text-alert">{i + 1}</span>
              <span className="text-[clamp(18px,1.3vw,22px)] font-medium leading-snug text-ink">{lesson}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function TeamOverview({
  result,
  questions,
  onJump,
}: {
  result: TeamResult;
  questions: Question[];
  onJump: (index: number) => void;
}) {
  const missed = result.answers
    .map((a, i) => ({ a, i }))
    .filter(({ a }) => a.outcome !== "correct");
  const stats: Array<{ label: string; value: number; outcome: DecisionOutcome }> = [
    { label: "Correct", value: result.correctAnswers, outcome: "correct" },
    { label: "Incorrect", value: result.incorrectAnswers, outcome: "incorrect" },
    { label: "Unanswered", value: result.unanswered, outcome: "unanswered" },
  ];
  const valueTone: Record<DecisionOutcome, string> = {
    correct: "text-safe",
    incorrect: "text-alert",
    unanswered: "text-caution",
  };

  return (
    <section className="rounded-2xl border border-line bg-surface px-6 py-4 shadow-card" aria-label={`${TEAM_INFO[result.team].name} summary`}>
      <TeamChip team={result.team} size="lg" />
      <dl className="mt-3 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-canvas px-3 py-2.5 text-center">
            <dt className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-3">{s.label}</dt>
            <dd className={`mt-1 font-mono text-[clamp(36px,3.2vw,52px)] font-bold leading-none ${valueTone[s.outcome]}`}>
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[14px] font-semibold text-ink-2">Review focus:</span>
        {missed.length === 0 ? (
          <span className="text-[14px] font-medium text-safe">No missed decisions</span>
        ) : (
          missed.map(({ a, i }) => {
            const st = OUTCOME_STYLE[a.outcome];
            return (
              <button
                key={a.questionId}
                type="button"
                onClick={() => onJump(i)}
                title={questions[i]?.scenario}
                aria-label={`Scenario ${i + 1}: ${st.label}`}
                className={`inline-flex h-10 min-w-[48px] items-center justify-center gap-1 rounded-lg border px-2 font-mono text-[16px] font-bold ${st.chip}`}
              >
                {i + 1}
                <st.Icon className="h-4 w-4" />
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// One scenario per screen
// ─────────────────────────────────────────────────────────────────────────────

function ScenarioReview({
  team,
  index,
  total,
  question,
  answer,
  allAnswers,
  onJump,
}: {
  team: Team;
  index: number;
  total: number;
  question: Question;
  answer: AnswerRecord | undefined;
  allAnswers: AnswerRecord[];
  onJump: (index: number) => void;
}) {
  const [notesOpen, setNotesOpen] = useState(false);
  const outcome: DecisionOutcome = answer?.outcome ?? "unanswered";
  const st = OUTCOME_STYLE[outcome];
  const selected = answer?.selectedAnswer ?? null;
  const teamName = TEAM_INFO[team].name;
  const meta = getScenarioMeta(question.id);

  return (
    <article className="animate-fade-up" aria-labelledby={`aar-${question.id}`}>
      <div className="flex flex-wrap items-center gap-3">
        <TeamChip team={team} />
        <span className="text-[15px] font-bold uppercase tracking-[0.14em] text-ink-3">
          Scenario {index + 1} of {total}
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-[15px] font-bold ${st.badge}`}>
          <st.Icon className="h-4 w-4" />
          {st.label}
        </span>
      </div>

      <h1
        id={`aar-${question.id}`}
        className="mt-3 text-[clamp(28px,2.6vw,44px)] font-extrabold leading-[1.12] tracking-[-0.02em] text-ink"
      >
        {question.scenario}
      </h1>

      <div className="mt-5 grid gap-3">
        {outcome === "correct" && selected ? (
          <AnswerRow tone="safe" label={`${teamName} selected the correct action`} optionKey={selected} text={question.options[selected]} />
        ) : (
          <>
            {selected ? (
              <AnswerRow tone="alert" label={`${teamName} selected`} optionKey={selected} text={question.options[selected]} />
            ) : (
              <AnswerRow tone="caution" label={`${teamName} selected`} optionKey={null} text="No decision — time expired" />
            )}
            <AnswerRow
              tone="safe"
              label="Correct action"
              optionKey={question.correctAnswer}
              text={question.options[question.correctAnswer]}
            />
          </>
        )}
      </div>

      <div className="mt-5 border-l-4 border-alert pl-5">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-alert">Key learning point</p>
        <p className="mt-1 text-[clamp(20px,1.6vw,30px)] font-semibold leading-snug text-ink">{meta.keyPoint}</p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" aria-label={`${teamName} scenarios`}>
          {allAnswers.map((a, i) => {
            const s = OUTCOME_STYLE[a.outcome];
            const current = i === index;
            return (
              <button
                key={a.questionId}
                type="button"
                onClick={() => onJump(i)}
                aria-current={current ? "step" : undefined}
                aria-label={`Scenario ${i + 1}: ${s.label}`}
                className={`inline-flex h-11 min-w-[52px] items-center justify-center gap-1 rounded-lg border px-2 font-mono text-[16px] font-bold ${s.chip} ${
                  current ? "ring-2 ring-ink ring-offset-2 ring-offset-canvas" : ""
                }`}
              >
                {i + 1}
                <s.Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setNotesOpen((o) => !o)}
          aria-expanded={notesOpen}
          className="min-h-[44px] rounded-lg px-3 text-[15px] font-semibold text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink"
        >
          {notesOpen ? "Hide facilitator notes" : "Facilitator notes"}
        </button>
      </div>

      {notesOpen && (
        <div className="mt-3 space-y-3 rounded-xl border border-line bg-surface px-5 py-4 text-[17px] leading-relaxed text-ink-2">
          <p>
            <span className="font-bold text-ink">Scenario: </span>
            {question.question}
          </p>
          <p>
            <span className="font-bold text-ink">Lesson: </span>
            {question.lesson}
          </p>
        </div>
      )}
    </article>
  );
}

const ROW_TONES = {
  safe: { box: "border-safe-line bg-safe-soft", label: "text-safe", key: "border-safe bg-safe text-white" },
  alert: { box: "border-alert-line bg-alert-soft", label: "text-alert", key: "border-alert bg-alert text-white" },
  caution: {
    box: "border-caution-line border-dashed bg-caution-soft",
    label: "text-caution",
    key: "border-caution bg-surface text-caution",
  },
} as const;

function AnswerRow({
  tone,
  label,
  optionKey,
  text,
}: {
  tone: keyof typeof ROW_TONES;
  label: string;
  optionKey: OptionKey | null;
  text: string;
}) {
  const t = ROW_TONES[tone];
  return (
    <div className={`rounded-xl border-2 px-5 py-4 ${t.box}`}>
      <p className={`text-[13px] font-bold uppercase tracking-[0.14em] ${t.label}`}>{label}</p>
      <div className="mt-2 flex items-start gap-4">
        <span
          className={`flex h-11 w-11 flex-none items-center justify-center rounded-lg border-2 font-mono text-[20px] font-bold ${t.key}`}
          aria-hidden="true"
        >
          {optionKey ?? "–"}
        </span>
        <p className="pt-1 text-[clamp(20px,1.5vw,28px)] font-semibold leading-snug text-ink">
          {optionKey && <span className="sr-only-live">Option {optionKey}: </span>}
          {text}
        </p>
      </div>
    </div>
  );
}

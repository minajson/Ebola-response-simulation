"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { OptionKey, Question, Team } from "@/data/questions";
import type { TeamResult } from "@/lib/types";
import RoundHeader from "@/components/RoundHeader";
import ScenarioCard, { OPTION_KEYS } from "@/components/ScenarioCard";
import StatusPanel, { type LastDecision } from "@/components/StatusPanel";
import { ClockIcon } from "@/components/ui/icons";
import {
  COUNTDOWN_BEEPS_FROM,
  COUNTDOWN_FINAL_FROM,
  LOCK_TRANSITION_MS,
  ROUND_SECONDS,
  TIMEOUT_HOLD_MS,
  TIMER_AMBER_AT,
  TIMER_RED_AT,
} from "@/lib/config";
import { buildTeamResult, initialProgress, recordDecision, type RoundProgress } from "@/lib/round";
import { getExposureLabel, getOutbreakLabel, getOutbreakRisk } from "@/lib/scoring";
import { playCue } from "@/lib/sound";
import { useCountdown } from "@/lib/useCountdown";

interface TeamRoundProps {
  team: Team;
  questions: Question[];
  onComplete: (result: TeamResult) => void;
}

type RoundStatus = "playing" | "locking" | "allAnswered" | "expired";

export default function TeamRound({ team, questions, onComplete }: TeamRoundProps) {
  const [progress, setProgress] = useState<RoundProgress>(() => initialProgress());
  const [index, setIndex] = useState(0);
  const [lockedKey, setLockedKey] = useState<OptionKey | null>(null);
  const [status, setStatus] = useState<RoundStatus>("playing");
  const [lastDecision, setLastDecision] = useState<LastDecision | null>(null);
  const [alerts, setAlerts] = useState({ exposure: 0, outbreak: 0 });
  const [announcement, setAnnouncement] = useState("");

  // Refs mirror state for handlers/timeouts so nothing reads a stale closure.
  const progressRef = useRef(progress);
  const statusRef = useRef<RoundStatus>("playing");
  const indexRef = useRef(0);
  const remainingRef = useRef(ROUND_SECONDS);
  const finishedRef = useRef(false);
  const warnedRef = useRef<Set<number>>(new Set());
  const pendingRef = useRef<number[]>([]);
  const startedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const setRoundStatus = (s: RoundStatus) => {
    statusRef.current = s;
    setStatus(s);
  };

  const schedule = (fn: () => void, ms: number) => {
    pendingRef.current.push(window.setTimeout(fn, ms));
  };

  const finish = useCallback(
    (completedBeforeTime: boolean) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onCompleteRef.current(
        buildTeamResult(team, questions, progressRef.current, completedBeforeTime, remainingRef.current),
      );
    },
    [team, questions],
  );

  // Incident-start alert — exactly once per round, even under StrictMode.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    playCue("incident");
  }, []);

  // Clear any pending transitions on unmount (restart / navigation).
  useEffect(() => {
    const pending = pendingRef.current;
    return () => {
      pending.forEach((id) => window.clearTimeout(id));
      pending.length = 0;
    };
  }, []);

  const onSecond = useCallback((sec: number, prev: number) => {
    remainingRef.current = sec;
    const warn = (threshold: number, cue: "warn45" | "warn20", message: string) => {
      if (prev > threshold && sec <= threshold && !warnedRef.current.has(threshold)) {
        warnedRef.current.add(threshold);
        playCue(cue);
        setAnnouncement(message);
      }
    };
    warn(TIMER_AMBER_AT, "warn45", `${TIMER_AMBER_AT} seconds remaining`);
    warn(TIMER_RED_AT, "warn20", `${TIMER_RED_AT} seconds remaining`);
    if (sec >= 1 && sec <= COUNTDOWN_BEEPS_FROM) {
      playCue(sec <= COUNTDOWN_FINAL_FROM ? "tickFinal" : "tick");
      if (sec === COUNTDOWN_BEEPS_FROM) setAnnouncement(`${COUNTDOWN_BEEPS_FROM} seconds remaining`);
    }
  }, []);

  const onExpire = useCallback(() => {
    if (finishedRef.current || statusRef.current === "allAnswered") return;
    remainingRef.current = 0;
    setRoundStatus("expired");
    setLockedKey(null);
    setAnnouncement("Time expired. Round closed.");
    playCue("timeout");
    schedule(() => finish(false), TIMEOUT_HOLD_MS);
  }, [finish]);

  const running = status === "playing" || status === "locking";
  const seconds = useCountdown(ROUND_SECONDS, running, onSecond, onExpire);

  const handleSelect = useCallback(
    (key: OptionKey) => {
      if (finishedRef.current || statusRef.current !== "playing") return;
      const i = indexRef.current;
      const question = questions[i];
      if (!question) return;

      // Record the decision immediately, so a timeout during the transition cannot lose it.
      const before = progressRef.current;
      const after = recordDecision(before, question, key);
      progressRef.current = after;
      setProgress(after);
      setLockedKey(key);
      setLastDecision({ record: after.records[after.records.length - 1], question });
      playCue("lock");

      // One-off alert when an indicator first enters its high band.
      const exposureCrossed = getExposureLabel(before.exposure) !== "High" && getExposureLabel(after.exposure) === "High";
      const outbreakCrossed =
        getOutbreakLabel(getOutbreakRisk(before.exposure)) !== "Critical" &&
        getOutbreakLabel(getOutbreakRisk(after.exposure)) === "Critical";
      if (exposureCrossed || outbreakCrossed) {
        setAlerts((a) => ({
          exposure: a.exposure + (exposureCrossed ? 1 : 0),
          outbreak: a.outbreak + (outbreakCrossed ? 1 : 0),
        }));
        // Keep the final countdown clean: no risk alarm over the last-10-second beeps.
        if (remainingRef.current > COUNTDOWN_BEEPS_FROM) playCue("riskHigh", 0.16);
      }

      if (i + 1 >= questions.length) {
        setRoundStatus("allAnswered"); // stops the clock — speed bonus earned
        setAnnouncement("All decisions locked.");
        schedule(() => finish(true), LOCK_TRANSITION_MS);
      } else {
        setRoundStatus("locking");
        schedule(() => {
          if (finishedRef.current || statusRef.current !== "locking") return;
          indexRef.current = i + 1;
          setIndex(i + 1);
          setLockedKey(null);
          setRoundStatus("playing");
        }, LOCK_TRANSITION_MS);
      }
    },
    [questions, finish],
  );

  // Keyboard: A–D or 1–4 select an option.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const k = e.key.toUpperCase();
      const byLetter = OPTION_KEYS.find((o) => o === k);
      const byNumber = ["1", "2", "3", "4"].indexOf(e.key);
      const key = byLetter ?? (byNumber >= 0 ? OPTION_KEYS[byNumber] : undefined);
      if (key) {
        e.preventDefault();
        handleSelect(key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSelect]);

  const question = questions[index];
  const answered = progress.records.length;

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-canvas">
      <RoundHeader
        team={team}
        scenarioNumber={index + 1}
        totalScenarios={questions.length}
        score={progress.score}
        seconds={seconds}
      />

      <main className="relative grid min-h-0 flex-1 grid-cols-1 gap-4 p-3 md:grid-cols-[minmax(0,1fr)_clamp(250px,23vw,340px)] lg:gap-5 lg:p-5">
        <ScenarioCard
          question={question}
          questionNumber={index + 1}
          totalQuestions={questions.length}
          lockedKey={lockedKey}
          disabled={status !== "playing"}
          onSelect={handleSelect}
        />
        <div className="hidden min-h-0 md:block">
          <StatusPanel
            exposure={progress.exposure}
            lastDecision={lastDecision}
            answered={answered}
            total={questions.length}
            currentIndex={index}
            exposureAlert={alerts.exposure}
            outbreakAlert={alerts.outbreak}
          />
        </div>

        {status === "expired" && <TimeExpiredNotice answered={answered} total={questions.length} />}
      </main>

      <p className="sr-only-live" aria-live="assertive">
        {announcement}
      </p>
    </div>
  );
}

function TimeExpiredNotice({ answered, total }: { answered: number; total: number }) {
  const unanswered = total - answered;
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-canvas/85 p-6" role="alertdialog" aria-label="Time expired">
      <div className="w-full max-w-xl animate-reveal-in rounded-2xl border-2 border-alert-line bg-surface px-8 py-8 text-center shadow-raised">
        <ClockIcon className="mx-auto h-10 w-10 text-alert" />
        <p className="mt-3 text-[13px] font-bold uppercase tracking-[0.16em] text-alert">Time expired</p>
        <p className="mt-2 text-[30px] font-bold leading-tight text-ink">Round closed</p>
        <p className="mt-2 text-[18px] font-medium text-ink-2">
          {unanswered > 0
            ? `${unanswered} scenario${unanswered === 1 ? "" : "s"} recorded as unanswered.`
            : "All decisions were recorded."}
        </p>
      </div>
    </div>
  );
}

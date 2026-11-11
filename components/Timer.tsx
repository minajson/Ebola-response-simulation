"use client";

import {
  COUNTDOWN_BEEPS_FROM,
  formatClock,
  ROUND_SECONDS,
  TIMER_AMBER_AT,
  TIMER_RED_AT,
} from "@/lib/config";

export type TimerTone = "normal" | "amber" | "red";

export function timerTone(seconds: number): TimerTone {
  if (seconds <= TIMER_RED_AT) return "red";
  if (seconds <= TIMER_AMBER_AT) return "amber";
  return "normal";
}

const TONE_STYLES: Record<TimerTone, { box: string; digits: string; label: string }> = {
  normal: { box: "border-line bg-surface", digits: "text-ink", label: "text-ink-3" },
  amber: { box: "border-caution-line bg-caution-soft", digits: "text-caution", label: "text-caution" },
  red: { box: "border-alert-line bg-alert-soft", digits: "text-alert", label: "text-alert" },
};

/** Large countdown display. Timing and sounds live in the round (useCountdown). */
export default function Timer({ seconds }: { seconds: number }) {
  const tone = timerTone(seconds);
  const s = TONE_STYLES[tone];
  const counting = seconds > 0 && seconds <= COUNTDOWN_BEEPS_FROM;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-1.5 transition-colors duration-300 ${s.box}`}
      role="timer"
      aria-label={`Time remaining ${formatClock(seconds)}`}
    >
      <div className="leading-none">
        <p className={`text-[11px] font-bold uppercase tracking-[0.14em] ${s.label}`}>Time left</p>
        <p className={`mt-1 text-[11px] font-medium ${s.label} opacity-80`}>of {formatClock(ROUND_SECONDS)}</p>
      </div>
      <span
        key={counting ? seconds : "steady"}
        className={`font-mono text-[clamp(34px,3.1vw,52px)] font-bold leading-none tabular ${s.digits} ${
          counting ? "animate-tick-pop" : ""
        }`}
      >
        {formatClock(seconds)}
      </span>
    </div>
  );
}

/** Thin full-width time bar under the header — readable at a glance on a shared screen. */
export function TimeBar({ seconds }: { seconds: number }) {
  const tone = timerTone(seconds);
  const pct = Math.max(0, Math.min(100, (seconds / ROUND_SECONDS) * 100));
  const fill = tone === "red" ? "bg-alert" : tone === "amber" ? "bg-caution-fill" : "bg-ink";
  return (
    <div className="h-1.5 w-full flex-none bg-sunken" aria-hidden="true">
      <div className={`h-full transition-[width] duration-1000 ease-linear ${fill}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

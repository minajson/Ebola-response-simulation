"use client";

import { useEffect, useState } from "react";

export type RiskLevel = "ok" | "warn" | "high";

const LEVEL_STYLES: Record<RiskLevel, { bar: string; badge: string; card: string }> = {
  ok: { bar: "bg-safe-fill", badge: "bg-safe-soft text-safe border-safe-line", card: "border-line" },
  warn: { bar: "bg-caution-fill", badge: "bg-caution-soft text-caution border-caution-line", card: "border-line" },
  high: { bar: "bg-alert", badge: "bg-alert-soft text-alert border-alert-line", card: "border-alert-line" },
};

interface RiskMeterProps {
  title: string;
  value: number;
  level: RiskLevel;
  levelText: string;
  detail: string;
  /** Threshold positions (0–100) drawn as subtle ticks on the bar. */
  thresholds?: number[];
  /** Increment to trigger a one-off shake + red pulse (entering high risk). */
  alertKey: number;
}

/** Animated simulation indicator. Not an infection probability. */
export default function RiskMeter({ title, value, level, levelText, detail, thresholds = [], alertKey }: RiskMeterProps) {
  const [alerting, setAlerting] = useState(false);
  const s = LEVEL_STYLES[level];
  const pct = Math.max(0, Math.min(100, Math.round(value)));

  useEffect(() => {
    if (alertKey <= 0) return;
    setAlerting(true);
    const id = window.setTimeout(() => setAlerting(false), 2600);
    return () => window.clearTimeout(id);
  }, [alertKey]);

  return (
    <div className={alerting ? "animate-shake" : undefined}>
      <div
        className={`rounded-xl border-2 bg-surface px-4 py-3.5 transition-colors duration-500 ${s.card} ${
          alerting ? "animate-pulse-ring" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[13px] font-bold uppercase leading-tight tracking-[0.12em] text-ink-3">{title}</p>
          <span className={`flex-none rounded-md border px-2 py-0.5 text-[14px] font-bold ${s.badge}`}>{levelText}</span>
        </div>
        <div className="mt-2.5 flex items-center gap-3">
          <div
            className="relative h-3.5 flex-1 overflow-hidden rounded-full bg-sunken"
            role="meter"
            aria-label={title}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-valuetext={`${levelText}, ${pct}`}
          >
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-[width,background-color] duration-700 ease-out ${s.bar}`}
              style={{ width: `${pct}%` }}
            />
            {thresholds.map((t) => (
              <span key={t} className="absolute inset-y-0 w-px bg-white/90" style={{ left: `${t}%` }} aria-hidden="true" />
            ))}
          </div>
          <span className="w-11 text-right font-mono text-[20px] font-bold text-ink tabular">{pct}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-[15px] font-medium leading-snug text-ink-2">{detail}</p>
      </div>
    </div>
  );
}

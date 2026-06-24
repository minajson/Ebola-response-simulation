"use client";

import { useEffect, useRef, useState } from "react";
import { playAlert10, playAlert30, playAlert60, playTimeUp } from "@/lib/sound";

// ─────────────────────────────────────────────────────────────────────────────
// TIMER CONFIG — 3 minutes per round
// ─────────────────────────────────────────────────────────────────────────────
export const ROUND_SECONDS = 180;

interface TimerProps {
  onExpire: () => void;
  paused?: boolean;
}

export default function Timer({ onExpire, paused = false }: TimerProps) {
  const [seconds, setSeconds] = useState(ROUND_SECONDS);
  const alertsFired = useRef<Set<number>>(new Set());
  const expiredRef = useRef(false);

  useEffect(() => {
    if (paused || expiredRef.current) return;

    const id = setInterval(() => {
      setSeconds((prev) => {
        const next = prev - 1;

        // 60s — soft beep (once)
        if (next === 60 && !alertsFired.current.has(60)) {
          alertsFired.current.add(60);
          playAlert60();
        }
        // 30s — stronger beep (once)
        if (next === 30 && !alertsFired.current.has(30)) {
          alertsFired.current.add(30);
          playAlert30();
        }
        // 1–10s — urgent beep every second
        if (next <= 10 && next > 0) {
          playAlert10();
        }

        if (next <= 0) {
          clearInterval(id);
          expiredRef.current = true;
          playTimeUp();
          onExpire();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [paused, onExpire]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const isUrgent = seconds <= 30;
  const isWarning = seconds <= 60 && seconds > 30;
  const percentage = (seconds / ROUND_SECONDS) * 100;

  return (
    <div
      className={`rounded-xl border p-4 text-center transition-all ${
        isUrgent
          ? "border-red-400 bg-red-50 shadow-md shadow-red-100"
          : isWarning
          ? "border-amber-400 bg-amber-50 shadow-md shadow-amber-100"
          : "border-slate-200 bg-white shadow-sm"
      }`}
    >
      <p className="text-sm uppercase tracking-widest text-slate-500 mb-1 font-semibold">
        Round Timer
      </p>
      <div
        className={`text-5xl font-mono font-bold tabular-nums leading-none ${
          isUrgent
            ? "text-red-600 animate-pulse"
            : isWarning
            ? "text-amber-600"
            : "text-slate-800"
        }`}
      >
        {display}
      </div>

      <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isUrgent ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isUrgent && (
        <p className="mt-2 text-xs font-bold text-red-600 animate-pulse uppercase tracking-wider">
          ⚠ Time Critical
        </p>
      )}
    </div>
  );
}

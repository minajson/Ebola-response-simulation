"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Deadline-based countdown. Safe under React StrictMode and re-renders:
 * • the deadline lives in a ref, so re-running the effect never resets it;
 * • `onSecond` fires exactly once per whole-second change, outside setState;
 * • `onExpire` fires at most once.
 * Stopping (`running = false`) freezes the remaining time.
 */
export function useCountdown(
  totalSeconds: number,
  running: boolean,
  onSecond: (remaining: number, previous: number) => void,
  onExpire: () => void,
): number {
  const [remaining, setRemaining] = useState(totalSeconds);
  const endAtRef = useRef<number | null>(null);
  const lastRef = useRef(totalSeconds);
  const expiredRef = useRef(false);
  const callbacks = useRef({ onSecond, onExpire });
  callbacks.current = { onSecond, onExpire };

  useEffect(() => {
    if (!running || expiredRef.current) {
      endAtRef.current = null;
      return;
    }
    if (endAtRef.current === null) {
      endAtRef.current = performance.now() + lastRef.current * 1000;
    }
    const tick = () => {
      if (endAtRef.current === null || expiredRef.current) return;
      const next = Math.max(0, Math.ceil((endAtRef.current - performance.now()) / 1000));
      if (next === lastRef.current) return;
      const previous = lastRef.current;
      lastRef.current = next;
      setRemaining(next);
      callbacks.current.onSecond(next, previous);
      if (next === 0) {
        expiredRef.current = true;
        callbacks.current.onExpire();
      }
    };
    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [running]);

  return remaining;
}

"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PRESENTER PREFERENCES — sound, reduced motion and fullscreen.
// Shared by every screen. Keyboard: M = mute, F = fullscreen.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { setMuted as setEngineMuted } from "@/lib/sound";

interface Preferences {
  muted: boolean;
  reduceMotion: boolean;
  isFullscreen: boolean;
  fullscreenSupported: boolean;
  toggleMute: () => void;
  toggleReduceMotion: () => void;
  toggleFullscreen: () => void;
}

const PreferencesContext = createContext<Preferences | null>(null);

const MUTE_KEY = "ebola.muted";
const MOTION_KEY = "ebola.reduceMotion";

function readStored(key: string): boolean | null {
  try {
    const v = window.localStorage.getItem(key);
    return v === null ? null : v === "1";
  } catch {
    return null;
  }
}

function writeStored(key: string, value: boolean): void {
  try {
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch {
    /* storage unavailable — preference lasts for this session only */
  }
}

type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};
type FsElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };

function fullscreenElement(): Element | null {
  const d = document as FsDocument;
  return d.fullscreenElement ?? d.webkitFullscreenElement ?? null;
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);

  // Load stored preferences after hydration.
  useEffect(() => {
    const storedMute = readStored(MUTE_KEY);
    if (storedMute !== null) setMuted(storedMute);
    const storedMotion = readStored(MOTION_KEY);
    if (storedMotion !== null) setReduceMotion(storedMotion);
    else setReduceMotion(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

    const el = document.documentElement as FsElement;
    setFullscreenSupported(Boolean(el.requestFullscreen || el.webkitRequestFullscreen));
    const onChange = () => setIsFullscreen(Boolean(fullscreenElement()));
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  useEffect(() => {
    setEngineMuted(muted);
  }, [muted]);

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = reduceMotion ? "true" : "false";
  }, [reduceMotion]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      writeStored(MUTE_KEY, !m);
      return !m;
    });
  }, []);

  const toggleReduceMotion = useCallback(() => {
    setReduceMotion((r) => {
      writeStored(MOTION_KEY, !r);
      return !r;
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    const d = document as FsDocument;
    const el = document.documentElement as FsElement;
    try {
      if (fullscreenElement()) {
        void (d.exitFullscreen ? d.exitFullscreen() : d.webkitExitFullscreen?.());
      } else {
        void (el.requestFullscreen ? el.requestFullscreen() : el.webkitRequestFullscreen?.());
      }
    } catch {
      /* fullscreen refused (e.g. iframe without permission) */
    }
  }, []);

  // Global presenter shortcuts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const k = e.key.toLowerCase();
      if (k === "m") toggleMute();
      else if (k === "f") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleMute, toggleFullscreen]);

  const value = useMemo<Preferences>(
    () => ({
      muted,
      reduceMotion,
      isFullscreen,
      fullscreenSupported,
      toggleMute,
      toggleReduceMotion,
      toggleFullscreen,
    }),
    [muted, reduceMotion, isFullscreen, fullscreenSupported, toggleMute, toggleReduceMotion, toggleFullscreen],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): Preferences {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used inside <PreferencesProvider>");
  return ctx;
}

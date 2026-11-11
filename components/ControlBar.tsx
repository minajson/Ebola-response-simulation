"use client";

import { usePreferences } from "@/lib/preferences";
import {
  CompressIcon,
  ExpandIcon,
  MotionIcon,
  MotionOffIcon,
  SoundOffIcon,
  SoundOnIcon,
} from "@/components/ui/icons";

/**
 * Presenter controls: Mute Sound, Reduce Motion, Fullscreen.
 * Always visible with text labels on presentation-size screens;
 * keyboard (Tab/Enter, plus M and F shortcuts) and touch operable.
 */
export default function ControlBar({ compact = false }: { compact?: boolean }) {
  const p = usePreferences();
  const labelClass = compact ? "hidden xl:inline" : "hidden md:inline";

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Presenter controls">
      <ControlButton
        pressed={p.muted}
        onClick={p.toggleMute}
        label={p.muted ? "Sound muted" : "Mute sound"}
        ariaLabel="Mute sound (M)"
        labelClass={labelClass}
        pressedStyle="border-caution-line bg-caution-soft text-caution"
      >
        {p.muted ? <SoundOffIcon /> : <SoundOnIcon />}
      </ControlButton>
      <ControlButton
        pressed={p.reduceMotion}
        onClick={p.toggleReduceMotion}
        label="Reduce motion"
        ariaLabel="Reduce motion"
        labelClass={labelClass}
        pressedStyle="border-ink bg-ink text-white"
      >
        {p.reduceMotion ? <MotionOffIcon /> : <MotionIcon />}
      </ControlButton>
      {p.fullscreenSupported && (
        <ControlButton
          onClick={p.toggleFullscreen}
          label={p.isFullscreen ? "Exit full screen" : "Full screen"}
          ariaLabel={p.isFullscreen ? "Exit full screen (F)" : "Enter full screen (F)"}
          labelClass={labelClass}
        >
          {p.isFullscreen ? <CompressIcon /> : <ExpandIcon />}
        </ControlButton>
      )}
    </div>
  );
}

function ControlButton({
  pressed,
  onClick,
  label,
  ariaLabel,
  labelClass,
  pressedStyle = "",
  children,
}: {
  pressed?: boolean;
  onClick: () => void;
  label: string;
  ariaLabel: string;
  labelClass: string;
  pressedStyle?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={onClick}
      className={`inline-flex h-11 min-w-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-2.5 text-[14px] font-semibold transition-colors ${
        pressed ? pressedStyle : "border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink"
      }`}
    >
      {children}
      <span className={labelClass}>{label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOUND ENGINE — Web Audio API, synthesised locally (no audio files, no network).
//
// • Audio is unlocked by calling unlockAudio() inside a user gesture (Start button).
// • Alarm-class cues are serialised so they never overlap each other.
// • There is deliberately no "correct" or "wrong" answer sound.
// • Every cue dispatches a window "ebola:sound" event (useful for testing).
// ─────────────────────────────────────────────────────────────────────────────

export type Cue =
  | "incident" // restrained incident-start alert
  | "lock" // subtle selection-lock tone
  | "warn45" // single warning tone
  | "warn20" // stronger warning
  | "tick" // countdown beep (10 → 4 s)
  | "tickFinal" // stronger final countdown beep (3 → 1 s)
  | "timeout" // time-expired alarm
  | "riskHigh" // risk indicator entered high/critical
  | "reveal" // soft swell while scores count up
  | "celebrate"; // short winner celebration

const MASTER_VOLUME = 0.9;

/** Cues that must never overlap one another. */
const ALARM_CUES: ReadonlySet<Cue> = new Set<Cue>([
  "incident",
  "warn45",
  "warn20",
  "timeout",
  "riskHigh",
  "celebrate",
]);

/** Approximate audible length of each cue, in seconds. */
const CUE_SECONDS: Record<Cue, number> = {
  incident: 1.35,
  lock: 0.12,
  warn45: 0.8,
  warn20: 0.55,
  tick: 0.08,
  tickFinal: 0.16,
  timeout: 1.25,
  riskHigh: 0.62,
  reveal: 1.4,
  celebrate: 1.8,
};

/** If an alarm would have to wait longer than this, it is dropped instead of piling up. */
const MAX_ALARM_QUEUE_SECONDS = 1.5;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;
let alarmBusyUntil = 0;

type AudioContextCtor = typeof AudioContext;

function getCtor(): AudioContextCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { AudioContext?: AudioContextCtor; webkitAudioContext?: AudioContextCtor };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

/** Create/resume the audio context. Must be called from a user gesture. */
export function unlockAudio(): void {
  const Ctor = getCtor();
  if (!Ctor) return;
  try {
    if (!ctx) {
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : MASTER_VOLUME;
      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -10;
      limiter.ratio.value = 6;
      master.connect(limiter);
      limiter.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    // A one-sample silent buffer completes the unlock on iOS/Safari.
    const buffer = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start(0);
  } catch {
    // Audio is an enhancement; the game works without it.
  }
}

export function setMuted(value: boolean): void {
  muted = value;
  if (ctx && master) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(value ? 0 : MASTER_VOLUME, ctx.currentTime, 0.015);
  }
}

export function isMuted(): boolean {
  return muted;
}

interface ToneOptions {
  freq: number;
  dur: number;
  vol: number;
  type?: OscillatorType;
  glideTo?: number;
  attack?: number;
  lowpass?: number;
}

function tone(t0: number, o: ToneOptions): void {
  if (!ctx || !master) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(o.freq, t0);
  if (o.glideTo) osc.frequency.exponentialRampToValueAtTime(o.glideTo, t0 + o.dur);

  const attack = o.attack ?? 0.008;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(o.vol, t0 + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);

  let node: AudioNode = osc;
  if (o.lowpass) {
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = o.lowpass;
    osc.connect(filter);
    node = filter;
  }
  node.connect(gain);
  gain.connect(master);
  osc.start(t0);
  osc.stop(t0 + o.dur + 0.05);
}

const SYNTHS: Record<Cue, (t: number) => void> = {
  incident: (t) => {
    // Two-tone hi-lo alert, twice. Soft triangle wave — attention, not panic.
    for (let i = 0; i < 2; i++) {
      const s = t + i * 0.66;
      tone(s, { freq: 932, dur: 0.28, vol: 0.16, type: "triangle" });
      tone(s + 0.3, { freq: 698, dur: 0.32, vol: 0.16, type: "triangle" });
    }
  },
  lock: (t) => {
    tone(t, { freq: 560, glideTo: 430, dur: 0.1, vol: 0.13 });
    tone(t, { freq: 1700, dur: 0.035, vol: 0.035 });
  },
  warn45: (t) => {
    tone(t, { freq: 784, dur: 0.75, vol: 0.17 });
    tone(t, { freq: 1568, dur: 0.45, vol: 0.035 });
  },
  warn20: (t) => {
    tone(t, { freq: 880, dur: 0.2, vol: 0.18, type: "square", lowpass: 1900 });
    tone(t + 0.26, { freq: 880, dur: 0.26, vol: 0.18, type: "square", lowpass: 1900 });
  },
  tick: (t) => {
    tone(t, { freq: 1000, dur: 0.07, vol: 0.11 });
  },
  tickFinal: (t) => {
    tone(t, { freq: 1250, dur: 0.15, vol: 0.2, type: "triangle" });
    tone(t, { freq: 625, dur: 0.15, vol: 0.07 });
  },
  timeout: (t) => {
    tone(t, { freq: 554, dur: 0.34, vol: 0.2, type: "sawtooth", lowpass: 1500 });
    tone(t + 0.42, { freq: 554, dur: 0.34, vol: 0.2, type: "sawtooth", lowpass: 1500 });
    tone(t + 0.84, { freq: 415, dur: 0.4, vol: 0.2, type: "sawtooth", lowpass: 1300 });
  },
  riskHigh: (t) => {
    tone(t, { freq: 330, dur: 0.22, vol: 0.2, type: "triangle" });
    tone(t, { freq: 660, dur: 0.18, vol: 0.05 });
    tone(t + 0.28, { freq: 330, dur: 0.32, vol: 0.2, type: "triangle" });
    tone(t + 0.28, { freq: 660, dur: 0.25, vol: 0.05 });
  },
  reveal: (t) => {
    tone(t, { freq: 196, glideTo: 392, dur: 1.35, vol: 0.07, attack: 0.7 });
    tone(t, { freq: 294, glideTo: 587, dur: 1.35, vol: 0.035, attack: 0.7 });
  },
  celebrate: (t) => {
    const run = [392, 523.25, 659.25, 783.99];
    run.forEach((f, i) => tone(t + i * 0.11, { freq: f, dur: 0.26, vol: 0.12, type: "triangle" }));
    const chord = t + 0.5;
    [523.25, 659.25, 783.99].forEach((f) =>
      tone(chord, { freq: f, dur: 1.2, vol: 0.085, type: "triangle", attack: 0.02 }),
    );
    tone(chord, { freq: 1046.5, dur: 0.9, vol: 0.035 });
  },
};

function emit(cue: Cue, played: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent("ebola:sound", { detail: { cue, muted, played } }));
  } catch {
    /* ignore */
  }
}

/** Play a cue. `delaySeconds` offsets the start (used to avoid stepping on the lock tone). */
export function playCue(cue: Cue, delaySeconds = 0): void {
  if (muted || !ctx || !master) {
    emit(cue, false);
    return;
  }
  try {
    if (ctx.state === "suspended") void ctx.resume();
    let t0 = ctx.currentTime + 0.01 + delaySeconds;
    if (ALARM_CUES.has(cue)) {
      if (alarmBusyUntil > t0) {
        if (alarmBusyUntil - t0 > MAX_ALARM_QUEUE_SECONDS) {
          emit(cue, false);
          return;
        }
        t0 = alarmBusyUntil + 0.06;
      }
      alarmBusyUntil = t0 + CUE_SECONDS[cue];
    }
    SYNTHS[cue](t0);
    emit(cue, true);
  } catch {
    emit(cue, false);
  }
}

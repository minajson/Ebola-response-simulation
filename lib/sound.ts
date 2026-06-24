// ─────────────────────────────────────────────────────────────────────────────
// SOUND LIBRARY — Web Audio API (no external files required)
// All sounds are generated programmatically.
// ─────────────────────────────────────────────────────────────────────────────

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  volume: number = 0.3,
  type: OscillatorType = "sine",
  startOffset: number = 0,
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + startOffset);

  gainNode.gain.setValueAtTime(0, ctx.currentTime + startOffset);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + startOffset + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);

  oscillator.start(ctx.currentTime + startOffset);
  oscillator.stop(ctx.currentTime + startOffset + duration + 0.05);
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC SOUND FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Soft double-beep alert at 60 seconds remaining */
export function playAlert60(): void {
  playTone(440, 0.3, 0.2, "sine", 0);
  playTone(440, 0.3, 0.2, "sine", 0.4);
}

/** Stronger double-beep at 30 seconds remaining */
export function playAlert30(): void {
  playTone(660, 0.35, 0.35, "square", 0);
  playTone(660, 0.35, 0.35, "square", 0.45);
  playTone(880, 0.35, 0.35, "square", 0.9);
}

/** Urgent rapid countdown beep at 10 seconds remaining */
export function playAlert10(): void {
  for (let i = 0; i < 5; i++) {
    playTone(1100, 0.1, 0.5, "sawtooth", i * 0.2);
  }
}

/** Short positive confirm sound for correct answers */
export function playCorrect(): void {
  playTone(523, 0.12, 0.25, "sine", 0);
  playTone(659, 0.12, 0.25, "sine", 0.12);
  playTone(784, 0.2, 0.25, "sine", 0.24);
}

/** Short negative buzz for wrong answers */
export function playWrong(): void {
  playTone(220, 0.1, 0.3, "sawtooth", 0);
  playTone(180, 0.3, 0.3, "sawtooth", 0.1);
}

/** Time-up klaxon */
export function playTimeUp(): void {
  playTone(300, 0.5, 0.5, "sawtooth", 0);
  playTone(200, 0.5, 0.5, "sawtooth", 0.6);
  playTone(300, 0.5, 0.5, "sawtooth", 1.2);
}

/** Winner fanfare */
export function playWinner(): void {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    playTone(freq, 0.2, 0.3, "sine", i * 0.18);
  });
}

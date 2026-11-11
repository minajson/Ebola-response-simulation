"use client";

import { Kicker } from "@/components/ui/Brand";

export const WELCOME_HEADING = "INDUSTRIAL SITE — HEALTH EMERGENCY RESPONSE TRAINING";
export const WELCOME_DESCRIPTION =
  "A high-stakes Ebola preparedness decision simulation. Two teams. Seven scenarios each. Every decision matters.";

/** Shared title block for the cover page and the welcome screen. */
export function HeroIntro({ size = "lg" }: { size?: "lg" | "xl" }) {
  return (
    <div>
      <Kicker>{WELCOME_HEADING}</Kicker>
      <h1
        className={`mt-3 font-extrabold leading-[1.02] tracking-[-0.025em] text-ink ${
          size === "xl" ? "text-[clamp(44px,min(5.4vw,8.5vh),88px)]" : "text-[clamp(40px,min(4.4vw,7vh),72px)]"
        }`}
      >
        Ebola Response:
        <br />
        <span className="text-alert">Contain or Collapse</span>
      </h1>
      <p className="mt-4 max-w-[52ch] text-[clamp(19px,1.45vw,26px)] font-medium leading-[1.4] text-ink-2">
        {WELCOME_DESCRIPTION}
      </p>
    </div>
  );
}

export function TrainingFootnote() {
  return (
    <p className="text-[13px] font-medium leading-snug text-ink-3">
      Facilitator-operated, shared-screen training simulation. Participants in the room and online follow the same
      screen. Indicators are simulation aids, not infection probabilities.
    </p>
  );
}

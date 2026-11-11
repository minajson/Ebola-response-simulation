"use client";

import { useState } from "react";
import { sceneCredits } from "@/data/scenes";
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

export function PhotoCredits() {
  const [open, setOpen] = useState(false);
  const credits = sceneCredits();
  if (credits.length === 0) return null;
  return (
    <div className="text-[13px] text-ink-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="min-h-[36px] font-semibold text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink"
      >
        {open ? "Hide photo credits" : "Photo credits"}
      </button>
      {open && (
        <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-lg border border-line bg-surface p-3 leading-snug">
          {credits.map(({ slug, label, credit }) => (
            <li key={slug}>
              <span className="font-semibold text-ink-2">{label}:</span> “{credit.title}” by {credit.author},{" "}
              <a className="underline underline-offset-2" href={credit.licenseUrl} target="_blank" rel="noreferrer">
                {credit.license}
              </a>
              {" · "}
              <a className="underline underline-offset-2" href={credit.sourceUrl} target="_blank" rel="noreferrer">
                source
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

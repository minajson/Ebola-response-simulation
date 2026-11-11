"use client";

import type { Question } from "@/data/questions";
import type { AnswerRecord } from "@/lib/types";
import RiskMeter, { type RiskLevel } from "@/components/RiskMeter";
import {
  clampExposure,
  getExposureLabel,
  getOutbreakLabel,
  getOutbreakRisk,
  type ExposureLabel,
  type OutbreakLabel,
} from "@/lib/scoring";

export interface LastDecision {
  record: AnswerRecord;
  question: Question;
}

interface StatusPanelProps {
  exposure: number;
  lastDecision: LastDecision | null;
  answered: number;
  total: number;
  currentIndex: number;
  exposureAlert: number;
  outbreakAlert: number;
}

const EXPOSURE_LEVEL: Record<ExposureLabel, RiskLevel> = { Low: "ok", Moderate: "warn", High: "high" };
const OUTBREAK_LEVEL: Record<OutbreakLabel, RiskLevel> = { Controlled: "ok", Elevated: "warn", Critical: "high" };

type PatientTone = "neutral" | "safe" | "caution" | "alert";

const PATIENT_TONE: Record<PatientTone, { dot: string; text: string }> = {
  neutral: { dot: "bg-ink-3", text: "text-ink" },
  safe: { dot: "bg-safe-fill", text: "text-safe" },
  caution: { dot: "bg-caution-fill", text: "text-caution" },
  alert: { dot: "bg-alert", text: "text-alert" },
};

function patientStatus(last: LastDecision | null, exposureLabel: ExposureLabel) {
  // Before any decision: neutral — never a negative outcome.
  if (!last) {
    return { tone: "neutral" as PatientTone, headline: "Under assessment", detail: "Awaiting the team's first decision." };
  }
  const correct = last.record.isCorrect;
  const detail =
    (correct ? last.question.patientImpact.correct : last.question.patientImpact.wrong) || "Status update pending.";
  if (correct) return { tone: "safe" as PatientTone, headline: "Stable", detail };
  if (exposureLabel === "High") return { tone: "alert" as PatientTone, headline: "Critical", detail };
  return { tone: "caution" as PatientTone, headline: "At risk", detail };
}

/** Narrow right-hand monitoring column. All values are simulation indicators. */
export default function StatusPanel({
  exposure,
  lastDecision,
  answered,
  total,
  currentIndex,
  exposureAlert,
  outbreakAlert,
}: StatusPanelProps) {
  const safeExposure = clampExposure(exposure);
  const exposureLabel = getExposureLabel(safeExposure);
  const outbreakRisk = getOutbreakRisk(safeExposure);
  const outbreakLabel = getOutbreakLabel(outbreakRisk);
  const patient = patientStatus(lastDecision, exposureLabel);
  const pt = PATIENT_TONE[patient.tone];

  const containmentDetail = lastDecision
    ? (lastDecision.record.isCorrect
        ? lastDecision.question.containmentImpact.correct
        : lastDecision.question.containmentImpact.wrong) || "Containment update pending."
    : "Baseline — no decisions yet.";

  const exposureDetail = lastDecision
    ? exposureLabel === "High"
      ? "Health worker protection compromised."
      : exposureLabel === "Moderate"
      ? "Protection gaps emerging."
      : "Health worker protection holding."
    : "Baseline exposure at incident start.";

  return (
    <aside aria-label="Incident monitor" className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto">
      <div className="rounded-xl border-2 border-line bg-surface px-4 py-3.5">
        <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-3">Patient status</p>
        <div className="mt-1.5 flex items-center gap-2.5">
          <span className={`h-3 w-3 flex-none rounded-full ${pt.dot}`} aria-hidden="true" />
          <p className={`text-[26px] font-bold leading-tight ${pt.text}`} aria-live="polite">
            {patient.headline}
          </p>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[15px] font-medium leading-snug text-ink-2">{patient.detail}</p>
      </div>

      <RiskMeter
        title="Health worker exposure"
        value={safeExposure}
        level={EXPOSURE_LEVEL[exposureLabel]}
        levelText={exposureLabel}
        detail={exposureDetail}
        thresholds={[20, 50]}
        alertKey={exposureAlert}
      />

      <RiskMeter
        title="Outbreak risk"
        value={outbreakRisk}
        level={OUTBREAK_LEVEL[outbreakLabel]}
        levelText={outbreakLabel}
        detail={containmentDetail}
        thresholds={[35, 60]}
        alertKey={outbreakAlert}
      />

      <div className="rounded-xl border-2 border-line bg-surface px-4 py-3.5">
        <div className="flex items-baseline justify-between">
          <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-3">Progress</p>
          <p className="text-[15px] font-semibold text-ink-2">
            <span className="font-mono font-bold text-ink tabular">{answered}</span> of {total} locked
          </p>
        </div>
        <ol className="mt-2.5 flex gap-1.5" aria-label={`${answered} of ${total} decisions locked`}>
          {Array.from({ length: total }).map((_, i) => {
            const done = i < answered;
            const current = !done && i === currentIndex;
            return (
              <li
                key={i}
                className={`h-3 flex-1 rounded-full transition-colors duration-300 ${
                  done ? "bg-ink" : current ? "bg-surface ring-2 ring-inset ring-alert" : "bg-sunken"
                }`}
              />
            );
          })}
        </ol>
      </div>

      <p className="mt-auto px-1 text-[12px] font-medium leading-snug text-ink-3">
        Indicators are simulation aids, not infection probabilities.
      </p>
    </aside>
  );
}

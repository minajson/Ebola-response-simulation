"use client";

import {
  clampExposure,
  getExposureColor,
  getExposureLabel,
  getExposureTextColor,
  getOutbreakRisk,
  getPatientOutcome,
  getOutcomeColor,
} from "@/lib/scoring";

interface StatusPanelProps {
  score: number;
  exposure: number;
  questionIndex: number;
  totalQuestions: number;
  team: "A" | "B";
}

export default function StatusPanel({
  score,
  exposure,
  questionIndex,
  totalQuestions,
  team,
}: StatusPanelProps) {
  const safeExposure = clampExposure(exposure);
  const exposureLabel = getExposureLabel(safeExposure);
  const exposureBarColor = getExposureColor(exposureLabel);
  const exposureTextColor = getExposureTextColor(exposureLabel);

  const outbreakRisk = getOutbreakRisk(safeExposure);
  const outbreakBarColor =
    outbreakRisk >= 60 ? "bg-red-500" : outbreakRisk >= 35 ? "bg-amber-500" : "bg-emerald-500";

  const patientOutcome = getPatientOutcome(score);
  const outcomeColor = getOutcomeColor(patientOutcome);

  const patientIcon =
    patientOutcome === "Stabilized and safely evacuated"
      ? "🟢"
      : patientOutcome === "Critical — containment partially achieved"
      ? "🟡"
      : "🔴";

  const teamColor = team === "A" ? "text-orange-600" : "text-blue-600";
  const teamBadgeStyle =
    team === "A"
      ? "border-orange-200 bg-orange-50"
      : "border-blue-200 bg-blue-50";

  return (
    <div className="flex flex-col gap-2 h-full overflow-y-auto">
      {/* Team badge */}
      <div className={`rounded-lg border px-3 py-2 flex items-center justify-between ${teamBadgeStyle}`}>
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
          Active Team
        </span>
        <span className={`text-xl font-extrabold ${teamColor}`}>Team {team}</span>
      </div>

      {/* Score */}
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-0.5">Decision Score</p>
        <p className={`text-3xl font-bold tabular-nums ${score < 0 ? "text-red-600" : "text-slate-800"}`}>
          {score >= 0 ? "+" : ""}
          {score}
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-1.5">
          Scenario Progress
        </p>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all ${
                i < questionIndex
                  ? "bg-emerald-500"
                  : i === questionIndex
                  ? "bg-orange-400"
                  : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        <p className="mt-1 text-xs text-slate-400 text-right">
          {questionIndex}/{totalQuestions} done
        </p>
      </div>

      {/* Patient status */}
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Patient Status</p>
        <div className="flex items-start gap-2">
          <span className="text-lg leading-tight">{patientIcon}</span>
          <p className={`text-sm font-semibold leading-tight ${outcomeColor}`}>{patientOutcome}</p>
        </div>
      </div>

      {/* HW Exposure */}
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs uppercase tracking-widest text-slate-400">HW Exposure</p>
          <span className={`text-xs font-bold ${exposureTextColor}`}>{exposureLabel}</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${exposureBarColor}`}
            style={{ width: `${safeExposure}%` }}
          />
        </div>
        <p className="mt-0.5 text-xs text-slate-400 text-right">{safeExposure}%</p>
      </div>

      {/* Outbreak risk */}
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs uppercase tracking-widest text-slate-400">Outbreak Risk</p>
          <span
            className={`text-xs font-bold ${
              outbreakRisk >= 60
                ? "text-red-600"
                : outbreakRisk >= 35
                ? "text-amber-600"
                : "text-green-600"
            }`}
          >
            {outbreakRisk >= 60 ? "Critical" : outbreakRisk >= 35 ? "Elevated" : "Controlled"}
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${outbreakBarColor}`}
            style={{ width: `${outbreakRisk}%` }}
          />
        </div>
        <p className="mt-0.5 text-xs text-slate-400 text-right">{outbreakRisk}%</p>
      </div>
    </div>
  );
}

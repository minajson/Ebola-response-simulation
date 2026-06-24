"use client";

import { Question } from "@/data/questions";
import {
  clampExposure,
  COMPLETION_BONUS,
  getExposureLabel,
  getExposureTextColor,
  getOutcomeColor,
  getPatientOutcome,
} from "@/lib/scoring";
import { TeamResult } from "@/components/GameShell";

interface ReviewScreenProps {
  result: TeamResult;
  questions: Question[];
  onContinue: () => void;
  continueLabel: string;
}

export default function ReviewScreen({
  result,
  questions,
  onContinue,
  continueLabel,
}: ReviewScreenProps) {
  const exposure = clampExposure(result.exposureLevel);
  const exposureLabel = getExposureLabel(exposure);
  const exposureColor = getExposureTextColor(exposureLabel);
  const outcome = getPatientOutcome(result.score);
  const outcomeColor = getOutcomeColor(outcome);

  const teamColor = result.team === "A" ? "text-orange-600" : "text-blue-600";
  const teamBadgeBg = result.team === "A" ? "bg-orange-50 border-orange-200" : "bg-blue-50 border-blue-200";
  const teamBadgeText = result.team === "A" ? "text-orange-700" : "text-blue-700";
  const ctaBg = result.team === "A" ? "bg-orange-500 hover:bg-orange-400" : "bg-blue-600 hover:bg-blue-500";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 mb-1 ${teamBadgeBg}`}>
            <span className={`text-xs uppercase tracking-widest font-bold ${teamBadgeText}`}>
              Team {result.team} — Round Complete
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">After-Action Review</h1>
        </div>

        <button
          onClick={onContinue}
          className={`rounded-xl ${ctaBg} text-white font-bold px-8 py-3 text-base transition-colors shadow-md`}
        >
          {continueLabel}
        </button>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 py-6 space-y-6 pb-12">
        {/* Score summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryCard
            label="Final Score"
            value={
              result.completedBeforeTime
                ? `${result.score} (+${COMPLETION_BONUS})`
                : String(result.score)
            }
            valueClass={
              result.score >= 60
                ? "text-green-600"
                : result.score >= 35
                ? "text-amber-600"
                : "text-red-600"
            }
          />
          <SummaryCard
            label="Correct"
            value={`${result.correctAnswers} / ${questions.length}`}
            valueClass="text-slate-800"
          />
          <SummaryCard
            label="HW Exposure"
            value={exposureLabel}
            valueClass={exposureColor}
          />
          <SummaryCard
            label="Completed"
            value={result.completedBeforeTime ? "Before time" : "Time expired"}
            valueClass={result.completedBeforeTime ? "text-green-600" : "text-amber-600"}
          />
        </div>

        {/* Patient outcome */}
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Patient Outcome</p>
          <p className={`text-lg font-bold ${outcomeColor}`}>{outcome}</p>
        </div>

        {/* Per-question breakdown */}
        <div>
          <h2 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-3">
            Decision Breakdown — All {questions.length} Scenarios
          </h2>

          <div className="space-y-4">
            {result.answers.map((answer, idx) => {
              const q = questions.find((x) => x.id === answer.questionId);
              if (!q) return null;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
                >
                  {/* Question header */}
                  <div
                    className={`flex items-center justify-between px-5 py-3 border-b ${
                      answer.isCorrect
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                          answer.isCorrect ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {answer.isCorrect ? "✓" : "✗"}
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                          Scenario {idx + 1}
                        </p>
                        <p className="text-base font-bold text-slate-800">{q.scenario}</p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-extrabold ${
                        answer.isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {answer.isCorrect ? "+10" : "−5"}
                    </span>
                  </div>

                  <div className="px-5 py-4 space-y-4">
                    {/* Your answer vs correct */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        className={`rounded-lg border px-4 py-3 ${
                          answer.isCorrect
                            ? "border-green-300 bg-green-50"
                            : "border-red-300 bg-red-50"
                        }`}
                      >
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                          Your Answer
                        </p>
                        <p
                          className={`text-sm font-semibold leading-snug ${
                            answer.isCorrect ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          [{answer.selectedAnswer}] {q.options[answer.selectedAnswer]}
                        </p>
                      </div>

                      <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                          Correct Answer
                        </p>
                        <p className="text-sm font-semibold text-green-700 leading-snug">
                          [{q.correctAnswer}] {q.options[q.correctAnswer]}
                        </p>
                      </div>
                    </div>

                    {/* Why it was correct */}
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 mb-2">
                        Why This Was Correct
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="font-bold text-slate-600 mb-0.5">Patient Outcome</p>
                          <p className="text-slate-700 leading-snug">
                            {q.consequenceCorrect.patientOutcome}
                          </p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-600 mb-0.5">HW Exposure Risk</p>
                          <p className="text-slate-700 leading-snug">
                            {q.consequenceCorrect.exposureRisk}
                          </p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-600 mb-0.5">Containment Impact</p>
                          <p className="text-slate-700 leading-snug">
                            {q.consequenceCorrect.containmentImpact}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Consequence of wrong action */}
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-red-700 mb-2">
                        Consequence of Wrong Action
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="font-bold text-slate-600 mb-0.5">Patient Outcome</p>
                          <p className="text-slate-700 leading-snug">
                            {q.consequenceWrong.patientOutcome}
                          </p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-600 mb-0.5">HW Exposure Risk</p>
                          <p className="text-slate-700 leading-snug">
                            {q.consequenceWrong.exposureRisk}
                          </p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-600 mb-0.5">Containment Impact</p>
                          <p className="text-slate-700 leading-snug">
                            {q.consequenceWrong.containmentImpact}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Best lesson learned */}
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-1">
                        Best Lesson Learned
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed">{q.lesson}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center pt-4">
          <button
            onClick={onContinue}
            className={`rounded-xl ${ctaBg} text-white font-extrabold px-14 py-4 text-lg transition-colors shadow-lg`}
          >
            {continueLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
      <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className={`text-lg font-bold leading-tight ${valueClass}`}>{value}</p>
    </div>
  );
}

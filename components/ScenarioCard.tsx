"use client";

import { OptionKey, Question } from "@/data/questions";
import { playCorrect, playWrong } from "@/lib/sound";
import { useEffect, useMemo, useState } from "react";

interface ScenarioCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedKey: OptionKey, isCorrect: boolean) => void;
}

function shuffleOptionOrder(q: Question): OptionKey[] {
  const keys: OptionKey[] = ["A", "B", "C", "D"];
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }
  return keys;
}

const DISPLAY_LABELS = ["A", "B", "C", "D"] as const;

export default function ScenarioCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: ScenarioCardProps) {
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [revealed, setRevealed] = useState(false);

  const shuffledOrder = useMemo(() => shuffleOptionOrder(question), [question]);

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
  }, [question.id]);

  function handleSelect(dataKey: OptionKey) {
    if (revealed) return;
    const isCorrect = dataKey === question.correctAnswer;
    setSelected(dataKey);
    setRevealed(true);
    if (isCorrect) playCorrect();
    else playWrong();
    // Brief color flash before advancing — no consequence panel
    setTimeout(() => onAnswer(dataKey, isCorrect), 700);
  }

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200 bg-slate-50 shadow-sm overflow-hidden">
      {/* Scenario header */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-sm uppercase tracking-widest text-orange-600 font-bold">
            Scenario {questionNumber} of {totalQuestions}
          </span>
        </div>
        <span className="text-sm text-slate-500 font-medium italic truncate max-w-[60%]">
          {question.scenario}
        </span>
      </div>

      <div className="flex flex-col flex-1 px-5 py-4 gap-4 min-h-0">
        {/* Question text */}
        <div className="rounded-xl bg-white border border-slate-200 px-5 py-4 flex-shrink-0">
          <p className="text-2xl font-bold text-slate-800 leading-snug">{question.question}</p>
        </div>

        {/* Answer options */}
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <p className="text-sm uppercase tracking-widest text-slate-400 font-semibold flex-shrink-0">
            Select the correct action
          </p>
          <div className="flex flex-col gap-2 flex-1">
            {shuffledOrder.map((dataKey, idx) => {
              const displayLabel = DISPLAY_LABELS[idx];
              const optionText = question.options[dataKey];
              const isSelected = selected === dataKey;
              const isCorrect = dataKey === question.correctAnswer;

              let cardStyle =
                "border-slate-200 bg-white hover:border-orange-400 hover:bg-orange-50 cursor-pointer";
              if (revealed) {
                if (isCorrect) {
                  cardStyle = "border-green-400 bg-green-50 cursor-default";
                } else if (isSelected && !isCorrect) {
                  cardStyle = "border-red-400 bg-red-50 cursor-default";
                } else {
                  cardStyle = "border-slate-200 bg-slate-50 opacity-50 cursor-default";
                }
              }

              return (
                <button
                  key={dataKey}
                  onClick={() => handleSelect(dataKey)}
                  disabled={revealed}
                  className={`w-full text-left rounded-xl border p-3 transition-all duration-200 ${cardStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex-shrink-0 h-7 w-7 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${
                        revealed && isCorrect
                          ? "border-green-500 bg-green-500 text-white"
                          : revealed && isSelected && !isCorrect
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-slate-300 bg-white text-slate-600"
                      }`}
                    >
                      {revealed && isCorrect
                        ? "✓"
                        : revealed && isSelected && !isCorrect
                        ? "✗"
                        : displayLabel}
                    </span>
                    <span className="text-lg text-slate-700 leading-snug">{optionText}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

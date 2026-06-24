"use client";

import { useCallback, useRef, useState } from "react";
import { OptionKey, Question } from "@/data/questions";
import { TeamResult, AnswerRecord } from "@/components/GameShell";
import Timer from "@/components/Timer";
import ScenarioCard from "@/components/ScenarioCard";
import StatusPanel from "@/components/StatusPanel";
import {
  calculateScoreDelta,
  clampExposure,
  COMPLETION_BONUS,
  INITIAL_EXPOSURE,
} from "@/lib/scoring";

interface TeamRoundProps {
  team: "A" | "B";
  questions: Question[];
  initialExposure?: number;
  onComplete: (result: TeamResult) => void;
}

export default function TeamRound({
  team,
  questions,
  initialExposure = INITIAL_EXPOSURE,
  onComplete,
}: TeamRoundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [exposure, setExposure] = useState(initialExposure);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [timeExpired, setTimeExpired] = useState(false);

  // Refs to capture latest values in callbacks without stale closures
  const stateRef = useRef({ score, exposure, answers, currentIndex });
  stateRef.current = { score, exposure, answers, currentIndex };

  const finaliseRound = useCallback(
    (completedBeforeTime: boolean) => {
      const { score: s, exposure: e, answers: a } = stateRef.current;
      const finalScore = completedBeforeTime ? s + COMPLETION_BONUS : s;
      onComplete({
        team,
        score: finalScore,
        correctAnswers: a.filter((x) => x.isCorrect).length,
        exposureLevel: clampExposure(e),
        answers: a,
        completedBeforeTime,
      });
    },
    [team, onComplete],
  );

  const handleTimerExpire = useCallback(() => {
    setTimeExpired(true);
    finaliseRound(false);
  }, [finaliseRound]);

  function handleAnswer(selectedKey: OptionKey, isCorrect: boolean) {
    const q = questions[currentIndex];
    const scoreDelta = calculateScoreDelta(isCorrect);
    const exposureDelta = isCorrect ? q.exposureImpact.correct : q.exposureImpact.wrong;

    const newScore = score + scoreDelta;
    const newExposure = clampExposure(exposure + exposureDelta);
    const newAnswers: AnswerRecord[] = [
      ...answers,
      { questionId: q.id, selectedAnswer: selectedKey, isCorrect },
    ];

    setScore(newScore);
    setExposure(newExposure);
    setAnswers(newAnswers);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      finaliseRound(true);
    } else {
      setCurrentIndex(nextIndex);
    }
  }

  const teamColor = team === "A" ? "text-orange-600" : "text-blue-600";
  const teamDot = team === "A" ? "bg-orange-500" : "bg-blue-500";

  if (timeExpired) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-3">⏱</p>
          <p className="text-2xl font-bold text-slate-800 mb-1">Time&apos;s up!</p>
          <p className="text-slate-500">Compiling Team {team} results…</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col bg-white">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${teamDot} animate-pulse`} />
          <span className="text-sm uppercase tracking-widest text-slate-400 font-semibold">
            Live Simulation
          </span>
        </div>
        <span className={`text-lg font-extrabold uppercase tracking-wide ${teamColor}`}>
          Team {team} —{" "}
          {team === "A" ? "Clinic Walk-In" : "Catering Facility"}
        </span>
        <span className="text-sm text-slate-400 font-medium">Ebola Response Protocol</span>
      </div>

      {/* Main content — 70/30 split */}
      <div className="flex-1 min-h-0 grid grid-cols-[1fr_300px] gap-4 p-4">
        {/* Left: scenario card */}
        <ScenarioCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
        />

        {/* Right: timer + status */}
        <div className="flex flex-col gap-3 min-h-0">
          <Timer onExpire={handleTimerExpire} paused={false} />
          <div className="flex-1 min-h-0">
            <StatusPanel
              score={score}
              exposure={exposure}
              questionIndex={currentIndex}
              totalQuestions={questions.length}
              team={team}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

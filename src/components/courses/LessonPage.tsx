"use client";

import { useState } from "react";
import Link from "next/link";
import type { Course, CourseLesson } from "@/data/courses/match-analyst";
import { LessonQuiz } from "@/components/courses/LessonQuiz";
import { PracticalExercise } from "@/components/courses/PracticalExercise";
import { GameButton } from "@/components/ui/GameButton";
import { usePlayer } from "@/context/PlayerContext";
import { completeLesson, getCourseProgress } from "@/lib/courses/progress";
import { calculateCourseCoins } from "@/lib/coins";
import { levelFromXp } from "@/lib/xp";

interface LessonPageProps {
  course: Course;
  lesson: CourseLesson;
}

export function LessonPageContent({ course, lesson }: LessonPageProps) {
  const { player, setPlayer } = usePlayer();
  const progress = getCourseProgress(course.id);
  const alreadyDone = progress.completedLessonIds.includes(lesson.id);
  const [phase, setPhase] = useState<"learn" | "quiz" | "done">(
    alreadyDone ? "done" : "learn"
  );
  const [quizPassed, setQuizPassed] = useState(alreadyDone);

  function handleQuizComplete(passed: boolean) {
    if (!passed) {
      setPhase("learn");
      return;
    }
    setQuizPassed(true);
    if (!alreadyDone && player) {
      const badge = course.badges.find((b) => b.levelRequired === lesson.level);
      completeLesson(
        course.id,
        lesson.id,
        lesson.xpReward,
        lesson.level,
        badge?.id
      );
      const newXp = player.xp + lesson.xpReward;
      setPlayer({
        ...player,
        xp: newXp,
        level: levelFromXp(newXp),
        coins: player.coins + calculateCourseCoins(),
      });
    }
    setPhase("done");
  }

  const levelTitle = course.levels.find((l) => l.level === lesson.level)?.title;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/courses/${course.slug}`}
          className="text-sm text-white/60 hover:text-white"
        >
          ← {course.title}
        </Link>
        <p className="mt-2 text-sm text-yellow-300 font-bold">
          Livello {lesson.level} — {levelTitle}
        </p>
        <h1 className="text-3xl font-black mt-1">{lesson.title}</h1>
        <p className="mt-2 text-white/80">{lesson.summary}</p>
      </div>

      {phase === "learn" && (
        <>
          <section className="rounded-2xl bg-white/10 border border-white/20 p-6 space-y-4">
            <h2 className="text-lg font-black">Spiegazione</h2>
            <p className="text-white/90 leading-relaxed">{lesson.content}</p>
          </section>
          <section className="rounded-2xl bg-green-500/10 border border-green-400/30 p-6">
            <h2 className="text-lg font-black">⚽ Esempio calcistico</h2>
            <p className="mt-2 text-white/90">{lesson.footballExample}</p>
          </section>
          <PracticalExercise exercise={lesson.exercise} />
          <GameButton size="lg" onClick={() => setPhase("quiz")}>
            Vai al quiz finale (+{lesson.xpReward} XP)
          </GameButton>
        </>
      )}

      {phase === "quiz" && (
        <LessonQuiz questions={lesson.quiz} onComplete={handleQuizComplete} />
      )}

      {phase === "done" && (
        <div className="rounded-2xl bg-green-500/20 border border-green-400/50 p-6 space-y-4 text-center">
          <p className="text-3xl">🎉</p>
          <h2 className="text-xl font-black">Lezione completata!</h2>
          {quizPassed && !alreadyDone && (
            <p className="text-yellow-300 font-bold">+{lesson.xpReward} XP</p>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            <GameButton href={`/courses/${course.slug}`} variant="secondary">
              Torna al corso
            </GameButton>
            <GameButton href={`/quiz/match-analyst`}>Quiz Match Analyst</GameButton>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getCourseBySlug } from "@/data/courses";
import { CourseProgressBar } from "@/components/courses/CourseProgress";
import { getCourseProgress } from "@/lib/courses/progress";
import { GameButton } from "@/components/ui/GameButton";

export default function CourseDetailPageClient() {
  const params = useParams();
  const slug = params.slug as string;
  const course = getCourseBySlug(slug);

  if (!course) {
    return <p>Corso non trovato</p>;
  }

  const progress = getCourseProgress(course.id);

  return (
    <div className="space-y-8">
      <div className={`rounded-3xl bg-gradient-to-br ${course.gradient} p-8`}>
        <span className="text-6xl">{course.icon}</span>
        <h1 className="text-4xl font-black mt-4">{course.title}</h1>
        <p className="mt-2 text-white/90">{course.description}</p>
      </div>

      <CourseProgressBar course={course} />

      <GameButton
        href={course.slug === "patente-academy" ? "/quiz/patente" : "/quiz/match-analyst"}
        variant="secondary"
      >
        🧠 Quiz {course.slug === "patente-academy" ? "Patente" : "Match Analyst"} (
        {course.lessons.length}+ argomenti)
      </GameButton>

      {course.levels.map((level) => {
        const lessons = course.lessons.filter((l) => l.level === level.level);
        return (
          <section key={level.level}>
            <h2 className="text-xl font-black mb-1">
              Livello {level.level} — {level.title}
            </h2>
            <p className="text-sm text-white/70 mb-4">{level.description}</p>
            <ol className="space-y-2">
              {lessons.map((lesson) => {
                const done = progress.completedLessonIds.includes(lesson.id);
                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/courses/${course.slug}/${lesson.id}`}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                        done
                          ? "bg-green-500/15 border border-green-400/40"
                          : "bg-white/10 border border-white/15 hover:bg-white/15"
                      }`}
                    >
                      <span>{done ? "✅" : "📖"}</span>
                      <span className="font-bold flex-1">{lesson.title}</span>
                      <span className="text-xs text-yellow-300">+{lesson.xpReward} XP</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      <Link href="/courses" className="text-sm text-white/60 hover:text-white">
        ← Tutti i corsi
      </Link>
    </div>
  );
}

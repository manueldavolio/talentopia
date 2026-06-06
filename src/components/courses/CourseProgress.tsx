"use client";

import type { Course } from "@/data/courses/match-analyst";
import { getCourseProgress } from "@/lib/courses/progress";

interface CourseProgressProps {
  course: Course;
}

export function CourseProgressBar({ course }: CourseProgressProps) {
  const progress = getCourseProgress(course.id);
  const total = course.lessons.length;
  const percent = total ? Math.round((progress.completedLessonIds.length / total) * 100) : 0;
  const levelInfo = course.levels.find((l) => l.level === progress.currentLevel);

  return (
    <div className="rounded-2xl bg-white/10 border border-white/20 p-5 space-y-3">
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        <span>
          Livello corso: <strong>{levelInfo?.title ?? progress.currentLevel}</strong>
        </span>
        <span className="text-yellow-300 font-bold">{progress.xpEarned} XP corso</span>
      </div>
      <div className="h-3 bg-black/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-white/70">
        {progress.completedLessonIds.length}/{total} lezioni · {percent}%
      </p>
      {progress.badgeIds.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {progress.badgeIds.map((id) => {
            const badge = course.badges.find((b) => b.id === id);
            return badge ? (
              <span
                key={id}
                className="rounded-full bg-yellow-400/20 border border-yellow-400/40 px-3 py-1 text-xs font-bold"
              >
                {badge.icon} {badge.name}
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

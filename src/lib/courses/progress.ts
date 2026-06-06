const PREFIX = "quiz-arena-course-progress";

export interface CourseProgress {
  courseId: string;
  completedLessonIds: string[];
  xpEarned: number;
  currentLevel: number;
  badgeIds: string[];
  updatedAt: string;
}

export interface AllCourseProgress {
  courses: Record<string, CourseProgress>;
}

function loadAll(): AllCourseProgress {
  if (typeof window === "undefined") return { courses: {} };
  try {
    return JSON.parse(localStorage.getItem(PREFIX) || '{"courses":{}}') as AllCourseProgress;
  } catch {
    return { courses: {} };
  }
}

function saveAll(data: AllCourseProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX, JSON.stringify(data));
}

export function getCourseProgress(courseId: string): CourseProgress {
  const all = loadAll();
  return (
    all.courses[courseId] ?? {
      courseId,
      completedLessonIds: [],
      xpEarned: 0,
      currentLevel: 1,
      badgeIds: [],
      updatedAt: new Date().toISOString(),
    }
  );
}

export function completeLesson(
  courseId: string,
  lessonId: string,
  xpReward: number,
  lessonLevel: number,
  badgeId?: string
): CourseProgress {
  const all = loadAll();
  const prev = getCourseProgress(courseId);
  const completed = prev.completedLessonIds.includes(lessonId)
    ? prev.completedLessonIds
    : [...prev.completedLessonIds, lessonId];
  const xpEarned = prev.completedLessonIds.includes(lessonId)
    ? prev.xpEarned
    : prev.xpEarned + xpReward;
  const currentLevel = Math.max(prev.currentLevel, lessonLevel);
  const badgeIds =
    badgeId && !prev.badgeIds.includes(badgeId)
      ? [...prev.badgeIds, badgeId]
      : prev.badgeIds;

  const next: CourseProgress = {
    courseId,
    completedLessonIds: completed,
    xpEarned,
    currentLevel,
    badgeIds,
    updatedAt: new Date().toISOString(),
  };
  all.courses[courseId] = next;
  saveAll(all);
  return next;
}

export function getCourseCompletionPercent(
  courseId: string,
  totalLessons: number
): number {
  if (totalLessons === 0) return 0;
  const p = getCourseProgress(courseId);
  return Math.round((p.completedLessonIds.length / totalLessons) * 100);
}

export type {
  Course,
  CourseBadge,
  CourseLesson,
  LessonQuizQuestion,
  PracticalExercise,
} from "./match-analyst";

export {
  MATCH_ANALYST_COURSE,
  MATCH_ANALYST_BADGES,
  MATCH_ANALYST_LESSONS,
} from "./match-analyst";

export {
  PATENTE_ACADEMY_COURSE,
  PATENTE_ACADEMY_BADGES,
  PATENTE_ACADEMY_LESSONS,
} from "./patente-academy";

export {
  ARBITRO_COURSE,
  ARBITRO_BADGES,
  ARBITRO_LESSONS,
} from "./arbitro";

import { MATCH_ANALYST_COURSE } from "./match-analyst";
import { PATENTE_ACADEMY_COURSE } from "./patente-academy";
import { ARBITRO_COURSE } from "./arbitro";
import type { Course, CourseLesson } from "./match-analyst";

export const COURSES: Course[] = [
  MATCH_ANALYST_COURSE,
  PATENTE_ACADEMY_COURSE,
  ARBITRO_COURSE,
];

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getLessonById(
  courseSlug: string,
  lessonId: string
): CourseLesson | undefined {
  const course = getCourseBySlug(courseSlug);
  return course?.lessons.find((l) => l.id === lessonId);
}

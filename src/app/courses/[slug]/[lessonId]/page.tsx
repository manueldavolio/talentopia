import { COURSES } from "@/data/courses";
import CourseLessonPageClient from "./CourseLessonPageClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return COURSES.flatMap((course) =>
    course.lessons.map((lesson) => ({
      slug: course.slug,
      lessonId: lesson.id,
    }))
  );
}

export default function CourseLessonPage() {
  return <CourseLessonPageClient />;
}

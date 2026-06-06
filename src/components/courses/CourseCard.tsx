import Link from "next/link";
import type { Course } from "@/data/courses/match-analyst";
import { getCourseCompletionPercent } from "@/lib/courses/progress";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const percent = getCourseCompletionPercent(course.id, course.lessons.length);

  return (
    <Link
      href={`/courses/${course.slug}`}
      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${course.gradient} p-6 shadow-xl transition hover:scale-[1.03] hover:shadow-2xl active:scale-[0.98]`}
    >
      <div className="absolute -right-4 -top-4 text-8xl opacity-20 group-hover:opacity-30 transition">
        {course.icon}
      </div>
      <span className="text-5xl">{course.icon}</span>
      <h3 className="mt-4 text-2xl font-black">{course.title}</h3>
      <p className="mt-2 text-sm text-white/85 line-clamp-2">{course.description}</p>
      <p className="mt-3 inline-block rounded-full bg-black/25 px-3 py-1 text-xs font-bold">
        {course.lessons.length} lezioni · {percent}% completato
      </p>
    </Link>
  );
}

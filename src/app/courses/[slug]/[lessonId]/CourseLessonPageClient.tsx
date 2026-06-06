"use client";

import { useParams } from "next/navigation";
import { getCourseBySlug, getLessonById } from "@/data/courses";
import { LessonPageContent } from "@/components/courses/LessonPage";

export default function CourseLessonPageClient() {
  const params = useParams();
  const slug = params.slug as string;
  const lessonId = params.lessonId as string;
  const course = getCourseBySlug(slug);
  const lesson = getLessonById(slug, lessonId);

  if (!course || !lesson) {
    return <p>Lezione non trovata</p>;
  }

  return <LessonPageContent course={course} lesson={lesson} />;
}

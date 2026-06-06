"use client";

import { useParams } from "next/navigation";
import { getCourseBySlug, getLessonById } from "@/data/courses";
import { RouteFallback } from "@/components/ui/RouteFallback";
import { LessonPageContent } from "@/components/courses/LessonPage";

export default function CourseLessonPageClient() {
  const params = useParams();
  const slug = params.slug as string;
  const lessonId = params.lessonId as string;
  const course = getCourseBySlug(slug);
  const lesson = getLessonById(slug, lessonId);

  if (!course || !lesson) {
    console.warn("[courses/lesson]", `Lezione non trovata: ${slug}/${lessonId}`);
    return (
      <RouteFallback
        title="Lezione non trovata"
        message="La lezione che cerchi non esiste o non è più disponibile."
        backHref={course ? `/courses/${course.slug}` : "/courses"}
        backLabel={course ? "← Torna al corso" : "← Tutti i corsi"}
      />
    );
  }

  return <LessonPageContent course={course} lesson={lesson} />;
}

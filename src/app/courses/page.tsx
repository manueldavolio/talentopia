"use client";

import Link from "next/link";
import { COURSES } from "@/data/courses";
import { CourseCard } from "@/components/courses/CourseCard";

export default function CoursesPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-black">🎓 Corsi speciali</h1>
        <p className="mt-2 text-white/80">
          Percorsi strutturati con lezioni, quiz ed esercizi pratici.
        </p>
      </section>
      <div className="grid gap-4 sm:grid-cols-2">
        {COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      <Link href="/" className="text-sm text-white/60 hover:text-white">
        ← Home
      </Link>
    </div>
  );
}

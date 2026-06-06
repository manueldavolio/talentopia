import { COURSES } from "@/data/courses";
import CourseDetailPageClient from "./CourseDetailPageClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return COURSES.map((course) => ({ slug: course.slug }));
}

export default function CourseDetailPage() {
  return <CourseDetailPageClient />;
}

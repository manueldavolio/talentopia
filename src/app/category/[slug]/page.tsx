import { CATEGORIES } from "@/data/categories";
import CategoryPageClient from "./CategoryPageClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

export default function CategoryPage() {
  return <CategoryPageClient />;
}

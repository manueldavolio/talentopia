import { CATEGORIES } from "@/data/categories";
import CategoryPageClient from "./CategoryPageClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}

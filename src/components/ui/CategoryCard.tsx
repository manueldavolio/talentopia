"use client";

import Link from "next/link";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
  questionCount?: number;
}

export function CategoryCard({ category, questionCount }: CategoryCardProps) {
  const href = category.href ?? `/category/${category.slug}`;
  const showCount = category.showQuestionCount !== false && questionCount !== undefined;

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${category.gradient} p-6 shadow-xl transition hover:scale-[1.03] hover:shadow-2xl active:scale-[0.98]`}
    >
      <div className="absolute -right-4 -top-4 text-8xl opacity-20 group-hover:opacity-30 transition">
        {category.icon}
      </div>
      <span className="text-5xl">{category.icon}</span>
      <h3 className="mt-4 text-2xl font-black">{category.name}</h3>
      <p className="mt-1 text-sm text-white/80">{category.subject}</p>
      {showCount && (
        <p className="mt-3 inline-block rounded-full bg-black/20 px-3 py-1 text-xs font-bold">
          {questionCount}+ domande
        </p>
      )}
      {category.slug === "corsi" && (
        <p className="mt-3 inline-block rounded-full bg-black/20 px-3 py-1 text-xs font-bold">
          Lezioni interattive
        </p>
      )}
    </Link>
  );
}

import type { Category, HomeSection } from "@/types";

export const HOME_SECTIONS: { id: HomeSection; title: string; emoji: string }[] = [
  { id: "materie", title: "Materie scolastiche", emoji: "📚" },
  { id: "sport", title: "Sport e calcio", emoji: "⚽" },
  { id: "corsi", title: "Corsi speciali", emoji: "🎓" },
];

export const CATEGORIES: Category[] = [
  { id: "3", name: "Matematica", slug: "matematica", icon: "🔢", color: "#3b82f6", gradient: "from-blue-500 to-indigo-700", subject: "Matematica", section: "materie" },
  { id: "4", name: "Storia", slug: "storia", icon: "📜", color: "#a855f7", gradient: "from-purple-500 to-violet-700", subject: "Storia", section: "materie" },
  { id: "5", name: "Geografia", slug: "geografia", icon: "🌍", color: "#06b6d4", gradient: "from-cyan-500 to-teal-700", subject: "Geografia", section: "materie" },
  { id: "6", name: "Inglese", slug: "inglese", icon: "🇬🇧", color: "#ec4899", gradient: "from-pink-500 to-rose-700", subject: "Inglese", section: "materie" },
  { id: "11", name: "Francese", slug: "francese", icon: "🇫🇷", color: "#6366f1", gradient: "from-indigo-400 to-blue-700", subject: "Francese", section: "materie" },
  { id: "12", name: "Patente", slug: "patente", icon: "🚗", color: "#ea580c", gradient: "from-orange-500 via-amber-600 to-red-700", subject: "Patente B", section: "materie" },
  { id: "1", name: "Calcio", slug: "calcio", icon: "⚽", color: "#22c55e", gradient: "from-green-500 to-emerald-700", subject: "Calcio", section: "sport" },
  { id: "2", name: "Sport", slug: "sport", icon: "🏆", color: "#f59e0b", gradient: "from-amber-500 to-orange-600", subject: "Sport", section: "sport" },
  { id: "7", name: "Fantacalcio", slug: "fantacalcio", icon: "📋", color: "#ef4444", gradient: "from-red-500 to-rose-700", subject: "Fantacalcio", section: "sport" },
  { id: "9", name: "Inter", slug: "inter", icon: "⚫🔵", color: "#1e3a8a", gradient: "from-slate-800 to-blue-900", subject: "Storia Inter", section: "sport" },
  { id: "10", name: "Corsi", slug: "corsi", icon: "🎓", color: "#d946ef", gradient: "from-fuchsia-500 via-purple-600 to-violet-800", subject: "Percorsi formativi", section: "corsi", href: "/courses", showQuestionCount: false },
];

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoriesBySection(section: HomeSection): Category[] {
  return CATEGORIES.filter((c) => c.section === section);
}

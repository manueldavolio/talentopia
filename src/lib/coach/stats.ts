import { CATEGORIES, getCategoryBySlug } from "@/data/categories";
import {
  getCategoryRating,
  ratingTierLabel,
} from "@/lib/adaptiveDifficulty";
import type { CategorySlug, PlayerProfile } from "@/types";
import {
  getCoachProgress,
  getWeekKey,
  saveWeeklyGoals,
  updateGoalProgress,
  type CoachProgress,
  type TopicStat,
  type WeeklyGoal,
} from "./progress";
import {
  emptyDataTip,
  quizAction,
  ripassoAction,
  sfidaAction,
  strongCategoryTip,
  weakTopicTip,
  type CoachAction,
} from "./suggestions";

const MIN_TOPIC_ANSWERS = 3;
const STRONG_THRESHOLD = 75;
const WEAK_THRESHOLD = 70;

export interface RankedTopic {
  categorySlug: CategorySlug;
  categoryName: string;
  categoryIcon: string;
  topic: string;
  accuracy: number;
  total: number;
  wrong: number;
}

export interface RankedCategory {
  slug: CategorySlug;
  name: string;
  icon: string;
  accuracy: number;
  total: number;
  rating: number;
  tier: string;
}

export interface PersonalizedTip {
  text: string;
  action: CoachAction;
  type: "weakness" | "strength" | "suggestion";
}

export interface CoachInsights {
  overallAccuracy: number;
  totalAnswered: number;
  totalCorrect: number;
  totalWrong: number;
  strongCategories: RankedCategory[];
  weakCategories: RankedCategory[];
  strongTopics: RankedTopic[];
  weakTopics: RankedTopic[];
  tips: PersonalizedTip[];
  weeklyGoals: WeeklyGoal[];
  weeklyAnswered: number;
  weeklyTarget: number;
}

function topicAccuracy(stat: TopicStat | undefined): number {
  if (!stat || stat.total === 0) return 0;
  return Math.round((stat.correct / stat.total) * 100);
}

function collectRankedTopics(progress: CoachProgress): RankedTopic[] {
  const ranked: RankedTopic[] = [];
  for (const [slug, data] of Object.entries(progress.categories)) {
    const category = getCategoryBySlug(slug);
    if (!category || !data?.topicStats) continue;
    for (const [topic, stat] of Object.entries(data.topicStats)) {
      if (stat.total < MIN_TOPIC_ANSWERS) continue;
      const accuracy = topicAccuracy(stat);
      ranked.push({
        categorySlug: slug as CategorySlug,
        categoryName: category.name,
        categoryIcon: category.icon,
        topic,
        accuracy,
        total: stat.total,
        wrong: stat.total - stat.correct,
      });
    }
  }
  return ranked;
}

function collectCategoryStats(
  progress: CoachProgress,
  player: PlayerProfile | null
): RankedCategory[] {
  const coachable = CATEGORIES.filter(
    (c) => c.slug !== "corsi" && c.slug !== "match-analyst"
  );
  return coachable
    .map((cat) => {
      const data = progress.categories[cat.slug];
      let correct = 0;
      let total = 0;
      if (data?.topicStats) {
        for (const stat of Object.values(data.topicStats)) {
          correct += stat.correct;
          total += stat.total;
        }
      }
      const rating = getCategoryRating(player, cat.slug);
      return {
        slug: cat.slug,
        name: cat.name,
        icon: cat.icon,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
        total,
        rating,
        tier: ratingTierLabel(rating),
      };
    })
    .filter((c) => c.total >= MIN_TOPIC_ANSWERS);
}

function generateWeeklyGoals(
  progress: CoachProgress,
  weakTopics: RankedTopic[],
  weakCategories: RankedCategory[]
): WeeklyGoal[] {
  const weekKey = getWeekKey();
  const weakestTopic = weakTopics[0];
  const weakestCategory = weakCategories[0];

  const goals: WeeklyGoal[] = [
    {
      id: `${weekKey}_questions`,
      weekKey,
      type: "questions",
      label: "Rispondi a 50 domande questa settimana",
      target: 50,
      current: progress.weeklyAnswered,
      completed: progress.weeklyAnswered >= 50,
    },
    {
      id: `${weekKey}_accuracy`,
      weekKey,
      type: "accuracy",
      label: "Raggiungi il 70% di precisione settimanale",
      target: 70,
      current:
        progress.weeklyAnswered >= 10
          ? Math.round((progress.weeklyCorrect / progress.weeklyAnswered) * 100)
          : 0,
      completed:
        progress.weeklyAnswered >= 10 &&
        progress.weeklyCorrect / progress.weeklyAnswered >= 0.7,
    },
    {
      id: `${weekKey}_quizzes`,
      weekKey,
      type: "quizzes",
      label: "Completa 4 quiz",
      target: 4,
      current: progress.weeklyQuizzes,
      href: "/dashboard",
      completed: progress.weeklyQuizzes >= 4,
    },
  ];

  if (weakestTopic) {
    goals.push({
      id: `${weekKey}_topic_${weakestTopic.categorySlug}_${weakestTopic.topic}`,
      weekKey,
      type: "topic",
      label: `Ripassa ${weakestTopic.topic} (${weakestTopic.categoryName}): 15 risposte`,
      target: 15,
      current: 0,
      categorySlug: weakestTopic.categorySlug,
      topic: weakestTopic.topic,
      href: ripassoAction(weakestTopic.categorySlug).href,
      completed: false,
    });
  } else if (weakestCategory) {
    goals.push({
      id: `${weekKey}_cat_${weakestCategory.slug}`,
      weekKey,
      type: "topic",
      label: `Allenati in ${weakestCategory.name}: 20 risposte`,
      target: 20,
      current: 0,
      categorySlug: weakestCategory.slug,
      href: quizAction(weakestCategory.slug).href,
      completed: false,
    });
  }

  return goals;
}

function buildTips(
  weakTopics: RankedTopic[],
  strongCategories: RankedCategory[],
  totalAnswered: number
): PersonalizedTip[] {
  const tips: PersonalizedTip[] = [];

  if (totalAnswered === 0) {
    const empty = emptyDataTip();
    return [{ text: empty.text, action: empty.action, type: "suggestion" }];
  }

  for (const weak of weakTopics.slice(0, 2)) {
    const { text, action } = weakTopicTip(
      weak.categorySlug,
      weak.topic,
      weak.accuracy
    );
    tips.push({ text, action, type: "weakness" });
  }

  for (const strong of strongCategories.slice(0, 2)) {
    const { text, action } = strongCategoryTip(
      strong.slug,
      strong.accuracy,
      strong.rating
    );
    tips.push({ text, action, type: "strength" });
  }

  if (tips.length < 3) {
    tips.push({
      text: "Alterna quiz e minigiochi per consolidare ciò che impari.",
      action: { label: "Sfide rapide", href: "/dashboard" },
      type: "suggestion",
    });
  }

  if (tips.length < 4 && weakTopics[0]) {
    const w = weakTopics[0];
    const action = sfidaAction(w.categorySlug);
    tips.push({
      text: `Per ${w.topic}, prova anche: ${action.label}.`,
      action,
      type: "suggestion",
    });
  }

  return tips.slice(0, 5);
}

export function computeCoachInsights(
  player: PlayerProfile | null
): CoachInsights {
  let progress = updateGoalProgress(getCoachProgress());
  const rankedTopics = collectRankedTopics(progress);

  const strongTopics = [...rankedTopics]
    .filter((t) => t.accuracy >= STRONG_THRESHOLD)
    .sort((a, b) => b.accuracy - a.accuracy || b.total - a.total)
    .slice(0, 5);

  const weakTopics = [...rankedTopics]
    .filter((t) => t.accuracy < WEAK_THRESHOLD)
    .sort((a, b) => a.accuracy - b.accuracy || b.wrong - a.wrong)
    .slice(0, 5);

  const categoryStats = collectCategoryStats(progress, player);
  const strongCategories = [...categoryStats]
    .filter((c) => c.accuracy >= STRONG_THRESHOLD)
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 4);
  const weakCategories = [...categoryStats]
    .filter((c) => c.accuracy < WEAK_THRESHOLD)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 4);

  const uniqueAnswered = rankedTopics.reduce((s, t) => s + t.total, 0);
  const uniqueCorrect = rankedTopics.reduce((s, t) => s + (t.total - t.wrong), 0);
  const overallAccuracy =
    uniqueAnswered > 0 ? Math.round((uniqueCorrect / uniqueAnswered) * 100) : 0;

  if (!progress.goals.length || progress.goals[0]?.weekKey !== getWeekKey()) {
    const goals = generateWeeklyGoals(progress, weakTopics, weakCategories);
    progress = saveWeeklyGoals(goals);
    progress = updateGoalProgress(progress);
  }

  const tips = buildTips(weakTopics, strongCategories, uniqueAnswered);

  return {
    overallAccuracy,
    totalAnswered: uniqueAnswered,
    totalCorrect: uniqueCorrect,
    totalWrong: uniqueAnswered - uniqueCorrect,
    strongCategories,
    weakCategories,
    strongTopics,
    weakTopics,
    tips,
    weeklyGoals: progress.goals,
    weeklyAnswered: progress.weeklyAnswered,
    weeklyTarget: 50,
  };
}

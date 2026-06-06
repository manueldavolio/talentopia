import type { DailyLoginState } from "@/types/gamification";

const PREFIX = "quiz-arena-daily-login";

export const DAILY_REWARDS: {
  day: number;
  coins: number;
  label: string;
  icon: string;
  rare?: boolean;
  xp?: number;
  badge?: string;
}[] = [
  { day: 1, coins: 50, label: "50 monete", icon: "🪙" },
  { day: 2, coins: 75, label: "75 monete", icon: "🪙" },
  { day: 3, coins: 100, label: "100 monete", icon: "🪙" },
  { day: 4, coins: 100, label: "100 monete", icon: "🪙" },
  { day: 5, coins: 125, label: "125 monete", icon: "🪙" },
  { day: 6, coins: 150, label: "150 monete", icon: "🪙" },
  { day: 7, coins: 0, label: "Premio raro", icon: "💎", rare: true, xp: 200, badge: "daily-warrior" },
];

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function defaultDailyLogin(): DailyLoginState {
  return {
    lastClaimDate: null,
    streak: 0,
    totalClaims: 0,
    lastRewardDay: 0,
  };
}

export function loadDailyLogin(): DailyLoginState {
  if (typeof window === "undefined") return defaultDailyLogin();
  try {
    return { ...defaultDailyLogin(), ...JSON.parse(localStorage.getItem(PREFIX) || "{}") };
  } catch {
    return defaultDailyLogin();
  }
}

function save(state: DailyLoginState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX, JSON.stringify(state));
}

export function canClaimDaily(): boolean {
  const state = loadDailyLogin();
  return state.lastClaimDate !== todayKey();
}

export function getCurrentRewardDay(): number {
  const state = loadDailyLogin();
  if (state.lastClaimDate === todayKey()) return state.lastRewardDay;
  if (state.lastClaimDate === yesterdayKey()) {
    return state.lastRewardDay >= 7 ? 1 : state.lastRewardDay + 1;
  }
  return 1;
}

export function claimDailyReward(): {
  state: DailyLoginState;
  reward: (typeof DAILY_REWARDS)[number];
  coins: number;
  xp: number;
  badge?: string;
} {
  const prev = loadDailyLogin();
  const today = todayKey();
  if (prev.lastClaimDate === today) {
    const reward = DAILY_REWARDS[(prev.lastRewardDay - 1) % 7];
    return { state: prev, reward, coins: 0, xp: 0 };
  }

  let streak = 1;
  let rewardDay = 1;
  if (prev.lastClaimDate === yesterdayKey()) {
    streak = prev.streak + 1;
    rewardDay = prev.lastRewardDay >= 7 ? 1 : prev.lastRewardDay + 1;
  }

  const reward = DAILY_REWARDS[rewardDay - 1];
  const state: DailyLoginState = {
    lastClaimDate: today,
    streak,
    totalClaims: prev.totalClaims + 1,
    lastRewardDay: rewardDay,
  };
  save(state);

  return {
    state,
    reward,
    coins: reward.coins,
    xp: reward.rare ? (reward.xp ?? 200) : 25,
    badge: reward.badge,
  };
}

export function getDailyLoginCalendar(): {
  day: number;
  reward: (typeof DAILY_REWARDS)[number];
  claimed: boolean;
  current: boolean;
}[] {
  const state = loadDailyLogin();
  const currentDay = getCurrentRewardDay();
  const claimedToday = state.lastClaimDate === todayKey();

  return DAILY_REWARDS.map((reward, i) => {
    const day = i + 1;
    let claimed = false;
    if (claimedToday && day <= state.lastRewardDay) claimed = true;
    if (!claimedToday && state.lastClaimDate === yesterdayKey() && day < currentDay) claimed = true;
    return { day, reward, claimed, current: day === currentDay && !claimedToday };
  });
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { addDemoLeaderboardEntries, loadPlayer, savePlayer } from "@/lib/player";
import type { MinigameAttempt, PlayerProfile, QuizAttempt } from "@/types";
import { saveMinigameAttempt, saveQuizAttempt } from "@/lib/player";

interface PlayerContextValue {
  player: PlayerProfile | null;
  loading: boolean;
  setPlayer: (p: PlayerProfile) => void;
  refreshPlayer: () => void;
  completeQuiz: (attempt: QuizAttempt) => void;
  completeMinigame: (attempt: MinigameAttempt) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const playerListeners = new Set<() => void>();
let playerHydrated = false;
let cachedPlayer: PlayerProfile | null = null;

function subscribePlayer(onChange: () => void) {
  playerListeners.add(onChange);
  return () => playerListeners.delete(onChange);
}

function syncPlayerFromStorage(): void {
  if (typeof window === "undefined") return;
  if (!playerHydrated) {
    addDemoLeaderboardEntries();
    playerHydrated = true;
  }
  cachedPlayer = loadPlayer();
}

function notifyPlayerChange() {
  syncPlayerFromStorage();
  playerListeners.forEach((l) => l());
}

function getPlayerSnapshot(): PlayerProfile | null {
  if (typeof window === "undefined") return null;
  if (!playerHydrated) {
    syncPlayerFromStorage();
  }
  return cachedPlayer;
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const isClient = useIsClient();
  const player = useSyncExternalStore(subscribePlayer, getPlayerSnapshot, () => null);
  const loading = !isClient;

  const setPlayer = useCallback((p: PlayerProfile) => {
    savePlayer(p);
    notifyPlayerChange();
  }, []);

  const refreshPlayer = useCallback(() => {
    notifyPlayerChange();
  }, []);

  const completeQuiz = useCallback(
    (attempt: QuizAttempt) => {
      if (!player) return;
      saveQuizAttempt(player, attempt);
      notifyPlayerChange();
    },
    [player]
  );

  const completeMinigame = useCallback(
    (attempt: MinigameAttempt) => {
      if (!player) return;
      saveMinigameAttempt(player, attempt);
      notifyPlayerChange();
    },
    [player]
  );

  return (
    <PlayerContext.Provider
      value={{ player, loading, setPlayer, refreshPlayer, completeQuiz, completeMinigame }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

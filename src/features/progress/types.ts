import type { GameMode, PracticeSettings } from "@/features/games/number-recall/types/game";

export type CompletedSession = {
  id: string;
  game: "number-recall";
  mode: GameMode;
  completedAt: string;
  score: number;
  highestCompletedLevel: number;
  longestSequence: number;
  correctAttempts: number;
  totalAttempts: number;
  durationSeconds: number;
};

export type ProgressData = {
  version: 1;
  sessions: CompletedSession[];
  preferences: { soundEnabled: boolean };
  practice: PracticeSettings;
};

export type ProgressSummary = {
  gamesPlayed: number;
  personalBest: number;
  highestCompletedLevel: number;
  longestSequence: number;
};

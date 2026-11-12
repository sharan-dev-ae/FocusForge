import type { RoundConfig } from "../types/game";

const BASE: Omit<RoundConfig, "level">[] = [
  { digits: 3, displayMs: 4000 }, { digits: 4, displayMs: 4000 }, { digits: 5, displayMs: 5000 },
  { digits: 6, displayMs: 5000 }, { digits: 7, displayMs: 6000 }, { digits: 8, displayMs: 6000 },
  { digits: 9, displayMs: 7000 },
];

export function getDifficulty(level: number): RoundConfig {
  const safeLevel = Math.max(1, Math.floor(level));
  if (safeLevel <= BASE.length) return { level: safeLevel, ...BASE[safeLevel - 1] };
  const extra = safeLevel - BASE.length;
  const digits = 9 + extra;
  const displayMs = Math.min(12000, 7000 + Math.floor((extra + 1) / 2) * 500);
  return { level: safeLevel, digits, displayMs };
}

export const SCORING_VERSION = 1;
export function scoreRound(digitsRecalled: number) { return Math.max(0, Math.floor(digitsRecalled)) * 10; }

export type GameMode = "classic" | "practice";
export type GamePhase = "idle" | "countdown" | "memorizing" | "recalling" | "validating" | "success" | "game-over" | "results";

export type PracticeSettings = { digits: number; displayMs: number };
export type RoundConfig = { level: number; digits: number; displayMs: number };

export type GameState = {
  phase: GamePhase;
  mode: GameMode;
  level: number;
  sequence: string;
  input: string;
  score: number;
  correctAttempts: number;
  totalAttempts: number;
  longestSequence: number;
  startedAt: number | null;
  phaseEndsAt: number | null;
  runId: number;
  practice: PracticeSettings;
  lastAnswerCorrect: boolean | null;
  pausedAt: number | null;
};

export type GameAction =
  | { type: "SET_MODE"; mode: GameMode }
  | { type: "SET_PRACTICE"; settings: PracticeSettings }
  | { type: "START"; now: number }
  | { type: "BEGIN_MEMORIZING"; sequence: string; endsAt: number; runId: number }
  | { type: "BEGIN_RECALL"; runId: number }
  | { type: "INPUT"; value: string }
  | { type: "SUBMIT" }
  | { type: "VALIDATE"; correct: boolean }
  | { type: "NEXT_ROUND"; now: number }
  | { type: "SHOW_RESULTS" }
  | { type: "RESTART" }
  | { type: "VISIBILITY_HIDDEN"; now: number }
  | { type: "VISIBILITY_VISIBLE"; now: number };

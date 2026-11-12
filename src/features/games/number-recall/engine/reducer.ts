import { getDifficulty } from "./difficulty";
import { scoreRound } from "./scoring";
import type { GameAction, GameState } from "../types/game";

export const initialGameState: GameState = {
  phase: "idle", mode: "classic", level: 1, sequence: "", input: "", score: 0,
  correctAttempts: 0, totalAttempts: 0, longestSequence: 0, startedAt: null,
  phaseEndsAt: null, runId: 0, practice: { digits: 5, displayMs: 5000 },
  lastAnswerCorrect: null, pausedAt: null,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_MODE": return state.phase === "idle" ? { ...state, mode: action.mode } : state;
    case "SET_PRACTICE": return state.phase === "idle" ? { ...state, practice: action.settings } : state;
    case "START": return state.phase === "idle" || state.phase === "results" || state.phase === "game-over" ? { ...state, phase: "countdown", level: 1, sequence: "", input: "", score: 0, correctAttempts: 0, totalAttempts: 0, longestSequence: 0, startedAt: action.now, phaseEndsAt: action.now + 3000, runId: state.runId + 1, lastAnswerCorrect: null, pausedAt: null } : state;
    case "BEGIN_MEMORIZING": return state.phase === "countdown" && state.runId === action.runId ? { ...state, phase: "memorizing", sequence: action.sequence, input: "", phaseEndsAt: action.endsAt } : state;
    case "BEGIN_RECALL": return state.phase === "memorizing" && state.runId === action.runId ? { ...state, phase: "recalling", sequence: "", input: "", phaseEndsAt: null } : state;
    case "INPUT": return state.phase === "recalling" ? { ...state, input: action.value.replace(/\D/g, "") } : state;
    case "SUBMIT": return state.phase === "recalling" && state.input.length > 0 ? { ...state, phase: "validating" } : state;
    case "VALIDATE": {
      if (state.phase !== "validating") return state;
      const attempts = state.totalAttempts + 1;
      if (action.correct) {
        const digits = state.mode === "classic" ? getDifficulty(state.level).digits : state.practice.digits;
        return { ...state, phase: "success", score: state.mode === "classic" ? state.score + scoreRound(digits) : state.score, correctAttempts: state.correctAttempts + 1, totalAttempts: attempts, longestSequence: Math.max(state.longestSequence, digits), lastAnswerCorrect: true, phaseEndsAt: null };
      }
      return { ...state, phase: state.mode === "classic" ? "game-over" : "success", totalAttempts: attempts, lastAnswerCorrect: false, phaseEndsAt: null };
    }
    case "NEXT_ROUND": return state.phase === "success" ? { ...state, phase: "countdown", level: state.mode === "classic" ? state.level + 1 : state.level, input: "", sequence: "", phaseEndsAt: action.now + 3000, runId: state.runId + 1, lastAnswerCorrect: null } : state;
    case "SHOW_RESULTS": return state.phase === "game-over" ? { ...state, phase: "results" } : state;
    case "RESTART": return { ...initialGameState, mode: state.mode, practice: state.practice, runId: state.runId + 1 };
    case "VISIBILITY_HIDDEN": return ["countdown", "memorizing"].includes(state.phase) && state.pausedAt === null ? { ...state, pausedAt: action.now } : state;
    case "VISIBILITY_VISIBLE": return state.pausedAt !== null && state.phaseEndsAt !== null ? { ...state, phaseEndsAt: state.phaseEndsAt + Math.max(0, action.now - state.pausedAt), pausedAt: null } : { ...state, pausedAt: null };
    default: return state;
  }
}

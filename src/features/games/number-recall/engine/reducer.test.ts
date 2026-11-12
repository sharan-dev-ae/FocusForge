import { describe, expect, it } from "vitest";
import { gameReducer, initialGameState } from "./reducer";
import type { GameState } from "../types/game";

describe("game reducer", () => {
  it("follows an explicit correct-answer transition", () => {
    let state = gameReducer(initialGameState, { type: "START", now: 100 });
    state = gameReducer(state, { type: "BEGIN_MEMORIZING", sequence: "012", endsAt: 4100, runId: state.runId });
    state = gameReducer(state, { type: "BEGIN_RECALL", runId: state.runId });
    state = gameReducer(state, { type: "INPUT", value: "012" });
    state = gameReducer(state, { type: "SUBMIT" });
    state = gameReducer(state, { type: "VALIDATE", correct: true });
    expect(state.phase).toBe("success"); expect(state.score).toBe(30); expect(state.longestSequence).toBe(3);
  });
  it("ends Classic after an incorrect answer", () => {
    const recalling = { ...initialGameState, phase: "recalling" as const, input: "9" };
    const validating = gameReducer(recalling, { type: "SUBMIT" });
    expect(gameReducer(validating, { type: "VALIDATE", correct: false }).phase).toBe("game-over");
  });
  it("ignores duplicate submissions and stale callbacks", () => {
    const recalling = { ...initialGameState, phase: "recalling" as const, input: "123", runId: 4 };
    const submitted = gameReducer(recalling, { type: "SUBMIT" });
    expect(gameReducer(submitted, { type: "SUBMIT" })).toBe(submitted);
    expect(gameReducer({ ...initialGameState, phase: "countdown", runId: 4 }, { type: "BEGIN_MEMORIZING", sequence: "123", endsAt: 1, runId: 3 }).phase).toBe("countdown");
  });
  it("fully restarts while preserving preferences", () => {
    const state = { ...initialGameState, phase: "success" as const, score: 400, runId: 2, practice: { digits: 8, displayMs: 8000 } };
    const restarted = gameReducer(state, { type: "RESTART" });
    expect(restarted.phase).toBe("idle"); expect(restarted.score).toBe(0); expect(restarted.practice.digits).toBe(8); expect(restarted.runId).toBe(3);
  });
  it("pauses and extends an active deadline on visibility changes", () => {
    let state: GameState = { ...initialGameState, phase: "memorizing", phaseEndsAt: 5000 };
    state = gameReducer(state, { type: "VISIBILITY_HIDDEN", now: 2000 });
    state = gameReducer(state, { type: "VISIBILITY_VISIBLE", now: 7000 });
    expect(state.phaseEndsAt).toBe(10000); expect(state.pausedAt).toBeNull();
  });
});

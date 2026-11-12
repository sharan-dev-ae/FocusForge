"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { getDifficulty } from "../engine/difficulty";
import { generateDigitSequence, type RandomSource } from "../engine/generator";
import { gameReducer, initialGameState } from "../engine/reducer";
import type { CompletedSession } from "@/features/progress/types";

export function useNumberRecall(onComplete: (session: CompletedSession) => void, random?: RandomSource) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [now, setNow] = useState(() => Date.now());
  const secretRef = useRef("");
  const savedRunRef = useRef<number | null>(null);

  useEffect(() => {
    if (!state.phaseEndsAt || state.pausedAt !== null) return;
    const tick = () => setNow(Date.now());
    tick();
    const interval = window.setInterval(tick, 100);
    return () => window.clearInterval(interval);
  }, [state.phaseEndsAt, state.pausedAt]);

  useEffect(() => {
    if (!state.phaseEndsAt || state.pausedAt !== null || now < state.phaseEndsAt) return;
    if (state.phase === "countdown") {
      const config = state.mode === "classic" ? getDifficulty(state.level) : { level: state.level, ...state.practice };
      const sequence = generateDigitSequence(config.digits, random);
      secretRef.current = sequence;
      dispatch({ type: "BEGIN_MEMORIZING", sequence, endsAt: Date.now() + config.displayMs, runId: state.runId });
    } else if (state.phase === "memorizing") {
      dispatch({ type: "BEGIN_RECALL", runId: state.runId });
    }
  }, [now, random, state]);

  useEffect(() => {
    if (state.phase !== "validating") return;
    const correct = state.input === secretRef.current;
    secretRef.current = "";
    dispatch({ type: "VALIDATE", correct });
  }, [state.phase, state.input]);

  useEffect(() => {
    if (state.phase !== "game-over") return;
    const timeout = window.setTimeout(() => dispatch({ type: "SHOW_RESULTS" }), 450);
    return () => window.clearTimeout(timeout);
  }, [state.phase]);

  useEffect(() => {
    if ((state.phase !== "game-over" && state.phase !== "results") || state.startedAt === null || savedRunRef.current === state.runId) return;
    savedRunRef.current = state.runId;
    onComplete({
      id: `${state.startedAt}-${state.runId}`,
      game: "number-recall", mode: state.mode, completedAt: new Date().toISOString(), score: state.score,
      highestCompletedLevel: Math.max(0, state.level - 1), longestSequence: state.longestSequence,
      correctAttempts: state.correctAttempts, totalAttempts: state.totalAttempts,
      durationSeconds: Math.max(1, Math.round((Date.now() - state.startedAt) / 1000)),
    });
  }, [onComplete, state]);

  useEffect(() => {
    const onVisibility = () => dispatch({ type: document.hidden ? "VISIBILITY_HIDDEN" : "VISIBILITY_VISIBLE", now: Date.now() });
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const start = useCallback(() => { secretRef.current = ""; dispatch({ type: "START", now: Date.now() }); }, []);
  const restart = useCallback(() => { secretRef.current = ""; dispatch({ type: "RESTART" }); }, []);
  const submit = useCallback(() => dispatch({ type: "SUBMIT" }), []);
  const next = useCallback(() => dispatch({ type: "NEXT_ROUND", now: Date.now() }), []);
  const remainingMs = state.phaseEndsAt && state.pausedAt === null ? Math.max(0, state.phaseEndsAt - now) : state.phaseEndsAt && state.pausedAt ? Math.max(0, state.phaseEndsAt - state.pausedAt) : 0;
  return { state, dispatch, start, restart, submit, next, remainingMs };
}

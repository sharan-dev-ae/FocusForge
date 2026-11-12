"use client";

import { useCallback, useEffect, useState } from "react";
import { defaultProgress, progressStorage, summarizeProgress } from "./storage";
import type { CompletedSession, ProgressData } from "./types";

export function useProgress() {
  const [data, setData] = useState<ProgressData>(defaultProgress);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setData(progressStorage.load());
      setLoaded(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const addSession = useCallback((session: CompletedSession) => setData(progressStorage.addSession(session)), []);
  const reset = useCallback(() => { progressStorage.clear(); setData(structuredClone(defaultProgress)); }, []);
  const update = useCallback((next: ProgressData) => { progressStorage.save(next); setData(next); }, []);
  return { data, summary: summarizeProgress(data), loaded, addSession, reset, update };
}

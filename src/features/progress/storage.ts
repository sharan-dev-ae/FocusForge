import type { CompletedSession, ProgressData, ProgressSummary } from "./types";

export const STORAGE_KEY = "focusforge:progress";
export const STORAGE_VERSION = 1;
export const MAX_SESSIONS = 50;

export const defaultProgress: ProgressData = { version: 1, sessions: [], preferences: { soundEnabled: false }, practice: { digits: 5, displayMs: 5000 } };

function isSession(value: unknown): value is CompletedSession {
  if (!value || typeof value !== "object") return false;
  const s = value as Record<string, unknown>;
  return typeof s.id === "string" && s.game === "number-recall" && (s.mode === "classic" || s.mode === "practice") && typeof s.completedAt === "string" && ["score", "highestCompletedLevel", "longestSequence", "correctAttempts", "totalAttempts", "durationSeconds"].every((key) => typeof s[key] === "number" && Number.isFinite(s[key] as number) && (s[key] as number) >= 0);
}

export function parseProgress(raw: string | null): ProgressData {
  if (!raw) return structuredClone(defaultProgress);
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return structuredClone(defaultProgress);
    const data = value as Record<string, unknown>;
    if (data.version !== STORAGE_VERSION || !Array.isArray(data.sessions)) return structuredClone(defaultProgress);
    const preferences = data.preferences as Record<string, unknown> | undefined;
    const practice = data.practice as Record<string, unknown> | undefined;
    return {
      version: 1,
      sessions: data.sessions.filter(isSession).slice(0, MAX_SESSIONS),
      preferences: { soundEnabled: preferences?.soundEnabled === true },
      practice: {
        digits: typeof practice?.digits === "number" && practice.digits >= 2 && practice.digits <= 20 ? practice.digits : 5,
        displayMs: typeof practice?.displayMs === "number" && practice.displayMs >= 2000 && practice.displayMs <= 15000 ? practice.displayMs : 5000,
      },
    };
  } catch { return structuredClone(defaultProgress); }
}

export const progressStorage = {
  load(): ProgressData { if (typeof window === "undefined") return structuredClone(defaultProgress); try { return parseProgress(window.localStorage.getItem(STORAGE_KEY)); } catch { return structuredClone(defaultProgress); } },
  save(data: ProgressData): boolean { if (typeof window === "undefined") return false; try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, sessions: data.sessions.slice(0, MAX_SESSIONS) })); return true; } catch { return false; } },
  addSession(session: CompletedSession): ProgressData { const data = this.load(); const next = { ...data, sessions: [session, ...data.sessions].slice(0, MAX_SESSIONS) }; this.save(next); return next; },
  clear(): boolean { if (typeof window === "undefined") return false; try { window.localStorage.removeItem(STORAGE_KEY); return true; } catch { return false; } },
};

export function summarizeProgress(data: ProgressData): ProgressSummary {
  const classic = data.sessions.filter((session) => session.mode === "classic");
  return {
    gamesPlayed: data.sessions.length,
    personalBest: Math.max(0, ...classic.map((session) => session.score)),
    highestCompletedLevel: Math.max(0, ...classic.map((session) => session.highestCompletedLevel)),
    longestSequence: Math.max(0, ...data.sessions.map((session) => session.longestSequence)),
  };
}

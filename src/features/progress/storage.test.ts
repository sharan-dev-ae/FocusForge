import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultProgress, MAX_SESSIONS, parseProgress, progressStorage, STORAGE_KEY } from "./storage";
import type { CompletedSession } from "./types";

const session: CompletedSession = { id: "one", game: "number-recall", mode: "classic", completedAt: "2026-01-01T00:00:00.000Z", score: 30, highestCompletedLevel: 1, longestSequence: 3, correctAttempts: 1, totalAttempts: 2, durationSeconds: 12 };
describe("progress storage", () => {
  beforeEach(() => localStorage.clear());
  it("falls back safely for corrupt and unsupported data", () => { expect(parseProgress("not json")).toEqual(defaultProgress); expect(parseProgress('{"version":99,"sessions":[]}')).toEqual(defaultProgress); });
  it("persists completed sessions", () => { progressStorage.addSession(session); expect(progressStorage.load().sessions).toEqual([session]); });
  it("handles unavailable storage", () => { const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); }); expect(progressStorage.save(defaultProgress)).toBe(false); spy.mockRestore(); });
  it("limits retained history", () => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaultProgress, sessions: Array.from({ length: MAX_SESSIONS + 10 }, (_, i) => ({ ...session, id: String(i) })) })); expect(progressStorage.load().sessions).toHaveLength(MAX_SESSIONS); });
});

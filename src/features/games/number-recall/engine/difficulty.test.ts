import { describe, expect, it } from "vitest";
import { getDifficulty } from "./difficulty";
describe("difficulty progression", () => {
  it("matches the seven configured levels", () => { expect(getDifficulty(1)).toEqual({ level: 1, digits: 3, displayMs: 4000 }); expect(getDifficulty(7)).toEqual({ level: 7, digits: 9, displayMs: 7000 }); });
  it("grows predictably after level seven", () => { expect(getDifficulty(8)).toEqual({ level: 8, digits: 10, displayMs: 7500 }); expect(getDifficulty(10).digits).toBe(12); });
});

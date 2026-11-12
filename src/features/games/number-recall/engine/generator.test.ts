import { describe, expect, it } from "vitest";
import { generateDigitSequence } from "./generator";

describe("generateDigitSequence", () => {
  it("generates deterministic digits and preserves leading zeros", () => {
    const values = [0.01, 0.89, 0.31]; let index = 0;
    expect(generateDigitSequence(3, () => values[index++])).toBe("083");
  });
  it("rejects unsafe lengths", () => { expect(() => generateDigitSequence(0)).toThrow(RangeError); });
});

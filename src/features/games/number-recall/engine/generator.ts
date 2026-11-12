export type RandomSource = () => number;

export function generateDigitSequence(length: number, random: RandomSource = Math.random) {
  if (!Number.isInteger(length) || length < 1 || length > 100) throw new RangeError("Sequence length must be between 1 and 100.");
  return Array.from({ length }, () => Math.min(9, Math.floor(random() * 10))).join("");
}

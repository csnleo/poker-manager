import { describe, expect, it } from "vitest";
import { ALL_HANDS } from "./hands";
import { computeRangeStats, formatPercentage } from "./rangeStats";

describe("computeRangeStats", () => {
  it("is empty for an empty range", () => {
    expect(computeRangeStats([])).toEqual({
      hands: 0,
      combos: 0,
      percentage: 0,
      byKind: {
        pair: { hands: 0, combos: 0 },
        suited: { hands: 0, combos: 0 },
        offsuit: { hands: 0, combos: 0 },
      },
    });
  });

  it("counts AA + AKs as 10 combos (0.8%)", () => {
    const stats = computeRangeStats(["AA", "AKs"]);
    expect(stats.hands).toBe(2);
    expect(stats.combos).toBe(10);
    expect(stats.percentage).toBeCloseTo((10 / 1326) * 100);
    expect(formatPercentage(stats.percentage)).toBe("0.8%");
  });

  it("weighs offsuit hands 3× more than suited hands", () => {
    expect(computeRangeStats(["AKo"]).combos).toBe(3 * computeRangeStats(["AKs"]).combos);
  });

  it("breaks the range down by kind", () => {
    const stats = computeRangeStats(["AA", "KK", "AKs", "AQs", "AKo"]);
    expect(stats.byKind).toEqual({
      pair: { hands: 2, combos: 12 },
      suited: { hands: 2, combos: 8 },
      offsuit: { hands: 1, combos: 12 },
    });
    expect(stats.combos).toBe(32);
  });

  it("counts duplicates once", () => {
    expect(computeRangeStats(["AA", "AA"]).combos).toBe(6);
  });

  it("is 100% for every hand", () => {
    const stats = computeRangeStats(ALL_HANDS.map((hand) => hand.label));
    expect(stats.hands).toBe(169);
    expect(stats.combos).toBe(1326);
    expect(stats.percentage).toBe(100);
    expect(formatPercentage(stats.percentage)).toBe("100.0%");
  });

  it("rejects unknown labels", () => {
    expect(() => computeRangeStats(["AA", "KAs"])).toThrow('Unknown hand label: "KAs"');
  });
});

describe("formatPercentage", () => {
  it.each([
    [0, "0.0%"],
    [40.12, "40.1%"],
    [40.16, "40.2%"],
    [(532 / 1326) * 100, "40.1%"],
  ])("formats %d as %s", (value, expected) => {
    expect(formatPercentage(value)).toBe(expected);
  });
});

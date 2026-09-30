import { describe, expect, it } from "vitest";
import { ALL_HANDS, getHand, handAt, isHandLabel, sortHands, TOTAL_COMBOS } from "./hands";

describe("ALL_HANDS", () => {
  it("contains 169 unique hand classes", () => {
    expect(ALL_HANDS).toHaveLength(169);
    expect(new Set(ALL_HANDS.map((hand) => hand.label)).size).toBe(169);
  });

  it("has 13 pairs, 78 suited and 78 offsuit hands", () => {
    const count = (kind: string) => ALL_HANDS.filter((hand) => hand.kind === kind).length;
    expect(count("pair")).toBe(13);
    expect(count("suited")).toBe(78);
    expect(count("offsuit")).toBe(78);
  });

  it("adds up to 1326 combos", () => {
    expect(ALL_HANDS.reduce((sum, hand) => sum + hand.combos, 0)).toBe(TOTAL_COMBOS);
    expect(TOTAL_COMBOS).toBe(1326);
  });

  it("is ordered row by row", () => {
    expect(ALL_HANDS.slice(0, 3).map((hand) => hand.label)).toEqual(["AA", "AKs", "AQs"]);
    expect(ALL_HANDS[13].label).toBe("AKo");
    expect(ALL_HANDS[168].label).toBe("22");
  });
});

describe("handAt", () => {
  it.each([
    [0, 0, "AA", "pair", 6],
    [0, 1, "AKs", "suited", 4],
    [1, 0, "AKo", "offsuit", 12],
    [0, 12, "A2s", "suited", 4],
    [12, 0, "A2o", "offsuit", 12],
    [4, 4, "TT", "pair", 6],
    [11, 12, "32s", "suited", 4],
    [12, 11, "32o", "offsuit", 12],
    [12, 12, "22", "pair", 6],
  ])("cell (%i, %i) is %s", (row, col, label, kind, combos) => {
    expect(handAt(row, col)).toEqual({ label, kind, combos, row, col });
  });

  it.each([
    [-1, 0],
    [0, 13],
    [0.5, 0],
  ])("rejects cell (%s, %s) outside the grid", (row, col) => {
    expect(() => handAt(row, col)).toThrow(RangeError);
  });
});

describe("labels", () => {
  it("recognizes canonical labels only", () => {
    expect(isHandLabel("AKs")).toBe(true);
    expect(isHandLabel("72o")).toBe(true);
    expect(isHandLabel("KAs")).toBe(false);
    expect(isHandLabel("AAs")).toBe(false);
    expect(isHandLabel("AK")).toBe(false);
    expect(isHandLabel("aks")).toBe(false);
  });

  it("looks up a hand by label", () => {
    expect(getHand("QJo")).toMatchObject({ kind: "offsuit", combos: 12, row: 3, col: 2 });
    expect(() => getHand("XYz")).toThrow('Unknown hand label: "XYz"');
  });

  it("sorts and deduplicates labels in grid order", () => {
    expect(sortHands(["22", "AKo", "AA", "AKs", "AA"])).toEqual(["AA", "AKs", "AKo", "22"]);
    expect(sortHands([])).toEqual([]);
    expect(() => sortHands(["AA", "nope"])).toThrow();
  });
});

import { getHand, TOTAL_COMBOS, type HandKind } from "./hands";

export interface KindStats {
  hands: number;
  combos: number;
}

export interface RangeStats {
  /** Number of selected hand classes (out of 169). */
  hands: number;
  /** Number of selected combos (out of 1326). */
  combos: number;
  /** Share of all starting hands, from 0 to 100. */
  percentage: number;
  byKind: Record<HandKind, KindStats>;
}

/** Size of a range given its selected hand labels. Duplicates are counted once. */
export function computeRangeStats(labels: Iterable<string>): RangeStats {
  const byKind: Record<HandKind, KindStats> = {
    pair: { hands: 0, combos: 0 },
    suited: { hands: 0, combos: 0 },
    offsuit: { hands: 0, combos: 0 },
  };

  let hands = 0;
  let combos = 0;
  for (const label of new Set(labels)) {
    const hand = getHand(label);
    hands += 1;
    combos += hand.combos;
    byKind[hand.kind].hands += 1;
    byKind[hand.kind].combos += hand.combos;
  }

  return { hands, combos, percentage: (combos / TOTAL_COMBOS) * 100, byKind };
}

/** Percentage with one decimal, e.g. 0.754 → "0.8%". */
export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(1)}%`;
}

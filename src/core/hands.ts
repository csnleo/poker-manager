/** Card ranks from highest to lowest, in grid order. */
export const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"] as const;

export type Rank = (typeof RANKS)[number];

export type HandKind = "pair" | "suited" | "offsuit";

/** Number of card combinations for each kind of starting hand. */
export const COMBOS_BY_KIND: Record<HandKind, number> = {
  pair: 6,
  suited: 4,
  offsuit: 12,
};

/** Total number of two-card starting hands (52 choose 2). */
export const TOTAL_COMBOS = 1326;

export const GRID_SIZE = RANKS.length;

export interface HandClass {
  /** Canonical label, e.g. "AA", "AKs", "AKo". */
  label: string;
  kind: HandKind;
  combos: number;
  /** Position in the 13×13 grid (0-based). */
  row: number;
  col: number;
}

/**
 * Hand class at a grid cell. Pairs are on the diagonal, suited hands above it
 * and offsuit hands below it; the higher rank always comes first in the label.
 */
export function handAt(row: number, col: number): HandClass {
  if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || col < 0 || row >= GRID_SIZE || col >= GRID_SIZE) {
    throw new RangeError(`Cell (${row}, ${col}) is outside the ${GRID_SIZE}×${GRID_SIZE} grid`);
  }

  const high = RANKS[Math.min(row, col)];
  const low = RANKS[Math.max(row, col)];
  const kind: HandKind = row === col ? "pair" : row < col ? "suited" : "offsuit";
  const suffix = kind === "suited" ? "s" : kind === "offsuit" ? "o" : "";

  return { label: `${high}${low}${suffix}`, kind, combos: COMBOS_BY_KIND[kind], row, col };
}

/** All 169 hand classes, row by row, as displayed in the grid. */
export const ALL_HANDS: readonly HandClass[] = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) =>
  handAt(Math.floor(i / GRID_SIZE), i % GRID_SIZE),
);

const HANDS_BY_LABEL: ReadonlyMap<string, HandClass> = new Map(ALL_HANDS.map((hand) => [hand.label, hand]));

export function isHandLabel(label: string): boolean {
  return HANDS_BY_LABEL.has(label);
}

/** Hand class for a canonical label; throws on anything else (e.g. "KAs", "AAs"). */
export function getHand(label: string): HandClass {
  const hand = HANDS_BY_LABEL.get(label);
  if (!hand) {
    throw new Error(`Unknown hand label: "${label}"`);
  }
  return hand;
}

/** Deduplicated labels sorted in grid order; throws on unknown labels. */
export function sortHands(labels: Iterable<string>): string[] {
  const unique = new Set(labels);
  const hands = [...unique].map(getHand);
  hands.sort((a, b) => a.row * GRID_SIZE + a.col - (b.row * GRID_SIZE + b.col));
  return hands.map((hand) => hand.label);
}

/** Seats at a 5-max table, in preflop action order. */
export const POSITIONS = ["UTG", "CO", "BTN", "SB", "BB"] as const;

export type Position = (typeof POSITIONS)[number];

export function isPosition(value: string): value is Position {
  return (POSITIONS as readonly string[]).includes(value);
}

import { describe, expect, it } from "vitest";
import { isPosition, POSITIONS } from "./positions";

describe("positions", () => {
  it("lists the 5-max seats in action order", () => {
    expect(POSITIONS).toEqual(["UTG", "CO", "BTN", "SB", "BB"]);
  });

  it("recognizes valid positions only", () => {
    expect(isPosition("BTN")).toBe(true);
    expect(isPosition("HJ")).toBe(false);
    expect(isPosition("btn")).toBe(false);
  });
});

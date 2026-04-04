import { describe, expect, it } from "vitest";

import { parsePositiveWorkbenchNumber, parseWorkbenchNumber } from "./parse-number";

describe("parseWorkbenchNumber", () => {
  it.each([
    ["8,0", 8],
    ["18,5", 18.5],
    ["1800,0", 1800],
    ["1.800,5", 1800.5],
    ["1,800.5", 1800.5],
    ["46.667", 46.667],
    ["0,7", 0.7]
  ])("parses %s into %s", (value, expected) => {
    expect(parseWorkbenchNumber(value)).toBe(expected);
  });

  it.each(["", "abc", "1,2,3", "12mm"])("rejects malformed value %s", (value) => {
    expect(parseWorkbenchNumber(value)).toBeUndefined();
  });
});

describe("parsePositiveWorkbenchNumber", () => {
  it.each([
    ["8,0", 8],
    ["0,7", 0.7]
  ])("keeps positive localized value %s live", (value, expected) => {
    expect(parsePositiveWorkbenchNumber(value)).toBe(expected);
  });

  it.each(["0", "0,0", "-1", "-1,5"])("rejects non-positive value %s", (value) => {
    expect(parsePositiveWorkbenchNumber(value)).toBeUndefined();
  });
});

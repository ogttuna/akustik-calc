import { describe, expect, it } from "vitest";

import {
  createIllustrationMaterial,
  distributeIllustrationSizes,
  formatIllustrationClampLabel,
  parseIllustrationThicknessMm
} from "./simple-workbench-illustration";

describe("simple workbench illustration helpers", () => {
  it("keeps extreme wall layer sizes within the configured preview thresholds", () => {
    const allocations = distributeIllustrationSizes([1, 300], "wall");

    expect(allocations[0]?.sizePx).toBeGreaterThanOrEqual(24);
    expect(allocations[1]?.sizePx).toBeLessThanOrEqual(126);
    expect(allocations[1]?.sizePx).toBeGreaterThan(allocations[0]?.sizePx ?? 0);
    expect(allocations[0]?.clampedTo).toBe("min");
    expect(allocations[1]?.clampedTo).toBe("max");
  });

  it("preserves ordering for mid-range floor layers while staying bounded", () => {
    const allocations = distributeIllustrationSizes([18, 42, 95], "floor");

    expect(allocations.map((entry) => entry.sizePx)).toEqual(
      expect.arrayContaining([
        expect.any(Number),
        expect.any(Number),
        expect.any(Number)
      ])
    );
    expect(allocations[0]!.sizePx).toBeLessThan(allocations[1]!.sizePx);
    expect(allocations[1]!.sizePx).toBeLessThan(allocations[2]!.sizePx);
    expect(allocations.every((entry) => entry.sizePx >= 24 && entry.sizePx <= 96)).toBe(true);
  });

  it("parses proposal thickness labels and infers illustration material categories", () => {
    expect(parseIllustrationThicknessMm("12.5 mm")).toBe(12.5);
    expect(parseIllustrationThicknessMm("n/a")).toBeNull();

    expect(
      createIllustrationMaterial({
        categoryLabel: "Facing layer",
        label: "Gypsum board",
        metaLabel: "Finish"
      }).category
    ).toBe("finish");

    expect(
      createIllustrationMaterial({
        categoryLabel: "Cavity",
        label: "Air gap",
        metaLabel: "Void"
      }).category
    ).toBe("gap");
  });

  it("exposes the configured clamp label for UI copy", () => {
    expect(formatIllustrationClampLabel("proposalFloor")).toBe("18-82 px preview clamp");
  });
});

import { describe, expect, it } from "vitest";

import {
  createIllustrationMaterial,
  distributeIllustrationSizes,
  formatIllustrationClampLabel,
  getIllustrationMaterialCue,
  parseIllustrationThicknessMm,
  type IllustrationMaterialCue,
  type LayerVisualMaterial
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

  it("keeps nearby thin layers visually close when a thick layer hits the preview clamp", () => {
    const allocations = distributeIllustrationSizes([12, 100, 15], "wall");
    const twelveMm = allocations[0]!.sizePx;
    const oneHundredMm = allocations[1]!.sizePx;
    const fifteenMm = allocations[2]!.sizePx;

    expect(fifteenMm).toBeGreaterThan(twelveMm);
    expect(fifteenMm / twelveMm).toBeLessThan(1.25);
    expect(oneHundredMm).toBeGreaterThan(fifteenMm);
  });

  it("keeps dense layer stacks at the readable minimum even when the nominal total cap is exceeded", () => {
    const allocations = distributeIllustrationSizes(Array.from({ length: 20 }, () => 12), "floor");

    expect(allocations.every((entry) => entry.sizePx >= 24)).toBe(true);
    expect(allocations.reduce((sum, entry) => sum + entry.sizePx, 0)).toBe(480);
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

  it("maps common catalog materials to believable visual cue families", () => {
    const cases: Array<{ expected: IllustrationMaterialCue; material: LayerVisualMaterial }> = [
      {
        expected: "concrete",
        material: {
          category: "mass",
          densityKgM3: 2400,
          id: "concrete",
          name: "Concrete",
          tags: ["structural"]
        }
      },
      {
        expected: "plaster",
        material: {
          category: "finish",
          densityKgM3: 1000,
          id: "gypsum_plaster",
          name: "Gypsum Plaster",
          tags: ["plaster"]
        }
      },
      {
        expected: "masonry",
        material: {
          category: "mass",
          densityKgM3: 700,
          id: "ytong_aac_d700",
          name: "Ytong AAC D700",
          tags: ["aac", "masonry"]
        }
      },
      {
        expected: "masonry",
        material: {
          category: "finish",
          densityKgM3: 2200,
          id: "porcelain_tile",
          name: "Porcelain Tile",
          tags: ["floor-finish", "tile"]
        }
      },
      {
        expected: "steel_support",
        material: {
          category: "mass",
          densityKgM3: 2350,
          id: "composite_steel_deck",
          name: "Composite Steel Deck",
          tags: ["steel-deck"]
        }
      },
      {
        expected: "resilient",
        material: {
          category: "support",
          densityKgM3: 760,
          id: "geniemat_rst05",
          impact: { dynamicStiffnessMNm3: 105 },
          name: "GenieMat RST05",
          tags: ["resilient"]
        }
      },
      {
        expected: "fiber",
        material: {
          category: "insulation",
          densityKgM3: 45,
          id: "rockwool",
          name: "Rock Wool",
          tags: ["cavity-fill", "porous"]
        }
      },
      {
        expected: "timber",
        material: {
          category: "mass",
          densityKgM3: 650,
          id: "osb",
          name: "OSB",
          tags: ["wood-board", "timber"]
        }
      }
    ];

    for (const testCase of cases) {
      expect(getIllustrationMaterialCue(testCase.material)).toBe(testCase.expected);
    }
  });

  it("exposes the configured clamp label for UI copy", () => {
    expect(formatIllustrationClampLabel("proposalFloor")).toBe("18-82 px preview clamp");
  });
});

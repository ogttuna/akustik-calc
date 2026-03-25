import { describe, expect, it } from "vitest";

import { buildSimpleWorkbenchProposalConstructionSection } from "./simple-workbench-proposal-construction-section";

describe("simple workbench proposal construction section", () => {
  it("builds floor-oriented anchors, totals, and row tones", () => {
    const section = buildSimpleWorkbenchProposalConstructionSection(
      [
        {
          categoryLabel: "Top finish",
          index: 1,
          label: "Vinyl flooring",
          roleLabel: "Floor covering",
          thicknessLabel: "4 mm"
        },
        {
          categoryLabel: "Base structure",
          index: 2,
          label: "Concrete slab",
          roleLabel: "Base structure",
          thicknessLabel: "180 mm"
        }
      ],
      "Floor"
    );

    expect(section.isWall).toBe(false);
    expect(section.anchorFromLabel).toBe("Walking side");
    expect(section.anchorToLabel).toBe("Ceiling side");
    expect(section.totalThicknessLabel).toBe("184 mm total");
    expect(section.headline).toBe("2 visible rows in solver order.");
    expect(section.bands).toEqual([
      {
        category: "top finish",
        flexGrow: 12,
        indexLabel: "01",
        label: "Vinyl flooring",
        materialFamily: "board",
        metaLabel: "Floor covering",
        thicknessMm: 4,
        thicknessLabel: "4 mm",
        tone: "leading"
      },
      {
        category: "base structure",
        flexGrow: 180,
        indexLabel: "02",
        label: "Concrete slab",
        materialFamily: "mass",
        metaLabel: "Base structure",
        thicknessMm: 180,
        thicknessLabel: "180 mm",
        tone: "trailing"
      }
    ]);
  });

  it("builds wall-oriented anchors and keeps interior rows explicit", () => {
    const section = buildSimpleWorkbenchProposalConstructionSection(
      [
        {
          categoryLabel: "Finish",
          index: 1,
          label: "Gypsum board",
          roleLabel: "Facing layer",
          thicknessLabel: "12.5 mm"
        },
        {
          categoryLabel: "Insulation",
          index: 2,
          label: "Mineral wool",
          thicknessLabel: "75 mm"
        },
        {
          categoryLabel: "Finish",
          index: 3,
          label: "Gypsum board",
          roleLabel: "Facing layer",
          thicknessLabel: "12.5 mm"
        }
      ],
      "Wall"
    );

    expect(section.isWall).toBe(true);
    expect(section.anchorFromLabel).toBe("Side A");
    expect(section.anchorToLabel).toBe("Side B");
    expect(section.totalThicknessLabel).toBe("100 mm total");
    expect(section.headline).toBe("3 visible rows in solver order.");
    expect(section.bands.map((band) => band.tone)).toEqual(["leading", "interior", "trailing"]);
    expect(section.bands[1]).toMatchObject({
      indexLabel: "02",
      materialFamily: "insulation",
      metaLabel: "Insulation",
      thicknessMm: 75,
      thicknessLabel: "75 mm"
    });
  });
});

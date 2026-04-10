import { describe, expect, it } from "vitest";

import {
  buildSimpleWorkbenchProposalConstructionRender,
  resolveConstructionAnnotationLayout
} from "./simple-workbench-proposal-reporting";

describe("simple workbench proposal reporting", () => {
  it("switches to compact annotation rows when the floor figure has many layers", () => {
    const layout = resolveConstructionAnnotationLayout({
      bandCount: 12,
      height: 380,
      orientation: "floor"
    });

    expect(layout.compact).toBe(true);
    expect(layout.showMeta).toBe(false);
    expect(layout.maxLabelLines).toBe(1);
    expect(layout.minGap).toBeGreaterThanOrEqual(20);
  });

  it("omits per-row meta text in dense construction svg output to avoid label collisions", () => {
    const render = buildSimpleWorkbenchProposalConstructionRender(
      Array.from({ length: 8 }, (_, index) => ({
        categoryLabel: "Base structure",
        index: index + 1,
        label: `Long layer label ${index + 1} with extra wording`,
        roleLabel: `Meta detail ${index + 1} should stay out of dense svg labels`,
        thicknessLabel: `${index + 8} mm`
      })),
      "Floor"
    );

    expect(render.svgMarkup).not.toContain("Meta detail 1 should stay out of dense svg labels");
    expect(render.legendRowsHtml).toContain("Meta detail 1 should stay out of dense svg labels");
  });

  it("keeps dense svg labels distinguishable with single-line ellipsis instead of collapsing to the first words", () => {
    const render = buildSimpleWorkbenchProposalConstructionRender(
      Array.from({ length: 8 }, (_, index) => ({
        categoryLabel: "Base structure",
        index: index + 1,
        label: `Very long validation layer ${index + 1} with extended wording to stress annotation spacing`,
        roleLabel: `Meta detail ${index + 1}`,
        thicknessLabel: `${index + 8} mm`
      })),
      "Floor"
    );

    expect(render.svgMarkup).toContain("Very long validation layer…");
    expect(render.svgMarkup).not.toContain(">Very long<");
  });
});

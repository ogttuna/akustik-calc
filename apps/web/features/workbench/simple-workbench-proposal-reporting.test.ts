import { describe, expect, it } from "vitest";

import {
  buildSimpleWorkbenchProposalConstructionRender,
  resolveConstructionAnnotationLayout,
  resolveConstructionAnnotationRowPositions,
  resolveConstructionLayerRunLength,
  resolveConstructionSvgHeight
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

  it("expands construction svg height for dense floor and wall layer stacks", () => {
    expect(resolveConstructionSvgHeight({ bandCount: 8, orientation: "floor" })).toBe(380);
    expect(resolveConstructionSvgHeight({ bandCount: 12, orientation: "floor" })).toBe(492);
    expect(resolveConstructionSvgHeight({ bandCount: 7, orientation: "wall" })).toBe(326);
    expect(resolveConstructionSvgHeight({ bandCount: 12, orientation: "wall" })).toBe(446);
  });

  it("expands the drawn layer run as dense floor stacks grow", () => {
    expect(resolveConstructionLayerRunLength({ bandCount: 8, orientation: "floor" })).toBe(236);
    expect(resolveConstructionLayerRunLength({ bandCount: 15, orientation: "floor" })).toBe(390);
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

  it("uses an expanded floor viewBox once the dense label stack needs extra vertical room", () => {
    const render = buildSimpleWorkbenchProposalConstructionRender(
      Array.from({ length: 12 }, (_, index) => ({
        categoryLabel: "Base structure",
        index: index + 1,
        label: `Layer ${index + 1}`,
        roleLabel: `Meta detail ${index + 1}`,
        thicknessLabel: `${index + 8} mm`
      })),
      "Floor"
    );

    expect(render.svgMarkup).toContain('viewBox="0 0 860 492"');
    expect(render.svgMarkup).toContain("max-height:492px");
    expect(render.svgMarkup).toContain('height="324"');
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

  it("uses uniform annotation rows for dense stacks so thin top layers do not cluster labels", () => {
    const layout = resolveConstructionAnnotationLayout({
      bandCount: 15,
      height: resolveConstructionSvgHeight({ bandCount: 15, orientation: "floor" }),
      orientation: "floor"
    });
    const positions = resolveConstructionAnnotationRowPositions({
      layout,
      targets: [78, 83, 89, 168, 206, 244, 282, 320, 358, 396, 434, 472, 510, 548, 586]
    });
    const gaps = positions.slice(1).map((position, index) => Math.round((position - positions[index]!) * 10) / 10);

    expect(new Set(gaps)).toHaveLength(1);
    expect(gaps[0]).toBeGreaterThanOrEqual(32);
  });
});

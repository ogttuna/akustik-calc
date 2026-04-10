import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];

function hasCeilingBoardBlocker(warnings: readonly string[]) {
  return warnings.some((warning) => /single-entry floor roles are duplicated: ceiling board x2/i.test(warning));
}

describe("floor packaged-lane disjoint detours", () => {
  it("demotes disjoint open-web lower-board topology off the defended family-general lane", () => {
    const canonical: readonly LayerInput[] = [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ];
    const disjoint: readonly LayerInput[] = [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ];

    const canonicalResult = calculateAssembly(canonical, { targetOutputs: LAB_OUTPUTS });
    const disjointResult = calculateAssembly(disjoint, { targetOutputs: LAB_OUTPUTS });

    expect(canonicalResult.floorSystemEstimate?.kind).toBe("family_general");
    expect(canonicalResult.impact?.basis).toBe("predictor_floor_system_family_general_estimate");
    expect(hasCeilingBoardBlocker(canonicalResult.warnings)).toBe(false);

    expect(disjointResult.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(disjointResult.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(hasCeilingBoardBlocker(disjointResult.warnings)).toBe(true);
  });

  it("keeps disjoint composite lower-board topology on the conservative continuation with explicit blocker copy", () => {
    const canonical: readonly LayerInput[] = [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }
    ];
    const disjoint: readonly LayerInput[] = [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }
    ];

    const canonicalResult = calculateAssembly(canonical, { targetOutputs: LAB_OUTPUTS });
    const disjointResult = calculateAssembly(disjoint, { targetOutputs: LAB_OUTPUTS });

    expect(canonicalResult.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(hasCeilingBoardBlocker(canonicalResult.warnings)).toBe(false);

    expect(disjointResult.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(hasCeilingBoardBlocker(disjointResult.warnings)).toBe(true);
    expect(
      disjointResult.floorSystemEstimate?.notes.some((note) =>
        /Disjoint lower-board topology stayed on the conservative composite continuation/i.test(note)
      )
    ).toBe(true);
  });

  it("keeps CLT and open-box disjoint lower-board topologies fail-closed with blocker copy", () => {
    const cases: readonly {
      id: string;
      layers: readonly LayerInput[];
    }[] = [
      {
        id: "clt",
        layers: [
          { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
          { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
          { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
        ]
      },
      {
        id: "open-box",
        layers: [
          { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
          { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
          { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
        ]
      }
    ];

    for (const testCase of cases) {
      const result = calculateAssembly(testCase.layers, { targetOutputs: LAB_OUTPUTS });

      expect(result.floorSystemEstimate, testCase.id).toBeNull();
      expect(result.impact, testCase.id).toBeNull();
      expect(hasCeilingBoardBlocker(result.warnings), testCase.id).toBe(true);
    }
  });

  it("keeps noncanonical open-web lower board-split topology on the conservative FL-24 continuation with blocker copy", () => {
    const result = calculateAssembly(
      [
        { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
        { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
        { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
        { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
      ],
      { targetOutputs: LAB_OUTPUTS }
    );

    expect(result.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(result.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(result.impact?.estimateCandidateIds).toEqual(["ubiq_fl24_open_web_steel_300_16mm_exact_lab_2026"]);
    expect(hasCeilingBoardBlocker(result.warnings)).toBe(true);
    expect(
      result.floorSystemEstimate?.notes.some((note) =>
        /Family-general lightweight-steel matching was withheld because the lower-only ceiling-board topology is split/i.test(note)
      )
    ).toBe(true);
  });
});

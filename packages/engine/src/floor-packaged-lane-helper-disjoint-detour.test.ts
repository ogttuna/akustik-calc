import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];

function hasPredictorBlocker(warnings: readonly string[], role: "ceiling_fill" | "ceiling_cavity") {
  const label = role.replaceAll("_", " ");
  return warnings.some((warning: string) => new RegExp(`single-entry floor roles are duplicated: ${label} x2`, "i").test(warning));
}

describe("floor packaged-lane helper disjoint detours", () => {
  it("demotes disjoint open-web lower helper topology off the defended family-general lane", () => {
    const canonical: readonly LayerInput[] = [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ];
    const fillDisjoint: readonly LayerInput[] = [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 70 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 75 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ];
    const cavityDisjoint: readonly LayerInput[] = [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 30 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 35 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ];

    const canonicalResult = calculateAssembly(canonical, { targetOutputs: LAB_OUTPUTS });
    const fillDisjointResult = calculateAssembly(fillDisjoint, { targetOutputs: LAB_OUTPUTS });
    const cavityDisjointResult = calculateAssembly(cavityDisjoint, { targetOutputs: LAB_OUTPUTS });

    expect(canonicalResult.floorSystemEstimate?.kind).toBe("family_general");
    expect(canonicalResult.impact?.basis).toBe("predictor_floor_system_family_general_estimate");

    expect(fillDisjointResult.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(fillDisjointResult.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(hasPredictorBlocker(fillDisjointResult.warnings, "ceiling_fill")).toBe(true);
    expect(
      fillDisjointResult.floorSystemEstimate?.notes.some((note: string) =>
        /Family-general lightweight-steel matching was withheld because the lower-only helper topology is split/i.test(note)
      )
    ).toBe(true);

    expect(cavityDisjointResult.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(cavityDisjointResult.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(hasPredictorBlocker(cavityDisjointResult.warnings, "ceiling_cavity")).toBe(true);
    expect(
      cavityDisjointResult.floorSystemEstimate?.notes.some((note: string) =>
        /Family-general lightweight-steel matching was withheld because the lower-only helper topology is split/i.test(note)
      )
    ).toBe(true);
  });

  it("keeps disjoint composite lower helper topology on the conservative continuation", () => {
    const canonical: readonly LayerInput[] = [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }
    ];
    const fillDisjoint: readonly LayerInput[] = [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 25 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 25 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }
    ];
    const cavityDisjoint: readonly LayerInput[] = [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 75 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 75 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }
    ];

    const canonicalResult = calculateAssembly(canonical, { targetOutputs: LAB_OUTPUTS });
    const fillDisjointResult = calculateAssembly(fillDisjoint, { targetOutputs: LAB_OUTPUTS });
    const cavityDisjointResult = calculateAssembly(cavityDisjoint, { targetOutputs: LAB_OUTPUTS });

    expect(canonicalResult.floorSystemEstimate?.kind).toBe("low_confidence");

    expect(fillDisjointResult.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(fillDisjointResult.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(hasPredictorBlocker(fillDisjointResult.warnings, "ceiling_fill")).toBe(true);
    expect(
      fillDisjointResult.floorSystemEstimate?.notes.some((note: string) =>
        /Lower-only helper topology stayed on the conservative composite continuation/i.test(note)
      )
    ).toBe(true);

    expect(cavityDisjointResult.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(cavityDisjointResult.impact?.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(hasPredictorBlocker(cavityDisjointResult.warnings, "ceiling_cavity")).toBe(true);
    expect(
      cavityDisjointResult.floorSystemEstimate?.notes.some((note: string) =>
        /Lower-only helper topology stayed on the conservative composite continuation/i.test(note)
      )
    ).toBe(true);
  });

  it("keeps CLT and open-box disjoint lower helper topology fail-closed with blocker copy", () => {
    const cases: readonly {
      id: string;
      layers: readonly LayerInput[];
      role: "ceiling_fill" | "ceiling_cavity";
    }[] = [
      {
        id: "clt fill",
        role: "ceiling_fill",
        layers: [
          { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
          { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
          { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
          { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
        ]
      },
      {
        id: "open-box cavity",
        role: "ceiling_cavity",
        layers: [
          { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 14 },
          { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
          { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 14 },
          { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
        ]
      }
    ];

    for (const testCase of cases) {
      const result = calculateAssembly(testCase.layers, { targetOutputs: LAB_OUTPUTS });

      expect(result.floorSystemEstimate, testCase.id).toBeNull();
      expect(result.impact, testCase.id).toBeNull();
      expect(hasPredictorBlocker(result.warnings, testCase.role), testCase.id).toBe(true);
    }
  });
});

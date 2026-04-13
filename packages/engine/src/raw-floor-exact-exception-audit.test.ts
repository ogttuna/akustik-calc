import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import { buildFloorTestLayersFromCriteria } from "./floor-system-test-layer-builders";
import { maybeInferFloorRoleLayerStack } from "./impact-predictor-input";

const REQUESTED_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"] as const;

function buildLayersFromCriteria(match: Parameters<typeof buildFloorTestLayersFromCriteria>[0], mode: "raw" | "tagged"): LayerInput[] {
  return buildFloorTestLayersFromCriteria(match, mode);
}

function coreSnapshot(result: ReturnType<typeof calculateAssembly>) {
  return {
    floorRw: result.floorSystemRatings?.Rw ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    impactLnW: result.impact?.LnW ?? null,
    impactLnWPlusCI: result.impact?.LnWPlusCI ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

describe("raw floor exact exception audit", () => {
  it("keeps the current no-safe-inference exact rows explicit", () => {
    const ids = EXACT_FLOOR_SYSTEMS.filter((system) => {
      const rawLayers = buildLayersFromCriteria(system.match, "raw");
      return !maybeInferFloorRoleLayerStack(rawLayers);
    }).map((system) => system.id);

    expect(ids).toEqual(["dataholz_gdsnxn01a_timber_frame_lab_2026"]);
  });

  it("infers the bare-concrete raw stack as a safe base and lands the curated exact row", () => {
    expect(
      maybeInferFloorRoleLayerStack([
        { materialId: "concrete", thicknessMm: 140 }
      ])
    ).toEqual([
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 140 }
    ]);

    const result = calculateAssembly([{ materialId: "concrete", thicknessMm: 140 }], {
      targetOutputs: REQUESTED_OUTPUTS
    });

    expect(result.floorSystemMatch?.system.id).toBe("euracoustics_f0_bare_concrete_lab_2026");
    expect(result.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(result.impact?.LnW).toBe(77);
    expect(result.floorSystemRatings?.Rw).toBe(56);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w"]);
  });

  it("keeps the same bare-concrete exact landing on the impact-only surface", () => {
    const result = calculateImpactOnly([{ materialId: "concrete", thicknessMm: 140 }], {
      targetOutputs: ["Rw", "Ln,w"]
    });

    expect(result.floorSystemMatch?.system.id).toBe("euracoustics_f0_bare_concrete_lab_2026");
    expect(result.impact?.basis).toBe("open_measured_floor_system_exact_match");
    expect(result.sourceMode).toBe("visible_stack");
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w"]);
  });

  it("keeps the current raw-vs-tagged core drift set explicit", () => {
    const driftIds = EXACT_FLOOR_SYSTEMS.map((system) => {
      const tagged = calculateAssembly(buildLayersFromCriteria(system.match, "tagged"), {
        targetOutputs: REQUESTED_OUTPUTS
      });
      const raw = calculateAssembly(buildLayersFromCriteria(system.match, "raw"), {
        targetOutputs: REQUESTED_OUTPUTS
      });

      return {
        id: system.id,
        manualMatch: system.manualMatch ?? true,
        raw: coreSnapshot(raw),
        same: JSON.stringify(coreSnapshot(tagged)) === JSON.stringify(coreSnapshot(raw)),
        tagged: coreSnapshot(tagged)
      };
    })
      .filter((entry) => !entry.same)
      .map((entry) => entry.id);

    expect(driftIds).toEqual([
      "dataholz_gdsnxn01a_timber_frame_lab_2026",
      "tuas_x3_clt140_measured_2026",
      "tuas_x4_clt140_measured_2026",
      "tuas_r7b_open_box_timber_measured_2026",
      "tuas_r8b_open_box_timber_measured_2026",
      "tuas_r10a_open_box_timber_measured_2026",
      "tuas_c3_clt260_measured_2026",
      "tuas_c4_clt260_measured_2026",
      "tuas_c5_clt260_measured_2026",
      "tuas_c7_clt260_measured_2026",
      "tuas_c7c_clt260_measured_2026",
      "tuas_c3c_clt260_measured_2026",
      "tuas_c4c_clt260_measured_2026"
    ]);
  });
});

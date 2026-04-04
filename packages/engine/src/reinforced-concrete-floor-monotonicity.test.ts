import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

function calculateConcreteCase(layers: Parameters<typeof calculateAssembly>[0]) {
  return {
    field: calculateAssembly(layers, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }),
    lab: calculateAssembly(layers, {
      targetOutputs: ["Rw", "Ln,w", "DeltaLw"]
    })
  };
}

describe("reinforced concrete floor monotonicity", () => {
  it("keeps bare heavy-concrete thickness steps monotonic on lab and field companions", () => {
    const concrete150 = calculateConcreteCase([{ floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }]);
    const concrete200 = calculateConcreteCase([{ floorRole: "base_structure", materialId: "concrete", thicknessMm: 200 }]);

    expect(concrete150.lab.impact?.basis).toBe("predictor_heavy_bare_floor_iso12354_annexc_estimate");
    expect(concrete200.lab.impact?.basis).toBe("predictor_heavy_bare_floor_iso12354_annexc_estimate");
    expect(concrete200.lab.floorSystemRatings?.Rw ?? 0).toBeGreaterThan(concrete150.lab.floorSystemRatings?.Rw ?? 0);
    expect(concrete200.lab.impact?.LnW ?? Infinity).toBeLessThan(concrete150.lab.impact?.LnW ?? -Infinity);
    expect(concrete200.field.metrics.estimatedRwPrimeDb ?? 0).toBeGreaterThan(concrete150.field.metrics.estimatedRwPrimeDb ?? 0);
    expect(concrete200.field.impact?.LPrimeNTw ?? Infinity).toBeLessThan(concrete150.field.impact?.LPrimeNTw ?? -Infinity);
  });

  it("keeps heavy floating wet concrete packages clearly better than the bare heavy floor", () => {
    const bare150 = calculateConcreteCase([{ floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }]);
    const wetTile150 = calculateConcreteCase([
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ]);

    expect(wetTile150.lab.impact?.basis).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
    expect(wetTile150.lab.floorSystemEstimate?.kind).toBe("family_general");
    expect(wetTile150.lab.impact?.LnW ?? Infinity).toBeLessThan((bare150.lab.impact?.LnW ?? 0) - 15);
    expect(wetTile150.field.impact?.LPrimeNTw ?? Infinity).toBeLessThan((bare150.field.impact?.LPrimeNTw ?? 0) - 15);
    expect(wetTile150.lab.floorSystemRatings?.Rw ?? 0).toBeGreaterThanOrEqual(bare150.lab.floorSystemRatings?.Rw ?? 0);
  });

  it("does not regress when a suspended ceiling is added to a published wet concrete package", () => {
    const wetTile150 = calculateConcreteCase([
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ]);
    const wetTile150WithCeiling = calculateConcreteCase([
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 65 },
      { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 }
    ]);

    expect(wetTile150WithCeiling.lab.impact?.basis).toBe("predictor_heavy_concrete_published_upper_treatment_estimate");
    expect(wetTile150WithCeiling.lab.floorSystemEstimate?.kind).toBe("family_general");
    expect(wetTile150WithCeiling.lab.floorSystemRatings?.Rw ?? 0).toBeGreaterThan(wetTile150.lab.floorSystemRatings?.Rw ?? 0);
    expect(wetTile150WithCeiling.field.metrics.estimatedRwPrimeDb ?? 0).toBeGreaterThanOrEqual(
      wetTile150.field.metrics.estimatedRwPrimeDb ?? 0
    );
    expect(wetTile150WithCeiling.lab.impact?.LnW ?? Infinity).toBeLessThanOrEqual((wetTile150.lab.impact?.LnW ?? 0) + 0.5);
    expect(wetTile150WithCeiling.field.impact?.LPrimeNTw ?? Infinity).toBeLessThanOrEqual(
      (wetTile150.field.impact?.LPrimeNTw ?? 0) + 0.5
    );
  });
});

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

function calculateCltCase(layers: Parameters<typeof calculateAssembly>[0]) {
  return {
    field: calculateAssembly(layers, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]
    }),
    lab: calculateAssembly(layers, {
      targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"]
    })
  };
}

describe("CLT floor monotonicity", () => {
  it("keeps the raw bare CLT slab weaker than the defended laminate-plus-underlay anchors", () => {
    const bare140 = calculateCltCase([{ materialId: "clt_panel", thicknessMm: 140 }]);
    const x2Exact140 = calculateCltCase([
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
    ]);

    expect(bare140.lab.impact?.basis).toBe("predictor_mass_timber_clt_bare_interpolation_estimate");
    expect(x2Exact140.lab.floorSystemMatch?.system.id).toBe("tuas_x2_clt140_measured_2026");
    expect(bare140.lab.floorSystemRatings?.Rw ?? 0).toBeLessThan(x2Exact140.lab.floorSystemRatings?.Rw ?? 0);
    expect(bare140.lab.impact?.LnW ?? Infinity).toBeGreaterThan(x2Exact140.lab.impact?.LnW ?? -Infinity);
    expect(bare140.field.metrics.estimatedRwPrimeDb ?? 0).toBeLessThanOrEqual(x2Exact140.field.metrics.estimatedRwPrimeDb ?? 0);
    expect(bare140.field.impact?.LPrimeNTw ?? Infinity).toBeGreaterThan(x2Exact140.field.impact?.LPrimeNTw ?? -Infinity);
  });

  it("keeps bare CLT thickness interpolation monotonic on lab and field continuations", () => {
    const bare140 = calculateCltCase([{ materialId: "clt_panel", thicknessMm: 140 }]);
    const bare160 = calculateCltCase([{ materialId: "clt_panel", thicknessMm: 160 }]);

    expect(bare140.lab.impact?.basis).toBe("predictor_mass_timber_clt_bare_interpolation_estimate");
    expect(bare160.lab.impact?.basis).toBe("predictor_mass_timber_clt_bare_interpolation_estimate");
    expect(bare160.lab.floorSystemRatings?.Rw ?? 0).toBeGreaterThan(bare140.lab.floorSystemRatings?.Rw ?? 0);
    expect(bare160.lab.impact?.LnW ?? Infinity).toBeLessThan(bare140.lab.impact?.LnW ?? -Infinity);
    expect(bare160.field.metrics.estimatedRwPrimeDb ?? 0).toBeGreaterThanOrEqual(bare140.field.metrics.estimatedRwPrimeDb ?? 0);
    expect(bare160.field.impact?.LPrimeNTw ?? Infinity).toBeLessThan(bare140.field.impact?.LPrimeNTw ?? -Infinity);
  });

  it("keeps stronger dry and wet CLT treatment packages clearly better than the raw bare slab", () => {
    const bare160 = calculateCltCase([{ materialId: "clt_panel", thicknessMm: 160 }]);
    const dry145 = calculateCltCase([
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: 30 },
      { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 145 }
    ]);
    const wet160 = calculateCltCase([
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 60 },
      { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 160 }
    ]);

    expect(dry145.lab.impact?.basis).toBe("predictor_mass_timber_clt_dataholz_dry_estimate");
    expect(wet160.lab.impact?.basis).toBe("predictor_floor_system_family_archetype_estimate");
    expect(wet160.lab.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(dry145.lab.floorSystemRatings?.Rw ?? 0).toBeGreaterThan(bare160.lab.floorSystemRatings?.Rw ?? 0);
    expect(wet160.lab.floorSystemRatings?.Rw ?? 0).toBeGreaterThan(dry145.lab.floorSystemRatings?.Rw ?? 0);
    expect(dry145.lab.impact?.LnW ?? Infinity).toBeLessThan((bare160.lab.impact?.LnW ?? 0) - 10);
    expect(wet160.lab.impact?.LnW ?? Infinity).toBeLessThan((bare160.lab.impact?.LnW ?? 0) - 12);
    expect(dry145.field.impact?.LPrimeNTw ?? Infinity).toBeLessThan((bare160.field.impact?.LPrimeNTw ?? 0) - 10);
    expect(wet160.field.impact?.LPrimeNTw ?? Infinity).toBeLessThan((bare160.field.impact?.LPrimeNTw ?? 0) - 12);
  });

  it("keeps laminate-plus-underlay CLT interpolation between the defended TUAS anchors", () => {
    const upper180 = calculateCltCase([
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 4 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 10 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 180 }
    ]);
    const x2Exact140 = calculateCltCase([
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
    ]);
    const c2Exact260 = calculateCltCase([
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ]);

    expect(upper180.lab.impact?.basis).toBe("predictor_mass_timber_clt_bare_interpolation_estimate");
    expect(upper180.lab.floorSystemRatings?.Rw ?? 0).toBeGreaterThanOrEqual(x2Exact140.lab.floorSystemRatings?.Rw ?? 0);
    expect(upper180.lab.floorSystemRatings?.Rw ?? 0).toBeLessThanOrEqual(c2Exact260.lab.floorSystemRatings?.Rw ?? 0);
    expect(upper180.lab.impact?.LnW ?? Infinity).toBeLessThanOrEqual(x2Exact140.lab.impact?.LnW ?? -Infinity);
    expect(upper180.lab.impact?.LnW ?? Infinity).toBeGreaterThanOrEqual(c2Exact260.lab.impact?.LnW ?? -Infinity);
  });
});

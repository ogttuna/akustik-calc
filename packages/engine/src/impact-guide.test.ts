import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  deriveImpactGuideMetrics,
  lookupTurkishGuideImpactHdCorrection,
  lookupTurkishGuideImpactKCorrection
} from "./impact-guide";

describe("deriveImpactGuideMetrics", () => {
  it("derives guide-side companions from an explicit base", () => {
    const result = deriveImpactGuideMetrics({
      baseLnW: 41.1,
      baseConfidence: {
        level: "medium",
        provenance: "formula_estimate_narrow_scope",
        score: 0.74,
        summary: "Narrow formula scope."
      },
      ciDb: -2,
      enableSmallRoomEstimate: true,
      hdDb: 1,
      kDb: 3,
      source: "live_stack"
    });

    expect(result).not.toBeNull();
    expect(result?.CI).toBe(-2);
    expect(result?.confidence.level).toBe("medium");
    expect(result?.confidence.provenance).toBe("manual_guide_supplement");
    expect(result?.LnWPlusCI).toBe(39.1);
    expect(result?.LPrimeNW).toBe(44.1);
    expect(result?.LPrimeNTw).toBe(44.1);
    expect(result?.LPrimeNT50).toBe(43.1);
    expect(result?.source).toBe("live_stack");
  });

  it("derives standardized field-side outputs when K, volume, and CI,50-2500 are available", () => {
    const result = deriveImpactGuideMetrics({
      baseLnW: 52,
      baseConfidence: {
        level: "medium",
        provenance: "formula_estimate_narrow_scope",
        score: 0.74,
        summary: "Narrow formula scope."
      },
      ci50_2500Db: -5,
      kDb: 2,
      receivingRoomVolumeM3: 50,
      source: "heavy_reference"
    });

    expect(result).not.toBeNull();
    expect(result?.LPrimeNW).toBe(54);
    expect(result?.LPrimeNTw).toBe(52);
    expect(result?.LPrimeNT50).toBe(47);
    expect(result?.CI50_2500).toBe(-5);
    expect(result?.standardizedFieldEstimateActive).toBe(true);
  });

  it("maps the verified Turkish K and Hd lookup brackets", () => {
    expect(lookupTurkishGuideImpactKCorrection(0.8)).toEqual({
      value: 0,
      bracketLabel: "r <= 1",
      massRatio: 0.8
    });
    expect(lookupTurkishGuideImpactKCorrection(3.4)).toEqual({
      value: 4,
      bracketLabel: "3 < r <= 5",
      massRatio: 3.4
    });
    expect(lookupTurkishGuideImpactHdCorrection(32)).toEqual({
      value: 0,
      bracketLabel: "30 <= V < 50",
      receivingRoomVolumeM3: 32
    });
    expect(lookupTurkishGuideImpactHdCorrection(120)).toEqual({
      value: -5,
      bracketLabel: "100 <= V < 200",
      receivingRoomVolumeM3: 120
    });
  });

  it("can look up K and Hd from verified Turkish simple-guide inputs", () => {
    const result = deriveImpactGuideMetrics({
      baseLnW: 53,
      baseConfidence: {
        level: "high",
        provenance: "exact_floor_system_family",
        score: 0.9,
        summary: "Exact family source."
      },
      ciDb: -3,
      massRatio: 3.4,
      receivingRoomVolumeM3: 32,
      source: "live_stack"
    });

    expect(result).not.toBeNull();
    expect(result?.K).toBe(4);
    expect(result?.KSource).toBe("lookup_from_mass_ratio");
    expect(result?.Hd).toBe(0);
    expect(result?.HdSource).toBe("lookup_from_receiving_room_volume");
    expect(result?.massRatio).toBe(3.4);
    expect(result?.massRatioBracket).toBe("3 < r <= 5");
    expect(result?.receivingRoomVolumeBracket).toBe("30 <= V < 50");
    expect(result?.LnWPlusCI).toBe(50);
    expect(result?.LPrimeNW).toBe(57);
    expect(result?.LPrimeNT50).toBe(54);
    expect(result?.guideProfile).toBe("tr_simple_method_lnt50_from_lnwci_plus_k_plus_hd");
    expect(result?.notes.some((note) => /Table 2.7/i.test(note))).toBe(true);
    expect(result?.notes.some((note) => /Table 2.8/i.test(note))).toBe(true);
  });

  it("keeps explicit K and Hd primary when lookup inputs are also present", () => {
    const result = deriveImpactGuideMetrics({
      baseLnW: 53,
      baseConfidence: {
        level: "high",
        provenance: "exact_floor_system_family",
        score: 0.9,
        summary: "Exact family source."
      },
      ciDb: -3,
      hdDb: -2,
      kDb: 5,
      massRatio: 3.4,
      receivingRoomVolumeM3: 32,
      source: "live_stack"
    });

    expect(result).not.toBeNull();
    expect(result?.K).toBe(5);
    expect(result?.KSource).toBe("explicit_input");
    expect(result?.Hd).toBe(-2);
    expect(result?.HdSource).toBe("explicit_input");
    expect(result?.LPrimeNT50).toBe(53);
  });

  it("keeps guide metrics closed when core inputs are invalid", () => {
    expect(
      deriveImpactGuideMetrics({
        baseLnW: Number.NaN,
        ciDb: -2,
        source: "heavy_reference"
      })
    ).toBeNull();
  });

  it("can standardize field outputs from an exact hollow-core family row", () => {
    const assembly = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "genieclip_rst", thicknessMm: 16 },
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 5 },
      { floorRole: "resilient_layer", materialId: "geniemat_rst05", thicknessMm: 5 },
      { floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: 200 }
    ]);

    const result = deriveImpactGuideMetrics({
      baseLnW: assembly.impact?.LnW ?? Number.NaN,
      baseConfidence: assembly.impact?.confidence,
      kDb: 2,
      receivingRoomVolumeM3: 50,
      source: "live_stack"
    });

    expect(assembly.impact?.basis).toBe("official_floor_system_exact_match");
    expect(result?.LPrimeNW).toBe(50);
    expect(result?.LPrimeNTw).toBe(48);
  });

  it("can standardize conservative field-side upper bounds from a bound-only floor row", () => {
    const assembly = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]);

    const result = deriveImpactGuideMetrics({
      baseConfidence: assembly.lowerBoundImpact?.confidence,
      baseLnWUpperBound: assembly.lowerBoundImpact?.LnWUpperBound,
      kDb: 2,
      receivingRoomVolumeM3: 50,
      source: "live_stack"
    });

    expect(assembly.lowerBoundImpact?.basis).toBe("official_floor_system_bound_support");
    expect(result?.baseKind).toBe("upper_bound");
    expect(result?.LPrimeNW).toBeUndefined();
    expect(result?.LPrimeNWUpperBound).toBe(53);
    expect(result?.LPrimeNTwUpperBound).toBe(51);
  });
});

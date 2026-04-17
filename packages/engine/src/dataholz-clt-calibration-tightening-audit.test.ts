import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";

const GDMTXA04A_VISIBLE_ROWS = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
  { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: 60 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 160 }
] as const;

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const;

describe("Dataholz CLT calibration tightening audit", () => {
  it("keeps the GDMTXA04A visible boundary estimate-only while preventing optimistic lab-side impact drift", () => {
    const visible = calculateAssembly(GDMTXA04A_VISIBLE_ROWS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
    });
    const exact = calculateImpactOnly([], {
      impactFieldContext: FIELD_CONTEXT,
      officialFloorSystemId: "dataholz_gdmtxa04a_clt_lab_2026",
      targetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
    });

    expect(visible.floorSystemMatch).toBeNull();
    expect(visible.floorSystemEstimate?.kind).toBe("family_general");
    expect(visible.floorSystemEstimate?.impact.basis).toBe("predictor_mass_timber_clt_dataholz_dry_estimate");
    expect(visible.impact?.estimateCandidateIds).toEqual(["dataholz_gdmtxa01a_clt_lab_2026"]);
    expect(visible.floorSystemRatings?.Rw).toBe(65);

    expect(visible.impact?.LnW).toBe(49);
    expect(visible.impact?.CI).toBe(4);
    expect(visible.impact?.LnWPlusCI).toBe(53);
    expect(visible.impact?.LnW).toBeGreaterThanOrEqual(exact.impact?.LnW ?? 0);
    expect(visible.impact?.CI).toBeGreaterThanOrEqual(exact.impact?.CI ?? 0);
    expect(visible.impact?.LnWPlusCI).toBeGreaterThanOrEqual(exact.impact?.LnWPlusCI ?? 0);

    expect(visible.impact?.LPrimeNW).toBe(51);
    expect(visible.impact?.LPrimeNTw).toBe(48.6);
    expect(
      visible.impact?.notes.some((note: string) =>
        /capped against the direct official exact row/i.test(note)
      )
    ).toBe(true);
  });
});

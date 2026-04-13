import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"];
const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 50
} as const;

const C11C_SOURCE_TRUTH = {
  id: "C11c",
  lnW: 59,
  lnWPlusCI: 60,
  lnWPlusCI50_2500: 60,
  rw: 74
} as const;

const NEARBY_COMBINED_CLT_IDS = [
  "tuas_c2c_clt260_measured_2026",
  "tuas_c3c_clt260_measured_2026",
  "tuas_c4c_clt260_measured_2026",
  "tuas_c5c_clt260_measured_2026",
  "tuas_c7c_clt260_measured_2026"
] as const;

const C11C_COMBINED_WET_SOURCE_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 30 },
  { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
];

function getExactFloorSystem(systemId: string) {
  const system = EXACT_FLOOR_SYSTEMS.find((candidate) => candidate.id === systemId);

  if (!system) {
    throw new Error(`Missing expected exact floor system: ${systemId}`);
  }

  return system;
}

function lnWPlusCI50(systemId: string) {
  const system = getExactFloorSystem(systemId);
  const ci50 = system.impactRatings.CI50_2500;

  if (typeof ci50 !== "number") {
    throw new Error(`Missing CI50_2500 for expected exact floor system: ${systemId}`);
  }

  return system.impactRatings.LnW + ci50;
}

function lnWPlusCI(systemId: string) {
  const system = getExactFloorSystem(systemId);
  const lnWPlusCI = system.impactRatings.LnWPlusCI;

  if (typeof lnWPlusCI !== "number") {
    throw new Error(`Missing LnWPlusCI for expected exact floor system: ${systemId}`);
  }

  return lnWPlusCI;
}

describe("TUAS C11c wet-stack anomaly audit", () => {
  it("keeps C11c out of the imported exact set until the weak impact tuple is source-explained", () => {
    const importedIds = EXACT_FLOOR_SYSTEMS.map((system) => system.id);
    const nearbyCombinedAnchors = NEARBY_COMBINED_CLT_IDS.map((systemId) => getExactFloorSystem(systemId));
    const c4c = getExactFloorSystem("tuas_c4c_clt260_measured_2026");
    const c5c = getExactFloorSystem("tuas_c5c_clt260_measured_2026");
    const c7c = getExactFloorSystem("tuas_c7c_clt260_measured_2026");

    expect(importedIds).not.toContain("tuas_c11c_clt260_measured_2026");
    expect(C11C_SOURCE_TRUTH.rw).toBe(c4c.airborneRatings.Rw);
    expect(C11C_SOURCE_TRUTH.rw).toBeLessThanOrEqual(c7c.airborneRatings.Rw);
    expect(C11C_SOURCE_TRUTH.lnW).toBeGreaterThan(
      Math.max(...nearbyCombinedAnchors.map((system) => system.impactRatings.LnW))
    );
    expect(C11C_SOURCE_TRUTH.lnW - c4c.impactRatings.LnW).toBe(35);
    expect(C11C_SOURCE_TRUTH.lnW - c7c.impactRatings.LnW).toBe(29);
    expect(C11C_SOURCE_TRUTH.lnW - c5c.impactRatings.LnW).toBe(21);
    expect(C11C_SOURCE_TRUTH.lnWPlusCI - lnWPlusCI("tuas_c4c_clt260_measured_2026")).toBe(34);
    expect(C11C_SOURCE_TRUTH.lnWPlusCI50_2500 - lnWPlusCI50("tuas_c4c_clt260_measured_2026")).toBe(20);
  });

  it("keeps the visible C11c schedule screening-only and impact-unsupported", () => {
    const lab = calculateAssembly(C11C_COMBINED_WET_SOURCE_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(C11C_COMBINED_WET_SOURCE_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const impactOnlyLab = calculateImpactOnly(C11C_COMBINED_WET_SOURCE_LAYERS, {
      targetOutputs: ["Ln,w", "Ln,w+CI"]
    });
    const impactOnlyField = calculateImpactOnly(C11C_COMBINED_WET_SOURCE_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch).toBeNull();
    expect(lab.floorSystemEstimate).toBeNull();
    expect(lab.impact).toBeNull();
    expect(lab.floorSystemRatings?.Rw).toBe(49);
    expect(lab.supportedTargetOutputs).toEqual(["Rw"]);
    expect(lab.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);

    expect(field.floorSystemMatch).toBeNull();
    expect(field.floorSystemEstimate).toBeNull();
    expect(field.impact).toBeNull();
    expect(field.supportedTargetOutputs).toEqual([]);
    expect(field.unsupportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);

    expect(impactOnlyLab.floorSystemMatch).toBeNull();
    expect(impactOnlyLab.floorSystemEstimate).toBeNull();
    expect(impactOnlyLab.impact).toBeNull();
    expect(impactOnlyLab.supportedTargetOutputs).toEqual([]);
    expect(impactOnlyLab.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);

    expect(impactOnlyField.floorSystemMatch).toBeNull();
    expect(impactOnlyField.floorSystemEstimate).toBeNull();
    expect(impactOnlyField.impact).toBeNull();
    expect(impactOnlyField.supportedTargetOutputs).toEqual([]);
    expect(impactOnlyField.unsupportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(
      lab.warnings.some((warning: string) =>
        /Visible-layer predictor matching is parked because single-entry floor roles are duplicated: floating screed x2/i.test(warning)
      )
    ).toBe(true);
    expect(
      lab.warnings.some((warning: string) =>
        /Closest family candidate is TUAS C7c \| CLT 260 mm \| EPS board \+ geotextile \+ screed/i.test(warning)
      )
    ).toBe(true);
  });
});

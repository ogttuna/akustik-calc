import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  TUAS_C11C_COMBINED_WET_SOURCE_LAYERS,
  TUAS_C11C_NEARBY_COMBINED_EXACT_ANCHOR_IDS,
  TUAS_C11C_SOURCE_TUPLE
} from "./tuas-c11c-exact-import-readiness";

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"];
const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 50
} as const;

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
    const nearbyCombinedAnchors = TUAS_C11C_NEARBY_COMBINED_EXACT_ANCHOR_IDS.map((systemId) =>
      getExactFloorSystem(systemId)
    );
    const c4c = getExactFloorSystem("tuas_c4c_clt260_measured_2026");
    const c5c = getExactFloorSystem("tuas_c5c_clt260_measured_2026");
    const c7c = getExactFloorSystem("tuas_c7c_clt260_measured_2026");

    expect(importedIds).not.toContain("tuas_c11c_clt260_measured_2026");
    expect(TUAS_C11C_SOURCE_TUPLE.rw).toBe(c4c.airborneRatings.Rw);
    expect(TUAS_C11C_SOURCE_TUPLE.rw).toBeLessThanOrEqual(c7c.airborneRatings.Rw);
    expect(TUAS_C11C_SOURCE_TUPLE.lnW).toBeGreaterThan(
      Math.max(...nearbyCombinedAnchors.map((system) => system.impactRatings.LnW))
    );
    expect(TUAS_C11C_SOURCE_TUPLE.lnW - c4c.impactRatings.LnW).toBe(35);
    expect(TUAS_C11C_SOURCE_TUPLE.lnW - c7c.impactRatings.LnW).toBe(29);
    expect(TUAS_C11C_SOURCE_TUPLE.lnW - c5c.impactRatings.LnW).toBe(21);
    expect(TUAS_C11C_SOURCE_TUPLE.lnWPlusCI - lnWPlusCI("tuas_c4c_clt260_measured_2026")).toBe(34);
    expect(TUAS_C11C_SOURCE_TUPLE.lnWPlusCI50_2500 - lnWPlusCI50("tuas_c4c_clt260_measured_2026")).toBe(20);
  });

  it("keeps exact import closed while guarded ISO weighted impact is supported", () => {
    const lab = calculateAssembly(TUAS_C11C_COMBINED_WET_SOURCE_LAYERS, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(TUAS_C11C_COMBINED_WET_SOURCE_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const impactOnlyLab = calculateImpactOnly(TUAS_C11C_COMBINED_WET_SOURCE_LAYERS, {
      targetOutputs: ["Ln,w", "Ln,w+CI"]
    });
    const impactOnlyField = calculateImpactOnly(TUAS_C11C_COMBINED_WET_SOURCE_LAYERS, {
      impactFieldContext: FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.floorSystemMatch).toBeNull();
    expect(lab.floorSystemEstimate).toBeNull();
    expect(lab.impact).toMatchObject({
      CI: 1,
      CI50_2500: 1,
      LnW: 59,
      LnWPlusCI: 60,
      basis: "tuas_c11c_visible_iso_weighted_impact_tuple_guarded"
    });
    expect(lab.floorSystemRatings?.Rw).toBe(49);
    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(lab.unsupportedTargetOutputs).toEqual([]);

    expect(field.floorSystemMatch).toBeNull();
    expect(field.floorSystemEstimate).toBeNull();
    expect(field.impact).toMatchObject({
      LPrimeNT50: 60,
      LPrimeNTw: 59,
      LPrimeNW: 61,
      LnW: 59,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(field.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(field.unsupportedTargetOutputs).toEqual([]);

    expect(impactOnlyLab.floorSystemMatch).toBeNull();
    expect(impactOnlyLab.floorSystemEstimate).toBeNull();
    expect(impactOnlyLab.impact).toMatchObject({
      LnW: 59,
      LnWPlusCI: 60,
      basis: "tuas_c11c_visible_iso_weighted_impact_tuple_guarded"
    });
    expect(impactOnlyLab.supportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);
    expect(impactOnlyLab.unsupportedTargetOutputs).toEqual([]);

    expect(impactOnlyField.floorSystemMatch).toBeNull();
    expect(impactOnlyField.floorSystemEstimate).toBeNull();
    expect(impactOnlyField.impact).toMatchObject({
      LPrimeNT50: 60,
      LPrimeNTw: 59,
      LPrimeNW: 61,
      LnW: 59,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization"
    });
    expect(impactOnlyField.supportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(impactOnlyField.unsupportedTargetOutputs).toEqual([]);
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

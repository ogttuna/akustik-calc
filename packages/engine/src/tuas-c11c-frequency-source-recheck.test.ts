import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

import {
  TUAS_C11C_EXACT_IMPORT_READINESS_DECISION,
  TUAS_C11C_NEARBY_COMBINED_EXACT_ANCHOR_IDS,
  TUAS_C11C_SOURCE_FRAME,
  TUAS_C11C_SOURCE_TUPLE
} from "./tuas-c11c-exact-import-readiness";

function getExactFloorSystem(systemId: string) {
  const system = EXACT_FLOOR_SYSTEMS.find((candidate) => candidate.id === systemId);

  if (!system) {
    throw new Error(`Missing expected exact floor system: ${systemId}`);
  }

  return system;
}

function anchorSnapshot(systemId: (typeof TUAS_C11C_NEARBY_COMBINED_EXACT_ANCHOR_IDS)[number]) {
  const system = getExactFloorSystem(systemId);
  const lnWPlusCI = system.impactRatings.LnWPlusCI;

  if (typeof system.impactRatings.CI50_2500 !== "number") {
    throw new Error(`Missing CI50_2500 for expected exact floor system: ${systemId}`);
  }

  if (typeof lnWPlusCI !== "number") {
    throw new Error(`Missing LnWPlusCI for expected exact floor system: ${systemId}`);
  }

  return {
    ci: lnWPlusCI - system.impactRatings.LnW,
    ci50: system.impactRatings.CI50_2500,
    id: system.id,
    lnW: system.impactRatings.LnW,
    lnWPlusCI,
    lnWPlusCI50_2500: system.impactRatings.LnW + system.impactRatings.CI50_2500,
    manualMatch: system.manualMatch,
    rw: system.airborneRatings.Rw
  };
}

describe("TUAS C11c frequency/source recheck", () => {
  it("keeps the source frame narrow before any exact import is reconsidered", () => {
    expect(TUAS_C11C_SOURCE_FRAME).toMatchObject({
      datasetUrl: "https://data.mendeley.com/datasets/y83p8mpryd/2",
      exactImportCandidateId: "tuas_c11c_clt260_measured_2026",
      measurementBandHz: [20, 5000],
      standardSupportedBandHz: [50, 5000],
      uncertainLowBandHz: [20, 40]
    });
  });

  it("shows that C11c is weak in the weighted impact tuple, not in CI or low-frequency companion terms", () => {
    const importedIds = EXACT_FLOOR_SYSTEMS.map((system) => system.id);
    const anchors = TUAS_C11C_NEARBY_COMBINED_EXACT_ANCHOR_IDS.map((systemId) => anchorSnapshot(systemId));
    const c11cCI = TUAS_C11C_SOURCE_TUPLE.lnWPlusCI - TUAS_C11C_SOURCE_TUPLE.lnW;
    const c11cCI50 = TUAS_C11C_SOURCE_TUPLE.lnWPlusCI50_2500 - TUAS_C11C_SOURCE_TUPLE.lnW;

    expect(importedIds).not.toContain("tuas_c11c_clt260_measured_2026");
    expect(TUAS_C11C_SOURCE_TUPLE.importEligible).toBe(false);
    expect(TUAS_C11C_SOURCE_TUPLE.rw).toBe(anchorSnapshot("tuas_c4c_clt260_measured_2026").rw);
    expect(TUAS_C11C_SOURCE_TUPLE.rw).toBeLessThanOrEqual(anchorSnapshot("tuas_c7c_clt260_measured_2026").rw);

    expect(TUAS_C11C_SOURCE_TUPLE.lnW).toBeGreaterThan(Math.max(...anchors.map((anchor) => anchor.lnW)));
    expect(TUAS_C11C_SOURCE_TUPLE.lnW - anchorSnapshot("tuas_c4c_clt260_measured_2026").lnW).toBe(35);
    expect(TUAS_C11C_SOURCE_TUPLE.lnW - anchorSnapshot("tuas_c7c_clt260_measured_2026").lnW).toBe(29);
    expect(TUAS_C11C_SOURCE_TUPLE.lnW - anchorSnapshot("tuas_c5c_clt260_measured_2026").lnW).toBe(21);

    expect(c11cCI).toBe(1);
    expect(c11cCI50).toBe(1);
    expect(c11cCI).toBeLessThan(Math.min(...anchors.map((anchor) => anchor.ci)));
    expect(c11cCI50).toBeLessThan(Math.min(...anchors.map((anchor) => anchor.ci50)));
  });

  it("requires raw spectrum or source correction before C11c can become an exact import candidate", () => {
    expect(TUAS_C11C_EXACT_IMPORT_READINESS_DECISION).toMatchObject({
      exactImportEligible: false,
      reason: "weighted_impact_tuple_is_not_explained_by_low_frequency_companion_terms",
      requiredEvidenceBeforeImport: [
        "raw_c11c_one_third_octave_impact_spectrum",
        "source_correction_or_lab_note_explaining_the_weak_weighted_tuple"
      ],
      runtimeBehaviorChange: false,
      selectedFollowUpIfEvidenceExists: "tuas_c11c_exact_import_candidate_v1"
    });
  });
});

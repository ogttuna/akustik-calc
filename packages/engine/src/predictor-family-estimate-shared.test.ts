import { describe, expect, it } from "vitest";

import { analyzeTargetOutputSupport } from "./target-output-support";
import { buildPredictorFamilyEstimateCase } from "./predictor-family-estimate-shared";

function buildEstimate(sourceSystemIds: readonly string[]) {
  return buildPredictorFamilyEstimateCase({
    airborneRatings: {
      Rw: 60,
      RwCtr: 55
    },
    candidateIds: sourceSystemIds,
    candidateScores: sourceSystemIds.map(() => 0),
    impactRatings: {
      LnW: 50
    },
    kind: "family_general",
    noteLabel: "companion semantic test",
    sourceSystemIds,
    structuralFamily: "test"
  });
}

describe("predictor family estimate companion semantics", () => {
  it("inherits a unanimous source companion semantic", () => {
    const estimate = buildEstimate([
      "tuas_r2a_open_box_timber_measured_2026",
      "tuas_r3a_open_box_timber_measured_2026"
    ]);

    expect(estimate?.airborneRatings).toEqual({
      Rw: 60,
      RwCtr: 55,
      RwCtrSemantic: "rw_plus_c"
    });
  });

  it("withholds ambiguous mixed-source companions instead of relabeling them through the legacy default", () => {
    const estimate = buildEstimate([
      "tuas_r2a_open_box_timber_measured_2026",
      "dataholz_gdrnxa11a_timber_frame_lab_2026"
    ]);

    expect(estimate?.airborneRatings).toEqual({
      Rw: 60
    });

    const support = analyzeTargetOutputSupport({
      floorCarrier: estimate?.airborneRatings,
      impact: null,
      lowerBoundImpact: null,
      targetOutputs: ["C", "Ctr"]
    });

    expect(support.supportedTargetOutputs).toEqual([]);
    expect(support.unsupportedTargetOutputs).toEqual(["C", "Ctr"]);
  });
});

import type { ImpactBoundCalculation } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildImpactGuideFieldGuides } from "./impact-field-guides";

function combinedBound(): ImpactBoundCalculation {
  return {
    basis: "official_floor_system_bound_support",
    confidence: {
      level: "high",
      provenance: "exact_floor_system_family",
      score: 1,
      summary: "Official combined bound."
    },
    LnWPlusCIUpperBound: 45,
    notes: ["Official source publishes Ln,w+CI as an upper bound."],
    scope: "family_bound_estimate"
  } as ImpactBoundCalculation;
}

describe("impact guide bound metrics", () => {
  it("does not treat a combined Ln,w+CI bound as a guide-base Ln,w", () => {
    const statuses = buildImpactGuideFieldGuides({
      baseImpact: null,
      baseLowerBoundImpact: combinedBound(),
      ci50_2500Input: "",
      ciInput: "",
      guideResult: null,
      hdInput: "",
      kInput: "",
      massRatioInput: "",
      receivingRoomVolumeM3: "",
      selectedSource: "live_stack",
      smallRoomEstimateEnabled: false
    });

    expect(statuses.guideBase.kind).toBe("conditional");
    expect(statuses.guideBase.currentUse).toContain("combined Ln,w+CI upper bound");
    expect(statuses.guideBase.meaning).toContain("not a field-guide base");
  });
});

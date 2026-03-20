import { describe, expect, it } from "vitest";

import { deriveCompositePanelPublishedInteractionEstimate } from "./composite-panel-published-interaction-estimate";

describe("deriveCompositePanelPublishedInteractionEstimate", () => {
  it("keeps composite suspended-ceiling-only stacks on the PMC published interaction lane", () => {
    const result = deriveCompositePanelPublishedInteractionEstimate({
      structuralSupportType: "composite_panel",
      impactSystemType: "suspended_ceiling_only",
      baseSlab: {
        materialClass: "composite_steel_deck",
        thicknessMm: 150
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 150,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 16
      }
    });

    expect(result?.kind).toBe("family_general");
    expect(result?.impact.basis).toBe("predictor_composite_panel_published_interaction_estimate");
    expect(result?.impact.LnW).toBe(63.3);
    expect(result?.airborneRatings.Rw).toBe(48.6);
    expect(result?.impact.estimateCandidateIds).toEqual([
      "pmc_m1_dry_floating_plus_c2x_lab_2026",
      "pmc_m1_dry_floating_plus_c1x_lab_2026",
      "pmc_m1_bare_composite_lab_2026"
    ]);
  });
});

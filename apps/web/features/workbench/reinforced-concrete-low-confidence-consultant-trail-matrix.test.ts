import { describe, expect, it } from "vitest";

import { getConsultantDecisionTrail } from "./consultant-decision-trail";
import { evaluateScenario } from "./scenario-analysis";
import type { LayerDraft } from "./workbench-store";

type TrailItemSnapshot = {
  detail: string;
  label: string;
  tone: string;
};

type TrailSnapshot = {
  headline: string;
  items: readonly TrailItemSnapshot[];
};

type TrailCase = {
  expected: TrailSnapshot;
  id: string;
  rows: readonly Omit<LayerDraft, "id">[];
};

const TARGET_OUTPUTS = ["Rw", "Ctr", "Ln,w", "DeltaLw"] as const;

const CASES: readonly TrailCase[] = [
  {
    id: "visible reinforced low-confidence route keeps consultant trail in screening territory",
    rows: [
      { materialId: "concrete", thicknessMm: "180", floorRole: "base_structure" },
      { materialId: "generic_resilient_underlay", thicknessMm: "8", floorRole: "resilient_layer" },
      { materialId: "vinyl_flooring", thicknessMm: "3", floorRole: "floor_covering" },
      { materialId: "resilient_channel", thicknessMm: "120", floorRole: "ceiling_cavity" },
      { materialId: "glasswool", thicknessMm: "100", floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" }
    ],
    expected: {
      headline:
        "Low-confidence fallback on reinforced concrete is the current floor-side screening posture. Screening seed is the current airborne reading.",
      items: [
        {
          detail:
            "Low-confidence family fallback on reinforced concrete. The active impact lane is the final reinforced-concrete mixed-row fallback. 29% fit inside the active low-confidence ceiling. Ln,w stays on a mixed nearby-row concrete lane rather than a narrow same-stack family fit. Ranking keeps the elastic-ceiling nearby row first, the rigid-ceiling row second, and the timber-underlay row as a farther fallback when cavity and board geometry drift away from the mixed-row corridor. Keep the current floor-side read in screening territory and do not treat it as delivery-ready.",
          label: "Impact corridor",
          tone: "warning"
        },
        {
          detail:
            "A comparison calculator is active without the family-aware dynamic selector. The result is still local and curve-backed, but not trace-ranked.",
          label: "Airborne corridor",
          tone: "accent"
        },
        {
          detail:
            "Low-confidence fallback remains active on the current floor-side route. Keep nearby-row evidence, warnings, and corridor notes attached, and do not present the package as delivery-ready.",
          label: "Delivery posture",
          tone: "warning"
        },
        {
          detail:
            "4 requested outputs are armed. 3 currently resolve through live, bound, guide-backed, or screening-fallback lanes. Still explicit: DeltaLw. Keep the current package in screening mode until a narrower lane is proven.",
          label: "Output coverage",
          tone: "warning"
        },
        {
          detail:
            "6 active warnings. First signal: Low-confidence reinforced-concrete combined fallback is active. Ln,w stays on a mixed nearby-row concrete lane, while Rw and Ctr remain proxy airborne companions instead of a narrow same-stack family claim.",
          label: "Active warnings",
          tone: "warning"
        }
      ]
    }
  },
  {
    id: "expanded-board reinforced boundary keeps consultant trail on scoped formula posture",
    rows: [
      { materialId: "concrete", thicknessMm: "180", floorRole: "base_structure" },
      { materialId: "generic_resilient_underlay", thicknessMm: "8", floorRole: "resilient_layer" },
      { materialId: "vinyl_flooring", thicknessMm: "3", floorRole: "floor_covering" },
      { materialId: "resilient_channel", thicknessMm: "120", floorRole: "ceiling_cavity" },
      { materialId: "glasswool", thicknessMm: "100", floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: "8", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "8", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "8", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "8", floorRole: "ceiling_board" }
    ],
    expected: {
      headline:
        "Scoped formula estimate on reinforced concrete is the current floor-side posture. Screening seed is the current airborne reading.",
      items: [
        {
          detail:
            "Heavy-floor formula estimate on reinforced concrete. The active floor lane is a scoped estimate. It is benchmark-guarded, but it still needs explicit source citation or tolerance notes before it is presented as a final acoustic claim.",
          label: "Impact corridor",
          tone: "accent"
        },
        {
          detail:
            "A comparison calculator is active without the family-aware dynamic selector. The result is still local and curve-backed, but not trace-ranked.",
          label: "Airborne corridor",
          tone: "accent"
        },
        {
          detail:
            "4 requested outputs are armed. 3 currently resolve through live, bound, or guide-backed lanes. Still explicit: DeltaLw.",
          label: "Output coverage",
          tone: "warning"
        },
        {
          detail:
            "4 active warnings. First signal: Screening estimate only. This result is coming from the local calibrated seed lane.",
          label: "Active warnings",
          tone: "warning"
        }
      ]
    }
  },
  {
    id: "upper-only reinforced floating boundary keeps consultant trail on dry floating formula posture",
    rows: [
      { materialId: "concrete", thicknessMm: "180", floorRole: "base_structure" },
      { materialId: "generic_resilient_underlay", thicknessMm: "8", floorRole: "resilient_layer" },
      { materialId: "vinyl_flooring", thicknessMm: "3", floorRole: "floor_covering" }
    ],
    expected: {
      headline:
        "Scoped formula estimate on reinforced concrete is the current floor-side posture. Screening seed is the current airborne reading.",
      items: [
        {
          detail:
            "Heavy-floor formula estimate on reinforced concrete. The active floor lane is a scoped estimate. It is benchmark-guarded, but it still needs explicit source citation or tolerance notes before it is presented as a final acoustic claim.",
          label: "Impact corridor",
          tone: "accent"
        },
        {
          detail:
            "A comparison calculator is active without the family-aware dynamic selector. The result is still local and curve-backed, but not trace-ranked.",
          label: "Airborne corridor",
          tone: "accent"
        },
        {
          detail:
            "4 requested outputs are armed. 4 currently resolve through live, bound, or guide-backed lanes. No requested output is currently left as an unresolved placeholder.",
          label: "Output coverage",
          tone: "success"
        },
        {
          detail:
            "3 active warnings. First signal: Screening estimate only. This result is coming from the local calibrated seed lane.",
          label: "Active warnings",
          tone: "warning"
        }
      ]
    }
  }
] as const;

function snapshot(testCase: TrailCase): TrailSnapshot {
  const scenario = evaluateScenario({
    id: testCase.id,
    name: testCase.id,
    rows: testCase.rows.map((row, index) => ({ ...row, id: `${testCase.id}-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });

  expect(scenario.result, `${testCase.id} should evaluate`).not.toBeNull();
  if (!scenario.result) {
    throw new Error(`${testCase.id} did not evaluate.`);
  }

  const trail = getConsultantDecisionTrail({
    guideResult: null,
    outputs: TARGET_OUTPUTS,
    result: scenario.result,
    warnings: scenario.warnings
  });

  return {
    headline: trail.headline,
    items: trail.items.map((item) => ({
      detail: item.detail,
      label: item.label,
      tone: item.tone
    }))
  };
}

describe("reinforced concrete low-confidence consultant trail matrix", () => {
  it.each(CASES)("$id", (testCase) => {
    expect(snapshot(testCase)).toEqual(testCase.expected);
  });

  it("keeps reinforced screening trails distinct from adjacent formula-owned concrete trails", () => {
    const lowConfidence = snapshot(CASES[0]);
    const expandedBoardBoundary = snapshot(CASES[1]);
    const floatingBoundary = snapshot(CASES[2]);

    expect(lowConfidence.headline).toContain("screening posture");
    expect(lowConfidence.items[2]).toEqual({
      detail:
        "Low-confidence fallback remains active on the current floor-side route. Keep nearby-row evidence, warnings, and corridor notes attached, and do not present the package as delivery-ready.",
      label: "Delivery posture",
      tone: "warning"
    });

    expect(expandedBoardBoundary.headline).toContain("Scoped formula estimate on reinforced concrete");
    expect(expandedBoardBoundary.items[2]?.tone).toBe("warning");

    expect(floatingBoundary.items[2]).toEqual({
      detail:
        "4 requested outputs are armed. 4 currently resolve through live, bound, or guide-backed lanes. No requested output is currently left as an unresolved placeholder.",
      label: "Output coverage",
      tone: "success"
    });
  });
});

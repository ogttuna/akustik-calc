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
    id: "visible reinforced cleanup route keeps consultant trail parked on missing impact owners",
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
        "No live lane is the current floor-side posture. Screening seed is the current airborne reading.",
      items: [
        {
          detail:
            "No live lane. No supported impact output is active on the current stack.",
          label: "Impact corridor",
          tone: "neutral"
        },
        {
          detail:
            "A comparison calculator is active without the family-aware dynamic selector. The result is still local and curve-backed, but not trace-ranked.",
          label: "Airborne corridor",
          tone: "accent"
        },
        {
          detail:
            "4 requested outputs are armed. 2 currently resolve through live, bound, or guide-backed lanes. Still explicit: Ln,w, DeltaLw.",
          label: "Output coverage",
          tone: "warning"
        },
        {
          detail:
            "7 active warnings. First signal: Screening estimate only. This result is coming from the local calibrated seed lane.",
          label: "Active warnings",
          tone: "warning"
        }
      ]
    }
  },
  {
    id: "expanded-board reinforced boundary keeps consultant trail on missing impact owners",
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
        "No live lane is the current floor-side posture. Screening seed is the current airborne reading.",
      items: [
        {
          detail:
            "No live lane. No supported impact output is active on the current stack.",
          label: "Impact corridor",
          tone: "neutral"
        },
        {
          detail:
            "A comparison calculator is active without the family-aware dynamic selector. The result is still local and curve-backed, but not trace-ranked.",
          label: "Airborne corridor",
          tone: "accent"
        },
        {
          detail:
            "4 requested outputs are armed. 2 currently resolve through live, bound, or guide-backed lanes. Still explicit: Ln,w, DeltaLw.",
          label: "Output coverage",
          tone: "warning"
        },
        {
          detail:
            "7 active warnings. First signal: Screening estimate only. This result is coming from the local calibrated seed lane.",
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

  it("keeps reinforced missing-owner trails distinct from adjacent formula-owned concrete trails", () => {
    const needsInput = snapshot(CASES[0]);
    const expandedBoardBoundary = snapshot(CASES[1]);
    const floatingBoundary = snapshot(CASES[2]);

    expect(needsInput.headline).toContain("No live lane");
    expect(needsInput.items[0]).toEqual({
      detail: "No live lane. No supported impact output is active on the current stack.",
      label: "Impact corridor",
      tone: "neutral"
    });

    expect(expandedBoardBoundary.headline).toContain("No live lane");
    expect(expandedBoardBoundary.items[2]?.tone).toBe("warning");

    expect(floatingBoundary.items[2]).toEqual({
      detail:
        "4 requested outputs are armed. 4 currently resolve through live, bound, or guide-backed lanes. No requested output is currently left as an unresolved placeholder.",
      label: "Output coverage",
      tone: "success"
    });
  });
});

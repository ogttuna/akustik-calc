import { describe, expect, it } from "vitest";

import { buildSimpleWorkbenchEvidencePacket } from "./simple-workbench-evidence";
import { evaluateScenario } from "./scenario-analysis";
import type { LayerDraft } from "./workbench-store";

type CitationSnapshot = {
  detail: string;
  label: string;
  tone: string;
};

type DecisionItemSnapshot = {
  detail: string;
  label: string;
  tone: string;
};

type ProvenanceSnapshot = {
  citationCount: number;
  citations: readonly CitationSnapshot[];
  decisionHeadline: string;
  decisionItems: readonly DecisionItemSnapshot[];
};

type ProvenanceCase = {
  expected: ProvenanceSnapshot;
  id: string;
  rows: readonly Omit<LayerDraft, "id">[];
};

const TARGET_OUTPUTS = ["Rw", "Ctr", "Ln,w", "DeltaLw"] as const;

const CASES: readonly ProvenanceCase[] = [
  {
    id: "visible reinforced cleanup route keeps missing-owner provenance explicit",
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
      citationCount: 1,
      citations: [
        {
          detail:
            "No exact family row, product catalog row, or explicit field provenance citation is active yet. Keep the result framed as a scoped dynamic screening route.",
          label: "Source posture",
          tone: "warning"
        }
      ],
      decisionHeadline:
        "No live lane is the current floor-side posture. Screening seed is the current airborne reading.",
      decisionItems: [
        {
          detail: "No live lane. No supported impact output is active on the current stack.",
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
    id: "expanded-board boundary keeps evidence on the same missing-owner surface",
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
      citationCount: 1,
      citations: [
        {
          detail:
            "No exact family row, product catalog row, or explicit field provenance citation is active yet. Keep the result framed as a scoped dynamic screening route.",
          label: "Source posture",
          tone: "warning"
        }
      ],
      decisionHeadline:
        "No live lane is the current floor-side posture. Screening seed is the current airborne reading.",
      decisionItems: [
        {
          detail: "No live lane. No supported impact output is active on the current stack.",
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
    id: "upper-only floating boundary keeps evidence on the heavy floating-floor formula surface",
    rows: [
      { materialId: "concrete", thicknessMm: "180", floorRole: "base_structure" },
      { materialId: "generic_resilient_underlay", thicknessMm: "8", floorRole: "resilient_layer" },
      { materialId: "vinyl_flooring", thicknessMm: "3", floorRole: "floor_covering" }
    ],
    expected: {
      citationCount: 1,
      citations: [
        {
          detail: "Heavy floating-floor formula · Estimated evidence · Heavy floating-floor Annex C style estimate.",
          label: "Dynamic impact anchor",
          tone: "accent"
        }
      ],
      decisionHeadline:
        "Scoped formula estimate on reinforced concrete is the current floor-side posture. Screening seed is the current airborne reading.",
      decisionItems: [
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

function snapshot(testCase: ProvenanceCase): ProvenanceSnapshot {
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

  const evidence = buildSimpleWorkbenchEvidencePacket({
    outputs: TARGET_OUTPUTS,
    result: scenario.result,
    warnings: scenario.warnings
  });

  return {
    citationCount: evidence.citations.length,
    citations: evidence.citations.slice(0, 6).map((citation) => ({
      detail: citation.detail,
      label: citation.label,
      tone: citation.tone
    })),
    decisionHeadline: evidence.decisionTrailHeadline,
    decisionItems: evidence.decisionTrailItems.slice(0, 4).map((item) => ({
      detail: item.detail,
      label: item.label,
      tone: item.tone
    }))
  };
}

describe("reinforced concrete low-confidence follow-up provenance matrix", () => {
  it.each(CASES)("$id", (testCase) => {
    expect(snapshot(testCase)).toEqual(testCase.expected);
  });

  it("keeps reinforced missing-owner provenance separate from the adjacent formula-owned concrete boundary", () => {
    const needsInput = snapshot(CASES[0]);
    const expandedBoardBoundary = snapshot(CASES[1]);
    const floatingBoundary = snapshot(CASES[2]);

    expect(needsInput.citationCount).toBe(expandedBoardBoundary.citationCount);
    expect(needsInput.decisionHeadline).toContain("No live lane");
    expect(needsInput.citations[0]?.label).toBe("Source posture");

    expect(expandedBoardBoundary.citations[0]?.detail).toContain("No exact family row");
    expect(floatingBoundary.citations[0]?.detail).toContain("Heavy floating-floor formula");
    expect(floatingBoundary.decisionItems[2]).toEqual({
      detail:
        "4 requested outputs are armed. 4 currently resolve through live, bound, or guide-backed lanes. No requested output is currently left as an unresolved placeholder.",
      label: "Output coverage",
      tone: "success"
    });
  });
});

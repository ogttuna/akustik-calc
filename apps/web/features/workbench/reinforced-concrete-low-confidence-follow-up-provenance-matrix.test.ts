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
    id: "visible reinforced low-confidence route keeps nearby-row provenance explicit",
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
      citationCount: 5,
      citations: [
        {
          detail:
            "Low-confidence fallback · reinforced concrete · Estimated evidence · 29% fit inside the active low-confidence ceiling. Ln,w stays on a mixed nearby-row concrete lane rather than a narrow same-stack family fit. Ranking keeps the elastic-ceiling nearby row first, the rigid-ceiling row second, and the timber-underlay row as a farther fallback when cavity and board geometry drift away from the mixed-row corridor.",
          label: "Dynamic impact anchor",
          tone: "accent"
        },
        {
          detail:
            "Nearby published rows ranked for the current mixed-row fallback. DynEcho keeps this corridor live without claiming a narrow same-stack family estimate. Ranking keeps the elastic-ceiling nearby row first, the rigid-ceiling row second, and the timber-underlay row as a farther fallback when cavity and board geometry drift away from the mixed-row corridor.",
          label: "Nearby-row fallback rationale",
          tone: "warning"
        },
        {
          detail:
            "Low-confidence reinforced-concrete mixed-row estimate at 29% fit. Ln,w stays on a mixed nearby-row concrete lane, while Rw and Ctr remain proxy airborne companions instead of a narrow same-stack family claim. Ranking keeps the elastic-ceiling nearby row first, the rigid-ceiling row second, and the timber-underlay row as a farther fallback when cavity and board geometry drift away from the mixed-row corridor. Euracoustics FA2023 concrete ceiling study · Open measured dataset · Peer-reviewed open access · system id euracoustics_f2_elastic_ceiling_concrete_lab_2026.",
          label: "Nearby row 1 · elastic-ceiling anchor: 140 mm concrete slab | elastic hanger ceiling | 2 x 13 mm boards",
          tone: "warning"
        },
        {
          detail:
            "Low-confidence reinforced-concrete mixed-row estimate at 29% fit. Ln,w stays on a mixed nearby-row concrete lane, while Rw and Ctr remain proxy airborne companions instead of a narrow same-stack family claim. Ranking keeps the elastic-ceiling nearby row first, the rigid-ceiling row second, and the timber-underlay row as a farther fallback when cavity and board geometry drift away from the mixed-row corridor. Euracoustics FA2023 concrete ceiling study · Open measured dataset · Peer-reviewed open access · system id euracoustics_f1_rigid_ceiling_concrete_lab_2026.",
          label: "Nearby row 2 · rigid-ceiling cross-check: 140 mm concrete slab | rigid hanger ceiling | 2 x 13 mm boards",
          tone: "warning"
        },
        {
          detail:
            "Low-confidence reinforced-concrete mixed-row estimate at 29% fit. Ln,w stays on a mixed nearby-row concrete lane, while Rw and Ctr remain proxy airborne companions instead of a narrow same-stack family claim. Ranking keeps the elastic-ceiling nearby row first, the rigid-ceiling row second, and the timber-underlay row as a farther fallback when cavity and board geometry drift away from the mixed-row corridor. Knauf AU official system table · Official manufacturer system table · Official manufacturer · system id knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026.",
          label: "Nearby row 3 · farther fallback: Knauf CC60.1A | 150 mm concrete | timber + acoustic underlay",
          tone: "warning"
        }
      ],
      decisionHeadline:
        "Low-confidence fallback on reinforced concrete is the current floor-side screening posture. Screening seed is the current airborne reading.",
      decisionItems: [
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
        }
      ]
    }
  },
  {
    id: "expanded-board boundary keeps evidence on the heavy bare-floor formula surface",
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
          detail: "Heavy bare-floor formula · Estimated evidence · Heavy bare-floor Annex C style estimate.",
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

  it("keeps reinforced low-confidence provenance separate from the adjacent formula-owned concrete boundaries", () => {
    const lowConfidence = snapshot(CASES[0]);
    const expandedBoardBoundary = snapshot(CASES[1]);
    const floatingBoundary = snapshot(CASES[2]);

    expect(lowConfidence.citationCount).toBeGreaterThan(expandedBoardBoundary.citationCount);
    expect(lowConfidence.decisionHeadline).toContain("Low-confidence fallback on reinforced concrete");
    expect(lowConfidence.citations[1]?.label).toBe("Nearby-row fallback rationale");

    expect(expandedBoardBoundary.citations[0]?.detail).toContain("Heavy bare-floor formula");
    expect(floatingBoundary.citations[0]?.detail).toContain("Heavy floating-floor formula");
    expect(floatingBoundary.decisionItems[2]).toEqual({
      detail:
        "4 requested outputs are armed. 4 currently resolve through live, bound, or guide-backed lanes. No requested output is currently left as an unresolved placeholder.",
      label: "Output coverage",
      tone: "success"
    });
  });
});

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

const TARGET_OUTPUTS = ["Rw", "Ctr", "Ln,w", "Ln,w+CI"] as const;

// GDMTXA04A composite dry-screed stack: triggers capped visible estimate
// via predictor_mass_timber_clt_dataholz_dry_estimate basis with the
// GDMTXA04A impact cap (LnW=49, CI=4, CI50_2500=9, LnWPlusCI=53).
// This is NOT an exact match (manualMatch:false on the catalog row) but
// the visible estimate is bounded by the direct official exact row.
const GDMTXA04A_VISIBLE_ESTIMATE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "clt_panel", thicknessMm: "160", floorRole: "base_structure" },
  { materialId: "non_bonded_chippings", thicknessMm: "60", floorRole: "upper_fill" },
  { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "65", floorRole: "floor_covering" },
  { materialId: "acoustic_hanger_ceiling", thicknessMm: "70", floorRole: "ceiling_cavity" },
  { materialId: "rockwool", thicknessMm: "50", floorRole: "ceiling_fill" },
  { materialId: "gypsum_board", thicknessMm: "12.5", floorRole: "ceiling_board" }
];

// GDMTXN01 tagged dry CLT stack from dataholz-clt-source-truth-audit.test.ts:
// matches dataholz_gdmtxn01_dry_clt_lab_2026 exactly (manualMatch implicit true)
// so consultant trail tone should be "success" (exact posture).
const GDMTXN01_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "clt_panel", thicknessMm: "140", floorRole: "base_structure" },
  { materialId: "mw_t_40_impact_layer", thicknessMm: "30", floorRole: "resilient_layer" },
  { materialId: "elastic_bonded_fill", thicknessMm: "60", floorRole: "upper_fill" },
  { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "25", floorRole: "floor_covering" }
];

const CASES: readonly TrailCase[] = [
  {
    id: "visible CLT estimate route keeps consultant trail on scoped estimate posture",
    rows: GDMTXA04A_VISIBLE_ESTIMATE_ROWS,
    expected: {
      headline:
        "Published family estimate on mass timber CLT is the current floor-side posture. Screening seed is the current airborne reading.",
      items: [
        {
          detail:
            "Family-specific estimate on mass timber CLT. The active floor lane is a scoped estimate. It is benchmark-guarded, but it still needs explicit source citation or tolerance notes before it is presented as a final acoustic claim.",
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
            "4 requested outputs are armed. 3 currently resolve through live, bound, or guide-backed lanes. Still explicit: Ctr.",
          label: "Output coverage",
          tone: "warning"
        },
        {
          detail:
            "6 active warnings. First signal: Layer 3 thickness 65 mm is outside the guided sanity band of 18 to 35 mm for Dry Floating Gypsum Fiberboard in the floor covering role. Check units, role assignment, or split the build-up into separate layers if needed.",
          label: "Active warnings",
          tone: "warning"
        }
      ]
    }
  },
  {
    id: "exact dry CLT route keeps consultant trail on exact posture",
    rows: GDMTXN01_EXACT_ROWS,
    expected: {
      headline:
        "Exact floor-system family on mass timber CLT is the current floor-side posture. Screening seed is the current airborne reading.",
      items: [
        {
          detail:
            "Official floor-system exact on mass timber CLT. The active lane is anchored by an exact floor-system row, official catalog row, or imported exact band source. This is the cleanest reporting posture in the current repo.",
          label: "Impact corridor",
          tone: "success"
        },
        {
          detail:
            "A comparison calculator is active without the family-aware dynamic selector. The result is still local and curve-backed, but not trace-ranked.",
          label: "Airborne corridor",
          tone: "accent"
        },
        {
          detail:
            "4 requested outputs are armed. 3 currently resolve through live, bound, or guide-backed lanes. Still explicit: Ctr.",
          label: "Output coverage",
          tone: "warning"
        },
        {
          detail:
            "3 active warnings. First signal: Curated exact floor-system match active: Dataholz GDMTXN01 | CLT floor | dry screed | no lining. Exact floor-family impact and airborne companion ratings are available in the operator deck.",
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

describe("CLT visible estimate consultant trail matrix", () => {
  it.each(CASES)("$id", (testCase) => {
    expect(snapshot(testCase)).toEqual(testCase.expected);
  });

  it("keeps CLT visible estimate trail explicit while exact dry CLT trail stays measured", () => {
    const estimate = snapshot(CASES[0]);
    const exact = snapshot(CASES[1]);

    // Visible estimate should carry the scoped-estimate accent tone on the impact corridor
    expect(estimate.items[0]?.tone).toBe("accent");

    // Exact dry CLT should carry the success tone on the impact corridor
    expect(exact.items[0]?.tone).toBe("success");

    // Visible estimate must not be collapsed into low-confidence screening territory
    expect(estimate.headline).not.toContain("screening posture");
  });
});

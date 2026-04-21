import { describe, expect, it } from "vitest";

import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { buildSimpleWorkbenchDiagnosticsDossier } from "./simple-workbench-diagnostics-dossier";
import { buildSimpleWorkbenchEvidencePacket } from "./simple-workbench-evidence";
import { getGuidedValidationSummary } from "./guided-validation-summary";
import { evaluateScenario } from "./scenario-analysis";
import type { LayerDraft } from "./workbench-store";

type DossierCardSnapshot = {
  detail: string;
  label: string;
  tone: string;
  value: string;
};

type DossierSnapshot = {
  cards: readonly DossierCardSnapshot[];
  headline: string;
  linkedCitationCount: number;
  traceCount: number;
  warningCount: number;
};

type DossierCase = {
  expected: DossierSnapshot;
  id: string;
  rows: readonly Omit<LayerDraft, "id">[];
};

const TARGET_OUTPUTS = ["Rw", "Ctr", "Ln,w", "Ln,w+CI"] as const;

// GDMTXA04A composite dry-screed stack: triggers the capped visible estimate
// path (predictor_mass_timber_clt_dataholz_dry_estimate + GDMTXA04A impact
// cap). Diagnostics dossier should show scoped-estimate posture, not screening.
const GDMTXA04A_VISIBLE_ESTIMATE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "clt_panel", thicknessMm: "160", floorRole: "base_structure" },
  { materialId: "non_bonded_chippings", thicknessMm: "60", floorRole: "upper_fill" },
  { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "65", floorRole: "floor_covering" },
  { materialId: "acoustic_hanger_ceiling", thicknessMm: "70", floorRole: "ceiling_cavity" },
  { materialId: "rockwool", thicknessMm: "50", floorRole: "ceiling_fill" },
  { materialId: "gypsum_board", thicknessMm: "12.5", floorRole: "ceiling_board" }
];

// GDMTXN01 tagged dry CLT stack: exact match path. Diagnostics dossier
// should show exact/live posture distinctly from the GDMTXA04A estimate case.
const GDMTXN01_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "clt_panel", thicknessMm: "140", floorRole: "base_structure" },
  { materialId: "mw_t_40_impact_layer", thicknessMm: "30", floorRole: "resilient_layer" },
  { materialId: "elastic_bonded_fill", thicknessMm: "60", floorRole: "upper_fill" },
  { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "25", floorRole: "floor_covering" }
];

const CASES: readonly DossierCase[] = [
  {
    id: "visible CLT estimate route keeps diagnostics dossier on scoped estimate posture",
    rows: GDMTXA04A_VISIBLE_ESTIMATE_ROWS,
    expected: {
      cards: [
        {
          detail: "Published family estimate is active. Read this as a supported floor estimate, not as a measured claim.",
          label: "Validation posture",
          tone: "accent",
          value: "Scoped estimate"
        },
        {
          detail:
            "1 live trace are available for audit. Dynamic airborne, dynamic impact, and airborne overlay remain separate instead of being collapsed into one confidence claim.",
          label: "Trace coverage",
          tone: "success",
          value: "1 live"
        },
        {
          detail:
            "4 decision lines and 2 citations travel with the guided package. 1 linked source are directly openable from the diagnostics surface.",
          label: "Evidence courier",
          tone: "accent",
          value: "4 decisions / 2 citations"
        },
        {
          detail:
            "6 live warnings remain explicit. First signal: Layer 3 thickness 65 mm is outside the guided sanity band of 18 to 35 mm for Dry Floating Gypsum Fiberboard in the floor covering role. Check units, role assignment, or split the build-up into separate layers if needed.",
          label: "Warning board",
          tone: "warning",
          value: "6 active"
        }
      ],
      headline:
        "Combined upper and lower system is active with scoped estimate posture. 1 trace group and 2 citation lines remain visible so the guided flow can explain why the current route was chosen.",
      linkedCitationCount: 1,
      traceCount: 1,
      warningCount: 6
    }
  },
  {
    id: "exact dry CLT route keeps diagnostics dossier on exact posture",
    rows: GDMTXN01_EXACT_ROWS,
    expected: {
      cards: [
        {
          detail:
            "Exact floor-system family is active. This route is anchored by exact or official source evidence instead of a screening-only estimate.",
          label: "Validation posture",
          tone: "success",
          value: "Exact evidence"
        },
        {
          detail:
            "1 live trace are available for audit. Dynamic airborne, dynamic impact, and airborne overlay remain separate instead of being collapsed into one confidence claim.",
          label: "Trace coverage",
          tone: "success",
          value: "1 live"
        },
        {
          detail:
            "4 decision lines and 2 citations travel with the guided package. 1 linked source are directly openable from the diagnostics surface.",
          label: "Evidence courier",
          tone: "accent",
          value: "4 decisions / 2 citations"
        },
        {
          detail:
            "3 live warnings remain explicit. First signal: Curated exact floor-system match active: Dataholz GDMTXN01 | CLT floor | dry screed | no lining. Exact floor-family impact and airborne companion ratings are available in the operator deck.",
          label: "Warning board",
          tone: "warning",
          value: "3 active"
        }
      ],
      headline:
        "Exact floor family is active with exact evidence posture. 1 trace group and 2 citation lines remain visible so the guided flow can explain why the current route was chosen.",
      linkedCitationCount: 1,
      traceCount: 1,
      warningCount: 3
    }
  }
] as const;

function snapshot(testCase: DossierCase): DossierSnapshot {
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

  const branchSummary = getDynamicCalcBranchSummary({
    result: scenario.result,
    studyMode: "floor"
  });
  const validationSummary = getGuidedValidationSummary({
    result: scenario.result,
    studyMode: "floor"
  });
  const evidence = buildSimpleWorkbenchEvidencePacket({
    outputs: TARGET_OUTPUTS,
    result: scenario.result,
    warnings: scenario.warnings
  });
  const dossier = buildSimpleWorkbenchDiagnosticsDossier({
    branchLabel: branchSummary.value,
    citations: evidence.citations,
    decisionTrailHeadline: evidence.decisionTrailHeadline,
    decisionTrailItems: evidence.decisionTrailItems,
    result: scenario.result,
    validationDetail: validationSummary.detail,
    validationLabel: validationSummary.value,
    warnings: scenario.warnings
  });

  return {
    cards: dossier.cards.map((card) => ({
      detail: card.detail,
      label: card.label,
      tone: card.tone,
      value: card.value
    })),
    headline: dossier.headline,
    linkedCitationCount: dossier.linkedCitationCount,
    traceCount: dossier.traceCount,
    warningCount: dossier.warningCount
  };
}

describe("CLT visible estimate diagnostics dossier matrix", () => {
  it.each(CASES)("$id", (testCase) => {
    expect(snapshot(testCase)).toEqual(testCase.expected);
  });

  it("keeps CLT visible estimate dossier scoped while exact dry CLT dossier stays measured", () => {
    const estimate = snapshot(CASES[0]);
    const exact = snapshot(CASES[1]);

    // Visible estimate must not sit in screening/low-confidence territory
    expect(estimate.headline).not.toContain("screening-route low-confidence posture");

    // Validation posture tone differs between estimate and exact
    expect(estimate.cards[0]?.tone).toBe("accent");
    expect(exact.cards[0]?.tone).toBe("success");
  });
});

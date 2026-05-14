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

const TARGET_OUTPUTS = ["Rw", "Ctr", "Ln,w", "DeltaLw"] as const;

const CASES: readonly DossierCase[] = [
  {
    id: "visible reinforced cleanup route keeps diagnostics dossier on waiting posture",
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
      cards: [
        {
          detail:
            "Build a supported floor topology before reading delivery confidence.",
          label: "Validation posture",
          tone: "neutral",
          value: "Waiting for supported lane"
        },
        {
          detail:
            "No explicit trace block is active yet. Build a supported route first so diagnostics can expose the solver lineage.",
          label: "Trace coverage",
          tone: "warning",
          value: "0 live"
        },
        {
          detail:
            "4 decision lines and 1 citation travel with the guided package. 0 linked sources are directly openable from the diagnostics surface.",
          label: "Evidence courier",
          tone: "accent",
          value: "4 decisions / 1 citations"
        },
        {
          detail:
            "7 live warnings remain explicit. First signal: Screening estimate only. This result is coming from the local calibrated seed lane.",
          label: "Warning board",
          tone: "warning",
          value: "7 active"
        }
      ],
      headline:
        "Awaiting supported topology is active with waiting for supported lane posture. 0 trace groups and 1 citation line remain visible so the guided flow can explain why the current route was chosen.",
      linkedCitationCount: 0,
      traceCount: 0,
      warningCount: 7
    }
  },
  {
    id: "expanded-board reinforced boundary keeps diagnostics dossier on waiting posture",
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
      cards: [
        {
          detail: "Build a supported floor topology before reading delivery confidence.",
          label: "Validation posture",
          tone: "neutral",
          value: "Waiting for supported lane"
        },
        {
          detail:
            "No explicit trace block is active yet. Build a supported route first so diagnostics can expose the solver lineage.",
          label: "Trace coverage",
          tone: "warning",
          value: "0 live"
        },
        {
          detail:
            "4 decision lines and 1 citation travel with the guided package. 0 linked sources are directly openable from the diagnostics surface.",
          label: "Evidence courier",
          tone: "accent",
          value: "4 decisions / 1 citations"
        },
        {
          detail:
            "7 live warnings remain explicit. First signal: Screening estimate only. This result is coming from the local calibrated seed lane.",
          label: "Warning board",
          tone: "warning",
          value: "7 active"
        }
      ],
      headline:
        "Awaiting supported topology is active with waiting for supported lane posture. 0 trace groups and 1 citation line remain visible so the guided flow can explain why the current route was chosen.",
      linkedCitationCount: 0,
      traceCount: 0,
      warningCount: 7
    }
  },
  {
    id: "upper-only reinforced floating boundary keeps diagnostics dossier on dry floating formula posture",
    rows: [
      { materialId: "concrete", thicknessMm: "180", floorRole: "base_structure" },
      { materialId: "generic_resilient_underlay", thicknessMm: "8", floorRole: "resilient_layer" },
      { materialId: "vinyl_flooring", thicknessMm: "3", floorRole: "floor_covering" }
    ],
    expected: {
      cards: [
        {
          detail: "Scoped formula estimate is active. Read this as a supported floor estimate, not as a measured claim.",
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
            "4 decision lines and 1 citation travel with the guided package. 0 linked sources are directly openable from the diagnostics surface.",
          label: "Evidence courier",
          tone: "accent",
          value: "4 decisions / 1 citations"
        },
        {
          detail:
            "3 live warnings remain explicit. First signal: Screening estimate only. This result is coming from the local calibrated seed lane.",
          label: "Warning board",
          tone: "warning",
          value: "3 active"
        }
      ],
      headline:
        "Dry floating floor is active with scoped estimate posture. 1 trace group and 1 citation line remain visible so the guided flow can explain why the current route was chosen.",
      linkedCitationCount: 0,
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

describe("reinforced concrete low-confidence diagnostics dossier matrix", () => {
  it.each(CASES)("$id", (testCase) => {
    expect(snapshot(testCase)).toEqual(testCase.expected);
  });

  it("keeps the reinforced missing-owner dossier explicit while upper-only concrete boundaries stay scoped", () => {
    const needsInput = snapshot(CASES[0]);
    const expandedBoardBoundary = snapshot(CASES[1]);
    const floatingBoundary = snapshot(CASES[2]);

    expect(needsInput.headline).toContain("waiting for supported lane posture");
    expect(needsInput.cards[0]).toEqual({
      detail: "Build a supported floor topology before reading delivery confidence.",
      label: "Validation posture",
      tone: "neutral",
      value: "Waiting for supported lane"
    });

    expect(expandedBoardBoundary.headline).toContain("waiting for supported lane posture");
    expect(expandedBoardBoundary.cards[0]?.value).toBe("Waiting for supported lane");

    expect(floatingBoundary.headline).toContain("Dry floating floor");
    expect(floatingBoundary.cards[3]?.value).toBe("3 active");
  });
});

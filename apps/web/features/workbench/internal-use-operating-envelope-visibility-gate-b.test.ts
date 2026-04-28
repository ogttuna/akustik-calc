import type { AirborneContext, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { buildSimpleWorkbenchEvidencePacket } from "./simple-workbench-evidence";
import { buildOutputCard } from "./simple-workbench-output-model";
import { buildSimpleWorkbenchProposalBrief } from "./simple-workbench-proposal-brief";
import { evaluateScenario } from "./scenario-analysis";
import { getGuidedValidationSummary } from "./guided-validation-summary";
import type { LayerDraft } from "./workbench-store";

const WALL_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

const FLOOR_OUTPUTS = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const WALL_BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const TIMBER_WALL_CONTEXT: AirborneContext = {
  ...WALL_BUILDING_CONTEXT,
  airtightness: "good",
  connectionType: "line_connection",
  studSpacingMm: 600,
  studType: "wood_stud"
};

const FLOOR_AIRBORNE_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const FLOOR_IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

const WALL_CAVEATED_CASES = [
  {
    expectedTrace: {
      confidenceClass: "low",
      detectedFamily: "stud_wall_system",
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    },
    id: "wall_timber_double_board_generated",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "rockwool", thicknessMm: "50" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ],
    context: TIMBER_WALL_CONTEXT
  },
  {
    expectedTrace: {
      confidenceClass: "medium",
      detectedFamily: "laminated_single_leaf",
      strategy: "laminated_leaf_sharp_delegate"
    },
    id: "wall_clt_local_generated",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "clt_panel", thicknessMm: "140" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ],
    context: WALL_BUILDING_CONTEXT
  },
  {
    expectedTrace: {
      confidenceClass: "medium",
      detectedFamily: "lined_massive_wall",
      strategy: "lined_massive_blend"
    },
    id: "wall_lined_heavy_core_screening",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "rockwool", thicknessMm: "50" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "concrete", thicknessMm: "100" }
    ],
    context: WALL_BUILDING_CONTEXT
  }
] as const;

const STEEL_FALLBACK_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "120" },
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: "3" },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: "250" }
];

function withIds(rows: readonly Omit<LayerDraft, "id">[], scenarioId: string): LayerDraft[] {
  return rows.map((row, index) => ({ ...row, id: `${scenarioId}-${index + 1}` }));
}

function buildProposalVisibilitySnapshot(input: {
  outputs: readonly RequestedOutputId[];
  primaryMetricLabel: string;
  primaryMetricValue: string;
  result: NonNullable<ReturnType<typeof evaluateScenario>["result"]>;
  scenarioId: string;
  studyModeLabel: "Floor" | "Wall";
  warnings: readonly string[];
}) {
  const branch = getDynamicCalcBranchSummary({
    result: input.result,
    studyMode: input.studyModeLabel === "Floor" ? "floor" : "wall"
  });
  const validation = getGuidedValidationSummary({
    result: input.result,
    studyMode: input.studyModeLabel === "Floor" ? "floor" : "wall"
  });
  const evidence = buildSimpleWorkbenchEvidencePacket({
    outputs: input.outputs,
    result: input.result,
    warnings: input.warnings
  });
  const brief = buildSimpleWorkbenchProposalBrief({
    briefNote: "Internal pilot readout; keep evidence posture visible.",
    citations: evidence.citations,
    consultantCompany: "Machinity Acoustic Consultants",
    contextLabel: "Building prediction",
    dynamicBranchDetail: branch.detail,
    dynamicBranchLabel: branch.value,
    issuedOnIso: "2026-04-28T10:00:00.000Z",
    primaryMetricLabel: input.primaryMetricLabel,
    primaryMetricValue: input.primaryMetricValue,
    projectName: input.scenarioId,
    reportProfileLabel: "Internal pilot",
    studyContextLabel: "Option screening",
    studyModeLabel: input.studyModeLabel,
    validationDetail: validation.detail,
    validationLabel: validation.value,
    validationTone: validation.tone,
    warnings: input.warnings
  });

  return { branch, brief, evidence, validation };
}

describe("internal use operating envelope Gate B visibility", () => {
  it.each(WALL_CAVEATED_CASES)(
    "keeps $id visible as formula-owned/source-gated in route, evidence, and proposal surfaces",
    (testCase) => {
      const scenario = evaluateScenario({
        airborneContext: testCase.context,
        calculator: "dynamic",
        id: testCase.id,
        impactFieldContext: null,
        name: testCase.id,
        rows: withIds(testCase.rows, testCase.id),
        source: "current",
        studyMode: "wall",
        targetOutputs: WALL_OUTPUTS
      });

      expect(scenario.result, `${testCase.id} should evaluate`).not.toBeNull();
      if (!scenario.result) {
        throw new Error(`${testCase.id} did not evaluate`);
      }

      expect(scenario.result.dynamicAirborneTrace).toMatchObject(testCase.expectedTrace);

      const rwCard = buildOutputCard({
        output: "Rw",
        result: scenario.result,
        studyMode: "wall"
      });
      const rwPrimeCard = buildOutputCard({
        output: "R'w",
        result: scenario.result,
        studyMode: "wall"
      });
      const dnTwCard = buildOutputCard({
        output: "DnT,w",
        result: scenario.result,
        studyMode: "wall"
      });
      const snapshot = buildProposalVisibilitySnapshot({
        outputs: WALL_OUTPUTS,
        primaryMetricLabel: "R'w",
        primaryMetricValue: rwPrimeCard.value,
        result: scenario.result,
        scenarioId: testCase.id,
        studyModeLabel: "Wall",
        warnings: scenario.warnings
      });
      const dynamicCitation = snapshot.evidence.citations.find((citation) => citation.label === "Dynamic airborne anchor");
      const evidencePosture = snapshot.brief.assumptionItems.find((item) => item.label === "Evidence posture");
      const activeRoute = snapshot.brief.assumptionItems.find((item) => item.label === "Active route");
      const recommendation = snapshot.brief.recommendationItems.find((item) => item.label === "Issue as estimate, not measurement");

      if (testCase.id === "wall_lined_heavy_core_screening") {
        expect(rwCard).toEqual(expect.objectContaining({ status: "live", value: "55 dB" }));
      } else {
        expect(rwCard).toEqual(expect.objectContaining({ status: "unsupported", value: "Not ready" }));
      }
      expect(rwPrimeCard.status).toBe("live");
      expect(dnTwCard.status).toBe("live");
      expect(snapshot.validation.value).toBe("Scoped estimate");
      expect(snapshot.validation.detail).toContain("formula-owned/source-gated scoped estimate");
      expect(snapshot.validation.detail).toContain("not as a measured claim");
      expect(snapshot.branch.value).toBe(scenario.result.dynamicAirborneTrace?.detectedFamilyLabel);
      expect(dynamicCitation).toEqual(
        expect.objectContaining({
          detail: expect.stringContaining("Formula-owned/source-gated wall route"),
          label: "Dynamic airborne anchor"
        })
      );
      expect(dynamicCitation?.detail).toContain("No exact wall source row is active");
      expect(dynamicCitation?.tone).not.toBe("success");
      expect(evidencePosture?.detail).toContain("formula-owned/source-gated scoped estimate");
      expect(activeRoute?.detail).toContain(scenario.result.dynamicAirborneTrace?.selectedLabel ?? "");
      expect(recommendation?.detail).toContain("avoid lab-claim or field-measurement language");
    }
  );

  it("keeps the generated steel floor fallback visibly low-confidence and unsupported where required", () => {
    const scenario = evaluateScenario({
      airborneContext: FLOOR_AIRBORNE_CONTEXT,
      id: "floor_steel_fallback_generated",
      impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
      name: "floor_steel_fallback_generated",
      rows: withIds(STEEL_FALLBACK_ROWS, "floor_steel_fallback_generated"),
      source: "current",
      studyMode: "floor",
      targetOutputs: FLOOR_OUTPUTS
    });

    expect(scenario.result, "floor fallback should evaluate").not.toBeNull();
    if (!scenario.result) {
      throw new Error("floor_steel_fallback_generated did not evaluate");
    }

    const unsupportedCard = buildOutputCard({
      output: "L'nT,50",
      result: scenario.result,
      studyMode: "floor"
    });
    const lnwCard = buildOutputCard({
      output: "Ln,w",
      result: scenario.result,
      studyMode: "floor"
    });
    const snapshot = buildProposalVisibilitySnapshot({
      outputs: FLOOR_OUTPUTS,
      primaryMetricLabel: "Ln,w",
      primaryMetricValue: lnwCard.value,
      result: scenario.result,
      scenarioId: "floor_steel_fallback_generated",
      studyModeLabel: "Floor",
      warnings: scenario.warnings
    });

    expect(scenario.result.floorSystemEstimate?.kind).toBe("low_confidence");
    expect(scenario.result.floorSystemEstimate?.impact.basis).toBe("predictor_floor_system_low_confidence_estimate");
    expect(scenario.result.impact?.basis).toBe("mixed_predicted_plus_estimated_standardized_field_volume_normalization");
    expect(scenario.result.dynamicImpactTrace?.estimateTier).toBe("low_confidence");
    expect(scenario.result.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(unsupportedCard).toEqual(
      expect.objectContaining({
        status: "unsupported",
        value: "Not ready"
      })
    );
    expect(unsupportedCard.detail).toContain("current path");
    expect(snapshot.branch.tone).toBe("warning");
    expect(snapshot.branch.detail).toMatch(/Low-confidence|fallback/i);
    expect(snapshot.validation.value).toBe("Low-confidence fallback");
    expect(snapshot.validation.detail).toContain("last-resort estimate");
    expect(snapshot.evidence.decisionTrailHeadline).toContain("screening posture");
    expect(snapshot.evidence.decisionTrailItems).toContainEqual(
      expect.objectContaining({
        label: "Delivery posture",
        tone: "warning"
      })
    );
    expect(snapshot.brief.executiveSummary).toContain("screening-only low-confidence fallback route");
    expect(
      snapshot.brief.recommendationItems.find((item) => item.label === "Keep screening language explicit")?.detail
    ).toContain("do not present it as delivery-ready");
  });
});

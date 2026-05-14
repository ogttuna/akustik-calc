import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bu";
import {
  buildPersonalUseMvpCoverageSprintGateBVAstmRatingAdapterBasisSet,
  buildPersonalUseMvpCoverageSprintGateBVContract,
  buildPersonalUseMvpCoverageSprintGateBVCurveOwnerProbes,
  buildPersonalUseMvpCoverageSprintGateBVExactSourceHookProbes,
  buildPersonalUseMvpCoverageSprintGateBVPreviousAdapterBlockers,
  GATE_BV_ASTM_IMPACT_ONE_THIRD_OCTAVE_BAND_CENTERS_HZ,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateBWLanes
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bv";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BV_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bv.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bv-floor-impact-astm-iic-aiic-rating-curve-owner-scaffold-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu-floor-impact-astm-iic-aiic-rating-procedure-and-exact-source-owner-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_HANDOFF.md",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BV_FLOOR_IMPACT_ASTM_IIC_AIIC_RATING_CURVE_OWNER_SCAFFOLD_PLAN.md",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BW_FLOOR_IMPACT_ASTM_IIC_AIIC_CONTOUR_RATING_OWNER_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function curveProbe(id: string) {
  const found = buildPersonalUseMvpCoverageSprintGateBVCurveOwnerProbes().find((entry) => entry.id === id);

  if (!found) {
    throw new Error(`Missing Gate BV curve probe ${id}`);
  }

  return found;
}

function exactHookProbe(id: string) {
  const found = buildPersonalUseMvpCoverageSprintGateBVExactSourceHookProbes().find(
    (entry) => entry.id === id
  );

  if (!found) {
    throw new Error(`Missing Gate BV exact-source hook probe ${id}`);
  }

  return found;
}

describe("Personal-Use MVP Coverage Sprint Gate BV floor-impact ASTM IIC/AIIC rating curve owner scaffold", () => {
  it("lands Gate BV as a no-runtime curve owner scaffold and selects the contour rating owner next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBVContract();

    expect(contract).toMatchObject({
      astmRuntimePromoted: false,
      bridgeFixturesUsedAsRuntimeEvidence: false,
      contourRatingProcedureOwned: false,
      fieldAiicCurveScaffoldReady: true,
      isoImpactAliasesRejected: true,
      labIicCurveScaffoldReady: true,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateBU: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_FILE,
        selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_LABEL,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTION_STATUS
      },
      selectedImplementationSlice:
        "personal_use_mvp_coverage_sprint_after_gate_bu_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_BV_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines complete lab IIC and field AIIC curve scaffolds without promoting runtime", () => {
    expect(GATE_BV_ASTM_IMPACT_ONE_THIRD_OCTAVE_BAND_CENTERS_HZ).toEqual([
      100,
      125,
      160,
      200,
      250,
      315,
      400,
      500,
      630,
      800,
      1000,
      1250,
      1600,
      2000,
      2500,
      3150
    ]);

    expect(curveProbe("gate_bv_complete_lab_iic_curve_scaffold_ready_rating_owner_missing")).toMatchObject({
      bandSetId: "astm_e492_e989_declared_one_third_octave_100_3150_hz",
      curveStandard: "ASTM E492",
      duplicateBandCentersHz: [],
      extraBandCentersHz: [],
      missingBandCentersHz: [],
      missingOwners: [
        "astmE989ExecutableIicContourRatingProcedureOwner",
        "exactAstmSourcePrecedenceRuntimeOwner",
        "astmIicSourceAbsentUncertaintyOwner",
        "astmIicVisibleSurfaceParityOwner"
      ],
      nonFiniteBandCentersHz: [],
      ratingCurveScaffoldReady: true,
      ratingProcedureExecutable: false,
      ratingStandard: "ASTM E989",
      runtimePromotionAllowedAtGateBV: false,
      status: "curve_owner_ready_rating_owner_missing",
      targetOutputs: ["IIC"],
      unsupportedOutputs: ["IIC"]
    });
    expect(curveProbe("gate_bv_complete_field_aiic_curve_scaffold_ready_rating_owner_missing")).toMatchObject({
      bandSetId: "astm_e1007_e989_declared_one_third_octave_100_3150_hz",
      curveStandard: "ASTM E1007",
      fieldContextOwned: true,
      missingOwners: [
        "astmE989ExecutableAiicApparentRatingProcedureOwner",
        "exactAstmSourcePrecedenceRuntimeOwner",
        "astmAiicSourceAbsentUncertaintyOwner",
        "astmAiicVisibleSurfaceParityOwner"
      ],
      ratingCurveScaffoldReady: true,
      ratingProcedureExecutable: false,
      ratingStandard: "ASTM E989",
      runtimePromotionAllowedAtGateBV: false,
      status: "curve_owner_ready_rating_owner_missing",
      targetOutputs: ["AIIC"],
      unsupportedOutputs: ["AIIC"]
    });
  });

  it("keeps partial curves and missing AIIC field context as precise input blockers", () => {
    expect(curveProbe("gate_bv_partial_lab_iic_curve_missing_declared_band")).toMatchObject({
      missingBandCentersHz: [3150],
      missingOwners: ["astmE492NormalizedImpactLevelCurveOwner"],
      ratingCurveScaffoldReady: false,
      status: "needs_curve_input",
      unsupportedOutputs: ["IIC"]
    });
    expect(curveProbe("gate_bv_complete_field_aiic_curve_missing_field_context")).toMatchObject({
      fieldContextOwned: false,
      missingBandCentersHz: [],
      missingOwners: ["astmAiicFieldContextOwner"],
      ratingCurveScaffoldReady: false,
      status: "needs_field_context",
      unsupportedOutputs: ["AIIC"]
    });
  });

  it("rejects ISO impact and building-prediction values as ASTM curve inputs", () => {
    expect(curveProbe("gate_bv_iso_lnw_delta_lw_curve_alias_rejected_for_iic")).toMatchObject({
      blockedOutputs: ["IIC"],
      curveStandard: "not_astm_impact_curve",
      missingOwners: [],
      ratingCurveScaffoldReady: false,
      ratingStandard: "not_astm_impact_rating",
      requestBasis: "iso_lab_impact_alias",
      status: "blocked_basis_alias",
      unsupportedOutputs: ["IIC"]
    });
    expect(curveProbe("gate_bv_building_prediction_curve_alias_rejected_for_iic_aiic")).toMatchObject({
      blockedOutputs: ["IIC", "AIIC"],
      requestBasis: "building_prediction_alias",
      status: "blocked_basis_alias",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
  });

  it("opens exact ASTM hook points without ingesting source documents or measured values", () => {
    expect(exactHookProbe("future_exact_astm_iic_true_match_hook_ready_after_curve_scaffold")).toMatchObject({
      acceptedAsFuturePrecedenceHook: true,
      exactSourcePrecedenceRuntimeOwnerOwned: false,
      hookReadyAfterCurveScaffold: true,
      measuredValuesIngested: false,
      metricId: "IIC",
      missingOwners: [
        "exactAstmSourcePrecedenceRuntimeOwner",
        "astmE989ExecutableIicContourRatingProcedureOwner",
        "astmIicVisibleSurfaceParityOwner"
      ],
      runtimePromotionAllowedAtGateBV: false,
      sourceBasis: "ASTM E989",
      sourceDocumentIngested: false,
      sourceOwnsAstmImpactRatingBasis: true,
      trueAssemblyMatch: true
    });
    expect(exactHookProbe("future_exact_astm_aiic_true_match_hook_ready_after_curve_scaffold")).toMatchObject({
      acceptedAsFuturePrecedenceHook: true,
      hookReadyAfterCurveScaffold: true,
      measuredValuesIngested: false,
      metricId: "AIIC",
      runtimePromotionAllowedAtGateBV: false,
      sourceBasis: "ASTM E989",
      sourceDocumentIngested: false,
      sourceOwnsAstmImpactRatingBasis: true
    });
    expect(exactHookProbe("iso_717_2_exact_impact_row_rejected_for_astm_curve_hook")).toMatchObject({
      acceptedAsFuturePrecedenceHook: false,
      hookReadyAfterCurveScaffold: false,
      sourceBasis: "ISO 717-2",
      sourceOwnsAstmImpactRatingBasis: false
    });
    expect(exactHookProbe("astm_e413_airborne_source_rejected_for_astm_curve_hook")).toMatchObject({
      acceptedAsFuturePrecedenceHook: false,
      hookReadyAfterCurveScaffold: false,
      sourceBasis: "ASTM E413",
      sourceOwnsAstmImpactRatingBasis: false
    });
  });

  it("removes curve-owner blockers from planned adapters while keeping contour/runtime blockers", () => {
    const previousBlockers = buildPersonalUseMvpCoverageSprintGateBVPreviousAdapterBlockers();
    const adapters = buildPersonalUseMvpCoverageSprintGateBVAstmRatingAdapterBasisSet();

    expect(previousBlockers).toContain("astmE492NormalizedImpactLevelCurveOwner");
    expect(previousBlockers).toContain("astmE1007ApparentImpactFieldCurveOwner");
    expect(adapters.map((adapter) => adapter.metricId)).toEqual(["IIC", "AIIC"]);
    expect(adapters.every((adapter) => adapter.implementationStatus === "planned_not_implemented")).toBe(true);
    expect(adapters.every((adapter) => adapter.ratingStandard === "ASTM E989")).toBe(true);
    expect(adapters.find((adapter) => adapter.metricId === "IIC")?.blockedReasons).toEqual([
      "astmE989ExecutableIicContourRatingProcedureOwner",
      "exactAstmSourcePrecedenceRuntimeOwner",
      "astmIicSourceAbsentUncertaintyOwner",
      "astmIicVisibleSurfaceParityOwner"
    ]);
    expect(adapters.find((adapter) => adapter.metricId === "AIIC")?.blockedReasons).toEqual([
      "astmE989ExecutableAiicApparentRatingProcedureOwner",
      "exactAstmSourcePrecedenceRuntimeOwner",
      "astmAiicSourceAbsentUncertaintyOwner",
      "astmAiicVisibleSurfaceParityOwner"
    ]);
    expect(adapters.flatMap((adapter) => adapter.blockedReasons)).not.toContain(
      "astmE492NormalizedImpactLevelCurveOwner"
    );
    expect(adapters.flatMap((adapter) => adapter.blockedReasons)).not.toContain(
      "astmE1007ApparentImpactFieldCurveOwner"
    );
  });

  it("ranks Gate BW contour rating owner ahead of exact-source runtime, surface parity, and broad source crawl", () => {
    const lanes = rankPersonalUseMvpCoverageSprintGateBWLanes();
    const selected = lanes.find((lane) => lane.selected);

    expect(selected).toMatchObject({
      broadSourceCrawl: false,
      id: "astm_iic_aiic_contour_rating_owner",
      runtimeMovementAllowedAtGateBV: false,
      sourceRowsRequiredForSelection: false
    });
    expect(lanes.find((lane) => lane.id === "exact_astm_source_precedence_runtime")).toMatchObject({
      selected: false,
      sourceRowsRequiredForSelection: false
    });
    expect(lanes.find((lane) => lane.id === "broad_astm_source_crawl")).toMatchObject({
      broadSourceCrawl: true,
      selected: false,
      sourceRowsRequiredForSelection: true
    });
  });

  it("keeps docs and the current-gate runner aligned with Gate BV closeout and Gate BW selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_FILE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BV_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("no-runtime");
      expect(content, path).toContain("not alias");
      expect(content, path).toContain("ASTM");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bv-floor-impact-astm-iic-aiic-rating-curve-owner-scaffold-contract.test.ts"
    );
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bt";
import {
  buildPersonalUseMvpCoverageSprintGateBUAstmRatingAdapterBasisSet,
  buildPersonalUseMvpCoverageSprintGateBUContract,
  buildPersonalUseMvpCoverageSprintGateBUExactSourcePrecedenceProbes,
  buildPersonalUseMvpCoverageSprintGateBUOwnerProbes,
  buildPersonalUseMvpCoverageSprintGateBUPreviousAdapterBlockers,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateBVLanes
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bu";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BU_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu-floor-impact-astm-iic-aiic-rating-procedure-and-exact-source-owner-contract.test.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bt.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bt-floor-impact-astm-iic-aiic-metric-schema-and-adapter-bridge-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_HANDOFF.md",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BU_FLOOR_IMPACT_ASTM_IIC_AIIC_RATING_PROCEDURE_AND_EXACT_SOURCE_OWNER_PLAN.md",
  "docs/calculator/SLICE_PERSONAL_USE_MVP_GATE_BV_FLOOR_IMPACT_ASTM_IIC_AIIC_RATING_CURVE_OWNER_SCAFFOLD_PLAN.md",
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
  "docs/calculator/CHECKPOINT_2026-05-14_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function ownerProbe(id: string) {
  const found = buildPersonalUseMvpCoverageSprintGateBUOwnerProbes().find((entry) => entry.id === id);

  if (!found) {
    throw new Error(`Missing Gate BU owner probe ${id}`);
  }

  return found;
}

function exactProbe(id: string) {
  const found = buildPersonalUseMvpCoverageSprintGateBUExactSourcePrecedenceProbes().find(
    (entry) => entry.id === id
  );

  if (!found) {
    throw new Error(`Missing Gate BU exact-source probe ${id}`);
  }

  return found;
}

describe("Personal-Use MVP Coverage Sprint Gate BU floor-impact ASTM IIC/AIIC rating procedure and exact-source owner", () => {
  it("lands Gate BU as a no-runtime owner boundary and selects the rating-curve scaffold next", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBUContract();

    expect(contract).toMatchObject({
      astmRuntimePromoted: false,
      bridgeFixturesUsedAsRuntimeEvidence: false,
      exactAstmSourcePrecedenceRuntimeOwnerMissing: true,
      isoImpactAliasesRejected: true,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateBT: {
        landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_LANDED_GATE,
        selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_ACTION,
        selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_FILE,
        selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_LABEL,
        selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTION_STATUS
      },
      ratingProcedureRuntimeOwnerMissing: true,
      selectedImplementationSlice:
        "personal_use_mvp_coverage_sprint_after_gate_bt_floor_impact_astm_iic_aiic_rating_procedure_exact_source_owner",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_BU_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps Gate BT bridge probes schema-ready but never treats them as runtime evidence", () => {
    const contract = buildPersonalUseMvpCoverageSprintGateBUContract();

    expect(contract.bridgeProbes.map((probe) => probe.metricId)).toEqual(["IIC", "AIIC"]);
    expect(contract.bridgeProbes.every((probe) => probe.runtimeEvidence === false)).toBe(true);
    expect(contract.bridgeProbes.every((probe) => probe.sourceRowsIngested === false)).toBe(true);
    expect(contract.bridgeProbes.map((probe) => probe.valueDb)).toEqual([52, 48]);
    expect(contract.currentRuntimeStillUnsupported).toEqual({
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["IIC", "AIIC"]
    });
    expect(contract.astmRuntimePromoted).toBe(false);
  });

  it("names the missing ASTM rating procedure, exact-source, uncertainty, and parity owners", () => {
    expect(ownerProbe("gate_bu_lab_iic_bridge_ready_rating_procedure_missing")).toMatchObject({
      blockedOutputs: [],
      exactAstmSourcePrecedenceOwned: false,
      metricId: "IIC",
      missingOwners: [
        "astmE492NormalizedImpactLevelCurveOwner",
        "astmE989ExecutableIicContourRatingProcedureOwner",
        "exactAstmSourcePrecedenceRuntimeOwner",
        "astmIicSourceAbsentUncertaintyOwner",
        "astmIicVisibleSurfaceParityOwner"
      ],
      promotedOutputs: [],
      ratingProcedureExecutable: false,
      runtimePromotionAllowedAtGateBU: false,
      schemaBridgeReady: true,
      status: "runtime_owner_missing",
      targetOutputs: ["IIC"],
      unsupportedOutputs: ["IIC"]
    });
    expect(ownerProbe("gate_bu_field_aiic_bridge_ready_rating_procedure_missing")).toMatchObject({
      exactAstmSourcePrecedenceOwned: false,
      metricId: "AIIC",
      missingOwners: [
        "astmE1007ApparentImpactFieldCurveOwner",
        "astmE989ExecutableAiicApparentRatingProcedureOwner",
        "astmAiicFieldContextOwner",
        "exactAstmSourcePrecedenceRuntimeOwner",
        "astmAiicSourceAbsentUncertaintyOwner",
        "astmAiicVisibleSurfaceParityOwner"
      ],
      promotedOutputs: [],
      ratingProcedureExecutable: false,
      schemaBridgeReady: true,
      status: "runtime_owner_missing",
      targetOutputs: ["AIIC"],
      unsupportedOutputs: ["AIIC"]
    });
  });

  it("keeps ISO lab, ISO field, and building-prediction impact values outside ASTM ratings", () => {
    expect(ownerProbe("gate_bu_iso_lnw_delta_lw_not_iic_rating_input")).toMatchObject({
      blockedOutputs: ["IIC"],
      missingOwners: [],
      promotedOutputs: [],
      requestBasis: "iso_lab_impact_alias",
      schemaBridgeReady: false,
      status: "blocked_basis_alias",
      unsupportedOutputs: ["IIC"]
    });
    expect(ownerProbe("gate_bu_iso_field_lprime_not_aiic_rating_input")).toMatchObject({
      blockedOutputs: ["AIIC"],
      promotedOutputs: [],
      requestBasis: "iso_field_impact_alias",
      schemaBridgeReady: false,
      status: "blocked_basis_alias",
      unsupportedOutputs: ["AIIC"]
    });
    expect(ownerProbe("gate_bu_building_prediction_not_astm_iic_aiic_rating_input")).toMatchObject({
      blockedOutputs: ["IIC", "AIIC"],
      metricId: "IIC+AIIC",
      promotedOutputs: [],
      requestBasis: "building_prediction_alias",
      schemaBridgeReady: false,
      status: "blocked_basis_alias",
      unsupportedOutputs: ["IIC", "AIIC"]
    });
  });

  it("accepts only future true-match ASTM E989 rows as exact-source candidates and still does not promote them", () => {
    expect(exactProbe("future_exact_astm_iic_true_match_waits_for_precedence_owner")).toMatchObject({
      acceptedAsFuturePrecedenceCandidate: true,
      exactSourcePrecedenceRuntimeOwnerOwned: false,
      metricId: "IIC",
      missingOwners: [
        "exactAstmSourcePrecedenceRuntimeOwner",
        "astmE989ExecutableIicContourRatingProcedureOwner",
        "astmIicVisibleSurfaceParityOwner"
      ],
      runtimePromotionAllowedAtGateBU: false,
      sourceBasis: "ASTM E989",
      sourceOwnsSingleNumberRating: true,
      trueAssemblyMatch: true
    });
    expect(exactProbe("future_exact_astm_aiic_true_match_waits_for_precedence_owner")).toMatchObject({
      acceptedAsFuturePrecedenceCandidate: true,
      exactSourcePrecedenceRuntimeOwnerOwned: false,
      metricId: "AIIC",
      runtimePromotionAllowedAtGateBU: false,
      sourceBasis: "ASTM E989",
      sourceOwnsSingleNumberRating: true,
      trueAssemblyMatch: true
    });
    expect(exactProbe("iso_717_2_exact_impact_row_rejected_for_astm_iic")).toMatchObject({
      acceptedAsFuturePrecedenceCandidate: false,
      sourceBasis: "ISO 717-2",
      sourceOwnsSingleNumberRating: false
    });
    expect(exactProbe("astm_e413_airborne_source_rejected_for_astm_iic")).toMatchObject({
      acceptedAsFuturePrecedenceCandidate: false,
      sourceBasis: "ASTM E413",
      sourceOwnsSingleNumberRating: true
    });
  });

  it("expands planned ASTM adapters from schema blockers to rating-curve and exact-source blockers", () => {
    const previousBlockers = buildPersonalUseMvpCoverageSprintGateBUPreviousAdapterBlockers();
    const adapters = buildPersonalUseMvpCoverageSprintGateBUAstmRatingAdapterBasisSet();
    const nextBlockers = adapters.flatMap((adapter) => adapter.blockedReasons);

    expect(previousBlockers).not.toContain("astmE492NormalizedImpactLevelCurveOwner");
    expect(previousBlockers).not.toContain("astmIicSourceAbsentUncertaintyOwner");
    expect(adapters.map((adapter) => adapter.metricId)).toEqual(["IIC", "AIIC"]);
    expect(adapters.every((adapter) => adapter.implementationStatus === "planned_not_implemented")).toBe(true);
    expect(adapters.every((adapter) => adapter.ratingStandard === "ASTM E989")).toBe(true);
    expect(adapters.find((adapter) => adapter.metricId === "IIC")?.blockedReasons).toEqual([
      "astmE492NormalizedImpactLevelCurveOwner",
      "astmE989ExecutableIicContourRatingProcedureOwner",
      "exactAstmSourcePrecedenceRuntimeOwner",
      "astmIicSourceAbsentUncertaintyOwner",
      "astmIicVisibleSurfaceParityOwner"
    ]);
    expect(adapters.find((adapter) => adapter.metricId === "AIIC")?.blockedReasons).toEqual([
      "astmE1007ApparentImpactFieldCurveOwner",
      "astmE989ExecutableAiicApparentRatingProcedureOwner",
      "astmAiicFieldContextOwner",
      "exactAstmSourcePrecedenceRuntimeOwner",
      "astmAiicSourceAbsentUncertaintyOwner",
      "astmAiicVisibleSurfaceParityOwner"
    ]);
    expect(nextBlockers).not.toContain("impactCalculationIicMetricValueOwner");
    expect(nextBlockers).not.toContain("targetOutputSupportAstmAiicOwner");
  });

  it("ranks Gate BV rating-curve owner scaffold ahead of broad source crawling and ISO reuse", () => {
    const lanes = rankPersonalUseMvpCoverageSprintGateBVLanes();
    const selected = lanes.find((lane) => lane.selected);

    expect(selected).toMatchObject({
      broadSourceCrawl: false,
      id: "astm_iic_aiic_rating_curve_owner_scaffold",
      runtimeMovementAllowedAtGateBU: false,
      sourceRowsRequiredForSelection: false
    });
    expect(lanes.find((lane) => lane.id === "broad_astm_source_crawl")).toMatchObject({
      broadSourceCrawl: true,
      selected: false,
      sourceRowsRequiredForSelection: true
    });
    expect(lanes.find((lane) => lane.id === "iso_impact_adapter_reuse")).toMatchObject({
      selected: false,
      sourceRowsRequiredForSelection: false
    });
  });

  it("keeps docs and the current-gate runner aligned with Gate BU closeout and Gate BV selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_FILE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BU_SELECTED_NEXT_LABEL);
      expect(content, path).toContain("no-runtime");
      expect(content, path).toContain("not alias");
      expect(content, path).toContain("ASTM");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-bu-floor-impact-astm-iic-aiic-rating-procedure-and-exact-source-owner-contract.test.ts"
    );
  });
});

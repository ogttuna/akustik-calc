import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildCompanyInternalOpeningLeakAWeightedRuntimeCorridorContract
} from "./company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract";
import {
  buildCompanyInternalOpeningLeakBuildingRuntimeCorridorContract
} from "./company-internal-opening-leak-building-runtime-corridor-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
} from "./company-internal-opening-leak-building-runtime-corridor";
import { GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import {
  evaluatePostV1GateCLResidualLedgers
} from "./post-v1-next-numeric-coverage-gap-gate-cl";
import {
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_LANDED_GATE,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_ACTION,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_FILE,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTION_STATUS,
  POST_V1_GATE_FA_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_FA_PLAN_DOC_PATH,
  POST_V1_GATE_FA_SELECTED_GAP_ID
} from "./post-v1-current-coverage-accuracy-gap-ledger-gate-fa";
import {
  POST_V1_GATE_CJ_BUILDING_VALUE_PINS
} from "./post-v1-wall-common-auto-topology-expansion-gate-cj";
import {
  POST_V1_GATE_FB_COUNTERS,
  POST_V1_GATE_FB_OWNER_DECISION_ID,
  POST_V1_GATE_FB_PLAN_DOC_PATH,
  POST_V1_GATE_FB_REJECTED_BOUNDARIES,
  POST_V1_GATE_FB_TARGET_OUTPUTS,
  POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_LANDED_GATE,
  POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_ACTION,
  POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_FILE,
  POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_LABEL,
  POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTION_STATUS,
  buildPostV1GateFBFrozenRuntimePins,
  buildPostV1GateFBOwnerLedgers,
  summarizePostV1OpeningLeakCommonWallSameBasisResidualOwnerGateFB
} from "./post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/SYSTEM_MAP.md",
  "docs/calculator/USABLE_V1_EXECUTION_PLAN.md",
  "docs/calculator/POST_V1_GATE_FA_FB_OPENING_LEAK_COMMON_WALL_RESIDUAL_OWNER_PLAN_2026-06-09.md",
  POST_V1_GATE_FB_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 opening/leak common wall same-basis residual owner Gate FB", () => {
  it("lands after Gate FA, rejects the residual owner for budget tightening, and selects Gate FC", () => {
    const summary = summarizePostV1OpeningLeakCommonWallSameBasisResidualOwnerGateFB();

    expect(POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTION_STATUS).toBe(
      "post_v1_current_coverage_accuracy_gap_ledger_gate_fa_landed_no_runtime_selected_opening_leak_common_wall_same_basis_residual_owner_gate_fb"
    );
    expect(POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_ACTION).toBe(
      POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_LANDED_GATE
    );
    expect(POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts"
    );

    expect(summary).toMatchObject({
      counters: POST_V1_GATE_FB_COUNTERS,
      landedGate: POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_LANDED_GATE,
      noRuntimeValueMovement: true,
      ownerDecisionId: POST_V1_GATE_FB_OWNER_DECISION_ID,
      planDocPath: POST_V1_GATE_FB_PLAN_DOC_PATH,
      previousGateFA: {
        counters: POST_V1_GATE_FA_NO_RUNTIME_COUNTERS,
        landedGate: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_LANDED_GATE,
        planDocPath: POST_V1_GATE_FA_PLAN_DOC_PATH,
        selectedGapId: POST_V1_GATE_FA_SELECTED_GAP_ID,
        selectedNextAction: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_FA_SELECTION_STATUS
      },
      rejectedBoundaries: POST_V1_GATE_FB_REJECTED_BOUNDARIES,
      selectedGapId: POST_V1_GATE_FA_SELECTED_GAP_ID,
      selectedNextAction:
        POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_LABEL,
      selectionStatus:
        POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_FB_TARGET_OUTPUTS
    });
  });

  it("pins every owner ledger as rejected because same-basis holdouts are absent", () => {
    const ownerLedgers = buildPostV1GateFBOwnerLedgers();
    const residualLedgers = evaluatePostV1GateCLResidualLedgers();
    const openingLeakResidual = residualLedgers.find((ledger) =>
      ledger.id === "wall.opening_leak_composite.field_building_gate_ck"
    );
    const commonWallResidual = residualLedgers.find((ledger) =>
      ledger.id === "wall.common_flat_double_leaf.building_prediction_gate_cj"
    );

    expect(ownerLedgers).toHaveLength(POST_V1_GATE_FB_COUNTERS.ownerLedgersRejected);
    expect(POST_V1_GATE_FB_COUNTERS).toMatchObject({
      runtimeBudgetTighteningAdmitted: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
    expect(openingLeakResidual).toMatchObject({
      budgetDecision: "hold_wide_budget",
      budgetTighteningAdmitted: false,
      holdoutRowIds: [],
      runtimePromotionAdmitted: false
    });
    expect(commonWallResidual).toMatchObject({
      budgetDecision: "hold_wide_budget",
      budgetTighteningAdmitted: false,
      holdoutRowIds: [],
      runtimePromotionAdmitted: false
    });

    for (const ledger of ownerLedgers) {
      expect(ledger).toMatchObject({
        budgetTighteningAdmitted: false,
        holdoutRowIds: [],
        observedMaeDb: null,
        ownerDecisionId: POST_V1_GATE_FB_OWNER_DECISION_ID,
        ownerStatus: "rejected_missing_same_basis_holdouts",
        runtimePromotionAllowed: false,
        sourceRowsRequiredBeforeFutureBudgetTightening: true
      });
      expect(ledger.currentErrorBudgetDb).toBeGreaterThan(0);
      expect(ledger.metrics.length).toBeGreaterThan(0);
    }
  });

  it("freezes opening/leak and common-wall runtime values and budgets while closing the owner proof", () => {
    const pins = buildPostV1GateFBFrozenRuntimePins();

    expect(pins.openingLeakField).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB,
      metrics: {
        "Dn,w": 36.7,
        "DnT,w": 36.9,
        "R'w": 36.4
      },
      supportedTargetOutputs: ["R'w", "Dn,w", "DnT,w"]
    });
    expect(pins.openingLeakBuilding).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
      metrics: {
        "DnT,w": 32.1,
        "R'w": 31.6
      },
      supportedTargetOutputs: ["R'w", "DnT,w"]
    });
    expect(pins.openingLeakAWeightedField).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
      metrics: {
        "Dn,A": 35.9,
        "Dn,w": 36.7,
        "DnT,A": 36.1,
        "DnT,w": 36.9,
        "R'w": 36.4
      },
      supportedTargetOutputs: ["Dn,A", "DnT,A", "Dn,w", "DnT,w", "R'w"]
    });
    expect(pins.openingLeakAWeightedBuilding).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
      metrics: {
        "Dn,A": null,
        "DnT,A": 31.3,
        "DnT,w": 32.1,
        "R'w": 31.6
      },
      supportedTargetOutputs: ["DnT,A", "DnT,w", "R'w"]
    });
    expect(pins.commonWallBuildingValuePins).toEqual(POST_V1_GATE_CJ_BUILDING_VALUE_PINS);
  });

  it("keeps lab, field, building, A-weighted, missing-input, and unsupported boundaries separate", () => {
    const openingLeak = buildCompanyInternalOpeningLeakBuildingRuntimeCorridorContract();
    const aWeighted = buildCompanyInternalOpeningLeakAWeightedRuntimeCorridorContract();
    const boundaries = new Set(POST_V1_GATE_FB_REJECTED_BOUNDARIES.map((boundary) => boundary.boundary));

    expect(boundaries).toEqual(new Set([
      "a_weighted_requires_explicit_frequency_band_set",
      "building_prediction_rows_do_not_calibrate_field_apparent",
      "common_wall_lab_field_rows_do_not_calibrate_building_prediction",
      "exact_same_stack_same_basis_rows_keep_precedence",
      "field_apparent_rows_do_not_calibrate_building_prediction",
      "lab_rw_stc_rows_do_not_calibrate_field_building_or_a_weighted",
      "missing_opening_leak_physical_inputs_stay_needs_input"
    ]));

    expect(openingLeak.labRuntimeProbe).toMatchObject({
      basisId: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      computedDnTADb: null,
      computedDnTwDb: null,
      computedRwPrimeDb: null
    });
    expect(aWeighted.missingFrequencyBandSetProbe).toMatchObject({
      basisId: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
      computedDnADb: null,
      computedDnTADb: null,
      errorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
    });
    expect(aWeighted.labAliasProbe).toMatchObject({
      basisId: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      computedDnADb: null,
      computedDnTADb: null
    });
    expect(aWeighted.buildingDnAUnsupportedProbe).toMatchObject({
      computedDnADb: null,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Dn,A"]
    });
  });

  it("keeps docs and current-gate runner aligned with Gate FB closeout and Gate FC selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(
        POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_OPENING_LEAK_COMMON_WALL_SAME_BASIS_RESIDUAL_OWNER_GATE_FB_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(POST_V1_GATE_FB_OWNER_DECISION_ID);
      expect(contents, path).toContain("Gate FC");
      expect(normalizedWhitespaceContent, path).toContain("owner rejected");
      expect(normalizedWhitespaceContent, path).toContain("same-basis holdouts are absent");
      expect(contents, path).toContain("ownerLedgersRejected 5");
      expect(contents, path).toContain("sameBasisHoldoutLedgersMissing 5");
      expect(contents, path).toContain("runtimeBudgetTighteningAdmitted 0");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const plan = readRepoFile(POST_V1_GATE_FB_PLAN_DOC_PATH);
    expect(plan).toContain("Gate FB Closeout");
    expect(plan).toContain("Gate FC Outcome");
    expect(plan).toContain("Gate FD work order");
    expect(plan).toContain("value-moving");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts"
    );
    expect(currentGateRunner).toContain(
      "src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts"
    );
  });
});

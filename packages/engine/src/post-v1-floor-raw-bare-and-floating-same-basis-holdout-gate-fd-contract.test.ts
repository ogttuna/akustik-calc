import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_LANDED_GATE,
  POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTION_STATUS,
  POST_V1_GATE_FD_COUNTERS,
  POST_V1_GATE_FD_OWNER_DECISION_ID,
  POST_V1_GATE_FD_PLAN_DOC_PATH,
  POST_V1_GATE_FD_REJECTED_BOUNDARIES,
  POST_V1_GATE_FD_REJECTED_EVIDENCE_CONTEXTS,
  POST_V1_GATE_FD_TARGET_OUTPUTS,
  buildPostV1GateFDFrozenRuntimePins,
  buildPostV1GateFDOwnerLedgers,
  summarizePostV1FloorRawBareAndFloatingSameBasisHoldoutGateFD
} from "./post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd";
import {
  POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS
} from "./post-v1-next-numeric-coverage-gap-gate-ch";
import {
  POST_V1_GATE_FC_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_FC_PLAN_DOC_PATH,
  POST_V1_GATE_FC_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTION_STATUS,
  buildPostV1GateFCSelectedFloorResidualLedgers
} from "./post-v1-next-numeric-coverage-gap-gate-fc";

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
  POST_V1_GATE_FC_PLAN_DOC_PATH,
  POST_V1_GATE_FD_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor raw-bare/floating same-basis holdout owner Gate FD", () => {
  it("lands after Gate FC, rejects the holdout owner, and selects Gate FE", () => {
    const summary = summarizePostV1FloorRawBareAndFloatingSameBasisHoldoutGateFD();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_fc_landed_no_runtime_selected_floor_raw_bare_and_floating_same_basis_holdout_gate_fd"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts"
    );

    expect(summary).toMatchObject({
      counters: POST_V1_GATE_FD_COUNTERS,
      landedGate: POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_LANDED_GATE,
      noRuntimeValueMovement: true,
      ownerDecisionId: POST_V1_GATE_FD_OWNER_DECISION_ID,
      planDocPath: POST_V1_GATE_FD_PLAN_DOC_PATH,
      previousGateFC: {
        counters: POST_V1_GATE_FC_NO_RUNTIME_COUNTERS,
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_LANDED_GATE,
        planDocPath: POST_V1_GATE_FC_PLAN_DOC_PATH,
        selectedCandidateId: POST_V1_GATE_FC_SELECTED_CANDIDATE_ID,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_FC_SELECTION_STATUS
      },
      rejectedBoundaries: POST_V1_GATE_FD_REJECTED_BOUNDARIES,
      rejectedEvidenceContexts: POST_V1_GATE_FD_REJECTED_EVIDENCE_CONTEXTS,
      selectedNextAction:
        POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_LABEL,
      selectedResidualLedgerIds: POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS,
      selectionStatus:
        POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_FD_TARGET_OUTPUTS
    });
  });

  it("rejects all three selected Gate CL floor ledgers because admissible same-basis holdouts are absent", () => {
    const ownerLedgers = buildPostV1GateFDOwnerLedgers();
    const selectedGateCLLedgers = buildPostV1GateFCSelectedFloorResidualLedgers();
    const gateFDTargetOutputs = new Set<string>(POST_V1_GATE_FD_TARGET_OUTPUTS);

    expect(ownerLedgers.map((ledger) => ledger.gateCLResidualLedgerId)).toEqual(
      POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS
    );
    expect(ownerLedgers).toHaveLength(POST_V1_GATE_FD_COUNTERS.ownerLedgersRejected);
    expect(selectedGateCLLedgers).toHaveLength(POST_V1_GATE_FD_COUNTERS.evaluatedGateCLResidualLedgers);

    for (const ledger of ownerLedgers) {
      const gateCLLedger = selectedGateCLLedgers.find((candidate) =>
        candidate.id === ledger.gateCLResidualLedgerId
      );

      expect(gateCLLedger, ledger.id).toBeDefined();
      expect(gateCLLedger).toMatchObject({
        budgetDecision: "hold_wide_budget",
        budgetTighteningAdmitted: false,
        holdoutRowIds: [],
        observedMaeDb: null,
        runtimePromotionAdmitted: false
      });
      expect(ledger).toMatchObject({
        budgetTighteningAdmitted: false,
        holdoutRowIds: [],
        observedMaeDb: null,
        ownerDecisionId: POST_V1_GATE_FD_OWNER_DECISION_ID,
        ownerStatus: "rejected_missing_admissible_same_basis_holdouts",
        runtimePromotionAllowed: false,
        sourceRowsRequiredBeforeFutureBudgetTightening: true
      });
      expect(ledger.currentErrorBudgetDb, ledger.id).toBeGreaterThanOrEqual(8);
      expect(ledger.metrics.some((metric) => gateFDTargetOutputs.has(metric))).toBe(true);
      expect(ledger.rejectedEvidenceContextIds).toHaveLength(2);
    }
  });

  it("pins the exact evidence contexts that are not admissible holdouts", () => {
    const contexts = POST_V1_GATE_FD_REJECTED_EVIDENCE_CONTEXTS;
    const contextIds = new Set(contexts.map((context) => context.id));

    expect(contexts).toHaveLength(POST_V1_GATE_FD_COUNTERS.rejectedCandidateEvidenceLedgers);
    expect(contextIds).toEqual(new Set([
      "heavy_floating_field_adapter_values_are_source_absent_field_context_outputs",
      "heavy_floating_published_upper_treatment_ln_w_anchor_not_field_direct_flanking_holdout",
      "open_box_package_transfer_rows_not_raw_bare_same_basis_holdouts",
      "open_box_raw_bare_source_absent_formula_outputs_are_not_holdouts",
      "open_web_raw_bare_source_absent_formula_outputs_are_not_holdouts",
      "open_web_ubiq_inex_firestop_rows_not_raw_bare_same_basis_holdouts"
    ]));

    for (const context of contexts) {
      expect(context.admissibleAsSameBasisHoldout, context.id).toBe(false);
      expect(POST_V1_GATE_FC_SELECTED_RESIDUAL_LEDGER_IDS).toContain(context.rejectedForLedgerId);
      expect(context.reason.length, context.id).toBeGreaterThan(40);

      for (const path of context.evidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${context.id}:${path}`).toBe(true);
      }
    }
  });

  it("keeps raw-bare, field direct/flanking, ASTM, exact-source, and missing-input boundaries separate", () => {
    const boundaries = new Set(POST_V1_GATE_FD_REJECTED_BOUNDARIES.map((boundary) => boundary.boundary));

    expect(boundaries).toEqual(new Set([
      "astm_iic_aiic_rows_do_not_alias_to_iso_ln_or_delta_lw",
      "element_lab_raw_bare_rows_do_not_calibrate_field_direct_flanking_outputs",
      "exact_same_stack_same_basis_rows_keep_precedence",
      "missing_route_physical_inputs_stay_needs_input",
      "packaged_finished_or_supported_band_rows_do_not_calibrate_raw_bare",
      "published_upper_treatment_ln_w_anchor_does_not_retune_field_direct_flanking_budget",
      "source_absent_formula_outputs_cannot_be_their_own_holdouts"
    ]));
    expect(POST_V1_GATE_FD_COUNTERS).toMatchObject({
      admissibleHoldoutLedgers: 0,
      broadSourceCrawlSelected: false,
      runtimeBasisPromotions: 0,
      runtimeBudgetTighteningAdmitted: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("freezes representative values and budgets while closing the owner proof", () => {
    const pins = buildPostV1GateFDFrozenRuntimePins();

    expect(pins.gateCHFieldDirectFlankingValuePins).toEqual(
      POST_V1_GATE_CH_FIELD_DIRECT_FLANKING_VALUE_PINS
    );
    expect(pins.gateCHFieldDirectFlankingValuePins).toEqual({
      "CI,50-2500": 4,
      "L'n,w": 57.5,
      "L'nT,w": 55.1,
      "L'nT,50": 59.1,
      "Ln,w": 50
    });
    expect(pins.selectedResidualBudgetPins).toMatchObject({
      "floor.heavy_floating_upper_treatment.field_companion_gate_ch": 8,
      "floor.open_box_timber.raw_bare_lab_impact": 9,
      "floor.open_web_steel.raw_bare_lab_impact": 9
    });
  });

  it("keeps docs and current-gate runner aligned with Gate FD closeout and Gate FE selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(
        POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_RAW_BARE_AND_FLOATING_SAME_BASIS_HOLDOUT_GATE_FD_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(POST_V1_GATE_FD_OWNER_DECISION_ID);
      expect(contents, path).toContain("Gate FE");
      expect(normalizedWhitespaceContent, path).toContain("same-basis holdout");
      expect(contents, path).toContain("admissibleHoldoutLedgers 0");
      expect(contents, path).toContain("ownerLedgersRejected 3");
      expect(contents, path).toContain("runtimeBudgetTighteningAdmitted 0");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const plan = readRepoFile(POST_V1_GATE_FD_PLAN_DOC_PATH);
    expect(plan).toContain("Gate FD Outcome");
    expect(plan).toContain("Gate FE Work Order");
    expect(plan.replace(/\s+/g, " ")).toContain("not a broad source crawl");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-fc-contract.test.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts"
    );
  });
});

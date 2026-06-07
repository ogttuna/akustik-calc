import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  findVerifiedAirborneAssemblyMatch,
  findVerifiedAirborneAssemblyMatchWithLabFallback
} from "./airborne-verified-catalog";
import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD,
  GATE_H_CLT_MASS_TIMBER_WALL_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-h-lined-masonry-clt";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-y-clt-mass-timber-ctr-spectrum-adapter";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_GATE_DO_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_DO_PLAN_DOC_PATH,
  POST_V1_GATE_DO_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DO_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTION_STATUS,
  rankPostV1GateDONumericCoverageCandidates,
  summarizePostV1GateDONumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-do";
import {
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_LANDED_GATE,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_ACTION,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_FILE,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTION_STATUS
} from "./post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const CLT_GENERATED_CASE_ID = "wall-clt-local" as const;
const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];

const SINGLE_CLT_PANEL: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 120 }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

function context(options: Parameters<typeof calculateAssembly>[1], label: string): AirborneContext {
  const value = options?.airborneContext;

  if (!value) {
    throw new Error(`${label} airborne context missing`);
  }

  return value;
}

describe("post-V1 next numeric coverage gap Gate DO", () => {
  it("lands the no-runtime Gate DO rerank after Gate DN and selects CLT laminated-leaf runtime-basis Gate DP", () => {
    const summary = summarizePostV1GateDONumericCoverageGap();

    expect(POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTION_STATUS).toBe(
      "post_v1_wall_timber_stud_bounded_runtime_basis_gate_dn_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_do"
    );
    expect(POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_LANDED_GATE
    );
    expect(POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-do-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_DO_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_DO_PLAN_DOC_PATH,
      previousGateDN: {
        landedGate: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_LANDED_GATE,
        selectedNextAction: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_WALL_TIMBER_STUD_BOUNDED_RUNTIME_BASIS_GATE_DN_SELECTION_STATUS
      },
      selectedCandidateId: POST_V1_GATE_DO_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTION_STATUS
    });
  });

  it("selects the highest-ROI CLT runtime-basis repair and rejects closed, blocked, or non-goal work", () => {
    const candidates = rankPostV1GateDONumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_DO_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_DO_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeBasis: true,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_FILE,
      sliceKind: "runtime_basis_accuracy_repair",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DO_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("wall.clt_laminated_leaf_bounded_rule_owner_gap")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("opening_leak_common_wall_holdout_tightening")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.heavy_core_lined_massive_direct_retune")?.score ?? 0);

    expect(byId.get("wall.timber_stud_formula_bounded_rule_owner_gap")).toMatchObject({
      selected: false,
      sliceKind: "closed_runtime_gap"
    });
    expect(byId.get("floor.steel_visible_formula_input_surface_parity_gap")).toMatchObject({
      selected: false,
      sliceKind: "closed_runtime_gap"
    });
    expect(byId.get("wall.held_aac_board_fill_gap_multicavity_gap")).toMatchObject({
      selected: false,
      sliceKind: "already_runtime_capable"
    });

    for (const blockedId of ["broad_source_row_crawl", "confidence_wording", "frontend_ui_polish"] as const) {
      expect(byId.get(blockedId)).toMatchObject({
        passesCalculatorAdvancementTest: false,
        selected: false,
        sliceKind: "blocked_non_goal"
      });
    }
  });

  it("records the selected CLT stack as the former screening gap and verifies the landed DP basis repair", () => {
    const gateDoSelected = rankPostV1GateDONumericCoverageCandidates().find(
      (candidate) => candidate.id === POST_V1_GATE_DO_SELECTED_CANDIDATE_ID
    );
    const testCase = generatedCase(CLT_GENERATED_CASE_ID);
    const labContext = context(testCase.labOptions, testCase.id);
    const fieldContext = context(testCase.fieldOptions, testCase.id);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labSnapshot = resultSnapshot(lab);
    const fieldSnapshot = resultSnapshot(field);

    expect(labSnapshot).toMatchObject({
      c: -1.1,
      ctr: -7.1,
      dynamicFamily: "laminated_single_leaf",
      rw: 42,
      rwDb: 42,
      stc: 43,
      supportedTargetOutputs: [...WALL_LAB_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(fieldSnapshot).toMatchObject({
      c: -1.8,
      ctr: -7.6,
      dnTA: 40.7,
      dnTw: 42,
      dnW: 41,
      dynamicFamily: "laminated_single_leaf",
      rwPrimeDb: 41,
      supportedTargetOutputs: [...WALL_FIELD_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(lab.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "laminated_single_leaf",
      originalSolidLayerCount: 3,
      selectedMethod: "sharp",
      strategy: "laminated_leaf_sharp_delegate",
      supportLayerCount: 0,
      surfaceMassKgM2: 87.1,
      totalGapThicknessMm: 0,
      visibleLeafCount: 1
    });
    expect(gateDoSelected?.expectedBeforeAfter).toEqual(
      expect.arrayContaining([
        expect.stringContaining("candidate_multileaf_screening_fallback"),
        expect.stringContaining("Gate H CLT")
      ])
    );
    expect(lab.airborneBasis).toMatchObject({
      calculationStandard: "engine_mass_law",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 6,
      family: "laminated_single_leaf",
      kind: "airborne_physics_prediction",
      method: GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(field.airborneBasis).toMatchObject({
      family: "laminated_single_leaf",
      kind: "airborne_physics_prediction",
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(lab.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(field.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(lab.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining(["materialClass:mass_timber", "leafGrouping=single_leaf_or_laminated_single_leaf"])
    );
    expect(lab.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        "Gate Y promotes the calculated ISO 717-1 Ctr spectrum-adaptation term for CLT / mass-timber only when the Gate H lab family-physics curve is already complete"
      ])
    );
    expect(field.airborneBasis?.method).not.toBe(GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD);
    expect(findVerifiedAirborneAssemblyMatch(lab.layers, labContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(field.layers, fieldContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(field.layers, fieldContext)).toBeNull();
    expect(POST_V1_GATE_DO_NO_RUNTIME_COUNTERS).toMatchObject({
      estimatedNextRuntimeBasisPromotions: 1,
      estimatedNextRuntimeCorrectedLayerTemplates: 1,
      estimatedNextRuntimeCorrectedRequestShapes: 8,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeValuesMoved: 0
    });
  });

  it("keeps existing single-panel CLT Gate H behavior live while laminated CLT+gypsum is the selected gap", () => {
    const singleClt = calculateAssembly(SINGLE_CLT_PANEL, {
      airborneContext: { airtightness: "good", contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "C"]
    });
    const singleCltSnapshot = resultSnapshot(singleClt);
    const testCase = generatedCase(CLT_GENERATED_CASE_ID);
    const generatedClt = calculateAssembly(testCase.rows, testCase.labOptions);

    expect(singleCltSnapshot).toMatchObject({
      c: -1.2,
      dynamicFamily: "single_leaf_panel",
      rwDb: 42,
      stc: 42,
      supportedTargetOutputs: ["Rw", "STC", "C"],
      unsupportedTargetOutputs: []
    });
    expect(singleClt.airborneBasis).toMatchObject({
      family: "single_leaf_panel",
      method: GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(singleClt.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_H_CLT_MASS_TIMBER_WALL_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(generatedClt.dynamicAirborneTrace?.detectedFamily).toBe("laminated_single_leaf");
    expect(generatedClt.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      GATE_H_CLT_MASS_TIMBER_WALL_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps docs and current-gate runner aligned with Gate DO closeout and Gate DP selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DO_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("candidate_multileaf_screening_fallback");
      expect(contents, path).toContain("runtimeValuesMoved 0");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-do.ts")))
      .toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-do-contract.test.ts");
  });
});

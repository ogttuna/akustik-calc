import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

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
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-do";
import {
  POST_V1_GATE_DP_COUNTERS,
  POST_V1_GATE_DP_FIELD_RUNTIME_BASIS,
  POST_V1_GATE_DP_LAB_RUNTIME_BASIS,
  POST_V1_GATE_DP_NEGATIVE_BOUNDARIES,
  POST_V1_GATE_DP_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DP_TARGET_OUTPUTS,
  POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_LANDED_GATE,
  POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_ACTION,
  POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_FILE,
  POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTION_STATUS,
  summarizePostV1WallCltLaminatedLeafRuntimeBasisGateDP
} from "./post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp";

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

const SINGLE_CLT_PANEL: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 120 }
] as const;

const ORDINARY_GYPSUM_LAMINATED_LEAF: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const PLYWOOD_LAMINATED_LEAF: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "plywood", thicknessMm: 18 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const DOUBLE_LEAF_CLT: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 100 },
  { materialId: "air_gap", thicknessMm: 70 },
  { materialId: "clt_panel", thicknessMm: 100 }
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

describe("post-V1 wall CLT laminated-leaf runtime-basis Gate DP", () => {
  it("lands after Gate DO and returns the chain to numeric coverage rerank without moving values", () => {
    const summary = summarizePostV1WallCltLaminatedLeafRuntimeBasisGateDP();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_do_landed_no_runtime_selected_wall_clt_laminated_leaf_runtime_basis_gate_dp"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DO_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_DP_COUNTERS,
      fieldRuntimeBasis: POST_V1_GATE_DP_FIELD_RUNTIME_BASIS,
      labRuntimeBasis: POST_V1_GATE_DP_LAB_RUNTIME_BASIS,
      landedGate: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_LANDED_GATE,
      negativeBoundaries: POST_V1_GATE_DP_NEGATIVE_BOUNDARIES,
      noNumericValueMovement: true,
      selectedCandidateId: POST_V1_GATE_DP_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_DP_TARGET_OUTPUTS
    });
    expect(POST_V1_GATE_DP_COUNTERS).toMatchObject({
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 1,
      runtimeValuesMoved: 0
    });
  });

  it("promotes the generated CLT + gypsum lab route to the Gate H CLT family physics basis without moving pins", () => {
    const testCase = generatedCase(CLT_GENERATED_CASE_ID);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const labSnapshot = resultSnapshot(lab);
    const candidatesById = new Map(
      (lab.airborneCandidateResolution?.candidates ?? []).map((candidate: { id: string }) => [candidate.id, candidate])
    );

    expect(labSnapshot).toMatchObject({
      c: -1.1,
      ctr: -7.1,
      dynamicFamily: "laminated_single_leaf",
      rw: 42,
      rwDb: 42,
      stc: 43,
      supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedTargetOutputs: []
    });
    expect(lab.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "laminated_single_leaf",
      originalSolidLayerCount: 3,
      selectedMethod: "sharp",
      strategy: "laminated_leaf_sharp_delegate",
      supportLayerCount: 0,
      totalGapThicknessMm: 0,
      visibleLeafCount: 1
    });
    expect(lab.airborneBasis).toMatchObject({
      calculationStandard: "engine_mass_law",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 6,
      family: "laminated_single_leaf",
      kind: "airborne_physics_prediction",
      method: GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(lab.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "materialClass:mass_timber",
        "leafGrouping=single_leaf_or_laminated_single_leaf",
        "visibleLeafCount=1",
        "cavityCount=0",
        "supportLayerCount=0",
        "densityKgM3",
        "surfaceMassKgM2",
        "thicknessMm",
        "selectedDelegateCurve:sharp_single_leaf_panel_coincidence_delegate",
        "GateYCtrSpectrumAdapter:ISO717-1 traffic spectrum term from calculated TL curve",
        "ISO717-1 rating adapter",
        "ASTM E413 STC adapter boundary"
      ])
    );
    expect(lab.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        "Gate Y promotes the calculated ISO 717-1 Ctr spectrum-adaptation term for CLT / mass-timber only when the Gate H lab family-physics curve is already complete"
      ])
    );
    expect(lab.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction",
      selectedBasis: {
        kind: "airborne_physics_prediction",
        origin: "family_physics_prediction",
        toleranceClass: "uncalibrated_prediction"
      }
    });
    expect(candidatesById.get(GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID)).toMatchObject({
      origin: "family_physics_prediction",
      selected: true
    });
  });

  it("keeps generated CLT field outputs on Gate I over the Gate H CLT base instead of aliasing lab metrics", () => {
    const testCase = generatedCase(CLT_GENERATED_CASE_ID);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const fieldSnapshot = resultSnapshot(field);

    expect(fieldSnapshot).toMatchObject({
      c: -1.8,
      ctr: -7.6,
      dnTA: 40.7,
      dnTw: 42,
      dnW: 41,
      dynamicFamily: "laminated_single_leaf",
      rwPrimeDb: 41,
      supportedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      unsupportedTargetOutputs: []
    });
    expect(field.airborneBasis).toMatchObject({
      calculationStandard: "ISO 12354-1",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 8,
      family: "laminated_single_leaf",
      kind: "airborne_physics_prediction",
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(field.airborneBasis?.method).not.toBe(GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD);
    expect(field.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        `base lab-family method remains ${GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD}`
      ])
    );
    expect(field.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining([
        "materialClass:mass_timber",
        "leafGrouping=single_leaf_or_laminated_single_leaf",
        "fieldContext.contextMode:field_between_rooms",
        "fieldContext.partitionAreaM2_or_panelWidthHeight",
        "fieldContext.receivingRoomVolumeM3",
        "fieldContext.receivingRoomRt60S",
        "fieldMetricAdapter:R'w/DnT,w"
      ])
    );
    expect(field.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
  });

  it("keeps single-panel CLT live and non-CLT laminated, double-leaf, framed, and multicavity boundaries outside DP", () => {
    const singleClt = calculateAssembly(SINGLE_CLT_PANEL, {
      airborneContext: { airtightness: "good", contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "C"]
    });
    const ordinaryGypsum = calculateAssembly(ORDINARY_GYPSUM_LAMINATED_LEAF, {
      airborneContext: { airtightness: "good", contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "C"]
    });
    const plywood = calculateAssembly(PLYWOOD_LAMINATED_LEAF, {
      airborneContext: { airtightness: "good", contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "C"]
    });
    const doubleLeafClt = calculateAssembly(DOUBLE_LEAF_CLT, {
      airborneContext: { airtightness: "good", contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: ["Rw", "STC", "C", "Ctr"]
    });
    const timberStud = calculateAssembly(generatedCase("wall-timber-stud").rows, generatedCase("wall-timber-stud").labOptions);
    const lsf = calculateAssembly(generatedCase("wall-lsf-knauf").rows, generatedCase("wall-lsf-knauf").labOptions);
    const heavy = calculateAssembly(generatedCase("wall-screening-concrete").rows, generatedCase("wall-screening-concrete").labOptions);
    const heldAac = calculateAssembly(generatedCase("wall-held-aac").rows, {
      ...generatedCase("wall-held-aac").fieldOptions,
      targetOutputs: ["Rw", "R'w", "DnT,w"]
    });

    expect(singleClt.dynamicAirborneTrace?.detectedFamily).toBe("single_leaf_panel");
    expect(singleClt.airborneBasis).toMatchObject({
      family: "single_leaf_panel",
      method: GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });

    for (const result of [ordinaryGypsum, plywood, doubleLeafClt, timberStud, lsf, heavy]) {
      expect(result.airborneBasis?.method).not.toBe(GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD);
      expect(result.airborneCandidateResolution?.selectedCandidateId).not.toBe(
        GATE_H_CLT_MASS_TIMBER_WALL_SELECTED_CANDIDATE_ID
      );
    }

    expect(heldAac.airborneBasis).toMatchObject({ origin: "needs_input" });
    expect(POST_V1_GATE_DP_NEGATIVE_BOUNDARIES.map((boundary) => boundary.boundaryId)).toEqual([
      "direct_value_retune",
      "exact_or_floor_source_promotion",
      "stc_fstc_astc_context_alias",
      "field_or_building_metric_alias",
      "ordinary_laminated_leaf_or_nlt",
      "double_leaf_or_grouped_multicavity"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate DP closeout and Gate DQ selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD);
      expect(contents, path).toContain(GATE_H_CLT_MASS_TIMBER_WALL_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain("runtimeValuesMoved 0");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp.ts")))
      .toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp-contract.test.ts");
  });
});

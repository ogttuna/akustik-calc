import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import {
  LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
  LIGHTWEIGHT_CONCRETE_FAMILY_REQUIRED_FIELDS,
  LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID
} from "./lightweight-concrete-family-runtime-constants";
import {
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_LANDED_GATE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTION_STATUS,
  POST_V1_GATE_DA_LIGHTWEIGHT_DELTA_LW_CONTRACT_CANDIDATE_ID,
  POST_V1_GATE_DA_LOW_DENSITY_COMPLETE_DYNAMIC_INPUT,
  POST_V1_GATE_DA_REUSED_LIGHTWEIGHT_FAMILY_REQUIRED_FIELDS,
  POST_V1_GATE_DA_TARGET_OUTPUTS,
  summarizePostV1FloorLightweightConcreteDeltaLwOwnerContractGateDA
} from "./post-v1-floor-lightweight-concrete-delta-lw-owner-contract-gate-da";
import {
  POST_V1_GATE_CZ_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-cz";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LIGHTWEIGHT_VISIBLE_LAYERS = [
  { materialId: "ceramic_tile", thicknessMm: 8, floorRole: "floor_covering" },
  { materialId: "screed", thicknessMm: 50, floorRole: "floating_screed" },
  { materialId: "generic_resilient_underlay", thicknessMm: 8, floorRole: "resilient_layer" },
  { materialId: "lightweight_concrete", thicknessMm: 150, floorRole: "base_structure" }
] as const satisfies readonly LayerInput[];

const LIGHTWEIGHT_LAB_OUTPUTS = [
  "Rw",
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor lightweight-concrete DeltaLw owner contract Gate DA", () => {
  it("lands after Gate CZ and selects the lightweight-concrete DeltaLw runtime corridor Gate DB", () => {
    const summary = summarizePostV1FloorLightweightConcreteDeltaLwOwnerContractGateDA();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_cz_landed_no_runtime_selected_floor_lightweight_concrete_delta_lw_owner_contract_gate_da"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-owner-contract-gate-da-contract.test.ts"
    );
    expect(summary).toMatchObject({
      candidateId: POST_V1_GATE_DA_LIGHTWEIGHT_DELTA_LW_CONTRACT_CANDIDATE_ID,
      existingFamilyCandidateId: LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID,
      existingFamilyRuntimeBasisId: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
      landedGate: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_LANDED_GATE,
      noNewCalculableRuntimeValues: true,
      previousGateCZ: {
        selectedCandidateId: POST_V1_GATE_CZ_SELECTED_CANDIDATE_ID,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CZ_SELECTION_STATUS
      },
      selectedNextAction:
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTION_STATUS,
      sourceRowsAreAnchorsNotProduct: true,
      targetOutputs: POST_V1_GATE_DA_TARGET_OUTPUTS
    });
  });

  it("pins the family-specific DeltaLw owner fields and forbidden formula borrowing", () => {
    const summary = summarizePostV1FloorLightweightConcreteDeltaLwOwnerContractGateDA();

    expect(POST_V1_GATE_DA_REUSED_LIGHTWEIGHT_FAMILY_REQUIRED_FIELDS).toEqual(
      LIGHTWEIGHT_CONCRETE_FAMILY_REQUIRED_FIELDS
    );
    expect(summary.physicalOwnerFields.map((field) => field.fieldId)).toEqual([
      "baseSlabThicknessMm",
      "baseSlabDensityKgM3_or_lightweightConcreteMaterialClass",
      "upperTreatmentState",
      "floorCoveringOrWalkingSurface",
      "resilientLayerOrToppingState",
      "resilientLayerDynamicStiffnessMNm3_or_productCurve",
      "loadBasisKgM2",
      "elementLabMetricBasis"
    ]);
    expect(summary.physicalOwnerFields.every((field) => field.defaultPolicy === "no_default")).toBe(true);
    expect(summary.physicalOwnerFields.every((field) => field.missingBehavior === "needs_input")).toBe(true);
    expect(summary.physicalOwnerFields.every((field) => field.runtimeDefaultAllowed === false)).toBe(true);
    expect(summary.forbiddenFormulaBorrowing).toEqual([
      "heavy_concrete_annex_c_delta_lw",
      "composite_panel_bare_minus_treated_delta_lw",
      "timber_clt_delta_lw",
      "steel_mass_spring_delta_lw"
    ]);
    expect(summary.runtimeBoundaryCorrections).toEqual({
      falseHeavyConcreteDeltaLwPublicationsPrevented: 1,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeCorrectedRequestShapes: 1
    });
  });

  it("keeps visible lightweight-concrete stacks on Rw and Ln,w and observes the Gate DB DeltaLw runtime corridor", () => {
    const result = calculateAssembly(LIGHTWEIGHT_VISIBLE_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: {
        loadBasisKgM2: 70,
        resilientLayerDynamicStiffnessMNm3: 25
      },
      targetOutputs: LIGHTWEIGHT_LAB_OUTPUTS
    });

    expect(result.floorSystemRatings).toMatchObject({
      Rw: 53,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.impact).toMatchObject({
      DeltaLw: 24.9,
      LnW: 64.3,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.impact?.basis).not.toBe(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS);
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
      selectedCandidateId: LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Rw", "Ln,w", "DeltaLw"],
      valuePins: [
        { metric: "Rw", value: 53 },
        { metric: "Ln,w", value: 64.3 },
        { metric: "DeltaLw", value: 24.9 }
      ]
    });
  });

  it("calculates low-density predictor DeltaLw after Gate DB without borrowing the heavy-concrete Annex C basis", () => {
    const result = calculateImpactOnly([], {
      impactPredictorInput: POST_V1_GATE_DA_LOW_DENSITY_COMPLETE_DYNAMIC_INPUT,
      targetOutputs: ["Ln,w", "Rw", "DeltaLw"]
    });

    expect(result.sourceMode).toBe("predictor_input");
    expect(result.sourceLayers.at(-1)?.material.id).toBe("lightweight_concrete");
    expect(result.impact).toMatchObject({
      DeltaLw: 24.9,
      LnW: 64.3,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.impact?.basis).not.toBe(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS);
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 53,
      basis: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
    });
    expect(result.supportedTargetOutputs).toEqual(["Ln,w", "Rw", "DeltaLw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS,
      selectedCandidateId: LIGHTWEIGHT_CONCRETE_FAMILY_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Ln,w", "Rw", "DeltaLw"],
      valuePins: [
        { metric: "Rw", value: 53 },
        { metric: "Ln,w", value: 64.3 },
        { metric: "DeltaLw", value: 24.9 }
      ]
    });
  });

  it("keeps docs and the current-gate runner aligned with Gate DA closeout and Gate DB selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_LANDED_GATE
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_LIGHTWEIGHT_CONCRETE_DELTA_LW_OWNER_CONTRACT_GATE_DA_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(POST_V1_GATE_DA_LIGHTWEIGHT_DELTA_LW_CONTRACT_CANDIDATE_ID);
      expect(contents, path).toContain("heavy_concrete_annex_c_delta_lw");
      expect(contents, path).toContain("resilientLayerDynamicStiffnessMNm3_or_productCurve");
      expect(contents, path).toContain("loadBasisKgM2");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-owner-contract-gate-da.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-floor-lightweight-concrete-delta-lw-owner-contract-gate-da-contract.test.ts"
    );
  });
});

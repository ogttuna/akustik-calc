import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD
} from "./dynamic-airborne-gate-dt-masonry-exact-source-mixed-companion";
import {
  GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD
} from "./dynamic-airborne-gate-dv-lsf-exact-source-mixed-companion";
import {
  GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-dx-exact-source-family-field-context";
import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_GATE_DW_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-dw";
import {
  POST_V1_GATE_DX_COUNTERS,
  POST_V1_GATE_DX_NEGATIVE_BOUNDARIES,
  POST_V1_GATE_DX_RUNTIME_BASIS,
  POST_V1_GATE_DX_RUNTIME_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DX_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DX_TARGET_OUTPUTS,
  POST_V1_GATE_DX_VALUE_PINS,
  POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_LANDED_GATE,
  POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_ACTION,
  POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_FILE,
  POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_LABEL,
  POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTION_STATUS,
  summarizePostV1WallExactSourceFieldContextBasisGateDX
} from "./post-v1-wall-exact-source-field-context-basis-gate-dx";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const MASONRY_GENERATED_CASE_ID = "wall-masonry-brick" as const;
const LSF_GENERATED_CASE_ID = "wall-lsf-knauf" as const;
const HELD_AAC_GENERATED_CASE_ID = "wall-held-aac" as const;
const MASONRY_FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

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

describe("post-V1 wall exact-source family field-context basis Gate DX", () => {
  it("lands after Gate DW and returns the chain to numeric coverage rerank", () => {
    const summary = summarizePostV1WallExactSourceFieldContextBasisGateDX();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_dw_landed_no_runtime_selected_wall_exact_source_field_context_basis_gate_dx"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DW_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-exact-source-field-context-basis-gate-dx-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_DX_COUNTERS,
      landedGate: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_LANDED_GATE,
      negativeBoundaries: POST_V1_GATE_DX_NEGATIVE_BOUNDARIES,
      noNumericValueMovement: true,
      runtimeBasis: POST_V1_GATE_DX_RUNTIME_BASIS,
      selectedCandidateId: POST_V1_GATE_DX_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_DX_TARGET_OUTPUTS,
      valuePins: POST_V1_GATE_DX_VALUE_PINS
    });
    expect(POST_V1_GATE_DX_SELECTED_CANDIDATE_ID).toBe(POST_V1_GATE_DW_SELECTED_CANDIDATE_ID);
    expect(POST_V1_GATE_DX_RUNTIME_SELECTED_CANDIDATE_ID).toBe(
      GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
  });

  it("promotes masonry default field output basis without moving values", () => {
    const testCase = generatedCase(MASONRY_GENERATED_CASE_ID);
    const result = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const selectedCandidate = result.airborneCandidateResolution?.candidates.find(
      (candidate) => candidate.id === GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );

    expect(resultSnapshot(result)).toMatchObject({
      dnTA: 41.3,
      dnTw: 42,
      dnW: 40,
      dynamicFamily: "masonry_nonhomogeneous",
      rw: 40,
      rwDb: 40,
      rwPrimeDb: 40,
      supportedTargetOutputs: [...MASONRY_FIELD_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(result.airborneBasis).toMatchObject({
      family: "masonry_nonhomogeneous",
      kind: "airborne_physics_prediction",
      method: GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(selectedCandidate).toMatchObject({
      metricIds: [...MASONRY_FIELD_OUTPUTS],
      origin: "family_physics_prediction",
      outputIds: [...MASONRY_FIELD_OUTPUTS],
      rejectionReasons: [],
      selected: true
    });
  });

  it("promotes LSF default field output basis without moving values", () => {
    const testCase = generatedCase(LSF_GENERATED_CASE_ID);
    const result = calculateAssembly(testCase.rows, testCase.fieldOptions);

    expect(resultSnapshot(result)).toMatchObject({
      dnTA: 51.1,
      dnTw: 52,
      dnW: 51,
      dynamicFamily: "stud_wall_system",
      rw: 51,
      rwDb: 51,
      rwPrimeDb: 51,
      supportedTargetOutputs: [...MASONRY_FIELD_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(result.airborneBasis).toMatchObject({
      family: "stud_wall_system",
      kind: "airborne_physics_prediction",
      method: GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
  });

  it("keeps explicit lab-anchor field deltas above Gate DX", () => {
    for (const id of [MASONRY_GENERATED_CASE_ID, LSF_GENERATED_CASE_ID]) {
      const testCase = generatedCase(id);
      const result = calculateAssembly(testCase.rows, {
        ...testCase.fieldOptions,
        airborneContext: {
          ...testCase.fieldOptions.airborneContext,
          airtightness: "good"
        }
      });

      expect(result.airborneBasis).toMatchObject({
        method: "exact_subassembly_source_plus_calculated_delta",
        origin: "measured_exact_subassembly_plus_calculated_delta"
      });
      expect(result.airborneCandidateResolution).toMatchObject({
        runtimeValueMovement: true,
        selectedCandidateId: "candidate_dynamic_exact_subassembly_plus_calculated_delta",
        selectedOrigin: "measured_exact_subassembly_plus_calculated_delta"
      });
    }
  });

  it("keeps masonry and LSF lab mixed companions on Gates DT/DV instead of field aliasing", () => {
    const masonry = calculateAssembly(generatedCase(MASONRY_GENERATED_CASE_ID).rows, generatedCase(MASONRY_GENERATED_CASE_ID).labOptions);
    const lsf = calculateAssembly(generatedCase(LSF_GENERATED_CASE_ID).rows, generatedCase(LSF_GENERATED_CASE_ID).labOptions);

    expect(resultSnapshot(masonry)).toMatchObject({
      supportedTargetOutputs: [...LAB_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(masonry.airborneBasis).toMatchObject({
      method: GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(resultSnapshot(lsf)).toMatchObject({
      supportedTargetOutputs: [...LAB_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(lsf.airborneBasis).toMatchObject({
      method: GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
  });

  it("keeps missing multicavity support topology as needs_input", () => {
    const testCase = generatedCase(HELD_AAC_GENERATED_CASE_ID);
    const result = calculateAssembly(testCase.rows, testCase.fieldOptions);

    expect(resultSnapshot(result)).toMatchObject({
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: [...MASONRY_FIELD_OUTPUTS]
    });
    expect(result.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      origin: "needs_input"
    });
    expect(result.airborneBasis?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["supportTopology"])
    );
    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
  });

  it("keeps current docs and current-gate runner aligned to Gate DY after DX", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_EXACT_SOURCE_FIELD_CONTEXT_BASIS_GATE_DX_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_RUNTIME_METHOD);
      expect(contents, path).toContain("runtimeBasisPromotions: 2");
      expect(contents, path).toContain("runtimeValuesMoved: 0");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-dw-contract.test.ts");
    expect(runner).toContain("src/post-v1-wall-exact-source-field-context-basis-gate-dx-contract.test.ts");
  });
});

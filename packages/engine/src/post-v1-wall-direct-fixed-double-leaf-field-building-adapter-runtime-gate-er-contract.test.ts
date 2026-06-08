import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  POST_V1_GATE_EQ_ADAPTER_OWNER_LEDGERS,
  POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_ID,
  POST_V1_GATE_EQ_COUNTERS,
  POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_ID,
  POST_V1_GATE_EQ_SELECTED_RUNTIME_PLAN_DOC_PATH,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_LANDED_GATE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_FILE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTION_STATUS
} from "./post-v1-wall-direct-fixed-double-leaf-field-building-adapter-owner-gate-eq";
import {
  POST_V1_GATE_ER_COUNTERS,
  POST_V1_GATE_ER_PLAN_DOC_PATH,
  POST_V1_GATE_ER_RUNTIME_ASSERTIONS,
  POST_V1_GATE_ER_TARGET_OUTPUTS,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_FILE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_LABEL,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS,
  buildPostV1GateERRuntimeEvidence,
  summarizePostV1WallDirectFixedDoubleLeafFieldBuildingAdapterRuntimeGateER
} from "./post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er";

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
  POST_V1_GATE_ER_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 wall direct-fixed double-leaf field/building adapter runtime Gate ER", () => {
  it("lands after Gate EQ, moves runtime through the accepted adapters, and selects Gate ES", () => {
    const summary = summarizePostV1WallDirectFixedDoubleLeafFieldBuildingAdapterRuntimeGateER();

    expect(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTION_STATUS).toBe(
      "post_v1_wall_direct_fixed_double_leaf_field_building_adapter_owner_gate_eq_landed_no_runtime_selected_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er"
    );
    expect(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE
    );
    expect(POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts"
    );

    expect(summary).toMatchObject({
      counters: POST_V1_GATE_ER_COUNTERS,
      landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE,
      ownerIds: [
        POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_ID,
        POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_ID
      ],
      ownerLedgers: POST_V1_GATE_EQ_ADAPTER_OWNER_LEDGERS,
      planDocPath: POST_V1_GATE_EQ_SELECTED_RUNTIME_PLAN_DOC_PATH,
      previousGateEQ: {
        counters: POST_V1_GATE_EQ_COUNTERS,
        landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_LANDED_GATE,
        selectedNextAction:
          POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_ACTION,
        selectedNextFile:
          POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTION_STATUS
      },
      selectedNextAction:
        POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_LABEL,
      selectionStatus:
        POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_ER_TARGET_OUTPUTS
    });
  });

  it("routes complete direct-fixed field_between_rooms requests through Gate EO curve plus Gate I", () => {
    const evidence = buildPostV1GateERRuntimeEvidence();

    expect(evidence.fieldBasisMethod).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(evidence.fieldSelectedCandidateId).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID);
    expect(evidence.fieldRuntimeValueMovement).toBe(true);
    expect(evidence.fieldSupportedOutputs).toEqual(POST_V1_GATE_ER_TARGET_OUTPUTS);
    expect(evidence.fieldUnsupportedOutputs).toEqual([]);
    expect(evidence.fieldMetrics).toEqual(POST_V1_GATE_ER_RUNTIME_ASSERTIONS.fieldExpectedMetrics);
    expect(evidence.fieldBasisMethod).not.toBe("screening_mass_law_curve_seed_v3");
  });

  it("routes complete direct-fixed building_prediction requests through Gate EO curve plus Gate AR", () => {
    const evidence = buildPostV1GateERRuntimeEvidence();

    expect(evidence.buildingBasisMethod).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(evidence.buildingSelectedCandidateId).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID);
    expect(evidence.buildingRuntimeValueMovement).toBe(true);
    expect(evidence.buildingSupportedOutputs).toEqual(POST_V1_GATE_ER_TARGET_OUTPUTS);
    expect(evidence.buildingUnsupportedOutputs).toEqual([]);
    expect(evidence.buildingMetrics).toEqual(POST_V1_GATE_ER_RUNTIME_ASSERTIONS.buildingExpectedMetrics);
    expect(evidence.buildingBasisMethod).not.toBe(
      "dynamic_calculator_building_prediction_runtime_adapter_owner_missing"
    );
  });

  it("preserves lab and missing-input boundaries around the new field/building runtime", () => {
    const evidence = buildPostV1GateERRuntimeEvidence();

    expect(evidence.labBasisMethod).toBe(GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD);
    expect(evidence.labSelectedCandidateId).toBe(GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID);
    expect(evidence.labMetrics).toEqual(POST_V1_GATE_ER_RUNTIME_ASSERTIONS.labExpectedMetrics);

    expect(evidence.missingFieldRt60BasisMethod).toBe(
      "dynamic_calculator_route_input_contract_missing_physical_fields"
    );
    expect(evidence.missingFieldRt60MissingPhysicalInputs).toEqual(["receivingRoomRt60S"]);
    expect(evidence.missingFieldRt60SelectedCandidateId).toBe(
      POST_V1_GATE_ER_RUNTIME_ASSERTIONS.missingFieldRt60ExpectedCandidateId
    );

    expect(evidence.missingSupportSpacingBasisMethod).toBe(
      "dynamic_calculator_route_input_contract_missing_physical_fields"
    );
    expect(evidence.missingSupportSpacingMissingPhysicalInputs).toEqual(["supportSpacingMm"]);
    expect(evidence.missingSupportSpacingSelectedCandidateId).toBe(
      POST_V1_GATE_ER_RUNTIME_ASSERTIONS.missingSupportSpacingExpectedCandidateId
    );
  });

  it("keeps Gate ER counters honest about calculator scope/accuracy rather than source crawling or frontend work", () => {
    expect(POST_V1_GATE_ER_COUNTERS).toMatchObject({
      fieldBuildingRequestShapesWidened: 3,
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 1,
      newCalculableRequestShapes: 3,
      runtimeBasisPromotions: 2,
      runtimeCorrectedLayerTemplates: 1,
      runtimeCorrectedRequestShapes: 3,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 6,
      sourceRowsImported: 0
    });
  });

  it("keeps docs and current-gate runner aligned with Gate ER closeout and Gate ES selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(
        POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
      expect(contents, path).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
      expect(normalizedWhitespaceContent, path).toContain("direct-fixed double-leaf field/building adapter runtime");
      expect(contents, path).toContain("runtimeValuesMoved 6");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts"
    );
  });
});

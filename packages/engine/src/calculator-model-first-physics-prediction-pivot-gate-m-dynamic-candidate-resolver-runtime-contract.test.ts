import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE,
  type AirborneCandidate,
  type AirborneContext,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGateMDynamicCandidateResolverRuntimeScenarioPack,
  inferDynamicCalculatorRuntimeRoute
} from "./dynamic-calculator-candidate-resolver-runtime";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_M = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_m_populate_dynamic_candidate_resolver_runtime_for_dynamic_calculator",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: true,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts",
  selectionStatus:
    "gate_m_dynamic_candidate_resolver_runtime_landed_no_value_selected_family_solver_upgrade_gate_n",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_M_SURFACES = [
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_M_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_M_HANDOFF.md"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const GROUPED_SPLIT_ROCKWOOL_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const GROUPED_SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_plaster", thicknessMm: 3 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 2 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 80 },
  { materialId: "air_gap", thicknessMm: 20 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 30 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 80 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 2 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 3 }
] as const;

const FLOATING_HEAVY_FLOOR_STACK: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function numericRejectedCodes(candidates: readonly AirborneCandidate[]): string[] {
  return candidates
    .filter(
      (candidate) =>
        !candidate.selected &&
        !["needs_input", "unsupported"].includes(candidate.origin)
    )
    .flatMap((candidate) => candidate.rejectionReasons.map((reason) => reason.code));
}

describe("calculator model-first physics prediction pivot Gate M", () => {
  it("lands the Dynamic Calculator candidate resolver runtime surface and selects Gate N", () => {
    expect(MODEL_FIRST_GATE_M).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_m_populate_dynamic_candidate_resolver_runtime_for_dynamic_calculator",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: true,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts",
      selectionStatus:
        "gate_m_dynamic_candidate_resolver_runtime_landed_no_value_selected_family_solver_upgrade_gate_n",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_M_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps all candidate origins live while selecting exact, physics, needs-input, and unsupported lanes correctly", () => {
    const pack = buildGateMDynamicCandidateResolverRuntimeScenarioPack();

    expect(pack).toHaveLength(5);
    expect(pack.map((entry) => entry.resolution.selectedOrigin)).toEqual([
      "measured_exact_full_stack",
      "family_physics_prediction",
      "needs_input",
      "needs_input",
      "unsupported"
    ]);
    expect(
      pack.every(
        (entry) =>
          entry.resolution.candidates.map((candidate) => candidate.origin).join("|") ===
          AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE.join("|")
      )
    ).toBe(true);

    const sourceAbsentFamily = pack[1]?.resolution;
    expect(sourceAbsentFamily?.selectedCandidateId).toBe(
      "candidate_grouped_rockwool_family_physics_prediction"
    );
    expect(
      sourceAbsentFamily?.candidates
        .filter((candidate) =>
          [
            "candidate_blocked_rockwool_exact_source",
            "candidate_dynamic_exact_subassembly_plus_calculated_delta",
            "candidate_calibrated_triple_leaf_family"
          ].includes(candidate.id)
        )
        .flatMap((candidate) => candidate.rejectionReasons.map((reason) => reason.code))
    ).toEqual(["missing_source_evidence", "missing_source_evidence", "missing_source_evidence"]);

    const aconNeedsInput = pack[2];
    expect(aconNeedsInput?.resolution.selectedCandidateId).toBe("candidate_dynamic_needs_input");
    expect(aconNeedsInput?.routeInputAssessment.missingPhysicalInputs).toEqual([
      "sideALeafGroup",
      "cavity1DepthMm",
      "internalLeafGroup",
      "internalLeafCoupling",
      "cavity2DepthMm",
      "sideBLeafGroup",
      "supportTopology"
    ]);
    expect(numericRejectedCodes(aconNeedsInput?.resolution.candidates ?? [])).toEqual([
      "missing_physical_input",
      "missing_physical_input",
      "missing_physical_input",
      "missing_physical_input",
      "missing_physical_input",
      "missing_physical_input"
    ]);

    const fieldNeedsInput = pack[3];
    expect(fieldNeedsInput?.routeInputAssessment.outputBasis).toBe("field_apparent");
    expect(fieldNeedsInput?.routeInputAssessment.missingPhysicalInputs).toEqual([
      "sideALeafGroup",
      "cavity1DepthMm",
      "internalLeafGroup",
      "internalLeafCoupling",
      "cavity2DepthMm",
      "sideBLeafGroup",
      "supportTopology",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);

    const unsupportedFloor = pack[4];
    expect(unsupportedFloor?.resolution.selectedOrigin).toBe("unsupported");
    expect(unsupportedFloor?.routeInputAssessment.unsupportedOutputs).toEqual(["IIC", "AIIC"]);
    expect(numericRejectedCodes(unsupportedFloor?.resolution.candidates ?? [])).toEqual([
      "unsupported_route",
      "unsupported_route",
      "unsupported_route",
      "unsupported_route",
      "unsupported_route",
      "unsupported_route"
    ]);
  });

  it("populates the grouped Rockwool runtime resolver without moving existing values", () => {
    const result = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: 0.8,
      estimatedCtrDb: -7.3,
      estimatedRwDb: 50,
      estimatedStc: 55
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      policyId: "model_first_airborne_candidate_precedence_v1",
      runtimeValueMovement: true,
      selectedCandidateId: "candidate_grouped_rockwool_family_physics_prediction",
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.airborneCandidateResolution?.candidates.map((candidate: AirborneCandidate) => candidate.origin)).toEqual([
      ...AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE
    ]);
    expect(result.airborneCandidateResolution?.selectedBasis).toMatchObject({
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneCandidateSet).toHaveLength(8);
  });

  it("turns ACON-like flat-list multi-cavity runtime into needs_input instead of a fake design-grade answer", () => {
    const result = calculateAssembly(ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(result.metrics.estimatedRwDb).toBe(40);
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.airborneBasis).toMatchObject({
      missingPhysicalInputs: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "internalLeafGroup",
        "internalLeafCoupling",
        "cavity2DepthMm",
        "sideBLeafGroup",
        "supportTopology"
      ],
      origin: "needs_input"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(numericRejectedCodes(result.airborneCandidateResolution?.candidates ?? [])).toEqual([
      "missing_physical_input",
      "missing_physical_input",
      "missing_physical_input",
      "missing_physical_input",
      "missing_physical_input",
      "missing_physical_input"
    ]);
  });

  it("keeps route inference and field/building basis separation explicit", () => {
    const fieldMissing = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: { contextMode: "field_between_rooms" },
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"]
    });

    expect(inferDynamicCalculatorRuntimeRoute({
      layers: ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK,
      targetOutputs: WALL_LAB_OUTPUTS
    })).toBe("wall");
    expect(inferDynamicCalculatorRuntimeRoute({
      layers: FLOATING_HEAVY_FLOOR_STACK,
      targetOutputs: ["Rw", "Ln,w"]
    })).toBe("floor");
    expect(fieldMissing.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(fieldMissing.airborneBasis?.missingPhysicalInputs).toEqual([
      "sideALeafGroup",
      "cavity1DepthMm",
      "internalLeafGroup",
      "internalLeafCoupling",
      "cavity2DepthMm",
      "sideBLeafGroup",
      "supportTopology",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);
  });

  it("keeps docs and current-gate runner aligned with Gate M closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_m_dynamic_candidate_resolver_runtime_landed_no_value_selected_family_solver_upgrade_gate_n"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts"
    );
  });
});

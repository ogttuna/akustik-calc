import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGateRDoubleLeafFramedBridgeScenarioPack,
  buildGateRDoubleLeafFramedBridgeSolverContract,
  calculateGateRMassAirMassResonanceHz
} from "./dynamic-calculator-double-leaf-framed-bridge-solver-contract";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_R = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate:
    "gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts",
  selectionStatus:
    "gate_r_double_leaf_framed_bridge_solver_contract_landed_no_runtime_selected_runtime_promotion_gate_s",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_R_SURFACES = [
  "packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts",
  "packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-input-contract.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts",
  "packages/engine/src/index.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_R_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_R_HANDOFF.md"
] as const;

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const DOUBLE_LEAF_ABSORBED_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const DIRECT_FIXED_EMPTY_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 45 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const DOUBLE_LEAF_COMPLETE_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const RESILIENT_COMPLETE_CONTEXT: AirborneContext = {
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  resilientBarSideCount: "both_sides",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 75,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "resilient_channel",
    topologyMode: "double_leaf_framed"
  }
};

const RESILIENT_MISSING_SIDE_COUNT_CONTEXT: AirborneContext = {
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 75,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "resilient_channel",
    topologyMode: "double_leaf_framed"
  }
};

const DIRECT_FIXED_CONTEXT: AirborneContext = {
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: {
    cavity1AbsorptionClass: "none",
    cavity1DepthMm: 45,
    cavity1FillCoverage: "empty",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
};

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

const GROUPED_SPLIT_ROCKWOOL_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab",
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator model-first physics prediction pivot Gate R", () => {
  it("lands the double-leaf/framed bridge solver-candidate contract and selects Gate S", () => {
    expect(MODEL_FIRST_GATE_R).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate:
        "gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts",
      selectionStatus:
        "gate_r_double_leaf_framed_bridge_solver_contract_landed_no_runtime_selected_runtime_promotion_gate_s",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_R_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines source-independent equation owners before any runtime promotion", () => {
    const contract = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: DOUBLE_LEAF_COMPLETE_CONTEXT,
      layers: DOUBLE_LEAF_ABSORBED_STACK,
      targetOutputs: WALL_OUTPUTS
    });

    expect(contract.readinessStatus).toBe("solver_candidate_ready");
    expect(contract.runtimePromotionAllowed).toBe(false);
    expect(contract.runtimeValueMovement).toBe(false);
    expect(contract.sourceRowsRequiredForSolverCandidate).toBe(false);
    expect(contract.solverMethodId).toBe(
      "gate_r_double_leaf_framed_bridge_mass_air_mass_bridge_damping_candidate"
    );
    expect(contract.equationOwners.map((owner) => owner.id)).toEqual([
      "surface_mass_partition_owner",
      "mass_air_mass_resonance_owner",
      "bridge_coupling_owner",
      "porous_cavity_damping_owner",
      "iso_717_1_rw_rating_adapter_owner",
      "stc_rating_adapter_boundary_owner"
    ]);
    expect(contract.equationOwners.find((owner) => owner.id === "mass_air_mass_resonance_owner")).toMatchObject({
      formula:
        "f0_hz = sqrt((rho0 * c^2 / cavity_depth_m) * (1 / m1 + 1 / m2)) / (2 * pi)",
      ownerStatus: "contracted_no_runtime",
      runtimePromotionRequired: true
    });
    expect(contract.equationOwners.find((owner) => owner.id === "stc_rating_adapter_boundary_owner")?.formula).toContain(
      "STC is not aliased to Rw"
    );
  });

  it("builds an uncalibrated family-physics basis and benchmark corridor for explicit absorbed independent frames", () => {
    const contract = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: DOUBLE_LEAF_COMPLETE_CONTEXT,
      layers: DOUBLE_LEAF_ABSORBED_STACK,
      targetOutputs: WALL_OUTPUTS
    });

    expect(contract.bridgeClass).toBe("independent_frame");
    expect(contract.candidateFamily).toBe("double_stud_system");
    expect(contract.physicalInputs).toEqual({
      absorberCoverageRatio: null,
      bridgeClass: "independent_frame",
      cavityDepthMm: 90,
      flowResistivityPaSM2: 15000,
      flowResistivitySource: "engineering_default",
      leafMassRatio: 1,
      sideALeafMassKgM2: 10.6,
      sideBLeafMassKgM2: 10.6,
      supportSpacingMm: 600
    });
    expect(calculateGateRMassAirMassResonanceHz({
      cavityDepthMm: 90,
      sideALeafMassKgM2: 10.6,
      sideBLeafMassKgM2: 10.6
    })).toBeCloseTo(86.6, 1);
    expect(contract.benchmarkRange).toEqual({
      bridgeCouplingDeltaDb: 4,
      dampingCreditDb: 3,
      estimatedRwDb: {
        center: 45,
        max: 52,
        min: 38
      },
      estimatedStcDb: {
        adapterBoundary: "not_alias",
        max: 53,
        min: 37
      },
      massAirMassResonanceHz: 86.6,
      toleranceDb: 7
    });
    expect(contract.candidateBasis).toMatchObject({
      calculationStandard: "engine_double_leaf_cavity",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 7,
      family: "double_stud_system",
      kind: "airborne_physics_prediction",
      method: "gate_r_double_leaf_framed_bridge_mass_air_mass_bridge_damping_candidate",
      missingPhysicalInputs: [],
      missingSourceEvidence: ["exact_full_stack_source_absent"],
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(contract.candidateBasis?.propertyDefaults).toEqual([
      expect.objectContaining({
        field: "porousFill.flowResistivityPaSM2",
        source: "engineering_default",
        unit: "Pa*s/m2"
      })
    ]);
    expect(contract.requiredRuntimeParityBeforePromotion).toEqual([
      "route card selected candidate and value parity",
      "visible output card origin/basis/tolerance parity",
      "proposal PDF snapshot origin/basis/tolerance parity",
      "proposal DOCX snapshot origin/basis/tolerance parity",
      "nearby negative boundaries for direct-fixed, missing side count, and multi-cavity flat-list cases"
    ]);
  });

  it("keeps resilient bridge side-count and direct-fixed boundaries explicit", () => {
    const resilientReady = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: RESILIENT_COMPLETE_CONTEXT,
      layers: DOUBLE_LEAF_ABSORBED_STACK,
      targetOutputs: WALL_OUTPUTS
    });
    const resilientMissing = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: RESILIENT_MISSING_SIDE_COUNT_CONTEXT,
      layers: DOUBLE_LEAF_ABSORBED_STACK,
      targetOutputs: WALL_OUTPUTS
    });
    const directFixed = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: DIRECT_FIXED_CONTEXT,
      layers: DIRECT_FIXED_EMPTY_STACK,
      targetOutputs: WALL_OUTPUTS
    });

    expect(resilientReady).toMatchObject({
      bridgeClass: "resilient_bridge",
      candidateFamily: "stud_wall_system",
      readinessStatus: "solver_candidate_ready",
      runtimePromotionAllowed: false
    });
    expect(resilientReady.benchmarkRange).toMatchObject({
      bridgeCouplingDeltaDb: 5.5,
      dampingCreditDb: 3,
      estimatedRwDb: {
        center: 46,
        max: 54,
        min: 38
      },
      toleranceDb: 8
    });

    expect(resilientMissing.readinessStatus).toBe("needs_input");
    expect(resilientMissing.missingPhysicalInputs).toEqual(["resilientBarSideCount"]);
    expect(resilientMissing.candidateBasis).toBeNull();
    expect(resilientMissing.benchmarkRange).toBeNull();

    expect(directFixed.readinessStatus).toBe("negative_boundary");
    expect(directFixed.bridgeClass).toBe("direct_fixed_bridge");
    expect(directFixed.candidateBasis).toBeNull();
    expect(directFixed.negativeBoundaryReasons).toEqual([
      "direct_fixed_bridge_behaves_like_mechanically_coupled_single_partition_until_a_dedicated_bridge_loss_model_is_owned"
    ]);
  });

  it("ships a benchmark pack with positive, needs-input, and nearby-negative solver boundaries", () => {
    const pack = buildGateRDoubleLeafFramedBridgeScenarioPack();

    expect(pack.map((entry) => entry.id)).toEqual([
      "gate_r_independent_absorbed_cavity_solver_candidate_ready",
      "gate_r_resilient_bridge_both_sides_solver_candidate_ready",
      "gate_r_resilient_bridge_missing_side_count_needs_input",
      "gate_r_direct_fixed_bridge_negative_boundary",
      "gate_r_multicavity_flat_list_rejected_family_boundary"
    ]);
    expect(pack.map((entry) => entry.contract.readinessStatus)).toEqual([
      "solver_candidate_ready",
      "solver_candidate_ready",
      "needs_input",
      "negative_boundary",
      "family_boundary_rejected"
    ]);
    expect(pack.every((entry) => entry.includedInRuntimePromotion === false)).toBe(true);
    expect(pack.every((entry) => entry.contract.runtimePromotionAllowed === false)).toBe(true);
    expect(pack[4]?.contract.negativeBoundaryReasons).toEqual([
      "gate_r_rejects_non_explicit_double_leaf_framed_topology_before_solver_candidate"
    ]);
  });

  it("keeps Gate O/G runtime pins unchanged while Gate R remains no-runtime", () => {
    const groupedRockwool = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const singleGypsum = calculateAssembly([{ materialId: "gypsum_board", thicknessMm: 12.5 }], {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const flatList = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: { contextMode: "element_lab" },
      layers: ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK,
      targetOutputs: WALL_OUTPUTS
    });

    expect(groupedRockwool.metrics).toMatchObject({ estimatedRwDb: 53, estimatedStc: 64 });
    expect(groupedRockwool.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedOrigin: "family_physics_prediction"
    });

    expect(singleGypsum.metrics).toMatchObject({ estimatedRwDb: 31, estimatedStc: 31 });
    expect(singleGypsum.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "family_physics_prediction"
    });

    expect(flatList.readinessStatus).toBe("family_boundary_rejected");
    expect(flatList.candidateBasis).toBeNull();
  });

  it("keeps docs and current-gate runner aligned with Gate R closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_r_double_leaf_framed_bridge_solver_contract_landed_no_runtime_selected_runtime_promotion_gate_s"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts"
    );
  });
});

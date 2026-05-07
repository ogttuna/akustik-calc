import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneCandidate, AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  buildDynamicAirborneDelegateInventory,
  buildGateJMethodSelectionResolution,
  GATE_J_PERSONAL_USE_READINESS_SCENARIOS,
  summarizeGateJPersonalUseReadinessScenarioPack
} from "./airborne-personal-use-readiness-scenario-pack";
import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_J = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_j_build_personal_use_readiness_scenario_pack",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_k_define_route_input_topology_contracts_for_dynamic_calculator",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-k-route-input-topology-contract.test.ts",
  selectionStatus:
    "gate_j_personal_use_readiness_scenario_pack_landed_no_runtime_selected_route_input_topology_gate_k",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_J_SURFACES = [
  "packages/engine/src/airborne-personal-use-readiness-scenario-pack.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-j-personal-use-readiness-scenario-pack-contract.test.ts",
  "packages/engine/src/airborne-calculator.ts",
  "packages/engine/src/dynamic-airborne.ts",
  "packages/engine/src/dynamic-airborne-gate-g-rockwool.ts",
  "packages/shared/src/domain/airborne-basis.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_J_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_J_HANDOFF.md"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FLOOR_PERSONAL_USE_OUTPUTS = [
  "Rw",
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

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

describe("calculator model-first physics prediction pivot Gate J", () => {
  it("lands the personal-use scenario pack and selects route/input topology Gate K", () => {
    expect(MODEL_FIRST_GATE_J).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_j_build_personal_use_readiness_scenario_pack",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_k_define_route_input_topology_contracts_for_dynamic_calculator",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-k-route-input-topology-contract.test.ts",
      selectionStatus:
        "gate_j_personal_use_readiness_scenario_pack_landed_no_runtime_selected_route_input_topology_gate_k",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_J_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("covers wall/floor routes, every method-selection posture, and every report-visible surface", () => {
    const summary = summarizeGateJPersonalUseReadinessScenarioPack();

    expect(summary.runtimeValueMovement).toBe(false);
    expect(summary.sourceCatalogQueueOnlyCount).toBe(0);
    expect(summary.routeCoverage).toEqual(["wall", "floor"]);
    expect(summary.surfaceCoverage).toEqual(["engine", "visible_card", "saved_replay", "pdf_report", "docx_report"]);
    expect(summary.originCoverage).toEqual([
      "measured_exact_full_stack",
      "measured_exact_subassembly_plus_calculated_delta",
      "calibrated_family_physics",
      "family_physics_prediction",
      "screening_fallback",
      "needs_input",
      "bounded_prediction",
      "unsupported"
    ]);
    expect(summary.missingPromptScenarioIds).toEqual([
      "gate_j_wall_acon_like_flat_list_multicavity_screening_guard",
      "gate_j_wall_field_building_outputs_need_context_not_lab_alias",
      "gate_j_floor_floating_floor_dynamic_stiffness_needs_input"
    ]);
    expect(GATE_J_PERSONAL_USE_READINESS_SCENARIOS).toHaveLength(9);
  });

  it("records the current dynamic-airborne delegate inventory as seed engines, not complete solver coverage", () => {
    const inventory = buildDynamicAirborneDelegateInventory();

    expect(inventory.map((entry) => entry.calculatorId)).toEqual([
      "dynamic",
      "ks_rw_calibrated",
      "mass_law",
      "sharp",
      "kurtovic"
    ]);
    expect(inventory.find((entry) => entry.calculatorId === "ks_rw_calibrated")).toMatchObject({
      currentRole: "mass_curve_reference_for_owned_massive_routes",
      designGradeScope: "massive mineral elements inside owned mass/material ranges"
    });
    expect(inventory.find((entry) => entry.calculatorId === "dynamic")?.knownLimitations).toContain(
      "multileaf_multicavity can still be a screening blend outside the narrow grouped Rockwool Gate G target"
    );
    expect(inventory.find((entry) => entry.calculatorId === "sharp")?.knownLimitations).toContain(
      "only has a limited double-leaf gap bonus in the current local engine"
    );
  });

  it("proves source absence does not remove the source-absent family solver candidate", () => {
    const exactAvailable = buildGateJMethodSelectionResolution("exact_available");
    const sourceAbsent = buildGateJMethodSelectionResolution("source_absent_family_selected");

    expect(exactAvailable.selectedOrigin).toBe("measured_exact_full_stack");
    expect(exactAvailable.runtimeValueMovement).toBe(false);
    expect(exactAvailable.candidates.map((candidate) => candidate.origin)).toEqual([
      "measured_exact_full_stack",
      "measured_exact_subassembly_plus_calculated_delta",
      "calibrated_family_physics",
      "family_physics_prediction",
      "bounded_prediction",
      "screening_fallback",
      "needs_input",
      "unsupported"
    ]);

    expect(sourceAbsent.selectedOrigin).toBe("family_physics_prediction");
    expect(sourceAbsent.selectedCandidateId).toBe("candidate_gate_j_source_absent_family_solver");
    expect(
      sourceAbsent.candidates
        .filter((candidate: AirborneCandidate) =>
          [
            "candidate_gate_j_exact_full_stack",
            "candidate_gate_j_similar_source_anchored_delta",
            "candidate_gate_j_calibrated_family"
          ].includes(candidate.id)
        )
        .flatMap((candidate: AirborneCandidate) => candidate.rejectionReasons.map((reason) => reason.code))
    ).toEqual(["missing_source_evidence", "missing_source_evidence", "missing_source_evidence"]);
    expect(sourceAbsent.selectedBasis?.missingSourceEvidence).toEqual([]);
    expect(sourceAbsent.selectedBasis?.missingPhysicalInputs).toEqual([]);
  });

  it("pins current grouped source-absent wall prediction without changing runtime values", () => {
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
    expect(result.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "multileaf_multicavity",
      selectedMethod: "triple_leaf_two_cavity_frequency_solver",
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
    });
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 5,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneCandidateResolution?.selectedOrigin).toBe("family_physics_prediction");
    expect(result.airborneCandidateResolution?.runtimeValueMovement).toBe(true);
  });

  it("keeps the ACON-like flat-list multi-cavity case guarded instead of pretending design-grade support", () => {
    const result = calculateAssembly(ACON_LIKE_FLAT_LIST_MULTICAVITY_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(result.metrics.estimatedRwDb).toBe(40);
    expect(result.dynamicAirborneTrace).toMatchObject({
      cavityCount: 3,
      confidenceClass: "low",
      detectedFamily: "multileaf_multicavity",
      selectedMethod: "screening_mass_law_curve_seed_v3",
      strategy: "multileaf_screening_blend",
      visibleLeafCount: 4
    });
    expect(result.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.warnings.join("\n")).toContain("Triple-leaf exact calculation needs grouped wall topology");
    expect(result.warnings.join("\n")).toContain("not a premium multi-cavity solver");
  });

  it("keeps floor personal-use outputs split between current support and explicit physical-input prompts", () => {
    const result = calculateAssembly(FLOATING_HEAVY_FLOOR_STACK, {
      calculator: "dynamic",
      targetOutputs: FLOOR_PERSONAL_USE_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]);
    expect(result.impact).toBeNull();
    expect(result.airborneBasis).toMatchObject({
      missingPhysicalInputs: [
        "loadBasisKgM2",
        "contextMode",
        "partitionAreaM2",
        "receivingRoomVolumeM3",
        "receivingRoomRt60S"
      ],
      origin: "needs_input"
    });
    expect(result.warnings.join("\n")).toContain(
      "Dynamic Calculator floor-impact field runtime is waiting for loadBasisKgM2, contextMode, partitionAreaM2, receivingRoomVolumeM3, receivingRoomRt60S, impactFieldContext"
    );
  });

  it("keeps docs and current-gate runner aligned with Gate J closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_j_personal_use_readiness_scenario_pack_landed_no_runtime_selected_route_input_topology_gate_k"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-k-route-input-topology-contract.test.ts"
      );
      expect(text, path).toContain("gate_k_define_route_input_topology_contracts_for_dynamic_calculator");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-j-personal-use-readiness-scenario-pack-contract.test.ts"
    );
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AcousticInputCompletenessMatrixSchema,
  AcousticInputCompletenessSchema,
  AssemblyCalculationSchema,
  type AcousticInputCompleteness,
  type AirborneContext,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_D = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction:
    "gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts",
  selectionStatus:
    "gate_d_input_completeness_matrix_landed_no_runtime_selected_airborne_candidate_resolver_gate_e",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_D_SURFACES = [
  "packages/shared/src/domain/input-completeness.ts",
  "packages/shared/src/domain/assembly.ts",
  "packages/shared/src/index.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_D_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_D_HANDOFF.md"
] as const;

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

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const ADJACENT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

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

function inputCompletenessMatrix(): AcousticInputCompleteness[] {
  return AcousticInputCompletenessMatrixSchema.parse([
    {
      appliedDefaults: [
        {
          fieldId: "youngModulusPa",
          reason: "No modulus supplied; the single-leaf solver may continue only with a documented wider uncertainty.",
          uncertaintyEffect: "widen_error_budget"
        },
        {
          fieldId: "lossFactor",
          reason: "No loss factor supplied; the single-leaf solver may continue only with a documented wider uncertainty.",
          uncertaintyEffect: "widen_error_budget"
        }
      ],
      id: "single_leaf_airborne_minimum_inputs",
      optionalPrecisionFields: ["youngModulusPa", "lossFactor"],
      requiredFields: ["surfaceMassKgM2", "materialClass"],
      requirements: [
        {
          fieldId: "surfaceMassKgM2",
          label: "surface mass or density/thickness",
          missingBehavior: "needs_input",
          requirementType: "required_physical_input",
          targetOutputs: ["Rw", "STC", "C", "Ctr"]
        },
        {
          defaultPolicy: "documented_precision_default",
          fieldId: "lossFactor",
          label: "loss factor",
          missingBehavior: "widen_uncertainty",
          requirementType: "optional_precision_input",
          uncertaintyEffect: "widen_error_budget"
        }
      ],
      routeFamily: "single_leaf_airborne",
      status: "complete_with_defaults",
      targetOutputs: ["Rw", "STC", "C", "Ctr"]
    },
    {
      id: "double_leaf_framed_airborne_minimum_inputs",
      requiredFields: ["leafGrouping", "cavityDepthMm", "frameBridgeClass", "fillState"],
      conditionalFields: ["supportSpacingMm", "resilientBarSideCount"],
      routeFamily: "double_leaf_framed_airborne",
      status: "complete",
      targetOutputs: ["Rw", "STC", "C", "Ctr"]
    },
    {
      id: "triple_leaf_multicavity_airborne_minimum_inputs",
      requiredFields: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "internalLeafGroup",
        "internalLeafCoupling",
        "cavity2DepthMm",
        "sideBLeafGroup",
        "supportTopology"
      ],
      conditionalFields: ["cavity1FillCoverage", "cavity2FillCoverage"],
      routeFamily: "triple_leaf_multicavity_airborne",
      status: "complete",
      targetOutputs: ["Rw", "STC", "C", "Ctr"]
    },
    {
      appliedDefaults: [
        {
          fieldId: "absorberClass",
          reason: "Absorber class may use a named conservative default, but the result must carry wider uncertainty.",
          uncertaintyEffect: "widen_error_budget"
        }
      ],
      id: "porous_fill_cavity_modifier_minimum_inputs",
      optionalPrecisionFields: ["flowResistivityPaSM2", "absorberClass"],
      requiredFields: ["porousFillThicknessMm", "porousFillPlacement", "porousFillCoverage"],
      routeFamily: "porous_fill_cavity_modifier",
      status: "complete_with_defaults",
      targetOutputs: ["Rw", "STC", "C", "Ctr"]
    },
    {
      id: "floating_floor_impact_minimum_inputs",
      requiredFields: [
        "baseSlabOrFloor",
        "toppingOrFloatingLayer",
        "resilientLayerDynamicStiffnessMNm3",
        "loadBasisKgM2"
      ],
      conditionalFields: ["ceilingOrLowerAssembly"],
      routeFamily: "floating_floor_impact",
      status: "complete",
      targetOutputs: ["Ln,w", "L'n,w", "L'nT,w"]
    },
    {
      id: "field_apparent_output_context_minimum_inputs",
      requiredFields: ["contextMode", "panelWidthMm", "panelHeightMm", "receivingRoomVolumeM3"],
      conditionalFields: [
        "receivingRoomRt60S",
        "sourceRoomVolumeM3",
        "flankingJunctionClass",
        "conservativeFlankingAssumption",
        "impactFieldContext"
      ],
      routeFamily: "field_apparent_output_context",
      status: "complete",
      targetOutputs: ["R'w", "DnT,w", "Dn,w", "L'n,w", "L'nT,w"]
    }
  ]);
}

describe("calculator model-first physics prediction pivot Gate D", () => {
  it("lands input completeness no-runtime and selects airborne candidate resolver Gate E", () => {
    expect(MODEL_FIRST_GATE_D).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts",
      selectionStatus:
        "gate_d_input_completeness_matrix_landed_no_runtime_selected_airborne_candidate_resolver_gate_e",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_D_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines the required family input matrix before any resolver value movement", () => {
    const matrix = inputCompletenessMatrix();
    const byFamily = new Map(matrix.map((entry) => [entry.routeFamily, entry]));

    expect(matrix.map((entry) => entry.routeFamily)).toEqual([
      "single_leaf_airborne",
      "double_leaf_framed_airborne",
      "triple_leaf_multicavity_airborne",
      "porous_fill_cavity_modifier",
      "floating_floor_impact",
      "field_apparent_output_context"
    ]);
    expect(byFamily.get("single_leaf_airborne")?.requiredFields).toEqual([
      "surfaceMassKgM2",
      "materialClass"
    ]);
    expect(byFamily.get("double_leaf_framed_airborne")?.requiredFields).toEqual([
      "leafGrouping",
      "cavityDepthMm",
      "frameBridgeClass",
      "fillState"
    ]);
    expect(byFamily.get("triple_leaf_multicavity_airborne")?.requiredFields).toEqual([
      "sideALeafGroup",
      "cavity1DepthMm",
      "internalLeafGroup",
      "internalLeafCoupling",
      "cavity2DepthMm",
      "sideBLeafGroup",
      "supportTopology"
    ]);
    expect(byFamily.get("floating_floor_impact")?.requiredFields).toContain(
      "resilientLayerDynamicStiffnessMNm3"
    );
    expect(byFamily.get("field_apparent_output_context")?.requiredFields).toEqual([
      "contextMode",
      "panelWidthMm",
      "panelHeightMm",
      "receivingRoomVolumeM3"
    ]);
  });

  it("keeps missing physical inputs separate from missing source evidence", () => {
    const needsPhysicalInput = AcousticInputCompletenessSchema.parse({
      id: "triple_leaf_missing_grouped_topology",
      missingPhysicalInputs: ["internalLeafCoupling", "supportTopology"],
      requiredFields: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "internalLeafGroup",
        "internalLeafCoupling",
        "cavity2DepthMm",
        "sideBLeafGroup",
        "supportTopology"
      ],
      routeFamily: "triple_leaf_multicavity_airborne",
      status: "needs_input",
      targetOutputs: ["Rw", "STC"]
    });
    const sourceBlockedExactOnly = AcousticInputCompletenessSchema.parse({
      id: "rockwool_exact_source_packet_missing",
      missingSourceEvidence: ["rights_safe_source_owned_curve_payload_absent"],
      requiredFields: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "internalLeafGroup",
        "internalLeafCoupling",
        "cavity2DepthMm",
        "sideBLeafGroup",
        "supportTopology"
      ],
      routeFamily: "triple_leaf_multicavity_airborne",
      status: "source_blocked_exact_or_calibration_only",
      targetOutputs: ["Rw", "STC"]
    });
    const physicsCandidateCanStillProceed = AcousticInputCompletenessSchema.parse({
      id: "rockwool_grouped_physics_inputs_present",
      requiredFields: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "internalLeafGroup",
        "internalLeafCoupling",
        "cavity2DepthMm",
        "sideBLeafGroup",
        "supportTopology"
      ],
      routeFamily: "triple_leaf_multicavity_airborne",
      status: "complete",
      targetOutputs: ["Rw", "STC"]
    });

    expect(needsPhysicalInput.missingPhysicalInputs).toEqual(["internalLeafCoupling", "supportTopology"]);
    expect(needsPhysicalInput.missingSourceEvidence).toEqual([]);
    expect(sourceBlockedExactOnly.missingPhysicalInputs).toEqual([]);
    expect(sourceBlockedExactOnly.missingSourceEvidence).toEqual([
      "rights_safe_source_owned_curve_payload_absent"
    ]);
    expect(physicsCandidateCanStillProceed.status).toBe("complete");

    expect(() =>
      AcousticInputCompletenessSchema.parse({
        id: "bad_source_only_needs_input",
        missingSourceEvidence: ["exact_lab_row_absent"],
        requiredFields: ["leafGrouping"],
        routeFamily: "double_leaf_framed_airborne",
        status: "needs_input",
        targetOutputs: ["Rw"]
      })
    ).toThrow(/needs_input completeness must name missing physical inputs|source evidence alone/);
  });

  it("treats optional precision gaps as uncertainty widening rather than needs-input blockers", () => {
    const singleLeaf = inputCompletenessMatrix().find((entry) => entry.routeFamily === "single_leaf_airborne");

    expect(singleLeaf).toMatchObject({
      appliedDefaults: [
        {
          fieldId: "youngModulusPa",
          uncertaintyEffect: "widen_error_budget"
        },
        {
          fieldId: "lossFactor",
          uncertaintyEffect: "widen_error_budget"
        }
      ],
      missingPhysicalInputs: [],
      optionalPrecisionFields: ["youngModulusPa", "lossFactor"],
      status: "complete_with_defaults"
    });

    expect(() =>
      AcousticInputCompletenessSchema.parse({
        appliedDefaults: [
          {
            fieldId: "lossFactor",
            reason: "Bad default: loss factor was not declared optional.",
            uncertaintyEffect: "widen_error_budget"
          }
        ],
        id: "bad_undeclared_optional_default",
        requiredFields: ["surfaceMassKgM2"],
        routeFamily: "single_leaf_airborne",
        status: "complete_with_defaults",
        targetOutputs: ["Rw"]
      })
    ).toThrow(/must be declared as an optional precision input/);
  });

  it("parses optional input completeness metadata on assembly results without populating runtime yet", () => {
    const legacyResult = calculateAssembly(ADJACENT_ROCKWOOL_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const parsed = AssemblyCalculationSchema.parse({
      ...legacyResult,
      inputCompletenessSet: inputCompletenessMatrix()
    });
    const parsedInputCompletenessSet = (parsed.inputCompletenessSet ?? []) as AcousticInputCompleteness[];

    expect(parsedInputCompletenessSet).toHaveLength(6);
    expect(parsedInputCompletenessSet.map((entry) => entry.routeFamily)).toContain("triple_leaf_multicavity_airborne");
    expect(legacyResult).not.toHaveProperty("inputCompletenessSet");
  });

  it("keeps input completeness boundaries explicit after Gate G grouped Rockwool prediction movement", () => {
    const adjacent = calculateAssembly(ADJACENT_ROCKWOOL_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const grouped = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(adjacent.metrics.estimatedRwDb).toBe(51);
    expect(adjacent.metrics.estimatedStc).toBe(51);
    expect(adjacent.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
    expect(adjacent.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);

    expect(grouped.metrics.estimatedRwDb).toBe(50);
    expect(grouped.metrics.estimatedStc).toBe(55);
    expect(grouped.dynamicAirborneTrace?.detectedFamily).toBe("multileaf_multicavity");
    expect(grouped.dynamicAirborneTrace?.strategy).toBe(
      "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
    );
    expect(grouped.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
  });

  it("keeps docs and current-gate runner aligned with Gate D closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);
      expect(text, path).toContain(
        "gate_d_input_completeness_matrix_landed_no_runtime_selected_airborne_candidate_resolver_gate_e"
      );
      expect(text, path).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts"
      );
      expect(text, path).toContain(
        "gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement"
      );
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts"
    );
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AirborneCandidateSchema,
  AirborneResultBasisSchema,
  AssemblyCalculationSchema,
  type AirborneCandidate,
  type AirborneContext,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  FLAT_LIST_MULTILEAF_GUARD_LAB_RUNTIME_METHOD,
  FLAT_LIST_MULTILEAF_GUARD_LAB_SELECTED_CANDIDATE_ID,
  FLAT_LIST_MULTILEAF_GUARD_STRATEGY
} from "./dynamic-airborne-flat-list-multileaf-guard";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_B = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_defined_shared_airborne_basis_candidate_schema_without_value_movement",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_c_inventory_rating_adapter_integrity_without_value_movement",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts",
  selectionStatus:
    "gate_b_shared_airborne_basis_candidate_schema_landed_no_runtime_selected_rating_adapter_gate_c",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_B_SURFACES = [
  "packages/shared/src/domain/airborne-basis.ts",
  "packages/shared/src/domain/assembly.ts",
  "packages/shared/src/index.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts",
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_B_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_B_HANDOFF.md"
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
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

const GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT: AirborneContext = {
  ...GROUPED_SPLIT_ROCKWOOL_CONTEXT,
  ...WALL_FIELD_CONTEXT
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const PDF_LIKE_ADJACENT_ROCKWOOL_STACK: readonly LayerInput[] = [
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

const SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
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

function wallSnapshot(input: {
  airborneContext: AirborneContext;
  layers: readonly LayerInput[];
  outputs: readonly RequestedOutputId[];
}) {
  const result = calculateAssembly(input.layers, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.outputs
  });

  return {
    confidence: result.dynamicAirborneTrace?.confidenceClass ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    family: result.dynamicAirborneTrace?.detectedFamily ?? null,
    rw: result.metrics.estimatedRwDb ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    stc: result.metrics.estimatedStc ?? null,
    strategy: result.dynamicAirborneTrace?.strategy ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

function exactFullStackCandidate(): AirborneCandidate {
  return AirborneCandidateSchema.parse({
    basis: {
      curveBasis: "measured_frequency_curve",
      exactSourceId: "source_usg_w123_exact",
      family: "double_leaf",
      frequencyBands: {
        bandSet: "third_octave_100_3150_hz",
        frequenciesHz: [100, 125, 160, 200, 250, 315, 400, 500]
      },
      kind: "airborne_measured_exact",
      measurementStandard: "ASTM E90",
      method: "verified_airborne_catalog_exact_match",
      origin: "measured_exact_full_stack",
      ratingStandard: "ASTM E413",
      requiredInputs: ["layers", "metricBasis"],
      toleranceClass: "exact_source"
    },
    id: "candidate_exact_usg_w123",
    metricIds: ["Rw", "STC"],
    origin: "measured_exact_full_stack",
    outputIds: ["Rw", "STC"],
    selected: true
  });
}

function sourceBlockedExactCandidate(): AirborneCandidate {
  return AirborneCandidateSchema.parse({
    basis: {
      curveBasis: "no_curve",
      family: "multileaf_multicavity",
      kind: "airborne_measured_exact",
      measurementStandard: "source_report",
      method: "verified_airborne_catalog_exact_match",
      missingSourceEvidence: ["rights_safe_source_owned_curve_payload_absent"],
      origin: "measured_exact_full_stack",
      ratingStandard: "source_report",
      requiredInputs: ["sourceOwnedCurvePayload", "metricContextOwner", "toleranceOwner"]
    },
    id: "candidate_blocked_rockwool_exact",
    metricIds: ["Rw"],
    origin: "measured_exact_full_stack",
    outputIds: ["Rw"],
    rejectionReasons: [
      {
        code: "missing_source_evidence",
        detail: "Exact promotion is blocked until a rights-safe source-owned curve exists."
      }
    ],
    selected: false
  });
}

function physicsPredictionCandidate(): AirborneCandidate {
  return AirborneCandidateSchema.parse({
    basis: {
      assumptions: ["grouped topology is explicit", "source validation has not landed"],
      calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 5,
      family: "multileaf_multicavity",
      frequencyBands: {
        bandSet: "third_octave_100_3150_hz",
        frequenciesHz: [100, 125, 160, 200, 250, 315, 400, 500]
      },
      kind: "airborne_physics_prediction",
      method: "triple_leaf_two_cavity_frequency_solver",
      origin: "family_physics_prediction",
      propertyDefaults: [
        {
          field: "rockwool.flowResistivity",
          reason: "Gate B records a visible default; calibrated material widening is later.",
          source: "engine_default_until_material_property_widening",
          unit: "Pa.s/m2",
          value: "family_default"
        }
      ],
      ratingStandard: "ISO 717-1",
      requiredInputs: [
        "wallTopology.topologyMode",
        "wallTopology.sideALeafLayerIndices",
        "wallTopology.cavity1DepthMm",
        "wallTopology.internalLeafLayerIndices",
        "wallTopology.cavity2DepthMm",
        "wallTopology.sideBLeafLayerIndices"
      ],
      toleranceClass: "uncalibrated_prediction"
    },
    id: "candidate_grouped_rockwool_physics_prediction",
    metricIds: ["Rw", "STC", "C", "Ctr"],
    origin: "family_physics_prediction",
    outputIds: ["Rw", "STC", "C", "Ctr"],
    selected: true
  });
}

function needsInputCandidate(): AirborneCandidate {
  return AirborneCandidateSchema.parse({
    basis: {
      curveBasis: "no_curve",
      family: "multileaf_multicavity",
      kind: "airborne_needs_input",
      method: "triple_leaf_input_completeness_matrix",
      missingPhysicalInputs: [
        "wallTopology.cavity1DepthMm",
        "wallTopology.internalLeafLayerIndices",
        "wallTopology.cavity2DepthMm"
      ],
      origin: "needs_input",
      requiredInputs: [
        "wallTopology.cavity1DepthMm",
        "wallTopology.internalLeafLayerIndices",
        "wallTopology.cavity2DepthMm"
      ]
    },
    id: "candidate_flat_list_triple_leaf_needs_input",
    metricIds: ["Rw"],
    origin: "needs_input",
    outputIds: ["Rw"],
    rejectionReasons: [
      {
        code: "missing_physical_input",
        detail: "Flat-list multi-leaf input needs explicit grouped topology before prediction."
      }
    ],
    selected: false
  });
}

describe("calculator model-first physics prediction pivot Gate B", () => {
  it("lands shared airborne basis/candidate schema no-runtime and selects rating adapter Gate C", () => {
    expect(MODEL_FIRST_GATE_B).toEqual({
      apiShapeChange: true,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_b_defined_shared_airborne_basis_candidate_schema_without_value_movement",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_c_inventory_rating_adapter_integrity_without_value_movement",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts",
      selectionStatus:
        "gate_b_shared_airborne_basis_candidate_schema_landed_no_runtime_selected_rating_adapter_gate_c",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_GATE_B_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("parses legacy AssemblyCalculation payloads and optional airborne basis metadata", () => {
    const legacyResult = calculateAssembly(PDF_LIKE_ADJACENT_ROCKWOOL_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const legacyParsed = AssemblyCalculationSchema.parse(legacyResult);

    expect(legacyParsed.airborneBasis).toMatchObject({
      method: FLAT_LIST_MULTILEAF_GUARD_LAB_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(legacyParsed.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: FLAT_LIST_MULTILEAF_GUARD_LAB_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(legacyParsed.airborneCandidateSet).toHaveLength(8);

    const exactCandidate = exactFullStackCandidate();
    const parsedWithBasis = AssemblyCalculationSchema.parse({
      ...legacyResult,
      airborneBasis: exactCandidate.basis,
      airborneCandidateSet: [exactCandidate]
    });

    expect(parsedWithBasis.airborneBasis).toMatchObject({
      exactSourceId: "source_usg_w123_exact",
      measurementStandard: "ASTM E90",
      origin: "measured_exact_full_stack",
      ratingStandard: "ASTM E413",
      toleranceClass: "exact_source"
    });
    expect(parsedWithBasis.airborneCandidateSet).toHaveLength(1);
    expect(parsedWithBasis.airborneCandidateSet?.[0]).toMatchObject({
      id: "candidate_exact_usg_w123",
      origin: "measured_exact_full_stack",
      selected: true
    });
  });

  it("keeps source absence separate from physical input absence", () => {
    const sourceBlockedExact = sourceBlockedExactCandidate();
    const needsInput = needsInputCandidate();
    const prediction = physicsPredictionCandidate();

    expect(sourceBlockedExact.basis.missingSourceEvidence).toEqual([
      "rights_safe_source_owned_curve_payload_absent"
    ]);
    expect(sourceBlockedExact.basis.missingPhysicalInputs).toEqual([]);

    expect(needsInput.basis.missingSourceEvidence).toEqual([]);
    expect(needsInput.basis.missingPhysicalInputs).toEqual([
      "wallTopology.cavity1DepthMm",
      "wallTopology.internalLeafLayerIndices",
      "wallTopology.cavity2DepthMm"
    ]);

    expect([sourceBlockedExact, prediction, needsInput].filter((candidate) => candidate.selected)).toEqual([
      expect.objectContaining({
        id: "candidate_grouped_rockwool_physics_prediction",
        origin: "family_physics_prediction"
      })
    ]);
  });

  it("requires uncertainty metadata for formula-backed airborne predictions", () => {
    expect(physicsPredictionCandidate().basis).toMatchObject({
      calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
      errorBudgetDb: 5,
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "uncalibrated_prediction"
    });

    expect(() =>
      AirborneResultBasisSchema.parse({
        calculationStandard: "engine_triple_leaf_two_cavity_frequency_solver",
        curveBasis: "calculated_frequency_curve",
        family: "multileaf_multicavity",
        kind: "airborne_physics_prediction",
        method: "triple_leaf_two_cavity_frequency_solver",
        origin: "family_physics_prediction",
        ratingStandard: "ISO 717-1"
      })
    ).toThrow(/errorBudgetDb or toleranceClass/);

    expect(() =>
      AirborneCandidateSchema.parse({
        basis: {
          curveBasis: "no_curve",
          kind: "airborne_needs_input",
          method: "input_completeness",
          origin: "needs_input"
        },
        id: "invalid_needs_input_without_fields",
        origin: "needs_input",
        selected: false
      })
    ).toThrow(/missing physical inputs/);
  });

  it("preserves adjacent and flat-list Rockwool boundaries after Gate G prediction movement", () => {
    expect(
      wallSnapshot({
        airborneContext: WALL_LAB_CONTEXT,
        layers: PDF_LIKE_ADJACENT_ROCKWOOL_STACK,
        outputs: WALL_LAB_OUTPUTS
      })
    ).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      stc: 51,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: []
    });

    expect(
      wallSnapshot({
        airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
        layers: SPLIT_ROCKWOOL_STACK,
        outputs: WALL_LAB_OUTPUTS
      })
    ).toMatchObject({
      confidence: "medium",
      family: "multileaf_multicavity",
      rw: 53,
      stc: 64,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor",
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: []
    });

    expect(
      wallSnapshot({
        airborneContext: GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT,
        layers: SPLIT_ROCKWOOL_STACK,
        outputs: WALL_FIELD_OUTPUTS
      })
    ).toMatchObject({
      confidence: "medium",
      dnTw: 53,
      family: "multileaf_multicavity",
      rwPrime: 51,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor",
      supported: ["R'w", "DnT,w"],
      unsupported: []
    });
  });

  it("keeps docs and the current-gate runner aligned with Gate B closeout", () => {
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts");
    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts"
    );

    for (const path of CURRENT_SELECTION_DOCS) {
      const doc = readRepoFile(path);

      expect(doc, path).toContain(MODEL_FIRST_GATE_B.landedGate);
      expect(doc, path).toContain(MODEL_FIRST_GATE_B.selectionStatus);
      expect(doc, path).toContain(MODEL_FIRST_GATE_B.selectedNextFile);
      expect(doc, path).toContain(MODEL_FIRST_GATE_B.selectedNextAction);
    }
  });
});

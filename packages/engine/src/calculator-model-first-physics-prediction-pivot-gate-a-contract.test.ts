import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";
import { ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING } from "./rockwool-split-triple-leaf-numeric-source-closure";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate:
    "gate_a_defined_model_first_candidate_basis_and_benchmark_acceptance_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction:
    "gate_b_define_shared_airborne_basis_candidate_schema_without_value_movement",
  selectedNextFile:
    "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts",
  selectionStatus:
    "gate_a_model_first_direction_contract_landed_no_runtime_selected_basis_gate_b",
  sourcePacketRefreshDemotedToExactCalibrationBacklog: true,
  workbenchInputBehaviorChange: false
} as const;

const AIRBORNE_CANDIDATE_ORIGINS = [
  "measured_exact_full_stack",
  "measured_exact_subassembly_plus_calculated_delta",
  "calibrated_family_physics",
  "family_physics_prediction",
  "bounded_prediction",
  "screening_fallback",
  "needs_input",
  "unsupported"
] as const;

const REQUIRED_BASIS_FIELDS = [
  "measurementStandard",
  "calculationStandard",
  "ratingStandard",
  "frequencyBands",
  "curveBasis",
  "errorBudgetDb",
  "toleranceClass",
  "propertyDefaults",
  "missingSourceEvidence",
  "missingPhysicalInputs"
] as const;

const STANDARDS_FRAME = {
  airborneCalculation: "ISO 12354-1",
  airborneRating: "ISO 717-1",
  impactCalculation: "ISO 12354-2",
  impactRating: "ISO 717-2",
  impactUsRating: "ASTM E989",
  labAirborne: "ASTM E90",
  labImpact: "ASTM E492",
  stcRating: "ASTM E413",
  uncertainty: "ISO 12999-1"
} as const;

const MILESTONE_ORDER = [
  "M1 Gate A direction contract",
  "M2 basis and candidate schema",
  "M3 rating adapter integrity",
  "M4 input completeness / needs-input matrix",
  "M5 airborne candidate resolver",
  "M6 grouped Rockwool triple-leaf prediction",
  "M7 calibration and exact promotion",
  "M8 family expansion / material-property widening",
  "M9 personal-use readiness"
] as const;

const BENCHMARK_LANES = [
  "B0 no-runtime direction contract",
  "B1 exact full-stack source row",
  "B2 exact subassembly anchor plus delta",
  "B3 single-leaf / massive physics",
  "B4 double-leaf / framed / cavity physics",
  "B5 triple-leaf / multi-cavity physics",
  "B6 porous fill / absorption data boundary",
  "B7 floating floor / impact prediction",
  "B8 field / apparent output context",
  "B9 rating adapter integrity",
  "B10 hostile layer input stability",
  "B11 calibration / holdout",
  "B12 personal-use scenario pack"
] as const;

const RUNTIME_STOP_RULES = [
  "non_exact_result_requires_error_budget_or_tolerance_class",
  "field_or_apparent_metric_requires_context_or_needs_input",
  "runtime_value_move_requires_positive_and_negative_benchmark_rows",
  "source_row_cannot_promote_broader_family_than_owned_scope"
] as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_BENCHMARK_ACCEPTANCE_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_A_HANDOFF.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_A_HANDOFF.md"
] as const;

const MODEL_RULE_DOCS = [
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_A_HANDOFF.md"
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"] as const satisfies readonly RequestedOutputId[];

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
];

const PDF_LIKE_SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

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
    confidence: result.dynamicAirborneTrace?.confidenceClass,
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

describe("calculator model-first physics prediction pivot Gate A", () => {
  it("lands a no-runtime direction contract and selects shared basis Gate B", () => {
    expect(MODEL_FIRST_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate:
        "gate_a_defined_model_first_candidate_basis_and_benchmark_acceptance_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        "gate_b_define_shared_airborne_basis_candidate_schema_without_value_movement",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts",
      selectionStatus:
        "gate_a_model_first_direction_contract_landed_no_runtime_selected_basis_gate_b",
      sourcePacketRefreshDemotedToExactCalibrationBacklog: true,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines airborne result origins and basis fields before any value movement", () => {
    expect(AIRBORNE_CANDIDATE_ORIGINS).toEqual([
      "measured_exact_full_stack",
      "measured_exact_subassembly_plus_calculated_delta",
      "calibrated_family_physics",
      "family_physics_prediction",
      "bounded_prediction",
      "screening_fallback",
      "needs_input",
      "unsupported"
    ]);

    expect(REQUIRED_BASIS_FIELDS).toEqual([
      "measurementStandard",
      "calculationStandard",
      "ratingStandard",
      "frequencyBands",
      "curveBasis",
      "errorBudgetDb",
      "toleranceClass",
      "propertyDefaults",
      "missingSourceEvidence",
      "missingPhysicalInputs"
    ]);
  });

  it("pins standards and benchmark lanes as acceptance gates for later runtime movement", () => {
    expect(STANDARDS_FRAME).toEqual({
      airborneCalculation: "ISO 12354-1",
      airborneRating: "ISO 717-1",
      impactCalculation: "ISO 12354-2",
      impactRating: "ISO 717-2",
      impactUsRating: "ASTM E989",
      labAirborne: "ASTM E90",
      labImpact: "ASTM E492",
      stcRating: "ASTM E413",
      uncertainty: "ISO 12999-1"
    });

    expect(MILESTONE_ORDER).toHaveLength(9);
    expect(BENCHMARK_LANES).toHaveLength(13);
    expect(RUNTIME_STOP_RULES).toEqual([
      "non_exact_result_requires_error_budget_or_tolerance_class",
      "field_or_apparent_metric_requires_context_or_needs_input",
      "runtime_value_move_requires_positive_and_negative_benchmark_rows",
      "source_row_cannot_promote_broader_family_than_owned_scope"
    ]);
  });

  it("freezes current Rockwool runtime outputs until the M6 prediction gate moves them", () => {
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
        airborneContext: WALL_FIELD_CONTEXT,
        layers: PDF_LIKE_ADJACENT_ROCKWOOL_STACK,
        outputs: WALL_FIELD_OUTPUTS
      })
    ).toMatchObject({
      confidence: "medium",
      dnTw: 51,
      family: "double_leaf",
      rwPrime: 49,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      supported: ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"],
      unsupported: []
    });

    const splitLab = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: PDF_LIKE_SPLIT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const splitField = wallSnapshot({
      airborneContext: WALL_FIELD_CONTEXT,
      layers: PDF_LIKE_SPLIT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });

    expect(splitLab).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 41,
      stc: 41,
      strategy: "multileaf_screening_blend",
      supported: [],
      unsupported: ["Rw", "STC", "C", "Ctr"]
    });
    expect(splitField).toMatchObject({
      confidence: "low",
      dnTw: 40,
      family: "multileaf_multicavity",
      rwPrime: 39,
      strategy: "multileaf_screening_blend",
      supported: [],
      unsupported: ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"]
    });
    expect(splitLab.warnings).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING);
    expect(splitField.warnings).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING);
  });

  it("keeps active docs and current-gate runner aligned with Gate A closeout", () => {
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts");

    for (const path of CURRENT_SELECTION_DOCS) {
      const doc = readRepoFile(path);

      expect(doc, path).toContain(MODEL_FIRST_GATE_A.selectedImplementationSlice);
      expect(doc, path).toContain(MODEL_FIRST_GATE_A.selectedNextFile);
      expect(doc, path).toContain(MODEL_FIRST_GATE_A.selectedNextAction);
    }

    for (const path of MODEL_RULE_DOCS) {
      const doc = readRepoFile(path);

      expect(doc, path).toContain("source absence");
      expect(doc, path).toContain("formula");
    }

    expect(readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md")).toContain(
      MODEL_FIRST_GATE_A.selectionStatus
    );
    expect(readRepoFile("docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md")).toContain(
      "B5 - Triple-Leaf / Multi-Cavity Physics"
    );
  });
});

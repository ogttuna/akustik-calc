import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { ExactFloorSystem, ImpactCalculation, ImpactPredictorInput } from "@dynecho/shared";

import {
  estimateSteelFloorImpactFromPredictorInput,
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

export type SteelFloorFormulaBenchmarkCaseRole =
  | "same_family_holdout_residual"
  | "exact_source_anchor_only"
  | "source_absent_design_case";

export type SteelFloorFormulaResidualBlocker =
  | "missing_carrier_spacing"
  | "missing_load_basis"
  | "missing_lower_isolation_support_class"
  | "missing_resilient_dynamic_stiffness"
  | "not_upper_resilient_formula_topology";

export type SteelFloorFormulaAccuracyBenchmarkCase = {
  actualDeltaLw?: number;
  actualLnW?: number;
  anchorUsePolicy: "residual_check" | "calibration_anchor_only" | "runtime_design_reference";
  caseRole: SteelFloorFormulaBenchmarkCaseRole;
  carrierDepthMm: number | null;
  id: string;
  label: string;
  lowerIsolation: string;
  metricBasis: "lab_Ln_w" | "lab_Ln_w_and_DeltaLw";
  predictorInput: ImpactPredictorInput | null;
  residualBlockers: readonly SteelFloorFormulaResidualBlocker[];
  residualEligible: boolean;
  sourceId: string | null;
  supportForm: ImpactPredictorInput["supportForm"] | null;
};

export type SteelFloorFormulaAccuracyBenchmarkEvaluation = SteelFloorFormulaAccuracyBenchmarkCase & {
  absoluteDeltaLwErrorDb: number | null;
  absoluteLnWErrorDb: number | null;
  predictedDeltaLw: number | null;
  predictedImpact: ImpactCalculation | null;
  predictedLnW: number | null;
  withinCurrentDeltaLwTolerance: boolean | null;
  withinCurrentLnWTolerance: boolean | null;
};

export type GateAHSteelFloorFormulaAccuracyBenchmarkContract = {
  allResidualsWithinCurrentTolerance: boolean;
  benchmarkCases: readonly SteelFloorFormulaAccuracyBenchmarkEvaluation[];
  deltaLwResidualCaseCount: number;
  exactMeasuredRowsRemainPrecedence: true;
  formulaBasis: typeof STEEL_FLOOR_FORMULA_BASIS;
  landedGate: "gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan";
  lnWResidualCaseCount: number;
  maxAbsoluteLnWResidualDb: number;
  meanAbsoluteLnWResidualDb: number;
  previousLandedGate: "gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan";
  residualEvidenceScope: "limited_same_family_lab_holdouts";
  runtimeValueMovement: false;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: "gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan";
  selectedNextFile: "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts";
  selectionStatus: "gate_ah_steel_floor_formula_accuracy_benchmark_landed_selected_residual_policy_gate_ai";
  sourceAnchorInventory: {
    pliteqSteelJoistHoldoutRows: number;
    ubiqOpenWebExactAnchorRows: number;
  };
  sourceRowsAreCalibrationEvidenceNotProduct: true;
  toleranceDecision: {
    decision: "keep_current_corridor_until_larger_holdout_set";
    deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    retuneBlockedUntil: readonly string[];
  };
};

const PLITEQ_STEEL_JOIST_SOURCE_IDS = [
  "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
  "pliteq_steel_joist_250_rst12_porcelain_lab_2026",
  "pliteq_steel_joist_250_rst02_wood_lab_2026"
] as const;

const UBIQ_OPEN_WEB_SUPPORTED_EXACT_PATTERN = /^ubiq_fl(?:24|26|28)_open_web_steel_/u;

function round1(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

function exactFloorSystemById(id: string): ExactFloorSystem {
  const system = EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id);

  if (!system) {
    throw new Error(`Missing exact floor-system source row: ${id}`);
  }

  return system;
}

function sourceLnW(system: ExactFloorSystem): number {
  const lnW = system.impactRatings?.LnW;

  if (typeof lnW !== "number") {
    throw new Error(`Exact floor-system source row has no LnW value: ${system.id}`);
  }

  return lnW;
}

const PLITEQ_STEEL_JOIST_BASE_INPUT = {
  baseSlab: {
    thicknessMm: 250
  },
  carrierSpacingMm: 600,
  floatingScreed: {
    densityKgM3: 1250,
    materialClass: "cement_board",
    thicknessMm: 19
  },
  impactSystemType: "combined_upper_lower_system",
  lowerTreatment: {
    boardLayerCount: 2,
    boardMaterialClass: "firestop_board",
    boardThicknessMm: 16,
    cavityDepthMm: 120,
    cavityFillThicknessMm: 100,
    supportClass: "furred_channels",
    type: "suspended_ceiling_elastic_hanger"
  },
  structuralSupportType: "steel_joists",
  supportForm: "joist_or_purlin"
} as const satisfies ImpactPredictorInput;

function pliteqVinylInput(): ImpactPredictorInput {
  return {
    ...PLITEQ_STEEL_JOIST_BASE_INPUT,
    floorCovering: {
      densityKgM3: 1400,
      materialClass: "vinyl_flooring",
      mode: "material_layer",
      thicknessMm: 2.5
    },
    loadBasisKgM2: 27.3,
    resilientLayer: {
      dynamicStiffnessMNm3: 157,
      productId: "geniemat_rst02",
      thicknessMm: 2
    }
  };
}

function pliteqPorcelainInput(): ImpactPredictorInput {
  return {
    ...PLITEQ_STEEL_JOIST_BASE_INPUT,
    floorCovering: {
      densityKgM3: 2200,
      materialClass: "porcelain_tile",
      mode: "material_layer",
      thicknessMm: 8
    },
    loadBasisKgM2: 18,
    resilientLayer: {
      dynamicStiffnessMNm3: 60,
      productId: "geniemat_rst12",
      thicknessMm: 12
    }
  };
}

function pliteqWoodInput(): ImpactPredictorInput {
  return {
    ...PLITEQ_STEEL_JOIST_BASE_INPUT,
    floorCovering: {
      densityKgM3: 780,
      materialClass: "engineered_timber_with_acoustic_underlay",
      mode: "material_layer",
      thicknessMm: 15
    },
    loadBasisKgM2: 35.5,
    resilientLayer: {
      dynamicStiffnessMNm3: 157,
      productId: "geniemat_rst02",
      thicknessMm: 2
    }
  };
}

function buildPliteqResidualCase(input: {
  id: string;
  predictorInput: ImpactPredictorInput;
  sourceId: (typeof PLITEQ_STEEL_JOIST_SOURCE_IDS)[number];
}): SteelFloorFormulaAccuracyBenchmarkCase {
  const source = exactFloorSystemById(input.sourceId);

  return {
    actualLnW: sourceLnW(source),
    anchorUsePolicy: "residual_check",
    caseRole: "same_family_holdout_residual",
    carrierDepthMm: input.predictorInput.baseSlab?.thicknessMm ?? null,
    id: input.id,
    label: source.label,
    lowerIsolation: "suspended_ceiling_elastic_hanger_furred_channels",
    metricBasis: "lab_Ln_w",
    predictorInput: input.predictorInput,
    residualBlockers: [],
    residualEligible: true,
    sourceId: source.id,
    supportForm: input.predictorInput.supportForm ?? null
  };
}

function anchorBlockersFor(system: ExactFloorSystem): readonly SteelFloorFormulaResidualBlocker[] {
  const blockers: SteelFloorFormulaResidualBlocker[] = [];
  const estimate = system.estimateMatch as Partial<ImpactPredictorInput> | undefined;

  if (!estimate?.carrierSpacingMm) {
    blockers.push("missing_carrier_spacing");
  }

  if (!estimate?.loadBasisKgM2) {
    blockers.push("missing_load_basis");
  }

  if (!estimate?.resilientLayer?.dynamicStiffnessMNm3) {
    blockers.push("missing_resilient_dynamic_stiffness");
  }

  if (!estimate?.lowerTreatment?.supportClass) {
    blockers.push("missing_lower_isolation_support_class");
  }

  if (estimate?.impactSystemType === "suspended_ceiling_only") {
    blockers.push("not_upper_resilient_formula_topology");
  }

  return blockers;
}

function buildUbiqAnchorCase(sourceId: string): SteelFloorFormulaAccuracyBenchmarkCase {
  const source = exactFloorSystemById(sourceId);

  return {
    actualLnW: sourceLnW(source),
    anchorUsePolicy: "calibration_anchor_only",
    caseRole: "exact_source_anchor_only",
    carrierDepthMm: source.estimateMatch?.baseSlab?.thicknessMm ?? null,
    id: `${source.id}_anchor_only`,
    label: source.label,
    lowerIsolation: "published_ubiq_resilient_ceiling_missing_formula_support_class",
    metricBasis: "lab_Ln_w",
    predictorInput: source.estimateMatch ?? null,
    residualBlockers: anchorBlockersFor(source),
    residualEligible: false,
    sourceId: source.id,
    supportForm: source.estimateMatch?.supportForm ?? null
  };
}

function buildDesignReferenceCase(): SteelFloorFormulaAccuracyBenchmarkCase {
  return {
    anchorUsePolicy: "runtime_design_reference",
    caseRole: "source_absent_design_case",
    carrierDepthMm: 200,
    id: "gate_ah_open_web_steel_formula_design_reference",
    label: "Complete source-absent open-web steel formula design reference",
    lowerIsolation: "suspended_ceiling_elastic_hanger_furred_channels",
    metricBasis: "lab_Ln_w_and_DeltaLw",
    predictorInput: {
      baseSlab: {
        materialClass: "lightweight_steel_carrier",
        thicknessMm: 200
      },
      carrierSpacingMm: 600,
      floatingScreed: {
        densityKgM3: 1250,
        materialClass: "cement_board",
        thicknessMm: 18
      },
      floorCovering: {
        materialClass: "ceramic_tile",
        mode: "material_layer",
        thicknessMm: 10
      },
      impactSystemType: "combined_upper_lower_system",
      loadBasisKgM2: 64,
      lowerTreatment: {
        boardLayerCount: 1,
        boardMaterialClass: "gypsum_board",
        boardThicknessMm: 12.5,
        cavityDepthMm: 200,
        cavityFillThicknessMm: 100,
        supportClass: "furred_channels",
        type: "suspended_ceiling_elastic_hanger"
      },
      resilientLayer: {
        dynamicStiffnessMNm3: 35,
        thicknessMm: 4.5
      },
      structuralSupportType: "steel_joists",
      supportForm: "open_web_or_rolled"
    },
    residualBlockers: [],
    residualEligible: false,
    sourceId: null,
    supportForm: "open_web_or_rolled"
  };
}

export function buildSteelFloorFormulaAccuracyBenchmarkCases(): readonly SteelFloorFormulaAccuracyBenchmarkCase[] {
  return [
    buildPliteqResidualCase({
      id: "gate_ah_pliteq_rst02_vinyl_same_family_holdout",
      predictorInput: pliteqVinylInput(),
      sourceId: "pliteq_steel_joist_250_rst02_vinyl_lab_2026"
    }),
    buildPliteqResidualCase({
      id: "gate_ah_pliteq_rst12_porcelain_same_family_holdout",
      predictorInput: pliteqPorcelainInput(),
      sourceId: "pliteq_steel_joist_250_rst12_porcelain_lab_2026"
    }),
    buildPliteqResidualCase({
      id: "gate_ah_pliteq_rst02_wood_same_family_holdout",
      predictorInput: pliteqWoodInput(),
      sourceId: "pliteq_steel_joist_250_rst02_wood_lab_2026"
    }),
    buildUbiqAnchorCase("ubiq_fl24_open_web_steel_200_16mm_bare_exact_lab_2026"),
    buildUbiqAnchorCase("ubiq_fl28_open_web_steel_400_exact_lab_2026"),
    buildDesignReferenceCase()
  ];
}

export function evaluateSteelFloorFormulaAccuracyBenchmarkCase(
  benchmark: SteelFloorFormulaAccuracyBenchmarkCase
): SteelFloorFormulaAccuracyBenchmarkEvaluation {
  const predictedImpact = benchmark.predictorInput
    ? estimateSteelFloorImpactFromPredictorInput(benchmark.predictorInput)
    : null;
  const predictedLnW = typeof predictedImpact?.LnW === "number" ? predictedImpact.LnW : null;
  const predictedDeltaLw = typeof predictedImpact?.DeltaLw === "number" ? predictedImpact.DeltaLw : null;
  const absoluteLnWErrorDb =
    benchmark.residualEligible && typeof benchmark.actualLnW === "number" && typeof predictedLnW === "number"
      ? round1(Math.abs(predictedLnW - benchmark.actualLnW))
      : null;
  const absoluteDeltaLwErrorDb =
    benchmark.residualEligible && typeof benchmark.actualDeltaLw === "number" && typeof predictedDeltaLw === "number"
      ? round1(Math.abs(predictedDeltaLw - benchmark.actualDeltaLw))
      : null;

  return {
    ...benchmark,
    absoluteDeltaLwErrorDb,
    absoluteLnWErrorDb,
    predictedDeltaLw,
    predictedImpact,
    predictedLnW,
    withinCurrentDeltaLwTolerance: absoluteDeltaLwErrorDb === null
      ? null
      : absoluteDeltaLwErrorDb <= STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
    withinCurrentLnWTolerance: absoluteLnWErrorDb === null
      ? null
      : absoluteLnWErrorDb <= STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
  };
}

function mean(values: readonly number[]): number {
  return values.length === 0
    ? 0
    : round1(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function buildGateAHSteelFloorFormulaAccuracyBenchmarkContract(): GateAHSteelFloorFormulaAccuracyBenchmarkContract {
  const benchmarkCases = buildSteelFloorFormulaAccuracyBenchmarkCases().map(
    evaluateSteelFloorFormulaAccuracyBenchmarkCase
  );
  const lnWResiduals = benchmarkCases
    .map((entry) => entry.absoluteLnWErrorDb)
    .filter((value): value is number => typeof value === "number");
  const deltaLwResiduals = benchmarkCases
    .map((entry) => entry.absoluteDeltaLwErrorDb)
    .filter((value): value is number => typeof value === "number");
  const ubiqOpenWebExactAnchorRows = EXACT_FLOOR_SYSTEMS.filter(
    (entry) => UBIQ_OPEN_WEB_SUPPORTED_EXACT_PATTERN.test(entry.id)
  );
  const pliteqSteelJoistHoldoutRows = EXACT_FLOOR_SYSTEMS.filter(
    (entry) => PLITEQ_STEEL_JOIST_SOURCE_IDS.includes(entry.id as (typeof PLITEQ_STEEL_JOIST_SOURCE_IDS)[number])
  );

  return {
    allResidualsWithinCurrentTolerance: benchmarkCases.every(
      (entry) => entry.withinCurrentLnWTolerance !== false && entry.withinCurrentDeltaLwTolerance !== false
    ),
    benchmarkCases,
    deltaLwResidualCaseCount: deltaLwResiduals.length,
    exactMeasuredRowsRemainPrecedence: true,
    formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
    landedGate: "gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan",
    lnWResidualCaseCount: lnWResiduals.length,
    maxAbsoluteLnWResidualDb: lnWResiduals.length > 0 ? Math.max(...lnWResiduals) : 0,
    meanAbsoluteLnWResidualDb: mean(lnWResiduals),
    previousLandedGate: "gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan",
    residualEvidenceScope: "limited_same_family_lab_holdouts",
    runtimeValueMovement: false,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: "gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan",
    selectedNextFile:
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts",
    selectionStatus:
      "gate_ah_steel_floor_formula_accuracy_benchmark_landed_selected_residual_policy_gate_ai",
    sourceAnchorInventory: {
      pliteqSteelJoistHoldoutRows: pliteqSteelJoistHoldoutRows.length,
      ubiqOpenWebExactAnchorRows: ubiqOpenWebExactAnchorRows.length
    },
    sourceRowsAreCalibrationEvidenceNotProduct: true,
    toleranceDecision: {
      decision: "keep_current_corridor_until_larger_holdout_set",
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      retuneBlockedUntil: [
        "delta_lw_measured_holdout_values_exist",
        "open_web_formula_inputs_are_source_owned_not_inferred",
        "paired_negative_rows_protect_wrong_family_blending",
        "field_and_building_bases_have_separate_owners"
      ]
    }
  };
}

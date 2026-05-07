import type {
  AcousticInputFieldId,
  ImpactCalculation,
  ImpactPredictorInput,
  RequestedOutputId
} from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { clamp, ksRound1, log10Safe, round1 } from "./math";

export const STEEL_FLOOR_FORMULA_BASIS = "predictor_lightweight_steel_mass_spring_holdout_corridor_estimate" as const;
export const STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB = 4.5;
export const STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB = 2;
const REQUIRED_PHYSICAL_INPUTS = [
  "steelSupportForm",
  "steelCarrierDepthMm",
  "steelCarrierSpacingMm",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2",
  "lowerCeilingIsolationSupportForm"
] as const satisfies readonly AcousticInputFieldId[];
const BASIS_BOUNDARIES = [
  "lab_element_impact_Ln_w_DeltaLw",
  "field_impact_Lprime_nw_Lprime_nT_w_requires_Gate_Z_context"
] as const;
const OPEN_WEB_FL24_BARE_ROWS = [
  { carrierDepthMm: 200, lnW: 63 },
  { carrierDepthMm: 300, lnW: 62 },
  { carrierDepthMm: 400, lnW: 61 }
] as const;

export type GateADSteelFloorImpactFormulaStatus =
  | "exact_source_precedence"
  | "formula_corridor_ready"
  | "needs_input"
  | "not_steel_floor";

export type GateADSteelFloorImpactFormulaCorridorMetric = {
  estimate: number;
  max: number;
  min: number;
  toleranceDb: number;
};

export type GateADSteelFloorImpactFormulaHoldoutComparison = {
  absoluteErrorDb: number;
  actualLnW: number;
  predictedLnW: number;
  sourceId: string;
  withinCorridor: boolean;
};

export type GateADSteelFloorImpactFormulaCorridorContractInput = {
  exactSourceRowAvailable?: boolean;
  holdoutActualLnW?: number;
  holdoutSourceId?: string;
  impactPredictorInput?: ImpactPredictorInput | null;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateADSteelFloorImpactFormulaCorridorContract = {
  basisBoundaries: readonly string[];
  corridor: {
    DeltaLw: GateADSteelFloorImpactFormulaCorridorMetric | null;
    LnW: GateADSteelFloorImpactFormulaCorridorMetric | null;
  };
  formulaBasis: typeof STEEL_FLOOR_FORMULA_BASIS;
  holdoutComparisons: readonly GateADSteelFloorImpactFormulaHoldoutComparison[];
  impact: ImpactCalculation | null;
  landedGate: "gate_ad_steel_floor_impact_formula_numeric_corridor_plan";
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  previousLandedGate: "gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan";
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: "gate_ae_steel_floor_formula_card_and_report_parity_plan";
  selectedNextFile: "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts";
  selectionStatus: "gate_ad_steel_floor_impact_formula_corridor_landed_selected_card_report_parity_gate_ae";
  sourceRowsRequiredForRuntimeSelection: false;
  status: GateADSteelFloorImpactFormulaStatus;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateADSteelFloorImpactFormulaScenarioId =
  | "gate_ad_complete_open_web_steel_formula_runtime"
  | "gate_ad_exact_source_stays_precedence"
  | "gate_ad_missing_carrier_spacing_blocks_family_blend"
  | "gate_ad_pliteq_steel_joist_porcelain_holdout"
  | "gate_ad_pliteq_steel_joist_vinyl_holdout";

export type GateADSteelFloorImpactFormulaScenarioPackEntry = {
  contract: GateADSteelFloorImpactFormulaCorridorContract;
  description: string;
  id: GateADSteelFloorImpactFormulaScenarioId;
};

function hasPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function materialDensityKgM3(materialClass: string | undefined, fallback: number): number {
  switch (materialClass) {
    case "cement_board":
      return 1250;
    case "ceramic_tile":
    case "porcelain_tile":
      return 2200;
    case "engineered_timber_with_acoustic_underlay":
      return 780;
    case "fire_board":
    case "firestop_board":
      return 850;
    case "gypsum_board":
      return 800;
    case "vinyl_flooring":
      return 1400;
    default:
      return fallback;
  }
}

function surfaceMassKgM2(input: {
  densityKgM3?: number;
  materialClass?: string;
  thicknessMm?: number;
}, fallbackDensityKgM3: number): number {
  if (!hasPositiveNumber(input.thicknessMm)) {
    return 0;
  }

  const densityKgM3 = hasPositiveNumber(input.densityKgM3)
    ? input.densityKgM3
    : materialDensityKgM3(input.materialClass, fallbackDensityKgM3);

  return densityKgM3 * (input.thicknessMm / 1000);
}

function resolveLoadBasisKgM2(input: ImpactPredictorInput): number | null {
  if (hasPositiveNumber(input.loadBasisKgM2)) {
    return input.loadBasisKgM2;
  }

  const floatingMass = input.floatingScreed
    ? surfaceMassKgM2(input.floatingScreed, 1200)
    : 0;
  const floorCoveringMass = input.floorCovering?.mode === "material_layer"
    ? surfaceMassKgM2(input.floorCovering, 900)
    : 0;
  const loadBasis = floatingMass + floorCoveringMass;

  return loadBasis > 0 ? round1(loadBasis) : null;
}

function interpolateOpenWebBareReferenceLnW(carrierDepthMm: number): number {
  if (carrierDepthMm <= 300) {
    const blend = clamp((carrierDepthMm - 200) / 100, 0, 1);
    return OPEN_WEB_FL24_BARE_ROWS[0].lnW +
      ((OPEN_WEB_FL24_BARE_ROWS[1].lnW - OPEN_WEB_FL24_BARE_ROWS[0].lnW) * blend);
  }

  const blend = clamp((carrierDepthMm - 300) / 100, 0, 1);
  return OPEN_WEB_FL24_BARE_ROWS[1].lnW +
    ((OPEN_WEB_FL24_BARE_ROWS[2].lnW - OPEN_WEB_FL24_BARE_ROWS[1].lnW) * blend);
}

function referenceBoardMassKgM2(input: ImpactPredictorInput): number {
  return input.supportForm === "joist_or_purlin"
    ? 2 * 16 * 850 / 1000
    : 2 * 13 * 800 / 1000;
}

function lowerBoardMassKgM2(input: ImpactPredictorInput): number {
  const lower = input.lowerTreatment;
  if (!lower) {
    return 0;
  }

  const count = lower.boardLayerCount ?? lower.boardThicknessScheduleMm?.length ?? 1;
  const averageThicknessMm = hasPositiveNumber(lower.boardThicknessMm)
    ? lower.boardThicknessMm
    : lower.boardThicknessScheduleMm && lower.boardThicknessScheduleMm.length > 0
      ? lower.boardThicknessScheduleMm.reduce((sum, value) => sum + value, 0) / lower.boardThicknessScheduleMm.length
      : 0;
  const density = materialDensityKgM3(lower.boardMaterialClass, 800);

  return count * averageThicknessMm * density / 1000;
}

function lowerAdjustmentDb(input: ImpactPredictorInput): number {
  const lower = input.lowerTreatment;
  const boardCount = lower?.boardLayerCount ?? lower?.boardThicknessScheduleMm?.length ?? 1;
  const referenceCount = input.supportForm === "joist_or_purlin" ? 2 : 2;
  const boardMass = lowerBoardMassKgM2(input);
  const referenceMass = referenceBoardMassKgM2(input);
  const boardMassPenalty = boardMass > 0
    ? clamp(3 * log10Safe(referenceMass / boardMass), -2.5, 4)
    : 4;
  const boardCountPenalty = Math.max(0, referenceCount - boardCount) * 1.5;
  const referenceCavityMm = input.supportForm === "joist_or_purlin" ? 120 : 65;
  const referenceFillMm = input.supportForm === "joist_or_purlin" ? 100 : 145;
  const cavityAdjustment = hasPositiveNumber(lower?.cavityDepthMm)
    ? clamp(-2 * log10Safe(lower.cavityDepthMm / referenceCavityMm), -2.5, 2.5)
    : 1.5;
  const fillAdjustment = hasPositiveNumber(lower?.cavityFillThicknessMm)
    ? clamp(-1 * log10Safe(lower.cavityFillThicknessMm / referenceFillMm), -1.5, 1.5)
    : 0.8;
  const supportAdjustment =
    input.supportForm === "open_web_or_rolled" &&
    lower?.type === "suspended_ceiling_elastic_hanger" &&
      lower.supportClass === "furred_channels"
      ? 1.2
      : 0;

  return boardMassPenalty + boardCountPenalty + cavityAdjustment + fillAdjustment + supportAdjustment;
}

function carrierSpacingAdjustmentDb(input: ImpactPredictorInput): number {
  const referenceSpacingMm = 450;
  return hasPositiveNumber(input.carrierSpacingMm)
    ? clamp(2 * log10Safe(input.carrierSpacingMm / referenceSpacingMm), -1.5, 2.5)
    : 0;
}

function baseSteelBareReferenceLnW(input: ImpactPredictorInput): number | null {
  const carrierDepthMm = input.baseSlab?.thicknessMm;
  if (!hasPositiveNumber(carrierDepthMm)) {
    return null;
  }

  const bareReference = input.supportForm === "open_web_or_rolled"
    ? interpolateOpenWebBareReferenceLnW(carrierDepthMm)
    : 62 - (0.004 * (carrierDepthMm - 250));

  return bareReference + lowerAdjustmentDb(input) + carrierSpacingAdjustmentDb(input);
}

function computeFloatingFloorDeltaLwEstimate(loadSurfaceMassKgM2: number, dynamicStiffnessMNm3: number): number {
  return (13 * log10Safe(loadSurfaceMassKgM2)) - (14.2 * log10Safe(dynamicStiffnessMNm3)) + 20.8;
}

function computeFloatingFloorResonanceHz(loadSurfaceMassKgM2: number, dynamicStiffnessMNm3: number): number {
  return 160 * Math.sqrt(dynamicStiffnessMNm3 / loadSurfaceMassKgM2);
}

function steelTransferEfficiency(input: ImpactPredictorInput): number {
  const depthMm = input.baseSlab?.thicknessMm ?? 250;
  const depthFactor = clamp((depthMm - 200) / 200, 0, 1);
  const supportFactor = input.supportForm === "open_web_or_rolled" ? 0.48 : 0.48;

  return clamp(supportFactor - (depthFactor * 0.02), 0.42, 0.52);
}

function hardFinishCouplingPenaltyDb(input: ImpactPredictorInput): number {
  const materialClass = input.floorCovering?.mode === "material_layer"
    ? input.floorCovering.materialClass
    : undefined;
  const dynamicStiffness = input.resilientLayer?.dynamicStiffnessMNm3;

  if (materialClass !== "ceramic_tile" && materialClass !== "porcelain_tile") {
    return 0;
  }

  if (!hasPositiveNumber(dynamicStiffness) || dynamicStiffness <= 40) {
    return 0.2;
  }

  return dynamicStiffness <= 80 ? 3.7 : 2.4;
}

function missingSteelFormulaInputs(input: ImpactPredictorInput | null | undefined): AcousticInputFieldId[] {
  if (!input || input.structuralSupportType !== "steel_joists") {
    return [];
  }

  const missing: AcousticInputFieldId[] = [];

  if (!input.supportForm) {
    missing.push("steelSupportForm");
  }

  if (!hasPositiveNumber(input.baseSlab?.thicknessMm)) {
    missing.push("steelCarrierDepthMm");
  }

  if (!hasPositiveNumber(input.carrierSpacingMm)) {
    missing.push("steelCarrierSpacingMm");
  }

  if (!hasPositiveNumber(input.resilientLayer?.dynamicStiffnessMNm3)) {
    missing.push("resilientLayerDynamicStiffnessMNm3");
  }

  if (!hasPositiveNumber(input.loadBasisKgM2)) {
    missing.push("loadBasisKgM2");
  }

  if (
    !input.lowerTreatment ||
    input.lowerTreatment.type === "none" ||
    !input.lowerTreatment.supportClass ||
    !hasPositiveNumber(input.lowerTreatment.cavityDepthMm) ||
    (
      !hasPositiveNumber(input.lowerTreatment.boardThicknessMm) &&
      !(input.lowerTreatment.boardThicknessScheduleMm && input.lowerTreatment.boardThicknessScheduleMm.length > 0)
    )
  ) {
    missing.push("lowerCeilingIsolationSupportForm");
  }

  return missing;
}

function isSourceAbsentSteelFormulaRoute(input: ImpactPredictorInput | null | undefined): boolean {
  return Boolean(
    input &&
      input.structuralSupportType === "steel_joists" &&
      (
        input.impactSystemType === "combined_upper_lower_system" ||
        input.impactSystemType === "dry_floating_floor" ||
        input.impactSystemType === "heavy_floating_floor"
      )
  );
}

export function shouldBlockSteelFloorImpactFormulaFallback(
  input: ImpactPredictorInput | null | undefined
): boolean {
  const missing = missingSteelFormulaInputs(input);
  const hasFormulaIntent = Boolean(
    hasPositiveNumber(input?.loadBasisKgM2) ||
      hasPositiveNumber(input?.resilientLayer?.dynamicStiffnessMNm3)
  );

  return (
    isSourceAbsentSteelFormulaRoute(input) &&
    hasFormulaIntent &&
    missing.length > 0 &&
    !missing.includes("steelSupportForm")
  );
}

export function estimateSteelFloorImpactFromPredictorInput(
  input: ImpactPredictorInput
): ImpactCalculation | null {
  if (!isSourceAbsentSteelFormulaRoute(input) || missingSteelFormulaInputs(input).length > 0) {
    return null;
  }

  const bareReferenceLnW = baseSteelBareReferenceLnW(input);
  const dynamicStiffnessMNm3 = input.resilientLayer?.dynamicStiffnessMNm3;
  const loadBasisKgM2 = resolveLoadBasisKgM2(input);

  if (
    !hasPositiveNumber(bareReferenceLnW) ||
    !hasPositiveNumber(dynamicStiffnessMNm3) ||
    !hasPositiveNumber(loadBasisKgM2)
  ) {
    return null;
  }

  const deltaLw = computeFloatingFloorDeltaLwEstimate(loadBasisKgM2, dynamicStiffnessMNm3);
  const predictorResonanceHz = computeFloatingFloorResonanceHz(loadBasisKgM2, dynamicStiffnessMNm3);
  const effectiveDeltaLw = Math.max(0, deltaLw) * steelTransferEfficiency(input);
  const lnW = ksRound1(bareReferenceLnW - effectiveDeltaLw + hardFinishCouplingPenaltyDb(input));
  const roundedDeltaLw = ksRound1(deltaLw);
  const roundedBareReferenceLnW = ksRound1(bareReferenceLnW);

  return {
    DeltaLw: roundedDeltaLw,
    LnW: lnW,
    availableOutputs: ["Ln,w", "DeltaLw"],
    bareReferenceLnW: roundedBareReferenceLnW,
    basis: STEEL_FLOOR_FORMULA_BASIS,
    confidence: getImpactConfidenceForBasis(STEEL_FLOOR_FORMULA_BASIS),
    floatingLoadSurfaceMassKgM2: ksRound1(loadBasisKgM2),
    labOrField: "lab",
    metricBasis: buildUniformImpactMetricBasis(
      {
        DeltaLw: roundedDeltaLw,
        LnW: lnW
      },
      STEEL_FLOOR_FORMULA_BASIS
    ),
    notes: [
      "Steel-floor impact estimate used the Gate AD mass-spring formula corridor instead of the broad floor-system family blend.",
      `Reference DeltaLw used the existing Annex-C style relation with m'load = ${ksRound1(loadBasisKgM2)} kg/m² and s' = ${ksRound1(dynamicStiffnessMNm3)} MN/m³.`,
      `Steel carrier correction applied ${ksRound1(effectiveDeltaLw)} dB of the ${roundedDeltaLw} dB upper-package reduction against a ${roundedBareReferenceLnW} dB bare steel reference.`,
      `Corridor tolerance is +/-${STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB} dB for Ln,w and +/-${STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB} dB for DeltaLw until the next source-calibration gate tightens it.`
    ],
    predictorResonanceHz: ksRound1(predictorResonanceHz),
    resilientDynamicStiffnessMNm3: ksRound1(dynamicStiffnessMNm3),
    scope: "steel_floor_formula_corridor",
    standardMethod: "gate_ad_steel_floor_mass_spring_holdout_corridor_v1"
  };
}

function corridorFor(estimate: number, toleranceDb: number): GateADSteelFloorImpactFormulaCorridorMetric {
  return {
    estimate,
    max: ksRound1(estimate + toleranceDb),
    min: ksRound1(estimate - toleranceDb),
    toleranceDb
  };
}

export function buildGateADSteelFloorImpactFormulaCorridorContract(
  input: GateADSteelFloorImpactFormulaCorridorContractInput
): GateADSteelFloorImpactFormulaCorridorContract {
  const exactSourceRowAvailable = input.exactSourceRowAvailable === true;
  const missingPhysicalInputs = exactSourceRowAvailable
    ? []
    : missingSteelFormulaInputs(input.impactPredictorInput);
  const impact = exactSourceRowAvailable || missingPhysicalInputs.length > 0 || !input.impactPredictorInput
    ? null
    : estimateSteelFloorImpactFromPredictorInput(input.impactPredictorInput);
  const status: GateADSteelFloorImpactFormulaStatus = exactSourceRowAvailable
    ? "exact_source_precedence"
    : input.impactPredictorInput?.structuralSupportType !== "steel_joists"
      ? "not_steel_floor"
      : missingPhysicalInputs.length > 0 || !impact
        ? "needs_input"
        : "formula_corridor_ready";
  const lnWCorridor = typeof impact?.LnW === "number"
    ? corridorFor(impact.LnW, STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB)
    : null;
  const deltaLwCorridor = typeof impact?.DeltaLw === "number"
    ? corridorFor(impact.DeltaLw, STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB)
    : null;
  const holdoutComparison =
    input.holdoutSourceId && typeof input.holdoutActualLnW === "number" && impact?.LnW && lnWCorridor
      ? [
          {
            absoluteErrorDb: ksRound1(Math.abs(impact.LnW - input.holdoutActualLnW)),
            actualLnW: input.holdoutActualLnW,
            predictedLnW: impact.LnW,
            sourceId: input.holdoutSourceId,
            withinCorridor:
              input.holdoutActualLnW >= lnWCorridor.min &&
              input.holdoutActualLnW <= lnWCorridor.max
          }
        ]
      : [];

  return {
    basisBoundaries: BASIS_BOUNDARIES,
    corridor: {
      DeltaLw: deltaLwCorridor,
      LnW: lnWCorridor
    },
    formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
    holdoutComparisons: holdoutComparison,
    impact,
    landedGate: "gate_ad_steel_floor_impact_formula_numeric_corridor_plan",
    missingPhysicalInputs,
    previousLandedGate: "gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan",
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: "gate_ae_steel_floor_formula_card_and_report_parity_plan",
    selectedNextFile:
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts",
    selectionStatus:
      "gate_ad_steel_floor_impact_formula_corridor_landed_selected_card_report_parity_gate_ae",
    sourceRowsRequiredForRuntimeSelection: false,
    status,
    targetOutputs: input.targetOutputs
  };
}

const COMPLETE_OPEN_WEB_STEEL_INPUT = {
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
} as const satisfies ImpactPredictorInput;

const PLITEQ_STEEL_JOIST_VINYL_HOLDOUT_INPUT = {
  baseSlab: {
    thicknessMm: 250
  },
  carrierSpacingMm: 600,
  floatingScreed: {
    densityKgM3: 1250,
    materialClass: "cement_board",
    thicknessMm: 19
  },
  floorCovering: {
    densityKgM3: 1400,
    materialClass: "vinyl_flooring",
    mode: "material_layer",
    thicknessMm: 2.5
  },
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 27.3,
  lowerTreatment: {
    boardLayerCount: 2,
    boardMaterialClass: "firestop_board",
    boardThicknessMm: 16,
    cavityDepthMm: 120,
    cavityFillThicknessMm: 100,
    supportClass: "furred_channels",
    type: "suspended_ceiling_elastic_hanger"
  },
  resilientLayer: {
    dynamicStiffnessMNm3: 157,
    productId: "geniemat_rst02",
    thicknessMm: 2
  },
  structuralSupportType: "steel_joists",
  supportForm: "joist_or_purlin"
} as const satisfies ImpactPredictorInput;

const PLITEQ_STEEL_JOIST_PORCELAIN_HOLDOUT_INPUT = {
  ...PLITEQ_STEEL_JOIST_VINYL_HOLDOUT_INPUT,
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
} as const satisfies ImpactPredictorInput;

export function buildGateADSteelFloorImpactFormulaScenarioPack(): readonly GateADSteelFloorImpactFormulaScenarioPackEntry[] {
  const targetOutputs = ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

  return [
    {
      contract: buildGateADSteelFloorImpactFormulaCorridorContract({
        impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
        targetOutputs
      }),
      description: "Complete source-absent open-web steel floor now has a formula-backed lab impact corridor.",
      id: "gate_ad_complete_open_web_steel_formula_runtime"
    },
    {
      contract: buildGateADSteelFloorImpactFormulaCorridorContract({
        holdoutActualLnW: 58,
        holdoutSourceId: "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
        impactPredictorInput: PLITEQ_STEEL_JOIST_VINYL_HOLDOUT_INPUT,
        targetOutputs
      }),
      description: "Pliteq steel-joist RST02 vinyl row is a same-family holdout for the joist/purlin formula lane.",
      id: "gate_ad_pliteq_steel_joist_vinyl_holdout"
    },
    {
      contract: buildGateADSteelFloorImpactFormulaCorridorContract({
        holdoutActualLnW: 60,
        holdoutSourceId: "pliteq_steel_joist_250_rst12_porcelain_lab_2026",
        impactPredictorInput: PLITEQ_STEEL_JOIST_PORCELAIN_HOLDOUT_INPUT,
        targetOutputs
      }),
      description: "Pliteq steel-joist RST12 porcelain row is a hard-finish holdout for the formula lane.",
      id: "gate_ad_pliteq_steel_joist_porcelain_holdout"
    },
    {
      contract: buildGateADSteelFloorImpactFormulaCorridorContract({
        impactPredictorInput: {
          ...COMPLETE_OPEN_WEB_STEEL_INPUT,
          carrierSpacingMm: undefined
        },
        targetOutputs
      }),
      description: "Missing steel carrier spacing blocks formula selection and broad steel-family blending.",
      id: "gate_ad_missing_carrier_spacing_blocks_family_blend"
    },
    {
      contract: buildGateADSteelFloorImpactFormulaCorridorContract({
        exactSourceRowAvailable: true,
        impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
        targetOutputs
      }),
      description: "Exact measured rows remain above the formula corridor in runtime precedence.",
      id: "gate_ad_exact_source_stays_precedence"
    }
  ];
}

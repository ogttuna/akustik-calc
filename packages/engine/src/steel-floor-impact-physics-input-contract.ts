import {
  AcousticInputCompletenessSchema,
  type AcousticInputCompleteness,
  type AcousticInputFieldId,
  type ImpactPredictorInput,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";

import {
  maybeBuildImpactPredictorInputFromLayerStack
} from "./impact-predictor-input";
import type {
  DynamicCalculatorPromptSource,
  DynamicCalculatorRouteInputPrompt
} from "./dynamic-calculator-route-input-topology";

export type GateACSteelFloorPhysicsScenarioId =
  | "gate_ac_complete_open_web_steel_floor_formula_corridor_ready"
  | "gate_ac_exact_source_can_promote_without_formula"
  | "gate_ac_generic_construction_image_steel_floor_needs_physical_inputs"
  | "gate_ac_missing_carrier_spacing_nearby_negative"
  | "gate_ac_missing_lower_isolation_nearby_negative";

export type GateACSteelFloorPhysicsStatus =
  | "exact_source_can_promote_without_formula"
  | "needs_input"
  | "not_steel_floor"
  | "ready_for_formula_corridor_gate";

export type GateACSteelFloorPhysicsFormulaLaneId =
  | "steel_joist_or_purlin_mass_spring_delta_lnw"
  | "steel_open_web_mass_spring_delta_lnw";

export type GateACSteelFloorPhysicsFormulaLane = {
  appliesToSupportForm: "joist_or_purlin" | "open_web_or_rolled";
  laneId: GateACSteelFloorPhysicsFormulaLaneId;
  requiredFormulaOwners: readonly string[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  status: "needs_input" | "not_applicable" | "ready_for_formula_corridor_gate";
};

export type GateACSteelFloorPhysicsInputContractInput = {
  exactSourceRowAvailable?: boolean;
  impactPredictorInput?: ImpactPredictorInput;
  layers?: readonly LayerInput[];
  matchingImpactPackageSourceRowAvailable?: boolean;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateACSteelFloorPhysicsInputContract = {
  basisBoundaries: readonly string[];
  formulaCorridorReady: boolean;
  formulaLanes: readonly GateACSteelFloorPhysicsFormulaLane[];
  inputCompleteness: AcousticInputCompleteness | null;
  landedGate: "gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan";
  missingFormulaOwners: readonly string[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  normalizedPredictorInput: ImpactPredictorInput | null;
  precedenceOrder: readonly string[];
  previousLandedGate: "gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan";
  prompts: readonly DynamicCalculatorRouteInputPrompt[];
  requiredFormulaOwners: readonly string[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  runtimePromotionAllowedInGateAC: false;
  runtimeValueMovement: false;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: "gate_ad_steel_floor_impact_formula_numeric_corridor_plan";
  selectedNextFile: "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts";
  selectionStatus: "gate_ac_steel_floor_physics_input_contract_landed_selected_formula_corridor_gate_ad";
  sourceRowsRequiredForInputContract: false;
  sourceRowsRequiredForRuntimeSelection: false;
  status: GateACSteelFloorPhysicsStatus;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateACSteelFloorPhysicsScenarioPackEntry = {
  contract: GateACSteelFloorPhysicsInputContract;
  description: string;
  id: GateACSteelFloorPhysicsScenarioId;
};

const REQUIRED_PHYSICAL_INPUTS = [
  "steelSupportForm",
  "steelCarrierDepthMm",
  "steelCarrierSpacingMm",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2",
  "lowerCeilingIsolationSupportForm"
] as const satisfies readonly AcousticInputFieldId[];

const REQUIRED_FORMULA_OWNERS = [
  "steelFloorMassSpringTransferFunctionOwner",
  "steelCarrierGeometryCalibrationOwner",
  "lowerCeilingIsolationCalibrationOwner",
  "steelFloorSourceHoldoutSetOwner",
  "numericCorridorAcceptanceOwner"
] as const;

const PRECEDENCE_ORDER = [
  "exact_full_stack_measured_source",
  "calibrated_same_family_physics",
  "uncalibrated_family_physics",
  "bound_or_screening_support",
  "needs_input"
] as const;

const BASIS_BOUNDARIES = [
  "lab_element_impact_Ln_w_DeltaLw",
  "field_impact_Lprime_nw_Lprime_nT_w_requires_Gate_Z_context"
] as const;

const GENERIC_STEEL_BASE_MATERIAL_IDS = new Set([
  "lightweight_steel_floor",
  "open_web_steel_floor",
  "open_web_steel_joist",
  "steel_joist_floor"
]);

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

const MODULAR_GENERIC_STEEL_FLOOR_IMAGE_STACK = [
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 10 },
  { floorRole: "floating_screed", materialId: "cement_board", thicknessMm: 18 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 4.5 },
  { floorRole: "base_structure", materialId: "lightweight_steel_floor", thicknessMm: 200 },
  { floorRole: "ceiling_cavity", materialId: "air_gap", thicknessMm: 200 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function hasPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function makePrompt(input: {
  detail: string;
  fieldId: AcousticInputFieldId;
  label: string;
  source: DynamicCalculatorPromptSource;
  targetOutputs: readonly RequestedOutputId[];
}): DynamicCalculatorRouteInputPrompt {
  return {
    detail: input.detail,
    fieldId: input.fieldId,
    label: input.label,
    promptId: input.fieldId,
    source: input.source,
    targetOutputs: input.targetOutputs
  };
}

function buildFallbackSteelInputFromLayers(layers: readonly LayerInput[]): ImpactPredictorInput | null {
  const baseLayer = layers.find(
    (layer) => layer.floorRole === "base_structure" && GENERIC_STEEL_BASE_MATERIAL_IDS.has(layer.materialId)
  );

  if (!baseLayer) {
    return null;
  }

  return {
    baseSlab: {
      thicknessMm: baseLayer.thicknessMm
    },
    structuralSupportType: "steel_joists"
  };
}

function resolvePredictorInput(
  input: GateACSteelFloorPhysicsInputContractInput
): ImpactPredictorInput | null {
  if (input.impactPredictorInput) {
    return input.impactPredictorInput;
  }

  if (!input.layers) {
    return null;
  }

  return (
    maybeBuildImpactPredictorInputFromLayerStack(input.layers) ??
    buildFallbackSteelInputFromLayers(input.layers)
  );
}

function hasCompleteLowerIsolation(input: ImpactPredictorInput): boolean {
  const lower = input.lowerTreatment;

  return Boolean(
    lower?.type &&
      lower.type !== "none" &&
      lower.supportClass &&
      hasPositiveNumber(lower.cavityDepthMm) &&
      (
        hasPositiveNumber(lower.boardThicknessMm) ||
        (Array.isArray(lower.boardThicknessScheduleMm) && lower.boardThicknessScheduleMm.length > 0)
      )
  );
}

function buildMissingPhysicalInputs(input: {
  exactSourceRowAvailable: boolean;
  matchingImpactPackageSourceRowAvailable: boolean;
  predictorInput: ImpactPredictorInput | null;
}): AcousticInputFieldId[] {
  if (input.exactSourceRowAvailable || input.predictorInput?.structuralSupportType !== "steel_joists") {
    return [];
  }

  const missing: AcousticInputFieldId[] = [];
  const predictorInput = input.predictorInput;

  if (!predictorInput.supportForm) {
    missing.push("steelSupportForm");
  }

  if (!hasPositiveNumber(predictorInput.baseSlab?.thicknessMm)) {
    missing.push("steelCarrierDepthMm");
  }

  if (!hasPositiveNumber(predictorInput.carrierSpacingMm)) {
    missing.push("steelCarrierSpacingMm");
  }

  if (
    !input.matchingImpactPackageSourceRowAvailable &&
    !hasPositiveNumber(predictorInput.resilientLayer?.dynamicStiffnessMNm3)
  ) {
    missing.push("resilientLayerDynamicStiffnessMNm3");
  }

  if (!hasPositiveNumber(predictorInput.loadBasisKgM2)) {
    missing.push("loadBasisKgM2");
  }

  if (!hasCompleteLowerIsolation(predictorInput)) {
    missing.push("lowerCeilingIsolationSupportForm");
  }

  return missing;
}

function promptFor(
  fieldId: AcousticInputFieldId,
  targetOutputs: readonly RequestedOutputId[]
): DynamicCalculatorRouteInputPrompt {
  const promptByField: Record<
    (typeof REQUIRED_PHYSICAL_INPUTS)[number],
    {
      detail: string;
      label: string;
      source: DynamicCalculatorPromptSource;
    }
  > = {
    loadBasisKgM2: {
      detail: "Enter the surface load basis for the steel floor package before formula-backed impact prediction.",
      label: "Steel floor load basis",
      source: "floor_role"
    },
    lowerCeilingIsolationSupportForm: {
      detail: "Describe the lower ceiling isolation, support class, cavity depth, and board schedule.",
      label: "Lower ceiling isolation",
      source: "floor_role"
    },
    resilientLayerDynamicStiffnessMNm3: {
      detail: "Enter dynamic stiffness for the upper impact isolation layer or attach a truly matching source row.",
      label: "Upper impact dynamic stiffness",
      source: "material_property"
    },
    steelCarrierDepthMm: {
      detail: "Enter steel carrier depth or deck depth in millimetres.",
      label: "Steel carrier depth",
      source: "floor_role"
    },
    steelCarrierSpacingMm: {
      detail: "Enter joist, purlin, or open-web carrier spacing in millimetres.",
      label: "Steel carrier spacing",
      source: "floor_role"
    },
    steelSupportForm: {
      detail: "Choose whether the steel support is open-web/rolled or joist/purlin.",
      label: "Steel support form",
      source: "floor_role"
    }
  };

  const prompt = promptByField[fieldId as (typeof REQUIRED_PHYSICAL_INPUTS)[number]];

  return makePrompt({
    ...prompt,
    fieldId,
    targetOutputs
  });
}

function buildInputCompleteness(input: {
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  targetOutputs: readonly RequestedOutputId[];
}): AcousticInputCompleteness {
  return AcousticInputCompletenessSchema.parse({
    conditionalFields: [],
    id: "gate_ac_steel_floor_impact_route_inputs",
    missingPhysicalInputs: [...input.missingPhysicalInputs],
    requiredFields: [...REQUIRED_PHYSICAL_INPUTS],
    routeFamily: "floating_floor_impact",
    status: input.missingPhysicalInputs.length > 0 ? "needs_input" : "complete",
    targetOutputs: [...input.targetOutputs]
  });
}

function buildFormulaLanes(input: {
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  predictorInput: ImpactPredictorInput | null;
}): readonly GateACSteelFloorPhysicsFormulaLane[] {
  const supportForm = input.predictorInput?.supportForm;
  const ready = input.missingPhysicalInputs.length === 0;

  return [
    {
      appliesToSupportForm: "open_web_or_rolled",
      laneId: "steel_open_web_mass_spring_delta_lnw",
      requiredFormulaOwners: REQUIRED_FORMULA_OWNERS,
      requiredPhysicalInputs: REQUIRED_PHYSICAL_INPUTS,
      status:
        supportForm === "open_web_or_rolled"
          ? ready
            ? "ready_for_formula_corridor_gate"
            : "needs_input"
          : "not_applicable"
    },
    {
      appliesToSupportForm: "joist_or_purlin",
      laneId: "steel_joist_or_purlin_mass_spring_delta_lnw",
      requiredFormulaOwners: REQUIRED_FORMULA_OWNERS,
      requiredPhysicalInputs: REQUIRED_PHYSICAL_INPUTS,
      status:
        supportForm === "joist_or_purlin"
          ? ready
            ? "ready_for_formula_corridor_gate"
            : "needs_input"
          : "not_applicable"
    }
  ];
}

function statusFrom(input: {
  exactSourceRowAvailable: boolean;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  predictorInput: ImpactPredictorInput | null;
}): GateACSteelFloorPhysicsStatus {
  if (input.exactSourceRowAvailable) {
    return "exact_source_can_promote_without_formula";
  }

  if (input.predictorInput?.structuralSupportType !== "steel_joists") {
    return "not_steel_floor";
  }

  return input.missingPhysicalInputs.length > 0
    ? "needs_input"
    : "ready_for_formula_corridor_gate";
}

export function buildGateACSteelFloorPhysicsInputContract(
  input: GateACSteelFloorPhysicsInputContractInput
): GateACSteelFloorPhysicsInputContract {
  const exactSourceRowAvailable = input.exactSourceRowAvailable === true;
  const matchingImpactPackageSourceRowAvailable =
    input.matchingImpactPackageSourceRowAvailable === true;
  const predictorInput = resolvePredictorInput(input);
  const missingPhysicalInputs = unique(
    buildMissingPhysicalInputs({
      exactSourceRowAvailable,
      matchingImpactPackageSourceRowAvailable,
      predictorInput
    })
  );
  const status = statusFrom({
    exactSourceRowAvailable,
    missingPhysicalInputs,
    predictorInput
  });
  const formulaCorridorReady = status === "ready_for_formula_corridor_gate";
  const inputCompleteness =
    predictorInput?.structuralSupportType === "steel_joists" && !exactSourceRowAvailable
      ? buildInputCompleteness({
          missingPhysicalInputs,
          targetOutputs: input.targetOutputs
        })
      : null;

  return {
    basisBoundaries: BASIS_BOUNDARIES,
    formulaCorridorReady,
    formulaLanes: buildFormulaLanes({ missingPhysicalInputs, predictorInput }),
    inputCompleteness,
    landedGate: "gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan",
    missingFormulaOwners: formulaCorridorReady ? REQUIRED_FORMULA_OWNERS : [],
    missingPhysicalInputs,
    normalizedPredictorInput: predictorInput,
    precedenceOrder: PRECEDENCE_ORDER,
    previousLandedGate: "gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan",
    prompts: missingPhysicalInputs.map((fieldId) => promptFor(fieldId, input.targetOutputs)),
    requiredFormulaOwners: REQUIRED_FORMULA_OWNERS,
    requiredPhysicalInputs: REQUIRED_PHYSICAL_INPUTS,
    runtimePromotionAllowedInGateAC: false,
    runtimeValueMovement: false,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: "gate_ad_steel_floor_impact_formula_numeric_corridor_plan",
    selectedNextFile:
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts",
    selectionStatus:
      "gate_ac_steel_floor_physics_input_contract_landed_selected_formula_corridor_gate_ad",
    sourceRowsRequiredForInputContract: false,
    sourceRowsRequiredForRuntimeSelection: false,
    status,
    targetOutputs: input.targetOutputs
  };
}

export function buildGateACSteelFloorPhysicsScenarioPack(): readonly GateACSteelFloorPhysicsScenarioPackEntry[] {
  const targetOutputs = ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

  return [
    {
      contract: buildGateACSteelFloorPhysicsInputContract({
        layers: MODULAR_GENERIC_STEEL_FLOOR_IMAGE_STACK,
        targetOutputs
      }),
      description: "Generic construction-image steel floor remains blocked until physical steel support inputs are explicit.",
      id: "gate_ac_generic_construction_image_steel_floor_needs_physical_inputs"
    },
    {
      contract: buildGateACSteelFloorPhysicsInputContract({
        impactPredictorInput: COMPLETE_OPEN_WEB_STEEL_INPUT,
        targetOutputs
      }),
      description: "Complete open-web steel predictor input is ready for Gate AD formula corridor design.",
      id: "gate_ac_complete_open_web_steel_floor_formula_corridor_ready"
    },
    {
      contract: buildGateACSteelFloorPhysicsInputContract({
        impactPredictorInput: {
          ...COMPLETE_OPEN_WEB_STEEL_INPUT,
          carrierSpacingMm: undefined
        },
        targetOutputs
      }),
      description: "Carrier spacing is a nearby negative because source-absent steel formulas depend on geometry.",
      id: "gate_ac_missing_carrier_spacing_nearby_negative"
    },
    {
      contract: buildGateACSteelFloorPhysicsInputContract({
        impactPredictorInput: {
          ...COMPLETE_OPEN_WEB_STEEL_INPUT,
          lowerTreatment: {
            ...COMPLETE_OPEN_WEB_STEEL_INPUT.lowerTreatment,
            supportClass: undefined
          }
        },
        targetOutputs
      }),
      description: "Lower isolation support form is a nearby negative for combined upper/lower steel floors.",
      id: "gate_ac_missing_lower_isolation_nearby_negative"
    },
    {
      contract: buildGateACSteelFloorPhysicsInputContract({
        exactSourceRowAvailable: true,
        impactPredictorInput: {
          structuralSupportType: "steel_joists",
          supportForm: "joist_or_purlin"
        },
        targetOutputs: ["Ln,w"]
      }),
      description: "Exact measured full-stack rows remain the highest-precedence route and do not need formula readiness.",
      id: "gate_ac_exact_source_can_promote_without_formula"
    }
  ];
}

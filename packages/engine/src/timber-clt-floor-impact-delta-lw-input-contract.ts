import {
  AcousticInputCompletenessSchema,
  type AcousticInputCompleteness,
  type AcousticInputFieldId,
  type ImpactPredictorInput,
  type ImpactPredictorStructuralSupportType,
  type LayerInput,
  type RequestedOutputId
} from "@dynecho/shared";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  maybeBuildImpactPredictorInputFromLayerStack
} from "./impact-predictor-input";
import type {
  DynamicCalculatorPromptSource,
  DynamicCalculatorRouteInputPrompt
} from "./dynamic-calculator-route-input-topology";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_LANDED_GATE =
  "gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTION_STATUS =
  "gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_landed_no_runtime_selected_formula_corridor_gate_c";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_ACTION =
  "gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan";

export type GateBTimberCltDeltaLwScenarioId =
  | "gate_b_astm_iic_aiic_boundary_unsupported"
  | "gate_b_clt_complete_ready_for_formula_corridor"
  | "gate_b_exact_lnw_source_precedence_keeps_delta_lw_unpromoted"
  | "gate_b_field_context_non_alias_blocked"
  | "gate_b_missing_dynamic_stiffness_needs_input"
  | "gate_b_missing_load_basis_needs_input"
  | "gate_b_missing_lower_isolation_needs_input"
  | "gate_b_missing_topping_mass_needs_input"
  | "gate_b_timber_joist_complete_ready_for_formula_corridor"
  | "gate_b_wrong_family_steel_not_timber_clt";

export type GateBTimberCltDeltaLwStatus =
  | "blocked_exact_lnw_source_precedence_delta_lw_unpromoted"
  | "blocked_field_basis_non_alias"
  | "needs_input"
  | "not_timber_clt_floor"
  | "ready_for_formula_corridor_gate"
  | "unsupported_astm_rating_basis";

export type GateBTimberCltDeltaLwFormulaLaneId =
  | "mass_timber_clt_dry_floating_delta_lw"
  | "timber_joist_dry_floating_lower_ceiling_delta_lw";

export type GateBTimberCltDeltaLwFormulaLane = {
  appliesToStructuralSupportType: "mass_timber_clt" | "timber_joists";
  laneId: GateBTimberCltDeltaLwFormulaLaneId;
  requiredFormulaOwners: readonly string[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  status: "blocked_by_exact_source_precedence" | "needs_input" | "not_applicable" | "ready_for_formula_corridor_gate";
};

export type GateBTimberCltDeltaLwCurrentRuntimeSnapshot = {
  basisId: string | null;
  deltaLwDb: number | null;
  lnWDb: number | null;
  selectedMethod: string | null;
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
};

export type GateBTimberCltDeltaLwInputContractInput = {
  exactLnWSourceRowAvailable?: boolean;
  impactPredictorInput?: ImpactPredictorInput;
  layers?: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
};

export type GateBTimberCltDeltaLwInputContract = {
  basisBoundaries: readonly string[];
  currentRuntimeSnapshot: GateBTimberCltDeltaLwCurrentRuntimeSnapshot | null;
  deltaLwInventedFromIicOrAiic: false;
  deltaLwInventedFromLnW: false;
  evidenceRowsFromGateA: readonly string[];
  formulaCorridorReady: boolean;
  formulaLanes: readonly GateBTimberCltDeltaLwFormulaLane[];
  inputCompleteness: AcousticInputCompleteness | null;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_LANDED_GATE;
  missingFormulaOwners: readonly string[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  normalizedPredictorInput: ImpactPredictorInput | null;
  precedenceOrder: readonly string[];
  previousLandedGate: "gate_a_personal_use_mvp_coverage_matrix_plan";
  prompts: readonly DynamicCalculatorRouteInputPrompt[];
  requiredFormulaOwners: readonly string[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  runtimePromotionAllowedInGateB: false;
  runtimeValueMovement: false;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTION_STATUS;
  sourceRowsRequiredForInputContract: false;
  sourceRowsRequiredForRuntimeSelection: false;
  status: GateBTimberCltDeltaLwStatus;
  targetOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
};

export type GateBTimberCltDeltaLwScenarioPackEntry = {
  contract: GateBTimberCltDeltaLwInputContract;
  description: string;
  expectedMissingPhysicalInputs: readonly AcousticInputFieldId[];
  expectedStatus: GateBTimberCltDeltaLwStatus;
  id: GateBTimberCltDeltaLwScenarioId;
};

const REQUIRED_PHYSICAL_INPUTS = [
  "baseSlabOrFloor",
  "toppingOrFloatingLayer",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2",
  "ceilingOrLowerAssembly"
] as const satisfies readonly AcousticInputFieldId[];

const REQUIRED_FORMULA_OWNERS = [
  "timberJoistReferenceFloorOwner",
  "massTimberCltReferenceFloorOwner",
  "timberCltUpperTreatmentMassOwner",
  "timberCltDynamicStiffnessTransferOwner",
  "timberCltLowerAssemblyCouplingOwner",
  "timberCltDeltaLwHoldoutSetOwner",
  "timberCltBasisAndToleranceOwner"
] as const;

const PRECEDENCE_ORDER = [
  "exact_full_stack_measured_source_for_requested_metric",
  "same_family_measured_anchor_or_holdout",
  "timber_clt_family_physics_formula_corridor",
  "bound_or_screening_support",
  "needs_input"
] as const;

const BASIS_BOUNDARIES = [
  "ISO_717_2_lab_impact_Ln_w_DeltaLw_only",
  "ASTM_E989_IIC_AIIC_not_aliased_to_DeltaLw",
  "field_impact_Lprime_requires_explicit_field_context_and_not_Gate_B_DeltaLw",
  "exact_Ln_w_source_rows_do_not_create_DeltaLw_without_source_owned_metric_or_formula_gate"
] as const;

const GATE_A_EVIDENCE_ROWS = [
  "floor.timber_joist_impact.lab",
  "floor.clt_mass_timber_impact.lab",
  "floor.complete_field_impact_context.lprime"
] as const;

const ALLOWED_STRUCTURAL_SUPPORTS = new Set<ImpactPredictorStructuralSupportType>([
  "mass_timber_clt",
  "timber_joists"
]);

const LAB_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["DeltaLw", "Ln,w"]);
const FIELD_IMPACT_OUTPUTS = new Set<RequestedOutputId>([
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "LnT,A"
]);
const ASTM_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["AIIC", "HIIC", "IIC", "LIIC"]);

export const GATE_B_TIMBER_JOIST_LAYERS = [
  { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 240 },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

export const GATE_B_CLT_LAYERS = [
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 145 },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: 20 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 70 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 22 }
] as const satisfies readonly LayerInput[];

const COMPLETE_TIMBER_JOIST_INPUT = {
  baseSlab: {
    materialClass: "timber_joist_floor",
    thicknessMm: 240
  },
  floorCovering: {
    densityKgM3: 1150,
    materialClass: "dry_floating_gypsum_fiberboard",
    mode: "material_layer",
    thicknessMm: 25
  },
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 72,
  lowerTreatment: {
    boardLayerCount: 2,
    boardMaterialClass: "gypsum_board",
    boardThicknessMm: 12.5,
    cavityDepthMm: 27,
    cavityFillThicknessMm: 100,
    supportClass: "furred_channels",
    type: "suspended_ceiling_elastic_hanger"
  },
  resilientLayer: {
    dynamicStiffnessMNm3: 30,
    thicknessMm: 30
  },
  structuralSupportType: "timber_joists"
} as const satisfies ImpactPredictorInput;

const COMPLETE_CLT_INPUT = {
  baseSlab: {
    densityKgM3: 470,
    materialClass: "clt_panel",
    thicknessMm: 145
  },
  floorCovering: {
    densityKgM3: 1150,
    materialClass: "dry_floating_gypsum_fiberboard",
    mode: "material_layer",
    thicknessMm: 22
  },
  impactSystemType: "dry_floating_floor",
  loadBasisKgM2: 90,
  lowerTreatment: {
    type: "none"
  },
  resilientLayer: {
    dynamicStiffnessMNm3: 40,
    thicknessMm: 20
  },
  structuralSupportType: "mass_timber_clt",
  upperFill: {
    densityKgM3: 500,
    materialClass: "dry_granular_fill",
    thicknessMm: 70
  }
} as const satisfies ImpactPredictorInput;

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function hasPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function outputsIn(
  targetOutputs: readonly RequestedOutputId[],
  outputSet: ReadonlySet<RequestedOutputId>
): RequestedOutputId[] {
  return targetOutputs.filter((output) => outputSet.has(output));
}

function hasMassDefinedLayer(
  layer: NonNullable<ImpactPredictorInput["floorCovering" | "floatingScreed" | "upperFill"]>
): boolean {
  return (
    hasPositiveNumber(layer.thicknessMm) &&
    (hasPositiveNumber(layer.densityKgM3) || hasPositiveNumber("deltaLwDb" in layer ? layer.deltaLwDb : undefined))
  );
}

function hasToppingOrFloatingMass(input: ImpactPredictorInput): boolean {
  if (input.floorCovering?.mode === "delta_lw_catalog") {
    return false;
  }

  return Boolean(
    (input.floatingScreed && hasMassDefinedLayer(input.floatingScreed)) ||
      (input.upperFill && hasMassDefinedLayer(input.upperFill)) ||
      (input.floorCovering && hasMassDefinedLayer(input.floorCovering))
  );
}

function hasExplicitLowerAssembly(input: ImpactPredictorInput): boolean {
  const lower = input.lowerTreatment;

  if (!lower?.type) {
    return false;
  }

  if (lower.type === "none") {
    return input.impactSystemType === "dry_floating_floor" || input.impactSystemType === "bare_floor";
  }

  return Boolean(
    lower.supportClass &&
      hasPositiveNumber(lower.cavityDepthMm) &&
      (
        hasPositiveNumber(lower.boardThicknessMm) ||
        (Array.isArray(lower.boardThicknessScheduleMm) && lower.boardThicknessScheduleMm.length > 0)
      )
  );
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
    baseSlabOrFloor: {
      detail: "Describe the timber joist or CLT/mass-timber reference floor depth and support family.",
      label: "Timber/CLT reference floor",
      source: "floor_role"
    },
    ceilingOrLowerAssembly: {
      detail: "Enter the lower ceiling/support isolation, or explicitly mark no lower assembly for upper-only CLT routes.",
      label: "Lower ceiling assembly",
      source: "floor_role"
    },
    loadBasisKgM2: {
      detail: "Enter the surface load basis for the timber/CLT impact package before DeltaLw formula promotion.",
      label: "Timber/CLT load basis",
      source: "floor_role"
    },
    resilientLayerDynamicStiffnessMNm3: {
      detail: "Enter dynamic stiffness for the upper resilient layer; do not infer it from IIC or field values.",
      label: "Upper resilient dynamic stiffness",
      source: "material_property"
    },
    toppingOrFloatingLayer: {
      detail: "Enter topping/floating layer thickness and mass so DeltaLw is calculated from physical input.",
      label: "Topping/floating layer mass",
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

function resolvePredictorInput(
  input: GateBTimberCltDeltaLwInputContractInput
): ImpactPredictorInput | null {
  if (input.impactPredictorInput) {
    return input.impactPredictorInput;
  }

  if (!input.layers) {
    return null;
  }

  return maybeBuildImpactPredictorInputFromLayerStack(input.layers);
}

function buildCurrentRuntimeSnapshot(
  layers: readonly LayerInput[] | undefined,
  targetOutputs: readonly RequestedOutputId[]
): GateBTimberCltDeltaLwCurrentRuntimeSnapshot | null {
  if (!layers) {
    return null;
  }

  const result = calculateImpactOnly(layers, { targetOutputs });

  return {
    basisId: result.impact?.basis ?? result.lowerBoundImpact?.basis ?? null,
    deltaLwDb: result.impact?.DeltaLw ?? null,
    lnWDb: result.impact?.LnW ?? null,
    selectedMethod: result.dynamicImpactTrace?.selectionKind ?? result.impact?.basis ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

function buildMissingPhysicalInputs(input: {
  exactLnWSourceRowAvailable: boolean;
  predictorInput: ImpactPredictorInput | null;
  targetOutputs: readonly RequestedOutputId[];
}): AcousticInputFieldId[] {
  if (
    input.exactLnWSourceRowAvailable ||
    outputsIn(input.targetOutputs, FIELD_IMPACT_OUTPUTS).length > 0 ||
    outputsIn(input.targetOutputs, ASTM_IMPACT_OUTPUTS).length > 0
  ) {
    return [];
  }

  const missing: AcousticInputFieldId[] = [];
  const predictorInput = input.predictorInput;

  if (!predictorInput) {
    return [...REQUIRED_PHYSICAL_INPUTS];
  }

  if (
    !ALLOWED_STRUCTURAL_SUPPORTS.has(predictorInput.structuralSupportType as ImpactPredictorStructuralSupportType) ||
    !hasPositiveNumber(predictorInput.baseSlab?.thicknessMm)
  ) {
    missing.push("baseSlabOrFloor");
  }

  if (!hasToppingOrFloatingMass(predictorInput)) {
    missing.push("toppingOrFloatingLayer");
  }

  if (!hasPositiveNumber(predictorInput.resilientLayer?.dynamicStiffnessMNm3)) {
    missing.push("resilientLayerDynamicStiffnessMNm3");
  }

  if (!hasPositiveNumber(predictorInput.loadBasisKgM2)) {
    missing.push("loadBasisKgM2");
  }

  if (!hasExplicitLowerAssembly(predictorInput)) {
    missing.push("ceilingOrLowerAssembly");
  }

  return missing;
}

function buildInputCompleteness(input: {
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  targetOutputs: readonly RequestedOutputId[];
}): AcousticInputCompleteness {
  return AcousticInputCompletenessSchema.parse({
    id: "gate_b_timber_clt_floor_impact_delta_lw_route_inputs",
    missingPhysicalInputs: [...input.missingPhysicalInputs],
    requiredFields: [...REQUIRED_PHYSICAL_INPUTS],
    routeFamily: "floating_floor_impact",
    status: input.missingPhysicalInputs.length > 0 ? "needs_input" : "complete",
    targetOutputs: [...input.targetOutputs]
  });
}

function buildFormulaLanes(input: {
  basisBlocked: boolean;
  exactLnWSourceRowAvailable: boolean;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  predictorInput: ImpactPredictorInput | null;
}): readonly GateBTimberCltDeltaLwFormulaLane[] {
  const family = input.predictorInput?.structuralSupportType;
  const ready = input.missingPhysicalInputs.length === 0;
  const statusFor = (
    structuralSupportType: "mass_timber_clt" | "timber_joists"
  ): GateBTimberCltDeltaLwFormulaLane["status"] => {
    if (input.basisBlocked) {
      return "not_applicable";
    }

    if (input.exactLnWSourceRowAvailable) {
      return "blocked_by_exact_source_precedence";
    }

    if (family !== structuralSupportType) {
      return "not_applicable";
    }

    return ready ? "ready_for_formula_corridor_gate" : "needs_input";
  };

  return [
    {
      appliesToStructuralSupportType: "timber_joists",
      laneId: "timber_joist_dry_floating_lower_ceiling_delta_lw",
      requiredFormulaOwners: REQUIRED_FORMULA_OWNERS,
      requiredPhysicalInputs: REQUIRED_PHYSICAL_INPUTS,
      status: statusFor("timber_joists")
    },
    {
      appliesToStructuralSupportType: "mass_timber_clt",
      laneId: "mass_timber_clt_dry_floating_delta_lw",
      requiredFormulaOwners: REQUIRED_FORMULA_OWNERS,
      requiredPhysicalInputs: REQUIRED_PHYSICAL_INPUTS,
      status: statusFor("mass_timber_clt")
    }
  ];
}

function statusFrom(input: {
  exactLnWSourceRowAvailable: boolean;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  predictorInput: ImpactPredictorInput | null;
  targetOutputs: readonly RequestedOutputId[];
}): GateBTimberCltDeltaLwStatus {
  if (input.exactLnWSourceRowAvailable) {
    return "blocked_exact_lnw_source_precedence_delta_lw_unpromoted";
  }

  if (outputsIn(input.targetOutputs, ASTM_IMPACT_OUTPUTS).length > 0) {
    return "unsupported_astm_rating_basis";
  }

  if (outputsIn(input.targetOutputs, FIELD_IMPACT_OUTPUTS).length > 0) {
    return "blocked_field_basis_non_alias";
  }

  if (
    input.predictorInput?.structuralSupportType &&
    !ALLOWED_STRUCTURAL_SUPPORTS.has(input.predictorInput.structuralSupportType)
  ) {
    return "not_timber_clt_floor";
  }

  return input.missingPhysicalInputs.length > 0
    ? "needs_input"
    : "ready_for_formula_corridor_gate";
}

export function buildGateBTimberCltDeltaLwInputContract(
  input: GateBTimberCltDeltaLwInputContractInput
): GateBTimberCltDeltaLwInputContract {
  const exactLnWSourceRowAvailable = input.exactLnWSourceRowAvailable === true;
  const predictorInput = resolvePredictorInput(input);
  const missingPhysicalInputs = unique(
    buildMissingPhysicalInputs({
      exactLnWSourceRowAvailable,
      predictorInput,
      targetOutputs: input.targetOutputs
    })
  );
  const status = statusFrom({
    exactLnWSourceRowAvailable,
    missingPhysicalInputs,
    predictorInput,
    targetOutputs: input.targetOutputs
  });
  const basisBlocked =
    outputsIn(input.targetOutputs, ASTM_IMPACT_OUTPUTS).length > 0 ||
    outputsIn(input.targetOutputs, FIELD_IMPACT_OUTPUTS).length > 0;
  const formulaCorridorReady = status === "ready_for_formula_corridor_gate";
  const isLabDeltaRoute =
    !exactLnWSourceRowAvailable &&
    outputsIn(input.targetOutputs, LAB_IMPACT_OUTPUTS).includes("DeltaLw") &&
    (status === "ready_for_formula_corridor_gate" || status === "needs_input");
  const unsupportedOutputs = unique([
    ...outputsIn(input.targetOutputs, ASTM_IMPACT_OUTPUTS),
    ...outputsIn(input.targetOutputs, FIELD_IMPACT_OUTPUTS)
  ]);

  return {
    basisBoundaries: BASIS_BOUNDARIES,
    currentRuntimeSnapshot: buildCurrentRuntimeSnapshot(input.layers, input.targetOutputs),
    deltaLwInventedFromIicOrAiic: false,
    deltaLwInventedFromLnW: false,
    evidenceRowsFromGateA: GATE_A_EVIDENCE_ROWS,
    formulaCorridorReady,
    formulaLanes: buildFormulaLanes({
      basisBlocked,
      exactLnWSourceRowAvailable,
      missingPhysicalInputs,
      predictorInput
    }),
    inputCompleteness: isLabDeltaRoute
      ? buildInputCompleteness({
          missingPhysicalInputs,
          targetOutputs: input.targetOutputs
        })
      : null,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_LANDED_GATE,
    missingFormulaOwners: formulaCorridorReady ? REQUIRED_FORMULA_OWNERS : [],
    missingPhysicalInputs,
    normalizedPredictorInput: predictorInput,
    precedenceOrder: PRECEDENCE_ORDER,
    previousLandedGate: "gate_a_personal_use_mvp_coverage_matrix_plan",
    prompts: missingPhysicalInputs.map((fieldId) => promptFor(fieldId, input.targetOutputs)),
    requiredFormulaOwners: REQUIRED_FORMULA_OWNERS,
    requiredPhysicalInputs: REQUIRED_PHYSICAL_INPUTS,
    runtimePromotionAllowedInGateB: false,
    runtimeValueMovement: false,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_SELECTION_STATUS,
    sourceRowsRequiredForInputContract: false,
    sourceRowsRequiredForRuntimeSelection: false,
    status,
    targetOutputs: input.targetOutputs,
    unsupportedOutputs
  };
}

export function buildGateBTimberCltDeltaLwScenarioPack(): readonly GateBTimberCltDeltaLwScenarioPackEntry[] {
  const labOutputs = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

  return [
    {
      contract: buildGateBTimberCltDeltaLwInputContract({
        impactPredictorInput: COMPLETE_TIMBER_JOIST_INPUT,
        layers: GATE_B_TIMBER_JOIST_LAYERS,
        targetOutputs: labOutputs
      }),
      description:
        "Complete timber joist input is ready for the next formula corridor while current runtime still exposes exact Ln,w only.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "ready_for_formula_corridor_gate",
      id: "gate_b_timber_joist_complete_ready_for_formula_corridor"
    },
    {
      contract: buildGateBTimberCltDeltaLwInputContract({
        impactPredictorInput: COMPLETE_CLT_INPUT,
        layers: GATE_B_CLT_LAYERS,
        targetOutputs: labOutputs
      }),
      description:
        "Complete CLT/mass-timber input is ready for the next formula corridor while current runtime still exposes family Ln,w only.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "ready_for_formula_corridor_gate",
      id: "gate_b_clt_complete_ready_for_formula_corridor"
    },
    {
      contract: buildGateBTimberCltDeltaLwInputContract({
        impactPredictorInput: {
          ...COMPLETE_TIMBER_JOIST_INPUT,
          resilientLayer: {
            ...COMPLETE_TIMBER_JOIST_INPUT.resilientLayer,
            dynamicStiffnessMNm3: undefined
          }
        },
        layers: GATE_B_TIMBER_JOIST_LAYERS,
        targetOutputs: labOutputs
      }),
      description:
        "Missing upper resilient-layer dynamic stiffness is a needs_input blocker, not a reason to infer DeltaLw from IIC.",
      expectedMissingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3"],
      expectedStatus: "needs_input",
      id: "gate_b_missing_dynamic_stiffness_needs_input"
    },
    {
      contract: buildGateBTimberCltDeltaLwInputContract({
        impactPredictorInput: {
          ...COMPLETE_TIMBER_JOIST_INPUT,
          loadBasisKgM2: undefined
        },
        layers: GATE_B_TIMBER_JOIST_LAYERS,
        targetOutputs: labOutputs
      }),
      description:
        "Missing load basis blocks formula promotion because timber/CLT DeltaLw depends on loaded upper mass.",
      expectedMissingPhysicalInputs: ["loadBasisKgM2"],
      expectedStatus: "needs_input",
      id: "gate_b_missing_load_basis_needs_input"
    },
    {
      contract: buildGateBTimberCltDeltaLwInputContract({
        impactPredictorInput: {
          ...COMPLETE_CLT_INPUT,
          floorCovering: {
            ...COMPLETE_CLT_INPUT.floorCovering,
            densityKgM3: undefined
          },
          upperFill: {
            ...COMPLETE_CLT_INPUT.upperFill,
            densityKgM3: undefined
          }
        },
        layers: GATE_B_CLT_LAYERS,
        targetOutputs: labOutputs
      }),
      description:
        "Missing topping or floating-layer mass blocks source-absent CLT DeltaLw, even when layer names are present.",
      expectedMissingPhysicalInputs: ["toppingOrFloatingLayer"],
      expectedStatus: "needs_input",
      id: "gate_b_missing_topping_mass_needs_input"
    },
    {
      contract: buildGateBTimberCltDeltaLwInputContract({
        impactPredictorInput: {
          ...COMPLETE_TIMBER_JOIST_INPUT,
          lowerTreatment: undefined
        },
        layers: GATE_B_TIMBER_JOIST_LAYERS,
        targetOutputs: labOutputs
      }),
      description:
        "Missing lower ceiling/isolation context blocks combined timber joist DeltaLw instead of silently assuming a ceiling.",
      expectedMissingPhysicalInputs: ["ceilingOrLowerAssembly"],
      expectedStatus: "needs_input",
      id: "gate_b_missing_lower_isolation_needs_input"
    },
    {
      contract: buildGateBTimberCltDeltaLwInputContract({
        impactPredictorInput: COMPLETE_TIMBER_JOIST_INPUT,
        layers: GATE_B_TIMBER_JOIST_LAYERS,
        targetOutputs: ["IIC", "AIIC"]
      }),
      description:
        "ASTM IIC/AIIC requests are a separate rating basis and cannot promote ISO lab DeltaLw.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "unsupported_astm_rating_basis",
      id: "gate_b_astm_iic_aiic_boundary_unsupported"
    },
    {
      contract: buildGateBTimberCltDeltaLwInputContract({
        impactPredictorInput: COMPLETE_TIMBER_JOIST_INPUT,
        layers: GATE_B_TIMBER_JOIST_LAYERS,
        targetOutputs: ["L'n,w", "L'nT,w"]
      }),
      description:
        "Field impact outputs remain outside Gate B's lab DeltaLw route and cannot borrow the lab input contract.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "blocked_field_basis_non_alias",
      id: "gate_b_field_context_non_alias_blocked"
    },
    {
      contract: buildGateBTimberCltDeltaLwInputContract({
        exactLnWSourceRowAvailable: true,
        impactPredictorInput: COMPLETE_TIMBER_JOIST_INPUT,
        layers: GATE_B_TIMBER_JOIST_LAYERS,
        targetOutputs: labOutputs
      }),
      description:
        "Exact source precedence still wins for Ln,w but does not fabricate DeltaLw from the exact Ln,w row.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "blocked_exact_lnw_source_precedence_delta_lw_unpromoted",
      id: "gate_b_exact_lnw_source_precedence_keeps_delta_lw_unpromoted"
    },
    {
      contract: buildGateBTimberCltDeltaLwInputContract({
        impactPredictorInput: {
          ...COMPLETE_TIMBER_JOIST_INPUT,
          structuralSupportType: "steel_joists"
        },
        targetOutputs: labOutputs
      }),
      description:
        "Steel floors stay on the existing steel corridor and are not consumed by the timber/CLT Gate B contract.",
      expectedMissingPhysicalInputs: ["baseSlabOrFloor"],
      expectedStatus: "not_timber_clt_floor",
      id: "gate_b_wrong_family_steel_not_timber_clt"
    }
  ];
}

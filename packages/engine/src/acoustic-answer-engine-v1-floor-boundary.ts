import type {
  AcousticAnswerBoundary,
  RequestedOutputId,
  ResolvedLayer
} from "@dynecho/shared";

export const ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ROLELESS_HELPER_ONLY_METHOD =
  "acoustic_calculator_answer_engine_v1_floor_roleless_helper_only_missing_floor_roles";

export const ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_IMPACT_NEEDS_INPUT_METHOD =
  "acoustic_calculator_answer_engine_v1_floor_impact_missing_physical_inputs";

export const ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_UNSUPPORTED_METHOD =
  "acoustic_calculator_answer_engine_v1_floor_astm_iic_aiic_unsupported_boundary";

export const ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_IMPACT_NEEDS_INPUT_METHOD =
  "acoustic_calculator_answer_engine_v1_floor_field_impact_missing_context";

export const ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ROLELESS_HELPER_ONLY_MISSING_INPUTS = [
  "floorRole:base_structure",
  "floorRole:ceiling_board",
  "floorRole:ceiling_cavity",
  "floorRole:ceiling_fill"
] as const;

export const ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_REQUIRED_INPUTS = [
  "astmRatingCurveOwner",
  "astmReferenceContour",
  "testStandardBasis"
] as const;

const FLOOR_HELPER_ONLY_REQUEST_OUTPUTS = new Set<RequestedOutputId>([
  "AIIC",
  "C",
  "CI",
  "CI,50-2500",
  "Ctr",
  "DeltaLw",
  "IIC",
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "Ln,w",
  "Ln,w+CI",
  "Rw"
]);

const FLOOR_ASTM_IIC_AIIC_OUTPUTS = new Set<RequestedOutputId>(["AIIC", "IIC"]);
const FLOOR_FIELD_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["L'n,w", "L'nT,w"]);

const HELPER_ONLY_BASE_MATERIAL_IDS = new Set([
  "open_box_timber_slab",
  "open_web_steel_floor",
  "open_web_steel_joist",
  "steel_joist_floor",
  "timber_joist_floor"
]);

const HELPER_ONLY_BOARD_MATERIAL_IDS = new Set([
  "firestop_board",
  "gypsum_board",
  "impactstop_board"
]);

const HELPER_ONLY_CAVITY_MATERIAL_IDS = new Set([
  "acoustic_hanger_ceiling",
  "air_gap",
  "furring_channel",
  "genieclip_rst",
  "resilient_channel",
  "resilient_stud_ceiling",
  "ubiq_resilient_ceiling"
]);

const UPPER_PACKAGE_MATERIAL_IDS = new Set([
  "carpet_with_foam_underlay",
  "ceramic_tile",
  "dry_floating_gypsum_fiberboard",
  "engineered_timber_flooring",
  "engineered_timber_with_acoustic_underlay",
  "gypsum_fiberboard",
  "inex_floor_panel",
  "laminate_flooring",
  "particleboard_flooring",
  "porcelain_tile",
  "screed",
  "vinyl_flooring"
]);

function hasRequestedFloorHelperOnlyOutput(targetOutputs: readonly RequestedOutputId[]): boolean {
  return targetOutputs.some((output) => FLOOR_HELPER_ONLY_REQUEST_OUTPUTS.has(output));
}

function hasPorousFill(layer: ResolvedLayer): boolean {
  return (
    layer.material.category === "insulation" ||
    layer.material.acoustic?.behavior === "porous_absorber" ||
    layer.material.id === "rockwool"
  );
}

export function isAnswerEngineV1RolelessHelperOnlyFloorStack(input: {
  layers: readonly ResolvedLayer[];
  targetOutputs: readonly RequestedOutputId[];
}): boolean {
  if (
    input.layers.length < 4 ||
    input.layers.some((layer) => Boolean(layer.floorRole)) ||
    !hasRequestedFloorHelperOnlyOutput(input.targetOutputs)
  ) {
    return false;
  }

  const hasBase = input.layers.some((layer) => HELPER_ONLY_BASE_MATERIAL_IDS.has(layer.material.id));
  const hasCeilingBoard = input.layers.some((layer) => HELPER_ONLY_BOARD_MATERIAL_IDS.has(layer.material.id));
  const hasCeilingCavity = input.layers.some((layer) => HELPER_ONLY_CAVITY_MATERIAL_IDS.has(layer.material.id));
  const hasCeilingFill = input.layers.some(hasPorousFill);
  const hasUpperPackage = input.layers.some((layer) => UPPER_PACKAGE_MATERIAL_IDS.has(layer.material.id));

  return hasBase && hasCeilingBoard && hasCeilingCavity && hasCeilingFill && !hasUpperPackage;
}

export function buildAnswerEngineV1FloorRolelessHelperOnlyBoundary(
  targetOutputs: readonly RequestedOutputId[]
): AcousticAnswerBoundary {
  return {
    method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ROLELESS_HELPER_ONLY_METHOD,
    missingPhysicalInputs: [
      ...ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ROLELESS_HELPER_ONLY_MISSING_INPUTS
    ],
    origin: "needs_input",
    requiredInputs: [
      ...ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ROLELESS_HELPER_ONLY_MISSING_INPUTS
    ],
    route: "floor",
    unsupportedOutputs: [...targetOutputs]
  };
}

export function buildAnswerEngineV1FloorImpactNeedsInputBoundary(input: {
  missingPhysicalInputs: readonly string[];
  targetOutputs: readonly RequestedOutputId[];
}): AcousticAnswerBoundary | null {
  if (input.missingPhysicalInputs.length === 0 || input.targetOutputs.length === 0) {
    return null;
  }

  return {
    method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_IMPACT_NEEDS_INPUT_METHOD,
    missingPhysicalInputs: [...input.missingPhysicalInputs],
    origin: "needs_input",
    requiredInputs: [...input.missingPhysicalInputs],
    route: "floor",
    unsupportedOutputs: [...input.targetOutputs]
  };
}

export function buildAnswerEngineV1FloorAstmIicAiicUnsupportedBoundary(
  targetOutputs: readonly RequestedOutputId[]
): AcousticAnswerBoundary | null {
  const unsupportedOutputs = targetOutputs.filter((output) => FLOOR_ASTM_IIC_AIIC_OUTPUTS.has(output));
  if (unsupportedOutputs.length === 0) {
    return null;
  }

  return {
    method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_UNSUPPORTED_METHOD,
    missingPhysicalInputs: [],
    origin: "unsupported",
    requiredInputs: [...ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_ASTM_IIC_AIIC_REQUIRED_INPUTS],
    route: "floor",
    unsupportedOutputs
  };
}

export function isAnswerEngineV1PureFloorAstmIicAiicRequest(input: {
  supportedTargetOutputs: readonly RequestedOutputId[];
  targetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
}): boolean {
  if (input.targetOutputs.length === 0 || input.supportedTargetOutputs.length > 0) {
    return false;
  }

  const unsupportedOutputSet = new Set(input.unsupportedTargetOutputs);
  return input.targetOutputs.every(
    (output) => FLOOR_ASTM_IIC_AIIC_OUTPUTS.has(output) && unsupportedOutputSet.has(output)
  );
}

export function buildAnswerEngineV1FloorFieldImpactNeedsInputBoundary(input: {
  missingPhysicalInputs: readonly string[];
  targetOutputs: readonly RequestedOutputId[];
}): AcousticAnswerBoundary | null {
  const unsupportedOutputs = input.targetOutputs.filter((output) => FLOOR_FIELD_IMPACT_OUTPUTS.has(output));
  if (input.missingPhysicalInputs.length === 0 || unsupportedOutputs.length === 0) {
    return null;
  }

  return {
    method: ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_IMPACT_NEEDS_INPUT_METHOD,
    missingPhysicalInputs: [...input.missingPhysicalInputs],
    origin: "needs_input",
    requiredInputs: [...input.missingPhysicalInputs],
    route: "floor",
    unsupportedOutputs
  };
}

export function isAnswerEngineV1PureFloorFieldImpactRequest(input: {
  supportedTargetOutputs: readonly RequestedOutputId[];
  targetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
}): boolean {
  if (input.targetOutputs.length === 0 || input.supportedTargetOutputs.length > 0) {
    return false;
  }

  const unsupportedOutputSet = new Set(input.unsupportedTargetOutputs);
  return input.targetOutputs.every(
    (output) => FLOOR_FIELD_IMPACT_OUTPUTS.has(output) && unsupportedOutputSet.has(output)
  );
}

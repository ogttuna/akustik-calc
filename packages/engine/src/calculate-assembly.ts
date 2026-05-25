import {
  AssemblyCalculationSchema,
  AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE,
  AirborneContextSchema,
  type AirborneCandidate,
  type AirborneCalculator,
  type AirborneCalculatorId,
  type AirborneCandidateResolution,
  ExactImpactSourceSchema,
  ImpactFieldContextSchema,
  ImpactPredictorInputSchema,
  LayerInputSchema,
  type AcousticAnswerBoundary,
  type AirborneResultBasis,
  type AssemblyCalculation,
  type AirborneContext,
  type FloorSystemAirborneRatings,
  type FloorSystemBoundEstimateResult,
  type FloorSystemBoundMatchResult,
  type FloorSystemEstimateResult,
  type FloorSystemMatchResult,
  type ExactFloorSystem,
  type ExactImpactSource,
  type ImpactCalculation,
  type ImpactFieldContext,
  type ImpactPredictorInput,
  type LayerInput,
  type MaterialDefinition,
  type RequestedOutputId,
  type ResolvedLayer,
  type AssemblyRatings,
  type TransmissionLossCurve,
  getFloorSystemC,
  getFloorSystemCtr
} from "@dynecho/shared";

import { buildCalibratedMassLawCurve, buildRatingsFromCurve } from "./curve-rating";
import { applyAirborneContextOverlay } from "./apply-airborne-context";
import { AIRBORNE_CALCULATORS, calculateAirborneCalculatorResult } from "./airborne-calculator";
import {
  buildFailClosedAssemblyResult,
  evaluateAssemblyInputGuard
} from "./assembly-input-guardrail";
import {
  buildAnswerEngineV1FloorAstmIicAiicUnsupportedBoundary,
  buildAnswerEngineV1FloorFieldImpactNeedsInputBoundary,
  buildAnswerEngineV1FloorImpactNeedsInputBoundary,
  buildAnswerEngineV1FloorRolelessHelperOnlyBoundary,
  isAnswerEngineV1PureFloorAstmIicAiicRequest,
  isAnswerEngineV1PureFloorFieldImpactRequest,
  isAnswerEngineV1RolelessHelperOnlyFloorStack
} from "./acoustic-answer-engine-v1-floor-boundary";
import {
  auditAcousticCalculatorAnswerEngineV1OutputOwnership,
  getAcousticCalculatorAnswerEngineV1FloorLabCompanionOutputs
} from "./acoustic-answer-engine-v1-owner-audit";
import { applyApproximateAirborneFieldCompanion, applyVerifiedAirborneCatalogAnchor } from "./airborne-verified-catalog";
import { classifyLayerRole, materialText } from "./airborne-topology";
import { calculateDynamicAirborneResult } from "./dynamic-airborne";
import { PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD } from "./gate-ay-advanced-wall-runtime-constants";
import { GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING } from "./dynamic-airborne-gate-l-building-prediction-boundary";
import { GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING } from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import {
  GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_WARNING,
  maybeBuildGateYCltMassTimberCtrSpectrumAdapterBasis
} from "./dynamic-airborne-gate-y-clt-mass-timber-ctr-spectrum-adapter";
import {
  maybeBuildGateSOpeningLeakCompositeRuntimeCorridor
} from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import {
  maybeBuildCompanyInternalOpeningLeakFieldBuildingRuntimeCorridor
} from "./company-internal-opening-leak-building-runtime-corridor";
import {
  maybeBuildGateAHOpeningLeakStcSpectrumAdapter
} from "./dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter";
import {
  buildDynamicCalculatorCandidateResolverRuntime,
  inferDynamicCalculatorRuntimeRoute
} from "./dynamic-calculator-candidate-resolver-runtime";
import {
  buildLayerCombinationResolverTraceForAssembly
} from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  type DynamicCalculatorFloorImpactContext
} from "./dynamic-calculator-route-input-topology";
import {
  buildGateVFloorImpactDynamicStiffnessContract,
  type GateVFloorImpactDynamicStiffnessContract
} from "./dynamic-calculator-floor-impact-dynamic-stiffness-contract";
import {
  buildGateYFloorImpactFieldContextAssessment,
  type GateYFloorImpactFieldContextAssessment
} from "./dynamic-calculator-floor-impact-field-context-contract";
import { clamp, round1 } from "./math";
import { buildEstimateWarnings, estimateRwDb } from "./estimate-rw";
import { hasBoundOnlyUbiqOpenWebCarpetCombinedProfile } from "./bound-only-floor-near-miss";
import { getFloorFamilySourceGuard } from "./floor-family-source-guard";
import { buildFloorSystemRatings } from "./floor-system-ratings";
import {
  ASTM_E989_IMPACT_RATING_BASIS,
  buildOwnedImpactFromExactSource
} from "./impact-astm-e989";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS } from "./open-box-timber-eps-screed-hybrid-package-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";
import { HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS } from "./helper-only-timber-open-web-impact-stack-estimate";
import {
  adaptImpactPredictorInput,
  getRawFloorParityGuardWarning,
  getRawFloorRolePromptGuard,
  getVisibleLayerPredictorBlockerWarning,
  maybeInferFloorRoleLayerStack,
  maybeBuildImpactPredictorInputFromLayerStack,
  mergePredictorCatalog,
  normalizeExplicitFloorRoleLayerStack
} from "./impact-predictor-input";
import {
  buildResolvedImpactArtifacts,
  finalizeResolvedImpactLane,
  resolveLayerBasedImpactLane,
  shouldHideLowConfidenceProxyAirborne
} from "./impact-lane";
import {
  inferImpactSupportingElementFamilyFromLayers,
  inferImpactSupportingElementFamilyFromPredictorInput
} from "./impact-supporting-element-family";
import { computeLayerSurfaceMassKgM2 } from "./layer-surface-mass";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";
import {
  buildHeavyConcreteCombinedImpactFormulaFallbackBlockerWarning
} from "./heavy-concrete-combined-impact-formula-corridor";
import {
  collectTimberCltDeltaLwFormulaMissingPhysicalInputs
} from "./timber-clt-floor-impact-delta-lw-runtime-corridor";
import {
  hasReinforcedConcreteLowConfidenceProxyAirborne,
  REINFORCED_CONCRETE_LOW_CONFIDENCE_PROXY_AIRBORNE_WARNING
} from "./reinforced-concrete-low-confidence-airborne";
import { buildSteelFloorImpactFormulaFallbackBlockerWarning } from "./steel-floor-impact-formula-corridor";
import {
  detectMixedPlainFilledSingleBoardFamily,
  getMixedPlainFilledSingleBoardProfile,
  MIXED_PLAIN_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME
} from "./mixed-plain-filled-single-board-field-corridor";
import {
  detectMixedEnhancedFilledSingleBoardFamily,
  getMixedEnhancedFilledSingleBoardProfile,
  MIXED_ENHANCED_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME
} from "./mixed-enhanced-filled-single-board-corridor";
import {
  detectFireRatedFilledSingleBoardFamily,
  getFireRatedFilledSingleBoardProfile,
  FIRE_RATED_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME
} from "./fire-rated-filled-single-board-corridor";
import {
  detectSecurityFilledSingleBoardFamily,
  getSecurityFilledSingleBoardProfile,
  SECURITY_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME,
  type SecurityFilledSingleBoardFamily
} from "./security-filled-single-board-corridor";
import { inferStructuralSupportTypeFromMaterial } from "./structural-material-classification";
import {
  detectSymmetricEnhancedFilledSingleBoardFamily,
  getSymmetricEnhancedFilledSingleBoardProfile,
  SYMMETRIC_ENHANCED_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME
} from "./symmetric-enhanced-filled-single-board-corridor";
import { withholdRockwoolSplitTripleLeafExactTargetOutputs } from "./rockwool-split-triple-leaf-numeric-source-closure";
import { analyzeTargetOutputSupport, buildTargetOutputWarnings } from "./target-output-support";
import {
  getBroadAccuracyWallTripleLeafLocalSubstitutionRuntimeBlockedOutputs
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING,
  maybeBuildBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapter
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter";
import {
  maybeBuildPostV1WallCompatibleAnchorDelta
} from "./post-v1-wall-compatible-anchor-delta";

export type CalculateAssemblyOptions = {
  airborneContext?: AirborneContext | null;
  calculator?: AirborneCalculatorId | null;
  catalog?: readonly MaterialDefinition[];
  exactImpactSource?: ExactImpactSource | null;
  floorImpactContext?: DynamicCalculatorFloorImpactContext | null;
  impactFieldContext?: ImpactFieldContext | null;
  impactPredictorInput?: ImpactPredictorInput | null;
  targetOutputs?: readonly RequestedOutputId[];
};

const GATE_W_FLOOR_IMPACT_OUTPUTS = new Set<RequestedOutputId>([
  "AIIC",
  "DeltaLw",
  "HIIC",
  "IIC",
  "LIIC",
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "Ln,w",
  "LnT,A"
]);

const GATE_Z_FIELD_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["L'n,w", "L'nT,w", "L'nT,50"]);
const GATE_Z_RUNTIME_READY_FIELD_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["L'n,w", "L'nT,w", "L'nT,50"]);
const GATE_Z_LOW_FREQUENCY_OWNER = "lowFrequencyImpactSpectrumOrCI50_2500Owner";
const GATE_AR_AIRBORNE_BUILDING_PREDICTION_LAB_ALIAS_OUTPUTS = new Set<RequestedOutputId>([
  "C",
  "Ctr",
  "Rw",
  "STC"
]);
const ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLAT_DOUBLE_LEAF_MISSING_INPUTS = [
  "sideALeafGroup",
  "cavity1DepthMm",
  "sideBLeafGroup",
  "frameBridgeClass",
  "supportTopology",
  "supportSpacingMm"
] as const;
const ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_WALL_AIRBORNE_OUTPUTS = new Set<RequestedOutputId>([
  "C",
  "Ctr",
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "R'w",
  "Rw",
  "STC"
]);
const ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_NUMERIC_ORIGINS = new Set([
  "bounded_prediction",
  "calibrated_family_physics",
  "family_physics_prediction",
  "measured_exact_full_stack",
  "measured_exact_subassembly_plus_calculated_delta",
  "screening_fallback"
]);
const ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_EXACT_FLOOR_BASES = new Set([
  "official_floor_system_exact_match",
  "open_measured_floor_system_exact_match"
]);
const ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_CONTINUATION_OUTPUTS = new Set<RequestedOutputId>([
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "L'n,w",
  "L'nT,50",
  "L'nT,w",
  "R'w"
]);

type TargetOutputSupportLike = ReturnType<typeof analyzeTargetOutputSupport>;

function hasGateWFloorImpactRequest(targetOutputs: readonly RequestedOutputId[]): boolean {
  return targetOutputs.some((output) => GATE_W_FLOOR_IMPACT_OUTPUTS.has(output));
}

function hasGateZFloorImpactFieldRequest(targetOutputs: readonly RequestedOutputId[]): boolean {
  return targetOutputs.some((output) => GATE_Z_FIELD_IMPACT_OUTPUTS.has(output));
}

function gateWLabImpactRuntimeReady(
  contract: GateVFloorImpactDynamicStiffnessContract | null
): boolean {
  const labBoundary = contract?.adapterBoundaries.find(
    (boundary) => boundary.adapterId === "ISO_717_2_Lnw_DeltaLw"
  );

  return Boolean(
    labBoundary &&
      labBoundary.status === "ready" &&
      labBoundary.requestedOutputs.length > 0 &&
      labBoundary.missingPhysicalInputs.length === 0
  );
}

function gateZFloorImpactFieldRuntimeReady(
  assessment: GateYFloorImpactFieldContextAssessment | null
): boolean {
  return Boolean(
    assessment &&
      assessment.missingPhysicalInputs.length === 0 &&
      assessment.missingOwnerInputs.every((owner) => owner === GATE_Z_LOW_FREQUENCY_OWNER) &&
      assessment.readyOutputs.some((output) => GATE_Z_RUNTIME_READY_FIELD_IMPACT_OUTPUTS.has(output))
  );
}

function isPostV1GateNPureFieldImpactRequest(targetOutputs: readonly RequestedOutputId[]): boolean {
  return targetOutputs.length > 0 && targetOutputs.every((output) => GATE_Z_FIELD_IMPACT_OUTPUTS.has(output));
}

function hasPostV1GateNFieldKPolicy(context: ImpactFieldContext | null): boolean {
  return Boolean(
    typeof context?.fieldKDb === "number" ||
      typeof context?.guideMassRatio === "number" ||
      typeof context?.directPathOffsetDb === "number" ||
      (Array.isArray(context?.flankingPaths) && context.flankingPaths.length > 0)
  );
}

function hasPostV1GateNReceivingRoomVolume(context: ImpactFieldContext | null): boolean {
  return Boolean(typeof context?.receivingRoomVolumeM3 === "number" && context.receivingRoomVolumeM3 > 0);
}

function hasLowFrequencyImpactOwner(input: ImpactFieldContext | null): boolean {
  return typeof input?.ci50_2500Db === "number" && Number.isFinite(input.ci50_2500Db);
}

function buildGateZFieldImpactRuntimeWarning(
  assessment: GateYFloorImpactFieldContextAssessment | null
): string | null {
  if (!assessment || assessment.requestedOutputs.length === 0) {
    return null;
  }

  if (assessment.missingPhysicalInputs.length > 0) {
    return `Dynamic Calculator floor-impact field runtime is waiting for ${assessment.missingPhysicalInputs.join(", ")} before promoting L'n,w / L'nT,w from the lab impact anchor.`;
  }

  const nonLowFrequencyOwners = assessment.missingOwnerInputs.filter(
    (owner) => owner !== GATE_Z_LOW_FREQUENCY_OWNER
  );
  if (nonLowFrequencyOwners.length > 0) {
    return `Dynamic Calculator floor-impact field runtime is waiting for ${nonLowFrequencyOwners.join(", ")} before promoting L'n,w / L'nT,w from the lab impact anchor.`;
  }

  if (
    assessment.readyOutputs.length === 0 &&
    assessment.blockedOutputs.includes("L'nT,50") &&
    assessment.missingOwnerInputs.includes(GATE_Z_LOW_FREQUENCY_OWNER)
  ) {
    return `Dynamic Calculator floor-impact low-frequency runtime is waiting for ${GATE_Z_LOW_FREQUENCY_OWNER} before promoting L'nT,50.`;
  }

  return null;
}

function moveSupportedOutputsToUnsupported(
  support: TargetOutputSupportLike,
  outputs: readonly RequestedOutputId[]
): TargetOutputSupportLike {
  if (outputs.length === 0) {
    return support;
  }

  const outputSet = new Set(outputs);
  const supportedTargetOutputs = support.supportedTargetOutputs.filter(
    (output) => !outputSet.has(output)
  );
  const unsupportedOutputSet = new Set([
    ...support.unsupportedTargetOutputs,
    ...support.targetOutputs.filter((output) => outputSet.has(output))
  ]);
  const unsupportedTargetOutputs = support.targetOutputs.filter(
    (output) => unsupportedOutputSet.has(output) && !supportedTargetOutputs.includes(output)
  );
  const unsupportedImpactOutputSet = new Set([
    ...support.unsupportedImpactOutputs,
    ...unsupportedTargetOutputs.filter((output) => support.supportedImpactOutputs.includes(output))
  ]);

  return {
    ...support,
    supportedImpactOutputs: support.supportedImpactOutputs.filter((output) => !outputSet.has(output)),
    supportedTargetOutputs,
    unsupportedImpactOutputs: support.targetOutputs.filter((output) =>
      unsupportedImpactOutputSet.has(output)
    ),
    unsupportedTargetOutputs
  };
}

function moveUnsupportedOutputsToSupported(
  support: TargetOutputSupportLike,
  outputs: readonly RequestedOutputId[]
): TargetOutputSupportLike {
  if (outputs.length === 0) {
    return support;
  }

  const outputSet = new Set(outputs);
  const supportedOutputSet = new Set([
    ...support.supportedTargetOutputs,
    ...support.targetOutputs.filter((output) => outputSet.has(output))
  ]);
  const supportedTargetOutputs = support.targetOutputs.filter((output) =>
    supportedOutputSet.has(output)
  );
  const supportedImpactOutputSet = new Set([
    ...support.supportedImpactOutputs,
    ...supportedTargetOutputs.filter((output) => support.unsupportedImpactOutputs.includes(output))
  ]);

  return {
    ...support,
    supportedImpactOutputs: support.targetOutputs.filter((output) =>
      supportedImpactOutputSet.has(output)
    ),
    supportedTargetOutputs,
    unsupportedImpactOutputs: support.unsupportedImpactOutputs.filter((output) => !outputSet.has(output)),
    unsupportedTargetOutputs: support.unsupportedTargetOutputs.filter((output) => !outputSet.has(output))
  };
}

function outputsForExactMeasuredAirborneMetric(metricLabel: string | null | undefined): RequestedOutputId[] {
  switch (metricLabel) {
    case "C":
      return ["C"];
    case "Ctr":
      return ["Ctr"];
    case "Dn,A":
      return ["Dn,A"];
    case "Dn,w":
      return ["Dn,w"];
    case "DnT,A":
      return ["DnT,A"];
    case "Rw":
      return ["Rw"];
    case "DnT,A,k":
      return ["DnT,A,k", "DnT,A"];
    case "DnT,w":
      return ["DnT,w"];
    case "R'w":
      return ["R'w"];
    case "STC":
      return ["STC"];
    default:
      return [];
  }
}

function getAnswerEngineV1ExactMeasuredMetricUnsupportedOutputs(input: {
  resolution: AirborneCandidateResolution | undefined;
  sourceMetricLabel: string | null | undefined;
  supportedTargetOutputs: readonly RequestedOutputId[];
}): RequestedOutputId[] {
  if (input.resolution?.selectedOrigin !== "measured_exact_full_stack") {
    return [];
  }

  const exactOutputs = outputsForExactMeasuredAirborneMetric(input.sourceMetricLabel);
  if (exactOutputs.length === 0) {
    return [...input.supportedTargetOutputs];
  }

  const exactOutputSet = new Set(exactOutputs);
  return input.supportedTargetOutputs.filter((output) => !exactOutputSet.has(output));
}

function getAnswerEngineV1AnchoredDeltaMetricUnsupportedOutputs(input: {
  anchorMetricLabel: string | null | undefined;
  compatibleAnchorDeltaApplied: boolean;
  resolution: AirborneCandidateResolution | undefined;
  supportedTargetOutputs: readonly RequestedOutputId[];
}): RequestedOutputId[] {
  if (
    !input.compatibleAnchorDeltaApplied ||
    input.resolution?.selectedOrigin !== "measured_exact_subassembly_plus_calculated_delta"
  ) {
    return [];
  }

  const anchorOutputs = outputsForExactMeasuredAirborneMetric(input.anchorMetricLabel);
  if (anchorOutputs.length === 0) {
    return [...input.supportedTargetOutputs];
  }

  const anchorOutputSet = new Set(anchorOutputs);
  return input.supportedTargetOutputs.filter((output) => !anchorOutputSet.has(output));
}

function outputsForExactMeasuredFloorSystem(input: {
  floorSystemMatch: FloorSystemMatchResult | null | undefined;
  impact: ImpactCalculation | null | undefined;
}): RequestedOutputId[] {
  if (
    !input.floorSystemMatch ||
    !input.impact ||
    !ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_EXACT_FLOOR_BASES.has(input.impact.basis)
  ) {
    return [];
  }

  const outputs: RequestedOutputId[] = [];
  const airborneRatings = input.floorSystemMatch.system.airborneRatings;

  if (typeof airborneRatings.Rw === "number") {
    outputs.push("Rw");
  }
  if (typeof getFloorSystemC(airborneRatings) === "number") {
    outputs.push("C");
  }
  if (typeof getFloorSystemCtr(airborneRatings) === "number") {
    outputs.push("Ctr");
  }

  for (const output of input.impact.availableOutputs) {
    if (
      output === "Ln,w" ||
      output === "CI" ||
      output === "CI,50-2500" ||
      output === "Ln,w+CI" ||
      output === "DeltaLw"
    ) {
      outputs.push(output);
    }
  }

  return Array.from(new Set(outputs));
}

function getAnswerEngineV1ExactFloorMetricUnsupportedOutputs(input: {
  floorSystemMatch: FloorSystemMatchResult | null | undefined;
  impact: ImpactCalculation | null | undefined;
  supportedTargetOutputs: readonly RequestedOutputId[];
}): RequestedOutputId[] {
  const exactOutputs = outputsForExactMeasuredFloorSystem({
    floorSystemMatch: input.floorSystemMatch,
    impact: input.impact
  });
  if (exactOutputs.length === 0) {
    return [];
  }

  const exactOutputSet = new Set(exactOutputs);
  return input.supportedTargetOutputs.filter(
    (output) =>
      !exactOutputSet.has(output) &&
      !ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_CONTINUATION_OUTPUTS.has(output)
  );
}

function isAnswerEngineV1FlatGypsumAbsorberGypsum(input: {
  airborneContext?: AirborneContext | null;
  layers: readonly ResolvedLayer[];
}): boolean {
  if (input.airborneContext?.wallTopology || input.layers.length !== 3) {
    return false;
  }

  const [left, middle, right] = input.layers;
  if (!left || !middle || !right || input.layers.some((layer) => Boolean(layer.floorRole))) {
    return false;
  }

  return (
    left.material.id === "gypsum_board" &&
    right.material.id === "gypsum_board" &&
    (
      middle.material.id === "rockwool" ||
      middle.material.category === "insulation" ||
      middle.material.acoustic?.behavior === "porous_absorber"
    )
  );
}

function buildAnswerEngineV1FlatDoubleLeafNeedsInputBasis(): AirborneResultBasis {
  return {
    assumptions: [
      "Flat gypsum / porous absorber / gypsum input is physically double-leaf-like but lacks explicit leaf, cavity, and support ownership.",
      "Answer Engine V1 blocks the screening number from becoming the published answer until the double-leaf formula inputs are supplied."
    ],
    calculationStandard: "none",
    curveBasis: "no_curve",
    family: "double_leaf",
    kind: "airborne_needs_input",
    method: "acoustic_calculator_answer_engine_v1_flat_double_leaf_missing_topology",
    missingPhysicalInputs: [...ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLAT_DOUBLE_LEAF_MISSING_INPUTS],
    missingSourceEvidence: [],
    origin: "needs_input",
    propertyDefaults: [],
    ratingStandard: "none",
    requiredInputs: [...ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLAT_DOUBLE_LEAF_MISSING_INPUTS]
  };
}

function buildAnswerEngineV1RejectedCandidate(candidate: AirborneCandidate): AirborneCandidate["rejectionReasons"] {
  if (ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_NUMERIC_ORIGINS.has(candidate.origin)) {
    return [
      {
        code: "missing_physical_input",
        detail:
          "Answer Engine V1 cannot publish this numeric candidate until the flat double-leaf leaf groups, cavity depth, bridge class, support topology, and support spacing are supplied."
      }
    ];
  }

  return [
    {
      code: "lower_precedence_than_selected",
      detail: "Answer Engine V1 selected the missing-input boundary for the published answer."
    }
  ];
}

function selectAnswerEngineV1NeedsInputCandidate(input: {
  basis: AirborneResultBasis;
  resolution: AirborneCandidateResolution;
}): AirborneCandidateResolution {
  const selectedCandidateId = "candidate_dynamic_needs_input";
  const candidates = input.resolution.candidates.map((candidate) => {
    const selected = candidate.id === selectedCandidateId;

    return {
      ...candidate,
      basis: selected ? input.basis : candidate.basis,
      rejectionReasons: selected ? [] : buildAnswerEngineV1RejectedCandidate(candidate),
      selected
    };
  });

  return {
    ...input.resolution,
    candidatePrecedence: [...AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE],
    candidates,
    id: "resolver_acoustic_calculator_answer_engine_v1_flat_double_leaf_needs_input",
    rejectedCandidateIds: candidates.filter((candidate) => !candidate.selected).map((candidate) => candidate.id),
    runtimeValueMovement: false,
    selectedBasis: input.basis,
    selectedCandidateId,
    selectedOrigin: "needs_input"
  };
}

function buildAnswerEngineV1WallNeedsInputBoundary(input: {
  basis: AirborneResultBasis | undefined;
  contextMode?: AirborneContext["contextMode"];
  outputs: readonly RequestedOutputId[];
}): AcousticAnswerBoundary | null {
  if (
    input.basis?.origin !== "needs_input" ||
    input.basis.missingPhysicalInputs.length === 0
  ) {
    return null;
  }

  const unsupportedOutputs = getAnswerEngineV1WallNeedsInputUnsupportedOutputs({
    basis: input.basis,
    contextMode: input.contextMode,
    outputs: input.outputs
  });
  if (unsupportedOutputs.length === 0) {
    return null;
  }

  return {
    method: input.basis.method,
    missingPhysicalInputs: [...input.basis.missingPhysicalInputs],
    origin: "needs_input",
    requiredInputs:
      input.basis.requiredInputs.length > 0
        ? [...input.basis.requiredInputs]
        : [...input.basis.missingPhysicalInputs],
    route: "wall",
    unsupportedOutputs
  };
}

function buildAnswerEngineV1WallUnsupportedBoundary(input: {
  basis: AirborneResultBasis | undefined;
  outputs: readonly RequestedOutputId[];
}): AcousticAnswerBoundary | null {
  if (input.basis?.origin !== "unsupported") {
    return null;
  }

  return {
    method: input.basis.method,
    missingPhysicalInputs: [],
    origin: "unsupported",
    requiredInputs: [...input.basis.requiredInputs],
    route: "wall",
    unsupportedOutputs: input.outputs.filter((output) =>
      ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_WALL_AIRBORNE_OUTPUTS.has(output)
    )
  };
}

function hasAnswerEngineV1WallAirborneOutput(outputs: readonly RequestedOutputId[]): boolean {
  return outputs.some((output) => ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_WALL_AIRBORNE_OUTPUTS.has(output));
}

function hasAnswerEngineV1SupportedWallAirborneOutput(outputs: readonly RequestedOutputId[]): boolean {
  return outputs.some((output) => ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_WALL_AIRBORNE_OUTPUTS.has(output));
}

function hasAnswerEngineV1FieldOrBuildingAirborneOutput(outputs: readonly RequestedOutputId[]): boolean {
  return outputs.some((output) =>
    output === "R'w" ||
    output === "Dn,w" ||
    output === "Dn,A" ||
    output === "DnT,w" ||
    output === "DnT,A" ||
    output === "DnT,A,k"
  );
}

const ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FIELD_CONTEXT_MISSING_INPUTS = new Set([
  "contextMode",
  "partitionAreaM2",
  "panelHeightMm",
  "panelWidthMm",
  "receivingRoomRt60S",
  "receivingRoomVolumeM3"
]);

const ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_GROUPED_TOPOLOGY_MISSING_INPUTS = new Set([
  "sideALeafGroup",
  "cavity1DepthMm",
  "internalLeafGroup",
  "internalLeafCoupling",
  "cavity2DepthMm",
  "sideBLeafGroup",
  "supportTopology"
]);

function hasAnswerEngineV1FieldOrBuildingMissingPhysicalInput(
  basis: AirborneResultBasis | undefined
): boolean {
  return Boolean(
    basis?.origin === "needs_input" &&
      basis.missingPhysicalInputs.some((input) =>
        ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FIELD_CONTEXT_MISSING_INPUTS.has(input)
      )
  );
}

function hasAnswerEngineV1GroupedTopologyMissingPhysicalInput(
  basis: AirborneResultBasis | undefined
): boolean {
  return Boolean(
    basis?.origin === "needs_input" &&
      basis.missingPhysicalInputs.some((input) =>
        ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_GROUPED_TOPOLOGY_MISSING_INPUTS.has(input)
      )
  );
}

function getAnswerEngineV1WallNeedsInputUnsupportedOutputs(input: {
  basis: AirborneResultBasis;
  contextMode?: AirborneContext["contextMode"];
  outputs: readonly RequestedOutputId[];
}): RequestedOutputId[] {
  if (!hasAnswerEngineV1FieldOrBuildingMissingPhysicalInput(input.basis)) {
    return input.outputs.filter((output) =>
      ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_WALL_AIRBORNE_OUTPUTS.has(output)
    );
  }

  if (input.contextMode === "building_prediction") {
    return input.outputs.filter((output) => hasAnswerEngineV1FieldOrBuildingAirborneOutput([output]));
  }

  if (
    input.contextMode === "field_between_rooms" &&
    input.outputs.length > 0 &&
    input.outputs.every((output) => hasAnswerEngineV1FieldOrBuildingAirborneOutput([output]))
  ) {
    return input.outputs.filter((output) => hasAnswerEngineV1FieldOrBuildingAirborneOutput([output]));
  }

  const missingInputs = new Set(input.basis.missingPhysicalInputs);
  const missingFieldGeometry =
    missingInputs.has("contextMode") ||
    missingInputs.has("partitionAreaM2") ||
    missingInputs.has("panelHeightMm") ||
    missingInputs.has("panelWidthMm");
  const missingRoomStandardization =
    missingFieldGeometry ||
    missingInputs.has("receivingRoomRt60S") ||
    missingInputs.has("receivingRoomVolumeM3");

  return input.outputs.filter((output) => {
    if (!hasAnswerEngineV1FieldOrBuildingAirborneOutput([output])) {
      return false;
    }

    if (output === "DnT,w" || output === "DnT,A" || output === "DnT,A,k") {
      return missingRoomStandardization;
    }

    if (output === "R'w" || output === "Dn,w" || output === "Dn,A") {
      return missingFieldGeometry;
    }

    return false;
  });
}

function isAnswerEngineV1WallFieldOrBuildingBoundary(input: {
  basis: AirborneResultBasis | undefined;
  contextMode: AirborneContext["contextMode"] | undefined;
  outputs: readonly RequestedOutputId[];
}): boolean {
  if (!hasAnswerEngineV1WallAirborneOutput(input.outputs)) {
    return false;
  }

  return (
    input.contextMode === "building_prediction" ||
    input.contextMode === "field_between_rooms" ||
    input.basis?.method.includes("building_prediction") === true ||
    (
      input.basis?.origin === "needs_input" &&
      input.basis.missingPhysicalInputs.includes("contextMode") &&
      hasAnswerEngineV1FieldOrBuildingAirborneOutput(input.outputs)
    )
  );
}

function isAnswerEngineV1WallFieldOrBuildingNeedsInputBoundary(input: {
  basis: AirborneResultBasis | undefined;
  contextMode: AirborneContext["contextMode"] | undefined;
  outputs: readonly RequestedOutputId[];
}): boolean {
  if (
    !hasAnswerEngineV1WallAirborneOutput(input.outputs) ||
    !hasAnswerEngineV1FieldOrBuildingMissingPhysicalInput(input.basis)
  ) {
    return false;
  }

  return (
    input.contextMode === "building_prediction" ||
    input.contextMode === "field_between_rooms" ||
    input.basis?.method.includes("building_prediction") === true ||
    hasAnswerEngineV1FieldOrBuildingAirborneOutput(input.outputs)
  );
}

function isAnswerEngineV1WallOwnedPhysicalInputStop(input: {
  basis: AirborneResultBasis | undefined;
  detectedFamily: string | undefined;
  resolution: AirborneCandidateResolution | undefined;
  strategy: string | undefined;
}): boolean {
  return Boolean(
    input.basis?.missingPhysicalInputs.includes("resilientBarSideCount") ||
      (
        input.detectedFamily === "multileaf_multicavity" &&
        input.strategy === "multileaf_screening_blend" &&
        input.resolution?.inputCompletenessIds.includes("gate_k_triple_leaf_multicavity_route_inputs")
      )
  );
}

function isAnswerEngineV1GroupedTopologyNeedsInputBoundary(input: {
  basis: AirborneResultBasis | undefined;
  contextMode: AirborneContext["contextMode"] | undefined;
  outputs: readonly RequestedOutputId[];
}): boolean {
  if (!hasAnswerEngineV1GroupedTopologyMissingPhysicalInput(input.basis)) {
    return false;
  }

  return (
    input.contextMode === "building_prediction" ||
    input.contextMode === "field_between_rooms" ||
    hasAnswerEngineV1FieldOrBuildingAirborneOutput(input.outputs)
  );
}

function shouldApplyAnswerEngineV1WallNeedsInputBoundary(input: {
  basis: AirborneResultBasis | undefined;
  contextMode: AirborneContext["contextMode"] | undefined;
  detectedFamily: string | undefined;
  outputs: readonly RequestedOutputId[];
  resolution: AirborneCandidateResolution | undefined;
  strategy: string | undefined;
}): boolean {
  if (
    input.resolution?.selectedCandidateId !== "candidate_dynamic_needs_input" ||
    input.basis?.origin !== "needs_input" ||
    input.basis.missingPhysicalInputs.length === 0
  ) {
    return false;
  }

  return (
    isAnswerEngineV1WallOwnedPhysicalInputStop(input) ||
    isAnswerEngineV1GroupedTopologyNeedsInputBoundary(input) ||
    isAnswerEngineV1WallFieldOrBuildingNeedsInputBoundary(input)
  );
}

function shouldApplyAnswerEngineV1WallUnsupportedBoundary(input: {
  basis: AirborneResultBasis | undefined;
  contextMode: AirborneContext["contextMode"] | undefined;
  outputs: readonly RequestedOutputId[];
  resolution: AirborneCandidateResolution | undefined;
}): boolean {
  return Boolean(
    input.resolution?.selectedCandidateId === "candidate_dynamic_unsupported" &&
      input.basis?.origin === "unsupported" &&
      isAnswerEngineV1WallFieldOrBuildingBoundary(input)
  );
}

function parkResultTargetOutputs(
  result: AssemblyCalculation,
  outputs: readonly RequestedOutputId[]
): void {
  const updatedSupport = moveSupportedOutputsToUnsupported({
    supportedImpactOutputs: result.supportedImpactOutputs,
    supportedTargetOutputs: result.supportedTargetOutputs,
    targetOutputs: result.targetOutputs,
    unsupportedImpactOutputs: result.unsupportedImpactOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  }, outputs);

  result.supportedImpactOutputs = updatedSupport.supportedImpactOutputs;
  result.supportedTargetOutputs = updatedSupport.supportedTargetOutputs;
  result.unsupportedImpactOutputs = updatedSupport.unsupportedImpactOutputs;
  result.unsupportedTargetOutputs = updatedSupport.unsupportedTargetOutputs;
}

function hasAnswerEngineV1SelectedFloorImpactPath(result: AssemblyCalculation): boolean {
  return Boolean(
    hasGateWFloorImpactRequest(result.targetOutputs) &&
      (
        result.impact ||
        result.lowerBoundImpact ||
        result.floorSystemRatings ||
        result.impactSupport ||
        result.dynamicImpactTrace ||
        result.supportedImpactOutputs.length > 0
      )
  );
}

function uniqueAnswerEngineV1Strings(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function uniqueAnswerEngineV1Outputs(values: readonly RequestedOutputId[]): RequestedOutputId[] {
  return [...new Set(values)];
}

function getAnswerEngineV1GateWFloorImpactNeedsInputBoundary(input: {
  contract: GateVFloorImpactDynamicStiffnessContract | null;
  result: AssemblyCalculation;
}): {
  missingPhysicalInputs: readonly string[];
  unsupportedOutputs: readonly RequestedOutputId[];
} | null {
  const boundary = input.contract?.adapterBoundaries.find(
    (entry) => entry.adapterId === "ISO_717_2_Lnw_DeltaLw"
  );

  if (!boundary || boundary.status !== "needs_input" || boundary.missingPhysicalInputs.length === 0) {
    return null;
  }

  const unsupportedOutputSet = new Set(input.result.unsupportedTargetOutputs);
  const unsupportedOutputs = boundary.requestedOutputs.filter((output) => unsupportedOutputSet.has(output));
  if (unsupportedOutputs.length === 0) {
    return null;
  }

  return {
    missingPhysicalInputs: boundary.missingPhysicalInputs,
    unsupportedOutputs
  };
}

function getAnswerEngineV1GateZFloorImpactNeedsInputBoundary(input: {
  assessment: GateYFloorImpactFieldContextAssessment | null;
  result: AssemblyCalculation;
}): {
  missingPhysicalInputs: readonly string[];
  unsupportedOutputs: readonly RequestedOutputId[];
} | null {
  const assessment = input.assessment;
  if (
    !assessment ||
    assessment.status !== "needs_input" ||
    assessment.missingPhysicalInputs.length === 0 ||
    assessment.requestedOutputs.length === 0
  ) {
    return null;
  }

  const unsupportedOutputSet = new Set(input.result.unsupportedTargetOutputs);
  const unsupportedOutputs = assessment.requestedOutputs.filter((output) => unsupportedOutputSet.has(output));
  if (unsupportedOutputs.length === 0) {
    return null;
  }

  return {
    missingPhysicalInputs: assessment.missingPhysicalInputs,
    unsupportedOutputs
  };
}

function applyAcousticCalculatorAnswerEngineV1FlatDoubleLeafBoundary(input: {
  airborneContext?: AirborneContext | null;
  dynamicFamilyRuntimeBasisActive: boolean;
  result: AssemblyCalculation;
}): void {
  if (
    input.dynamicFamilyRuntimeBasisActive ||
    input.result.airborneCandidateResolution?.selectedOrigin !== "screening_fallback" ||
    input.result.dynamicAirborneTrace?.detectedFamily !== "double_leaf" ||
    !isAnswerEngineV1FlatGypsumAbsorberGypsum({
      airborneContext: input.airborneContext,
      layers: input.result.layers
    })
  ) {
    return;
  }

  const basis = buildAnswerEngineV1FlatDoubleLeafNeedsInputBasis();
  input.result.airborneBasis = basis;
  input.result.acousticAnswerBoundary = buildAnswerEngineV1WallNeedsInputBoundary({
    basis,
    contextMode: input.airborneContext?.contextMode,
    outputs: input.result.targetOutputs
  }) ?? undefined;

  if (input.result.airborneCandidateResolution) {
    input.result.airborneCandidateResolution = selectAnswerEngineV1NeedsInputCandidate({
      basis,
      resolution: input.result.airborneCandidateResolution
    });
    input.result.airborneCandidateSet = input.result.airborneCandidateResolution.candidates;
  }

  parkResultTargetOutputs(input.result, input.result.targetOutputs);
  input.result.warnings.push(
    `Acoustic Calculator Answer Engine V1 selected needs_input for ${input.result.targetOutputs.join(", ")}; provide ${basis.missingPhysicalInputs.join(", ")} before DynEcho publishes a double-leaf wall answer.`
  );
}

function applyAcousticCalculatorAnswerEngineV1WallNeedsInputBoundary(
  result: AssemblyCalculation
): void {
  const ownedPhysicalInputStop = isAnswerEngineV1WallOwnedPhysicalInputStop({
    basis: result.airborneBasis,
    detectedFamily: result.dynamicAirborneTrace?.detectedFamily,
    resolution: result.airborneCandidateResolution,
    strategy: result.dynamicAirborneTrace?.strategy
  });
  const fieldOrBuildingInputStop = isAnswerEngineV1WallFieldOrBuildingNeedsInputBoundary({
    basis: result.airborneBasis,
    contextMode: result.airborneOverlay?.contextMode,
    outputs: result.targetOutputs
  });

  if (
    result.acousticAnswerBoundary ||
    hasAnswerEngineV1SelectedFloorImpactPath(result) ||
    (
      hasAnswerEngineV1SupportedWallAirborneOutput(result.supportedTargetOutputs) &&
      !ownedPhysicalInputStop &&
      !fieldOrBuildingInputStop
    ) ||
    !shouldApplyAnswerEngineV1WallNeedsInputBoundary({
      basis: result.airborneBasis,
      contextMode: result.airborneOverlay?.contextMode,
      detectedFamily: result.dynamicAirborneTrace?.detectedFamily,
      outputs: result.targetOutputs,
      resolution: result.airborneCandidateResolution,
      strategy: result.dynamicAirborneTrace?.strategy
    })
  ) {
    return;
  }

  const boundary = buildAnswerEngineV1WallNeedsInputBoundary({
    basis: result.airborneBasis,
    contextMode: result.airborneOverlay?.contextMode,
    outputs: result.targetOutputs
  });

  if (boundary) {
    result.acousticAnswerBoundary = boundary;
    parkResultTargetOutputs(result, boundary.unsupportedOutputs);
  }
}

function applyAcousticCalculatorAnswerEngineV1WallUnsupportedBoundary(
  result: AssemblyCalculation
): void {
  const fieldOrBuildingBoundary = isAnswerEngineV1WallFieldOrBuildingBoundary({
    basis: result.airborneBasis,
    contextMode: result.airborneOverlay?.contextMode,
    outputs: result.targetOutputs
  });

  if (
    result.acousticAnswerBoundary ||
    hasAnswerEngineV1SelectedFloorImpactPath(result) ||
    (
      hasAnswerEngineV1SupportedWallAirborneOutput(result.supportedTargetOutputs) &&
      !fieldOrBuildingBoundary
    ) ||
    !shouldApplyAnswerEngineV1WallUnsupportedBoundary({
      basis: result.airborneBasis,
      contextMode: result.airborneOverlay?.contextMode,
      outputs: result.targetOutputs,
      resolution: result.airborneCandidateResolution
    })
  ) {
    return;
  }

  const boundary = buildAnswerEngineV1WallUnsupportedBoundary({
    basis: result.airborneBasis,
    outputs: result.targetOutputs
  });

  if (boundary) {
    result.acousticAnswerBoundary = boundary;
    parkResultTargetOutputs(result, boundary.unsupportedOutputs);
  }
}

function applyAcousticCalculatorAnswerEngineV1FloorRolelessHelperOnlyBoundary(
  result: AssemblyCalculation
): void {
  const hasPublishedImpactCandidate = Boolean(result.impact || result.floorSystemEstimate);

  if (
    !hasPublishedImpactCandidate ||
    !isAnswerEngineV1RolelessHelperOnlyFloorStack({
      layers: result.layers,
      targetOutputs: result.targetOutputs
    })
  ) {
    return;
  }

  const boundary = buildAnswerEngineV1FloorRolelessHelperOnlyBoundary(result.targetOutputs);
  result.acousticAnswerBoundary = boundary;
  parkResultTargetOutputs(result, result.targetOutputs);
  result.boundFloorSystemEstimate = null;
  result.boundFloorSystemMatch = null;
  result.dynamicImpactTrace = undefined;
  result.floorSystemEstimate = null;
  result.floorSystemMatch = null;
  result.floorSystemRatings = null;
  result.floorSystemRecommendations = [];
  result.impact = null;
  result.impactCatalogMatch = null;
  result.impactPredictorStatus = null;
  result.impactSupport = null;
  result.lowerBoundImpact = null;
  result.warnings.push(
    `Acoustic Calculator Answer Engine V1 selected needs_input for ${result.targetOutputs.join(", ")}; assign ${boundary.missingPhysicalInputs.join(", ")} before DynEcho publishes helper-only timber/open-web floor answers.`
  );
  result.warnings.push(
    `Floor roles needed before impact output promotion: ${boundary.missingPhysicalInputs.join(", ")}.`
  );
}

function applyAcousticCalculatorAnswerEngineV1FloorAstmIicAiicUnsupportedBoundary(
  result: AssemblyCalculation
): void {
  if (
    result.acousticAnswerBoundary ||
    !isAnswerEngineV1PureFloorAstmIicAiicRequest({
      supportedTargetOutputs: result.supportedTargetOutputs,
      targetOutputs: result.targetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs
    })
  ) {
    return;
  }

  const boundary = buildAnswerEngineV1FloorAstmIicAiicUnsupportedBoundary(result.targetOutputs);
  if (!boundary) {
    return;
  }

  result.acousticAnswerBoundary = boundary;
  result.warnings.push(
    `Acoustic Calculator Answer Engine V1 selected unsupported for ${boundary.unsupportedOutputs.join(", ")}; ASTM IIC/AIIC need ${boundary.requiredInputs.join(", ")} before DynEcho publishes those ratings.`
  );
}

const ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_CONTEXT_INPUTS = new Set([
  "contextMode",
  "partitionAreaM2",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S",
  "impactFieldContext"
]);

function getAnswerEngineV1FloorFieldImpactMissingInputs(input: {
  assessment: GateYFloorImpactFieldContextAssessment | null;
  impactFieldContext: ImpactFieldContext | null;
  result: AssemblyCalculation;
}): string[] {
  const missing = input.assessment?.missingPhysicalInputs ?? [];
  const hasLabImpactAnchor = Boolean(
    input.result.impact?.labOrField !== "field" &&
      (
        typeof input.result.impact?.LnW === "number" ||
        Boolean(input.result.lowerBoundImpact)
      )
  );

  if (!hasLabImpactAnchor) {
    return [...missing];
  }

  const requestedFieldOutputs: RequestedOutputId[] = input.result.targetOutputs.filter((output: RequestedOutputId) =>
    GATE_Z_FIELD_IMPACT_OUTPUTS.has(output)
  );
  const postV1GateNMissing: string[] = [];
  const needsK = requestedFieldOutputs.some((output) =>
    output === "L'n,w" || output === "L'nT,w" || output === "L'nT,50"
  );
  const needsVolume = requestedFieldOutputs.some((output) => output === "L'nT,w" || output === "L'nT,50");
  const needsLowFrequency = requestedFieldOutputs.includes("L'nT,50");

  if (needsK && !hasPostV1GateNFieldKPolicy(input.impactFieldContext)) {
    postV1GateNMissing.push("impactFieldContext");
  }

  if (needsVolume && !hasPostV1GateNReceivingRoomVolume(input.impactFieldContext)) {
    postV1GateNMissing.push("receivingRoomVolumeM3");
  }

  if (
    needsLowFrequency &&
    typeof input.impactFieldContext?.ci50_2500Db !== "number" &&
    typeof input.result.impact?.CI50_2500 !== "number"
  ) {
    postV1GateNMissing.push("impactFieldContext.ci50_2500Db");
  }

  return uniqueAnswerEngineV1Strings(
    postV1GateNMissing.length > 0
      ? postV1GateNMissing
      : missing.filter((field) =>
          ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_FLOOR_FIELD_CONTEXT_INPUTS.has(field)
        )
  );
}

function applyAcousticCalculatorAnswerEngineV1FloorFieldImpactNeedsInputBoundary(input: {
  gateZFloorImpactFieldAssessment: GateYFloorImpactFieldContextAssessment | null;
  impactFieldContext: ImpactFieldContext | null;
  result: AssemblyCalculation;
}): void {
  if (
    input.result.acousticAnswerBoundary ||
    !isAnswerEngineV1PureFloorFieldImpactRequest({
      supportedTargetOutputs: input.result.supportedTargetOutputs,
      targetOutputs: input.result.targetOutputs,
      unsupportedTargetOutputs: input.result.unsupportedTargetOutputs
    })
  ) {
    return;
  }

  const missingPhysicalInputs = getAnswerEngineV1FloorFieldImpactMissingInputs({
    assessment: input.gateZFloorImpactFieldAssessment,
    impactFieldContext: input.impactFieldContext,
    result: input.result
  });
  const boundary = buildAnswerEngineV1FloorFieldImpactNeedsInputBoundary({
    missingPhysicalInputs,
    targetOutputs: input.result.targetOutputs
  });
  if (!boundary) {
    return;
  }

  input.result.acousticAnswerBoundary = boundary;
  input.result.warnings.push(
    `Acoustic Calculator Answer Engine V1 selected needs_input for ${boundary.unsupportedOutputs.join(", ")}; provide ${boundary.missingPhysicalInputs.join(", ")} before DynEcho publishes floor field-impact answers.`
  );
}

function applyAcousticCalculatorAnswerEngineV1FloorImpactNeedsInputBoundary(input: {
  gateWFloorImpactContract: GateVFloorImpactDynamicStiffnessContract | null;
  gateZFloorImpactFieldAssessment: GateYFloorImpactFieldContextAssessment | null;
  result: AssemblyCalculation;
}): void {
  const hasPublishedFloorImpactCandidate = Boolean(
    input.result.impact ||
      input.result.lowerBoundImpact ||
      input.result.floorSystemMatch ||
      input.result.boundFloorSystemMatch ||
      input.result.floorSystemEstimate ||
      input.result.boundFloorSystemEstimate ||
      input.result.impactCatalogMatch
  );

  if (input.result.acousticAnswerBoundary || hasPublishedFloorImpactCandidate) {
    return;
  }

  const labBoundary = getAnswerEngineV1GateWFloorImpactNeedsInputBoundary({
    contract: input.gateWFloorImpactContract,
    result: input.result
  });
  const fieldBoundary = getAnswerEngineV1GateZFloorImpactNeedsInputBoundary({
    assessment: input.gateZFloorImpactFieldAssessment,
    result: input.result
  });
  const missingPhysicalInputs = uniqueAnswerEngineV1Strings([
    ...(labBoundary?.missingPhysicalInputs ?? []),
    ...(fieldBoundary?.missingPhysicalInputs ?? [])
  ]);
  const unsupportedOutputs = uniqueAnswerEngineV1Outputs([
    ...(labBoundary?.unsupportedOutputs ?? []),
    ...(fieldBoundary?.unsupportedOutputs ?? [])
  ]);
  const boundary = buildAnswerEngineV1FloorImpactNeedsInputBoundary({
    missingPhysicalInputs,
    targetOutputs: unsupportedOutputs
  });

  if (!boundary) {
    return;
  }

  input.result.acousticAnswerBoundary = boundary;
  parkResultTargetOutputs(input.result, boundary.unsupportedOutputs);
  input.result.warnings.push(
    `Acoustic Calculator Answer Engine V1 selected needs_input for ${boundary.unsupportedOutputs.join(", ")}; provide ${boundary.missingPhysicalInputs.join(", ")} before DynEcho publishes floor impact answers.`
  );
}

function applyAcousticCalculatorAnswerEngineV1TimberCltDeltaLwNeedsInputBoundary(input: {
  predictorInput: ImpactPredictorInput | null;
  result: AssemblyCalculation;
}): void {
  if (input.result.acousticAnswerBoundary) {
    return;
  }

  const missingPhysicalInputs = collectTimberCltDeltaLwFormulaMissingPhysicalInputs(input.predictorInput);
  const stoppedOutputs: RequestedOutputId[] = input.result.targetOutputs.filter((output: RequestedOutputId) =>
    output === "DeltaLw"
  );
  const unsupportedOutputSet = new Set<RequestedOutputId>(input.result.unsupportedTargetOutputs);

  if (
    missingPhysicalInputs.length === 0 ||
    stoppedOutputs.length === 0 ||
    !stoppedOutputs.every((output: RequestedOutputId) => unsupportedOutputSet.has(output))
  ) {
    return;
  }

  const boundary = buildAnswerEngineV1FloorImpactNeedsInputBoundary({
    missingPhysicalInputs,
    targetOutputs: stoppedOutputs
  });
  if (!boundary) {
    return;
  }

  input.result.acousticAnswerBoundary = boundary;
  input.result.warnings.push(
    `Acoustic Calculator Answer Engine V1 selected needs_input for ${boundary.unsupportedOutputs.join(", ")}; provide ${boundary.missingPhysicalInputs.join(", ")} before DynEcho publishes timber/CLT floor DeltaLw answers.`
  );
}

function resolveOpeningLeakHostWallBasis(input: {
  dynamicRuntimeActive: boolean;
  importedCalculatorActive: boolean;
  verifiedLabAnchorApplied: boolean;
}): Parameters<typeof maybeBuildGateSOpeningLeakCompositeRuntimeCorridor>[0]["hostWallRatingBasis"] {
  if (input.verifiedLabAnchorApplied) {
    return "exact_source_row";
  }

  if (input.dynamicRuntimeActive) {
    return "dynamic_family_candidate";
  }

  if (input.importedCalculatorActive) {
    return "calibrated_source_anchor";
  }

  return "unknown";
}

function resolveFloorImpactDynamicStiffness(input: {
  catalog: readonly MaterialDefinition[];
  floorImpactContext?: DynamicCalculatorFloorImpactContext | null;
  layers: readonly LayerInput[];
}): number | undefined {
  const explicit = input.floorImpactContext?.resilientLayerDynamicStiffnessMNm3;
  if (typeof explicit === "number" && explicit > 0) {
    return explicit;
  }

  for (const layer of input.layers) {
    if (layer.floorRole !== "resilient_layer") {
      continue;
    }

    const material = input.catalog.find((entry) => entry.id === layer.materialId);
    const dynamicStiffnessMNm3 = material?.impact?.dynamicStiffnessMNm3;
    if (typeof dynamicStiffnessMNm3 === "number" && dynamicStiffnessMNm3 > 0) {
      return dynamicStiffnessMNm3;
    }
  }

  return undefined;
}

function buildGateWImpactPredictorSeed(input: {
  catalog: readonly MaterialDefinition[];
  floorImpactContext?: DynamicCalculatorFloorImpactContext | null;
  layers: readonly LayerInput[];
}): ImpactPredictorInput {
  const dynamicStiffnessMNm3 = resolveFloorImpactDynamicStiffness(input);
  const loadBasisKgM2 = input.floorImpactContext?.loadBasisKgM2;

  return {
    ...(typeof loadBasisKgM2 === "number" && loadBasisKgM2 > 0 ? { loadBasisKgM2 } : {}),
    ...(typeof dynamicStiffnessMNm3 === "number" && dynamicStiffnessMNm3 > 0
      ? {
          resilientLayer: {
            dynamicStiffnessMNm3
          }
        }
      : {})
  };
}

function resolveLayers(
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[]
): ResolvedLayer[] {
  return layers.map((layer) => {
    const material = resolveMaterial(layer.materialId, catalog);

    return {
      ...layer,
      material,
      surfaceMassKgM2: computeLayerSurfaceMassKgM2(layer, material)
    };
  });
}

function coalesceMergeSafeAirborneLayers(layers: readonly ResolvedLayer[]): ResolvedLayer[] {
  const coalesced: ResolvedLayer[] = [];

  for (const layer of layers) {
    const previous = coalesced.at(-1);

    if (
      previous &&
      previous.material.id === layer.material.id &&
      previous.floorRole === layer.floorRole
    ) {
      const thicknessMm = previous.thicknessMm + layer.thicknessMm;
      coalesced[coalesced.length - 1] = {
        ...previous,
        surfaceMassKgM2: computeLayerSurfaceMassKgM2({ thicknessMm }, previous.material),
        thicknessMm
      };
      continue;
    }

    coalesced.push(layer);
  }

  return coalesced;
}

function inferResolvedFloorStructuralSupportType(layers: readonly ResolvedLayer[]): string | null {
  const baseLayer = layers.findLast((layer) => layer.floorRole === "base_structure");
  return baseLayer ? inferStructuralSupportTypeFromMaterial(baseLayer.material) ?? null : null;
}

function inferExactFloorSystemStructuralSupportType(
  system: ExactFloorSystem | null | undefined,
  catalog: readonly MaterialDefinition[]
): string | null {
  const baseMaterialId = system?.match.baseStructure?.materialIds?.[0];
  if (!baseMaterialId) {
    return null;
  }

  return inferStructuralSupportTypeFromMaterial(resolveMaterial(baseMaterialId, catalog)) ?? null;
}

function buildClosestFloorSystemRecommendationWarning(input: {
  catalog: readonly MaterialDefinition[];
  recommendations: readonly { system: ExactFloorSystem }[];
  resolvedLayers: readonly ResolvedLayer[];
}): string | null {
  const closestSystem = input.recommendations[0]?.system;
  if (!closestSystem) {
    return null;
  }

  const currentSupportType = inferResolvedFloorStructuralSupportType(input.resolvedLayers);
  const candidateSupportType = inferExactFloorSystemStructuralSupportType(closestSystem, input.catalog);

  if (!currentSupportType || !candidateSupportType || currentSupportType !== candidateSupportType) {
    return "No curated exact floor-system landed. Nearby scored rows existed, but DynEcho withheld the closest candidate label because it drifted outside the defended same-family route.";
  }

  return `No curated exact floor-system landed. Closest family candidate is ${closestSystem.label}.`;
}

function pickReferenceFloorRatingLayers(layers: readonly ResolvedLayer[]): readonly ResolvedLayer[] {
  const baseStructureLayers = layers.filter((layer) => layer.floorRole === "base_structure");

  return baseStructureLayers.length > 0 ? baseStructureLayers : layers;
}

function pickFloorCarrier(input: {
  boundFloorSystemEstimate?: FloorSystemBoundEstimateResult | null;
  boundFloorSystemMatch?: FloorSystemBoundMatchResult | null;
  floorSystemEstimate?: FloorSystemEstimateResult | null;
  floorSystemMatch?: FloorSystemMatchResult | null;
}): FloorSystemAirborneRatings | null {
  return (
    input.floorSystemMatch?.system.airborneRatings ??
    input.floorSystemEstimate?.airborneRatings ??
    input.boundFloorSystemMatch?.system.airborneRatings ??
    input.boundFloorSystemEstimate?.airborneRatings ??
    null
  );
}

function isBoardLikeSurfaceLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  return role.isSolidLeaf && /gypsum|board|plasterboard|firestop|impactstop|acoustic|security|soundbloc/i.test(materialText(layer));
}

function summarizeMicroGapEquivalentCavity(layers: readonly ResolvedLayer[]): {
  cavityEnd: number;
  cavityStart: number;
  gapSegmentCount: number;
  gapThicknessMm: number;
  leftLeafSolidCount: number;
  porousSegmentCount: number;
  porousLayer: ResolvedLayer | null;
  porousThicknessMm: number;
  rightLeafSolidCount: number;
  totalThicknessMm: number;
} | null {
  let sawLeftLeaf = false;
  let cavityStart = -1;
  let cavityEnd = -1;
  let leftLeafSolidCount = 0;
  let rightLeafSolidCount = 0;
  let gapSegmentCount = 0;
  let porousSegmentCount = 0;
  let gapThicknessMm = 0;
  let porousThicknessMm = 0;
  let porousLayer: ResolvedLayer | null = null;
  let previousKind: "gap" | "porous" | null = null;

  for (let index = 0; index < layers.length; index += 1) {
    const layer = layers[index];
    if (!layer) {
      continue;
    }

    const role = classifyLayerRole(layer);

    if (!sawLeftLeaf) {
      if (role.isSolidLeaf) {
        if (!isBoardLikeSurfaceLayer(layer)) {
          return null;
        }
        sawLeftLeaf = true;
        leftLeafSolidCount += 1;
      }
      continue;
    }

    if (cavityStart < 0) {
      if (role.isSolidLeaf) {
        if (!isBoardLikeSurfaceLayer(layer)) {
          return null;
        }
        leftLeafSolidCount += 1;
        continue;
      }

      if (!(role.isGap || role.isPorous)) {
        return null;
      }

      cavityStart = index;
    }

    if (cavityStart >= 0 && cavityEnd < 0) {
      if (role.isSolidLeaf) {
        if (!isBoardLikeSurfaceLayer(layer)) {
          return null;
        }
        cavityEnd = index - 1;
        rightLeafSolidCount += 1;
        continue;
      }

      if (!(role.isGap || role.isPorous)) {
        return null;
      }

      if (role.isGap) {
        gapThicknessMm += layer.thicknessMm;
        if (previousKind !== "gap") {
          gapSegmentCount += 1;
          previousKind = "gap";
        }
      } else {
        porousThicknessMm += layer.thicknessMm;
        if (!porousLayer) {
          porousLayer = { ...layer, material: { ...layer.material } };
        }
        if (previousKind !== "porous") {
          porousSegmentCount += 1;
          previousKind = "porous";
        }
      }
      continue;
    }

    if (role.isSolidLeaf) {
      if (!isBoardLikeSurfaceLayer(layer)) {
        return null;
      }
      rightLeafSolidCount += 1;
      continue;
    }

    return null;
  }

  if (!(cavityStart >= 0) || !(cavityEnd >= cavityStart) || !porousLayer) {
    return null;
  }

  const totalThicknessMm = gapThicknessMm + porousThicknessMm;
  if (!(totalThicknessMm > 0)) {
    return null;
  }

  return {
    cavityEnd,
    cavityStart,
    gapSegmentCount,
    gapThicknessMm,
    leftLeafSolidCount,
    porousLayer,
    porousSegmentCount,
    porousThicknessMm,
    rightLeafSolidCount,
    totalThicknessMm
  };
}

function buildMicroGapFillOnlyEquivalentLayers(layers: readonly ResolvedLayer[]): ResolvedLayer[] | null {
  const cavity = summarizeMicroGapEquivalentCavity(layers);
  if (!cavity) {
    return null;
  }

  const fillFraction = cavity.totalThicknessMm > 0 ? cavity.porousThicknessMm / cavity.totalThicknessMm : 0;
  if (
    cavity.leftLeafSolidCount !== 1 ||
    cavity.rightLeafSolidCount !== 1 ||
    cavity.gapSegmentCount !== 1 ||
    cavity.porousSegmentCount !== 1 ||
    !(cavity.gapThicknessMm > 0 && cavity.gapThicknessMm <= 12) ||
    !(fillFraction >= 0.82)
  ) {
    return null;
  }

  const porousLayer = cavity.porousLayer;
  if (!porousLayer) {
    return null;
  }

  return [
    ...layers.slice(0, cavity.cavityStart).map((layer) => ({ ...layer, material: { ...layer.material } })),
    {
      ...porousLayer,
      thicknessMm: cavity.totalThicknessMm,
      surfaceMassKgM2: computeLayerSurfaceMassKgM2(
        { thicknessMm: cavity.totalThicknessMm },
        porousLayer.material
      )
    },
    ...layers.slice(cavity.cavityEnd + 1).map((layer) => ({ ...layer, material: { ...layer.material } }))
  ];
}

function computeFieldRwPrimeMetric(curve: TransmissionLossCurve, context: AirborneContext): number | null {
  const ratings = buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, context);
  return ratings.field?.RwPrime ?? ratings.iso717.RwPrime ?? ratings.field?.DnTw ?? ratings.iso717.Rw;
}

function anchorCurveToFieldRwPrime(
  curve: TransmissionLossCurve,
  targetMetric: number,
  context: AirborneContext
): { applied: boolean; curve: TransmissionLossCurve; ratings: AssemblyRatings } {
  let currentCurve: TransmissionLossCurve = {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: [...curve.transmissionLossDb]
  };
  const sourceValues = [...curve.transmissionLossDb];
  let ratings = buildRatingsFromCurve(currentCurve.frequenciesHz, currentCurve.transmissionLossDb, context);

  for (let iteration = 0; iteration < 4; iteration += 1) {
    const currentMetric = computeFieldRwPrimeMetric(currentCurve, context);
    if (!(typeof currentMetric === "number" && Number.isFinite(currentMetric))) {
      return {
        applied: false,
        curve,
        ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, context)
      };
    }

    const deltaDb = targetMetric - currentMetric;
    if (Math.abs(deltaDb) < 0.05) {
      break;
    }

    currentCurve = {
      frequenciesHz: [...currentCurve.frequenciesHz],
      transmissionLossDb: currentCurve.transmissionLossDb.map((value: number) => Math.min(95, Math.max(0, value + deltaDb)))
    };
    ratings = buildRatingsFromCurve(currentCurve.frequenciesHz, currentCurve.transmissionLossDb, context);
  }

  return {
    applied: currentCurve.transmissionLossDb.some((value: number, index: number) => Math.abs(value - sourceValues[index]) > 1e-6),
    curve: currentCurve,
    ratings
  };
}

function smoothstep01(value: number): number {
  const x = clamp(value, 0, 1);
  return x * x * (3 - (2 * x));
}

function octaveBandWindowWeight(freqHz: number, startHz: number, endHz: number, transitionOctaves = 0.3): number {
  const frequency = Math.max(freqHz, 1e-9);
  const start = Math.max(startHz, 1e-9);
  const end = Math.max(endHz, start + 1e-6);
  const transition = clamp(transitionOctaves, 0.05, 1.5);
  const left = smoothstep01((Math.log2(frequency / start) + transition) / (2 * transition));
  const right = smoothstep01((Math.log2(end / frequency) + transition) / (2 * transition));

  return clamp(Math.min(left, right), 0, 1);
}

type AirborneOverlayResult = ReturnType<typeof applyAirborneContextOverlay>;
type FieldRwPrimeTargets = Record<35 | 42 | 50 | 60, number>;

type DynamicAirborneGuardInput = {
  airborneContext: AirborneContext | null;
  layers: readonly ResolvedLayer[];
  overlayResult: AirborneOverlayResult;
  selectedCurve: TransmissionLossCurve;
};

type DynamicAirborneGuard = {
  apply: (input: DynamicAirborneGuardInput) => AirborneOverlayResult;
  id: string;
  priority: number;
};

function hasExplicitFieldFramingContext(airborneContext: AirborneContext | null): airborneContext is AirborneContext {
  return Boolean(
    airborneContext &&
      airborneContext.contextMode !== "element_lab" &&
      (
        airborneContext.connectionType !== "auto" ||
        airborneContext.studType !== "auto" ||
        typeof airborneContext.studSpacingMm === "number"
      )
  );
}

function applyFieldRwPrimeTargetGuard<FamilyInfo extends { fillThicknessMm: number }>(
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null,
  detectFamily: (layers: readonly ResolvedLayer[]) => FamilyInfo | null,
  resolveTargets: (familyInfo: FamilyInfo, airborneContext: AirborneContext) => FieldRwPrimeTargets,
  warning: string
): AirborneOverlayResult {
  if (!hasExplicitFieldFramingContext(airborneContext)) {
    return overlayResult;
  }

  const familyInfo = detectFamily(layers);
  if (!familyInfo) {
    return overlayResult;
  }

  const targetMetric = interpolateFieldTargetRwPrime(
    familyInfo.fillThicknessMm,
    resolveTargets(familyInfo, airborneContext)
  );
  const currentMetric = overlayResult.ratings.field?.RwPrime ?? overlayResult.ratings.iso717.RwPrime;

  if (!(typeof currentMetric === "number" && Number.isFinite(currentMetric))) {
    return overlayResult;
  }

  if (Math.abs(currentMetric - targetMetric) < 0.25) {
    return overlayResult;
  }

  const anchored = anchorCurveToFieldRwPrime(overlayResult.curve, targetMetric, airborneContext);
  if (!anchored.applied) {
    return overlayResult;
  }

  return {
    curve: anchored.curve,
    overlay: overlayResult.overlay,
    ratings: anchored.ratings,
    warnings: [
      ...overlayResult.warnings,
      warning
    ]
  };
}

function applyMicroGapFillEquivalentFieldGuard(
  selectedCurve: TransmissionLossCurve,
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  if (!hasExplicitFieldFramingContext(airborneContext)) {
    return overlayResult;
  }

  const equivalentLayers = buildMicroGapFillOnlyEquivalentLayers(layers);
  if (!equivalentLayers?.length) {
    return overlayResult;
  }

  const equivalentScreeningRwDb = estimateRwDb(equivalentLayers);
  const equivalentScreeningCurve = buildCalibratedMassLawCurve(equivalentLayers.reduce((sum, layer) => sum + layer.surfaceMassKgM2, 0), equivalentScreeningRwDb);
  const equivalentDynamicResult = calculateDynamicAirborneResult(equivalentLayers, {
    airborneContext,
    frequenciesHz: equivalentScreeningCurve.frequenciesHz,
    screeningEstimatedRwDb: equivalentScreeningRwDb
  });
  const equivalentOverlayResult = applyAirborneContextOverlay(equivalentDynamicResult.curve, equivalentLayers, airborneContext);
  const currentMetric = overlayResult.ratings.field?.RwPrime ?? overlayResult.ratings.iso717.RwPrime;
  const equivalentMetric = equivalentOverlayResult.ratings.field?.RwPrime ?? equivalentOverlayResult.ratings.iso717.RwPrime;

  if (
    !(typeof currentMetric === "number" && Number.isFinite(currentMetric)) ||
    !(typeof equivalentMetric === "number" && Number.isFinite(equivalentMetric))
  ) {
    return overlayResult;
  }

  const lowerBound = equivalentMetric - 3;
  const upperBound = equivalentMetric + 3;
  if (currentMetric >= lowerBound - 1e-6 && currentMetric <= upperBound + 1e-6) {
    return overlayResult;
  }

  const targetMetric = Math.min(upperBound, Math.max(lowerBound, currentMetric));
  const anchored = anchorCurveToFieldRwPrime(overlayResult.curve, targetMetric, airborneContext);
  if (!anchored.applied) {
    return overlayResult;
  }

  return {
    curve: anchored.curve,
    overlay: overlayResult.overlay,
    ratings: anchored.ratings,
    warnings: [
      ...overlayResult.warnings,
      "A very small explicit air gap inside a mostly filled framed cavity was kept within the fill-only equivalent field corridor to avoid topology-sensitive drift."
    ]
  };
}

function interpolateFieldTargetRwPrime(fillThicknessMm: number, targets: Record<35 | 42 | 50 | 60, number>): number {
  const anchors = [35, 42, 50, 60] as const;
  const clampedFill = clamp(fillThicknessMm, anchors[0], anchors[anchors.length - 1]);

  if (clampedFill <= anchors[0]) {
    return targets[anchors[0]];
  }

  if (clampedFill >= anchors[anchors.length - 1]) {
    return targets[anchors[anchors.length - 1]];
  }

  for (let index = 0; index < anchors.length - 1; index += 1) {
    const left = anchors[index];
    const right = anchors[index + 1];

    if (clampedFill < left || clampedFill > right) {
      continue;
    }

    if (clampedFill === left) {
      return targets[left];
    }

    if (clampedFill === right) {
      return targets[right];
    }

    const position = (clampedFill - left) / (right - left);
    return targets[left] + ((targets[right] - targets[left]) * position);
  }

  return targets[anchors[anchors.length - 1]];
}

function applyFireRatedFilledSingleBoardFieldGuard(
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  return applyFieldRwPrimeTargetGuard(
    overlayResult,
    layers,
    airborneContext,
    detectFireRatedFilledSingleBoardFamily,
    (familyInfo, context) =>
      FIRE_RATED_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME[familyInfo.family][getFireRatedFilledSingleBoardProfile(context)],
    "A fire-rated filled single-board field corridor was applied because these fire/firestop framed hybrids were materially misreading the upstream field result."
  );
}

function applyMixedPlainFilledSingleBoardFieldGuard(
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  return applyFieldRwPrimeTargetGuard(
    overlayResult,
    layers,
    airborneContext,
    detectMixedPlainFilledSingleBoardFamily,
    (familyInfo, context) =>
      MIXED_PLAIN_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME[familyInfo.family][getMixedPlainFilledSingleBoardProfile(context)],
    "A mixed plain-filled single-board field corridor was applied because plain gypsum plus premium/moderate framed hybrids were materially misreading the upstream field result."
  );
}

function applyMixedEnhancedFilledSingleBoardFieldGuard(
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  return applyFieldRwPrimeTargetGuard(
    overlayResult,
    layers,
    airborneContext,
    detectMixedEnhancedFilledSingleBoardFamily,
    (familyInfo, context) =>
      MIXED_ENHANCED_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME[familyInfo.family][getMixedEnhancedFilledSingleBoardProfile(context)],
    "A mixed enhanced filled single-board field corridor was applied because premium framed hybrids were materially misreading the upstream field result."
  );
}

function applySecurityFilledSingleBoardFieldGuard(
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  return applyFieldRwPrimeTargetGuard(
    overlayResult,
    layers,
    airborneContext,
    detectSecurityFilledSingleBoardFamily,
    (familyInfo, context) =>
      SECURITY_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME[familyInfo.family][getSecurityFilledSingleBoardProfile(context)],
    "A security-board filled single-board field corridor was applied because these framed hybrids were materially misreading the upstream field result."
  );
}

function applySecurityFilledSingleBoardSteelHighBandLiftGuard(
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  if (
    !airborneContext ||
    airborneContext.contextMode === "element_lab" ||
    airborneContext.connectionType === "resilient_channel" ||
    airborneContext.studType === "resilient_stud"
  ) {
    return overlayResult;
  }

  const familyInfo = detectSecurityFilledSingleBoardFamily(layers);
  if (!familyInfo || familyInfo.fillThicknessMm < 58) {
    return overlayResult;
  }

  const liftDbByFamily: Partial<Record<SecurityFilledSingleBoardFamily, number>> = {
    diamond: 1.6,
    fire: 2.3,
    firestop: 2.4,
    plain: 2.1
  };
  const liftDb = familyInfo.family ? liftDbByFamily[familyInfo.family] : undefined;
  const targetRwPrime = overlayResult.ratings.field?.RwPrime;

  if (!(typeof liftDb === "number" && liftDb > 0 && typeof targetRwPrime === "number" && Number.isFinite(targetRwPrime))) {
    return overlayResult;
  }

  const liftedCurve: TransmissionLossCurve = {
    frequenciesHz: [...overlayResult.curve.frequenciesHz],
    transmissionLossDb: overlayResult.curve.transmissionLossDb.map((value: number, index: number) => {
      const weight = octaveBandWindowWeight(overlayResult.curve.frequenciesHz[index] ?? 0, 630, 3150, 0.4);
      return clamp(value + (liftDb * weight), 0, 95);
    })
  };
  const liftedRatings = buildRatingsFromCurve(liftedCurve.frequenciesHz, liftedCurve.transmissionLossDb, airborneContext);
  const liftedRwPrime = liftedRatings.field?.RwPrime ?? liftedRatings.iso717.RwPrime ?? null;
  const anchored =
    typeof liftedRwPrime === "number" && Number.isFinite(liftedRwPrime) && Math.abs(liftedRwPrime - targetRwPrime) < 0.05
      ? {
          applied: true,
          curve: liftedCurve,
          ratings: liftedRatings
        }
      : anchorCurveToFieldRwPrime(liftedCurve, targetRwPrime, airborneContext);
  if (!anchored.applied) {
    return overlayResult;
  }

  return {
    curve: anchored.curve,
    overlay: overlayResult.overlay,
    ratings: anchored.ratings,
    warnings: [
      ...overlayResult.warnings,
      "A steel-field security-hybrid high-band lift was applied because certain 60 mm security framed walls were still under-reading the upstream DnT,A corridor after R'w had already aligned."
    ]
  };
}

function applySymmetricEnhancedFilledSingleBoardFieldGuard(
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  return applyFieldRwPrimeTargetGuard(
    overlayResult,
    layers,
    airborneContext,
    detectSymmetricEnhancedFilledSingleBoardFamily,
    (familyInfo, context) =>
      SYMMETRIC_ENHANCED_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME[familyInfo.family][getSymmetricEnhancedFilledSingleBoardProfile(context)],
    "A symmetric enhanced filled single-board field corridor was applied because these same-material premium framed walls were materially misreading the upstream field result."
  );
}

const DYNAMIC_AIRBORNE_GUARDS: readonly DynamicAirborneGuard[] = [
  {
    id: "micro_gap_fill_equivalent",
    priority: 10,
    apply: (input: DynamicAirborneGuardInput) =>
      applyMicroGapFillEquivalentFieldGuard(
        input.selectedCurve,
        input.overlayResult,
        input.layers,
        input.airborneContext
      )
  },
  {
    id: "fire_rated_single_board_field_corridor",
    priority: 20,
    apply: (input: DynamicAirborneGuardInput) =>
      applyFireRatedFilledSingleBoardFieldGuard(input.overlayResult, input.layers, input.airborneContext)
  },
  {
    id: "mixed_plain_single_board_field_corridor",
    priority: 30,
    apply: (input: DynamicAirborneGuardInput) =>
      applyMixedPlainFilledSingleBoardFieldGuard(input.overlayResult, input.layers, input.airborneContext)
  },
  {
    id: "mixed_enhanced_single_board_field_corridor",
    priority: 40,
    apply: (input: DynamicAirborneGuardInput) =>
      applyMixedEnhancedFilledSingleBoardFieldGuard(input.overlayResult, input.layers, input.airborneContext)
  },
  {
    id: "symmetric_enhanced_single_board_field_corridor",
    priority: 50,
    apply: (input: DynamicAirborneGuardInput) =>
      applySymmetricEnhancedFilledSingleBoardFieldGuard(input.overlayResult, input.layers, input.airborneContext)
  },
  {
    id: "security_single_board_field_corridor",
    priority: 60,
    apply: (input: DynamicAirborneGuardInput) =>
      applySecurityFilledSingleBoardFieldGuard(input.overlayResult, input.layers, input.airborneContext)
  },
  {
    id: "security_single_board_steel_high_band_lift",
    priority: 70,
    apply: (input: DynamicAirborneGuardInput) =>
      applySecurityFilledSingleBoardSteelHighBandLiftGuard(input.overlayResult, input.layers, input.airborneContext)
  }
].sort((left, right) => left.priority - right.priority);

function applyDynamicAirborneGuards(
  selectedCurve: TransmissionLossCurve,
  overlayResult: AirborneOverlayResult,
  layers: readonly ResolvedLayer[],
  airborneContext: AirborneContext | null
): AirborneOverlayResult {
  let nextOverlayResult = overlayResult;

  for (const guard of DYNAMIC_AIRBORNE_GUARDS) {
    nextOverlayResult = guard.apply({
      airborneContext,
      layers,
      overlayResult: nextOverlayResult,
      selectedCurve
    });
  }

  return nextOverlayResult;
}

function hasInferredConcreteCeilingHelperSupportSignal(input: {
  inferredImpactLayers: readonly LayerInput[] | null;
  visibleLayers: readonly LayerInput[];
}): boolean {
  if (input.visibleLayers.some((layer) => Boolean(layer.floorRole))) {
    return false;
  }

  if (!input.inferredImpactLayers) {
    return false;
  }

  const concreteBaseStructureIndex = input.inferredImpactLayers.findIndex(
    (layer) => layer.floorRole === "base_structure" && layer.materialId === "concrete"
  );
  if (concreteBaseStructureIndex === -1 || concreteBaseStructureIndex !== input.inferredImpactLayers.length - 1) {
    return false;
  }

  const ceilingSideLayers = input.inferredImpactLayers.slice(0, concreteBaseStructureIndex);
  if (
    !ceilingSideLayers.every(
      (layer) =>
        layer.floorRole === "ceiling_board" ||
        layer.floorRole === "ceiling_cavity" ||
        layer.floorRole === "ceiling_fill"
    )
  ) {
    return false;
  }

  const hasCeilingBoard = ceilingSideLayers.some((layer) => layer.floorRole === "ceiling_board");
  const hasCeilingHelper = ceilingSideLayers.some(
    (layer) => layer.floorRole === "ceiling_cavity" || layer.floorRole === "ceiling_fill"
  );

  return hasCeilingBoard && hasCeilingHelper;
}

export function calculateAssembly(
  inputLayers: readonly LayerInput[],
  options: CalculateAssemblyOptions = {}
): AssemblyCalculation {
  // Guardrail for API / CLI callers that bypass the workbench row
  // normaliser. Hostile inputs (unknown materialId, NaN/Infinity/
  // non-positive/out-of-range thickness) collapse to a deterministic
  // fail-closed `AssemblyCalculation` with a specific warning instead
  // of throwing a raw Zod/Error. The workbench normaliser catches the
  // same cases earlier in the UI path; this is the last line of
  // defense so the engine never crashes on malformed layer input.
  const guardCatalog = mergePredictorCatalog(getDefaultMaterialCatalog(), options.catalog ?? []);
  const guardDecision = evaluateAssemblyInputGuard(inputLayers, guardCatalog);
  if (guardDecision.kind === "fail") {
    return buildFailClosedAssemblyResult(
      options.targetOutputs ?? [],
      guardDecision.warnings,
      options.calculator ?? undefined
    );
  }

  const layers = inputLayers.map((layer) => LayerInputSchema.parse(layer));
  const explicitPredictorInput = options.impactPredictorInput
    ? ImpactPredictorInputSchema.parse(options.impactPredictorInput)
    : null;
  let predictorInput = explicitPredictorInput;
  let predictorInputMode: "derived_from_visible_layers" | "explicit_predictor_input" | undefined =
    explicitPredictorInput ? "explicit_predictor_input" : undefined;
  let predictorAdaptation = predictorInput ? adaptImpactPredictorInput(predictorInput) : null;
  const baseCatalog = mergePredictorCatalog(getDefaultMaterialCatalog(), options.catalog ?? []);
  let catalog = mergePredictorCatalog(baseCatalog, predictorAdaptation?.catalogAdditions ?? []);
  const exactImpactSource = options.exactImpactSource ? ExactImpactSourceSchema.parse(options.exactImpactSource) : null;
  const impactFieldContext = options.impactFieldContext ? ImpactFieldContextSchema.parse(options.impactFieldContext) : null;
  const airborneContext = options.airborneContext ? AirborneContextSchema.parse(options.airborneContext) : null;
  const targetOutputs = options.targetOutputs ?? [];
  const floorImpactContext = options.floorImpactContext ?? null;
  const gateWFloorImpactContract =
    options.calculator === "dynamic" && hasGateWFloorImpactRequest(targetOutputs)
      ? buildGateVFloorImpactDynamicStiffnessContract({
          airborneContext: airborneContext ?? undefined,
          catalog: baseCatalog,
          floorImpactContext: floorImpactContext ?? undefined,
          layers,
          targetOutputs
        })
      : null;
  const gateZFloorImpactFieldAssessment =
    options.calculator === "dynamic" && hasGateZFloorImpactFieldRequest(targetOutputs)
      ? buildGateYFloorImpactFieldContextAssessment({
          airborneContext: airborneContext ?? undefined,
          catalog: baseCatalog,
          floorImpactContext: floorImpactContext ?? undefined,
          impactFieldContext: impactFieldContext ?? undefined,
          layers,
          lowFrequencyImpactOwnerAvailable: hasLowFrequencyImpactOwner(impactFieldContext),
          scenarioId: "gate_y_complete_lab_anchor_and_field_context_ready_except_low_frequency",
          targetOutputs
        })
      : null;
  const gateWLabRuntimeReady = gateWLabImpactRuntimeReady(gateWFloorImpactContract);
  const gateZFieldImpactRuntimeReady =
    gateZFloorImpactFieldRuntimeReady(gateZFloorImpactFieldAssessment);
  const gateWImpactPredictorSeed = gateWLabRuntimeReady || gateZFieldImpactRuntimeReady
    ? buildGateWImpactPredictorSeed({
        catalog: baseCatalog,
        floorImpactContext,
        layers
      })
    : {};
  const resolvedLayers = resolveLayers(layers, catalog);
  const hasFullyTaggedFloorStack = layers.length > 0 && layers.every((layer) => Boolean(layer.floorRole));
  const normalizedExplicitImpactLayers = hasFullyTaggedFloorStack
    ? normalizeExplicitFloorRoleLayerStack(layers, catalog)
    : null;
  const inferredImpactLayers =
    predictorAdaptation?.sourceLayers.length && !predictorAdaptation.officialFloorSystemId
      ? null
      // Explicit floor roles are operator intent. Only coalesce contiguous same-role pieces for split parity;
      // do not re-infer a fully tagged stack into a broader predictor lane.
      : hasFullyTaggedFloorStack
        ? normalizedExplicitImpactLayers
        : maybeInferFloorRoleLayerStack(layers, catalog);
  const hasVisibleFloorCarrier = layers.some((layer) => Boolean(layer.floorRole));
  let impactResolvedLayers =
    predictorAdaptation?.sourceLayers.length && !predictorAdaptation.officialFloorSystemId
      ? resolveLayers(predictorAdaptation.sourceLayers, catalog)
      : inferredImpactLayers
        ? resolveLayers(inferredImpactLayers, catalog)
        : resolvedLayers;
  const blocksBoundOnlyUbiqOpenWebCarpetDerivedEstimate =
    !explicitPredictorInput &&
    !exactImpactSource &&
    hasBoundOnlyUbiqOpenWebCarpetCombinedProfile(impactResolvedLayers);
  const airborneResolvedLayers = (layers.some((layer) => Boolean(layer.floorRole)) || Boolean(inferredImpactLayers))
    ? coalesceMergeSafeAirborneLayers(resolvedLayers)
    : resolvedLayers;
  const totalThicknessMm = round1(airborneResolvedLayers.reduce((sum, layer) => sum + layer.thicknessMm, 0));
  const surfaceMassKgM2 = round1(airborneResolvedLayers.reduce((sum, layer) => sum + layer.surfaceMassKgM2, 0));
  const screeningEstimatedRwDb = estimateRwDb(airborneResolvedLayers);
  const screeningCurve = buildCalibratedMassLawCurve(surfaceMassKgM2, screeningEstimatedRwDb);
  const dynamicAirborneResult = options.calculator === "dynamic"
    ? calculateDynamicAirborneResult(airborneResolvedLayers, {
        airborneContext,
        frequenciesHz: screeningCurve.frequenciesHz,
        screeningEstimatedRwDb,
        targetOutputs
      })
    : null;
  const importedCalculatorResult = options.calculator && options.calculator !== "dynamic"
    ? calculateAirborneCalculatorResult(options.calculator, airborneResolvedLayers)
    : null;
  const selectedCalculatorCurve = dynamicAirborneResult?.curve ?? importedCalculatorResult?.curve ?? screeningCurve;
  const selectedCalculatorLabel = dynamicAirborneResult?.label ?? importedCalculatorResult?.label;
  const availableCalculators: readonly AirborneCalculator[] = AIRBORNE_CALCULATORS;
  let airborneOverlayResult = applyAirborneContextOverlay(selectedCalculatorCurve, airborneResolvedLayers, airborneContext);
  if (options.calculator === "dynamic") {
    airborneOverlayResult = applyDynamicAirborneGuards(
      selectedCalculatorCurve,
      airborneOverlayResult,
      airborneResolvedLayers,
      airborneContext
    );
  }
  const verifiedAirborneAnchorResult = applyVerifiedAirborneCatalogAnchor(
    airborneOverlayResult.curve,
    airborneOverlayResult.ratings,
    airborneResolvedLayers,
    airborneContext,
    airborneOverlayResult.overlay?.fieldFlankingPenaltyDb ?? 0
  );
  const compatibleWallAnchorDeltaResult = maybeBuildPostV1WallCompatibleAnchorDelta({
    context: airborneContext,
    curve: verifiedAirborneAnchorResult.curve,
    exactFullStackApplied: verifiedAirborneAnchorResult.applied,
    layers: resolvedLayers,
    ratings: verifiedAirborneAnchorResult.ratings,
    targetOutputs
  });
  const approximateAirborneFieldCompanionResult = applyApproximateAirborneFieldCompanion(
    verifiedAirborneAnchorResult.ratings,
    airborneResolvedLayers,
    airborneContext
  );
  const curve = compatibleWallAnchorDeltaResult.applied
    ? compatibleWallAnchorDeltaResult.curve
    : verifiedAirborneAnchorResult.curve;
  const ratings = compatibleWallAnchorDeltaResult.applied
    ? compatibleWallAnchorDeltaResult.ratings
    : approximateAirborneFieldCompanionResult.ratings;
  const adjustedEstimatedRwDb = Math.max(
    0,
    round1(
      compatibleWallAnchorDeltaResult.applied && typeof compatibleWallAnchorDeltaResult.predictedRwDb === "number"
        ? compatibleWallAnchorDeltaResult.predictedRwDb
        : verifiedAirborneAnchorResult.applied && verifiedAirborneAnchorResult.match?.sourceMode === "lab"
        ? ratings.iso717.Rw
        : (dynamicAirborneResult?.rw ?? importedCalculatorResult?.rw ?? screeningEstimatedRwDb) -
          (
            (airborneOverlayResult.overlay?.baseRwDb ?? ratings.iso717.Rw) -
            ratings.iso717.Rw
          )
    )
  );
  const gateSOpeningLeakCompositeRuntime = options.calculator === "dynamic"
    ? maybeBuildGateSOpeningLeakCompositeRuntimeCorridor({
        airborneContext,
        hostWallRatingBasis: resolveOpeningLeakHostWallBasis({
          dynamicRuntimeActive: Boolean(dynamicAirborneResult),
          importedCalculatorActive: Boolean(importedCalculatorResult),
          verifiedLabAnchorApplied: Boolean(
            verifiedAirborneAnchorResult.applied &&
              verifiedAirborneAnchorResult.match?.sourceMode === "lab"
          )
        }),
        hostWallRwDb: adjustedEstimatedRwDb,
        targetOutputs
      })
    : null;
  const visibleEstimatedRwDb =
    gateSOpeningLeakCompositeRuntime?.runtimeRwDb ?? adjustedEstimatedRwDb;
  const gateAHOpeningLeakStcSpectrumAdapter = options.calculator === "dynamic"
    ? maybeBuildGateAHOpeningLeakStcSpectrumAdapter({
        airborneContext,
        gateSRuntime: gateSOpeningLeakCompositeRuntime,
        hostCurve: curve,
        hostWallRwDb: adjustedEstimatedRwDb,
        targetOutputs
      })
    : null;
  const visibleEstimatedStcDb =
    gateAHOpeningLeakStcSpectrumAdapter?.runtimeStcDb ?? ratings.astmE413.STC;
  const companyInternalOpeningLeakFieldBuildingRuntime = options.calculator === "dynamic"
    ? maybeBuildCompanyInternalOpeningLeakFieldBuildingRuntimeCorridor({
        airborneContext,
        fieldFlankingPenaltyDb: airborneOverlayResult.overlay?.fieldFlankingPenaltyDb,
        hostWallRatingBasis: resolveOpeningLeakHostWallBasis({
          dynamicRuntimeActive: Boolean(dynamicAirborneResult),
          importedCalculatorActive: Boolean(importedCalculatorResult),
          verifiedLabAnchorApplied: Boolean(
            verifiedAirborneAnchorResult.applied &&
              verifiedAirborneAnchorResult.match?.sourceMode === "lab"
          )
        }),
        hostWallRwDb: adjustedEstimatedRwDb,
        targetOutputs
      })
    : null;
  const ratingsWithOpeningLeakFieldBuildingRuntime =
    companyInternalOpeningLeakFieldBuildingRuntime?.status === "runtime_corridor_promoted" &&
    companyInternalOpeningLeakFieldBuildingRuntime.fieldRating
      ? {
          ...ratings,
          field: companyInternalOpeningLeakFieldBuildingRuntime.fieldRating,
          iso717: {
            ...ratings.iso717,
            RwPrime: companyInternalOpeningLeakFieldBuildingRuntime.rwPrimeDb ?? ratings.iso717.RwPrime,
            apparent: true
        }
      }
      : ratings;
  const visibleEstimatedRwDbWithOpeningLeakFieldBuildingRuntime =
    companyInternalOpeningLeakFieldBuildingRuntime?.labCompositeRwDb ?? visibleEstimatedRwDb;
  const gateSOpeningLeakBlockedOutputs =
    gateAHOpeningLeakStcSpectrumAdapter
      ? gateSOpeningLeakCompositeRuntime?.blockedOutputs.filter((output) =>
          output !== "STC" &&
          !(companyInternalOpeningLeakFieldBuildingRuntime?.supportedOutputs.includes(output) ?? false)
        ) ?? []
      : gateSOpeningLeakCompositeRuntime?.blockedOutputs.filter(
          (output) => !(companyInternalOpeningLeakFieldBuildingRuntime?.supportedOutputs.includes(output) ?? false)
        ) ?? [];
  const exactImpact = exactImpactSource ? buildOwnedImpactFromExactSource(exactImpactSource) : null;
  const directImpactLane = resolveLayerBasedImpactLane({
    catalog,
    exactImpact,
    explicitFloorRoleStack: hasFullyTaggedFloorStack,
    explicitPredictorInput,
    predictorInput,
    officialFloorSystemId: predictorAdaptation?.officialFloorSystemId ?? null,
    resolvedLayers: impactResolvedLayers,
    targetOutputs: options.targetOutputs
  });
  const directNarrowImpact = directImpactLane.narrowImpact;
  let floorSystemMatch = directImpactLane.floorSystemMatch;
  let boundFloorSystemMatch = directImpactLane.boundFloorSystemMatch;
  let impactCatalogMatch = directImpactLane.impactCatalogMatch;
  let floorSystemRecommendations = directImpactLane.floorSystemRecommendations;
  let narrowImpact = directImpactLane.narrowImpact;
  let boundFloorSystemEstimate = directImpactLane.boundFloorSystemEstimate;
  let floorSystemEstimate = directImpactLane.floorSystemEstimate;
  let explicitDeltaImpact = directImpactLane.explicitDeltaImpact;
  let predictorDeltaLwCompanion = directImpactLane.predictorDeltaLwCompanion;
  if (!floorSystemMatch && (predictorDeltaLwCompanion || options.targetOutputs?.includes("Ln,w"))) {
    const visibleFamily = inferImpactSupportingElementFamilyFromLayers(resolvedLayers);
    const predictorFamily = inferImpactSupportingElementFamilyFromPredictorInput(predictorInput);
    const canUseVisibleAnchor = Boolean(
      visibleFamily &&
        predictorFamily &&
        visibleFamily === predictorFamily &&
        (predictorFamily === "timber_joists" || predictorFamily === "mass_timber_clt")
    );

    if (canUseVisibleAnchor) {
      const visibleAnchorLane = resolveLayerBasedImpactLane({
        catalog,
        exactImpact,
        resolvedLayers,
        targetOutputs: options.targetOutputs
      });

      floorSystemMatch = visibleAnchorLane.floorSystemMatch;
      floorSystemEstimate = visibleAnchorLane.floorSystemMatch
        ? null
        : floorSystemEstimate ?? visibleAnchorLane.floorSystemEstimate;
      floorSystemRecommendations = visibleAnchorLane.floorSystemRecommendations;
    }
  }
  const visibleLayerPredictorBlockerWarning =
    !explicitPredictorInput &&
    !exactImpact &&
    !directImpactLane.floorSystemMatch &&
    !directImpactLane.boundFloorSystemMatch &&
    !directImpactLane.impactCatalogMatch
      ? getVisibleLayerPredictorBlockerWarning(layers, catalog)
      : null;

  if (
    !explicitPredictorInput &&
    !exactImpact &&
    !directImpactLane.floorSystemMatch &&
    !directImpactLane.boundFloorSystemMatch &&
    !directImpactLane.impactCatalogMatch
  ) {
    const derivedPredictorInput = maybeBuildImpactPredictorInputFromLayerStack(
      layers,
      gateWImpactPredictorSeed,
      undefined,
      catalog
    );

    if (derivedPredictorInput) {
      const derivedPredictorAdaptation = adaptImpactPredictorInput(derivedPredictorInput);
      const derivedCatalog = mergePredictorCatalog(baseCatalog, derivedPredictorAdaptation.catalogAdditions);
      const derivedImpactResolvedLayers =
        derivedPredictorAdaptation.sourceLayers.length && !derivedPredictorAdaptation.officialFloorSystemId
          ? resolveLayers(derivedPredictorAdaptation.sourceLayers, derivedCatalog)
          : resolvedLayers;
      const derivedImpactLane = resolveLayerBasedImpactLane({
        catalog: derivedCatalog,
        exactImpact,
        explicitFloorRoleStack: hasFullyTaggedFloorStack,
        predictorInput: derivedPredictorInput,
        officialFloorSystemId: derivedPredictorAdaptation.officialFloorSystemId,
        resolvedLayers: derivedImpactResolvedLayers,
        targetOutputs: options.targetOutputs
      });
      const derivedHeavyConcreteCombinedFormulaFallbackBlockerWarning =
        buildHeavyConcreteCombinedImpactFormulaFallbackBlockerWarning(derivedPredictorInput);
      const shouldUseDerived =
        !blocksBoundOnlyUbiqOpenWebCarpetDerivedEstimate &&
        (
          Boolean(derivedHeavyConcreteCombinedFormulaFallbackBlockerWarning) ||
          Boolean(
              derivedImpactLane.floorSystemMatch ||
              derivedImpactLane.boundFloorSystemMatch ||
              derivedImpactLane.impactCatalogMatch ||
              derivedImpactLane.predictorSpecificFloorSystemEstimate ||
              ((gateWLabRuntimeReady || gateZFieldImpactRuntimeReady) && derivedImpactLane.narrowImpact)
            ) ||
          (!directNarrowImpact &&
            !directImpactLane.floorSystemEstimate &&
            !directImpactLane.boundFloorSystemEstimate &&
            Boolean(
              derivedImpactLane.narrowImpact ||
                derivedImpactLane.floorSystemEstimate ||
                derivedImpactLane.boundFloorSystemEstimate
            ))
        );

      if (shouldUseDerived) {
        predictorInput = derivedPredictorInput;
        predictorInputMode = "derived_from_visible_layers";
        predictorAdaptation = derivedPredictorAdaptation;
        catalog = derivedCatalog;
        impactResolvedLayers = derivedImpactResolvedLayers;
        floorSystemMatch = derivedImpactLane.floorSystemMatch;
        boundFloorSystemMatch = derivedImpactLane.boundFloorSystemMatch;
        impactCatalogMatch = derivedImpactLane.impactCatalogMatch;
        floorSystemRecommendations = derivedImpactLane.floorSystemRecommendations;
        narrowImpact = derivedImpactLane.narrowImpact;
        boundFloorSystemEstimate = derivedImpactLane.boundFloorSystemEstimate;
        floorSystemEstimate = derivedImpactLane.floorSystemEstimate;
        explicitDeltaImpact = derivedImpactLane.explicitDeltaImpact;
        predictorDeltaLwCompanion = derivedImpactLane.predictorDeltaLwCompanion;
      }
    }
  }

  const postV1GateNFloorFieldImpactLabAnchorAvailable = Boolean(
    options.calculator === "dynamic" &&
      isPostV1GateNPureFieldImpactRequest(targetOutputs) &&
      airborneContext?.contextMode !== "building_prediction" &&
      (
        typeof exactImpact?.LnW === "number" ||
        typeof floorSystemMatch?.impact.LnW === "number" ||
        typeof impactCatalogMatch?.impact?.LnW === "number" ||
        typeof floorSystemEstimate?.impact.LnW === "number" ||
        typeof narrowImpact?.LnW === "number"
      )
  );

  const shouldWithholdUnreadyDynamicFloorImpactRuntime = Boolean(
    options.calculator === "dynamic" &&
      gateWFloorImpactContract &&
      floorSystemEstimate?.impact.basis !== OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS &&
      floorSystemEstimate?.impact.basis !== OPEN_WEB_DIRECT_FIXED_LINING_BASIS &&
      floorSystemEstimate?.impact.basis !== OPEN_BOX_TIMBER_SIMILARITY_BASIS &&
      floorSystemEstimate?.impact.basis !== OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS &&
      floorSystemEstimate?.impact.basis !== OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS &&
      floorSystemEstimate?.impact.basis !== OPEN_WEB_RAW_BARE_FORMULA_BASIS &&
      floorSystemEstimate?.impact.basis !== HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS &&
      !postV1GateNFloorFieldImpactLabAnchorAvailable &&
      !gateWLabRuntimeReady &&
      !gateZFieldImpactRuntimeReady &&
      !exactImpact &&
      !floorSystemMatch &&
      !boundFloorSystemMatch &&
      !impactCatalogMatch
  );

  if (shouldWithholdUnreadyDynamicFloorImpactRuntime) {
    predictorInput = explicitPredictorInput;
    predictorInputMode = explicitPredictorInput ? "explicit_predictor_input" : undefined;
    floorSystemEstimate = null;
    boundFloorSystemEstimate = null;
    narrowImpact = null;
    explicitDeltaImpact = null;
    predictorDeltaLwCompanion = null;
  }

  const rawFloorRolePromptGuard =
    !explicitPredictorInput && !exactImpactSource
      ? getRawFloorRolePromptGuard({
          catalog,
          exactFloorSystemMatchActive: Boolean(floorSystemMatch),
          hasLiveImpactSupport: Boolean(
            floorSystemMatch ||
              boundFloorSystemMatch ||
              impactCatalogMatch ||
              floorSystemEstimate ||
              boundFloorSystemEstimate ||
              explicitDeltaImpact ||
              narrowImpact ||
              predictorDeltaLwCompanion
          ),
          inferredLayers: inferredImpactLayers,
          rawLayers: layers,
          requestedOutputs: options.targetOutputs ?? []
        })
      : null;
  const rawFloorParityGuardWarning =
    !explicitPredictorInput && !exactImpactSource
      ? getRawFloorParityGuardWarning({
          exactFloorSystemMatchActive: Boolean(floorSystemMatch),
          rawLayers: layers,
          requestedOutputs: options.targetOutputs ?? []
        })
      : null;
  const { impact, lowerBoundImpact } = finalizeResolvedImpactLane({
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    exactImpactSource,
    explicitDeltaImpact,
    fallbackSupplementaryImpact: narrowImpact,
    floorSystemEstimate,
    floorSystemMatch,
    impactCatalogMatch,
    impactFieldContext,
    narrowImpact,
    predictorDeltaLwCompanion,
    predictorInput,
    preferredSupplementaryImpact: directNarrowImpact,
    resolvedLayers: impactResolvedLayers
  });
  const floorCarrier = pickFloorCarrier({
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    floorSystemEstimate,
    floorSystemMatch
  });
  const hideLowConfidenceProxyAirborne = shouldHideLowConfidenceProxyAirborne(floorSystemEstimate);
  const floorSystemRatings = hideLowConfidenceProxyAirborne
    ? null
    : buildFloorSystemRatings({
        boundFloorSystemEstimate,
        boundFloorSystemMatch,
        floorSystemEstimate,
        floorSystemMatch,
        impact,
        lowerBoundImpact,
        screeningBasis: explicitPredictorInput ? undefined : "screening_mass_law_curve_seed_v3",
        screeningLayers: explicitPredictorInput
          ? explicitDeltaImpact
            ? pickReferenceFloorRatingLayers(impactResolvedLayers)
            : impactResolvedLayers
          : undefined,
        screeningRwDb: explicitPredictorInput ? null : ratings.iso717.Rw,
        screeningRwPlusCtrDb: explicitPredictorInput ? null : round1(ratings.iso717.Rw + ratings.iso717.Ctr)
      });
  const hasInferredConcreteCeilingHelperCarrierSignal = hasInferredConcreteCeilingHelperSupportSignal({
    inferredImpactLayers,
    visibleLayers: layers
  });
  const hasImpactBackedScreeningFloorCarrierSignal = Boolean(
    impact &&
      floorSystemRatings &&
      (hasVisibleFloorCarrier || hasInferredConcreteCeilingHelperCarrierSignal)
  );
  const hasFloorSupportCarrierSignal = Boolean(
    floorSystemMatch ||
      floorSystemEstimate ||
      boundFloorSystemMatch ||
      boundFloorSystemEstimate ||
      impactCatalogMatch ||
      explicitDeltaImpact ||
      hasImpactBackedScreeningFloorCarrierSignal
  );
  const initialTargetOutputSupport = analyzeTargetOutputSupport({
    floorCarrier: hasFloorSupportCarrierSignal ? floorSystemRatings ?? floorCarrier : null,
    impact,
    lowerBoundImpact,
    metrics: {
      airborneIsoDescriptor: ratingsWithOpeningLeakFieldBuildingRuntime.iso717.descriptor,
      estimatedCDb: ratingsWithOpeningLeakFieldBuildingRuntime.iso717.C,
      estimatedCtrDb: ratingsWithOpeningLeakFieldBuildingRuntime.iso717.Ctr,
      estimatedDnADb: ratingsWithOpeningLeakFieldBuildingRuntime.field?.DnA,
      estimatedDnTADb: ratingsWithOpeningLeakFieldBuildingRuntime.field?.DnTA,
      estimatedDnTAkDb: ratingsWithOpeningLeakFieldBuildingRuntime.field?.DnTAk,
      estimatedDnTwDb: ratingsWithOpeningLeakFieldBuildingRuntime.field?.DnTw,
      estimatedDnWDb: ratingsWithOpeningLeakFieldBuildingRuntime.field?.DnW,
      estimatedRwDb: visibleEstimatedRwDbWithOpeningLeakFieldBuildingRuntime,
      estimatedRwPrimeDb: ratingsWithOpeningLeakFieldBuildingRuntime.field?.RwPrime ??
        ratingsWithOpeningLeakFieldBuildingRuntime.iso717.RwPrime,
      estimatedStc: visibleEstimatedStcDb
    },
    targetOutputs: options.targetOutputs ?? []
  });
  const gateYCltMassTimberCtrSpectrumAdapterBasis =
    maybeBuildGateYCltMassTimberCtrSpectrumAdapterBasis({
      airborneContext,
      basis: dynamicAirborneResult?.airborneBasis ?? null,
      ctrDb: ratings.iso717.Ctr,
      sourceAnchorApplied: verifiedAirborneAnchorResult.applied,
      targetOutputs: initialTargetOutputSupport.targetOutputs
    });
  const targetOutputSupportWithGateYCltCtr = gateYCltMassTimberCtrSpectrumAdapterBasis
    ? moveUnsupportedOutputsToSupported(initialTargetOutputSupport, ["Ctr"])
    : initialTargetOutputSupport;
  const localSubstitutionLabSpectrumAdapter =
    options.calculator === "dynamic"
      ? maybeBuildBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapter({
          airborneContext,
          basis: dynamicAirborneResult?.airborneBasis ?? null,
          sourceAnchorApplied: verifiedAirborneAnchorResult.applied,
          targetOutputs: targetOutputSupportWithGateYCltCtr.targetOutputs
        })
      : null;
  const visibleDynamicAirborneTrace =
    localSubstitutionLabSpectrumAdapter && dynamicAirborneResult?.trace
      ? {
          ...dynamicAirborneResult.trace,
          notes: [
            ...dynamicAirborneResult.trace.notes.filter(
              (note) => !/STC, C, Ctr, field, and building adapters remain blocked/i.test(note)
            ),
            "Local substitution lab spectrum adapter now rates STC, C, and Ctr from the calculated element-lab curve; field and building adapters remain blocked."
          ]
        }
      : dynamicAirborneResult?.trace;
  const localSubstitutionRuntimeBlockedOutputs =
    options.calculator === "dynamic"
      ? getBroadAccuracyWallTripleLeafLocalSubstitutionRuntimeBlockedOutputs({
          airborneContext,
          catalog,
          layers: airborneResolvedLayers.map((layer) => ({
            floorRole: layer.floorRole,
            materialId: layer.material.id,
            thicknessMm: layer.thicknessMm
          })),
          targetOutputs: targetOutputSupportWithGateYCltCtr.targetOutputs
        })
      : [];
  const targetOutputSupportWithLocalSubstitutionLabSpectrumAdapter = localSubstitutionLabSpectrumAdapter
    ? moveUnsupportedOutputsToSupported(
        moveSupportedOutputsToUnsupported(
          targetOutputSupportWithGateYCltCtr,
          localSubstitutionRuntimeBlockedOutputs
        ),
        localSubstitutionLabSpectrumAdapter.supportedOutputs
      )
    : moveSupportedOutputsToUnsupported(
        targetOutputSupportWithGateYCltCtr,
        localSubstitutionRuntimeBlockedOutputs
      );
  const rockwoolSplitTripleLeafExactOutputWithhold =
    withholdRockwoolSplitTripleLeafExactTargetOutputs({
      airborneContext,
      layers: resolvedLayers,
      targetOutputSupport: targetOutputSupportWithLocalSubstitutionLabSpectrumAdapter,
      trace: dynamicAirborneResult?.trace
    });
  const targetOutputSupport = rockwoolSplitTripleLeafExactOutputWithhold.targetOutputSupport;
  const floorFamilySourceGuard =
    getFloorFamilySourceGuard(impactResolvedLayers) ?? getFloorFamilySourceGuard(resolvedLayers);
  const floorFamilySourceGuardWarnings =
    !impact && !lowerBoundImpact && targetOutputSupport.unsupportedImpactOutputs.length > 0 && floorFamilySourceGuard
      ? [floorFamilySourceGuard.warning]
      : [];
  const steelFloorFormulaFallbackBlockerWarning = buildSteelFloorImpactFormulaFallbackBlockerWarning(predictorInput);
  const heavyConcreteCombinedFormulaFallbackBlockerWarning =
    buildHeavyConcreteCombinedImpactFormulaFallbackBlockerWarning(predictorInput);
  const impactPredictorAdditionalWarnings = [
    ...floorFamilySourceGuardWarnings,
    ...(heavyConcreteCombinedFormulaFallbackBlockerWarning ? [heavyConcreteCombinedFormulaFallbackBlockerWarning] : []),
    ...(steelFloorFormulaFallbackBlockerWarning ? [steelFloorFormulaFallbackBlockerWarning] : [])
  ];
  const {
    dynamicImpactTrace,
    impactPredictorStatus,
    impactSupport
  } = buildResolvedImpactArtifacts({
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    catalog,
    floorSystemEstimate,
    floorSystemMatch,
    impact,
    impactCatalogMatch,
    impactFieldContext,
    impactPredictorAdditionalWarnings,
    lowerBoundImpact,
    predictorInput,
    predictorInputMode,
    resolvedLayers: impactResolvedLayers,
    targetOutputSupport
  });
  const dynamicCandidateResolverRuntime = options.calculator === "dynamic"
    ? buildDynamicCalculatorCandidateResolverRuntime({
        airborneContext,
        floorImpactContext,
        layers,
        route: inferDynamicCalculatorRuntimeRoute({
          layers,
          targetOutputs: targetOutputSupport.targetOutputs
        }),
        runtimeSignal: companyInternalOpeningLeakFieldBuildingRuntime?.basis
          ? {
              airborneBasis: companyInternalOpeningLeakFieldBuildingRuntime.basis,
              detectedFamily: dynamicAirborneResult?.trace.detectedFamily,
              runtimeValueMovement:
                companyInternalOpeningLeakFieldBuildingRuntime.status === "runtime_corridor_promoted",
              selectedMethod: dynamicAirborneResult?.trace.selectedMethod,
              strategy: dynamicAirborneResult?.trace.strategy ?? "company_internal_opening_leak_field_building_adapter"
            }
          : dynamicAirborneResult
          ? {
              airborneBasis:
                localSubstitutionLabSpectrumAdapter?.basis ??
                gateYCltMassTimberCtrSpectrumAdapterBasis ??
                dynamicAirborneResult.airborneBasis,
              detectedFamily: dynamicAirborneResult.trace.detectedFamily,
              runtimeValueMovement:
                dynamicAirborneResult.airborneBasis?.method === GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
                  ? true
                  : dynamicAirborneResult.airborneCandidateResolution?.runtimeValueMovement,
              selectedMethod: dynamicAirborneResult.trace.selectedMethod,
              strategy: dynamicAirborneResult.trace.strategy
            }
          : null,
        sourceAnchor: {
          anchorKind: compatibleWallAnchorDeltaResult.applied ? "compatible_delta" : "exact_full_stack",
          applied: compatibleWallAnchorDeltaResult.applied || verifiedAirborneAnchorResult.applied,
          match: (compatibleWallAnchorDeltaResult.match ?? verifiedAirborneAnchorResult.match)
            ? {
                id: (compatibleWallAnchorDeltaResult.match ?? verifiedAirborneAnchorResult.match)?.id ?? "",
                label: (compatibleWallAnchorDeltaResult.match ?? verifiedAirborneAnchorResult.match)?.label ?? "",
                metricLabel: (compatibleWallAnchorDeltaResult.match ?? verifiedAirborneAnchorResult.match)?.metricLabel ?? "Rw",
                metricValue: (compatibleWallAnchorDeltaResult.match ?? verifiedAirborneAnchorResult.match)?.metricValue,
                sourceMode: (compatibleWallAnchorDeltaResult.match ?? verifiedAirborneAnchorResult.match)?.sourceMode ?? "lab"
              }
            : null
        },
        targetOutputs: targetOutputSupport.targetOutputs
      })
    : null;
  const shouldParkAirborneBuildingPredictionRuntime =
    dynamicCandidateResolverRuntime?.routeInputAssessment.outputBasis === "building_prediction" &&
    (
      dynamicCandidateResolverRuntime.resolution.selectedOrigin === "needs_input" ||
      dynamicCandidateResolverRuntime.resolution.selectedOrigin === "unsupported"
    );
  const suppressParkedBuildingPredictionOverlayWarnings =
    dynamicCandidateResolverRuntime?.routeInputAssessment.outputBasis === "building_prediction" &&
    (
      dynamicCandidateResolverRuntime.resolution.selectedOrigin === "needs_input" ||
      dynamicCandidateResolverRuntime.resolution.selectedOrigin === "unsupported"
    );
  const parkedAirborneBuildingPredictionOutputs = shouldParkAirborneBuildingPredictionRuntime
    ? [...targetOutputSupport.targetOutputs]
    : [];
  const gateARAirborneBuildingPredictionActive =
    dynamicCandidateResolverRuntime?.resolution.selectedBasis?.method ===
    GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD;
  const gateARAirborneBuildingPredictionLabAliasBlockedOutputs =
    gateARAirborneBuildingPredictionActive
      ? targetOutputSupport.targetOutputs.filter((output) =>
          GATE_AR_AIRBORNE_BUILDING_PREDICTION_LAB_ALIAS_OUTPUTS.has(output)
        )
      : [];
  const gateAYAdvancedWallBlockedOutputs =
    dynamicAirborneResult?.airborneBasis?.method === PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_METHOD &&
    dynamicAirborneResult.airborneBasis.origin !== "family_physics_prediction"
      ? targetOutputSupport.targetOutputs
      : [];
  const exactMeasuredSourceMetricUnsupportedOutputs =
    getAnswerEngineV1ExactMeasuredMetricUnsupportedOutputs({
      resolution: dynamicCandidateResolverRuntime?.resolution,
      sourceMetricLabel: verifiedAirborneAnchorResult.match?.metricLabel,
      supportedTargetOutputs: targetOutputSupport.supportedTargetOutputs
    });
  const anchoredDeltaMetricUnsupportedOutputs =
    getAnswerEngineV1AnchoredDeltaMetricUnsupportedOutputs({
      anchorMetricLabel: compatibleWallAnchorDeltaResult.match?.metricLabel,
      compatibleAnchorDeltaApplied: compatibleWallAnchorDeltaResult.applied,
      resolution: dynamicCandidateResolverRuntime?.resolution,
      supportedTargetOutputs: targetOutputSupport.supportedTargetOutputs
    });
  const exactMeasuredFloorMetricUnsupportedOutputs =
    getAnswerEngineV1ExactFloorMetricUnsupportedOutputs({
      floorSystemMatch,
      impact,
      supportedTargetOutputs: targetOutputSupport.supportedTargetOutputs
    });
  const answerEngineV1SelectedCandidate = dynamicCandidateResolverRuntime?.resolution.candidates.find(
    (candidate) => candidate.id === dynamicCandidateResolverRuntime.resolution.selectedCandidateId
  );
  const answerEngineV1OwnedPhysicalInputStop =
    dynamicCandidateResolverRuntime
      ? isAnswerEngineV1WallOwnedPhysicalInputStop({
          basis: dynamicCandidateResolverRuntime.resolution.selectedBasis,
          detectedFamily: dynamicAirborneResult?.trace.detectedFamily,
          resolution: dynamicCandidateResolverRuntime.resolution,
          strategy: dynamicAirborneResult?.trace.strategy
        })
      : false;
  const shouldParkAnswerEngineV1Outputs =
    dynamicCandidateResolverRuntime &&
    dynamicCandidateResolverRuntime.resolution.selectedOrigin === "needs_input" &&
    dynamicCandidateResolverRuntime.routeInputAssessment.route === "wall" &&
    (
      !hasAnswerEngineV1SupportedWallAirborneOutput(targetOutputSupport.supportedTargetOutputs) ||
      answerEngineV1OwnedPhysicalInputStop
    ) &&
    shouldApplyAnswerEngineV1WallNeedsInputBoundary({
      basis: dynamicCandidateResolverRuntime.resolution.selectedBasis,
      contextMode: airborneOverlayResult.overlay?.contextMode,
      detectedFamily: dynamicAirborneResult?.trace.detectedFamily,
      outputs: targetOutputSupport.targetOutputs,
      resolution: dynamicCandidateResolverRuntime.resolution,
      strategy: dynamicAirborneResult?.trace.strategy
    });
  const answerEngineV1ParkedOutputs =
    shouldParkAnswerEngineV1Outputs
      ? [
          ...new Set(
            (answerEngineV1SelectedCandidate?.outputIds.length
              ? answerEngineV1SelectedCandidate.outputIds
              : targetOutputSupport.targetOutputs
            ).filter((output) => targetOutputSupport.targetOutputs.includes(output))
          )
        ]
      : [];
  const visibleTargetOutputSupport = moveSupportedOutputsToUnsupported(
    moveSupportedOutputsToUnsupported(
      moveSupportedOutputsToUnsupported(
        moveSupportedOutputsToUnsupported(
          moveSupportedOutputsToUnsupported(
            targetOutputSupport,
            parkedAirborneBuildingPredictionOutputs
          ),
          answerEngineV1ParkedOutputs
        ),
        gateSOpeningLeakBlockedOutputs
      ),
      gateAYAdvancedWallBlockedOutputs
    ),
    gateARAirborneBuildingPredictionLabAliasBlockedOutputs
  );
  const visibleTargetOutputSupportWithExactMetricScope = moveSupportedOutputsToUnsupported(
    moveSupportedOutputsToUnsupported(
      moveSupportedOutputsToUnsupported(
        visibleTargetOutputSupport,
        exactMeasuredSourceMetricUnsupportedOutputs
      ),
      anchoredDeltaMetricUnsupportedOutputs
    ),
    exactMeasuredFloorMetricUnsupportedOutputs
  );
  const parkedAirborneBuildingPredictionOutputSet = new Set(parkedAirborneBuildingPredictionOutputs);
  const hideParkedAirborneBuildingPredictionMetrics =
    parkedAirborneBuildingPredictionOutputSet.size > 0;
  const visibleRatings = hideParkedAirborneBuildingPredictionMetrics
    ? {
        ...ratingsWithOpeningLeakFieldBuildingRuntime,
        iso717: {
          ...ratingsWithOpeningLeakFieldBuildingRuntime.iso717,
          RwPrime: undefined
        },
        field: undefined
      }
    : ratingsWithOpeningLeakFieldBuildingRuntime;
  const warnings = buildEstimateWarnings(resolvedLayers, selectedCalculatorLabel);
  warnings.push(
    ...(localSubstitutionLabSpectrumAdapter
      ? (dynamicAirborneResult?.warnings ?? []).filter(
          (warning) =>
            !/STC, C, Ctr, field, and building adapters remain blocked/i.test(warning) &&
            !/source-absent error budget for Rw only/i.test(warning)
        )
      : (dynamicAirborneResult?.warnings ?? []))
  );
  if (!suppressParkedBuildingPredictionOverlayWarnings) {
    warnings.push(...airborneOverlayResult.warnings);
  }
  warnings.push(...verifiedAirborneAnchorResult.warnings);
  warnings.push(...compatibleWallAnchorDeltaResult.warnings);
  warnings.push(...approximateAirborneFieldCompanionResult.warnings);
  if (rockwoolSplitTripleLeafExactOutputWithhold.warning) {
    warnings.push(rockwoolSplitTripleLeafExactOutputWithhold.warning);
  }
  if (gateAHOpeningLeakStcSpectrumAdapter?.warning) {
    warnings.push(gateAHOpeningLeakStcSpectrumAdapter.warning);
  } else if (companyInternalOpeningLeakFieldBuildingRuntime?.warnings.length) {
    warnings.push(...companyInternalOpeningLeakFieldBuildingRuntime.warnings);
  } else if (gateSOpeningLeakCompositeRuntime?.warning) {
    warnings.push(gateSOpeningLeakCompositeRuntime.warning);
  }
  if (gateYCltMassTimberCtrSpectrumAdapterBasis) {
    warnings.push(GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_WARNING);
  }
  if (localSubstitutionLabSpectrumAdapter) {
    warnings.push(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING);
  }
  warnings.push(...buildTargetOutputWarnings(visibleTargetOutputSupportWithExactMetricScope));
  if (exactMeasuredSourceMetricUnsupportedOutputs.length > 0 && verifiedAirborneAnchorResult.match) {
    warnings.push(
      `Exact measured airborne source ${verifiedAirborneAnchorResult.match.label} reports ${verifiedAirborneAnchorResult.match.metricLabel}; DynEcho kept ${exactMeasuredSourceMetricUnsupportedOutputs.join(", ")} out of the exact answer instead of aliasing measured and calculated metrics.`
    );
  }
  if (anchoredDeltaMetricUnsupportedOutputs.length > 0 && compatibleWallAnchorDeltaResult.match) {
    warnings.push(
      `Compatible measured-anchor delta from ${compatibleWallAnchorDeltaResult.match.label} owns ${compatibleWallAnchorDeltaResult.match.metricLabel}; DynEcho kept ${anchoredDeltaMetricUnsupportedOutputs.join(", ")} out of the anchored answer instead of aliasing unowned companion metrics.`
    );
  }
  if (exactMeasuredFloorMetricUnsupportedOutputs.length > 0 && floorSystemMatch) {
    const exactOutputs = outputsForExactMeasuredFloorSystem({
      floorSystemMatch,
      impact
    });
    warnings.push(
      `Exact measured floor source ${floorSystemMatch.system.label} reports ${exactOutputs.join(", ")}; DynEcho kept ${exactMeasuredFloorMetricUnsupportedOutputs.join(", ")} out of the exact answer instead of aliasing measured and calculated metrics.`
    );
  }
  warnings.push(...floorFamilySourceGuardWarnings);
  if (heavyConcreteCombinedFormulaFallbackBlockerWarning) {
    warnings.push(heavyConcreteCombinedFormulaFallbackBlockerWarning);
  }
  if (steelFloorFormulaFallbackBlockerWarning) {
    warnings.push(steelFloorFormulaFallbackBlockerWarning);
  }
  if (
    dynamicCandidateResolverRuntime?.routeInputAssessment.outputBasis === "building_prediction" &&
    dynamicCandidateResolverRuntime.resolution.selectedOrigin === "needs_input"
  ) {
    warnings.push(GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING);
  }
  if (
    dynamicCandidateResolverRuntime?.routeInputAssessment.outputBasis === "building_prediction" &&
    dynamicCandidateResolverRuntime.resolution.selectedOrigin === "unsupported"
  ) {
    warnings.push(GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING);
  }
  if (answerEngineV1ParkedOutputs.length > 0) {
    warnings.push(
      `Acoustic Calculator Answer Engine V1 selected ${dynamicCandidateResolverRuntime?.resolution.selectedOrigin ?? "a boundary"} for ${answerEngineV1ParkedOutputs.join(", ")}; DynEcho kept those outputs out of the published answer until the required physical inputs or basis owner are available.`
    );
  }

  if (shouldWithholdUnreadyDynamicFloorImpactRuntime && gateWFloorImpactContract) {
    const gateZFieldWarning = buildGateZFieldImpactRuntimeWarning(gateZFloorImpactFieldAssessment);
    const gateWImpactWarning =
      gateWFloorImpactContract.missingPhysicalInputs.length > 0
        ? `Dynamic Calculator floor-impact runtime is waiting for ${gateWFloorImpactContract.missingPhysicalInputs.join(", ")} before promoting Ln,w / DeltaLw from the physics lane.`
        : "Dynamic Calculator floor-impact runtime did not promote this adapter set; lab Ln,w / DeltaLw, field impact, and ASTM IIC/AIIC stay on separate runtime boundaries.";
    warnings.push(
      gateZFieldWarning ?? gateWImpactWarning
    );
  }

  if (predictorAdaptation) {
    warnings.push(...predictorAdaptation.notes);
  }

  if (hideLowConfidenceProxyAirborne) {
    warnings.push(
      "Low-confidence published-family fallback is active without finite airborne companions. DynEcho kept unavailable proxy airborne outputs hidden instead of fabricating supported Rw / Ctr values."
    );
  } else if (hasReinforcedConcreteLowConfidenceProxyAirborne(floorSystemEstimate)) {
    warnings.push(REINFORCED_CONCRETE_LOW_CONFIDENCE_PROXY_AIRBORNE_WARNING);
  }

  if (predictorInputMode === "derived_from_visible_layers") {
    warnings.push(
      "Impact predictor topology was derived from visible floor-role layers, so curated family and predictor lanes can activate without a hidden selector."
    );
  } else if (visibleLayerPredictorBlockerWarning) {
    warnings.push(visibleLayerPredictorBlockerWarning);
  }

  if (rawFloorRolePromptGuard) {
    warnings.push(rawFloorRolePromptGuard.warning);
  }

  if (exactImpact) {
    const ratingBasis =
      exactImpact.basis === ASTM_E989_IMPACT_RATING_BASIS
        ? "ASTM E989 IIC/AIIC contour rating"
        : "ISO 717-2 nominal grid";
    warnings.push(
      `Impact ratings were derived from an exact ${exactImpactSource?.labOrField ?? "lab"} impact-band source on the ${ratingBasis}; the airborne TL curve stayed on the ${selectedCalculatorLabel ?? "screening"} path.`
    );
  } else if (exactImpactSource) {
    warnings.push(
      "Exact impact-band input was ignored because it did not match a supported ISO 717-2 or ASTM E989 nominal band set."
    );
  }

  if (floorSystemMatch) {
    warnings.push(
      `Curated exact floor-system match active: ${floorSystemMatch.system.label}. Exact floor-family impact and airborne companion ratings are available in the operator deck.`
    );
    if (rawFloorParityGuardWarning) {
      warnings.push(rawFloorParityGuardWarning);
    }
  } else if (boundFloorSystemMatch) {
    warnings.push(
      `Curated bound-only floor-system match active: ${boundFloorSystemMatch.system.label}. Airborne family data is exact, while impact stays conservative as an upper-bound lane.`
    );
  } else if (floorSystemEstimate) {
    warnings.push(
      floorSystemEstimate.impact.basis === "predictor_lightweight_steel_fl28_interpolation_estimate"
        ? `Published family estimate active: lightweight steel FL-28 interpolation at ${floorSystemEstimate.fitPercent}% fit. DynEcho stayed inside the curated UBIQ open-web family instead of drifting into a broad steel blend.`
        : floorSystemEstimate.impact.basis ===
            "predictor_lightweight_steel_open_web_supported_band_similarity_estimate"
          ? `Published family estimate active: open-web steel supported-band similarity at ${floorSystemEstimate.fitPercent}% fit. DynEcho stayed inside the UBIQ FL-24/FL-26 elastic suspended-ceiling source grid instead of falling back to a broad steel blend or bound-only row.`
        : floorSystemEstimate.impact.basis === OPEN_WEB_DIRECT_FIXED_LINING_BASIS
          ? `Published family estimate active: open-web steel direct-fixed lining interpolation at ${floorSystemEstimate.fitPercent}% fit. DynEcho stayed inside the UBIQ FL-23/FL-25/FL-27 direct-fixed source grid instead of borrowing resilient suspended-ceiling rows or the broad steel blend.`
        : floorSystemEstimate.impact.basis === OPEN_BOX_TIMBER_SIMILARITY_BASIS
          ? `Published family estimate active: open-box timber package-transfer corridor at ${floorSystemEstimate.fitPercent}% fit. DynEcho stayed inside the TUAS open-box timber packet family instead of borrowing open-web steel rows, exact-only hybrids, or a broad low-confidence blend.`
        : floorSystemEstimate.impact.basis === OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
          ? `Scoped formula estimate active: open-box timber EPS/screed hybrid package formula corridor at ${floorSystemEstimate.fitPercent}% fit. DynEcho used the R7b same-stack design anchor with source-absent budgets while keeping exact rows, dry package-transfer, field/building, and ASTM/IIC aliases out.`
        : floorSystemEstimate.impact.basis === OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS
          ? `Scoped formula estimate active: raw-bare open-box timber formula corridor at ${floorSystemEstimate.fitPercent}% fit. DynEcho used the bare-carrier source-absent formula and kept finished package-transfer, field/building, and ASTM/IIC aliases out.`
        : floorSystemEstimate.impact.basis === OPEN_WEB_RAW_BARE_FORMULA_BASIS
          ? `Scoped formula estimate active: raw-bare open-web steel formula corridor at ${floorSystemEstimate.fitPercent}% fit. DynEcho used the bare-carrier source-absent formula and kept UBIQ INEX/firestop packages, field/building, and ASTM/IIC aliases out.`
        : floorSystemEstimate.impact.basis === HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
          ? `Scoped formula estimate active: helper-only timber/open-web impact stack formula corridor at ${floorSystemEstimate.fitPercent}% fit. DynEcho used the lower-treatment source-absent formula and kept exact/package/raw-bare lanes, field/building, and ASTM/IIC aliases out.`
        : floorSystemEstimate.kind === "low_confidence"
          ? `Published low-confidence fallback active: ${floorSystemEstimate.structuralFamily} at ${floorSystemEstimate.fitPercent}% fit.`
          : `Published family estimate active: ${floorSystemEstimate.structuralFamily} ${floorSystemEstimate.kind.replaceAll("_", " ")} at ${floorSystemEstimate.fitPercent}% fit.`
    );
  } else if (boundFloorSystemEstimate) {
    warnings.push(
      `Published bound-only family estimate active: ${boundFloorSystemEstimate.structuralFamily} ${boundFloorSystemEstimate.kind.replaceAll("_", " ")}. DynEcho is carrying official upper-bound impact support without fabricating an exact Ln,w value.`
    );
  } else if (floorSystemRecommendations.length > 0) {
    const recommendationWarning = buildClosestFloorSystemRecommendationWarning({
      catalog,
      recommendations: floorSystemRecommendations,
      resolvedLayers: impactResolvedLayers
    });

    if (recommendationWarning) {
      warnings.push(recommendationWarning);
    }
  }

  if (impactCatalogMatch) {
    warnings.push(
      impactCatalogMatch.lowerBoundImpact && impactCatalogMatch.impact
        ? `Official impact product row active: ${impactCatalogMatch.catalog.label}. DynEcho is carrying official product evidence together with conservative lower-bound support while keeping the live impact lane on the matched metric.`
        : impactCatalogMatch.lowerBoundImpact
          ? `Official lower-bound catalog support active: ${impactCatalogMatch.catalog.label}. DynEcho is carrying conservative product-row support without fabricating an exact Ln,w metric.`
          : `Official impact product row active: ${impactCatalogMatch.catalog.label}. DynEcho is carrying official product evidence before falling back to the narrow heavy-floor formula.`
    );
  }

  if (impactFieldContext) {
    if (impact?.fieldEstimateProfile === "direct_flanking_energy_sum" && typeof impact.LPrimeNW === "number") {
      warnings.push(
        typeof impact.LPrimeNTw === "number"
          ? "Live direct+flanking field path is active on the main impact lane. Explicit path offsets are being summed before standardized field re-rating."
          : "Live direct+flanking field path is active on the main impact lane. Explicit path offsets are being summed on the field side before ISO 717-2 re-rating."
      );
      if (typeof impact.fieldEstimateLowerTreatmentReductionDb === "number") {
        warnings.push(
          "An explicit impact-side lower-treatment reduction ΔLd was applied to the direct path before direct+flanking energy summation; this was not inferred from airborne ΔR."
        );
      }
      if (typeof impact.fieldEstimateExpertPathModifierCount === "number" && impact.fieldEstimateExpertPathModifierCount > 0) {
        warnings.push(
          "Explicit flanking-path modifiers were also applied from expert junction inputs (length / isolation / short-circuit / Kij-style penalties)."
        );
      }
    } else if (impact?.guideEstimateProfile && typeof impact.LPrimeNT50 === "number") {
      warnings.push(
        "Live Turkish simple-guide supplement is active on the main impact lane. Ln,w+CI, K, and Hd are now being carried through the engine boundary together with any verified Table 2.7 / Table 2.8 lookups."
      );
    } else if (impact && typeof impact.LPrimeNTw === "number") {
      warnings.push(
        "Live field-side supplement is active on the main impact lane. K and receiving-room context are now carried through the engine boundary, not only the guide lane."
      );
      if (
        impact.fieldEstimateProfile === "explicit_field_lprimenw_from_lnw_plus_k" &&
        typeof impact.fieldEstimateLowerTreatmentReductionDb === "number"
      ) {
        warnings.push(
          "An explicit impact-side lower-treatment reduction ΔLd was applied before the field-side K correction and any subsequent room-volume standardization; this was not inferred from airborne ΔR."
        );
      }
    } else if (lowerBoundImpact && typeof lowerBoundImpact.LPrimeNTwUpperBound === "number") {
      warnings.push(
        "Live field-side conservative upper-bound support is active on the main impact lane. Curated bound support is being normalized with K and receiving-room context without fabricating an exact Ln,w."
      );
    }
  }

  if (
    airborneContext?.contextMode &&
    airborneContext.contextMode !== "element_lab" &&
    ratings.field?.geometryMissing &&
    Array.isArray(ratings.field.geometryNeeded) &&
    ratings.field.geometryNeeded.length > 0
  ) {
    warnings.push(
      `Airborne field conversion is incomplete. ${ratings.field.geometryNeeded.join(", ")} must be defined before DnT,w / DnT,A can be calculated from the apparent curve.`
    );
  }

  if (
    airborneContext?.contextMode &&
    airborneContext.contextMode !== "element_lab" &&
    ratings.field?.absorptionDataMissing &&
    Array.isArray(ratings.field.absorptionDataNeeded) &&
    ratings.field.absorptionDataNeeded.length > 0
  ) {
    warnings.push(
      `Airborne field absorption metadata is incomplete. ${ratings.field.absorptionDataNeeded.join(", ")} is still missing for a fuller Dn / absorption trace, even though the current curve can already produce the available field level-difference outputs.`
    );
  }

  const ratingAdapterBasisSet = [
    ...(gateAHOpeningLeakStcSpectrumAdapter ? [gateAHOpeningLeakStcSpectrumAdapter.ratingAdapterBasis] : []),
    ...(localSubstitutionLabSpectrumAdapter?.ratingAdapterBasisSet ?? [])
  ];

  const result: AssemblyCalculation = {
    availableCalculators: [...availableCalculators],
    boundFloorSystemEstimate,
    boundFloorSystemMatch,
    airborneOverlay: airborneOverlayResult.overlay,
    calculatorId: dynamicAirborneResult?.id ?? importedCalculatorResult?.id,
    calculatorLabel: dynamicAirborneResult?.label ?? importedCalculatorResult?.label,
    dynamicAirborneTrace: visibleDynamicAirborneTrace,
    dynamicImpactTrace: dynamicImpactTrace ?? undefined,
    impact,
    impactCatalogMatch,
    impactPredictorStatus,
    impactSupport,
    floorSystemEstimate,
    floorSystemMatch,
    floorSystemRatings,
    floorSystemRecommendations,
    lowerBoundImpact,
    ok: true,
    curve,
    layers: resolvedLayers,
    metrics: {
      airborneIsoDescriptor: visibleRatings.iso717.descriptor,
      totalThicknessMm,
      surfaceMassKgM2,
      estimatedRwDb: visibleEstimatedRwDbWithOpeningLeakFieldBuildingRuntime,
      estimatedRwPrimeDb: hideParkedAirborneBuildingPredictionMetrics
        ? undefined
        : visibleRatings.field?.RwPrime ?? visibleRatings.iso717.RwPrime,
      estimatedCDb: visibleRatings.iso717.C,
      estimatedCtrDb: visibleRatings.iso717.Ctr,
      estimatedDnTwDb: hideParkedAirborneBuildingPredictionMetrics ? undefined : visibleRatings.field?.DnTw,
      estimatedDnTADb: hideParkedAirborneBuildingPredictionMetrics ? undefined : visibleRatings.field?.DnTA,
      estimatedDnTAkDb: hideParkedAirborneBuildingPredictionMetrics ? undefined : visibleRatings.field?.DnTAk,
      estimatedDnWDb: hideParkedAirborneBuildingPredictionMetrics ? undefined : visibleRatings.field?.DnW,
      estimatedDnADb: hideParkedAirborneBuildingPredictionMetrics ? undefined : visibleRatings.field?.DnA,
      estimatedStc: visibleEstimatedStcDb,
      airGapCount: resolvedLayers.filter((layer) => layer.material.category === "gap").length,
      insulationCount: resolvedLayers.filter((layer) => layer.material.category === "insulation").length,
      method: dynamicAirborneResult?.id ?? importedCalculatorResult?.id ?? "screening_mass_law_curve_seed_v3"
    },
    ratings: visibleRatings,
    ratingAdapterBasisSet: ratingAdapterBasisSet.length > 0 ? ratingAdapterBasisSet : undefined,
    supportedImpactOutputs: visibleTargetOutputSupportWithExactMetricScope.supportedImpactOutputs,
    supportedTargetOutputs: visibleTargetOutputSupportWithExactMetricScope.supportedTargetOutputs,
    targetOutputs: visibleTargetOutputSupportWithExactMetricScope.targetOutputs,
    unsupportedImpactOutputs: visibleTargetOutputSupportWithExactMetricScope.unsupportedImpactOutputs,
    unsupportedTargetOutputs: visibleTargetOutputSupportWithExactMetricScope.unsupportedTargetOutputs,
    warnings
  };

  if (dynamicCandidateResolverRuntime?.resolution.selectedBasis) {
    result.airborneBasis = dynamicCandidateResolverRuntime.resolution.selectedBasis;
  } else if (dynamicAirborneResult?.airborneBasis) {
    result.airborneBasis = dynamicAirborneResult.airborneBasis;
  }

  if (dynamicCandidateResolverRuntime?.resolution) {
    result.airborneCandidateResolution = dynamicCandidateResolverRuntime.resolution;
  } else if (dynamicAirborneResult?.airborneCandidateResolution) {
    result.airborneCandidateResolution = dynamicAirborneResult.airborneCandidateResolution;
  }

  if (dynamicCandidateResolverRuntime?.resolution.candidates) {
    result.airborneCandidateSet = dynamicCandidateResolverRuntime.resolution.candidates;
  } else if (dynamicAirborneResult?.airborneCandidateSet) {
    result.airborneCandidateSet = dynamicAirborneResult.airborneCandidateSet;
  }

  if (gateSOpeningLeakCompositeRuntime?.basis) {
    result.airborneBasis = gateSOpeningLeakCompositeRuntime.basis;
    if (
      gateAHOpeningLeakStcSpectrumAdapter &&
      result.airborneBasis.origin === "family_physics_prediction"
    ) {
      result.airborneBasis = {
        ...result.airborneBasis,
        assumptions: [
          ...result.airborneBasis.assumptions.filter(
            (assumption: string) => !/STC, field, and building outputs remain unsupported/i.test(assumption)
          ),
          "Opening ratings must be Rw / ISO 717-1 lab compatible for the Gate S composite Rw formula.",
          "Gate AH separately owns element-lab STC by applying the Gate S Rw loss to the selected host-wall frequency curve and re-rating it with ASTM E413.",
          "Field and building outputs remain unsupported until separately owned adapters exist."
        ],
        requiredInputs: [
          ...result.airborneBasis.requiredInputs,
          "GateAHOpeningLeakStcSpectrumAdapter:ASTM E413 contour from shifted TL curve"
        ]
      };
    }
  }
  if (companyInternalOpeningLeakFieldBuildingRuntime?.basis) {
    result.airborneBasis = companyInternalOpeningLeakFieldBuildingRuntime.basis;
  }

  applyAcousticCalculatorAnswerEngineV1FlatDoubleLeafBoundary({
    airborneContext,
    dynamicFamilyRuntimeBasisActive: Boolean(
      dynamicAirborneResult?.airborneBasis ||
      gateSOpeningLeakCompositeRuntime?.basis ||
      companyInternalOpeningLeakFieldBuildingRuntime?.basis ||
      localSubstitutionLabSpectrumAdapter?.basis ||
      gateYCltMassTimberCtrSpectrumAdapterBasis
    ),
    result
  });
  applyAcousticCalculatorAnswerEngineV1WallNeedsInputBoundary(result);
  applyAcousticCalculatorAnswerEngineV1WallUnsupportedBoundary(result);
  applyAcousticCalculatorAnswerEngineV1FloorImpactNeedsInputBoundary({
    gateWFloorImpactContract,
    gateZFloorImpactFieldAssessment,
    result
  });
  applyAcousticCalculatorAnswerEngineV1TimberCltDeltaLwNeedsInputBoundary({
    predictorInput,
    result
  });
  applyAcousticCalculatorAnswerEngineV1FloorRolelessHelperOnlyBoundary(result);
  applyAcousticCalculatorAnswerEngineV1FloorFieldImpactNeedsInputBoundary({
    gateZFloorImpactFieldAssessment,
    impactFieldContext,
    result
  });
  applyAcousticCalculatorAnswerEngineV1FloorAstmIicAiicUnsupportedBoundary(result);

  let layerCombinationResolverTrace = buildLayerCombinationResolverTraceForAssembly(result);
  const ownerAudit = auditAcousticCalculatorAnswerEngineV1OutputOwnership({
    allowedCompanionOutputs: getAcousticCalculatorAnswerEngineV1FloorLabCompanionOutputs({
      floorSystemRatings: result.floorSystemRatings,
      impact: result.impact,
      layerCombinationResolverTrace,
      metrics: result.metrics,
      supportedTargetOutputs: result.supportedTargetOutputs
    }),
    answerStopActive: Boolean(result.acousticAnswerBoundary),
    answerStopOutputs: result.acousticAnswerBoundary?.unsupportedOutputs,
    layerCombinationResolverTrace,
    resultKind: "assembly",
    supportedTargetOutputs: result.supportedTargetOutputs
  });
  if (ownerAudit.ownerlessSupportedOutputs.length > 0) {
    parkResultTargetOutputs(result, ownerAudit.ownerlessSupportedOutputs);
    if (ownerAudit.warning) {
      result.warnings.push(ownerAudit.warning);
    }
    layerCombinationResolverTrace = buildLayerCombinationResolverTraceForAssembly(result);
  }
  if (layerCombinationResolverTrace) {
    result.layerCombinationResolverTrace = layerCombinationResolverTrace;
  }

  return AssemblyCalculationSchema.parse(result);
}

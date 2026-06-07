import type {
  AirbornePropertyDefault,
  AirborneResultBasis,
  DynamicAirborneConfidenceClass,
  DynamicAirborneDelegateMethod,
  DynamicAirborneFamily,
  ResolvedLayer,
  TransmissionLossCurve
} from "@dynecho/shared";

import {
  classifyLayerRole,
  materialText,
  type AirborneTopologySummary
} from "./airborne-topology";
import { describePrimaryCavity } from "./dynamic-airborne-cavity-topology";
import {
  isBoardLikeLayer,
  normalizeFramingHint
} from "./dynamic-airborne-family-detection";
import type { DynamicAirborneOptions } from "./dynamic-airborne-helpers";
import {
  summarizeFramedBoardSystem,
  summarizeFramingEvidence
} from "./dynamic-airborne-framed-wall";
import { POST_V1_GATE_DM_BOUNDED_RULE_OWNER_CANDIDATE_ID } from "./post-v1-wall-timber-stud-bounded-rule-gate-dm";

export const GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD =
  "gate_dn_timber_stud_bounded_wall_runtime";

export const GATE_DN_TIMBER_STUD_BOUNDED_SELECTED_CANDIDATE_ID =
  "candidate_timber_stud_bounded_wall_prediction";

export const GATE_DN_TIMBER_STUD_BOUNDED_WARNING =
  "Timber-stud bounded prediction is active for the direct wood-stud double-board corridor. It uses the existing framed-wall calibration curve without retuning numeric values, and exact source rows can still override it when eligible.";

const METHOD_LABEL_BY_DELEGATE: Record<DynamicAirborneDelegateMethod, string> = {
  kurtovic: "kurtovic_cremer_single_leaf_coincidence_delegate",
  ks_rw_calibrated: "ks_massive_wall_reference_curve_delegate",
  mass_law: "surface_mass_law_delegate",
  screening_mass_law_curve_seed_v3: "screening_mass_law_curve_seed_v3_delegate",
  sharp: "sharp_single_leaf_panel_coincidence_delegate",
  triple_leaf_two_cavity_frequency_solver: "triple_leaf_two_cavity_frequency_solver"
};

function isElementLabContext(options: DynamicAirborneOptions): boolean {
  return !options.airborneContext?.contextMode || options.airborneContext.contextMode === "element_lab";
}

function hasCompleteMassInputs(layers: readonly ResolvedLayer[]): boolean {
  return layers
    .filter((layer) => classifyLayerRole(layer).isSolidLeaf)
    .every(
      (layer) =>
        Number.isFinite(layer.thicknessMm) &&
        layer.thicknessMm > 0 &&
        Number.isFinite(layer.material.densityKgM3) &&
        layer.material.densityKgM3 > 0 &&
        Number.isFinite(layer.surfaceMassKgM2) &&
        layer.surfaceMassKgM2 > 0
    );
}

function buildPropertyDefaults(layers: readonly ResolvedLayer[]): AirbornePropertyDefault[] {
  const defaults: AirbornePropertyDefault[] = [];
  const seen = new Set<string>();

  for (const layer of layers) {
    const acoustic = layer.material.acoustic;
    if (!acoustic || acoustic.propertySourceStatus === "source_owned" || acoustic.propertySourceStatus === "user_supplied") {
      continue;
    }

    const key = `${layer.material.id}:acousticProperties`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    defaults.push({
      field: `${layer.material.id}.acousticProperties`,
      reason:
        "Nominal board, cavity, absorber, or frame properties classify and widen the timber-stud bounded prediction; they are not exact measured rows.",
      source: acoustic.propertySourceStatus,
      value: "nominal_family_property"
    });
  }

  return defaults;
}

function isPlainGypsumBoardLayer(layer: ResolvedLayer): boolean {
  return (
    classifyLayerRole(layer).isSolidLeaf &&
    isBoardLikeLayer(layer) &&
    (
      layer.material.id === "gypsum_board" ||
      /\bgypsum\b|\bplasterboard\b|\bdrywall\b/i.test(materialText(layer))
    )
  );
}

function hasOnlyPlainGypsumBoardLeaves(layers: readonly ResolvedLayer[]): boolean {
  const boardLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf && isBoardLikeLayer(layer));

  return boardLayers.length === 4 && boardLayers.every(isPlainGypsumBoardLayer);
}

function hasDirectWoodStudOwnerInput(options: DynamicAirborneOptions): boolean {
  const context = options.airborneContext;

  return (
    context?.studType === "wood_stud" &&
    context.connectionType === "line_connection" &&
    context.studSpacingMm === 600 &&
    (
      context.resilientBarSideCount === undefined ||
      context.resilientBarSideCount === "auto"
    )
  );
}

function isEligibleDirectWoodStudDoubleBoard(input: {
  family: DynamicAirborneFamily;
  layers: readonly ResolvedLayer[];
  options: DynamicAirborneOptions;
  topology: AirborneTopologySummary;
}): boolean {
  if (input.family !== "stud_wall_system" || !isElementLabContext(input.options)) {
    return false;
  }

  if (!hasDirectWoodStudOwnerInput(input.options)) {
    return false;
  }

  if (
    input.topology.visibleLeafCount !== 2 ||
    input.topology.cavityCount !== 1 ||
    input.topology.supportLayerCount !== 0
  ) {
    return false;
  }

  const boardSystem = summarizeFramedBoardSystem(input.layers);
  const cavity = describePrimaryCavity(input.layers);
  const framingHint = normalizeFramingHint(input.options.airborneContext);
  const framingEvidence = summarizeFramingEvidence(input.layers, input.topology, framingHint);

  return (
    boardSystem.boardTier === "double_board" &&
    boardSystem.leftLeafBoardCount === 2 &&
    boardSystem.rightLeafBoardCount === 2 &&
    boardSystem.acousticBoardFraction < 0.25 &&
    boardSystem.primaryGapLayerCount === 1 &&
    cavity.coreThicknessMm === 100 &&
    cavity.gapThicknessMm === 50 &&
    cavity.porousThicknessMm === 50 &&
    framingEvidence.boardDominantFramedMorphology &&
    framingEvidence.studEligible &&
    hasOnlyPlainGypsumBoardLeaves(input.layers) &&
    hasCompleteMassInputs(input.layers)
  );
}

function errorBudgetDb(confidenceClass: DynamicAirborneConfidenceClass): number {
  return confidenceClass === "high" ? 6 : confidenceClass === "medium" ? 7 : 8;
}

export function maybeBuildGateDNTimberStudBoundedBasis(input: {
  confidenceClass: DynamicAirborneConfidenceClass;
  curve: TransmissionLossCurve;
  family: DynamicAirborneFamily;
  layers: readonly ResolvedLayer[];
  options: DynamicAirborneOptions;
  selectedMethod: DynamicAirborneDelegateMethod;
  strategy: string;
  topology: AirborneTopologySummary;
}): AirborneResultBasis | null {
  if (!isEligibleDirectWoodStudDoubleBoard(input)) {
    return null;
  }

  return {
    assumptions: [
      "direct timber-stud topology has two board-dominant gypsum leaves, one compliant cavity, explicit wood-stud context, and no resilient-bar or steel-stud support owner",
      "source absence blocks exact/calibrated promotion only, not this bounded formula-backed timber-stud prediction",
      "Gate DN keeps the existing stud_surrogate_blend + framed_wall_calibration curve and changes only the answer basis classification",
      "field/apparent outputs remain outside this lab element basis until a field-context route owns them",
      `current dynamic strategy remains ${input.strategy}`
    ],
    calculationStandard: "engine_double_leaf_cavity",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: errorBudgetDb(input.confidenceClass),
    family: "stud_wall_system",
    frequencyBands: {
      bandSet: "dynamic_airborne_delegate_grid",
      frequenciesHz: [...input.curve.frequenciesHz]
    },
    kind: "airborne_bound",
    method: GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "bounded_prediction",
    propertyDefaults: buildPropertyDefaults(input.layers),
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      "airborneContext.studType:wood_stud",
      "airborneContext.connectionType:line_connection",
      "airborneContext.studSpacingMm:600",
      "visibleLeafCount=2",
      "cavityCount=1",
      "boardSystem:double_board_2x2_plain_gypsum",
      "cavityDepthMm:100",
      "mineralFillThicknessMm:50",
      "gapThicknessMm:50",
      `boundedOwner:${POST_V1_GATE_DM_BOUNDED_RULE_OWNER_CANDIDATE_ID}`,
      `selectedDelegateCurve:${METHOD_LABEL_BY_DELEGATE[input.selectedMethod]}`,
      "ISO717-1 rating adapter",
      "ASTM E413 STC adapter boundary"
    ],
    toleranceClass: "bounded_prediction"
  };
}

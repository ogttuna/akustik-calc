import type {
  AirborneContext,
  AirbornePropertyDefault,
  AirborneResultBasis,
  DynamicAirborneConfidenceClass,
  DynamicAirborneDelegateMethod,
  DynamicAirborneFamily,
  ResolvedLayer,
  TransmissionLossCurve
} from "@dynecho/shared";

import type { AirborneTopologySummary } from "./airborne-topology";
import { materialText } from "./airborne-topology";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";
import { maybeBuildGateARAirborneBuildingPredictionBasisFromBase } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { maybeBuildGateIAirborneFieldContextBasisFromBase } from "./dynamic-airborne-gate-i-airborne-field-context";

export const GATE_O_SINGLE_LEAF_MASSIVE_PANEL_PREDICTION_WARNING =
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_WARNING;

const GATE_O_ELIGIBLE_FAMILIES = new Set<DynamicAirborneFamily>([
  "single_leaf_panel",
  "laminated_single_leaf",
  "rigid_massive_wall"
]);

const METHOD_LABEL_BY_DELEGATE: Record<DynamicAirborneDelegateMethod, string> = {
  kurtovic: "kurtovic_cremer_single_leaf_coincidence_delegate",
  ks_rw_calibrated: "ks_massive_wall_reference_curve_delegate",
  mass_law: "surface_mass_law_delegate",
  screening_mass_law_curve_seed_v3: "screening_mass_law_curve_seed_v3_delegate",
  sharp: "sharp_single_leaf_panel_coincidence_delegate",
  triple_leaf_two_cavity_frequency_solver: "triple_leaf_two_cavity_frequency_solver"
};

function hasMassTimberOrClt(layers: readonly ResolvedLayer[]): boolean {
  return layers.some((layer) => {
    const tags = layer.material.tags.map((tag) => tag.toLowerCase());
    return (
      layer.material.acoustic?.behavior === "mass_timber" ||
      tags.includes("mass-timber") ||
      tags.includes("clt") ||
      /\bclt\b|cross\s*laminated\s*timber|mass\s*timber/.test(materialText(layer))
    );
  });
}

function isProjectExplicitSurfaceMassLayer(layer: ResolvedLayer): boolean {
  return layer.material.tags.includes("project-explicit-surface-mass");
}

function hasCatalogBackedMassInputs(layer: ResolvedLayer): boolean {
  return (
    Number.isFinite(layer.thicknessMm) &&
    layer.thicknessMm > 0 &&
    Number.isFinite(layer.material.densityKgM3) &&
    layer.material.densityKgM3 > 0 &&
    Number.isFinite(layer.surfaceMassKgM2) &&
    layer.surfaceMassKgM2 > 0
  );
}

function hasUserSuppliedSurfaceMassInputs(layer: ResolvedLayer): boolean {
  return (
    isProjectExplicitSurfaceMassLayer(layer) &&
    Number.isFinite(layer.thicknessMm) &&
    layer.thicknessMm > 0 &&
    Number.isFinite(layer.surfaceMassKgM2) &&
    layer.surfaceMassKgM2 > 0
  );
}

function hasExplicitNonSingleLeafTopologyIntent(context: AirborneContext | null | undefined): boolean {
  const wallTopology = context?.wallTopology;
  if (!wallTopology) {
    return false;
  }

  const topologyMode = wallTopology.topologyMode ?? "auto";
  return (
    (topologyMode !== "auto" && topologyMode !== "flat_layer_order") ||
    (wallTopology.sideALeafLayerIndices?.length ?? 0) > 0 ||
    (wallTopology.sideBLeafLayerIndices?.length ?? 0) > 0 ||
    (wallTopology.internalLeafLayerIndices?.length ?? 0) > 0 ||
    (wallTopology.cavity1LayerIndices?.length ?? 0) > 0 ||
    (wallTopology.cavity2LayerIndices?.length ?? 0) > 0 ||
    (context?.advancedWall?.cavities?.length ?? 0) > 0
  );
}

function hasCompleteSingleLeafMassInputs(
  layers: readonly ResolvedLayer[],
  options: {
    readonly allowProjectExplicitSurfaceMass: boolean;
  }
): boolean {
  const solidLayers = layers.filter((layer) => layer.surfaceMassKgM2 > 0 && layer.material.category !== "gap");

  return (
    solidLayers.length > 0 &&
    solidLayers.every(
      (layer) =>
        hasCatalogBackedMassInputs(layer) ||
        (options.allowProjectExplicitSurfaceMass && hasUserSuppliedSurfaceMassInputs(layer))
    )
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
        "Nominal stiffness/damping properties are used only to classify and widen the uncalibrated family physics basis; they are not exact measured rows.",
      source: acoustic.propertySourceStatus,
      value: "nominal_family_property"
    });
  }

  return defaults;
}

export function maybeBuildGateOSingleLeafMassivePanelBasis(input: {
  airborneContext?: AirborneContext | null;
  confidenceClass: DynamicAirborneConfidenceClass;
  curve: TransmissionLossCurve;
  family: DynamicAirborneFamily;
  layers: readonly ResolvedLayer[];
  selectedMethod: DynamicAirborneDelegateMethod;
  strategy: string;
  topology: AirborneTopologySummary;
}): AirborneResultBasis | null {
  if (!GATE_O_ELIGIBLE_FAMILIES.has(input.family)) {
    return null;
  }

  if (
    input.topology.visibleLeafCount !== 1 ||
    input.topology.cavityCount !== 0 ||
    input.topology.supportLayerCount !== 0 ||
    input.topology.porousLayerCount !== 0 ||
    input.topology.totalGapThicknessMm !== 0
  ) {
    return null;
  }

  const usesProjectExplicitSurfaceMass = input.layers.some(isProjectExplicitSurfaceMassLayer);
  const contextMode = input.airborneContext?.contextMode ?? "element_lab";

  if (usesProjectExplicitSurfaceMass && hasExplicitNonSingleLeafTopologyIntent(input.airborneContext)) {
    return null;
  }

  if (
    hasMassTimberOrClt(input.layers) ||
    !hasCompleteSingleLeafMassInputs(input.layers, {
      allowProjectExplicitSurfaceMass: true
    })
  ) {
    return null;
  }

  const projectExplicitAssumptions = usesProjectExplicitSurfaceMass
    ? [
        "one or more single-leaf layers use user-supplied surfaceMassKgM2 because the project material has no catalog density row",
        "user-supplied surface mass is accepted only for cavity-free single-leaf element-lab requests; field/building adapters remain separate owners"
      ]
    : [];
  const massRequiredInputs = usesProjectExplicitSurfaceMass
    ? [
        "userSuppliedSurfaceMassKgM2",
        "thicknessMm",
        "stiffness/coincidence family default"
      ]
    : [
        "densityKgM3",
        "surfaceMassKgM2",
        "thicknessMm",
        "stiffness/coincidence family"
      ];

  const basis: AirborneResultBasis = {
    assumptions: [
      "single-leaf / massive-panel topology has one visible solid leaf and no cavity, porous fill, or frame bridge",
      "source absence blocks exact/calibrated promotion only, not this formula-backed single-leaf runtime",
      "the layer-combination resolver single-leaf mass-law banded runtime corridor owns the public element-lab basis",
      ...projectExplicitAssumptions,
      `underlying delegate lineage remains ${METHOD_LABEL_BY_DELEGATE[input.selectedMethod]}`,
      `current dynamic strategy remains ${input.strategy}`
    ],
    calculationStandard: "engine_mass_law",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
    family: input.family,
    frequencyBands: {
      bandSet: "dynamic_airborne_delegate_grid",
      frequenciesHz: [...input.curve.frequenciesHz]
    },
    kind: "airborne_physics_prediction",
    method: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: buildPropertyDefaults(input.layers),
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      "route=wall_floor_or_ceiling",
      "visibleLeafCount=1",
      "cavityCount=0",
      "supportLayerCount=0",
      "porousLayerCount=0",
      ...massRequiredInputs,
      "one-third-octave TL curve",
      "ISO717-1 rating adapter"
    ],
    toleranceClass: "uncalibrated_prediction"
  };

  if (usesProjectExplicitSurfaceMass && contextMode === "field_between_rooms") {
    return maybeBuildGateIAirborneFieldContextBasisFromBase({
      baseBasis: basis,
      context: input.airborneContext,
      family: input.family,
      frequencyBands: basis.frequencyBands
    });
  }
  if (usesProjectExplicitSurfaceMass && contextMode === "building_prediction") {
    return maybeBuildGateARAirborneBuildingPredictionBasisFromBase({
      baseBasis: basis,
      context: input.airborneContext,
      family: input.family,
      frequencyBands: basis.frequencyBands,
      sourceDescription: "the owned single-leaf mass-law / banded calculated lab curve"
    });
  }

  return basis;
}

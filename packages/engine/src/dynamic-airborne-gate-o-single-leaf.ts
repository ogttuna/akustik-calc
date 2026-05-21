import type {
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

function hasCompleteSingleLeafMassInputs(layers: readonly ResolvedLayer[]): boolean {
  const solidLayers = layers.filter((layer) => layer.surfaceMassKgM2 > 0 && layer.material.category !== "gap");

  return (
    solidLayers.length > 0 &&
    solidLayers.every(
      (layer) =>
        Number.isFinite(layer.thicknessMm) &&
        layer.thicknessMm > 0 &&
        Number.isFinite(layer.material.densityKgM3) &&
        layer.material.densityKgM3 > 0 &&
        Number.isFinite(layer.surfaceMassKgM2) &&
        layer.surfaceMassKgM2 > 0
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

  if (hasMassTimberOrClt(input.layers) || !hasCompleteSingleLeafMassInputs(input.layers)) {
    return null;
  }

  return {
    assumptions: [
      "single-leaf / massive-panel topology has one visible solid leaf and no cavity, porous fill, or frame bridge",
      "source absence blocks exact/calibrated promotion only, not this formula-backed single-leaf runtime",
      "the layer-combination resolver single-leaf mass-law banded runtime corridor owns the public element-lab basis",
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
      "route=wall_or_floor",
      "visibleLeafCount=1",
      "cavityCount=0",
      "supportLayerCount=0",
      "porousLayerCount=0",
      "densityKgM3",
      "surfaceMassKgM2",
      "thicknessMm",
      "stiffness/coincidence family",
      "one-third-octave TL curve",
      "ISO717-1 rating adapter"
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}

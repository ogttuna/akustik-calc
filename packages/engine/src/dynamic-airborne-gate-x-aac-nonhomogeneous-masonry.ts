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
import type { DynamicAirborneOptions } from "./dynamic-airborne-helpers";

export const GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD =
  "gate_x_aac_nonhomogeneous_masonry_sharp_davy_family_physics_runtime";

export const GATE_X_AAC_NONHOMOGENEOUS_MASONRY_SELECTED_CANDIDATE_ID =
  "candidate_aac_nonhomogeneous_masonry_family_physics_prediction";

export const GATE_X_AAC_NONHOMOGENEOUS_MASONRY_WARNING =
  "AAC / non-homogeneous masonry family physics prediction is active from the current Sharp/Davy dynamic delegate curve. It is source-absent, keeps the lab error budget visible, and exact rights-safe source rows can still override it when eligible.";

const METHOD_LABEL_BY_DELEGATE: Record<DynamicAirborneDelegateMethod, string> = {
  kurtovic: "kurtovic_cremer_single_leaf_coincidence_delegate",
  ks_rw_calibrated: "ks_massive_wall_reference_curve_delegate",
  mass_law: "surface_mass_law_delegate",
  screening_mass_law_curve_seed_v3: "screening_mass_law_curve_seed_v3_delegate",
  sharp: "sharp_single_leaf_panel_coincidence_delegate",
  triple_leaf_two_cavity_frequency_solver: "triple_leaf_two_cavity_frequency_solver"
};

function confidenceErrorBudgetDb(confidenceClass: DynamicAirborneConfidenceClass): number {
  switch (confidenceClass) {
    case "high":
      return 5;
    case "medium":
      return 6;
    case "low":
      return 8;
  }
}

function isElementLabContext(options: DynamicAirborneOptions): boolean {
  return !options.airborneContext?.contextMode || options.airborneContext.contextMode === "element_lab";
}

function isAacOrAircreteMasonryLayer(layer: ResolvedLayer): boolean {
  const text = materialText(layer);
  const tags = layer.material.tags.map((tag) => tag.toLowerCase());

  return (
    classifyLayerRole(layer).isSolidLeaf &&
    (
      tags.includes("aac") ||
      tags.includes("autoclaved-aerated-concrete") ||
      tags.includes("lightweight-mineral") ||
      /aac|gazbeton|ytong|aircrete|autoclaved|hebel/.test(text)
    )
  );
}

function hasCompleteAacMasonryInputs(layers: readonly ResolvedLayer[]): boolean {
  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);

  return (
    solidLayers.length > 0 &&
    solidLayers.some(isAacOrAircreteMasonryLayer) &&
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
        "Nominal AAC stiffness/damping properties classify and widen the Gate X uncalibrated family basis; they are not exact measured rows.",
      source: acoustic.propertySourceStatus,
      value: "nominal_family_property"
    });
  }

  return defaults;
}

export function maybeBuildGateXAacNonHomogeneousMasonryBasis(input: {
  confidenceClass: DynamicAirborneConfidenceClass;
  curve: TransmissionLossCurve;
  family: DynamicAirborneFamily;
  layers: readonly ResolvedLayer[];
  options: DynamicAirborneOptions;
  selectedMethod: DynamicAirborneDelegateMethod;
  strategy: string;
  topology: AirborneTopologySummary;
}): AirborneResultBasis | null {
  if (input.family !== "masonry_nonhomogeneous" || !isElementLabContext(input.options)) {
    return null;
  }

  if (
    input.topology.visibleLeafCount !== 1 ||
    input.topology.cavityCount !== 0 ||
    input.topology.supportLayerCount !== 0 ||
    input.topology.porousLayerCount !== 0 ||
    input.topology.totalGapThicknessMm !== 0 ||
    !hasCompleteAacMasonryInputs(input.layers)
  ) {
    return null;
  }

  return {
    assumptions: [
      "AAC / non-homogeneous masonry topology has one visible solid mineral leaf and no cavity, porous fill, or frame bridge",
      "source absence blocks exact/calibrated promotion only, not this formula-backed family prediction",
      "Gate X promotes the existing Sharp-led masonry dynamic delegate curve to family physics origin without retuning numeric values",
      "field/apparent and building-prediction outputs remain outside this lab element basis until a separate route owns them",
      `current dynamic strategy remains ${input.strategy}`
    ],
    calculationStandard: "engine_mass_law",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: confidenceErrorBudgetDb(input.confidenceClass),
    family: "masonry_nonhomogeneous",
    frequencyBands: {
      bandSet: "dynamic_airborne_delegate_grid",
      frequenciesHz: [...input.curve.frequenciesHz]
    },
    kind: "airborne_physics_prediction",
    method: GATE_X_AAC_NONHOMOGENEOUS_MASONRY_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: buildPropertyDefaults(input.layers),
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      "materialClass:aac_or_nonhomogeneous_masonry",
      "densityKgM3",
      "surfaceMassKgM2",
      "thicknessMm",
      `selectedDelegateCurve:${METHOD_LABEL_BY_DELEGATE[input.selectedMethod]}`,
      "ISO717-1 rating adapter",
      "ASTM E413 STC adapter boundary"
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}

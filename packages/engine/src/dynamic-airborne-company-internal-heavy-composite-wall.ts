import type {
  AirbornePropertyDefault,
  AirborneResultBasis,
  DynamicAirborneDelegateMethod,
  DynamicAirborneFamily,
  ResolvedLayer,
  TransmissionLossCurve
} from "@dynecho/shared";

import {
  classifyLayerRole,
  detectLeafCoreLayout,
  materialText,
  type AirborneTopologySummary
} from "./airborne-topology";
import type { DynamicFramingHint } from "./dynamic-airborne-family-detection";
import { summarizeFramingEvidence, summarizeHeavyUnframedCavityRisk } from "./dynamic-airborne-framed-wall";
import type { DynamicAirborneOptions } from "./dynamic-airborne-helpers";

export const COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD =
  "company_internal_heavy_composite_wall_mass_air_mass_capped_family_physics_runtime";

export const COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID =
  "candidate_company_internal_heavy_composite_wall_family_physics_prediction";

export const COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_WARNING =
  "Heavy-composite wall family physics prediction is active from the mass-air-mass double-leaf delegate capped by the heavy unframed cavity corridor. It is source-absent and uncalibrated; exact rights-safe source rows can still override it when eligible.";

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

function hasCompleteSolidMassInputs(layers: readonly ResolvedLayer[]): boolean {
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

function hasHeavyMineralCompositeLeaves(layers: readonly ResolvedLayer[]): boolean {
  const layout = detectLeafCoreLayout(layers);
  const leafTexts = layout.solidLeafIndexes.map((index) =>
    materialText(layout.collapsedLayers[index] ?? layers[0])
  );

  return (
    leafTexts.length === 2 &&
    leafTexts.every((text) =>
      /concrete|masonry|brick|block|pumice|bims|aac|ytong|aircrete|gypsum|plaster/.test(text)
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
        "Nominal stiffness, damping, or absorber properties widen the uncalibrated heavy-composite family basis; they are not exact measured rows.",
      source: acoustic.propertySourceStatus,
      value: "nominal_family_property"
    });
  }

  return defaults;
}

export function isCompanyInternalHeavyCompositeWallTopologyComplete(input: {
  family: DynamicAirborneFamily;
  framingHint: DynamicFramingHint;
  layers: readonly ResolvedLayer[];
  topology: AirborneTopologySummary;
}): boolean {
  if (input.family !== "double_leaf") {
    return false;
  }

  const risk = summarizeHeavyUnframedCavityRisk(input.layers, input.topology, input.framingHint);
  const framing = summarizeFramingEvidence(input.layers, input.topology, input.framingHint);
  const leafMasses = input.topology.visibleLeafMassesKgM2.filter((value) => value > 0);
  const lightestLeafMassKgM2 = Math.min(...leafMasses);
  const heaviestLeafMassKgM2 = Math.max(...leafMasses);
  const layout = detectLeafCoreLayout(input.layers);

  return (
    risk.applies &&
    !framing.studEligible &&
    input.topology.visibleLeafCount === 2 &&
    input.topology.cavityCount === 1 &&
    input.topology.supportLayerCount === 0 &&
    input.topology.originalSolidLayerCount >= 4 &&
    input.topology.porousLayerCount === 0 &&
    input.topology.totalGapThicknessMm >= 25 &&
    input.topology.totalGapThicknessMm <= 120 &&
    layout.compliantCoreThicknessMm >= 25 &&
    Number.isFinite(lightestLeafMassKgM2) &&
    lightestLeafMassKgM2 >= 35 &&
    Number.isFinite(heaviestLeafMassKgM2) &&
    heaviestLeafMassKgM2 >= 70 &&
    input.topology.surfaceMassKgM2 >= 140 &&
    hasHeavyMineralCompositeLeaves(input.layers) &&
    hasCompleteSolidMassInputs(input.layers)
  );
}

export function maybeBuildCompanyInternalHeavyCompositeWallBasis(input: {
  curve: TransmissionLossCurve;
  family: DynamicAirborneFamily;
  framingHint: DynamicFramingHint;
  layers: readonly ResolvedLayer[];
  options: DynamicAirborneOptions;
  selectedMethod: DynamicAirborneDelegateMethod;
  strategy: string;
  topology: AirborneTopologySummary;
}): AirborneResultBasis | null {
  if (!isElementLabContext(input.options)) {
    return null;
  }

  if (
    !isCompanyInternalHeavyCompositeWallTopologyComplete({
      family: input.family,
      framingHint: input.framingHint,
      layers: input.layers,
      topology: input.topology
    })
  ) {
    return null;
  }

  const leafMasses = input.topology.visibleLeafMassesKgM2.filter((value) => value > 0);
  return {
    assumptions: [
      "heavy-composite double-leaf topology has two heavy mineral/composite leaves and one explicit unframed compliant air cavity",
      `visible leaf masses are ${leafMasses.map((value) => value.toFixed(1)).join(" / ")} kg/m2 with ${input.topology.totalGapThicknessMm.toFixed(1)} mm explicit air gap`,
      "the current mass-air-mass double-leaf delegate is capped against the heavy unframed cavity corridor to avoid over-crediting a source-absent heavy composite cavity",
      "source absence blocks exact/calibrated promotion only, not this formula-backed family prediction",
      "field/apparent and building outputs remain outside this lab element basis until a field/building adapter owns the requested metric basis",
      `current dynamic strategy remains ${input.strategy}`
    ],
    calculationStandard: "engine_double_leaf_cavity",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 8,
    family: "double_leaf",
    frequencyBands: {
      bandSet: "dynamic_airborne_delegate_grid",
      frequenciesHz: [...input.curve.frequenciesHz]
    },
    kind: "airborne_physics_prediction",
    method: COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: buildPropertyDefaults(input.layers),
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      "sideALeafMassKgM2",
      "sideBLeafMassKgM2",
      "cavityDepthMm",
      "supportTopology:unframed_or_none",
      "heavyUnframedCavityCap:massBasedCorridor",
      `selectedDelegateCurve:${METHOD_LABEL_BY_DELEGATE[input.selectedMethod]}`,
      "ISO717-1 rating adapter",
      "ASTM E413 STC adapter boundary"
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}

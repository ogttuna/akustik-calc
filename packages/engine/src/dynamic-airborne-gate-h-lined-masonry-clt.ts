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

export const GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD =
  "gate_h_lined_massive_wall_cavity_aware_family_physics_runtime";

export const GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD =
  "gate_h_clt_mass_timber_wall_single_leaf_family_physics_runtime";

export const GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID =
  "candidate_lined_massive_wall_family_physics_prediction";

export const GATE_H_CLT_MASS_TIMBER_WALL_SELECTED_CANDIDATE_ID =
  "candidate_clt_mass_timber_wall_family_physics_prediction";

export const GATE_H_LINED_MASSIVE_WALL_WARNING =
  "Lined massive-wall family physics prediction is active from the cavity-aware dynamic delegate curve. It is source-absent and uncalibrated; exact rights-safe source rows can still override it when eligible.";

export const GATE_H_CLT_MASS_TIMBER_WALL_WARNING =
  "CLT / mass-timber wall family physics prediction is active from the current timber-panel delegate curve. It uses nominal orthotropic simplification, is source-absent, and must keep the visible uncalibrated error budget.";

const METHOD_LABEL_BY_DELEGATE: Record<DynamicAirborneDelegateMethod, string> = {
  kurtovic: "kurtovic_cremer_single_leaf_coincidence_delegate",
  ks_rw_calibrated: "ks_massive_wall_reference_curve_delegate",
  mass_law: "surface_mass_law_delegate",
  screening_mass_law_curve_seed_v3: "screening_mass_law_curve_seed_v3_delegate",
  sharp: "sharp_single_leaf_panel_coincidence_delegate",
  triple_leaf_two_cavity_frequency_solver: "triple_leaf_two_cavity_frequency_solver"
};

function confidenceErrorBudgetDb(input: {
  confidenceClass: DynamicAirborneConfidenceClass;
  family: "clt_mass_timber_wall" | "lined_massive_wall";
}): number {
  if (input.family === "clt_mass_timber_wall") {
    return input.confidenceClass === "high" ? 5 : input.confidenceClass === "medium" ? 6 : 8;
  }

  return input.confidenceClass === "high" ? 5 : input.confidenceClass === "medium" ? 6 : 8;
}

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

function hasHeavyMasonryOrConcreteLeaf(layers: readonly ResolvedLayer[]): boolean {
  return layers.some((layer) => {
    const text = materialText(layer);
    return (
      classifyLayerRole(layer).isSolidLeaf &&
      layer.surfaceMassKgM2 >= 80 &&
      (layer.material.acoustic?.behavior === "rigid_mass" ||
        /concrete|masonry|brick|block|aac|silicate|plaster/.test(text))
    );
  });
}

function hasLightLiningLeaf(layers: readonly ResolvedLayer[]): boolean {
  return layers.some((layer) => {
    const text = materialText(layer);
    return (
      classifyLayerRole(layer).isSolidLeaf &&
      layer.surfaceMassKgM2 > 0 &&
      layer.surfaceMassKgM2 <= 35 &&
      /gypsum|plasterboard|drywall|board|lining/.test(text)
    );
  });
}

function compliantCoreThicknessMm(layers: readonly ResolvedLayer[]): number {
  const solidIndices = layers
    .map((layer, index) => ({ index, solid: classifyLayerRole(layer).isSolidLeaf }))
    .filter((entry) => entry.solid)
    .map((entry) => entry.index);

  if (solidIndices.length < 2) {
    return 0;
  }

  const first = solidIndices[0];
  const last = solidIndices[solidIndices.length - 1];

  return layers.slice(first + 1, last).reduce((sum, layer) => {
    const role = classifyLayerRole(layer);
    return role.isGap || role.isPorous ? sum + role.thicknessMm : sum;
  }, 0);
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
        "Nominal stiffness, damping, or absorber properties classify and widen the Gate H uncalibrated family basis; they are not exact measured rows.",
      source: acoustic.propertySourceStatus,
      value: "nominal_family_property"
    });
  }

  return defaults;
}

function buildLinedMassiveBasis(input: {
  confidenceClass: DynamicAirborneConfidenceClass;
  curve: TransmissionLossCurve;
  layers: readonly ResolvedLayer[];
  selectedMethod: DynamicAirborneDelegateMethod;
  strategy: string;
}): AirborneResultBasis {
  return {
    assumptions: [
      "lined massive-wall topology has one light lining leaf, one heavy masonry/concrete leaf, and one explicit compliant cavity zone",
      "source absence blocks exact/calibrated promotion only, not this formula-backed family prediction",
      "Gate H promotes the existing cavity-aware dynamic delegate curve to family physics origin without retuning numeric values",
      "field/apparent outputs remain outside this lab element basis until a field-context route owns them",
      `current dynamic strategy remains ${input.strategy}`
    ],
    calculationStandard: "engine_double_leaf_cavity",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: confidenceErrorBudgetDb({
      confidenceClass: input.confidenceClass,
      family: "lined_massive_wall"
    }),
    family: "lined_massive_wall",
    frequencyBands: {
      bandSet: "dynamic_airborne_delegate_grid",
      frequenciesHz: [...input.curve.frequenciesHz]
    },
    kind: "airborne_physics_prediction",
    method: GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: buildPropertyDefaults(input.layers),
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      "lightLiningLeafMassKgM2",
      "heavyMasonryLeafMassKgM2",
      "cavityDepthMm",
      "cavityFillCoverage",
      "absorberClass",
      `selectedDelegateCurve:${METHOD_LABEL_BY_DELEGATE[input.selectedMethod]}`,
      "ISO717-1 rating adapter",
      "ASTM E413 STC adapter boundary"
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}

function buildCltMassTimberBasis(input: {
  confidenceClass: DynamicAirborneConfidenceClass;
  curve: TransmissionLossCurve;
  layers: readonly ResolvedLayer[];
  selectedMethod: DynamicAirborneDelegateMethod;
  strategy: string;
}): AirborneResultBasis {
  return {
    assumptions: [
      "CLT / mass-timber wall topology has one visible mass-timber panel leaf and no cavity, porous fill, or frame bridge",
      "source absence blocks exact/calibrated promotion only, not this formula-backed family prediction",
      "Gate H promotes the existing timber-panel dynamic delegate curve without retuning numeric values",
      "orthotropic CLT behaviour is still represented by nominal material properties, so the uncalibrated error budget remains visible",
      "field/apparent outputs remain outside this lab element basis until a field-context route owns them",
      `current dynamic strategy remains ${input.strategy}`
    ],
    calculationStandard: "engine_mass_law",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: confidenceErrorBudgetDb({
      confidenceClass: input.confidenceClass,
      family: "clt_mass_timber_wall"
    }),
    family: "single_leaf_panel",
    frequencyBands: {
      bandSet: "dynamic_airborne_delegate_grid",
      frequenciesHz: [...input.curve.frequenciesHz]
    },
    kind: "airborne_physics_prediction",
    method: GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: buildPropertyDefaults(input.layers),
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      "materialClass:mass_timber",
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

export function maybeBuildGateHLinedMasonryCltWallBasis(input: {
  confidenceClass: DynamicAirborneConfidenceClass;
  curve: TransmissionLossCurve;
  family: DynamicAirborneFamily;
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
    input.family === "lined_massive_wall" &&
    input.topology.visibleLeafCount === 2 &&
    input.topology.cavityCount === 1 &&
    input.topology.supportLayerCount === 0 &&
    (input.topology.visibleLeafMassRatio ?? 0) >= 4 &&
    compliantCoreThicknessMm(input.layers) >= 20 &&
    hasHeavyMasonryOrConcreteLeaf(input.layers) &&
    hasLightLiningLeaf(input.layers) &&
    hasCompleteMassInputs(input.layers)
  ) {
    return buildLinedMassiveBasis(input);
  }

  if (
    input.family === "single_leaf_panel" &&
    input.topology.visibleLeafCount === 1 &&
    input.topology.cavityCount === 0 &&
    input.topology.supportLayerCount === 0 &&
    input.topology.porousLayerCount === 0 &&
    input.topology.totalGapThicknessMm === 0 &&
    hasMassTimberOrClt(input.layers) &&
    hasCompleteMassInputs(input.layers)
  ) {
    return buildCltMassTimberBasis(input);
  }

  return null;
}

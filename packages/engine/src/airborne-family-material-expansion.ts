import type {
  AcousticInputRouteFamily,
  AcousticMaterialPropertyField,
  DynamicAirborneFamily,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";

import { getDefaultMaterialCatalog } from "./material-catalog";

export type AirborneFamilyMaterialScenarioRoute =
  | AcousticInputRouteFamily
  | "lined_masonry_airborne"
  | "clt_mass_timber_airborne";

export type AirborneFamilyMaterialBenchmarkScenario = {
  benchmarkIds: readonly string[];
  dynamicAirborneFamily?: DynamicAirborneFamily;
  expectedOrigin: "family_physics_prediction" | "bounded_prediction" | "needs_input";
  id: string;
  materialIds: readonly string[];
  negativeScenarioIds: readonly string[];
  optionalPrecisionProperties: readonly AcousticMaterialPropertyField[];
  positiveScenarioIds: readonly string[];
  requiredProperties: readonly AcousticMaterialPropertyField[];
  routeFamily: AirborneFamilyMaterialScenarioRoute;
  targetOutputs: readonly RequestedOutputId[];
};

export type AirborneFamilyMaterialReadinessStatus =
  | "complete"
  | "complete_with_defaults"
  | "needs_input";

export type AirborneFamilyMaterialScenarioReadiness = {
  appliedDefaultProperties: readonly AcousticMaterialPropertyField[];
  engineeringDefaultMaterialIds: readonly string[];
  errorBudgetAdjustmentDb: number;
  materialIds: readonly string[];
  missingOptionalPrecisionProperties: readonly AcousticMaterialPropertyField[];
  missingRequiredProperties: readonly AcousticMaterialPropertyField[];
  routeFamily: AirborneFamilyMaterialScenarioRoute;
  scenarioId: string;
  sourceOwnedMaterialIds: readonly string[];
  status: AirborneFamilyMaterialReadinessStatus;
};

export const AIRBORNE_FAMILY_MATERIAL_BENCHMARK_SCENARIOS = [
  {
    benchmarkIds: ["B3", "B9", "B10"],
    dynamicAirborneFamily: "single_leaf_panel",
    expectedOrigin: "family_physics_prediction",
    id: "b3_single_leaf_massive_material_properties",
    materialIds: ["concrete", "gypsum_board"],
    negativeScenarioIds: ["single_leaf_missing_density_or_layer_thickness_blocks_design_grade"],
    optionalPrecisionProperties: ["youngModulusPa", "lossFactor", "poissonRatio"],
    positiveScenarioIds: ["single_leaf_mass_increase_monotonic_curve_sanity"],
    requiredProperties: ["densityKgM3"],
    routeFamily: "single_leaf_airborne",
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    benchmarkIds: ["B4", "B6", "B10"],
    dynamicAirborneFamily: "double_leaf",
    expectedOrigin: "family_physics_prediction",
    id: "b4_double_leaf_framed_absorbed_cavity_properties",
    materialIds: ["gypsum_board", "rockwool", "air_gap"],
    negativeScenarioIds: ["unknown_frame_bridge_class_selects_needs_input_or_wide_uncertainty"],
    optionalPrecisionProperties: ["porosity", "lossFactor"],
    positiveScenarioIds: ["double_leaf_absorber_changes_damping_not_simple_mass"],
    requiredProperties: ["densityKgM3", "flowResistivityPaSM2"],
    routeFamily: "double_leaf_framed_airborne",
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    benchmarkIds: ["B5", "B6", "B10", "B11"],
    dynamicAirborneFamily: "multileaf_multicavity",
    expectedOrigin: "family_physics_prediction",
    id: "b5_triple_leaf_limp_mass_porous_properties",
    materialIds: ["gypsum_board", "mlv", "rockwool"],
    negativeScenarioIds: ["flat_list_internal_leaf_without_grouping_stays_guarded"],
    optionalPrecisionProperties: ["porosity", "lossFactor"],
    positiveScenarioIds: ["grouped_triple_leaf_two_cavity_solver_uses_material_property_basis"],
    requiredProperties: ["densityKgM3", "flowResistivityPaSM2", "limpMassBehavior"],
    routeFamily: "triple_leaf_multicavity_airborne",
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    benchmarkIds: ["B3", "B4", "B6"],
    dynamicAirborneFamily: "lined_massive_wall",
    expectedOrigin: "family_physics_prediction",
    id: "b6_lined_masonry_finish_and_porous_lining_properties",
    materialIds: ["ytong_aac_d700", "cement_plaster", "rockwool", "gypsum_board"],
    negativeScenarioIds: ["masonry_finish_density_or_core_class_mismatch_rejects_exact_borrowing"],
    optionalPrecisionProperties: ["porosity", "poissonRatio"],
    positiveScenarioIds: ["lined_masonry_solver_preserves_core_mass_and_cavity_absorber_roles"],
    requiredProperties: ["densityKgM3", "youngModulusPa", "lossFactor", "flowResistivityPaSM2"],
    routeFamily: "lined_masonry_airborne",
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    benchmarkIds: ["B3", "B10", "B11"],
    dynamicAirborneFamily: "single_leaf_panel",
    expectedOrigin: "family_physics_prediction",
    id: "b7_clt_mass_timber_material_properties",
    materialIds: ["clt_panel"],
    negativeScenarioIds: ["isotropic_clt_default_cannot_promote_to_calibrated_without_holdout"],
    optionalPrecisionProperties: ["poissonRatio"],
    positiveScenarioIds: ["clt_mass_timber_default_keeps_uncalibrated_origin"],
    requiredProperties: ["densityKgM3", "youngModulusPa", "lossFactor"],
    routeFamily: "clt_mass_timber_airborne",
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    benchmarkIds: ["B7", "B9", "B12"],
    expectedOrigin: "family_physics_prediction",
    id: "b8_floating_floor_dynamic_stiffness_properties",
    materialIds: ["screed", "generic_resilient_underlay"],
    negativeScenarioIds: ["floating_floor_missing_dynamic_stiffness_is_needs_input"],
    optionalPrecisionProperties: ["lossFactor"],
    positiveScenarioIds: ["floating_floor_dynamic_stiffness_drives_delta_lw"],
    requiredProperties: ["densityKgM3", "dynamicStiffnessMNm3"],
    routeFamily: "floating_floor_impact",
    targetOutputs: ["Ln,w", "L'n,w", "L'nT,w"]
  }
] as const satisfies readonly AirborneFamilyMaterialBenchmarkScenario[];

export function listMaterialAcousticPropertyFields(
  material: MaterialDefinition
): readonly AcousticMaterialPropertyField[] {
  const fields: AcousticMaterialPropertyField[] = [];

  if (Number.isFinite(material.densityKgM3)) {
    fields.push("densityKgM3");
  }

  if (material.acoustic?.youngModulusPa) {
    fields.push("youngModulusPa");
  }

  if (material.acoustic?.poissonRatio !== undefined) {
    fields.push("poissonRatio");
  }

  if (material.acoustic?.lossFactor) {
    fields.push("lossFactor");
  }

  if (material.acoustic?.flowResistivityPaSM2) {
    fields.push("flowResistivityPaSM2");
  }

  if (material.acoustic?.porosity !== undefined) {
    fields.push("porosity");
  }

  if (material.acoustic?.absorberClass !== undefined) {
    fields.push("absorberClass");
  }

  if (material.acoustic?.behavior === "limp_mass_membrane" || material.tags.includes("limp-mass")) {
    fields.push("limpMassBehavior");
  }

  if (material.impact?.dynamicStiffnessMNm3) {
    fields.push("dynamicStiffnessMNm3");
  }

  return fields;
}

export function materialHasAcousticProperty(
  material: MaterialDefinition,
  field: AcousticMaterialPropertyField
): boolean {
  return listMaterialAcousticPropertyFields(material).includes(field);
}

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function resolveScenarioMaterials(
  scenario: AirborneFamilyMaterialBenchmarkScenario,
  catalog: readonly MaterialDefinition[]
): MaterialDefinition[] {
  return scenario.materialIds.map((materialId) => {
    const material = catalog.find((entry) => entry.id === materialId);
    if (!material) {
      throw new Error(`Unknown Gate I material benchmark entry: ${materialId}`);
    }

    return material;
  });
}

function findMissingProperties(
  materials: readonly MaterialDefinition[],
  fields: readonly AcousticMaterialPropertyField[]
): AcousticMaterialPropertyField[] {
  return fields.filter(
    (field) => !materials.some((material) => materialHasAcousticProperty(material, field))
  );
}

export function evaluateFamilyMaterialBenchmarkScenarioReadiness(
  scenario: AirborneFamilyMaterialBenchmarkScenario,
  catalog: readonly MaterialDefinition[] = getDefaultMaterialCatalog()
): AirborneFamilyMaterialScenarioReadiness {
  const materials = resolveScenarioMaterials(scenario, catalog);
  const missingRequiredProperties = findMissingProperties(materials, scenario.requiredProperties);
  const missingOptionalPrecisionProperties = findMissingProperties(
    materials,
    scenario.optionalPrecisionProperties
  );
  const status: AirborneFamilyMaterialReadinessStatus =
    missingRequiredProperties.length > 0
      ? "needs_input"
      : missingOptionalPrecisionProperties.length > 0
        ? "complete_with_defaults"
        : "complete";

  return {
    appliedDefaultProperties: status === "complete_with_defaults" ? missingOptionalPrecisionProperties : [],
    engineeringDefaultMaterialIds: unique(
      materials
        .filter((material) => material.acoustic?.propertySourceStatus === "engineering_default")
        .map((material) => material.id)
    ),
    errorBudgetAdjustmentDb:
      status === "complete_with_defaults" ? Math.min(3, missingOptionalPrecisionProperties.length) : 0,
    materialIds: scenario.materialIds,
    missingOptionalPrecisionProperties,
    missingRequiredProperties,
    routeFamily: scenario.routeFamily,
    scenarioId: scenario.id,
    sourceOwnedMaterialIds: unique(
      materials
        .filter((material) => material.acoustic?.propertySourceStatus === "source_owned")
        .map((material) => material.id)
    ),
    status
  };
}

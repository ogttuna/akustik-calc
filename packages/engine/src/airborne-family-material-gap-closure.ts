import type {
  AcousticInputRouteFamily,
  AcousticMaterialPropertyField,
  MaterialDefinition
} from "@dynecho/shared";

import {
  listMaterialAcousticPropertyFields,
  type AirborneFamilyMaterialScenarioRoute
} from "./airborne-family-material-expansion";
import { getDefaultMaterialCatalog } from "./material-catalog";

export type GateTFamilyMaterialGapClosureScenarioId =
  | "gate_t_board_leaf_finish_default_closure"
  | "gate_t_floor_deck_screed_default_closure"
  | "gate_t_limp_membrane_default_closure"
  | "gate_t_masonry_core_finish_default_closure"
  | "gate_t_porous_absorber_default_closure"
  | "gate_t_resilient_impact_layer_default_closure";

export type GateTFamilyMaterialGapClosureScenario = {
  id: GateTFamilyMaterialGapClosureScenarioId;
  materialIds: readonly string[];
  optionalPrecisionProperties: readonly AcousticMaterialPropertyField[];
  requiredPerMaterialProperties: readonly AcousticMaterialPropertyField[];
  routeFamilies: readonly (AcousticInputRouteFamily | AirborneFamilyMaterialScenarioRoute)[];
};

export type GateTMaterialPropertyGap = {
  field: AcousticMaterialPropertyField;
  materialId: string;
};

export type GateTFamilyMaterialGapClosureStatus =
  | "complete"
  | "complete_with_defaults"
  | "needs_input";

export type GateTFamilyMaterialGapClosureReadiness = {
  defaultedMaterialIds: readonly string[];
  engineeringDefaultMaterialIds: readonly string[];
  errorBudgetAdjustmentDb: number;
  materialIds: readonly string[];
  missingOptionalPrecisionProperties: readonly GateTMaterialPropertyGap[];
  missingRequiredProperties: readonly GateTMaterialPropertyGap[];
  routeFamilies: readonly string[];
  scenarioId: GateTFamilyMaterialGapClosureScenarioId;
  sourceOwnedMaterialIds: readonly string[];
  status: GateTFamilyMaterialGapClosureStatus;
};

export const GATE_T_FAMILY_MATERIAL_GAP_CLOSURE_SCENARIOS = [
  {
    id: "gate_t_board_leaf_finish_default_closure",
    materialIds: ["security_board", "fire_board", "sheetrock_one", "cement_board"],
    optionalPrecisionProperties: ["youngModulusPa", "poissonRatio", "lossFactor"],
    requiredPerMaterialProperties: ["densityKgM3"],
    routeFamilies: ["single_leaf_airborne", "double_leaf_framed_airborne", "triple_leaf_multicavity_airborne"]
  },
  {
    id: "gate_t_masonry_core_finish_default_closure",
    materialIds: [
      "lightweight_concrete",
      "dense_plaster",
      "lightweight_plaster",
      "lime_cement_plaster_1300",
      "lime_cement_plaster_1700",
      "lime_cement_plaster_1780",
      "skim_plaster",
      "lime_plaster",
      "ytong_separatiepaneel_aac_4_600",
      "ytong_separatiepaneel_aac_5_750",
      "ytong_cellenbetonblok_g4_600",
      "ytong_cellenbetonblok_g5_800",
      "ytong_massief_g2_300",
      "celcon_solar_grade",
      "celcon_standard_grade",
      "celcon_high_strength",
      "pumice_block",
      "silka_cs_block",
      "solid_brick",
      "hollow_brick",
      "aac",
      "porotherm_pls_100",
      "porotherm_pls_140",
      "porotherm_pls_190",
      "heluz_14_brushed",
      "heluz_aku_115",
      "heluz_aku_200_p15",
      "heluz_aku_300_333_p20"
    ],
    optionalPrecisionProperties: ["youngModulusPa", "poissonRatio", "lossFactor"],
    requiredPerMaterialProperties: ["densityKgM3"],
    routeFamilies: ["single_leaf_airborne", "lined_masonry_airborne"]
  },
  {
    id: "gate_t_porous_absorber_default_closure",
    materialIds: ["rockwool", "high_density_rockwool", "glasswool_board", "cellulose_fill", "wood_wool_panel", "pet_felt"],
    optionalPrecisionProperties: ["porosity", "absorberClass"],
    requiredPerMaterialProperties: ["densityKgM3", "flowResistivityPaSM2"],
    routeFamilies: ["double_leaf_framed_airborne", "triple_leaf_multicavity_airborne", "porous_fill_cavity_modifier"]
  },
  {
    id: "gate_t_floor_deck_screed_default_closure",
    materialIds: ["anhydrite_screed", "particleboard_flooring", "osb", "plywood", "ceramic_tile"],
    optionalPrecisionProperties: ["youngModulusPa", "poissonRatio", "lossFactor"],
    requiredPerMaterialProperties: ["densityKgM3"],
    routeFamilies: ["floating_floor_impact"]
  },
  {
    id: "gate_t_limp_membrane_default_closure",
    materialIds: ["mlv", "bitumen_membrane", "vinyl_flooring"],
    optionalPrecisionProperties: ["lossFactor"],
    requiredPerMaterialProperties: ["densityKgM3", "limpMassBehavior"],
    routeFamilies: ["double_leaf_framed_airborne", "triple_leaf_multicavity_airborne", "floating_floor_impact"]
  },
  {
    id: "gate_t_resilient_impact_layer_default_closure",
    materialIds: ["generic_resilient_underlay", "generic_resilient_underlay_s30"],
    optionalPrecisionProperties: ["lossFactor"],
    requiredPerMaterialProperties: ["densityKgM3", "dynamicStiffnessMNm3"],
    routeFamilies: ["floating_floor_impact"]
  }
] as const satisfies readonly GateTFamilyMaterialGapClosureScenario[];

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function resolveScenarioMaterials(
  scenario: GateTFamilyMaterialGapClosureScenario,
  catalog: readonly MaterialDefinition[]
): readonly MaterialDefinition[] {
  return scenario.materialIds.map((materialId) => {
    const material = catalog.find((entry) => entry.id === materialId);
    if (!material) {
      throw new Error(`Unknown Gate T material gap-closure entry: ${materialId}`);
    }

    return material;
  });
}

function missingMaterialProperties(
  materials: readonly MaterialDefinition[],
  fields: readonly AcousticMaterialPropertyField[]
): GateTMaterialPropertyGap[] {
  return materials.flatMap((material) => {
    const presentFields = listMaterialAcousticPropertyFields(material);
    return fields
      .filter((field) => !presentFields.includes(field))
      .map((field) => ({
        field,
        materialId: material.id
      }));
  });
}

export function evaluateGateTFamilyMaterialGapClosureReadiness(
  scenario: GateTFamilyMaterialGapClosureScenario,
  catalog: readonly MaterialDefinition[] = getDefaultMaterialCatalog()
): GateTFamilyMaterialGapClosureReadiness {
  const materials = resolveScenarioMaterials(scenario, catalog);
  const missingRequiredProperties = missingMaterialProperties(
    materials,
    scenario.requiredPerMaterialProperties
  );
  const missingOptionalPrecisionProperties = missingMaterialProperties(
    materials,
    scenario.optionalPrecisionProperties
  );
  const status: GateTFamilyMaterialGapClosureStatus =
    missingRequiredProperties.length > 0
      ? "needs_input"
      : missingOptionalPrecisionProperties.length > 0
        ? "complete_with_defaults"
        : "complete";

  return {
    defaultedMaterialIds: unique(
      materials
        .filter((material) => material.acoustic?.propertySourceStatus === "engineering_default")
        .map((material) => material.id)
    ),
    engineeringDefaultMaterialIds: unique(
      materials
        .filter((material) => material.acoustic?.propertySourceStatus === "engineering_default")
        .map((material) => material.id)
    ),
    errorBudgetAdjustmentDb:
      status === "complete_with_defaults"
        ? Math.min(4, Math.ceil(missingOptionalPrecisionProperties.length / 3))
        : 0,
    materialIds: scenario.materialIds,
    missingOptionalPrecisionProperties,
    missingRequiredProperties,
    routeFamilies: scenario.routeFamilies,
    scenarioId: scenario.id,
    sourceOwnedMaterialIds: unique(
      materials
        .filter((material) => material.acoustic?.propertySourceStatus === "source_owned")
        .map((material) => material.id)
    ),
    status
  };
}

export function evaluateGateTAllFamilyMaterialGapClosureReadiness(
  catalog: readonly MaterialDefinition[] = getDefaultMaterialCatalog()
): readonly GateTFamilyMaterialGapClosureReadiness[] {
  return GATE_T_FAMILY_MATERIAL_GAP_CLOSURE_SCENARIOS.map((scenario) =>
    evaluateGateTFamilyMaterialGapClosureReadiness(scenario, catalog)
  );
}

import { MATERIAL_CATALOG_SEED } from "@dynecho/catalogs";
import type { LayerInput, MaterialDefinition } from "@dynecho/shared";

import {
  buildDynamicStiffnessOverrideMaterial,
  hasDynamicStiffnessOverrideInput,
  hasEffectiveDynamicStiffnessOverride,
  parseDynamicStiffnessOverride
} from "./dynamic-stiffness";
import {
  buildDensityOverrideMaterial,
  hasDensityOverrideInput,
  hasEffectiveDensityOverride,
  parseDensityOverride
} from "./material-density";
import type { LayerDraft } from "./workbench-store";

const SOLVER_CONTINUUM_MATERIAL_IDS = new Set<string>([
  "ceramic_tile",
  "porcelain_tile",
  "vinyl_flooring",
  "laminate_flooring",
  "engineered_timber_flooring",
  "engineered_timber_with_acoustic_underlay",
  "screed",
  "generic_fill",
  "elastic_bonded_fill",
  "bonded_chippings",
  "non_bonded_chippings",
  "generic_resilient_underlay",
  "generic_resilient_underlay_s30",
  "eps_underlay",
  "mw_t_impact_layer",
  "mw_t_impact_layer_s35",
  "mw_t_impact_layer_s40",
  "mw_t_impact_layer_s6",
  "wf_t_impact_layer_s102",
  "geniemat_rst02",
  "geniemat_rst05",
  "geniemat_rst12",
  "regupol_sonus_curve_8",
  "regupol_sonus_multi_4_5",
  "getzner_afm_21",
  "getzner_afm_23",
  "getzner_afm_26",
  "getzner_afm_29",
  "getzner_afm_33",
  "getzner_afm_35",
  "concrete"
]);

function getContinuumMaterialId(materialId: string): string {
  return materialId.split("__")[0] ?? materialId;
}

function canCollapseAtSolverBoundary(previousLayer: LayerInput | undefined, nextLayer: LayerInput): boolean {
  const continuumMaterialId = getContinuumMaterialId(nextLayer.materialId);

  return Boolean(
    previousLayer &&
      previousLayer.materialId === nextLayer.materialId &&
      previousLayer.floorRole === nextLayer.floorRole &&
      SOLVER_CONTINUUM_MATERIAL_IDS.has(continuumMaterialId)
  );
}

export function normalizeRows(
  rows: readonly LayerDraft[],
  catalog: readonly MaterialDefinition[] = MATERIAL_CATALOG_SEED
) {
  const warnings: string[] = [];
  const layers: LayerInput[] = [];
  const runtimeMaterials = new Map<string, MaterialDefinition>();
  const materialById = new Map(catalog.map((material) => [material.id, material]));

  rows.forEach((row, index) => {
    const parsedThickness = Number(row.thicknessMm);
    if (!Number.isFinite(parsedThickness) || parsedThickness <= 0) {
      warnings.push(`Layer ${index + 1} is missing a valid thickness.`);
      return;
    }

    const material = materialById.get(row.materialId);
    let resolvedMaterial = material;
    let resolvedMaterialId = row.materialId;

    if (
      hasDensityOverrideInput(row.densityKgM3) &&
      !parseDensityOverride({
        material,
        value: row.densityKgM3
      })
    ) {
      warnings.push(
        `Layer ${index + 1} has an invalid density override. Enter a non-negative kg/m³ value, use zero only for gap or support layers, or leave it blank.`
      );
    } else if (material && hasEffectiveDensityOverride({ material, overrideValue: row.densityKgM3 })) {
      const densityKgM3 = parseDensityOverride({
        material,
        value: row.densityKgM3
      });

      if (typeof densityKgM3 === "number") {
        resolvedMaterial = buildDensityOverrideMaterial({
          baseMaterial: material,
          densityKgM3
        });
        resolvedMaterialId = resolvedMaterial.id;
        runtimeMaterials.set(resolvedMaterial.id, resolvedMaterial);
      }
    }

    if (hasDynamicStiffnessOverrideInput(row.dynamicStiffnessMNm3) && !parseDynamicStiffnessOverride(row.dynamicStiffnessMNm3)) {
      warnings.push(`Layer ${index + 1} has an invalid dynamic stiffness override. Enter a positive MN/m³ value or leave it blank.`);
    } else if (resolvedMaterial && hasEffectiveDynamicStiffnessOverride({ material: resolvedMaterial, overrideValue: row.dynamicStiffnessMNm3 })) {
      const dynamicStiffnessMNm3 = parseDynamicStiffnessOverride(row.dynamicStiffnessMNm3);

      if (typeof dynamicStiffnessMNm3 === "number") {
        const runtimeMaterial = buildDynamicStiffnessOverrideMaterial({
          baseMaterial: resolvedMaterial,
          dynamicStiffnessMNm3
        });

        resolvedMaterialId = runtimeMaterial.id;
        runtimeMaterials.set(runtimeMaterial.id, runtimeMaterial);
      }
    }

    const nextLayer: LayerInput = {
      floorRole: row.floorRole,
      materialId: resolvedMaterialId,
      thicknessMm: parsedThickness
    };
    const previousLayer = layers.at(-1);

    if (previousLayer && canCollapseAtSolverBoundary(previousLayer, nextLayer)) {
      previousLayer.thicknessMm += nextLayer.thicknessMm;
      return;
    }

    layers.push(nextLayer);
  });

  return { layers, runtimeMaterials: Array.from(runtimeMaterials.values()), warnings };
}

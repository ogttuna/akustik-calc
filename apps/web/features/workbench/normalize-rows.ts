import type { LayerInput } from "@dynecho/shared";

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

function canCollapseAtSolverBoundary(previousLayer: LayerInput | undefined, nextLayer: LayerInput): boolean {
  return Boolean(
    previousLayer &&
      previousLayer.materialId === nextLayer.materialId &&
      previousLayer.floorRole === nextLayer.floorRole &&
      SOLVER_CONTINUUM_MATERIAL_IDS.has(nextLayer.materialId)
  );
}

export function normalizeRows(rows: readonly LayerDraft[]) {
  const warnings: string[] = [];
  const layers: LayerInput[] = [];

  rows.forEach((row, index) => {
    const parsedThickness = Number(row.thicknessMm);
    if (!Number.isFinite(parsedThickness) || parsedThickness <= 0) {
      warnings.push(`Layer ${index + 1} is missing a valid thickness.`);
      return;
    }

    const nextLayer: LayerInput = {
      floorRole: row.floorRole,
      materialId: row.materialId,
      thicknessMm: parsedThickness
    };
    const previousLayer = layers.at(-1);

    if (previousLayer && canCollapseAtSolverBoundary(previousLayer, nextLayer)) {
      previousLayer.thicknessMm += nextLayer.thicknessMm;
      return;
    }

    layers.push(nextLayer);
  });

  return { layers, warnings };
}

import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

const GROUPED_ROCKWOOL_TRIPLE_LEAF_PREDICTION_STRATEGY =
  "triple_leaf_two_cavity_frequency_solver_family_physics_prediction";
const GROUPED_ROCKWOOL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_STRATEGY =
  "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor";

// Historical Gate B surfaces still import the screening-named constants; the
// grouped lane is now a labelled physics prediction, while flat-list split
// outputs remain withheld.
export const ROCKWOOL_TRIPLE_LEAF_SCREENING_ONLY_LABEL = "Rockwool source-gated prediction";

export const ROCKWOOL_GROUPED_TRIPLE_LEAF_SCREENING_ONLY_GUARD =
  "Rockwool grouped triple-leaf lab Rw/STC/C/Ctr is now a source-absent local-substitution lab spectrum adapter: not measured exact, not source-validated, and not design-grade; keep the +/-8 dB not-measured budget visible while field and building adapters remain separately owned.";

export const ROCKWOOL_FLAT_LIST_SCREENING_ONLY_GUARD =
  "Rockwool flat-list adjacent swaps keep the current double-leaf numeric lane until grouped topology proves a physical triple-leaf penalty.";

export const ROCKWOOL_TRIPLE_LEAF_FIELD_CONTINUATION_GUARD =
  "This field value continues from the Rockwool grouped triple-leaf source-gated prediction lane; it is not an independent measured field result, not exact, not source-validated, and not design-grade.";

export const ROCKWOOL_SPLIT_TRIPLE_LEAF_OUTPUT_WITHHELD_GUARD =
  "Rockwool split/internal-leaf flat-list output is not ready: grouped triple-leaf topology and a source-owned calibrated model are required before the current Rw 41 / R'w 39 / DnT,w 40 diagnostic can be consumed as a defended result.";

export type RockwoolTripleLeafScreeningPolicyCopy = {
  fieldDetail: string;
  label: typeof ROCKWOOL_TRIPLE_LEAF_SCREENING_ONLY_LABEL;
  outputDetail: string;
  variant: "flat_list_fail_closed" | "grouped_source_blocked" | "grouped_source_gated_prediction";
};

const ROCKWOOL_SPLIT_TRIPLE_LEAF_WITHHELD_OUTPUTS = new Set<RequestedOutputId>([
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "DnT,w",
  "DnT,A",
  "DnT,A,k",
  "Dn,w",
  "Dn,A"
]);

export function getRockwoolSplitTripleLeafWithheldOutputDetail(
  result: AssemblyCalculation | null | undefined,
  output: RequestedOutputId
): string | null {
  if (!ROCKWOOL_SPLIT_TRIPLE_LEAF_WITHHELD_OUTPUTS.has(output)) {
    return null;
  }

  const warnings: readonly string[] = result?.warnings ?? [];
  const isWithheld = warnings.some((warning: string) =>
    /^Rockwool split\/internal gypsum-leaf flat-list outputs were withheld/u.test(warning)
  );

  return isWithheld ? ROCKWOOL_SPLIT_TRIPLE_LEAF_OUTPUT_WITHHELD_GUARD : null;
}

function hasSplitRockwoolFill(result: AssemblyCalculation | null | undefined): boolean {
  const rockwoolLayerCount =
    result?.layers.filter((layer: AssemblyCalculation["layers"][number]) => {
      const materialName = layer.material.name.toLowerCase();

      return layer.materialId.toLowerCase() === "rockwool" || materialName.includes("rockwool");
    }).length ?? 0;

  return rockwoolLayerCount >= 2;
}

export function getRockwoolTripleLeafScreeningPolicyCopy(
  result: AssemblyCalculation | null | undefined
): RockwoolTripleLeafScreeningPolicyCopy | null {
  const trace = result?.dynamicAirborneTrace;

  if (
    !trace ||
    trace.detectedFamily !== "multileaf_multicavity" ||
    !hasSplitRockwoolFill(result)
  ) {
    return null;
  }

  const warnings: readonly string[] = result?.warnings ?? [];
  const groupedSourceBlocked = warnings.some((warning: string) =>
    /^Grouped triple-leaf topology is present/u.test(warning)
  );
  const groupedSourceGatedPrediction = warnings.some((warning: string) =>
    /^Grouped Rockwool triple-leaf family physics prediction/u.test(warning) ||
    /lab spectrum adapter is active/i.test(warning) ||
    /source-absent formula corridor/i.test(warning)
  );
  const flatListFailClosed = warnings.some((warning: string) =>
    /Flat-list adjacent-swap sensitivity guard/i.test(warning)
  );

  if (
    (trace.strategy === GROUPED_ROCKWOOL_TRIPLE_LEAF_PREDICTION_STRATEGY ||
      trace.strategy === GROUPED_ROCKWOOL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_STRATEGY) &&
    groupedSourceGatedPrediction
  ) {
    return {
      fieldDetail: ROCKWOOL_TRIPLE_LEAF_FIELD_CONTINUATION_GUARD,
      label: ROCKWOOL_TRIPLE_LEAF_SCREENING_ONLY_LABEL,
      outputDetail: ROCKWOOL_GROUPED_TRIPLE_LEAF_SCREENING_ONLY_GUARD,
      variant: "grouped_source_gated_prediction"
    };
  }

  if (trace.strategy === "multileaf_screening_blend" && groupedSourceBlocked) {
    return {
      fieldDetail: ROCKWOOL_TRIPLE_LEAF_FIELD_CONTINUATION_GUARD,
      label: ROCKWOOL_TRIPLE_LEAF_SCREENING_ONLY_LABEL,
      outputDetail: ROCKWOOL_GROUPED_TRIPLE_LEAF_SCREENING_ONLY_GUARD,
      variant: "grouped_source_blocked"
    };
  }

  if (
    trace.strategy === "multileaf_screening_blend_fail_closed_until_grouped_topology" &&
    flatListFailClosed
  ) {
    return {
      fieldDetail: ROCKWOOL_TRIPLE_LEAF_FIELD_CONTINUATION_GUARD,
      label: ROCKWOOL_TRIPLE_LEAF_SCREENING_ONLY_LABEL,
      outputDetail: ROCKWOOL_FLAT_LIST_SCREENING_ONLY_GUARD,
      variant: "flat_list_fail_closed"
    };
  }

  return null;
}

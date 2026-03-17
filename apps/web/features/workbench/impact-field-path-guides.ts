"use client";

import type { ImpactCalculation } from "@dynecho/shared";

import type { ParsedImpactFieldPathInput } from "./impact-field-path-input";
import type { WorkbenchFieldStatus } from "./workbench-field-status";

type BuildImpactFieldPathGuidesInput = {
  directPathOffsetDb: string;
  lowerTreatmentReductionDb: string;
  parsed: ParsedImpactFieldPathInput | null;
  parseError: string | null;
  result: ImpactCalculation | null;
};

export function buildImpactFieldPathGuides(
  input: BuildImpactFieldPathGuidesInput
): {
  directOffset: WorkbenchFieldStatus;
  flankingPaths: WorkbenchFieldStatus;
  lowerTreatmentReduction: WorkbenchFieldStatus;
} {
  const flankingActive = input.result?.fieldEstimateProfile === "direct_flanking_energy_sum";
  const standardizedActive =
    input.result?.metricBasis?.LPrimeNTw === "estimated_standardized_field_lprimentw_from_direct_flanking_energy_sum_plus_room_volume";

  return {
    directOffset: {
      currentUse: flankingActive
        ? "This offset is currently active on the direct path before flanking energy summation."
        : input.parsed
          ? "The solver has valid flanking paths and will use this offset as soon as the current lane can resolve a live impact base."
          : "Disabled. No valid flanking-path set is active, so the direct path still stays on the normal guide / K-based lane.",
      kind: flankingActive ? "active" : input.parsed ? "conditional" : "ignored",
      meaning: "Direct path offset shifts the base impact lane before it is summed with explicit flanking paths."
    },
    flankingPaths: {
      currentUse: flankingActive
        ? standardizedActive
          ? "These flanking paths are currently being summed with the direct path and then standardized to L'nT,w."
          : "These flanking paths are currently being summed with the direct path to derive L'n,w."
        : input.parseError
          ? "Ignored until the JSON resolves to a valid array of flanking path objects."
          : input.parsed
            ? "Anchored. The path set is ready, but the current impact lane still needs a usable lab-side base before the direct+flanking branch can run."
            : "No flanking path set is active right now.",
      kind: flankingActive ? "active" : input.parsed ? "anchored" : "ignored",
      meaning:
        "Flanking paths describe parallel field transmission paths. Each row can carry levelOffsetDb, pathCount, pathType, supportingElementFamily, and expert penalties."
    },
    lowerTreatmentReduction: {
      currentUse: flankingActive && input.lowerTreatmentReductionDb.trim().length > 0
        ? "An explicit ΔLd reduction is currently being applied only to the direct path before the direct+flanking energy sum."
        : input.lowerTreatmentReductionDb.trim().length > 0
          ? "Prepared. ΔLd will apply only when the direct+flanking path is active."
          : "Disabled. Direct path stays unreduced unless you enter an explicit impact-side ΔLd.",
      kind:
        flankingActive && input.lowerTreatmentReductionDb.trim().length > 0
          ? "active"
          : input.lowerTreatmentReductionDb.trim().length > 0
            ? "conditional"
            : "ignored",
      meaning:
        "ΔLd is an explicit impact-side lower-treatment reduction for the direct path. It is not inferred from airborne ΔR and does not automatically change flanking paths."
    }
  };
}

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import type { ImpactFieldContext, ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";

import { calculateImpactOnly } from "./calculate-impact-only";

type ValidationBenchmarkAssemblyMeta = {
  contextMode?: string;
  impactFieldKCorrectionDb?: number;
  receivingRoomVolumeM3?: number;
};

type ValidationBenchmarkCase = {
  assemblyMeta?: ValidationBenchmarkAssemblyMeta;
  expected: Record<string, number>;
  expectedBasis?: string;
  id: string;
  impactPredictorInput: ImpactPredictorInput;
  mode:
    | "official_floor_system"
    | "official_floor_system_bound"
    | "official_catalog_exact"
    | "formula_estimate"
    | "formula_plus_lower_bound"
    | "field_explicit_k_estimate"
    | "field_standardized_volume_estimate"
    | "family_specific_bound_estimate"
    | "family_specific_estimate"
    | "family_archetype_estimate"
    | "family_general_estimate"
    | "low_confidence_estimate";
  source: string;
  targetOutputs?: RequestedOutputId[];
  tolerances?: Record<string, number>;
};

type ValidationBenchmarkDataset = {
  cases: ValidationBenchmarkCase[];
  schemaVersion: number;
};

function loadDataset(): ValidationBenchmarkDataset {
  return JSON.parse(
    readFileSync(new URL("../fixtures/reference-benchmarks-impact-validation-2026.json", import.meta.url), "utf8")
  ) as ValidationBenchmarkDataset;
}

function buildImpactFieldContext(meta: ValidationBenchmarkAssemblyMeta | undefined): ImpactFieldContext | undefined {
  if (!meta) {
    return undefined;
  }

  const fieldKDb =
    typeof meta.impactFieldKCorrectionDb === "number" ? meta.impactFieldKCorrectionDb : undefined;
  const receivingRoomVolumeM3 =
    typeof meta.receivingRoomVolumeM3 === "number" ? meta.receivingRoomVolumeM3 : undefined;

  if (typeof fieldKDb !== "number" && typeof receivingRoomVolumeM3 !== "number") {
    return undefined;
  }

  return {
    fieldKDb,
    receivingRoomVolumeM3
  };
}

function numberOrNull(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

describe("impact validation benchmark corpus", () => {
  it("stays well-formed and source-backed", () => {
    const dataset = loadDataset();
    const fieldCases = dataset.cases.filter((entry) => entry.mode.includes("field_"));

    expect(dataset.schemaVersion).toBe(1);
    expect(Array.isArray(dataset.cases)).toBe(true);
    expect(dataset.cases.length).toBeGreaterThanOrEqual(7);
    expect(fieldCases.length).toBeGreaterThanOrEqual(10);

    for (const entry of dataset.cases) {
      expect(typeof entry.id).toBe("string");
      expect(String(entry.source)).toMatch(/^https:\/\//);
      expect([
        "official_floor_system",
        "official_floor_system_bound",
        "official_catalog_exact",
        "formula_estimate",
        "formula_plus_lower_bound",
        "field_explicit_k_estimate",
        "field_standardized_volume_estimate",
        "family_specific_bound_estimate",
        "family_specific_estimate",
        "family_archetype_estimate",
        "family_general_estimate",
        "low_confidence_estimate"
      ]).toContain(entry.mode);
      expect(entry.impactPredictorInput && typeof entry.impactPredictorInput === "object").toBe(true);
      expect(entry.expected && typeof entry.expected === "object").toBe(true);
    }
  });

  it("stays aligned with published floor-library, catalog, family, and field-carry-over references", () => {
    const dataset = loadDataset();
    const errors: string[] = [];

    for (const entry of dataset.cases) {
      const wantsDelta = Number.isFinite(Number(entry.expected.deltaLwDb));
      const requestedOutputs =
        Array.isArray(entry.targetOutputs) && entry.targetOutputs.length > 0
          ? entry.targetOutputs
          : wantsDelta
            ? (["Ln,w", "DeltaLw"] as RequestedOutputId[])
            : (["Ln,w"] as RequestedOutputId[]);
      const result = calculateImpactOnly([], {
        impactFieldContext: buildImpactFieldContext(entry.assemblyMeta),
        impactPredictorInput: entry.impactPredictorInput,
        targetOutputs: requestedOutputs
      });

      const impact = result.impact;
      const lowerBound = result.lowerBoundImpact;
      const floorRatings = result.floorSystemRatings;

      if (!impact && !lowerBound && !result.floorSystemMatch && !result.boundFloorSystemMatch && !result.impactCatalogMatch) {
        errors.push(`${entry.id}: calculateImpactOnly returned no usable benchmark lane`);
        continue;
      }

      if (entry.mode === "official_floor_system") {
        const lnw = numberOrNull(impact?.LnW);
        const rw = numberOrNull(floorRatings?.Rw);

        if (lnw !== Number(entry.expected.lnwDb)) {
          errors.push(`${entry.id}: expected Ln,w ${entry.expected.lnwDb}, got ${lnw}`);
        }

        if (rw !== Number(entry.expected.rwDb)) {
          errors.push(`${entry.id}: expected floor Rw ${entry.expected.rwDb}, got ${rw}`);
        }

        if (entry.expected.ciDb !== undefined && numberOrNull(impact?.CI) !== Number(entry.expected.ciDb)) {
          errors.push(`${entry.id}: expected CI ${entry.expected.ciDb}, got ${numberOrNull(impact?.CI)}`);
        }

        if (
          entry.expected.lnwPlusCiDb !== undefined &&
          numberOrNull(impact?.LnWPlusCI) !== Number(entry.expected.lnwPlusCiDb)
        ) {
          errors.push(
            `${entry.id}: expected Ln,w+CI ${entry.expected.lnwPlusCiDb}, got ${numberOrNull(impact?.LnWPlusCI)}`
          );
        }
      } else if (entry.mode === "official_floor_system_bound") {
        const exactLnw = numberOrNull(impact?.LnW);
        const rw = numberOrNull(floorRatings?.Rw);
        const upper = numberOrNull(lowerBound?.LnWUpperBound);

        if (typeof exactLnw === "number") {
          errors.push(`${entry.id}: should not expose an exact Ln,w metric`);
        }

        if (rw !== Number(entry.expected.rwDb)) {
          errors.push(`${entry.id}: expected floor Rw ${entry.expected.rwDb}, got ${rw}`);
        }

        if (upper !== Number(entry.expected.lnwUpperBoundDb)) {
          errors.push(`${entry.id}: expected Ln,w upper bound ${entry.expected.lnwUpperBoundDb}, got ${upper}`);
        }
      } else if (entry.mode === "official_catalog_exact") {
        const lnw = numberOrNull(impact?.LnW);
        const delta = numberOrNull(impact?.DeltaLw);

        if (lnw !== Number(entry.expected.lnwDb)) {
          errors.push(`${entry.id}: expected Ln,w ${entry.expected.lnwDb}, got ${lnw}`);
        }

        if (delta !== Number(entry.expected.deltaLwDb)) {
          errors.push(`${entry.id}: expected DeltaLw ${entry.expected.deltaLwDb}, got ${delta}`);
        }

        if (!result.impactPredictorStatus?.matchedCatalogCaseId) {
          errors.push(`${entry.id}: expected an exact catalog match id`);
        }
      } else if (entry.mode === "formula_estimate") {
        const lnw = numberOrNull(impact?.LnW);
        const expectedLnw = Number(entry.expected.lnwDb);
        const lnwTol = Number(entry.tolerances?.lnwDb ?? 0);

        if (lnw === null || Math.abs(lnw - expectedLnw) > lnwTol) {
          errors.push(`${entry.id}: Ln,w error ${lnw === null ? "null" : Math.abs(lnw - expectedLnw).toFixed(2)} dB exceeds tolerance ${lnwTol}`);
        }

        if (entry.expected.deltaLwDb !== undefined) {
          const delta = numberOrNull(impact?.DeltaLw);
          const expectedDelta = Number(entry.expected.deltaLwDb);
          const deltaTol = Number(entry.tolerances?.deltaLwDb ?? 0);

          if (delta === null || Math.abs(delta - expectedDelta) > deltaTol) {
            errors.push(
              `${entry.id}: DeltaLw error ${delta === null ? "null" : Math.abs(delta - expectedDelta).toFixed(2)} dB exceeds tolerance ${deltaTol}`
            );
          }
        }

        if (!result.impactPredictorStatus?.implementedFormulaEstimate && !result.impactPredictorStatus?.matchedFloorSystemId) {
          errors.push(`${entry.id}: expected either the formula estimate path or a better exact floor-system override`);
        }
      } else if (entry.mode === "formula_plus_lower_bound") {
        const lnw = numberOrNull(impact?.LnW);
        const delta = numberOrNull(impact?.DeltaLw);
        const upper = numberOrNull(lowerBound?.LnWUpperBound);
        const deltaLower = numberOrNull(lowerBound?.DeltaLwLowerBound);
        const expectedLnw = Number(entry.expected.lnwDb);
        const expectedDelta = Number(entry.expected.deltaLwDb);
        const expectedUpper = Number(entry.expected.lnwUpperBoundDb);
        const expectedDeltaLower = Number(entry.expected.deltaLwLowerBoundDb);
        const lnwTol = Number(entry.tolerances?.lnwDb ?? 0);
        const deltaTol = Number(entry.tolerances?.deltaLwDb ?? 0);

        if (lnw === null || Math.abs(lnw - expectedLnw) > lnwTol) {
          errors.push(`${entry.id}: Ln,w error ${lnw === null ? "null" : Math.abs(lnw - expectedLnw).toFixed(2)} dB exceeds tolerance ${lnwTol}`);
        }

        if (delta === null || Math.abs(delta - expectedDelta) > deltaTol) {
          errors.push(
            `${entry.id}: DeltaLw error ${delta === null ? "null" : Math.abs(delta - expectedDelta).toFixed(2)} dB exceeds tolerance ${deltaTol}`
          );
        }

        if (upper !== expectedUpper) {
          errors.push(`${entry.id}: expected Ln,w upper bound ${expectedUpper}, got ${upper}`);
        }

        if (deltaLower !== expectedDeltaLower) {
          errors.push(`${entry.id}: expected DeltaLw lower bound ${expectedDeltaLower}, got ${deltaLower}`);
        }

        if (!result.impactPredictorStatus?.implementedFormulaEstimate) {
          errors.push(`${entry.id}: expected formula estimate path to be active`);
        }

        if (!result.impactPredictorStatus?.matchedCatalogCaseId) {
          errors.push(`${entry.id}: expected lower-bound catalog match id`);
        }
      } else if (entry.mode === "field_explicit_k_estimate") {
        const lPrimeNW = numberOrNull(impact?.LPrimeNW);
        const expectedLPrimeNW = Number(entry.expected.lprimeNwDb);
        const tol = Number(entry.tolerances?.lprimeNwDb ?? 0);

        if (lPrimeNW === null || Math.abs(lPrimeNW - expectedLPrimeNW) > tol) {
          errors.push(
            `${entry.id}: L'n,w error ${lPrimeNW === null ? "null" : Math.abs(lPrimeNW - expectedLPrimeNW).toFixed(2)} dB exceeds tolerance ${tol}`
          );
        }

        if ((impact?.metricBasis?.LPrimeNW ?? "").trim().toLowerCase() !== "estimated_field_lprimenw_from_lnw_plus_k") {
          errors.push(`${entry.id}: expected explicit field-correction metric basis on L'n,w`);
        }

        if (entry.expectedBasis && (impact?.basis ?? "").trim().toLowerCase() !== entry.expectedBasis.trim().toLowerCase()) {
          errors.push(`${entry.id}: expected impact basis ${entry.expectedBasis}`);
        }
      } else if (entry.mode === "field_standardized_volume_estimate") {
        const lPrimeNW = numberOrNull(impact?.LPrimeNW);
        const lPrimeNTw = numberOrNull(impact?.LPrimeNTw);
        const lPrimeNT50 = numberOrNull(impact?.LPrimeNT50);
        const tolNw = Number(entry.tolerances?.lprimeNwDb ?? 0);
        const tolNTw = Number(entry.tolerances?.lprimeNTwDb ?? 0);
        const tolNT50 = Number(entry.tolerances?.lprimeNT50Db ?? 0);

        if (lPrimeNW === null || Math.abs(lPrimeNW - Number(entry.expected.lprimeNwDb)) > tolNw) {
          errors.push(
            `${entry.id}: L'n,w error ${lPrimeNW === null ? "null" : Math.abs(lPrimeNW - Number(entry.expected.lprimeNwDb)).toFixed(2)} dB exceeds tolerance ${tolNw}`
          );
        }

        if (lPrimeNTw === null || Math.abs(lPrimeNTw - Number(entry.expected.lprimeNTwDb)) > tolNTw) {
          errors.push(
            `${entry.id}: L'nT,w error ${lPrimeNTw === null ? "null" : Math.abs(lPrimeNTw - Number(entry.expected.lprimeNTwDb)).toFixed(2)} dB exceeds tolerance ${tolNTw}`
          );
        }

        if (lPrimeNT50 === null || Math.abs(lPrimeNT50 - Number(entry.expected.lprimeNT50Db)) > tolNT50) {
          errors.push(
            `${entry.id}: L'nT,50 error ${lPrimeNT50 === null ? "null" : Math.abs(lPrimeNT50 - Number(entry.expected.lprimeNT50Db)).toFixed(2)} dB exceeds tolerance ${tolNT50}`
          );
        }

        if (
          (impact?.metricBasis?.LPrimeNTw ?? "").trim().toLowerCase() !==
          "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume"
        ) {
          errors.push(`${entry.id}: expected standardized field-volume metric basis on L'nT,w`);
        }

        if (
          (impact?.metricBasis?.LPrimeNT50 ?? "").trim().toLowerCase() !==
          "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500"
        ) {
          errors.push(`${entry.id}: expected standardized field-volume metric basis on L'nT,50`);
        }

        if (entry.expectedBasis && (impact?.basis ?? "").trim().toLowerCase() !== entry.expectedBasis.trim().toLowerCase()) {
          errors.push(`${entry.id}: expected impact basis ${entry.expectedBasis}`);
        }
      } else if (entry.mode === "family_specific_bound_estimate") {
        const exactLnw = numberOrNull(impact?.LnW);
        const rw = numberOrNull(floorRatings?.Rw);
        const rwCtr = numberOrNull(floorRatings?.RwCtr);
        const upper = numberOrNull(lowerBound?.LnWUpperBound);

        if (typeof exactLnw === "number") {
          errors.push(`${entry.id}: should not expose an exact Ln,w metric`);
        }

        if (
          rw === null ||
          rw < Number(entry.expected.rwMinDb) ||
          rw > Number(entry.expected.rwMaxDb)
        ) {
          errors.push(`${entry.id}: expected floor Rw within [${entry.expected.rwMinDb}, ${entry.expected.rwMaxDb}], got ${rw}`);
        }

        if (
          rwCtr === null ||
          rwCtr < Number(entry.expected.rwCtrMinDb) ||
          rwCtr > Number(entry.expected.rwCtrMaxDb)
        ) {
          errors.push(
            `${entry.id}: expected floor Rw+Ctr within [${entry.expected.rwCtrMinDb}, ${entry.expected.rwCtrMaxDb}], got ${rwCtr}`
          );
        }

        if (
          upper === null ||
          upper < Number(entry.expected.lnwUpperBoundMinDb) ||
          upper > Number(entry.expected.lnwUpperBoundMaxDb)
        ) {
          errors.push(
            `${entry.id}: expected Ln,w upper bound within [${entry.expected.lnwUpperBoundMinDb}, ${entry.expected.lnwUpperBoundMaxDb}], got ${upper}`
          );
        }

        if ((floorRatings?.basis ?? "").trim().toLowerCase() !== "predictor_lightweight_steel_bound_interpolation_estimate") {
          errors.push(`${entry.id}: expected steel bound interpolation basis on floor ratings`);
        }

        if ((lowerBound?.basis ?? "").trim().toLowerCase() !== "predictor_lightweight_steel_bound_interpolation_estimate") {
          errors.push(`${entry.id}: expected steel bound interpolation basis on lower-bound status`);
        }

        if (!result.impactPredictorStatus?.implementedFamilyEstimate) {
          errors.push(`${entry.id}: expected family estimate path to be active`);
        }
      } else {
        const lnw = numberOrNull(impact?.LnW);
        const rw = numberOrNull(floorRatings?.Rw);
        const expectedBasis =
          entry.expectedBasis ??
          (
            entry.mode === "family_general_estimate"
              ? "predictor_floor_system_family_general_estimate"
              : entry.mode === "low_confidence_estimate"
                ? "predictor_floor_system_low_confidence_estimate"
              : entry.mode === "family_specific_estimate"
                ? "predictor_composite_panel_published_interaction_estimate"
                : "predictor_floor_system_family_archetype_estimate"
          );

        if (
          lnw === null ||
          lnw < Number(entry.expected.lnwMinDb) ||
          lnw > Number(entry.expected.lnwMaxDb)
        ) {
          errors.push(`${entry.id}: expected Ln,w within [${entry.expected.lnwMinDb}, ${entry.expected.lnwMaxDb}], got ${lnw}`);
        }

        if (
          rw === null ||
          rw < Number(entry.expected.rwMinDb) ||
          rw > Number(entry.expected.rwMaxDb)
        ) {
          errors.push(`${entry.id}: expected floor Rw within [${entry.expected.rwMinDb}, ${entry.expected.rwMaxDb}], got ${rw}`);
        }

        if ((impact?.basis ?? "").trim().toLowerCase() !== expectedBasis.trim().toLowerCase()) {
          errors.push(`${entry.id}: expected basis ${expectedBasis}`);
        }

        if (!result.impactPredictorStatus?.implementedFamilyEstimate) {
          errors.push(`${entry.id}: expected family estimate path to be active`);
        }
      }
    }

    expect(errors).toEqual([]);
  });
});

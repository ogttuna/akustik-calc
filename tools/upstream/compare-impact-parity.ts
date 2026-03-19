import { calculateAssembly } from "@dynecho/engine";
import type {
  AssemblyCalculation,
  ImpactBoundCalculation,
  ImpactCalculation,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { getStringArg, hasFlag, parseCliArgs } from "./cli";
import {
  IMPACT_PARITY_CASES,
  type ImpactMetricKey,
  type ImpactParityCase,
  type LowerBoundMetricKey
} from "./fixtures/impact-parity-cases";
import { runUpstreamJson } from "./json";

type ComparableImpact = Pick<
  ImpactCalculation,
  | "basis"
  | "CI"
  | "CI50_2500"
  | "DeltaLw"
  | "LPrimeNW"
  | "LPrimeNT50"
  | "LPrimeNTw"
  | "LnW"
  | "LnWPlusCI"
  | "estimateCandidateIds"
  | "metricBasis"
>;

type ComparableLowerBound = Pick<
  ImpactBoundCalculation,
  | "basis"
  | "DeltaLwLowerBound"
  | "LPrimeNTwUpperBound"
  | "LPrimeNWUpperBound"
  | "LnWUpperBound"
>;

type ComparableFloor = {
  Rw: number | null;
  RwCtr: number | null;
};

type LocalImpactParitySummary = {
  floor: ComparableFloor | null;
  impact: ComparableImpact | null;
  lowerBound: ComparableLowerBound | null;
  matchedCatalogId: string | null;
  matchedFloorSystemId: string | null;
};

type UpstreamImpactParitySummary = {
  floor: ComparableFloor | null;
    impact: {
      basis: string | null;
      CI: number | null;
      CI50_2500: number | null;
      DeltaLw: number | null;
    LPrimeNW: number | null;
    LPrimeNT50: number | null;
    LPrimeNTw: number | null;
      LnW: number | null;
      LnWPlusCI: number | null;
      estimateCandidateIds: string[] | null;
      metricBasis: Partial<Record<ImpactMetricKey, string>> | null;
      predictorCatalogCaseId: string | null;
    } | null;
  lowerBound: {
    basis: string | null;
    DeltaLwLowerBound: number | null;
    LPrimeNTwUpperBound: number | null;
    LPrimeNWUpperBound: number | null;
    LnWUpperBound: number | null;
  } | null;
  matchedCatalogCaseId: string | null;
  matchedFloorSystemId: string | null;
};

type ImpactParityMismatch = {
  actual: string;
  expected: string;
  metric: string;
};

type ImpactParityResult = {
  fixture: ImpactParityCase;
  local: LocalImpactParitySummary;
  mismatches: ImpactParityMismatch[];
  ok: boolean;
  upstream: UpstreamImpactParitySummary;
};

const DEFAULT_TOLERANCE_DB = 0.1;

function roundForDisplay(value: number): string {
  return value.toFixed(1);
}

function pickFloorCarrier(result: AssemblyCalculation): ComparableFloor | null {
  let floorRatings =
    result.floorSystemMatch?.system.airborneRatings ??
    result.floorSystemEstimate?.airborneRatings ??
    result.boundFloorSystemMatch?.system.airborneRatings ??
    result.boundFloorSystemEstimate?.airborneRatings ??
    null;

  if (!floorRatings) {
    floorRatings = result.floorSystemRatings;
  }

  if (!floorRatings) {
    return null;
  }

  return {
    Rw: typeof floorRatings.Rw === "number" ? floorRatings.Rw : null,
    RwCtr: typeof floorRatings.RwCtr === "number" ? floorRatings.RwCtr : null
  };
}

function summarizeLocalResult(result: AssemblyCalculation): LocalImpactParitySummary {
  return {
    floor: pickFloorCarrier(result),
    impact: result.impact
      ? {
          basis: result.impact.basis,
          CI: result.impact.CI,
          CI50_2500: result.impact.CI50_2500,
          DeltaLw: result.impact.DeltaLw,
          LPrimeNW: result.impact.LPrimeNW,
          LPrimeNT50: result.impact.LPrimeNT50,
          LPrimeNTw: result.impact.LPrimeNTw,
          LnW: result.impact.LnW,
          LnWPlusCI: result.impact.LnWPlusCI,
          estimateCandidateIds: result.impact.estimateCandidateIds,
          metricBasis: result.impact.metricBasis
        }
      : null,
    lowerBound: result.lowerBoundImpact
      ? {
          basis: result.lowerBoundImpact.basis,
          DeltaLwLowerBound: result.lowerBoundImpact.DeltaLwLowerBound,
          LPrimeNTwUpperBound: result.lowerBoundImpact.LPrimeNTwUpperBound,
          LPrimeNWUpperBound: result.lowerBoundImpact.LPrimeNWUpperBound,
          LnWUpperBound: result.lowerBoundImpact.LnWUpperBound
        }
      : null,
    matchedCatalogId: result.impactCatalogMatch?.catalog.id ?? null,
    matchedFloorSystemId: result.floorSystemMatch?.system.id ?? result.boundFloorSystemMatch?.system.id ?? null
  };
}

function runUpstreamImpactParityCase(
  fixture: ImpactParityCase,
  upstreamPath?: string
): UpstreamImpactParitySummary {
  const script = `
    const core = require("./core.js");
    const payload = ${JSON.stringify({
      impactPredictorInput: fixture.upstreamImpactPredictorInput,
      layers: fixture.layers,
      upstreamOptions: fixture.upstreamOptions ?? null
    })};
    const result = core.calculateAssembly(payload.layers, {
      impactPredictorInput: payload.impactPredictorInput,
      assemblyMeta: payload.upstreamOptions?.assemblyMeta,
      countryProfile: payload.upstreamOptions?.countryProfile,
      targetOutputs: payload.upstreamOptions?.targetOutputs
    });

    console.log(JSON.stringify({
      floor: result?.floorSystemRatings
        ? {
            Rw: typeof result.floorSystemRatings.Rw === "number" ? result.floorSystemRatings.Rw : null,
            RwCtr: typeof result.floorSystemRatings.RwCtr === "number" ? result.floorSystemRatings.RwCtr : null
          }
        : null,
      impact: result?.ratings?.impact
        ? {
            basis: typeof result.ratings.impact.basis === "string" ? result.ratings.impact.basis : null,
            CI: typeof result.ratings.impact.CI === "number" ? result.ratings.impact.CI : null,
            CI50_2500: typeof result.ratings.impact.CI50_2500 === "number" ? result.ratings.impact.CI50_2500 : null,
            DeltaLw: typeof result.ratings.impact.DeltaLw === "number" ? result.ratings.impact.DeltaLw : null,
            LPrimeNW: typeof result.ratings.impact.LPrimeNW === "number" ? result.ratings.impact.LPrimeNW : null,
            LPrimeNT50: typeof result.ratings.impact.LPrimeNT50 === "number" ? result.ratings.impact.LPrimeNT50 : null,
            LPrimeNTw: typeof result.ratings.impact.LPrimeNTw === "number" ? result.ratings.impact.LPrimeNTw : null,
            LnW: typeof result.ratings.impact.LnW === "number" ? result.ratings.impact.LnW : null,
            LnWPlusCI: typeof result.ratings.impact.LnWPlusCI === "number" ? result.ratings.impact.LnWPlusCI : null,
            estimateCandidateIds: Array.isArray(result.ratings.impact.estimateCandidateIds)
              ? result.ratings.impact.estimateCandidateIds.filter((value) => typeof value === "string")
              : null,
            metricBasis: result.ratings.impact.metricBasis && typeof result.ratings.impact.metricBasis === "object"
              ? {
                  CI: typeof result.ratings.impact.metricBasis.CI === "string" ? result.ratings.impact.metricBasis.CI : undefined,
                  CI50_2500: typeof result.ratings.impact.metricBasis.CI50_2500 === "string" ? result.ratings.impact.metricBasis.CI50_2500 : undefined,
                  DeltaLw: typeof result.ratings.impact.metricBasis.DeltaLw === "string" ? result.ratings.impact.metricBasis.DeltaLw : undefined,
                  LPrimeNW: typeof result.ratings.impact.metricBasis.LPrimeNW === "string" ? result.ratings.impact.metricBasis.LPrimeNW : undefined,
                  LPrimeNT50: typeof result.ratings.impact.metricBasis.LPrimeNT50 === "string" ? result.ratings.impact.metricBasis.LPrimeNT50 : undefined,
                  LPrimeNTw: typeof result.ratings.impact.metricBasis.LPrimeNTw === "string" ? result.ratings.impact.metricBasis.LPrimeNTw : undefined,
                  LnW: typeof result.ratings.impact.metricBasis.LnW === "string" ? result.ratings.impact.metricBasis.LnW : undefined,
                  LnWPlusCI: typeof result.ratings.impact.metricBasis.LnWPlusCI === "string" ? result.ratings.impact.metricBasis.LnWPlusCI : undefined
                }
              : null,
            predictorCatalogCaseId: typeof result.ratings.impact.predictorCatalogCaseId === "string"
              ? result.ratings.impact.predictorCatalogCaseId
              : null
          }
        : null,
      lowerBound: result?.impactPredictorStatus?.lowerBoundImpact
        ? {
            basis: typeof result.impactPredictorStatus.lowerBoundImpact.basis === "string"
              ? result.impactPredictorStatus.lowerBoundImpact.basis
              : null,
            DeltaLwLowerBound: typeof result.impactPredictorStatus.lowerBoundImpact.DeltaLwLowerBound === "number"
              ? result.impactPredictorStatus.lowerBoundImpact.DeltaLwLowerBound
              : null,
            LPrimeNTwUpperBound: typeof result.impactPredictorStatus.lowerBoundImpact.LPrimeNTwUpperBound === "number"
              ? result.impactPredictorStatus.lowerBoundImpact.LPrimeNTwUpperBound
              : null,
            LPrimeNWUpperBound: typeof result.impactPredictorStatus.lowerBoundImpact.LPrimeNWUpperBound === "number"
              ? result.impactPredictorStatus.lowerBoundImpact.LPrimeNWUpperBound
              : null,
            LnWUpperBound: typeof result.impactPredictorStatus.lowerBoundImpact.LnWUpperBound === "number"
              ? result.impactPredictorStatus.lowerBoundImpact.LnWUpperBound
              : null
          }
        : null,
      matchedCatalogCaseId: typeof result?.impactPredictorStatus?.matchedCatalogCaseId === "string"
        ? result.impactPredictorStatus.matchedCatalogCaseId
        : null,
      matchedFloorSystemId: typeof result?.impactPredictorStatus?.matchedFloorSystemId === "string"
        ? result.impactPredictorStatus.matchedFloorSystemId
        : null
    }));
  `;

  return runUpstreamJson<UpstreamImpactParitySummary>(script, upstreamPath);
}

function pushNumericMismatch(
  mismatches: ImpactParityMismatch[],
  metric: string,
  localValue: number | null | undefined,
  upstreamValue: number | null | undefined
) {
  const localFinite = typeof localValue === "number" ? localValue : null;
  const upstreamFinite = typeof upstreamValue === "number" ? upstreamValue : null;

  if (localFinite === null && upstreamFinite === null) {
    return;
  }

  if (localFinite === null || upstreamFinite === null) {
    mismatches.push({
      actual: localFinite === null ? "null" : roundForDisplay(localFinite),
      expected: upstreamFinite === null ? "null" : roundForDisplay(upstreamFinite),
      metric
    });
    return;
  }

  if (Math.abs(localFinite - upstreamFinite) > DEFAULT_TOLERANCE_DB) {
    mismatches.push({
      actual: roundForDisplay(localFinite),
      expected: roundForDisplay(upstreamFinite),
      metric
    });
  }
}

function normalizeBasis(
  rawBasis: string | null | undefined,
  context: { catalogId?: string | null } = {}
): string | null {
  if (!rawBasis) {
    return null;
  }

  if (rawBasis === "official_floor_system_bound_match") {
    return "official_floor_system_bound_support";
  }

  if (rawBasis === "predictor_explicit_delta_heavy_reference_derived" && context.catalogId) {
    return "predictor_catalog_product_delta_official";
  }

  return rawBasis;
}

function pushStringMismatch(
  mismatches: ImpactParityMismatch[],
  metric: string,
  localValue: string | null,
  upstreamValue: string | null
) {
  if ((localValue ?? null) === (upstreamValue ?? null)) {
    return;
  }

  mismatches.push({
    actual: localValue ?? "null",
    expected: upstreamValue ?? "null",
    metric
  });
}

function pushStringArrayMismatch(
  mismatches: ImpactParityMismatch[],
  metric: string,
  localValue: readonly string[] | null | undefined,
  upstreamValue: readonly string[] | null | undefined
) {
  const localJoined = Array.isArray(localValue) ? localValue.join(",") : "";
  const upstreamJoined = Array.isArray(upstreamValue) ? upstreamValue.join(",") : "";

  if (localJoined === upstreamJoined) {
    return;
  }

  mismatches.push({
    actual: localJoined || "null",
    expected: upstreamJoined || "null",
    metric
  });
}

function getImpactMetricValue(
  source: ComparableImpact | UpstreamImpactParitySummary["impact"] | null | undefined,
  metric: ImpactMetricKey
): number | null | undefined {
  if (!source) {
    return null;
  }

  switch (metric) {
    case "CI":
      return source.CI;
    case "CI50_2500":
      return source.CI50_2500;
    case "DeltaLw":
      return source.DeltaLw;
    case "LPrimeNW":
      return source.LPrimeNW;
    case "LPrimeNT50":
      return source.LPrimeNT50;
    case "LPrimeNTw":
      return source.LPrimeNTw;
    case "LnW":
      return source.LnW;
    case "LnWPlusCI":
      return source.LnWPlusCI;
  }
}

function getLowerBoundMetricValue(
  source: ComparableLowerBound | UpstreamImpactParitySummary["lowerBound"] | null | undefined,
  metric: LowerBoundMetricKey
): number | null | undefined {
  if (!source) {
    return null;
  }

  switch (metric) {
    case "DeltaLwLowerBound":
      return source.DeltaLwLowerBound;
    case "LPrimeNTwUpperBound":
      return source.LPrimeNTwUpperBound;
    case "LPrimeNWUpperBound":
      return source.LPrimeNWUpperBound;
    case "LnWUpperBound":
      return source.LnWUpperBound;
  }
}

function compareImpactMetrics(
  mismatches: ImpactParityMismatch[],
  metrics: readonly ImpactMetricKey[] | undefined,
  local: ComparableImpact | null,
  upstream: UpstreamImpactParitySummary["impact"]
) {
  for (const metric of metrics ?? []) {
    pushNumericMismatch(
      mismatches,
      `impact.${metric}`,
      getImpactMetricValue(local, metric),
      getImpactMetricValue(upstream, metric)
    );
  }
}

function getImpactMetricBasisValue(
  source: ComparableImpact | UpstreamImpactParitySummary["impact"] | null | undefined,
  metric: ImpactMetricKey
): string | null {
  if (!source?.metricBasis) {
    return null;
  }

  return source.metricBasis[metric] ?? null;
}

function normalizeImpactMetricBasis(
  metric: ImpactMetricKey,
  rawBasis: string | null,
  context: { catalogId?: string | null } = {}
): string | null {
  if (!rawBasis) {
    return null;
  }

  if (context.catalogId) {
    if (
      metric === "DeltaLw" &&
      (rawBasis === "predictor_catalog_product_delta_official" || rawBasis === "predictor_explicit_delta_user_input")
    ) {
      return "delta_lw_product_or_explicit_equivalent";
    }

    if (
      metric === "LnW" &&
      (
        rawBasis === "predictor_catalog_product_delta_heavy_reference_derived" ||
        rawBasis === "predictor_explicit_delta_heavy_reference_derived"
      )
    ) {
      return "lnw_heavy_reference_delta_equivalent";
    }
  }

  return rawBasis;
}

function areFieldCarryBasesSemanticallyEquivalent(
  fixture: ImpactParityCase,
  localImpact: ComparableImpact | null,
  upstreamImpact: UpstreamImpactParitySummary["impact"]
): boolean {
  const comparedMetrics = fixture.compare.impactMetrics ?? [];
  const fieldOnlyMetrics =
    comparedMetrics.length > 0 &&
    comparedMetrics.every((metric) => metric === "LPrimeNW" || metric === "LPrimeNTw" || metric === "LPrimeNT50");

  if (!fieldOnlyMetrics) {
    return false;
  }

  const exactOrMixed = new Set([
    "open_measured_floor_system_exact_match",
    "peer_reviewed_floor_system_exact_match",
    "mixed_exact_plus_estimated_standardized_field_volume_normalization"
  ]);

  const localBasis = localImpact?.basis ?? null;
  const upstreamBasis = upstreamImpact?.basis ?? null;

  if (!localBasis || !upstreamBasis || !exactOrMixed.has(localBasis) || !exactOrMixed.has(upstreamBasis)) {
    return false;
  }

  const hasFieldCarryMetricBasis = (
    impact: ComparableImpact | UpstreamImpactParitySummary["impact"] | null | undefined
  ) =>
    ["LPrimeNW", "LPrimeNTw", "LPrimeNT50"].some((metric) =>
      typeof impact?.metricBasis?.[metric as ImpactMetricKey] === "string"
    );

  return hasFieldCarryMetricBasis(localImpact) && hasFieldCarryMetricBasis(upstreamImpact);
}

function compareLowerBoundMetrics(
  mismatches: ImpactParityMismatch[],
  metrics: readonly LowerBoundMetricKey[] | undefined,
  local: ComparableLowerBound | null,
  upstream: UpstreamImpactParitySummary["lowerBound"]
) {
  for (const metric of metrics ?? []) {
    pushNumericMismatch(
      mismatches,
      `lowerBound.${metric}`,
      getLowerBoundMetricValue(local, metric),
      getLowerBoundMetricValue(upstream, metric)
    );
  }
}

function compareImpactParityCase(
  fixture: ImpactParityCase,
  options: { upstreamPath?: string } = {}
): ImpactParityResult {
  const targetOutputs = (fixture.upstreamOptions?.targetOutputs ?? []) as RequestedOutputId[];
  const local = summarizeLocalResult(
    calculateAssembly(fixture.layers as LayerInput[], {
      ...(fixture.localOptions ?? {}),
      impactPredictorInput: fixture.localOptions?.impactPredictorInput,
      targetOutputs
    })
  );
  const upstream = runUpstreamImpactParityCase(fixture, options.upstreamPath);
  const mismatches: ImpactParityMismatch[] = [];

  compareImpactMetrics(mismatches, fixture.compare.impactMetrics, local.impact, upstream.impact);

  if (fixture.compare.compareImpactBasis) {
    const normalizedLocalBasis = normalizeBasis(local.impact?.basis ?? null, { catalogId: local.matchedCatalogId });
    const normalizedUpstreamBasis = normalizeBasis(upstream.impact?.basis ?? null, {
      catalogId: upstream.matchedCatalogCaseId ?? upstream.impact?.predictorCatalogCaseId
    });

    if (!areFieldCarryBasesSemanticallyEquivalent(fixture, local.impact, upstream.impact)) {
      pushStringMismatch(
        mismatches,
        "impact.basis",
        normalizedLocalBasis,
        normalizedUpstreamBasis
      );
    }

    for (const metric of fixture.compare.impactMetrics ?? []) {
      pushStringMismatch(
        mismatches,
        `impact.metricBasis.${metric}`,
        normalizeImpactMetricBasis(metric, getImpactMetricBasisValue(local.impact, metric), {
          catalogId: local.matchedCatalogId
        }),
        normalizeImpactMetricBasis(metric, getImpactMetricBasisValue(upstream.impact, metric), {
          catalogId: upstream.matchedCatalogCaseId ?? upstream.impact?.predictorCatalogCaseId
        })
      );
    }
  }

  if (fixture.compare.compareImpactEstimateCandidateIds) {
    pushStringArrayMismatch(
      mismatches,
      "impact.estimateCandidateIds",
      local.impact?.estimateCandidateIds,
      upstream.impact?.estimateCandidateIds
    );
  }

  compareLowerBoundMetrics(
    mismatches,
    fixture.compare.lowerBoundMetrics,
    local.lowerBound,
    upstream.lowerBound
  );

  if (fixture.compare.compareLowerBoundBasis) {
    pushStringMismatch(
      mismatches,
      "lowerBound.basis",
      normalizeBasis(local.lowerBound?.basis ?? null),
      normalizeBasis(upstream.lowerBound?.basis ?? null)
    );
  }

  if (fixture.compare.compareFloorMetrics) {
    pushNumericMismatch(mismatches, "floor.Rw", local.floor?.Rw, upstream.floor?.Rw);
    pushNumericMismatch(mismatches, "floor.RwCtr", local.floor?.RwCtr, upstream.floor?.RwCtr);
  }

  if (fixture.compare.compareCatalogId) {
    pushStringMismatch(
      mismatches,
      "matchedCatalogId",
      local.matchedCatalogId,
      upstream.matchedCatalogCaseId ?? upstream.impact?.predictorCatalogCaseId ?? null
    );
  }

  if (fixture.compare.compareFloorSystemId) {
    pushStringMismatch(mismatches, "matchedFloorSystemId", local.matchedFloorSystemId, upstream.matchedFloorSystemId);
  }

  return {
    fixture,
    local,
    mismatches,
    ok: mismatches.length === 0,
    upstream
  };
}

function formatMetrics(summary: LocalImpactParitySummary | UpstreamImpactParitySummary): string[] {
  const lines: string[] = [];

  if (summary.impact) {
    const impactParts = [
      summary.impact.basis ? `basis=${summary.impact.basis}` : null,
      typeof summary.impact.LnW === "number" ? `Ln,w=${roundForDisplay(summary.impact.LnW)}` : null,
      typeof summary.impact.CI === "number" ? `CI=${roundForDisplay(summary.impact.CI)}` : null,
      typeof summary.impact.CI50_2500 === "number" ? `CI,50-2500=${roundForDisplay(summary.impact.CI50_2500)}` : null,
      typeof summary.impact.LnWPlusCI === "number" ? `Ln,w+CI=${roundForDisplay(summary.impact.LnWPlusCI)}` : null,
      typeof summary.impact.DeltaLw === "number" ? `DeltaLw=${roundForDisplay(summary.impact.DeltaLw)}` : null,
      typeof summary.impact.LPrimeNW === "number" ? `L'n,w=${roundForDisplay(summary.impact.LPrimeNW)}` : null,
      typeof summary.impact.LPrimeNTw === "number" ? `L'nT,w=${roundForDisplay(summary.impact.LPrimeNTw)}` : null,
      typeof summary.impact.LPrimeNT50 === "number" ? `L'nT,50=${roundForDisplay(summary.impact.LPrimeNT50)}` : null,
      ...(summary.impact.metricBasis
        ? (Object.entries(summary.impact.metricBasis) as Array<[string, string | undefined]>)
            .filter(([, value]) => typeof value === "string")
            .map(([metric, value]) => `${metric}@${value}`)
        : [])
    ].filter(Boolean);
    lines.push(`impact: ${impactParts.join(" | ")}`);
  } else {
    lines.push("impact: null");
  }

  if ("lowerBound" in summary && summary.lowerBound) {
    const lowerParts = [
      summary.lowerBound.basis ? `basis=${summary.lowerBound.basis}` : null,
      typeof summary.lowerBound.LnWUpperBound === "number"
        ? `Ln,w<=${roundForDisplay(summary.lowerBound.LnWUpperBound)}`
        : null,
      typeof summary.lowerBound.DeltaLwLowerBound === "number"
        ? `DeltaLw>=${roundForDisplay(summary.lowerBound.DeltaLwLowerBound)}`
        : null,
      typeof summary.lowerBound.LPrimeNWUpperBound === "number"
        ? `L'n,w<=${roundForDisplay(summary.lowerBound.LPrimeNWUpperBound)}`
        : null,
      typeof summary.lowerBound.LPrimeNTwUpperBound === "number"
        ? `L'nT,w<=${roundForDisplay(summary.lowerBound.LPrimeNTwUpperBound)}`
        : null
    ].filter(Boolean);
    lines.push(`lower: ${lowerParts.join(" | ")}`);
  } else {
    lines.push("lower: null");
  }

  if ("floor" in summary && summary.floor) {
    const floorParts = [
      typeof summary.floor.Rw === "number" ? `Rw=${roundForDisplay(summary.floor.Rw)}` : null,
      typeof summary.floor.RwCtr === "number" ? `Rw+Ctr=${roundForDisplay(summary.floor.RwCtr)}` : null
    ].filter(Boolean);
    lines.push(`floor: ${floorParts.join(" | ")}`);
  } else {
    lines.push("floor: null");
  }

  return lines;
}

function printResult(result: ImpactParityResult) {
  console.log(`${result.fixture.id}: ${result.fixture.label}`);
  for (const line of formatMetrics(result.local)) {
    console.log(`  dynecho ${line}`);
  }
  for (const line of formatMetrics(result.upstream)) {
    console.log(`  upstream ${line}`);
  }

  if (result.local.matchedCatalogId || result.upstream.matchedCatalogCaseId) {
    console.log(
      `  catalog: dynecho=${result.local.matchedCatalogId ?? "null"} | upstream=${result.upstream.matchedCatalogCaseId ?? "null"}`
    );
  }

  if (result.local.matchedFloorSystemId || result.upstream.matchedFloorSystemId) {
    console.log(
      `  floor-system: dynecho=${result.local.matchedFloorSystemId ?? "null"} | upstream=${result.upstream.matchedFloorSystemId ?? "null"}`
    );
  }

  if (result.ok) {
    console.log("  status: ok");
    return;
  }

  console.log("  status: mismatch");
  for (const mismatch of result.mismatches) {
    console.log(`    ${mismatch.metric}: dynecho=${mismatch.actual} | upstream=${mismatch.expected}`);
  }
}

function main() {
  const args = parseCliArgs(process.argv.slice(2));
  const upstreamPath = getStringArg(args, "path");
  const caseId = getStringArg(args, "case");
  const selectedCases = caseId
    ? IMPACT_PARITY_CASES.filter((fixture) => fixture.id === caseId)
    : [...IMPACT_PARITY_CASES];

  if (selectedCases.length === 0) {
    throw new Error(`Unknown impact parity case: ${caseId}`);
  }

  const results = selectedCases.map((fixture) => compareImpactParityCase(fixture, { upstreamPath }));

  if (hasFlag(args, "json")) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    results.forEach((result, index) => {
      if (index > 0) {
        console.log("");
      }

      printResult(result);
    });
  }

  const failingCases = results.filter((result) => !result.ok);

  if (failingCases.length > 0) {
    process.exitCode = 1;
  }
}

main();

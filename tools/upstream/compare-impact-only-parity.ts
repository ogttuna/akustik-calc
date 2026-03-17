import { buildImpactPredictorInputFromLayerStack, calculateImpactOnly } from "@dynecho/engine";
import type {
  FloorSystemAirborneRatings,
  ImpactBoundCalculation,
  ImpactCalculation,
  ImpactOnlyCalculation,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { getStringArg, hasFlag, parseCliArgs } from "./cli";
import {
  IMPACT_ONLY_PARITY_CASES,
  type ImpactOnlyLowerBoundMetricKey,
  type ImpactOnlyMetricKey,
  type ImpactOnlyParityCase
} from "./fixtures/impact-only-parity-cases";
import { runUpstreamJson } from "./json";

type ComparableImpact = Pick<
  ImpactCalculation,
  "CI" | "CI50_2500" | "DeltaLw" | "LPrimeNT50" | "LPrimeNTw" | "LPrimeNW" | "LnW" | "LnWPlusCI" | "metricBasis"
>;
type ComparableLowerBound = Pick<
  ImpactBoundCalculation,
  "DeltaLwLowerBound" | "LPrimeNTwUpperBound" | "LPrimeNWUpperBound" | "LnWUpperBound"
>;

type ImpactOnlySummary = {
  floor: FloorSystemAirborneRatings | null;
  impact: (ComparableImpact & {
    basis: string | null;
    estimateCandidateIds: string[];
  }) | null;
  lowerBound: ComparableLowerBound | null;
  matchedFloorSystemId: string | null;
  supportedImpactOutputs: string[];
  unsupportedImpactOutputs: string[];
};

type Mismatch = {
  actual: string;
  expected: string;
  metric: string;
};

type ParityResult = {
  fixture: ImpactOnlyParityCase;
  local: ImpactOnlySummary;
  mismatches: Mismatch[];
  ok: boolean;
  upstream: ImpactOnlySummary;
};

const DEFAULT_TOLERANCE_DB = 0.1;

function roundForDisplay(value: number): string {
  return value.toFixed(1);
}

function summarizeLocal(result: ImpactOnlyCalculation): ImpactOnlySummary {
  return {
    floor: result.floorCarrier ?? result.floorSystemRatings ?? null,
    impact: result.impact
      ? {
          basis: result.impact.basis,
          CI: result.impact.CI,
          CI50_2500: result.impact.CI50_2500,
          DeltaLw: result.impact.DeltaLw,
          estimateCandidateIds: result.impact.estimateCandidateIds ?? [],
          LPrimeNT50: result.impact.LPrimeNT50,
          LPrimeNTw: result.impact.LPrimeNTw,
          LPrimeNW: result.impact.LPrimeNW,
          LnW: result.impact.LnW,
          LnWPlusCI: result.impact.LnWPlusCI,
          metricBasis: result.impact.metricBasis
        }
      : null,
    lowerBound: result.lowerBoundImpact
      ? {
          DeltaLwLowerBound: result.lowerBoundImpact.DeltaLwLowerBound,
          LPrimeNTwUpperBound: result.lowerBoundImpact.LPrimeNTwUpperBound,
          LPrimeNWUpperBound: result.lowerBoundImpact.LPrimeNWUpperBound,
          LnWUpperBound: result.lowerBoundImpact.LnWUpperBound
        }
      : null,
    matchedFloorSystemId:
      result.floorSystemMatch?.system.id ?? result.boundFloorSystemMatch?.system.id ?? null,
    supportedImpactOutputs: result.supportedImpactOutputs,
    unsupportedImpactOutputs: result.unsupportedImpactOutputs
  };
}

function runUpstreamImpactOnlyCase(
  fixture: ImpactOnlyParityCase,
  upstreamPath?: string
): ImpactOnlySummary {
  const script = `
    const core = require("./core.js");
    const payload = ${JSON.stringify({
      derivePredictorInputFromVisibleLayers: fixture.derivePredictorInputFromVisibleLayers ?? false,
      visibleLayers: fixture.visibleLayers,
      upstreamOptions: fixture.upstreamOptions
    })};
    const upstreamOptions = { ...payload.upstreamOptions };
    if (payload.derivePredictorInputFromVisibleLayers) {
      upstreamOptions.impactPredictorInput = core.buildImpactPredictorInputFromLayerStack(
        payload.visibleLayers,
        upstreamOptions.impactPredictorInput || {},
        upstreamOptions.assemblyMeta || {}
      );
    }
    const result = core.calculateImpactOnly(payload.visibleLayers, upstreamOptions);

    console.log(JSON.stringify({
      floor: result?.floorSystemRatings
        ? {
            Rw: typeof result.floorSystemRatings.Rw === "number" ? result.floorSystemRatings.Rw : null,
            RwCtr: typeof result.floorSystemRatings.RwCtr === "number" ? result.floorSystemRatings.RwCtr : null,
            RwCtrSemantic: typeof result.floorSystemRatings.RwCtrSemantic === "string" ? result.floorSystemRatings.RwCtrSemantic : null
          }
        : null,
      impact: result?.ratings?.impact
        ? {
            basis: typeof result.ratings.impact.basis === "string" ? result.ratings.impact.basis : null,
            CI: typeof result.ratings.impact.CI === "number" ? result.ratings.impact.CI : null,
            CI50_2500: typeof result.ratings.impact.CI50_2500 === "number" ? result.ratings.impact.CI50_2500 : null,
            DeltaLw: typeof result.ratings.impact.DeltaLw === "number" ? result.ratings.impact.DeltaLw : null,
            estimateCandidateIds: Array.isArray(result.ratings.impact.estimateCandidateIds)
              ? result.ratings.impact.estimateCandidateIds.filter((value) => typeof value === "string")
              : [],
            LPrimeNT50: typeof result.ratings.impact.LPrimeNT50 === "number" ? result.ratings.impact.LPrimeNT50 : null,
            LPrimeNTw: typeof result.ratings.impact.LPrimeNTw === "number" ? result.ratings.impact.LPrimeNTw : null,
            LPrimeNW: typeof result.ratings.impact.LPrimeNW === "number" ? result.ratings.impact.LPrimeNW : null,
            LnW: typeof result.ratings.impact.LnW === "number" ? result.ratings.impact.LnW : null,
            LnWPlusCI: typeof result.ratings.impact.LnWPlusCI === "number" ? result.ratings.impact.LnWPlusCI : null,
            metricBasis: result.ratings.impact.metricBasis && typeof result.ratings.impact.metricBasis === "object"
              ? {
                  CI: typeof result.ratings.impact.metricBasis.CI === "string" ? result.ratings.impact.metricBasis.CI : undefined,
                  CI50_2500: typeof result.ratings.impact.metricBasis.CI50_2500 === "string" ? result.ratings.impact.metricBasis.CI50_2500 : undefined,
                  DeltaLw: typeof result.ratings.impact.metricBasis.DeltaLw === "string" ? result.ratings.impact.metricBasis.DeltaLw : undefined,
                  LPrimeNT50:
                    typeof result.ratings.impact.metricBasis.LPrimeNT50 === "string"
                      ? result.ratings.impact.metricBasis.LPrimeNT50
                      : undefined,
                  LPrimeNTw:
                    typeof result.ratings.impact.metricBasis.LPrimeNTw === "string"
                      ? result.ratings.impact.metricBasis.LPrimeNTw
                      : undefined,
                  LPrimeNW:
                    typeof result.ratings.impact.metricBasis.LPrimeNW === "string"
                      ? result.ratings.impact.metricBasis.LPrimeNW
                      : undefined,
                  LnW: typeof result.ratings.impact.metricBasis.LnW === "string" ? result.ratings.impact.metricBasis.LnW : undefined,
                  LnWPlusCI: typeof result.ratings.impact.metricBasis.LnWPlusCI === "string" ? result.ratings.impact.metricBasis.LnWPlusCI : undefined
                }
              : null
          }
        : null,
      lowerBound: result?.impactPredictorStatus?.lowerBoundImpact
        ? {
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
      matchedFloorSystemId: typeof result?.impactPredictorStatus?.matchedFloorSystemId === "string"
        ? result.impactPredictorStatus.matchedFloorSystemId
        : null,
      supportedImpactOutputs: Array.isArray(result?.supportedImpactOutputs)
        ? result.supportedImpactOutputs.filter((value) => typeof value === "string")
        : [],
      unsupportedImpactOutputs: Array.isArray(result?.unsupportedImpactOutputs)
        ? result.unsupportedImpactOutputs.filter((value) => typeof value === "string")
        : []
    }));
  `;

  return runUpstreamJson<ImpactOnlySummary>(script, upstreamPath);
}

function pushNumericMismatch(
  mismatches: Mismatch[],
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

function pushStringMismatch(mismatches: Mismatch[], metric: string, localValue: string | null, upstreamValue: string | null) {
  if ((localValue ?? null) === (upstreamValue ?? null)) {
    return;
  }

  mismatches.push({
    actual: localValue ?? "null",
    expected: upstreamValue ?? "null",
    metric
  });
}

function getImpactMetricValue(
  source: ComparableImpact | null | undefined,
  metric: ImpactOnlyMetricKey
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
    case "LPrimeNT50":
      return source.LPrimeNT50;
    case "LPrimeNTw":
      return source.LPrimeNTw;
    case "LPrimeNW":
      return source.LPrimeNW;
    case "LnW":
      return source.LnW;
    case "LnWPlusCI":
      return source.LnWPlusCI;
  }
}

function getImpactMetricBasisValue(
  source: ComparableImpact | null | undefined,
  metric: ImpactOnlyMetricKey
): string | null {
  if (!source?.metricBasis) {
    return null;
  }

  return source.metricBasis[metric] ?? null;
}

function getLowerBoundMetricValue(
  source: ComparableLowerBound | null | undefined,
  metric: ImpactOnlyLowerBoundMetricKey
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

function compareCase(fixture: ImpactOnlyParityCase, options: { upstreamPath?: string } = {}): ParityResult {
  const targetOutputs = (fixture.upstreamOptions.targetOutputs ?? []) as RequestedOutputId[];
  const localImpactPredictorInput = fixture.derivePredictorInputFromVisibleLayers
    ? buildImpactPredictorInputFromLayerStack(
        fixture.visibleLayers as LayerInput[],
        fixture.localOptions?.impactPredictorInput ?? {},
        fixture.upstreamOptions.assemblyMeta
      )
    : fixture.localOptions?.impactPredictorInput;
  const local = summarizeLocal(
    calculateImpactOnly(fixture.visibleLayers as LayerInput[], {
      ...(fixture.localOptions ?? {}),
      impactPredictorInput: localImpactPredictorInput,
      targetOutputs
    })
  );
  const upstream = runUpstreamImpactOnlyCase(fixture, options.upstreamPath);
  const mismatches: Mismatch[] = [];

  for (const metric of fixture.compare.impactMetrics ?? []) {
    pushNumericMismatch(
      mismatches,
      `impact.${metric}`,
      getImpactMetricValue(local.impact, metric),
      getImpactMetricValue(upstream.impact, metric)
    );

    const upstreamMetricBasis = getImpactMetricBasisValue(upstream.impact, metric);
    if (upstreamMetricBasis !== null) {
      pushStringMismatch(
        mismatches,
        `impact.metricBasis.${metric}`,
        getImpactMetricBasisValue(local.impact, metric),
        upstreamMetricBasis
      );
    }
  }

  for (const metric of fixture.compare.lowerBoundMetrics ?? []) {
    pushNumericMismatch(
      mismatches,
      `lowerBound.${metric}`,
      getLowerBoundMetricValue(local.lowerBound, metric),
      getLowerBoundMetricValue(upstream.lowerBound, metric)
    );
  }

  if (fixture.compare.compareFloorMetrics) {
    pushNumericMismatch(mismatches, "floor.Rw", local.floor?.Rw, upstream.floor?.Rw);
    pushNumericMismatch(mismatches, "floor.RwCtr", local.floor?.RwCtr, upstream.floor?.RwCtr);
  }

  if (fixture.compare.compareFloorSystemId) {
    pushStringMismatch(mismatches, "matchedFloorSystemId", local.matchedFloorSystemId, upstream.matchedFloorSystemId);
  }

  if (fixture.compare.compareImpactBasis) {
    pushStringMismatch(mismatches, "impact.basis", local.impact?.basis ?? null, upstream.impact?.basis ?? null);
  }

  if (fixture.compare.compareImpactEstimateCandidateIds) {
    pushStringMismatch(
      mismatches,
      "impact.estimateCandidateIds",
      (local.impact?.estimateCandidateIds ?? []).join(","),
      (upstream.impact?.estimateCandidateIds ?? []).join(",")
    );
  }

  if (targetOutputs.length > 0) {
    pushStringMismatch(
      mismatches,
      "supportedImpactOutputs",
      local.supportedImpactOutputs.join(","),
      upstream.supportedImpactOutputs.join(",")
    );
    pushStringMismatch(
      mismatches,
      "unsupportedImpactOutputs",
      local.unsupportedImpactOutputs.join(","),
      upstream.unsupportedImpactOutputs.join(",")
    );
  }

  return {
    fixture,
    local,
    mismatches,
    ok: mismatches.length === 0,
    upstream
  };
}

function format(summary: ImpactOnlySummary): string[] {
  const lines: string[] = [];

  if (summary.impact) {
    lines.push(
      `impact: ${[
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
      ]
        .filter(Boolean)
        .join(" | ")}`
    );
  } else {
    lines.push("impact: null");
  }

  if (summary.impact?.estimateCandidateIds.length) {
    lines.push(`impact-candidates: ${summary.impact.estimateCandidateIds.join(", ")}`);
  }

  if (summary.lowerBound) {
    lines.push(
      `lower: ${[
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
      ]
        .filter(Boolean)
        .join(" | ")}`
    );
  } else {
    lines.push("lower: null");
  }

  if (summary.floor) {
    lines.push(
      `floor: ${[
        typeof summary.floor.Rw === "number" ? `Rw=${roundForDisplay(summary.floor.Rw)}` : null,
        typeof summary.floor.RwCtr === "number" ? `Rw+Ctr=${roundForDisplay(summary.floor.RwCtr)}` : null
      ]
        .filter(Boolean)
        .join(" | ")}`
    );
  } else {
    lines.push("floor: null");
  }

  return lines;
}

function printResult(result: ParityResult) {
  console.log(`${result.fixture.id}: ${result.fixture.label}`);
  for (const line of format(result.local)) {
    console.log(`  dynecho ${line}`);
  }
  for (const line of format(result.upstream)) {
    console.log(`  upstream ${line}`);
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
    ? IMPACT_ONLY_PARITY_CASES.filter((fixture) => fixture.id === caseId)
    : [...IMPACT_ONLY_PARITY_CASES];

  if (selectedCases.length === 0) {
    throw new Error(`Unknown impact-only parity case: ${caseId}`);
  }

  const results = selectedCases.map((fixture) => compareCase(fixture, { upstreamPath }));

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

  if (results.some((result) => !result.ok)) {
    process.exitCode = 1;
  }
}

main();

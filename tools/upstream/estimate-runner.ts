import { calculateAssembly } from "@dynecho/engine";
import type { AirborneCalculatorId } from "@dynecho/shared";

import { runUpstreamJson } from "./json";
import {
  parseDynechoLayerSpec,
  serializeLayerSpec,
  translateLayersForUpstream,
  type AppliedAlias
} from "./layer-spec";

export type UpstreamEstimateSummary = {
  calculator: string | null;
  calculatorLabel: string | null;
  error: string | null;
  ok: boolean;
  ratings: unknown;
  rw: number | null;
  surfaceMass: number | null;
  totalThicknessMm: number | null;
  warnings: string[];
};

export type EstimateComparison = {
  aliases: AppliedAlias[];
  delta: {
    rwDb: number | null;
    surfaceMassKgM2: number | null;
    thicknessMm: number | null;
  };
  dynecho: {
    estimatedRwDb: number;
    method: string;
    surfaceMassKgM2: number;
    thicknessMm: number;
    warnings: string[];
  };
  layerSpec: string;
  upstream: UpstreamEstimateSummary;
  upstreamLayerSpec: string;
};

export function runUpstreamEstimateFromSpec(
  layerSpec: string,
  options: { calculator?: string; upstreamPath?: string } = {}
): {
  aliases: AppliedAlias[];
  layerSpec: string;
  summary: UpstreamEstimateSummary;
  upstreamLayerSpec: string;
} {
  const layers = parseDynechoLayerSpec(layerSpec);
  const translated = translateLayersForUpstream(layers);
  const upstreamLayerSpec = serializeLayerSpec(translated.layers);
  const script = `
    const core = require("./core.js");
    const payload = ${JSON.stringify({
      calculator: options.calculator ?? null,
      layers: upstreamLayerSpec
    })};
    const layers = core.parseLayerSpec(payload.layers);
    const calculateOptions = payload.calculator ? { calculator: payload.calculator } : undefined;
    const result = core.calculateAssembly(layers, calculateOptions);

    console.log(JSON.stringify({
      calculator: result?.calculator ?? null,
      calculatorLabel: result?.calculatorLabel ?? null,
      error: result?.error ?? null,
      ok: Boolean(result?.ok),
      ratings: result?.ratings ?? null,
      rw: typeof result?.rw === "number" ? result.rw : null,
      surfaceMass: typeof result?.surfaceMass === "number" ? result.surfaceMass : null,
      totalThicknessMm: typeof result?.totalThicknessMm === "number" ? result.totalThicknessMm : null,
      warnings: Array.isArray(result?.warnings) ? result.warnings : []
    }));
  `;

  const summary = runUpstreamJson<UpstreamEstimateSummary>(script, options.upstreamPath);

  return {
    aliases: translated.aliases,
    layerSpec,
    summary,
    upstreamLayerSpec
  };
}

export function compareEstimateCase(
  layerSpec: string,
  options: { calculator?: string; upstreamPath?: string } = {}
): EstimateComparison {
  const localLayers = parseDynechoLayerSpec(layerSpec);
  const dynechoResult = calculateAssembly(localLayers, {
    calculator:
      options.calculator &&
      ["dynamic", "ks_rw_calibrated", "mass_law", "sharp", "kurtovic"].includes(options.calculator)
        ? (options.calculator as AirborneCalculatorId)
        : undefined
  });
  const upstreamResult = runUpstreamEstimateFromSpec(layerSpec, options);

  return {
    aliases: upstreamResult.aliases,
    delta: {
      rwDb:
        upstreamResult.summary.rw === null
          ? null
          : Number((dynechoResult.metrics.estimatedRwDb - upstreamResult.summary.rw).toFixed(1)),
      surfaceMassKgM2:
        upstreamResult.summary.surfaceMass === null
          ? null
          : Number((dynechoResult.metrics.surfaceMassKgM2 - upstreamResult.summary.surfaceMass).toFixed(1)),
      thicknessMm:
        upstreamResult.summary.totalThicknessMm === null
          ? null
          : Number((dynechoResult.metrics.totalThicknessMm - upstreamResult.summary.totalThicknessMm).toFixed(1))
    },
    dynecho: {
      estimatedRwDb: dynechoResult.metrics.estimatedRwDb,
      method: dynechoResult.metrics.method,
      surfaceMassKgM2: dynechoResult.metrics.surfaceMassKgM2,
      thicknessMm: dynechoResult.metrics.totalThicknessMm,
      warnings: dynechoResult.warnings
    },
    layerSpec,
    upstream: upstreamResult.summary,
    upstreamLayerSpec: upstreamResult.upstreamLayerSpec
  };
}

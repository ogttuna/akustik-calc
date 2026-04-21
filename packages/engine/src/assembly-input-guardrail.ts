// Assembly input guardrail — converts hostile assembly inputs (unknown
// materialId, invalid thicknessMm) into a deterministic fail-closed
// `AssemblyCalculation` with a specific warning instead of letting
// `LayerInputSchema.parse` or `resolveMaterial` throw. This is the
// single seam API / CLI / test callers hit when they bypass the
// workbench row normaliser; without the guard a malformed layer
// aborts the calculation entirely with a raw Zod or Error throw,
// which is hostile to downstream integrations.
//
// Two input classes are guarded:
//   - Unknown materialId (not present in the effective catalog)
//   - Invalid thicknessMm (NaN, Infinity, non-finite, ≤ 0, > MAX_MM)
//
// A fail-closed result still produces a valid `AssemblyCalculation`
// shape so that downstream UI / API code does not need guard branches.
// Every requested target output lands in `unsupportedTargetOutputs`
// and the specific reason surfaces through `warnings`.

import {
  type AirborneCalculator,
  type AssemblyCalculation,
  type LayerInput,
  type MaterialDefinition,
  type RequestedOutputId,
  type TransmissionLossCurve
} from "@dynecho/shared";

import { AIRBORNE_CALCULATORS } from "./airborne-calculator";
import { resolveMaterial } from "./material-catalog";

// Any thickness at or below zero, non-finite, or outside the widest
// imaginable physical range collapses to fail-closed. `MAX_THICKNESS_MM`
// picks 1e5 mm (100 m) which is comfortably above any real wall or
// floor assembly; the ceiling lives here so API callers get a
// specific "out of range" message rather than a Zod "invalid" one.
const MAX_THICKNESS_MM = 100_000;

function describeBadThickness(value: unknown): string {
  if (typeof value !== "number") return `non-numeric (${typeof value})`;
  if (Number.isNaN(value)) return "NaN";
  if (!Number.isFinite(value)) return "Infinity";
  if (value <= 0) return `${value} (must be > 0)`;
  return `${value} (must be ≤ ${MAX_THICKNESS_MM})`;
}

export type AssemblyInputGuardDecision =
  | { kind: "pass" }
  | { kind: "fail"; warnings: string[] };

export function evaluateAssemblyInputGuard(
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[]
): AssemblyInputGuardDecision {
  const warnings: string[] = [];

  layers.forEach((layer, index) => {
    const position = index + 1;
    const thickness = (layer as { thicknessMm?: unknown })?.thicknessMm;
    const thicknessIsValid =
      typeof thickness === "number" &&
      Number.isFinite(thickness) &&
      thickness > 0 &&
      thickness <= MAX_THICKNESS_MM;
    if (!thicknessIsValid) {
      warnings.push(
        `Layer ${position} has invalid thickness: ${describeBadThickness(thickness)}. Each layer's thicknessMm must be a finite positive number ≤ ${MAX_THICKNESS_MM} mm.`
      );
    }

    const materialId = (layer as { materialId?: unknown })?.materialId;
    if (typeof materialId !== "string" || materialId.length === 0) {
      warnings.push(
        `Layer ${position} has a missing or non-string materialId. Each layer must name a material present in the catalog.`
      );
      return;
    }

    // `resolveMaterial` walks the alias table first, so an input like
    // `silent` resolves to canonical `silentboard` before the catalog
    // hit check — mirroring that here keeps the guard in sync with
    // the downstream `resolveLayers` contract.
    try {
      resolveMaterial(materialId, catalog);
    } catch {
      warnings.push(
        `Layer ${position} references an unknown material: \`${materialId}\`. Add the material to the catalog or fix the layer before recalculating.`
      );
    }
  });

  if (warnings.length === 0) {
    return { kind: "pass" };
  }

  return { kind: "fail", warnings };
}

// Shape of a deterministic fail-closed `AssemblyCalculation`. All
// requested outputs land in `unsupportedTargetOutputs`; metrics
// collapse to zero so the schema stays happy; the curve is flat;
// warnings carry the specific reason.
export function buildFailClosedAssemblyResult(
  requestedTargetOutputs: readonly RequestedOutputId[],
  warnings: readonly string[],
  calculatorId?: string
): AssemblyCalculation {
  const frequenciesHz = [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150];
  const flatTransmissionLossDb = frequenciesHz.map(() => 0);
  const curve: TransmissionLossCurve = {
    frequenciesHz,
    transmissionLossDb: flatTransmissionLossDb
  };

  const availableCalculators: readonly AirborneCalculator[] = AIRBORNE_CALCULATORS;

  return {
    availableCalculators: [...availableCalculators],
    curve,
    floorSystemRecommendations: [],
    impact: null,
    layers: [],
    metrics: {
      airGapCount: 0,
      estimatedCDb: 0,
      estimatedCtrDb: 0,
      estimatedRwDb: 0,
      estimatedStc: 0,
      insulationCount: 0,
      method: "screening_mass_law_curve_seed_v3",
      surfaceMassKgM2: 0,
      totalThicknessMm: 0
    },
    ok: true,
    ratings: {
      astmE413: { STC: 0 },
      iso717: {
        C: 0,
        Ctr: 0,
        Rw: 0,
        composite: "0 (+0;+0)",
        descriptor: "Rw"
      }
    },
    supportedImpactOutputs: [],
    supportedTargetOutputs: [],
    targetOutputs: [...requestedTargetOutputs],
    unsupportedImpactOutputs: [],
    unsupportedTargetOutputs: [...requestedTargetOutputs],
    warnings: [...warnings],
    ...(calculatorId ? { calculatorId: calculatorId as AssemblyCalculation["calculatorId"] } : {})
  };
}

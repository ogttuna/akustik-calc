import type {
  AirborneAdvancedWallInput,
  DynamicAirborneTrace,
  ResolvedLayer,
  RequestedOutputId,
  TransmissionLossCurve
} from "@dynecho/shared";

import {
  calculateGateAYAdvancedWallRuntimeCorridor,
  type GateAYAdvancedWallRuntimeInput
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ay";
import { summarizeAirborneTopology } from "./airborne-topology";
import { buildCalibratedMassLawCurve, buildRatingsFromCurve } from "./curve-rating";
import type { DynamicAirborneOptions, DynamicAirborneResult } from "./dynamic-airborne-helpers";
import { PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_WARNING } from "./gate-ay-advanced-wall-runtime-constants";

function isAdvancedWallRoute(input: AirborneAdvancedWallInput | undefined): input is AirborneAdvancedWallInput {
  return Boolean(
    input &&
      (
        input.wallSolverIntent === "advanced_source_absent_wall" ||
        (Array.isArray(input.panels) && input.panels.length > 0) ||
        (Array.isArray(input.cavities) && input.cavities.length > 0) ||
        input.openingIntent ||
        input.frameCoupling
      )
  );
}

function targetOutputsFor(options: DynamicAirborneOptions, input: AirborneAdvancedWallInput): RequestedOutputId[] {
  if (input.targetOutputs && input.targetOutputs.length > 0) {
    return [...input.targetOutputs];
  }

  if (options.targetOutputs && options.targetOutputs.length > 0) {
    return [...options.targetOutputs];
  }

  return ["Rw", "STC", "C", "Ctr"];
}

function normalizeGateAYInput(
  options: DynamicAirborneOptions,
  input: AirborneAdvancedWallInput
): GateAYAdvancedWallRuntimeInput {
  const frequencyBandSet =
    input.frequencyBandSet === "third_octave_100_3150" ? input.frequencyBandSet : undefined;

  return {
    ...input,
    frequencyBandSet,
    outputBasis: input.outputBasis ?? options.airborneContext?.contextMode ?? "element_lab",
    targetOutputs: targetOutputsFor(options, input)
  };
}

function totalSurfaceMass(layers: readonly ResolvedLayer[]): number {
  return layers.reduce((sum, layer) => sum + layer.surfaceMassKgM2, 0);
}

function fallbackCurve(layers: readonly ResolvedLayer[], options: DynamicAirborneOptions): TransmissionLossCurve {
  return buildCalibratedMassLawCurve(
    Math.max(totalSurfaceMass(layers), 1),
    options.screeningEstimatedRwDb,
    options.frequenciesHz
  );
}

function buildTrace(input: {
  curve: TransmissionLossCurve;
  layers: readonly ResolvedLayer[];
  options: DynamicAirborneOptions;
  promoted: boolean;
  runtimeInput: GateAYAdvancedWallRuntimeInput;
  selectedRwDb: number;
  statusNote: string;
}): DynamicAirborneTrace {
  const topology = summarizeAirborneTopology(input.layers);
  const cavityCount = input.runtimeInput.cavities?.length ?? topology.cavityCount;
  const visibleLeafCount = input.runtimeInput.panels?.length ?? topology.visibleLeafCount;
  const surfaceMassKgM2 =
    input.runtimeInput.panels?.reduce((sum, panel) => sum + (panel.surfaceMassKgM2 ?? 0), 0) ??
    topology.surfaceMassKgM2;
  const totalGapThicknessMm =
    input.runtimeInput.cavities?.reduce((sum, cavity) => sum + (cavity.depthMm ?? 0), 0) ??
    topology.totalGapThicknessMm;
  const hasPorousFill =
    topology.hasPorousFill ||
    Boolean(
      input.runtimeInput.cavities?.some(
        (cavity) => (cavity.absorberThicknessMm ?? 0) > 0 || (cavity.absorberCoverageRatio ?? 0) > 0
      )
    );
  const selectedMethod = input.promoted ? "sharp" : "screening_mass_law_curve_seed_v3";

  return {
    adjustmentDb: 0,
    candidateMethods: [
      {
        label: input.promoted
          ? "Gate AY advanced wall direct-curve corridor"
          : "Screening curve while Gate AY advanced wall inputs are incomplete",
        method: selectedMethod,
        rwDb: input.selectedRwDb,
        selected: true
      }
    ],
    cavityCount,
    confidenceClass: input.promoted ? "high" : "low",
    confidenceScore: input.promoted ? 0.84 : 0.38,
    detectedFamily: "multileaf_multicavity",
    detectedFamilyLabel: "Multi-Leaf / Multi-Cavity",
    hasPorousFill,
    hasStudLikeSupport: input.runtimeInput.frameCoupling !== undefined || topology.hasStudLikeSupport,
    notes: [
      input.statusNote,
      input.promoted
        ? "Gate AY uses explicit advanced-wall input-surface ownership instead of flat-list multi-cavity auto grouping."
        : "Gate AY did not promote a design-grade advanced-wall value because the runtime input boundary is still blocked."
    ],
    originalSolidLayerCount: topology.originalSolidLayerCount,
    porousLayerCount:
      input.runtimeInput.cavities?.filter((cavity) => (cavity.absorberThicknessMm ?? 0) > 0).length ??
      topology.porousLayerCount,
    selectedLabel: input.promoted
      ? "Gate AY advanced wall source-absent runtime corridor"
      : "Gate AY advanced wall input boundary",
    selectedMethod,
    solverSpreadRwDb: 0,
    strategy: input.promoted
      ? "gate_ay_advanced_wall_direct_curve_runtime_corridor"
      : "gate_ay_advanced_wall_input_boundary",
    supportLayerCount: input.runtimeInput.frameCoupling !== undefined ? 1 : topology.supportLayerCount,
    surfaceMassKgM2: Math.max(surfaceMassKgM2, 0),
    totalGapThicknessMm: Math.max(totalGapThicknessMm, 0),
    visibleLeafCount
  };
}

export function maybeCalculateGateAYAdvancedWallRuntime(input: {
  layers: readonly ResolvedLayer[];
  options: DynamicAirborneOptions;
}): DynamicAirborneResult | null {
  const advancedWall = input.options.airborneContext?.advancedWall;
  if (!isAdvancedWallRoute(advancedWall)) {
    return null;
  }

  const runtimeInput = normalizeGateAYInput(input.options, advancedWall);
  const runtimeResult = calculateGateAYAdvancedWallRuntimeCorridor(runtimeInput);

  if (
    runtimeResult.status === "exact_source_precedence" ||
    runtimeResult.status === "delegated_to_existing_owned_route"
  ) {
    return null;
  }

  const curve = runtimeResult.curve ?? fallbackCurve(input.layers, input.options);
  const ratings = runtimeResult.ratings ?? buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb);
  const rw = runtimeResult.metrics?.Rw ?? ratings.iso717.Rw;
  const promoted = runtimeResult.status === "runtime_corridor_promoted";
  const warning =
    runtimeResult.warning ??
    (promoted ? PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_RUNTIME_WARNING : null);

  return {
    airborneBasis: runtimeResult.basis ?? undefined,
    airborneCandidateResolution: runtimeResult.airborneCandidateResolution ?? undefined,
    curve,
    id: "dynamic",
    label: promoted
      ? "Gate AY Advanced Wall Source-Absent Runtime"
      : "Gate AY Advanced Wall Input Boundary",
    ratings,
    rw,
    trace: buildTrace({
      curve,
      layers: input.layers,
      options: input.options,
      promoted,
      runtimeInput,
      selectedRwDb: rw,
      statusNote:
        runtimeResult.warning ??
        `Gate AY advanced wall runtime status: ${runtimeResult.status}.`
    }),
    warnings: warning ? [warning] : []
  };
}

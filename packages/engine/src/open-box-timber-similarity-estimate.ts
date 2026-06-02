import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import {
  ImpactCalculationSchema,
  type ExactFloorSystem,
  type FloorSystemEstimateResult,
  type ImpactCalculation,
  type ImpactErrorBudget,
  type ImpactErrorBudgetTerm,
  type RequestedOutputId,
  type ResolvedLayer
} from "@dynecho/shared";

import {
  evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor,
  type BroadAccuracyFloorOpenBoxTimberErrorBudget,
  type BroadAccuracyFloorOpenBoxTimberErrorBudgetTerm,
  type BroadAccuracyFloorOpenBoxTimberFormulaMetricId
} from "./broad-accuracy-floor-open-box-timber-similarity-formula-corridor";
import type { BroadAccuracyFloorOpenBoxTimberPackageId } from "./broad-accuracy-floor-open-box-timber-similarity-transfer-owner";
import {
  evaluateMatchedFloorSystem,
  fitPercentFromEvaluation
} from "./floor-system-evaluation";
import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { ksRound1, round1 } from "./math";

export const OPEN_BOX_TIMBER_SIMILARITY_BASIS =
  "broad_accuracy_floor_open_box_timber_similarity_package_transfer_formula_corridor";

type RuntimeImpactFormulaMetricId = Extract<
  BroadAccuracyFloorOpenBoxTimberFormulaMetricId,
  "CI" | "CI,50-2500" | "Ln,w" | "Ln,w+CI"
>;
type RuntimeImpactFormulaMetricKey = keyof Pick<ImpactCalculation, "CI" | "CI50_2500" | "LnW" | "LnWPlusCI">;
type OpenBoxLowerFamily = "reinforced" | "tuas_family_a" | "tuas_family_b";

type OpenBoxTimberTopology = {
  boardSchedule: string;
  lowerFamily: OpenBoxLowerFamily;
  packageId: BroadAccuracyFloorOpenBoxTimberPackageId;
  upperPackageLabel: string;
};

const RUNTIME_TARGET_OUTPUTS = new Set<RequestedOutputId>([
  "Rw",
  "C",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
]);

function layersForRole(
  layers: readonly ResolvedLayer[],
  floorRole: ResolvedLayer["floorRole"]
): readonly ResolvedLayer[] {
  return layers.filter((layer) => layer.floorRole === floorRole);
}

function getOnlyLayer(
  layers: readonly ResolvedLayer[],
  floorRole: ResolvedLayer["floorRole"]
): ResolvedLayer | null {
  const matching = layersForRole(layers, floorRole);

  return matching.length === 1 ? matching[0] ?? null : null;
}

function thicknessNear(value: number | undefined, target: number, tolerance = 3): boolean {
  return typeof value === "number" && Number.isFinite(value) && Math.abs(value - target) <= tolerance;
}

function thicknessInBand(value: number | undefined, min: number, max: number): boolean {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

function hasDuplicateSingleEntryRoles(layers: readonly ResolvedLayer[]): boolean {
  return ([
    "base_structure",
    "ceiling_cavity",
    "ceiling_fill",
    "floor_covering",
    "floating_screed",
    "resilient_layer",
    "upper_fill"
  ] as const).some((role) => layersForRole(layers, role).length > 1);
}

function detectLowerFamily(layers: readonly ResolvedLayer[]): {
  readonly boardSchedule: string;
  readonly lowerFamily: OpenBoxLowerFamily;
} | null {
  const ceilingBoards = layersForRole(layers, "ceiling_board");
  const ceilingFill = getOnlyLayer(layers, "ceiling_fill");
  const ceilingCavity = getOnlyLayer(layers, "ceiling_cavity");

  if (
    ceilingBoards.length < 2 ||
    !ceilingFill ||
    ceilingFill.material.id !== "rockwool" ||
    !thicknessNear(ceilingFill.thicknessMm, 100, 12) ||
    !ceilingCavity ||
    !thicknessInBand(ceilingCavity.thicknessMm, 20, 40) ||
    ceilingBoards.some((layer) => layer.material.id !== "gypsum_board")
  ) {
    return null;
  }

  const schedule = ceilingBoards.map((layer) => ksRound1(layer.thicknessMm)).sort((a, b) => a - b);
  const scheduleLabel = schedule.join("+");
  const isBasicBoardSchedule =
    ceilingBoards.length === 2 && ceilingBoards.every((layer) => thicknessNear(layer.thicknessMm, 13, 1.5));
  const isReinforcedBoardSchedule =
    ceilingBoards.length >= 4 && ceilingBoards.every((layer) => thicknessInBand(layer.thicknessMm, 12, 16));

  if (!isBasicBoardSchedule && !isReinforcedBoardSchedule) {
    return null;
  }

  if (isReinforcedBoardSchedule) {
    return {
      boardSchedule: `${ceilingBoards.length}x gypsum (${scheduleLabel} mm)`,
      lowerFamily: "reinforced"
    };
  }

  if (ceilingCavity.material.id === "tuas_open_box_ceiling_family_a") {
    return {
      boardSchedule: "2x13 gypsum",
      lowerFamily: "tuas_family_a"
    };
  }

  if (ceilingCavity.material.id === "resilient_stud_ceiling") {
    return {
      boardSchedule: "2x13 gypsum",
      lowerFamily: "tuas_family_b"
    };
  }

  return null;
}

function detectPackageId(layers: readonly ResolvedLayer[], lowerFamily: OpenBoxLowerFamily): {
  readonly packageId: BroadAccuracyFloorOpenBoxTimberPackageId;
  readonly upperPackageLabel: string;
} | null {
  const upperFill = getOnlyLayer(layers, "upper_fill");
  const floatingScreed = getOnlyLayer(layers, "floating_screed");

  if (!upperFill && !floatingScreed) {
    return lowerFamily === "reinforced"
      ? {
          packageId: "reinforced_ceiling_laminate",
          upperPackageLabel: "no upper package with reinforced lower board schedule"
        }
      : {
          packageId: "thin_laminate_eps_no_upper",
          upperPackageLabel: "thin laminate + EPS finish without upper package"
        };
  }

  if (!upperFill || !floatingScreed) {
    return null;
  }

  if (
    upperFill.material.id === "generic_fill" &&
    floatingScreed.material.id === "dry_floating_gypsum_fiberboard" &&
    thicknessInBand(upperFill.thicknessMm, 13, 55) &&
    thicknessInBand(floatingScreed.thicknessMm, 30, 65)
  ) {
    return {
      packageId: "dry_gypsum_fiber_upper",
      upperPackageLabel: `${ksRound1(upperFill.thicknessMm)} mm generic fill + ${ksRound1(
        floatingScreed.thicknessMm
      )} mm dry gypsum-fiber floor`
    };
  }

  if (upperFill.material.id === "eps_floor_insulation_board" || floatingScreed.material.id === "screed") {
    return {
      packageId: "eps_screed_or_hybrid_upper",
      upperPackageLabel: "EPS/screed or hybrid exact-only upper package"
    };
  }

  return {
    packageId: "mixed_staged_upper",
    upperPackageLabel: "mixed staged upper package"
  };
}

function detectOpenBoxTimberTopology(layers: readonly ResolvedLayer[]): OpenBoxTimberTopology | null {
  if (hasDuplicateSingleEntryRoles(layers)) {
    return null;
  }

  const base = getOnlyLayer(layers, "base_structure");
  const floorCovering = getOnlyLayer(layers, "floor_covering");
  const resilientLayer = getOnlyLayer(layers, "resilient_layer");
  const lowerFamily = detectLowerFamily(layers);

  if (
    !base ||
    base.material.id !== "open_box_timber_slab" ||
    !thicknessNear(base.thicknessMm, 370, 4) ||
    !floorCovering ||
    floorCovering.material.id !== "laminate_flooring" ||
    !thicknessNear(floorCovering.thicknessMm, 8, 2) ||
    !resilientLayer ||
    resilientLayer.material.id !== "eps_underlay" ||
    !thicknessNear(resilientLayer.thicknessMm, 3, 1.5) ||
    !lowerFamily
  ) {
    return null;
  }

  const packageInfo = detectPackageId(layers, lowerFamily.lowerFamily);
  if (!packageInfo) {
    return null;
  }

  return {
    ...lowerFamily,
    ...packageInfo
  };
}

function isRuntimeImpactFormulaMetricId(
  metricId: BroadAccuracyFloorOpenBoxTimberFormulaMetricId
): metricId is RuntimeImpactFormulaMetricId {
  return metricId === "CI" || metricId === "CI,50-2500" || metricId === "Ln,w" || metricId === "Ln,w+CI";
}

function formulaMetricKey(metricId: RuntimeImpactFormulaMetricId): RuntimeImpactFormulaMetricKey {
  switch (metricId) {
    case "CI":
      return "CI";
    case "CI,50-2500":
      return "CI50_2500";
    case "Ln,w":
      return "LnW";
    case "Ln,w+CI":
      return "LnWPlusCI";
  }
}

function budgetTermReason(term: BroadAccuracyFloorOpenBoxTimberErrorBudgetTerm): string {
  switch (term.termId) {
    case "source_table_rounding":
      return "TUAS packet ratings are source-table single-number values, so unrounded residuals are not owned.";
    case "same_lab_packet_spread_residual":
      return "The runtime value is a same-family packet-transfer estimate rather than a measurement of this exact stack.";
    case "lower_ceiling_family_transfer":
      return "Lower ceiling family A/B and reinforced board effects are represented as a bounded same-family transfer.";
    case "upper_package_interaction_simplification":
      return "Upper package interaction is simplified to the clean predictor-owned packet family.";
    case "exact_only_hybrid_transfer_blocker":
      return "Hybrid/staged exact-only packet behavior is deliberately excluded from this runtime corridor.";
  }
}

function toImpactErrorBudget(
  budget: BroadAccuracyFloorOpenBoxTimberErrorBudget,
  estimate: number
): ImpactErrorBudget {
  const terms: ImpactErrorBudgetTerm[] = budget.terms.map((term) => ({
    db: term.db,
    origin: term.basis,
    reason: budgetTermReason(term),
    termId: term.termId,
    tightenRequires: [...term.tightenRequires]
  }));

  return {
    estimate,
    max: ksRound1(estimate + budget.totalBudgetDb),
    metricId: budget.metricId,
    min: ksRound1(estimate - budget.totalBudgetDb),
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    terms,
    toleranceDb: budget.totalBudgetDb,
    totalBudgetDb: budget.totalBudgetDb
  };
}

function buildRuntimeBudgets(input: {
  budgets: readonly BroadAccuracyFloorOpenBoxTimberErrorBudget[];
  impact: Pick<ImpactCalculation, "CI" | "CI50_2500" | "LnW" | "LnWPlusCI">;
}): ImpactErrorBudget[] {
  return input.budgets.flatMap((budget) => {
    if (!isRuntimeImpactFormulaMetricId(budget.metricId)) {
      return [];
    }

    const key = formulaMetricKey(budget.metricId);
    const estimate = input.impact[key];

    return typeof estimate === "number" ? [toImpactErrorBudget(budget, estimate)] : [];
  });
}

function sourceRowsByIds(ids: readonly string[]): ExactFloorSystem[] {
  return ids.flatMap((id) => {
    const row = EXACT_FLOOR_SYSTEMS.find((system) => system.id === id);

    return row ? [row] : [];
  });
}

function buildSourceNotes(rows: readonly ExactFloorSystem[], layers: readonly ResolvedLayer[]): string {
  return rows
    .map((row) => {
      const fitPercent = fitPercentFromEvaluation(evaluateMatchedFloorSystem(layers, row));
      return `${row.label} (${fitPercent}% fit)`;
    })
    .join("; ");
}

function lowerFamilyLabel(family: OpenBoxLowerFamily): string {
  switch (family) {
    case "reinforced":
      return "reinforced lower board schedule";
    case "tuas_family_a":
      return "TUAS open-box ceiling family A";
    case "tuas_family_b":
      return "resilient stud ceiling family B";
  }
}

function uniqueRequestedOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return [...new Set(outputs)];
}

function formulaTargetOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  const mapped = outputs.flatMap((output) => {
    switch (output) {
      case "C":
      case "R'w":
      case "Dn,w":
      case "Dn,A":
      case "DnT,w":
      case "DnT,A":
        return ["Rw" as const];
      case "L'n,w":
      case "L'nT,w":
        return ["Ln,w" as const];
      case "L'nT,50":
        return ["Ln,w" as const, "CI,50-2500" as const];
      default:
        return [output];
    }
  });

  return uniqueRequestedOutputs(mapped);
}

export function deriveOpenBoxTimberSimilarityEstimate(input: {
  layers: readonly ResolvedLayer[];
  targetOutputs?: readonly RequestedOutputId[];
}): FloorSystemEstimateResult | null {
  const requestedOutputs = input.targetOutputs && input.targetOutputs.length > 0
    ? input.targetOutputs
    : (["Rw", "Ln,w"] as const);

  if (!requestedOutputs.some((output) => RUNTIME_TARGET_OUTPUTS.has(output))) {
    return null;
  }

  const topology = detectOpenBoxTimberTopology(input.layers);
  if (!topology) {
    return null;
  }

  const evaluation = evaluateBroadAccuracyFloorOpenBoxTimberSimilarityFormulaCorridor({
    finishPairState: "complete_laminate_eps",
    packageId: topology.packageId,
    roleTopologyState: "source_equivalent",
    supportFamily: "open_box_timber",
    targetOutputs: formulaTargetOutputs(requestedOutputs)
  });

  if (
    evaluation.corridorStatus !== "formula_corridor_defined_runtime_gate_required" ||
    evaluation.affectedFormulaOutputs.length === 0 ||
    typeof evaluation.designMetrics.CI !== "number" ||
    typeof evaluation.designMetrics.CI50_2500 !== "number" ||
    typeof evaluation.designMetrics.LnW !== "number" ||
    typeof evaluation.designMetrics.LnWPlusCI !== "number" ||
    typeof evaluation.designMetrics.Rw !== "number" ||
    typeof evaluation.designMetrics.RwPlusC !== "number"
  ) {
    return null;
  }

  const rows = sourceRowsByIds(evaluation.anchorSourceIds);
  if (rows.length === 0) {
    return null;
  }

  const impactValues = {
    CI: evaluation.designMetrics.CI,
    CI50_2500: evaluation.designMetrics.CI50_2500,
    LnW: evaluation.designMetrics.LnW,
    LnWPlusCI: evaluation.designMetrics.LnWPlusCI
  };
  const impact = ImpactCalculationSchema.parse({
    ...impactValues,
    availableOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    basis: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    confidence: getImpactConfidenceForBasis(OPEN_BOX_TIMBER_SIMILARITY_BASIS),
    errorBudgets: buildRuntimeBudgets({
      budgets: evaluation.toleranceBudgets,
      impact: impactValues
    }),
    estimateCandidateIds: evaluation.anchorSourceIds,
    labOrField: "lab",
    metricBasis: buildUniformImpactMetricBasis(impactValues, OPEN_BOX_TIMBER_SIMILARITY_BASIS),
    notes: [
      `Open-box timber similarity runtime selected the TUAS ${topology.packageId.replaceAll("_", " ")} packet.`,
      `Current support is the 370 mm open-box timber slab with ${lowerFamilyLabel(topology.lowerFamily)} and ${topology.boardSchedule}.`,
      `Upper package: ${topology.upperPackageLabel}.`,
      `Source rows: ${buildSourceNotes(rows, input.layers)}.`,
      "This is a narrow source-absent lab packet-transfer corridor; field outputs require the explicit impactFieldContext adapter, airborne building outputs require the explicit building-context adapter, and ASTM/IIC bridges remain separate."
    ],
    scope: "family_estimate"
  });
  const fitPercent = round1(
    rows.reduce((sum, row) => sum + fitPercentFromEvaluation(evaluateMatchedFloorSystem(input.layers, row)), 0) /
      rows.length
  );

  return {
    airborneRatings: {
      Rw: evaluation.designMetrics.Rw,
      RwCtr: evaluation.designMetrics.RwPlusC,
      RwCtrSemantic: "rw_plus_c"
    },
    fitPercent,
    impact,
    kind: "family_archetype",
    notes: [
      `Open-box timber ${topology.packageId.replaceAll("_", " ")} runtime selected ${rows.length} same-family TUAS anchors.`,
      `Lower family ${lowerFamilyLabel(topology.lowerFamily)}, board schedule ${topology.boardSchedule}.`,
      `Source rows: ${evaluation.anchorSourceIds.join(", ")}.`
    ],
    sourceSystems: rows,
    structuralFamily: "open-box timber"
  };
}

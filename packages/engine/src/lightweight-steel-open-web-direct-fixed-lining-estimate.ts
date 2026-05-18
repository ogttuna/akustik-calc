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
  evaluateBroadAccuracyFloorOpenWebDirectFixedLiningFormulaCorridor,
  type BroadAccuracyFloorOpenWebDirectFixedBoardSchedule,
  type BroadAccuracyFloorOpenWebDirectFixedErrorBudget,
  type BroadAccuracyFloorOpenWebDirectFixedErrorBudgetTerm,
  type BroadAccuracyFloorOpenWebDirectFixedFinishPackage,
  type BroadAccuracyFloorOpenWebDirectFixedFormulaMetricId
} from "./broad-accuracy-floor-open-web-direct-fixed-lining-formula-corridor";
import {
  evaluateMatchedFloorSystem,
  fitPercentFromEvaluation
} from "./floor-system-evaluation";
import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { ksRound1, round1 } from "./math";

export const OPEN_WEB_DIRECT_FIXED_LINING_BASIS =
  "broad_accuracy_floor_open_web_direct_fixed_lining_direct_source_interpolation_formula_corridor";

type DirectFixedFinishPackage = BroadAccuracyFloorOpenWebDirectFixedFinishPackage;
type RuntimeImpactFormulaMetricId = Extract<
  BroadAccuracyFloorOpenWebDirectFixedFormulaMetricId,
  "CI" | "Ln,w" | "Ln,w+CI"
>;
type RuntimeImpactFormulaMetricKey = keyof Pick<ImpactCalculation, "CI" | "LnW" | "LnWPlusCI">;

type DirectFixedTopology = {
  boardSchedule: BroadAccuracyFloorOpenWebDirectFixedBoardSchedule;
  boardThicknessMm: number;
  carrierDepthMm: number;
  deckThicknessMm: 16 | 19;
  finishPackage: DirectFixedFinishPackage;
};

const FORMULA_OUTPUTS = new Set<RequestedOutputId>(["Rw", "Ln,w", "CI", "Ln,w+CI"]);

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

function thicknessNear(value: number, target: number, tolerance = 1.5): boolean {
  return Math.abs(value - target) <= tolerance;
}

function detectBoardSchedule(
  ceilingBoards: readonly ResolvedLayer[]
): { boardSchedule: BroadAccuracyFloorOpenWebDirectFixedBoardSchedule; boardThicknessMm: number } | null {
  if (
    ![2, 3].includes(ceilingBoards.length) ||
    ceilingBoards.some((layer) => layer.material.id !== "firestop_board")
  ) {
    return null;
  }

  const boardThicknessMm =
    ceilingBoards.reduce((sum, layer) => sum + layer.thicknessMm, 0) / ceilingBoards.length;

  if (ceilingBoards.length === 2 && thicknessNear(boardThicknessMm, 13)) {
    return { boardSchedule: "2x13", boardThicknessMm };
  }

  if (ceilingBoards.length === 2 && thicknessNear(boardThicknessMm, 16)) {
    return { boardSchedule: "2x16", boardThicknessMm };
  }

  if (ceilingBoards.length === 3 && thicknessNear(boardThicknessMm, 16)) {
    return { boardSchedule: "3x16", boardThicknessMm };
  }

  return null;
}

function detectDeckThickness(deck: ResolvedLayer): 16 | 19 | null {
  if (thicknessNear(deck.thicknessMm, 16)) {
    return 16;
  }

  if (thicknessNear(deck.thicknessMm, 19)) {
    return 19;
  }

  return null;
}

function detectFinishPackage(layers: readonly ResolvedLayer[]): DirectFixedFinishPackage | null {
  const floorCoverings = layersForRole(layers, "floor_covering");

  if (floorCoverings.length === 0) {
    return "bare";
  }

  if (floorCoverings.length !== 1) {
    return null;
  }

  const materialId = floorCoverings[0]?.material.id;

  if (
    materialId === "carpet_with_foam_underlay" ||
    materialId === "engineered_timber_with_acoustic_underlay"
  ) {
    return materialId;
  }

  return null;
}

function hasUnsupportedDirectFixedRoles(layers: readonly ResolvedLayer[]): boolean {
  return layers.some((layer) =>
    layer.floorRole === "ceiling_cavity" ||
    layer.floorRole === "ceiling_fill" ||
    layer.floorRole === "resilient_layer" ||
    layer.floorRole === "upper_fill"
  );
}

function detectDirectFixedTopology(layers: readonly ResolvedLayer[]): DirectFixedTopology | null {
  if (hasUnsupportedDirectFixedRoles(layers)) {
    return null;
  }

  const base = getOnlyLayer(layers, "base_structure");
  const floatingDeck = getOnlyLayer(layers, "floating_screed");
  const board = detectBoardSchedule(layersForRole(layers, "ceiling_board"));
  const finishPackage = detectFinishPackage(layers);

  if (
    !base ||
    base.material.id !== "open_web_steel_floor" ||
    !floatingDeck ||
    floatingDeck.material.id !== "inex_floor_panel" ||
    !board ||
    !finishPackage ||
    !Number.isFinite(base.thicknessMm) ||
    !Number.isFinite(floatingDeck.thicknessMm)
  ) {
    return null;
  }

  const deckThicknessMm = detectDeckThickness(floatingDeck);

  if (!deckThicknessMm) {
    return null;
  }

  return {
    boardSchedule: board.boardSchedule,
    boardThicknessMm: board.boardThicknessMm,
    carrierDepthMm: base.thicknessMm,
    deckThicknessMm,
    finishPackage
  };
}

function sourceRowsByIds(ids: readonly string[]): ExactFloorSystem[] {
  return ids.flatMap((id) => {
    const row = EXACT_FLOOR_SYSTEMS.find((system) => system.id === id);

    return row ? [row] : [];
  });
}

function isRuntimeImpactFormulaMetricId(
  metricId: BroadAccuracyFloorOpenWebDirectFixedFormulaMetricId
): metricId is RuntimeImpactFormulaMetricId {
  return metricId === "CI" || metricId === "Ln,w" || metricId === "Ln,w+CI";
}

function formulaMetricKey(metricId: RuntimeImpactFormulaMetricId): RuntimeImpactFormulaMetricKey {
  switch (metricId) {
    case "CI":
      return "CI";
    case "Ln,w":
      return "LnW";
    case "Ln,w+CI":
      return "LnWPlusCI";
  }
}

function budgetTermReason(term: BroadAccuracyFloorOpenWebDirectFixedErrorBudgetTerm): string {
  switch (term.termId) {
    case "source_table_rounding":
      return "Source table values are published as rounded single-number ratings.";
    case "direct_fixed_grid_interpolation_residual":
      return "The runtime value is interpolated between direct-fixed source rows rather than measured at this exact carrier depth.";
    case "support_spacing_assumption":
      return "The source grid owns the 450 mm centre assumption, while the layer stack carries carrier depth only.";
    case "direct_lining_bridge_simplification":
      return "Direct lining fastening and structural bridge losses are represented as a bounded same-family term.";
    case "missing_same_stack_holdout":
      return "No accepted source-owned same-stack mid-depth holdout has been promoted for this exact stack.";
  }
}

function toImpactErrorBudget(
  budget: BroadAccuracyFloorOpenWebDirectFixedErrorBudget,
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
  budgets: readonly BroadAccuracyFloorOpenWebDirectFixedErrorBudget[];
  impact: Pick<ImpactCalculation, "CI" | "LnW" | "LnWPlusCI">;
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

function buildSourceNotes(rows: readonly ExactFloorSystem[], layers: readonly ResolvedLayer[]): string {
  return rows
    .map((row) => {
      const fitPercent = fitPercentFromEvaluation(evaluateMatchedFloorSystem(layers, row));
      return `${row.label} (${fitPercent}% fit)`;
    })
    .join("; ");
}

function finishLabel(finishPackage: DirectFixedFinishPackage): string {
  switch (finishPackage) {
    case "bare":
      return "bare INEX";
    case "carpet_with_foam_underlay":
      return "carpet + foam underlay";
    case "engineered_timber_with_acoustic_underlay":
      return "engineered timber + acoustic underlay";
  }
}

export function deriveLightweightSteelOpenWebDirectFixedLiningEstimate(input: {
  layers: readonly ResolvedLayer[];
  targetOutputs?: readonly RequestedOutputId[];
}): FloorSystemEstimateResult | null {
  const requestedOutputs = input.targetOutputs && input.targetOutputs.length > 0
    ? input.targetOutputs
    : (["Rw", "Ln,w"] as const);

  if (!requestedOutputs.some((output) => FORMULA_OUTPUTS.has(output))) {
    return null;
  }

  const topology = detectDirectFixedTopology(input.layers);
  if (!topology) {
    return null;
  }

  const evaluation = evaluateBroadAccuracyFloorOpenWebDirectFixedLiningFormulaCorridor({
    boardSchedule: topology.boardSchedule,
    carrierDepthMm: topology.carrierDepthMm,
    deckThicknessMm: topology.deckThicknessMm,
    finishPackage: topology.finishPackage,
    targetOutputs: requestedOutputs
  });

  if (
    evaluation.corridorStatus !== "formula_corridor_defined_runtime_gate_required" ||
    evaluation.affectedFormulaOutputs.length === 0 ||
    typeof evaluation.designMetrics.CI !== "number" ||
    typeof evaluation.designMetrics.LnW !== "number" ||
    typeof evaluation.designMetrics.LnWPlusCI !== "number" ||
    typeof evaluation.designMetrics.Rw !== "number" ||
    typeof evaluation.designMetrics.RwCtr !== "number"
  ) {
    return null;
  }

  const rows = sourceRowsByIds(evaluation.anchorSourceIds);
  if (rows.length === 0) {
    return null;
  }

  const impactValues = {
    CI: evaluation.designMetrics.CI,
    LnW: evaluation.designMetrics.LnW,
    LnWPlusCI: evaluation.designMetrics.LnWPlusCI
  };
  const impact = ImpactCalculationSchema.parse({
    ...impactValues,
    availableOutputs: ["Ln,w", "CI", "Ln,w+CI"],
    basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
    confidence: getImpactConfidenceForBasis(OPEN_WEB_DIRECT_FIXED_LINING_BASIS),
    errorBudgets: buildRuntimeBudgets({
      budgets: evaluation.toleranceBudgets,
      impact: impactValues
    }),
    estimateCandidateIds: evaluation.anchorSourceIds,
    labOrField: "lab",
    metricBasis: buildUniformImpactMetricBasis(impactValues, OPEN_WEB_DIRECT_FIXED_LINING_BASIS),
    notes: [
      `Open-web steel direct-fixed lining runtime selected the UBIQ ${evaluation.familyId.toUpperCase()} same-family source grid.`,
      `Current carrier depth ${ksRound1(topology.carrierDepthMm)} mm and INEX deck ${topology.deckThicknessMm} mm were interpolated only inside the measured 200 / 300 / 400 mm direct-fixed band.`,
      `Finish package: ${finishLabel(topology.finishPackage)}; direct lining board schedule ${topology.boardSchedule}.`,
      `Source rows: ${buildSourceNotes(rows, input.layers)}.`,
      "This is a narrow same-source direct-fixed interpolation runtime, not a resilient suspended-ceiling supported-band estimate, a broad steel blend, or a field/building adapter."
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
      RwCtr: evaluation.designMetrics.RwCtr,
      RwCtrSemantic: "rw_plus_ctr"
    },
    fitPercent,
    impact,
    kind: "family_archetype",
    notes: [
      `Open-web steel ${evaluation.familyId.toUpperCase()} direct-fixed lining runtime selected ${rows.length} same-family UBIQ source anchors.`,
      `Carrier depth ${ksRound1(topology.carrierDepthMm)} mm, deck ${topology.deckThicknessMm} mm, board schedule ${topology.boardSchedule}.`,
      `Source rows: ${evaluation.anchorSourceIds.join(", ")}.`
    ],
    sourceSystems: rows,
    structuralFamily: "lightweight steel"
  };
}

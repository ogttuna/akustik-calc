import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import {
  ImpactCalculationSchema,
  type ExactFloorSystem,
  type FloorSystemEstimateResult,
  type ImpactErrorBudget,
  type ImpactErrorBudgetTerm,
  type RequestedOutputId,
  type ResolvedLayer
} from "@dynecho/shared";

import {
  evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor,
  type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageErrorBudget,
  type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageErrorBudgetTerm,
  type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaMetricId,
  type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRoleTopologyState
} from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-formula-corridor";
import {
  evaluateMatchedFloorSystem,
  fitPercentFromEvaluation
} from "./floor-system-evaluation";
import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { round1 } from "./math";

export const OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor";

type DetectedEpsScreedHybridPackage = {
  readonly floatingScreedMassKgM2: number;
  readonly roleTopologyState: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageRoleTopologyState;
  readonly supportThicknessMm: number;
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

const CONTEXT_SOURCE_IDS = [
  "tuas_r7b_open_box_timber_measured_2026",
  "tuas_r8b_open_box_timber_measured_2026",
  "tuas_r9b_open_box_timber_measured_2026",
  "tuas_r2c_open_box_timber_measured_2026",
  "tuas_r10a_open_box_timber_measured_2026"
] as const;

function uniqueRequestedOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return [...new Set(outputs)];
}

function formulaTargetOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  const mapped = outputs.flatMap((output) => {
    switch (output) {
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

function layersForRole(
  layers: readonly ResolvedLayer[],
  floorRole: ResolvedLayer["floorRole"]
): readonly ResolvedLayer[] {
  return layers.filter((layer) => layer.floorRole === floorRole);
}

function thicknessNear(value: number | undefined, target: number, tolerance = 2): boolean {
  return typeof value === "number" && Number.isFinite(value) && Math.abs(value - target) <= tolerance;
}

function scheduleMatches(
  layers: readonly ResolvedLayer[],
  schedule: readonly { materialId: string; thicknessMm: number; toleranceMm?: number }[]
): boolean {
  if (layers.length !== schedule.length) {
    return false;
  }

  return layers.every((layer, index) => {
    const expected = schedule[index];

    return Boolean(
      expected &&
        layer.material.id === expected.materialId &&
        thicknessNear(layer.thicknessMm, expected.thicknessMm, expected.toleranceMm ?? 2)
    );
  });
}

function sameMaterialSplitTotal(
  layers: readonly ResolvedLayer[],
  input: {
    readonly materialId: string;
    readonly targetTotalMm: number;
    readonly toleranceMm?: number;
  }
): { readonly safeSplit: boolean; readonly totalThicknessMm: number } | null {
  if (layers.length === 0 || layers.some((layer) => layer.material.id !== input.materialId)) {
    return null;
  }

  const totalThicknessMm = round1(layers.reduce((sum, layer) => sum + layer.thicknessMm, 0));
  if (!thicknessNear(totalThicknessMm, input.targetTotalMm, input.toleranceMm ?? 2)) {
    return null;
  }

  return {
    safeSplit: layers.length > 1,
    totalThicknessMm
  };
}

function singleLayerMatches(
  layers: readonly ResolvedLayer[],
  input: {
    readonly materialId: string;
    readonly thicknessMm: number;
    readonly toleranceMm?: number;
  }
): boolean {
  return layers.length === 1 &&
    layers[0]?.material.id === input.materialId &&
    thicknessNear(layers[0]?.thicknessMm, input.thicknessMm, input.toleranceMm ?? 2);
}

function estimateScreedMassKgM2(screedThicknessMm: number): number {
  // The R7b packet owns a 40 mm wet screed layer. Use a bounded 2100 kg/m3
  // design density here; source-absent mass uncertainty remains in the runtime
  // budget instead of being treated as measured evidence.
  return round1(screedThicknessMm * 2.1);
}

function detectEpsScreedHybridPackage(
  layers: readonly ResolvedLayer[]
): DetectedEpsScreedHybridPackage | null {
  const base = sameMaterialSplitTotal(layersForRole(layers, "base_structure"), {
    materialId: "open_box_timber_slab",
    targetTotalMm: 370,
    toleranceMm: 3
  });

  if (!base) {
    return null;
  }

  if (
    !singleLayerMatches(layersForRole(layers, "upper_fill"), {
      materialId: "eps_floor_insulation_board",
      thicknessMm: 35,
      toleranceMm: 2
    }) ||
    !singleLayerMatches(layersForRole(layers, "resilient_layer"), {
      materialId: "eps_underlay",
      thicknessMm: 3,
      toleranceMm: 1.5
    }) ||
    !singleLayerMatches(layersForRole(layers, "floor_covering"), {
      materialId: "laminate_flooring",
      thicknessMm: 8,
      toleranceMm: 2
    }) ||
    !singleLayerMatches(layersForRole(layers, "ceiling_fill"), {
      materialId: "rockwool",
      thicknessMm: 100,
      toleranceMm: 8
    }) ||
    !scheduleMatches(layersForRole(layers, "floating_screed"), [
      { materialId: "geotextile", thicknessMm: 1, toleranceMm: 0.5 },
      { materialId: "screed", thicknessMm: 40, toleranceMm: 3 }
    ]) ||
    !scheduleMatches(layersForRole(layers, "ceiling_cavity"), [
      { materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45, toleranceMm: 3 },
      { materialId: "resilient_stud_ceiling", thicknessMm: 25, toleranceMm: 3 }
    ]) ||
    !scheduleMatches(layersForRole(layers, "ceiling_board"), [
      { materialId: "gypsum_board", thicknessMm: 13, toleranceMm: 1.5 },
      { materialId: "gypsum_board", thicknessMm: 13, toleranceMm: 1.5 }
    ])
  ) {
    return null;
  }

  const floatingScreed = layersForRole(layers, "floating_screed");
  const screed = floatingScreed.find((layer) => layer.material.id === "screed");

  return {
    floatingScreedMassKgM2: estimateScreedMassKgM2(screed?.thicknessMm ?? 40),
    roleTopologyState: base.safeSplit ? "safe_split_equivalent" : "source_equivalent",
    supportThicknessMm: base.totalThicknessMm
  };
}

function sourceRowsByIds(ids: readonly string[]): ExactFloorSystem[] {
  return ids.flatMap((id) => {
    const row = EXACT_FLOOR_SYSTEMS.find((system) => system.id === id);

    return row ? [row] : [];
  });
}

function formulaMetricEstimate(
  metricId: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaMetricId,
  metrics: ReturnType<typeof evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor>["designMetrics"]
): number | null {
  switch (metricId) {
    case "C":
      return metrics.C;
    case "CI":
      return metrics.CI;
    case "CI,50-2500":
      return metrics.CI50_2500;
    case "Ln,w":
      return metrics.LnW;
    case "Ln,w+CI":
      return metrics.LnWPlusCI;
    case "Rw":
      return metrics.Rw;
    case "Rw+C":
      return metrics.RwPlusC;
  }
}

function budgetTermReason(
  term: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageErrorBudgetTerm
): string {
  switch (term.termId) {
    case "source_table_rounding":
      return "The TUAS EPS/screed hybrid packet exposes rounded single-number ratings.";
    case "r7b_single_packet_anchor":
      return "R7b is the only same-stack anchor packet currently owned for this source-absent runtime corridor.";
    case "wet_eps_screed_mass_resilience_transfer":
      return "The wet EPS board, geotextile, and screed transfer is carried as a bounded source-absent formula term.";
    case "hybrid_lower_transfer":
      return "The family-A plus resilient-stud lower treatment is represented as a bounded hybrid lower transfer.";
    case "sibling_negative_boundary_spread":
      return "R8b, R9b, R2c, and R10a are held as negative boundary rows around partial and mismatched packets.";
    case "input_precision":
      return "Runtime layer inputs use design-density and thickness tolerances rather than a measured shop drawing.";
  }
}

function toImpactErrorBudget(
  budget: BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageErrorBudget,
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
    max: round1(estimate + budget.totalBudgetDb),
    metricId: budget.metricId,
    min: round1(estimate - budget.totalBudgetDb),
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    terms,
    toleranceDb: budget.totalBudgetDb,
    totalBudgetDb: budget.totalBudgetDb
  };
}

function buildRuntimeBudgets(input: {
  budgets: readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageErrorBudget[];
  metrics: ReturnType<typeof evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor>["designMetrics"];
}): ImpactErrorBudget[] {
  return input.budgets.flatMap((budget) => {
    const estimate = formulaMetricEstimate(budget.metricId, input.metrics);

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

export function deriveOpenBoxTimberEpsScreedHybridPackageEstimate(input: {
  layers: readonly ResolvedLayer[];
  targetOutputs?: readonly RequestedOutputId[];
}): FloorSystemEstimateResult | null {
  const requestedOutputs = input.targetOutputs && input.targetOutputs.length > 0
    ? input.targetOutputs
    : (["Rw", "Ln,w"] as const);

  if (!requestedOutputs.some((output) => RUNTIME_TARGET_OUTPUTS.has(output))) {
    return null;
  }

  const detected = detectEpsScreedHybridPackage(input.layers);
  if (!detected) {
    return null;
  }

  const evaluation = evaluateBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageFormulaCorridor({
    ceilingBoardLayerCount: 2,
    ceilingBoardThicknessMm: 13,
    ceilingFillThicknessMm: 100,
    floatingScreedMassKgM2: detected.floatingScreedMassKgM2,
    lowerState: "hybrid_family_a_resilient_stud",
    packageUpperState: "complete_eps_screed_laminate",
    requestedBasis: "element_lab",
    resilientLayerThicknessMm: 3,
    roleTopologyState: detected.roleTopologyState,
    separatorThicknessMm: 1,
    supportFamily: "open_box_timber",
    supportThicknessMm: detected.supportThicknessMm,
    targetOutputs: formulaTargetOutputs(requestedOutputs),
    upperFillThicknessMm: 35
  });

  if (
    evaluation.corridorStatus !== "formula_corridor_defined_runtime_gate_required" ||
    evaluation.affectedFormulaOutputs.length === 0 ||
    typeof evaluation.designMetrics.C !== "number" ||
    typeof evaluation.designMetrics.CI !== "number" ||
    typeof evaluation.designMetrics.CI50_2500 !== "number" ||
    typeof evaluation.designMetrics.LnW !== "number" ||
    typeof evaluation.designMetrics.LnWPlusCI !== "number" ||
    typeof evaluation.designMetrics.Rw !== "number" ||
    typeof evaluation.designMetrics.RwPlusC !== "number"
  ) {
    return null;
  }

  const rows = sourceRowsByIds(evaluation.anchorSourceIds.length ? evaluation.anchorSourceIds : CONTEXT_SOURCE_IDS);
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
    basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS,
    confidence: getImpactConfidenceForBasis(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS),
    errorBudgets: buildRuntimeBudgets({
      budgets: evaluation.toleranceBudgets,
      metrics: evaluation.designMetrics
    }),
    estimateCandidateIds: evaluation.anchorSourceIds,
    labOrField: "lab",
    metricBasis: buildUniformImpactMetricBasis(impactValues, OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS),
    notes: [
      "Open-box timber EPS/screed hybrid package runtime selected the source-absent formula corridor.",
      `Topology state ${detected.roleTopologyState.replaceAll("_", " ")} with ${detected.supportThicknessMm} mm open-box timber support.`,
      `Wet screed design mass ${detected.floatingScreedMassKgM2} kg/m2; R7b is the same-stack anchor, not a measured row for this source-absent stack.`,
      `Context source rows: ${buildSourceNotes(rows, input.layers)}.`,
      "This is an element-lab source-absent formula corridor; field outputs require the explicit impactFieldContext adapter, airborne building outputs require the explicit building-context adapter, and ASTM/IIC outputs remain unpromoted."
    ],
    scope: "family_estimate"
  });
  const fitPercent = round1(
    rows.reduce((sum, row) => sum + fitPercentFromEvaluation(evaluateMatchedFloorSystem(input.layers, row)), 0) /
      rows.length
  );

  return {
    airborneRatings: {
      C: evaluation.designMetrics.C,
      Rw: evaluation.designMetrics.Rw,
      RwCtr: evaluation.designMetrics.RwPlusC,
      RwCtrSemantic: "rw_plus_c"
    },
    fitPercent,
    impact,
    kind: "family_archetype",
    notes: [
      "Open-box timber EPS/screed hybrid package runtime selected R7b as a design anchor with explicit source-absent budgets.",
      `Topology ${detected.roleTopologyState.replaceAll("_", " ")}; exact TUAS rows and dry package-transfer routes still outrank this formula.`,
      "Negative sibling rows R8b, R9b, R2c, and R10a remain excluded from runtime anchoring."
    ],
    sourceSystems: rows,
    structuralFamily: "open-box timber EPS/screed hybrid package"
  };
}

import {
  ImpactCalculationSchema,
  type AcousticAnswerBoundary,
  type AcousticInputFieldId,
  type ImpactCalculation,
  type ImpactErrorBudget,
  type ImpactErrorBudgetTerm,
  type ImpactPredictorInput,
  type RequestedOutputId
} from "@dynecho/shared";

import {
  estimateHeavyConcreteCombinedImpactFromPredictorInput,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_REQUIRED_FIELDS
} from "./heavy-concrete-combined-impact-formula-corridor";
import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { ksRound1 } from "./math";

export const MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS =
  "predictor_mixed_support_primary_heavy_concrete_combined_owner_guarded_estimate" as const;

export const MIXED_SUPPORT_FLOOR_IMPACT_SELECTED_CANDIDATE_ID =
  "floor.mixed_support_family.single_primary_carrier.lab_impact_formula" as const;

export const MIXED_SUPPORT_FLOOR_IMPACT_UNSUPPORTED_BOUNDARY_METHOD =
  "acoustic_calculator_answer_engine_v1_floor_mixed_support_partition_unsupported_boundary" as const;

export const MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_LN_W_TOLERANCE_DB =
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB + 1;

export const MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB =
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB + 1;

export const MIXED_SUPPORT_FLOOR_IMPACT_OWNER_FIELDS = [
  "primaryCarrierFamily",
  "dominantImpactTransferFamily",
  "mixedSupportRolePartition",
  "secondarySupportTreatmentOwner",
  "duplicateOwnershipGuard"
] as const satisfies readonly AcousticInputFieldId[];

export const MIXED_SUPPORT_FLOOR_IMPACT_REQUIRED_FIELDS = [
  ...MIXED_SUPPORT_FLOOR_IMPACT_OWNER_FIELDS,
  ...HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_REQUIRED_FIELDS
] as const satisfies readonly AcousticInputFieldId[];

function hasPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function hasMixedSupportFloorImpactOwner(input: ImpactPredictorInput | null | undefined): boolean {
  return Boolean(input?.mixedSupport);
}

export function collectMixedSupportFloorImpactMissingPhysicalInputs(
  input: ImpactPredictorInput | null | undefined
): AcousticInputFieldId[] {
  if (!hasMixedSupportFloorImpactOwner(input)) {
    return [];
  }

  const missing: AcousticInputFieldId[] = [];
  const mixedSupport = input?.mixedSupport;

  if (!mixedSupport?.primaryCarrierFamily) {
    missing.push("primaryCarrierFamily");
  }
  if (!mixedSupport?.dominantImpactTransferFamily) {
    missing.push("dominantImpactTransferFamily");
  }
  if (!mixedSupport?.mixedSupportRolePartition) {
    missing.push("mixedSupportRolePartition");
  }
  if (!mixedSupport?.secondarySupportTreatmentOwner) {
    missing.push("secondarySupportTreatmentOwner");
  }
  if (mixedSupport?.duplicateOwnershipGuard !== true) {
    missing.push("duplicateOwnershipGuard");
  }

  return missing;
}

export function isMixedSupportFloorImpactRuntimeAdmitted(
  input: ImpactPredictorInput | null | undefined
): input is ImpactPredictorInput {
  const mixedSupport = input?.mixedSupport;

  return Boolean(
    input &&
      mixedSupport &&
      collectMixedSupportFloorImpactMissingPhysicalInputs(input).length === 0 &&
      input.structuralSupportType === "reinforced_concrete" &&
      input.impactSystemType === "combined_upper_lower_system" &&
      mixedSupport.primaryCarrierFamily === "reinforced_concrete" &&
      mixedSupport.dominantImpactTransferFamily === "reinforced_concrete" &&
      mixedSupport.mixedSupportRolePartition === "single_primary_carrier_secondary_lower_treatment" &&
      mixedSupport.secondarySupportTreatmentOwner === "lower_treatment_only" &&
      mixedSupport.duplicateOwnershipGuard === true
  );
}

export function shouldBlockMixedSupportFloorImpactFormulaFallback(
  input: ImpactPredictorInput | null | undefined
): boolean {
  return hasMixedSupportFloorImpactOwner(input) && !isMixedSupportFloorImpactRuntimeAdmitted(input);
}

export function buildMixedSupportFloorImpactFormulaFallbackBlockerWarning(
  input: ImpactPredictorInput | null | undefined
): string | null {
  if (!hasMixedSupportFloorImpactOwner(input)) {
    return null;
  }

  const missing = collectMixedSupportFloorImpactMissingPhysicalInputs(input);
  if (missing.length > 0) {
    return `Dynamic Calculator mixed-support floor impact runtime is waiting for ${missing.join(", ")} before promoting Ln,w / DeltaLw from the single-primary-carrier corridor.`;
  }

  if (!isMixedSupportFloorImpactRuntimeAdmitted(input)) {
    return "Dynamic Calculator mixed-support floor impact runtime only supports the explicit single-primary reinforced-concrete carrier with a lower-treatment-only secondary owner in Gate BI; other mixed-support partitions stay unsupported instead of falling through to a wrong family solver.";
  }

  return null;
}

function isMixedSupportFloorImpactOutput(output: string): output is RequestedOutputId {
  return (
    output === "Ln,w" ||
    output === "DeltaLw" ||
    output === "L'n,w" ||
    output === "L'nT,w" ||
    output === "L'nT,50"
  );
}

export function buildMixedSupportFloorImpactUnsupportedBoundary(
  targetOutputs: readonly RequestedOutputId[]
): AcousticAnswerBoundary | null {
  const unsupportedOutputs = targetOutputs.filter(isMixedSupportFloorImpactOutput);

  if (unsupportedOutputs.length === 0) {
    return null;
  }

  return {
    method: MIXED_SUPPORT_FLOOR_IMPACT_UNSUPPORTED_BOUNDARY_METHOD,
    missingPhysicalInputs: [],
    origin: "unsupported",
    requiredInputs: [...MIXED_SUPPORT_FLOOR_IMPACT_OWNER_FIELDS],
    route: "floor",
    unsupportedOutputs
  };
}

function mixedSupportTerm(): ImpactErrorBudgetTerm {
  return {
    db: 1,
    origin: "mixed_support_owner_boundary",
    reason:
      "Gate BI admits only an explicit single-primary-carrier mixed-support subset; secondary support is treated as a lower-treatment owner and not as a second carrier.",
    termId: "mixed_support_single_primary_carrier_guard",
    tightenRequires: ["same_stack_mixed_support_primary_carrier_holdouts"]
  };
}

function widenMixedSupportErrorBudget(budget: ImpactErrorBudget): ImpactErrorBudget {
  const toleranceDb =
    budget.metricId === "Ln,w"
      ? MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_LN_W_TOLERANCE_DB
      : budget.metricId === "DeltaLw"
        ? MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB
        : budget.toleranceDb + 1;
  const terms = [...budget.terms, mixedSupportTerm()];

  return {
    ...budget,
    max: ksRound1(budget.estimate + toleranceDb),
    min: ksRound1(budget.estimate - toleranceDb),
    terms,
    toleranceDb,
    totalBudgetDb: ksRound1(terms.reduce((sum, term) => sum + term.db, 0))
  };
}

export function estimateMixedSupportFloorImpactFromPredictorInput(
  input: ImpactPredictorInput | null | undefined
): ImpactCalculation | null {
  if (!isMixedSupportFloorImpactRuntimeAdmitted(input)) {
    return null;
  }

  const heavyConcreteImpact = estimateHeavyConcreteCombinedImpactFromPredictorInput(input);
  if (!heavyConcreteImpact || !hasPositiveNumber(heavyConcreteImpact.LnW)) {
    return null;
  }

  const metricBasis = buildUniformImpactMetricBasis(
    {
      DeltaLw: heavyConcreteImpact.DeltaLw,
      LnW: heavyConcreteImpact.LnW
    },
    MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS
  );

  return ImpactCalculationSchema.parse({
    ...heavyConcreteImpact,
    basis: MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS,
    confidence: getImpactConfidenceForBasis(MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS),
    errorBudgets: heavyConcreteImpact.errorBudgets?.map(widenMixedSupportErrorBudget),
    metricBasis,
    notes: [
      "Gate BI mixed-support runtime is using the explicit single-primary-carrier owner corridor.",
      "primaryCarrierFamily and dominantImpactTransferFamily are reinforced_concrete; secondarySupportTreatmentOwner is lower_treatment_only, so the lower assembly is not double-counted as a second carrier.",
      ...heavyConcreteImpact.notes
    ],
    scope: "mixed_support_floor_formula_corridor",
    standardMethod:
      "Mixed-support single-primary-carrier guard over the heavy-concrete combined upper/lower impact formula corridor"
  });
}

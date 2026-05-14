import {
  RatingAdapterBasisSchema,
  type AcousticInputFieldId,
  type ImpactOnlyCalculation,
  type RatingAdapterBasis,
  type RequestedOutputId
} from "@dynecho/shared";

import {
  buildPersonalUseMvpCoverageSprintGateBRContract,
  buildPersonalUseMvpCoverageSprintGateBRCurrentBoundaryCalculation,
  buildPersonalUseMvpCoverageSprintGateBRScenarioPack,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTION_STATUS,
  type PersonalUseMvpCoverageSprintGateBRAssessment,
  type PersonalUseMvpCoverageSprintGateBRAdapterBasis
} from "./calculator-personal-use-mvp-coverage-sprint-gate-br";
import { analyzeTargetOutputSupport } from "./target-output-support";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_LANDED_GATE =
  "gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTION_STATUS =
  "gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_closed_no_runtime_selected_metric_schema_adapter_bridge_gate_bt";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_ACTION =
  "gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_and_adapter_bridge_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bt-floor-impact-astm-iic-aiic-metric-schema-and-adapter-bridge-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_LABEL =
  "floor-impact ASTM IIC/AIIC metric schema and adapter bridge";

const ASTM_IIC_OUTPUTS = ["IIC"] as const satisfies readonly RequestedOutputId[];
const ASTM_AIIC_OUTPUTS = ["AIIC"] as const satisfies readonly RequestedOutputId[];
const ASTM_IMPACT_OUTPUTS = [
  ...ASTM_IIC_OUTPUTS,
  ...ASTM_AIIC_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

const LAB_RUNTIME_SCHEMA_BLOCKERS = [
  "impactCalculationIicMetricValueOwner",
  "impactMetricBasisIicOwner",
  "astmE989ExecutableIicContourRatingProcedureOwner",
  "targetOutputSupportAstmIicOwner",
  "exactAstmSourcePrecedenceRuntimeOwner",
  "astmIicVisibleSurfaceParityOwner"
] as const;

const FIELD_RUNTIME_SCHEMA_BLOCKERS = [
  "impactCalculationAiicMetricValueOwner",
  "impactMetricBasisAiicOwner",
  "astmE989ExecutableAiicApparentRatingProcedureOwner",
  "targetOutputSupportAstmAiicOwner",
  "exactAstmSourcePrecedenceRuntimeOwner",
  "astmAiicVisibleSurfaceParityOwner"
] as const;

export type PersonalUseMvpCoverageSprintGateBSRuntimeStatus =
  | "blocked_basis_alias"
  | "current_runtime_unsupported"
  | "needs_input"
  | "runtime_owner_missing"
  | "unsupported_basis";

export type PersonalUseMvpCoverageSprintGateBSRuntimeProbe = {
  adapterBasis: PersonalUseMvpCoverageSprintGateBRAdapterBasis;
  basisAliasRejected: boolean;
  blockedOutputs: readonly RequestedOutputId[];
  id: string;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  missingRuntimeOwners: readonly string[];
  previousGateBRScenarioId: string;
  promotedOutputs: readonly RequestedOutputId[];
  runtimePromotionAllowedAtGateBS: false;
  sourceRowsRequiredForRuntimeSelection: false;
  status: PersonalUseMvpCoverageSprintGateBSRuntimeStatus;
  targetOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
};

export type PersonalUseMvpCoverageSprintGateBSRuntimeBoundarySnapshot = {
  aiicDb: null;
  astmRatingBasisPresent: false;
  exactImpactSourceOwnsAstmE989SingleNumber: false;
  iicDb: null;
  impactBasisPresentButNotAstm: string | null;
  impactCalculationSchemaOwnsIicAiicValues: false;
  supportedTargetOutputs: readonly RequestedOutputId[];
  targetOutputSupportBlocksAstmImpactOutputs: true;
  unsupportedTargetOutputs: readonly RequestedOutputId[];
  warningIncludesUnsupportedAstmOutputs: boolean;
};

export type PersonalUseMvpCoverageSprintGateBTLaneId =
  | "astm_iic_aiic_metric_schema_adapter_bridge"
  | "aiic_only_field_runtime_corridor"
  | "broad_astm_source_crawl"
  | "iic_only_lab_runtime_corridor"
  | "iso_impact_adapter_reuse";

export type PersonalUseMvpCoverageSprintGateBTLaneCandidate = {
  broadSourceCrawl: boolean;
  id: PersonalUseMvpCoverageSprintGateBTLaneId;
  reason: string;
  runtimeMovementAllowedAtGateBS: false;
  score: number;
  selected: boolean;
  sourceRowsRequiredForSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateBSStandardsMetadataReference = {
  role: string;
  standard: "ASTM E492" | "ASTM E989" | "ASTM E1007";
  url: string;
};

export type PersonalUseMvpCoverageSprintGateBSContract = {
  aiicAliasedToIsoFieldImpact: false;
  astmImpactRuntimePromoted: false;
  astmRatingAdapterBasisSet: readonly RatingAdapterBasis[];
  currentRuntimeBoundarySnapshot: PersonalUseMvpCoverageSprintGateBSRuntimeBoundarySnapshot;
  exactAstmSourcePrecedenceRuntimeOwnerMissing: true;
  iicAliasedToIsoLnWOrDeltaLw: false;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_LANDED_GATE;
  noRuntimeValueMovement: true;
  previousGateBR: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_FILE;
    selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_LABEL;
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTION_STATUS;
  };
  runtimeProbes: readonly PersonalUseMvpCoverageSprintGateBSRuntimeProbe[];
  selectedImplementationSlice:
    "personal_use_mvp_coverage_sprint_after_gate_br_floor_impact_astm_iic_aiic_runtime_corridor";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_LABEL;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  standardsPublicMetadataReferences: readonly PersonalUseMvpCoverageSprintGateBSStandardsMetadataReference[];
};

const GATE_BT_LANE_CANDIDATES = [
  {
    broadSourceCrawl: false,
    id: "astm_iic_aiic_metric_schema_adapter_bridge",
    reason:
      "Gate BS found that planned ASTM E989 adapter metadata exists, but runtime cannot promote until ImpactCalculation metric slots, metric basis, target-output support, exact-source precedence, and surface parity own IIC/AIIC explicitly.",
    runtimeMovementAllowedAtGateBS: false,
    score: 3.9,
    selected: true,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "iic_only_lab_runtime_corridor",
    reason:
      "Lab IIC is useful, but a lab-only runtime corridor would still require the same missing metric schema and adapter bridge.",
    runtimeMovementAllowedAtGateBS: false,
    score: 2.2,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "aiic_only_field_runtime_corridor",
    reason:
      "Field AIIC has additional room/context ownership, so it should not bypass the shared ASTM metric bridge.",
    runtimeMovementAllowedAtGateBS: false,
    score: 2.0,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "iso_impact_adapter_reuse",
    reason:
      "Reusing ISO 717-2 Ln,w or field impact adapters would silently alias different standards and is rejected.",
    runtimeMovementAllowedAtGateBS: false,
    score: 0.2,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: true,
    id: "broad_astm_source_crawl",
    reason:
      "Source rows can become exact ASTM overrides later, but broad crawling cannot solve the source-absent runtime adapter gap.",
    runtimeMovementAllowedAtGateBS: false,
    score: 0.1,
    selected: false,
    sourceRowsRequiredForSelection: true
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBTLaneCandidate[];

function runtimeStatusForGateBRScenario(
  scenario: PersonalUseMvpCoverageSprintGateBRAssessment
): PersonalUseMvpCoverageSprintGateBSRuntimeStatus {
  if (scenario.status === "ready_for_runtime_corridor" || scenario.status === "runtime_owner_missing") {
    return "runtime_owner_missing";
  }

  if (scenario.status === "needs_input") {
    return "needs_input";
  }

  if (scenario.status === "blocked_basis_alias") {
    return "blocked_basis_alias";
  }

  return "unsupported_basis";
}

function runtimeOwnersForGateBRScenario(
  scenario: PersonalUseMvpCoverageSprintGateBRAssessment
): readonly string[] {
  if (scenario.status === "runtime_owner_missing") {
    return scenario.missingOwnerInputs;
  }

  if (scenario.status !== "ready_for_runtime_corridor") {
    return [];
  }

  if (scenario.adapterBasis === "astm_lab_iic") {
    return LAB_RUNTIME_SCHEMA_BLOCKERS;
  }

  if (scenario.adapterBasis === "astm_field_aiic") {
    return FIELD_RUNTIME_SCHEMA_BLOCKERS;
  }

  return [];
}

function unsupportedOutputsForGateBSProbe(
  scenario: PersonalUseMvpCoverageSprintGateBRAssessment,
  status: PersonalUseMvpCoverageSprintGateBSRuntimeStatus
): readonly RequestedOutputId[] {
  if (status === "runtime_owner_missing" && scenario.status === "ready_for_runtime_corridor") {
    return scenario.targetOutputs;
  }

  return scenario.unsupportedOutputs;
}

export function buildPersonalUseMvpCoverageSprintGateBSAstmRatingAdapterBasisSet():
  readonly RatingAdapterBasis[] {
  return [
    RatingAdapterBasisSchema.parse({
      adapterId: "astm_e989_iic_from_impact_level_curve",
      aliasBlocks: [
        {
          fromMetricId: "Ln,w",
          reason: "ISO 717-2 Ln,w cannot be copied into ASTM E989 IIC.",
          toMetricId: "IIC"
        },
        {
          fromMetricId: "DeltaLw",
          reason: "ISO 717-2 DeltaLw is an improvement metric and cannot become ASTM E989 IIC.",
          toMetricId: "IIC"
        }
      ],
      blockedReasons: [...LAB_RUNTIME_SCHEMA_BLOCKERS],
      contextBasis: "element_lab",
      implementationStatus: "planned_not_implemented",
      inputBasis: "impact_level_curve",
      metricFamily: "impact",
      metricId: "IIC",
      ratingStandard: "ASTM E989",
      requiredContextInputs: ["frequencyBandSet", "exactSourcePrecedenceCheck"],
      sourceMetricIds: []
    }),
    RatingAdapterBasisSchema.parse({
      adapterId: "astm_e989_aiic_from_field_impact_curve",
      aliasBlocks: [
        {
          fromMetricId: "L'n,w",
          reason: "ISO 717-2 apparent impact ratings cannot be copied into ASTM E989 AIIC.",
          toMetricId: "AIIC"
        },
        {
          fromMetricId: "L'nT,w",
          reason: "ISO 717-2 standardized field impact ratings cannot be copied into ASTM E989 AIIC.",
          toMetricId: "AIIC"
        }
      ],
      blockedReasons: [...FIELD_RUNTIME_SCHEMA_BLOCKERS],
      contextBasis: "field_measurement",
      implementationStatus: "planned_not_implemented",
      inputBasis: "impact_field_level_curve",
      metricFamily: "impact",
      metricId: "AIIC",
      ratingStandard: "ASTM E989",
      requiredContextInputs: [
        "impactFieldContext",
        "partitionAreaM2",
        "receivingRoomVolumeM3",
        "receivingRoomRt60S"
      ],
      sourceMetricIds: []
    })
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBSCurrentBoundaryCalculation():
  ImpactOnlyCalculation {
  return buildPersonalUseMvpCoverageSprintGateBRCurrentBoundaryCalculation();
}

export function buildPersonalUseMvpCoverageSprintGateBSRuntimeBoundarySnapshot():
  PersonalUseMvpCoverageSprintGateBSRuntimeBoundarySnapshot {
  const result = buildPersonalUseMvpCoverageSprintGateBSCurrentBoundaryCalculation();
  const support = analyzeTargetOutputSupport({
    impact: result.impact,
    lowerBoundImpact: null,
    targetOutputs: ASTM_IMPACT_OUTPUTS
  });
  const astmOutputsBlocked = ASTM_IMPACT_OUTPUTS.every((output) =>
    support.unsupportedImpactOutputs.includes(output)
  );

  if (!astmOutputsBlocked) {
    throw new Error("Gate BS expected ASTM IIC/AIIC target outputs to remain unsupported.");
  }

  return {
    aiicDb: null,
    astmRatingBasisPresent: false,
    exactImpactSourceOwnsAstmE989SingleNumber: false,
    iicDb: null,
    impactBasisPresentButNotAstm: result.impact?.basis ?? null,
    impactCalculationSchemaOwnsIicAiicValues: false,
    supportedTargetOutputs: result.supportedTargetOutputs,
    targetOutputSupportBlocksAstmImpactOutputs: true,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    warningIncludesUnsupportedAstmOutputs: result.warnings.some(
      (warning: string) => warning.includes("IIC") && warning.includes("AIIC")
    )
  };
}

export function buildPersonalUseMvpCoverageSprintGateBSRuntimeProbes():
  readonly PersonalUseMvpCoverageSprintGateBSRuntimeProbe[] {
  return buildPersonalUseMvpCoverageSprintGateBRScenarioPack().map((scenario) => {
    const status = runtimeStatusForGateBRScenario(scenario);

    return {
      adapterBasis: scenario.adapterBasis,
      basisAliasRejected: scenario.status === "blocked_basis_alias",
      blockedOutputs: scenario.blockedOutputs,
      id: scenario.id.replace("gate_br_", "gate_bs_runtime_probe_"),
      missingPhysicalInputs: scenario.missingPhysicalInputs,
      missingRuntimeOwners: runtimeOwnersForGateBRScenario(scenario),
      previousGateBRScenarioId: scenario.id,
      promotedOutputs: [],
      runtimePromotionAllowedAtGateBS: false,
      sourceRowsRequiredForRuntimeSelection: false,
      status,
      targetOutputs: scenario.targetOutputs,
      unsupportedOutputs: unsupportedOutputsForGateBSProbe(scenario, status)
    };
  });
}

export function rankPersonalUseMvpCoverageSprintGateBTLanes():
  readonly PersonalUseMvpCoverageSprintGateBTLaneCandidate[] {
  return GATE_BT_LANE_CANDIDATES;
}

export function buildPersonalUseMvpCoverageSprintGateBSStandardsPublicMetadataReferences():
  readonly PersonalUseMvpCoverageSprintGateBSStandardsMetadataReference[] {
  return [
    {
      role: "Public locator for laboratory tapping-machine impact-band inputs; no standard text or measured values are ingested.",
      standard: "ASTM E492",
      url: "https://store.astm.org/e0492-25.html"
    },
    {
      role: "Public locator for the ASTM impact single-number rating family that owns IIC/AIIC; no standard text or rating formula text is ingested.",
      standard: "ASTM E989",
      url: "https://store.astm.org/e0989-21.html"
    },
    {
      role: "Public locator for field tapping-machine impact context and AIIC ownership; no standard text or measured values are ingested.",
      standard: "ASTM E1007",
      url: "https://store.astm.org/e1007-25.html"
    }
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBSContract():
  PersonalUseMvpCoverageSprintGateBSContract {
  const gateBR = buildPersonalUseMvpCoverageSprintGateBRContract();

  if (gateBR.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_LANDED_GATE) {
    throw new Error("Gate BS can only land after Gate BR selects the ASTM IIC/AIIC runtime corridor.");
  }

  return {
    aiicAliasedToIsoFieldImpact: false,
    astmImpactRuntimePromoted: false,
    astmRatingAdapterBasisSet: buildPersonalUseMvpCoverageSprintGateBSAstmRatingAdapterBasisSet(),
    currentRuntimeBoundarySnapshot: buildPersonalUseMvpCoverageSprintGateBSRuntimeBoundarySnapshot(),
    exactAstmSourcePrecedenceRuntimeOwnerMissing: true,
    iicAliasedToIsoLnWOrDeltaLw: false,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousGateBR: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTION_STATUS
    },
    runtimeProbes: buildPersonalUseMvpCoverageSprintGateBSRuntimeProbes(),
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_br_floor_impact_astm_iic_aiic_runtime_corridor",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    standardsPublicMetadataReferences: buildPersonalUseMvpCoverageSprintGateBSStandardsPublicMetadataReferences()
  };
}

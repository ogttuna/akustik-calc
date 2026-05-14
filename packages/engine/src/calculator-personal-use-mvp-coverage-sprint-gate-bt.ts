import {
  ImpactCalculationSchema,
  RatingAdapterBasisSchema,
  type ImpactCalculation,
  type RatingAdapterBasis,
  type RequestedOutputId
} from "@dynecho/shared";

import {
  buildPersonalUseMvpCoverageSprintGateBSContract,
  buildPersonalUseMvpCoverageSprintGateBSCurrentBoundaryCalculation,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bs";
import { analyzeTargetOutputSupport, type TargetOutputSupportResult } from "./target-output-support";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_LANDED_GATE =
  "gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_and_adapter_bridge_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTION_STATUS =
  "gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_adapter_bridge_landed_no_runtime_selected_rating_procedure_exact_source_owner_gate_bu";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_ACTION =
  "gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_and_exact_source_owner_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu-floor-impact-astm-iic-aiic-rating-procedure-and-exact-source-owner-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_LABEL =
  "floor-impact ASTM IIC/AIIC rating procedure and exact-source owner";

export const GATE_BT_ASTM_E989_BRIDGE_BASIS =
  "astm_e989_impact_rating_metric_schema_adapter_bridge";
export const GATE_BT_ASTM_E989_AIIC_METRIC_BASIS =
  "astm_e989_aiic_metric_schema_adapter_bridge";
export const GATE_BT_ASTM_E989_IIC_METRIC_BASIS =
  "astm_e989_iic_metric_schema_adapter_bridge";

const ASTM_IIC_OUTPUTS = ["IIC"] as const satisfies readonly RequestedOutputId[];
const ASTM_AIIC_OUTPUTS = ["AIIC"] as const satisfies readonly RequestedOutputId[];
const ASTM_IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const REMAINING_LAB_IIC_RUNTIME_BLOCKERS = [
  "astmE989ExecutableIicContourRatingProcedureOwner",
  "exactAstmSourcePrecedenceRuntimeOwner",
  "astmIicVisibleSurfaceParityOwner"
] as const;

const REMAINING_FIELD_AIIC_RUNTIME_BLOCKERS = [
  "astmE989ExecutableAiicApparentRatingProcedureOwner",
  "exactAstmSourcePrecedenceRuntimeOwner",
  "astmAiicVisibleSurfaceParityOwner"
] as const;

export type PersonalUseMvpCoverageSprintGateBTBridgeProbe = {
  basis: typeof GATE_BT_ASTM_E989_BRIDGE_BASIS;
  labOrField: "field" | "lab";
  metricBasis: typeof GATE_BT_ASTM_E989_AIIC_METRIC_BASIS | typeof GATE_BT_ASTM_E989_IIC_METRIC_BASIS;
  metricId: Extract<RequestedOutputId, "AIIC" | "IIC">;
  runtimeEvidence: false;
  sourceRowsIngested: false;
  support: TargetOutputSupportResult;
  valueDb: number;
};

export type PersonalUseMvpCoverageSprintGateBTNegativeProbe = {
  id: string;
  parseSuccess: boolean;
  reason: string;
};

export type PersonalUseMvpCoverageSprintGateBTLaneId =
  | "astm_iic_aiic_rating_procedure_exact_source_owner"
  | "astm_iic_aiic_surface_parity"
  | "broad_astm_source_crawl"
  | "field_aiic_only_runtime"
  | "iso_impact_adapter_reuse";

export type PersonalUseMvpCoverageSprintGateBTLaneCandidate = {
  broadSourceCrawl: boolean;
  id: PersonalUseMvpCoverageSprintGateBTLaneId;
  reason: string;
  runtimeMovementAllowedAtGateBT: false;
  score: number;
  selected: boolean;
  sourceRowsRequiredForSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateBTContract = {
  astmRuntimePromoted: false;
  bridgeProbes: readonly PersonalUseMvpCoverageSprintGateBTBridgeProbe[];
  currentRuntimeStillUnsupported: {
    supportedTargetOutputs: readonly RequestedOutputId[];
    unsupportedTargetOutputs: readonly RequestedOutputId[];
  };
  exactAstmSourcePrecedenceRuntimeOwnerMissing: true;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_LANDED_GATE;
  noRuntimeValueMovement: true;
  previousGateBS: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_FILE;
    selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_LABEL;
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTION_STATUS;
  };
  ratingAdaptersAfterBridge: readonly RatingAdapterBasis[];
  remainingRuntimeBlockers: {
    aiic: readonly string[];
    iic: readonly string[];
  };
  schemaBridgeOwns: readonly string[];
  selectedImplementationSlice:
    "personal_use_mvp_coverage_sprint_after_gate_bs_floor_impact_astm_iic_aiic_metric_schema_adapter_bridge";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_LABEL;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

const GATE_BU_LANE_CANDIDATES = [
  {
    broadSourceCrawl: false,
    id: "astm_iic_aiic_rating_procedure_exact_source_owner",
    reason:
      "Gate BT now lets runtime carry ASTM IIC/AIIC values safely, so the next blocker is the executable ASTM E989 rating procedure plus exact ASTM source-precedence owner.",
    runtimeMovementAllowedAtGateBT: false,
    score: 3.8,
    selected: true,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "astm_iic_aiic_surface_parity",
    reason:
      "Surface parity is still required, but it should follow an executable rating-procedure owner rather than display schema probes as runtime.",
    runtimeMovementAllowedAtGateBT: false,
    score: 2.1,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "field_aiic_only_runtime",
    reason:
      "AIIC has more field context, so it should not bypass the shared ASTM rating-procedure owner.",
    runtimeMovementAllowedAtGateBT: false,
    score: 1.4,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "iso_impact_adapter_reuse",
    reason:
      "ISO 717-2 impact adapters remain non-aliasable and cannot feed ASTM ratings.",
    runtimeMovementAllowedAtGateBT: false,
    score: 0.2,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: true,
    id: "broad_astm_source_crawl",
    reason:
      "Broad source crawling can add exact rows later, but it cannot replace the rating-procedure owner for source-absent calculator coverage.",
    runtimeMovementAllowedAtGateBT: false,
    score: 0.1,
    selected: false,
    sourceRowsRequiredForSelection: true
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBTLaneCandidate[];

function supportFor(
  impact: ImpactCalculation | null,
  targetOutputs: readonly RequestedOutputId[]
): TargetOutputSupportResult {
  return analyzeTargetOutputSupport({
    impact,
    lowerBoundImpact: null,
    targetOutputs
  });
}

export function buildPersonalUseMvpCoverageSprintGateBTLabIicBridgeImpact(): ImpactCalculation {
  return ImpactCalculationSchema.parse({
    IIC: 52,
    availableOutputs: ASTM_IIC_OUTPUTS,
    basis: GATE_BT_ASTM_E989_BRIDGE_BASIS,
    confidence: {
      level: "medium",
      provenance: "formula_estimate_narrow_scope",
      score: 0.5,
      summary: "Gate BT schema bridge probe only; not runtime evidence."
    },
    labOrField: "lab",
    metricBasis: {
      IIC: GATE_BT_ASTM_E989_IIC_METRIC_BASIS
    },
    notes: [
      "Gate BT proves that ASTM E989 IIC can be carried only with ASTM metric-basis ownership.",
      "This probe is not an ASTM E989 rating calculation and must not move runtime values."
    ],
    scope: "family_estimate",
    standardMethod: "ASTM E989 metric schema bridge only"
  });
}

export function buildPersonalUseMvpCoverageSprintGateBTFieldAiicBridgeImpact(): ImpactCalculation {
  return ImpactCalculationSchema.parse({
    AIIC: 48,
    availableOutputs: ASTM_AIIC_OUTPUTS,
    basis: GATE_BT_ASTM_E989_BRIDGE_BASIS,
    confidence: {
      level: "medium",
      provenance: "formula_estimate_narrow_scope",
      score: 0.5,
      summary: "Gate BT schema bridge probe only; not runtime evidence."
    },
    labOrField: "field",
    metricBasis: {
      AIIC: GATE_BT_ASTM_E989_AIIC_METRIC_BASIS
    },
    notes: [
      "Gate BT proves that ASTM E989 AIIC can be carried only with ASTM field metric-basis ownership.",
      "This probe is not an ASTM E989 rating calculation and must not move runtime values."
    ],
    scope: "family_estimate",
    standardMethod: "ASTM E989 metric schema bridge only"
  });
}

export function buildPersonalUseMvpCoverageSprintGateBTBridgeProbes():
  readonly PersonalUseMvpCoverageSprintGateBTBridgeProbe[] {
  const iic = buildPersonalUseMvpCoverageSprintGateBTLabIicBridgeImpact();
  const aiic = buildPersonalUseMvpCoverageSprintGateBTFieldAiicBridgeImpact();

  return [
    {
      basis: GATE_BT_ASTM_E989_BRIDGE_BASIS,
      labOrField: "lab",
      metricBasis: GATE_BT_ASTM_E989_IIC_METRIC_BASIS,
      metricId: "IIC",
      runtimeEvidence: false,
      sourceRowsIngested: false,
      support: supportFor(iic, ASTM_IMPACT_OUTPUTS),
      valueDb: iic.IIC ?? Number.NaN
    },
    {
      basis: GATE_BT_ASTM_E989_BRIDGE_BASIS,
      labOrField: "field",
      metricBasis: GATE_BT_ASTM_E989_AIIC_METRIC_BASIS,
      metricId: "AIIC",
      runtimeEvidence: false,
      sourceRowsIngested: false,
      support: supportFor(aiic, ASTM_IMPACT_OUTPUTS),
      valueDb: aiic.AIIC ?? Number.NaN
    }
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBTNegativeProbes():
  readonly PersonalUseMvpCoverageSprintGateBTNegativeProbe[] {
  const validIic = buildPersonalUseMvpCoverageSprintGateBTLabIicBridgeImpact();
  const validAiic = buildPersonalUseMvpCoverageSprintGateBTFieldAiicBridgeImpact();

  return [
    {
      id: "iic_value_without_astm_metric_basis_rejected",
      parseSuccess: ImpactCalculationSchema.safeParse({
        ...validIic,
        metricBasis: {}
      }).success,
      reason: "IIC must carry an ASTM E989 IIC metric-basis owner."
    },
    {
      id: "iic_value_without_lab_context_rejected",
      parseSuccess: ImpactCalculationSchema.safeParse({
        ...validIic,
        labOrField: undefined
      }).success,
      reason: "IIC must stay lab-context owned."
    },
    {
      id: "aiic_value_without_field_context_rejected",
      parseSuccess: ImpactCalculationSchema.safeParse({
        ...validAiic,
        labOrField: "lab"
      }).success,
      reason: "AIIC must stay field-context owned."
    },
    {
      id: "iic_available_without_value_rejected",
      parseSuccess: ImpactCalculationSchema.safeParse({
        ...validIic,
        IIC: undefined
      }).success,
      reason: "Available ASTM outputs require matching ASTM metric values."
    }
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBTAstmRatingAdapterBasisSet():
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
          reason: "ISO 717-2 DeltaLw cannot be copied into ASTM E989 IIC.",
          toMetricId: "IIC"
        }
      ],
      blockedReasons: [...REMAINING_LAB_IIC_RUNTIME_BLOCKERS],
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
          reason: "ISO 717-2 field impact ratings cannot be copied into ASTM E989 AIIC.",
          toMetricId: "AIIC"
        },
        {
          fromMetricId: "L'nT,w",
          reason: "ISO 717-2 standardized field impact ratings cannot be copied into ASTM E989 AIIC.",
          toMetricId: "AIIC"
        }
      ],
      blockedReasons: [...REMAINING_FIELD_AIIC_RUNTIME_BLOCKERS],
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

export function buildPersonalUseMvpCoverageSprintGateBTCurrentRuntimeBoundary():
  PersonalUseMvpCoverageSprintGateBTContract["currentRuntimeStillUnsupported"] {
  const result = buildPersonalUseMvpCoverageSprintGateBSCurrentBoundaryCalculation();

  return {
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

export function rankPersonalUseMvpCoverageSprintGateBULanes():
  readonly PersonalUseMvpCoverageSprintGateBTLaneCandidate[] {
  return GATE_BU_LANE_CANDIDATES;
}

export function buildPersonalUseMvpCoverageSprintGateBTContract():
  PersonalUseMvpCoverageSprintGateBTContract {
  const gateBS = buildPersonalUseMvpCoverageSprintGateBSContract();

  if (gateBS.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_LANDED_GATE) {
    throw new Error("Gate BT can only land after Gate BS selects the ASTM IIC/AIIC metric bridge.");
  }

  return {
    astmRuntimePromoted: false,
    bridgeProbes: buildPersonalUseMvpCoverageSprintGateBTBridgeProbes(),
    currentRuntimeStillUnsupported: buildPersonalUseMvpCoverageSprintGateBTCurrentRuntimeBoundary(),
    exactAstmSourcePrecedenceRuntimeOwnerMissing: true,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousGateBS: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTED_NEXT_LABEL,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BS_SELECTION_STATUS
    },
    ratingAdaptersAfterBridge: buildPersonalUseMvpCoverageSprintGateBTAstmRatingAdapterBasisSet(),
    remainingRuntimeBlockers: {
      aiic: REMAINING_FIELD_AIIC_RUNTIME_BLOCKERS,
      iic: REMAINING_LAB_IIC_RUNTIME_BLOCKERS
    },
    schemaBridgeOwns: [
      "impactCalculationIicMetricValueOwner",
      "impactCalculationAiicMetricValueOwner",
      "impactMetricBasisIicOwner",
      "impactMetricBasisAiicOwner",
      "targetOutputSupportAstmIicOwner",
      "targetOutputSupportAstmAiicOwner"
    ],
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bs_floor_impact_astm_iic_aiic_metric_schema_adapter_bridge",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BT_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

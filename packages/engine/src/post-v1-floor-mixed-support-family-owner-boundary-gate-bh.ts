import type { RequestedOutputId } from "@dynecho/shared";

import { buildPersonalUseMvpCoverageSprintGateBBInputContract } from "./calculator-personal-use-mvp-coverage-sprint-gate-bb";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTION_STATUS,
  summarizePostV1GateBGNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-bg";

export const POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_LANDED_GATE =
  "post_v1_floor_mixed_support_family_owner_boundary_gate_bh_plan" as const;

export const POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTION_STATUS =
  "post_v1_floor_mixed_support_family_owner_boundary_gate_bh_landed_no_runtime_selected_floor_mixed_support_family_runtime_corridor_gate_bi" as const;

export const POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_ACTION =
  "post_v1_floor_mixed_support_family_runtime_corridor_gate_bi_plan" as const;

export const POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-mixed-support-family-runtime-corridor-gate-bi-contract.test.ts" as const;

export const POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_LABEL =
  "post-V1 floor mixed-support family runtime corridor Gate BI" as const;

export type PostV1GateBHOwnerFieldId =
  | "dominantImpactTransferFamily"
  | "duplicateOwnershipGuard"
  | "mixedSupportRolePartition"
  | "primaryCarrierFamily"
  | "secondarySupportTreatmentOwner";

export type PostV1GateBHOwnerField = {
  readonly defaultPolicy: "no_default";
  readonly fieldId: PostV1GateBHOwnerFieldId;
  readonly missingBehavior: "needs_input";
  readonly ownerId:
    | "floorMixedSupportDominantImpactTransferOwner"
    | "floorMixedSupportDuplicateOwnershipGuard"
    | "floorMixedSupportPrimaryCarrierOwner"
    | "floorMixedSupportRolePartitionOwner"
    | "floorMixedSupportSecondaryTreatmentOwner";
  readonly runtimeDefaultAllowed: false;
};

export type PostV1GateBHBoundaryCaseId =
  | "current_mixed_support_family_duplicate_owner_fail_closed"
  | "explicit_single_primary_carrier_safe_runtime_candidate"
  | "missing_primary_carrier_owner_needs_input"
  | "missing_role_partition_needs_input"
  | "wrong_standard_astm_alias_remains_unsupported";

export type PostV1GateBHBoundaryCase = {
  readonly id: PostV1GateBHBoundaryCaseId;
  readonly expectedBehavior: "needs_input" | "runtime_candidate_for_gate_bi" | "unsupported";
  readonly missingOwnerFields: readonly PostV1GateBHOwnerFieldId[];
  readonly reason: string;
  readonly runtimeValueMovementAllowedInGateBH: false;
  readonly selectedForGateBIRuntime: boolean;
};

export type PostV1GateBHSummary = {
  readonly boundaryCases: readonly PostV1GateBHBoundaryCase[];
  readonly currentMixedSupportStop: {
    readonly missingPhysicalInputs: readonly "duplicateOwnershipGuard"[];
    readonly status: "fail_closed_mixed_family";
    readonly supportedOutputs: readonly RequestedOutputId[];
    readonly unsupportedOutputs: readonly RequestedOutputId[];
  };
  readonly landedGate: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly ownerFields: readonly PostV1GateBHOwnerField[];
  readonly previousGateBG: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTION_STATUS;
  };
  readonly selectedNextAction: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTION_STATUS;
  readonly sourceRowsRequiredForSelection: false;
  readonly targetMetricsForRuntimeFollowup: readonly RequestedOutputId[];
};

const GATE_BH_TARGET_METRICS = [
  "Rw",
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

const OWNER_FIELDS = [
  {
    defaultPolicy: "no_default",
    fieldId: "primaryCarrierFamily",
    missingBehavior: "needs_input",
    ownerId: "floorMixedSupportPrimaryCarrierOwner",
    runtimeDefaultAllowed: false
  },
  {
    defaultPolicy: "no_default",
    fieldId: "dominantImpactTransferFamily",
    missingBehavior: "needs_input",
    ownerId: "floorMixedSupportDominantImpactTransferOwner",
    runtimeDefaultAllowed: false
  },
  {
    defaultPolicy: "no_default",
    fieldId: "mixedSupportRolePartition",
    missingBehavior: "needs_input",
    ownerId: "floorMixedSupportRolePartitionOwner",
    runtimeDefaultAllowed: false
  },
  {
    defaultPolicy: "no_default",
    fieldId: "secondarySupportTreatmentOwner",
    missingBehavior: "needs_input",
    ownerId: "floorMixedSupportSecondaryTreatmentOwner",
    runtimeDefaultAllowed: false
  },
  {
    defaultPolicy: "no_default",
    fieldId: "duplicateOwnershipGuard",
    missingBehavior: "needs_input",
    ownerId: "floorMixedSupportDuplicateOwnershipGuard",
    runtimeDefaultAllowed: false
  }
] as const satisfies readonly PostV1GateBHOwnerField[];

const BOUNDARY_CASES = [
  {
    expectedBehavior: "needs_input",
    id: "current_mixed_support_family_duplicate_owner_fail_closed",
    missingOwnerFields: ["duplicateOwnershipGuard"],
    reason: "existing mixed-support detection must stay fail-closed until ownership is explicit",
    runtimeValueMovementAllowedInGateBH: false,
    selectedForGateBIRuntime: false
  },
  {
    expectedBehavior: "runtime_candidate_for_gate_bi",
    id: "explicit_single_primary_carrier_safe_runtime_candidate",
    missingOwnerFields: [],
    reason: "a future runtime subset may calculate only after primary carrier, transfer family, role partition, and secondary treatment owner are explicit",
    runtimeValueMovementAllowedInGateBH: false,
    selectedForGateBIRuntime: true
  },
  {
    expectedBehavior: "needs_input",
    id: "missing_primary_carrier_owner_needs_input",
    missingOwnerFields: ["primaryCarrierFamily", "dominantImpactTransferFamily"],
    reason: "mixed-support stacks cannot infer the structural carrier or impact-transfer family from layer order alone",
    runtimeValueMovementAllowedInGateBH: false,
    selectedForGateBIRuntime: false
  },
  {
    expectedBehavior: "needs_input",
    id: "missing_role_partition_needs_input",
    missingOwnerFields: ["mixedSupportRolePartition", "secondarySupportTreatmentOwner"],
    reason: "secondary support treatments must not be counted as a second primary carrier or as upper DeltaLw without owner fields",
    runtimeValueMovementAllowedInGateBH: false,
    selectedForGateBIRuntime: false
  },
  {
    expectedBehavior: "unsupported",
    id: "wrong_standard_astm_alias_remains_unsupported",
    missingOwnerFields: [],
    reason: "ISO Ln,w and field impact owners still cannot become ASTM IIC or AIIC for mixed-support stacks",
    runtimeValueMovementAllowedInGateBH: false,
    selectedForGateBIRuntime: false
  }
] as const satisfies readonly PostV1GateBHBoundaryCase[];

export function summarizePostV1FloorMixedSupportFamilyOwnerBoundaryGateBH():
  PostV1GateBHSummary {
  const gateBG = summarizePostV1GateBGNumericCoverageGap();
  if (
    gateBG.selectedNextAction !== POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_LANDED_GATE ||
    gateBG.selectedNextFile !==
      "packages/engine/src/post-v1-floor-mixed-support-family-owner-boundary-gate-bh-contract.test.ts"
  ) {
    throw new Error("Gate BH can only land after Gate BG selects the mixed-support family owner boundary.");
  }

  const currentMixedSupport = buildPersonalUseMvpCoverageSprintGateBBInputContract({
    family: "mixed_support_family",
    hostileFlags: ["mixed_support_family"],
    targetOutputs: ["Ln,w", "DeltaLw"]
  });
  if (currentMixedSupport.status !== "fail_closed_mixed_family") {
    throw new Error("Gate BH requires current mixed-support behavior to remain fail-closed.");
  }

  return {
    boundaryCases: BOUNDARY_CASES,
    currentMixedSupportStop: {
      missingPhysicalInputs: ["duplicateOwnershipGuard"],
      status: currentMixedSupport.status,
      supportedOutputs: currentMixedSupport.currentRuntimeSnapshot?.supportedTargetOutputs ?? [],
      unsupportedOutputs: currentMixedSupport.currentRuntimeSnapshot?.unsupportedTargetOutputs ?? []
    },
    landedGate: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_LANDED_GATE,
    noRuntimeValueMovement: true,
    ownerFields: OWNER_FIELDS,
    previousGateBG: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTION_STATUS
    },
    selectedNextAction: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_MIXED_SUPPORT_FAMILY_OWNER_BOUNDARY_GATE_BH_SELECTION_STATUS,
    sourceRowsRequiredForSelection: false,
    targetMetricsForRuntimeFollowup: GATE_BH_TARGET_METRICS
  };
}

import type { RequestedOutputId } from "@dynecho/shared";

import {
  MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SELECTED_CANDIDATE_ID,
  MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_BASIS,
  MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_PAIRS
} from "./mass-timber-clt-upper-package-delta-lw-runtime";
import {
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_LANDED_GATE,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTION_STATUS,
  POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS,
  POST_V1_GATE_DZ_COUNTERS,
  POST_V1_GATE_DZ_OWNER_ID
} from "./post-v1-floor-mass-timber-clt-upper-package-delta-lw-owner-gate-dz";

export const POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_LANDED_GATE =
  "post_v1_floor_mass_timber_clt_upper_package_delta_lw_runtime_gate_ea_plan" as const;

export const POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTION_STATUS =
  "post_v1_floor_mass_timber_clt_upper_package_delta_lw_runtime_gate_ea_landed_runtime_selected_next_numeric_coverage_gap_gate_eb" as const;

export const POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_eb_plan" as const;

export const POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eb-contract.test.ts" as const;

export const POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate EB" as const;

export const POST_V1_GATE_EA_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EA_COUNTERS = {
  astmAliasesPromoted: 0,
  formulaCorridorGuardsWeakened: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_PAIRS.length,
  newCalculableRequestShapes: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_PAIRS.length,
  runtimeCorrectedLayerTemplates: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_PAIRS.length,
  runtimeCorrectedRequestShapes: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_PAIRS.length,
  sourceRowsImported: 0
} as const;

export type PostV1GateEAMassTimberCltUpperPackageDeltaLwRuntimeSummary = {
  readonly acceptedSameSourcePairs: typeof MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_PAIRS;
  readonly counters: typeof POST_V1_GATE_EA_COUNTERS;
  readonly landedGate:
    typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_LANDED_GATE;
  readonly previousGateDZ: {
    readonly acceptedSameSourcePairs: typeof POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS;
    readonly counters: typeof POST_V1_GATE_DZ_COUNTERS;
    readonly landedGate:
      typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_LANDED_GATE;
    readonly ownerId: typeof POST_V1_GATE_DZ_OWNER_ID;
    readonly selectedNextAction:
      typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_FILE;
    readonly selectionStatus:
      typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTION_STATUS;
  };
  readonly runtimeBasisId: typeof MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_BASIS;
  readonly selectedCandidateId: typeof MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction:
    typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_LABEL;
  readonly selectionStatus:
    typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTION_STATUS;
  readonly sourceRowsAreAnchorsNotProductCatalog: true;
  readonly targetOutputs: typeof POST_V1_GATE_EA_TARGET_OUTPUTS;
};

export function summarizePostV1GateEAMassTimberCltUpperPackageDeltaLwRuntime():
  PostV1GateEAMassTimberCltUpperPackageDeltaLwRuntimeSummary {
  if (
    POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_LANDED_GATE
  ) {
    throw new Error("Gate EA cannot land until Gate DZ selects the CLT upper-package DeltaLw runtime slice.");
  }

  return {
    acceptedSameSourcePairs: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_PAIRS,
    counters: POST_V1_GATE_EA_COUNTERS,
    landedGate: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_LANDED_GATE,
    previousGateDZ: {
      acceptedSameSourcePairs: POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS,
      counters: POST_V1_GATE_DZ_COUNTERS,
      landedGate: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_LANDED_GATE,
      ownerId: POST_V1_GATE_DZ_OWNER_ID,
      selectedNextAction: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTION_STATUS
    },
    runtimeBasisId: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_BASIS,
    selectedCandidateId: MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_RUNTIME_GATE_EA_SELECTION_STATUS,
    sourceRowsAreAnchorsNotProductCatalog: true,
    targetOutputs: POST_V1_GATE_EA_TARGET_OUTPUTS
  };
}

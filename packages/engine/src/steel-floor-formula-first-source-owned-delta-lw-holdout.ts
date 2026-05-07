import {
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
  buildGateAKSteelFloorFormulaSourceOwnedDeltaLwHoldoutContract,
  evaluateSteelFloorDeltaLwHoldoutPacket,
  type SteelFloorDeltaLwHoldoutPacket,
  type SteelFloorDeltaLwHoldoutPacketInput,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";

type GateALSourceOwnerPosture =
  | "ln_w_or_rw_only_no_delta_lw_metric"
  | "product_catalog_metric_not_same_stack"
  | "annex_or_companion_inferred_metric"
  | "wrong_basis_astm_iic_or_building_prediction"
  | "fully_source_owned_same_stack_metric";

type GateALCurrentCandidateInput = SteelFloorDeltaLwHoldoutPacketInput & {
  readonly sourceLabel: string;
  readonly sourceUrl: string | null;
  readonly sourceOwnerPosture: GateALSourceOwnerPosture;
};

export type GateALSteelFloorFormulaFirstSourceOwnedDeltaLwCandidate =
  SteelFloorDeltaLwHoldoutPacket & {
    readonly sourceLabel: string;
    readonly sourceUrl: string | null;
    readonly sourceOwnerPosture: GateALSourceOwnerPosture;
  };

const buildCandidate = (
  input: GateALCurrentCandidateInput,
): GateALSteelFloorFormulaFirstSourceOwnedDeltaLwCandidate => {
  const { sourceLabel, sourceUrl, sourceOwnerPosture, ...packetInput } = input;
  return {
    ...evaluateSteelFloorDeltaLwHoldoutPacket(packetInput),
    sourceLabel,
    sourceUrl,
    sourceOwnerPosture,
  };
};

const currentNearMissCandidateInputs = [
  {
    id: "pliteq_genieclip_steel_joist_system_table_ln_w_only_rows",
    sourceLabel: "Pliteq steel joist GenieClip system table",
    sourceUrl:
      "https://pliteq.com/products/genieclip-rst-sound-control-clip/",
    sourceKind: "ln_w_only_system_table",
    basis: "lab_iso_10140_717_2",
    representedRowCount: 3,
    measuredDeltaLwDb: null,
    sourceOwnedFields: ["topology_and_support_family", "lower_support_class"],
    runtimeValueMovement: false,
    sourceOwnerPosture: "ln_w_or_rw_only_no_delta_lw_metric",
  },
  {
    id: "ubiq_open_web_exact_rows_ln_w_rw_no_delta_lw",
    sourceLabel: "UBIQ open-web steel joist exact Ln,w/Rw rows",
    sourceUrl: null,
    sourceKind: "ln_w_only_system_table",
    basis: "lab_iso_10140_717_2",
    representedRowCount: 36,
    measuredDeltaLwDb: null,
    sourceOwnedFields: ["topology_and_support_family", "lower_support_class"],
    runtimeValueMovement: false,
    sourceOwnerPosture: "ln_w_or_rw_only_no_delta_lw_metric",
  },
  {
    id: "product_catalog_resilient_underlay_delta_lw_only",
    sourceLabel: "Resilient underlay product catalog DeltaLw row",
    sourceUrl: null,
    sourceKind: "product_catalog_delta_lw",
    basis: "lab_iso_10140_717_2",
    representedRowCount: 2,
    measuredDeltaLwDb: 26,
    sourceOwnedFields: ["metric_value"],
    runtimeValueMovement: false,
    sourceOwnerPosture: "product_catalog_metric_not_same_stack",
  },
  {
    id: "annex_c_or_companion_inferred_delta_lw_reference",
    sourceLabel: "Annex/companion inferred DeltaLw reference",
    sourceUrl: null,
    sourceKind: "annex_c_or_companion_inferred_delta_lw",
    basis: "lab_iso_10140_717_2",
    representedRowCount: 1,
    measuredDeltaLwDb: 22,
    sourceOwnedFields: ["metric_value", "topology_and_support_family"],
    runtimeValueMovement: false,
    sourceOwnerPosture: "annex_or_companion_inferred_metric",
  },
  {
    id: "regupol_sonus_core_5_steel_c_joist_astm_iic_report",
    sourceLabel: "REGUPOL sonus core 5 steel C-joist IIC/STC report",
    sourceUrl:
      "https://acoustics.regupol.com/products/range/regupol-sonus-core/regupol-sonus-core-5/",
    sourceKind: "field_astm_or_building_prediction_delta_lw",
    basis: "field_or_astm_basis",
    representedRowCount: 1,
    measuredDeltaLwDb: null,
    sourceOwnedFields: ["topology_and_support_family", "lower_support_class"],
    runtimeValueMovement: false,
    sourceOwnerPosture: "wrong_basis_astm_iic_or_building_prediction",
  },
] as const satisfies readonly GateALCurrentCandidateInput[];

const futureAcceptanceProbeInput = {
  id: "future_source_owned_same_stack_lab_delta_lw_packet_acceptance_probe",
  sourceLabel: "Future rights-safe same-stack ISO DeltaLw packet",
  sourceUrl: null,
  sourceKind: "source_owned_same_stack_lab_delta_lw",
  basis: "lab_iso_10140_717_2",
  representedRowCount: 1,
  measuredDeltaLwDb: 23,
  sourceOwnedFields: STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
  runtimeValueMovement: false,
  sourceOwnerPosture: "fully_source_owned_same_stack_metric",
} as const satisfies GateALCurrentCandidateInput;

export const GATE_AL_STEEL_FLOOR_FORMULA_SOURCE_OWNED_DELTA_LW_FIRST_HOLDOUT_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-am-steel-floor-formula-source-owned-delta-lw-source-packet-acquisition-contract.test.ts";

export const GATE_AL_STEEL_FLOOR_FORMULA_SOURCE_OWNED_DELTA_LW_FIRST_HOLDOUT_SELECTED_NEXT_ACTION =
  "gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan";

export type GateALSteelFloorFormulaSourceOwnedDeltaLwFirstHoldoutContract = {
  readonly landedGate: "gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan";
  readonly previousLandedGate: "gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan";
  readonly selectionStatus: "gate_al_source_owned_delta_lw_first_holdout_guard_landed_no_runtime_selected_source_packet_acquisition_gate_am";
  readonly selectedNextFile: typeof GATE_AL_STEEL_FLOOR_FORMULA_SOURCE_OWNED_DELTA_LW_FIRST_HOLDOUT_SELECTED_NEXT_FILE;
  readonly selectedNextAction: typeof GATE_AL_STEEL_FLOOR_FORMULA_SOURCE_OWNED_DELTA_LW_FIRST_HOLDOUT_SELECTED_NEXT_ACTION;
  readonly currentNearMissCandidates: readonly GateALSteelFloorFormulaFirstSourceOwnedDeltaLwCandidate[];
  readonly currentAcceptedSourceOwnedHoldoutIds: readonly string[];
  readonly acceptedMeasuredHoldoutCount: number;
  readonly requiredMeasuredHoldoutCount: number;
  readonly futureAcceptanceProbe: GateALSteelFloorFormulaFirstSourceOwnedDeltaLwCandidate;
  readonly sourcePacketDecision: {
    readonly canPromoteOrRetuneRuntimeNow: false;
    readonly noAcceptedPacketReason: "current_inventory_has_no_source_owned_same_stack_lab_delta_lw_metric";
    readonly requiredOwnerFields: readonly string[];
    readonly rejectedNearMissPostures: readonly GateALSourceOwnerPosture[];
  };
  readonly residualPolicyAfterGateAL: {
    readonly runtimeValueMovement: false;
    readonly runtimeRetuneAllowedNow: false;
    readonly deltaLwMeasuredHoldoutsSatisfied: false;
    readonly deltaLwBlockers: readonly string[];
  };
};

export const buildGateALSteelFloorFormulaSourceOwnedDeltaLwFirstHoldoutContract =
  (): GateALSteelFloorFormulaSourceOwnedDeltaLwFirstHoldoutContract => {
    const gateAK =
      buildGateAKSteelFloorFormulaSourceOwnedDeltaLwHoldoutContract();
    const currentNearMissCandidates =
      currentNearMissCandidateInputs.map(buildCandidate);
    const currentAcceptedSourceOwnedHoldoutIds = currentNearMissCandidates
      .filter((candidate) => candidate.countsTowardFormulaResidual)
      .map((candidate) => candidate.id);
    const futureAcceptanceProbe = buildCandidate(futureAcceptanceProbeInput);

    return {
      landedGate:
        "gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan",
      previousLandedGate:
        "gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan",
      selectionStatus:
        "gate_al_source_owned_delta_lw_first_holdout_guard_landed_no_runtime_selected_source_packet_acquisition_gate_am",
      selectedNextFile:
        GATE_AL_STEEL_FLOOR_FORMULA_SOURCE_OWNED_DELTA_LW_FIRST_HOLDOUT_SELECTED_NEXT_FILE,
      selectedNextAction:
        GATE_AL_STEEL_FLOOR_FORMULA_SOURCE_OWNED_DELTA_LW_FIRST_HOLDOUT_SELECTED_NEXT_ACTION,
      currentNearMissCandidates,
      currentAcceptedSourceOwnedHoldoutIds,
      acceptedMeasuredHoldoutCount: currentAcceptedSourceOwnedHoldoutIds.length,
      requiredMeasuredHoldoutCount: gateAK.requiredMeasuredHoldoutCount,
      futureAcceptanceProbe,
      sourcePacketDecision: {
        canPromoteOrRetuneRuntimeNow: false,
        noAcceptedPacketReason:
          "current_inventory_has_no_source_owned_same_stack_lab_delta_lw_metric",
        requiredOwnerFields: [
          ...STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
        ],
        rejectedNearMissPostures: [
          ...new Set(
            currentNearMissCandidates.map(
              (candidate) => candidate.sourceOwnerPosture,
            ),
          ),
        ],
      },
      residualPolicyAfterGateAL: {
        runtimeValueMovement: false,
        runtimeRetuneAllowedNow: false,
        deltaLwMeasuredHoldoutsSatisfied: false,
        deltaLwBlockers: gateAK.residualPolicyAfterGateAK.deltaLwBlockers,
      },
    };
  };

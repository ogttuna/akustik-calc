import {
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
  evaluateSteelFloorDeltaLwHoldoutPacket,
  type SteelFloorDeltaLwHoldoutPacket,
  type SteelFloorDeltaLwHoldoutPacketInput,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import { buildGateALSteelFloorFormulaSourceOwnedDeltaLwFirstHoldoutContract } from "./steel-floor-formula-first-source-owned-delta-lw-holdout";

export const GATE_AM_STEEL_FLOOR_FORMULA_SOURCE_PACKET_ACQUISITION_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-an-steel-floor-formula-source-absent-uncertainty-contract.test.ts";

export const GATE_AM_STEEL_FLOOR_FORMULA_SOURCE_PACKET_ACQUISITION_SELECTED_NEXT_ACTION =
  "gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan";

export type GateAMSourcePacketLeadKind =
  | "candidate_system_table"
  | "candidate_test_report_index"
  | "candidate_reference_floor_delta_lw"
  | "basis_boundary_reference";

export type GateAMSourcePacketAcquisitionDecision =
  | "accepted_source_owned_same_stack_iso_delta_lw_packet"
  | "rejected_no_delta_lw_metric"
  | "rejected_reference_floor_not_same_stack_steel"
  | "rejected_wrong_metric_basis_astm_iic_stc"
  | "rejected_boundary_reference_not_candidate_packet";

export type GateAMSourcePacketLeadInput = SteelFloorDeltaLwHoldoutPacketInput & {
  readonly sourceLabel: string;
  readonly sourceUrl: string;
  readonly sourcePacketLeadKind: GateAMSourcePacketLeadKind;
  readonly acquisitionDecision: GateAMSourcePacketAcquisitionDecision;
  readonly sourceEvidenceSummary: string;
};

export type GateAMSourcePacketLead = SteelFloorDeltaLwHoldoutPacket & {
  readonly sourceLabel: string;
  readonly sourceUrl: string;
  readonly sourcePacketLeadKind: GateAMSourcePacketLeadKind;
  readonly acquisitionDecision: GateAMSourcePacketAcquisitionDecision;
  readonly sourceEvidenceSummary: string;
};

const buildSourcePacketLead = (input: GateAMSourcePacketLeadInput): GateAMSourcePacketLead => {
  const {
    acquisitionDecision,
    sourceEvidenceSummary,
    sourceLabel,
    sourcePacketLeadKind,
    sourceUrl,
    ...packetInput
  } = input;

  return {
    ...evaluateSteelFloorDeltaLwHoldoutPacket(packetInput),
    acquisitionDecision,
    sourceEvidenceSummary,
    sourceLabel,
    sourcePacketLeadKind,
    sourceUrl,
  };
};

const gateAMSourcePacketLeadInputs = [
  {
    id: "regupol_us_l0146_steel_deck_steel_joist_stc_iic_only",
    sourceLabel: "REGUPOL US L0146 steel deck over steel joist rows",
    sourceUrl: "https://acoustics.regupol.us/downloads/test-reports/",
    sourcePacketLeadKind: "candidate_test_report_index",
    sourceKind: "field_astm_or_building_prediction_delta_lw",
    basis: "field_or_astm_basis",
    representedRowCount: 2,
    measuredDeltaLwDb: null,
    sourceOwnedFields: [
      "topology_and_support_family",
      "carrier_spacing",
      "lower_support_class",
      "upper_resilient_topology",
    ],
    runtimeValueMovement: false,
    acquisitionDecision: "rejected_wrong_metric_basis_astm_iic_stc",
    sourceEvidenceSummary:
      "The steel deck / steel joist rows expose STC and IIC, not ISO lab DeltaLw, so they cannot own the metric for the steel-floor DeltaLw residual.",
  },
  {
    id: "regupol_global_sonus_core_5_steel_c_joist_iic_stc_only",
    sourceLabel: "REGUPOL sonus core 5 steel C-joist report family",
    sourceUrl:
      "https://acoustics.regupol.com/products/range/regupol-sonus-core/regupol-sonus-core-5/",
    sourcePacketLeadKind: "candidate_test_report_index",
    sourceKind: "field_astm_or_building_prediction_delta_lw",
    basis: "field_or_astm_basis",
    representedRowCount: 1,
    measuredDeltaLwDb: null,
    sourceOwnedFields: ["topology_and_support_family", "lower_support_class"],
    runtimeValueMovement: false,
    acquisitionDecision: "rejected_wrong_metric_basis_astm_iic_stc",
    sourceEvidenceSummary:
      "The checked steel C-joist evidence is useful wrong-basis context but publishes IIC/STC scope rather than same-stack ISO lab DeltaLw.",
  },
  {
    id: "regupol_us_sonusfit_solid_reference_iso_delta_lw_only",
    sourceLabel: "REGUPOL sonusfit solid-reference ISO DeltaLw rows",
    sourceUrl: "https://acoustics.regupol.us/downloads/test-reports/",
    sourcePacketLeadKind: "candidate_reference_floor_delta_lw",
    sourceKind: "product_catalog_delta_lw",
    basis: "lab_iso_10140_717_2",
    representedRowCount: 4,
    measuredDeltaLwDb: 27,
    sourceOwnedFields: ["metric_value", "load_basis"],
    runtimeValueMovement: false,
    acquisitionDecision: "rejected_reference_floor_not_same_stack_steel",
    sourceEvidenceSummary:
      "The rows publish DeltaLw according to DIN EN ISO 10140 on a solid reference ceiling; they do not own the same-stack steel carrier, lower support, or upper topology required by Gate AK.",
  },
  {
    id: "regupol_us_concrete_over_sonus_curve_15_concrete_reference_delta_lw",
    sourceLabel: "REGUPOL concrete over sonus curve 15 over concrete slab",
    sourceUrl: "https://acoustics.regupol.us/downloads/test-reports/",
    sourcePacketLeadKind: "candidate_reference_floor_delta_lw",
    sourceKind: "product_catalog_delta_lw",
    basis: "lab_iso_10140_717_2",
    representedRowCount: 1,
    measuredDeltaLwDb: 26,
    sourceOwnedFields: ["metric_value", "load_basis", "upper_resilient_topology"],
    runtimeValueMovement: false,
    acquisitionDecision: "rejected_reference_floor_not_same_stack_steel",
    sourceEvidenceSummary:
      "The DeltaLw row is concrete-on-concrete reference evidence, not a steel-floor same-stack holdout for the lightweight-steel formula corridor.",
  },
  {
    id: "soundadvisor_iso_delta_lw_boundary_concrete_reference_only",
    sourceLabel: "SoundAdvisor ISO DeltaLw scope boundary",
    sourceUrl: "https://philadelphia.soundadvisor.com/",
    sourcePacketLeadKind: "basis_boundary_reference",
    sourceKind: "product_catalog_delta_lw",
    basis: "lab_iso_10140_717_2",
    representedRowCount: 0,
    measuredDeltaLwDb: null,
    sourceOwnedFields: [],
    runtimeValueMovement: false,
    acquisitionDecision: "rejected_boundary_reference_not_candidate_packet",
    sourceEvidenceSummary:
      "The boundary reference says ISO DeltaLw is a weighted difference against a 150 mm concrete slab without ceiling; it helps guard metric scope but is not a steel-floor packet.",
  },
] as const satisfies readonly GateAMSourcePacketLeadInput[];

export type GateAMSteelFloorFormulaSourcePacketAcquisitionContract = {
  readonly landedGate: "gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan";
  readonly previousLandedGate: "gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan";
  readonly selectionStatus: "gate_am_source_packet_acquisition_landed_no_runtime_selected_source_absent_uncertainty_gate_an";
  readonly selectedNextFile: typeof GATE_AM_STEEL_FLOOR_FORMULA_SOURCE_PACKET_ACQUISITION_SELECTED_NEXT_FILE;
  readonly selectedNextAction: typeof GATE_AM_STEEL_FLOOR_FORMULA_SOURCE_PACKET_ACQUISITION_SELECTED_NEXT_ACTION;
  readonly acquisitionScope: {
    readonly narrowSearchOnly: true;
    readonly broadSourceLibraryCrawlAllowedNext: false;
    readonly formulaFirstNextStep: true;
    readonly sourceRowsAreHoldoutsOrCalibrationNotProduct: true;
  };
  readonly searchedSourcePacketLeads: readonly GateAMSourcePacketLead[];
  readonly priorNearMissCandidateCount: number;
  readonly acceptedSourcePacketIds: readonly string[];
  readonly acceptedMeasuredHoldoutCount: number;
  readonly requiredMeasuredHoldoutCount: number;
  readonly sourcePacketDecision: {
    readonly decision: "no_qualifying_source_owned_same_stack_iso_delta_lw_packet_found";
    readonly requiredOwnerFields: readonly string[];
    readonly rejectedDecisionBuckets: readonly GateAMSourcePacketAcquisitionDecision[];
    readonly noRuntimeRetuneReason: "no_source_owned_delta_lw_holdout_and_no_formula_recalibration_owner";
  };
  readonly residualPolicyAfterGateAM: {
    readonly runtimeValueMovement: false;
    readonly runtimeRetuneAllowedNow: false;
    readonly deltaLwMeasuredHoldoutsSatisfied: false;
    readonly deltaLwBlockers: readonly string[];
  };
};

export const buildGateAMSteelFloorFormulaSourcePacketAcquisitionContract =
  (): GateAMSteelFloorFormulaSourcePacketAcquisitionContract => {
    const gateAL = buildGateALSteelFloorFormulaSourceOwnedDeltaLwFirstHoldoutContract();
    const searchedSourcePacketLeads = gateAMSourcePacketLeadInputs.map(buildSourcePacketLead);
    const acceptedSourcePacketIds = searchedSourcePacketLeads
      .filter((lead) => lead.countsTowardFormulaResidual)
      .map((lead) => lead.id);

    return {
      landedGate:
        "gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan",
      previousLandedGate:
        "gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan",
      selectionStatus:
        "gate_am_source_packet_acquisition_landed_no_runtime_selected_source_absent_uncertainty_gate_an",
      selectedNextFile:
        GATE_AM_STEEL_FLOOR_FORMULA_SOURCE_PACKET_ACQUISITION_SELECTED_NEXT_FILE,
      selectedNextAction:
        GATE_AM_STEEL_FLOOR_FORMULA_SOURCE_PACKET_ACQUISITION_SELECTED_NEXT_ACTION,
      acquisitionScope: {
        narrowSearchOnly: true,
        broadSourceLibraryCrawlAllowedNext: false,
        formulaFirstNextStep: true,
        sourceRowsAreHoldoutsOrCalibrationNotProduct: true,
      },
      searchedSourcePacketLeads,
      priorNearMissCandidateCount: gateAL.currentNearMissCandidates.length,
      acceptedSourcePacketIds,
      acceptedMeasuredHoldoutCount:
        gateAL.acceptedMeasuredHoldoutCount + acceptedSourcePacketIds.length,
      requiredMeasuredHoldoutCount: gateAL.requiredMeasuredHoldoutCount,
      sourcePacketDecision: {
        decision:
          "no_qualifying_source_owned_same_stack_iso_delta_lw_packet_found",
        requiredOwnerFields: [
          ...STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
        ],
        rejectedDecisionBuckets: [
          ...new Set(
            searchedSourcePacketLeads.map((lead) => lead.acquisitionDecision),
          ),
        ],
        noRuntimeRetuneReason:
          "no_source_owned_delta_lw_holdout_and_no_formula_recalibration_owner",
      },
      residualPolicyAfterGateAM: {
        runtimeValueMovement: false,
        runtimeRetuneAllowedNow: false,
        deltaLwMeasuredHoldoutsSatisfied: false,
        deltaLwBlockers: gateAL.residualPolicyAfterGateAL.deltaLwBlockers,
      },
    };
  };

import {
  GATE_AJ_REQUIRED_DELTA_LW_MEASURED_HOLDOUT_COUNT,
  buildGateAJSteelFloorFormulaNegativeBoundaryDeltaLwHoldoutContract,
  residualPolicyBlockersForMetric,
} from "./steel-floor-formula-negative-boundary-delta-lw-intake";
import { buildGateAHSteelFloorFormulaAccuracyBenchmarkContract } from "./steel-floor-formula-accuracy-benchmark";

export const STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS = [
  "metric_value",
  "topology_and_support_family",
  "carrier_spacing",
  "load_basis",
  "dynamic_stiffness",
  "lower_support_class",
  "upper_resilient_topology",
  "paired_negative_boundary_owner",
] as const;

export type SteelFloorDeltaLwRequiredSourceOwnerField =
  (typeof STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS)[number];

export type SteelFloorDeltaLwHoldoutBasis =
  | "lab_iso_10140_717_2"
  | "field_or_astm_basis"
  | "building_prediction_basis";

export type SteelFloorDeltaLwHoldoutSourceKind =
  | "source_owned_same_stack_lab_delta_lw"
  | "ln_w_only_system_table"
  | "product_catalog_delta_lw"
  | "annex_c_or_companion_inferred_delta_lw"
  | "field_astm_or_building_prediction_delta_lw";

export type SteelFloorDeltaLwHoldoutDecision =
  | "accepted_source_owned_delta_lw_holdout"
  | "rejected_missing_source_ownership"
  | "rejected_product_catalog_or_inferred"
  | "rejected_wrong_basis";

export type SteelFloorDeltaLwHoldoutPacketInput = {
  readonly id: string;
  readonly sourceKind: SteelFloorDeltaLwHoldoutSourceKind;
  readonly basis: SteelFloorDeltaLwHoldoutBasis;
  readonly representedRowCount: number;
  readonly measuredDeltaLwDb: number | null;
  readonly sourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
  readonly runtimeValueMovement: false;
};

export type SteelFloorDeltaLwHoldoutPacket = SteelFloorDeltaLwHoldoutPacketInput & {
  readonly decision: SteelFloorDeltaLwHoldoutDecision;
  readonly countsTowardFormulaResidual: boolean;
  readonly missingSourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
  readonly reason: string;
};

export type GateAKSteelFloorFormulaSourceOwnedDeltaLwHoldoutContract = {
  readonly landedGate: "gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan";
  readonly previousLandedGate: "gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan";
  readonly selectionStatus: "gate_ak_delta_lw_holdout_packet_contract_landed_selected_first_source_owned_holdout_gate_al";
  readonly selectedNextFile: "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts";
  readonly selectedNextAction: "gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan";
  readonly requiredMeasuredHoldoutCount: number;
  readonly acceptedMeasuredHoldoutCount: number;
  readonly sourceOwnedPacketContract: {
    readonly requiredSourceOwnedFields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[];
    readonly acceptsProductCatalogDeltaLw: false;
    readonly acceptsAnnexOrCompanionInferredDeltaLw: false;
    readonly acceptsFieldOrBuildingBasisDeltaLw: false;
    readonly exactMeasuredRowsRemainPrecedence: true;
    readonly sourceRowsAreCalibrationEvidenceNotProductCatalog: true;
  };
  readonly localCandidateAudit: readonly SteelFloorDeltaLwHoldoutPacket[];
  readonly residualPolicyAfterGateAK: {
    readonly runtimeRetuneAllowedNow: false;
    readonly runtimeValueMovement: false;
    readonly deltaLwBlockers: readonly string[];
    readonly lnWBlockers: readonly string[];
    readonly pairedNegativeBoundaryCount: number;
  };
};

const REQUIRED_FIELD_SET = new Set<SteelFloorDeltaLwRequiredSourceOwnerField>(
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
);

const uniqueOwnerFields = (
  fields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[],
): readonly SteelFloorDeltaLwRequiredSourceOwnerField[] => {
  const accepted = new Set<SteelFloorDeltaLwRequiredSourceOwnerField>();
  for (const field of fields) {
    if (REQUIRED_FIELD_SET.has(field)) {
      accepted.add(field);
    }
  }
  return STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS.filter((field) =>
    accepted.has(field),
  );
};

const missingOwnerFields = (
  fields: readonly SteelFloorDeltaLwRequiredSourceOwnerField[],
): readonly SteelFloorDeltaLwRequiredSourceOwnerField[] => {
  const owned = new Set(uniqueOwnerFields(fields));
  return STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS.filter((field) => !owned.has(field));
};

export const evaluateSteelFloorDeltaLwHoldoutPacket = (
  packet: SteelFloorDeltaLwHoldoutPacketInput,
): SteelFloorDeltaLwHoldoutPacket => {
  const sourceOwnedFields = uniqueOwnerFields(packet.sourceOwnedFields);
  const missingSourceOwnedFields = missingOwnerFields(sourceOwnedFields);
  const hasMeasuredDeltaLw =
    typeof packet.measuredDeltaLwDb === "number" && Number.isFinite(packet.measuredDeltaLwDb);
  const runtimeValueMovement = false as const;

  if (packet.basis !== "lab_iso_10140_717_2") {
    return {
      ...packet,
      sourceOwnedFields,
      missingSourceOwnedFields,
      runtimeValueMovement,
      decision: "rejected_wrong_basis",
      countsTowardFormulaResidual: false,
      reason:
        "Steel-floor formula residual tightening is lab DeltaLw only; field, ASTM, and building-prediction bases need separate owners.",
    };
  }

  if (
    packet.sourceKind === "product_catalog_delta_lw" ||
    packet.sourceKind === "annex_c_or_companion_inferred_delta_lw"
  ) {
    return {
      ...packet,
      sourceOwnedFields,
      missingSourceOwnedFields,
      runtimeValueMovement,
      decision: "rejected_product_catalog_or_inferred",
      countsTowardFormulaResidual: false,
      reason:
        "Product-only, Annex C, and companion-inferred DeltaLw values can inform context but cannot tighten the same-stack steel-floor formula residual.",
    };
  }

  if (
    packet.sourceKind !== "source_owned_same_stack_lab_delta_lw" ||
    !hasMeasuredDeltaLw ||
    missingSourceOwnedFields.length > 0
  ) {
    return {
      ...packet,
      sourceOwnedFields,
      missingSourceOwnedFields,
      runtimeValueMovement,
      decision: "rejected_missing_source_ownership",
      countsTowardFormulaResidual: false,
      reason:
        "A DeltaLw holdout must own the measured metric plus topology, carrier, load, resilient, support, and paired-negative boundary metadata.",
    };
  }

  return {
    ...packet,
    sourceOwnedFields,
    missingSourceOwnedFields,
    runtimeValueMovement,
    decision: "accepted_source_owned_delta_lw_holdout",
    countsTowardFormulaResidual: true,
    reason:
      "Same-stack lab DeltaLw value and every formula-relevant owner field are source-owned.",
  };
};

export const buildGateAKSteelFloorFormulaSourceOwnedDeltaLwHoldoutContract =
  (): GateAKSteelFloorFormulaSourceOwnedDeltaLwHoldoutContract => {
    const gateAH = buildGateAHSteelFloorFormulaAccuracyBenchmarkContract();
    const gateAJ = buildGateAJSteelFloorFormulaNegativeBoundaryDeltaLwHoldoutContract();

    const localCandidateAudit = [
      evaluateSteelFloorDeltaLwHoldoutPacket({
        id: "pliteq_steel_joist_ln_w_only_rows",
        sourceKind: "ln_w_only_system_table",
        basis: "lab_iso_10140_717_2",
        representedRowCount: gateAH.sourceAnchorInventory.pliteqSteelJoistHoldoutRows,
        measuredDeltaLwDb: null,
        sourceOwnedFields: ["topology_and_support_family", "paired_negative_boundary_owner"],
        runtimeValueMovement: false,
      }),
      evaluateSteelFloorDeltaLwHoldoutPacket({
        id: "ubiq_open_web_ln_w_ci_anchor_rows",
        sourceKind: "ln_w_only_system_table",
        basis: "lab_iso_10140_717_2",
        representedRowCount: gateAH.sourceAnchorInventory.ubiqOpenWebExactAnchorRows,
        measuredDeltaLwDb: null,
        sourceOwnedFields: ["topology_and_support_family", "paired_negative_boundary_owner"],
        runtimeValueMovement: false,
      }),
      evaluateSteelFloorDeltaLwHoldoutPacket({
        id: "impact_product_catalog_delta_lw_rows",
        sourceKind: "product_catalog_delta_lw",
        basis: "lab_iso_10140_717_2",
        representedRowCount: 1,
        measuredDeltaLwDb: 26,
        sourceOwnedFields: ["metric_value"],
        runtimeValueMovement: false,
      }),
      evaluateSteelFloorDeltaLwHoldoutPacket({
        id: "annex_c_or_companion_inferred_delta_lw_rows",
        sourceKind: "annex_c_or_companion_inferred_delta_lw",
        basis: "lab_iso_10140_717_2",
        representedRowCount: 1,
        measuredDeltaLwDb: 24,
        sourceOwnedFields: ["metric_value"],
        runtimeValueMovement: false,
      }),
      evaluateSteelFloorDeltaLwHoldoutPacket({
        id: "field_or_building_basis_delta_lw_rows",
        sourceKind: "field_astm_or_building_prediction_delta_lw",
        basis: "field_or_astm_basis",
        representedRowCount: 1,
        measuredDeltaLwDb: 26,
        sourceOwnedFields: ["metric_value", "topology_and_support_family"],
        runtimeValueMovement: false,
      }),
    ] as const;

    return {
      landedGate: "gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan",
      previousLandedGate:
        "gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan",
      selectionStatus:
        "gate_ak_delta_lw_holdout_packet_contract_landed_selected_first_source_owned_holdout_gate_al",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts",
      selectedNextAction: "gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan",
      requiredMeasuredHoldoutCount: GATE_AJ_REQUIRED_DELTA_LW_MEASURED_HOLDOUT_COUNT,
      acceptedMeasuredHoldoutCount: localCandidateAudit.filter(
        (packet) => packet.countsTowardFormulaResidual,
      ).length,
      sourceOwnedPacketContract: {
        requiredSourceOwnedFields: STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
        acceptsProductCatalogDeltaLw: false,
        acceptsAnnexOrCompanionInferredDeltaLw: false,
        acceptsFieldOrBuildingBasisDeltaLw: false,
        exactMeasuredRowsRemainPrecedence: true,
        sourceRowsAreCalibrationEvidenceNotProductCatalog: true,
      },
      localCandidateAudit,
      residualPolicyAfterGateAK: {
        runtimeRetuneAllowedNow: false,
        runtimeValueMovement: false,
        deltaLwBlockers: residualPolicyBlockersForMetric(gateAJ, "DeltaLw"),
        lnWBlockers: residualPolicyBlockersForMetric(gateAJ, "Ln,w"),
        pairedNegativeBoundaryCount:
          gateAJ.currentResidualPolicyAfterGateAJ.pairedNegativeBoundaryCount,
      },
    };
  };

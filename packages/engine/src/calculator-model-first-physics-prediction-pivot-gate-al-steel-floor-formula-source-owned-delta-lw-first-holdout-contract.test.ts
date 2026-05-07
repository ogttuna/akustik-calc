import { describe, expect, it } from "vitest";

import {
  GATE_AL_STEEL_FLOOR_FORMULA_SOURCE_OWNED_DELTA_LW_FIRST_HOLDOUT_SELECTED_NEXT_ACTION,
  GATE_AL_STEEL_FLOOR_FORMULA_SOURCE_OWNED_DELTA_LW_FIRST_HOLDOUT_SELECTED_NEXT_FILE,
  buildGateALSteelFloorFormulaSourceOwnedDeltaLwFirstHoldoutContract,
} from "./steel-floor-formula-first-source-owned-delta-lw-holdout";

describe("calculator model-first physics prediction pivot Gate AL - steel floor formula source-owned DeltaLw first holdout", () => {
  it("lands Gate AL as a strict source-owned DeltaLw holdout guard and selects Gate AM", () => {
    const contract =
      buildGateALSteelFloorFormulaSourceOwnedDeltaLwFirstHoldoutContract();

    expect(contract.landedGate).toBe(
      "gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan",
    );
    expect(contract.previousLandedGate).toBe(
      "gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan",
    );
    expect(contract.selectionStatus).toBe(
      "gate_al_source_owned_delta_lw_first_holdout_guard_landed_no_runtime_selected_source_packet_acquisition_gate_am",
    );
    expect(contract.selectedNextFile).toBe(
      GATE_AL_STEEL_FLOOR_FORMULA_SOURCE_OWNED_DELTA_LW_FIRST_HOLDOUT_SELECTED_NEXT_FILE,
    );
    expect(contract.selectedNextAction).toBe(
      GATE_AL_STEEL_FLOOR_FORMULA_SOURCE_OWNED_DELTA_LW_FIRST_HOLDOUT_SELECTED_NEXT_ACTION,
    );
  });

  it("does not count Ln,w-only, product, inferred, or wrong-basis rows as current DeltaLw holdouts", () => {
    const contract =
      buildGateALSteelFloorFormulaSourceOwnedDeltaLwFirstHoldoutContract();

    expect(contract.acceptedMeasuredHoldoutCount).toBe(0);
    expect(contract.currentAcceptedSourceOwnedHoldoutIds).toEqual([]);
    expect(contract.currentNearMissCandidates).toHaveLength(5);
    expect(
      contract.currentNearMissCandidates.every(
        (candidate) => candidate.countsTowardFormulaResidual === false,
      ),
    ).toBe(true);
    expect(
      contract.currentNearMissCandidates.map((candidate) => [
        candidate.id,
        candidate.decision,
      ]),
    ).toEqual([
      [
        "pliteq_genieclip_steel_joist_system_table_ln_w_only_rows",
        "rejected_missing_source_ownership",
      ],
      [
        "ubiq_open_web_exact_rows_ln_w_rw_no_delta_lw",
        "rejected_missing_source_ownership",
      ],
      [
        "product_catalog_resilient_underlay_delta_lw_only",
        "rejected_product_catalog_or_inferred",
      ],
      [
        "annex_c_or_companion_inferred_delta_lw_reference",
        "rejected_product_catalog_or_inferred",
      ],
      [
        "regupol_sonus_core_5_steel_c_joist_astm_iic_report",
        "rejected_wrong_basis",
      ],
    ]);
    expect(contract.sourcePacketDecision.rejectedNearMissPostures).toEqual([
      "ln_w_or_rw_only_no_delta_lw_metric",
      "product_catalog_metric_not_same_stack",
      "annex_or_companion_inferred_metric",
      "wrong_basis_astm_iic_or_building_prediction",
    ]);
  });

  it("proves a future same-stack ISO DeltaLw packet is acceptable only when all owner fields are source-owned", () => {
    const contract =
      buildGateALSteelFloorFormulaSourceOwnedDeltaLwFirstHoldoutContract();

    expect(contract.futureAcceptanceProbe.id).toBe(
      "future_source_owned_same_stack_lab_delta_lw_packet_acceptance_probe",
    );
    expect(contract.futureAcceptanceProbe.decision).toBe(
      "accepted_source_owned_delta_lw_holdout",
    );
    expect(contract.futureAcceptanceProbe.countsTowardFormulaResidual).toBe(
      true,
    );
    expect(contract.currentAcceptedSourceOwnedHoldoutIds).not.toContain(
      contract.futureAcceptanceProbe.id,
    );
    expect(contract.sourcePacketDecision.requiredOwnerFields).toEqual([
      "metric_value",
      "topology_and_support_family",
      "carrier_spacing",
      "load_basis",
      "dynamic_stiffness",
      "lower_support_class",
      "upper_resilient_topology",
      "paired_negative_boundary_owner",
    ]);
  });

  it("keeps DeltaLw residual policy in hold posture until measured holdouts exist", () => {
    const contract =
      buildGateALSteelFloorFormulaSourceOwnedDeltaLwFirstHoldoutContract();

    expect(contract.sourcePacketDecision.canPromoteOrRetuneRuntimeNow).toBe(
      false,
    );
    expect(contract.sourcePacketDecision.noAcceptedPacketReason).toBe(
      "current_inventory_has_no_source_owned_same_stack_lab_delta_lw_metric",
    );
    expect(contract.residualPolicyAfterGateAL.runtimeValueMovement).toBe(false);
    expect(contract.residualPolicyAfterGateAL.runtimeRetuneAllowedNow).toBe(
      false,
    );
    expect(
      contract.residualPolicyAfterGateAL.deltaLwMeasuredHoldoutsSatisfied,
    ).toBe(false);
    expect(contract.residualPolicyAfterGateAL.deltaLwBlockers).toContain(
      "delta_lw_measured_holdouts_missing",
    );
    expect(contract.residualPolicyAfterGateAL.deltaLwBlockers).toContain(
      "source_owned_metric_holdouts_missing",
    );
  });
});

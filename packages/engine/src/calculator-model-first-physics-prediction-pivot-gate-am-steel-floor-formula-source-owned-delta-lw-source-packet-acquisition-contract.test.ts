import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AM_STEEL_FLOOR_FORMULA_SOURCE_PACKET_ACQUISITION_SELECTED_NEXT_ACTION,
  GATE_AM_STEEL_FLOOR_FORMULA_SOURCE_PACKET_ACQUISITION_SELECTED_NEXT_FILE,
  buildGateAMSteelFloorFormulaSourcePacketAcquisitionContract,
} from "./steel-floor-formula-source-owned-delta-lw-source-packet-acquisition";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> => readFile(join(REPO_ROOT, path), "utf8");

describe("calculator model-first physics prediction pivot Gate AM - steel floor source-owned DeltaLw source packet acquisition", () => {
  it("lands Gate AM without moving runtime values and selects source-absent uncertainty Gate AN", () => {
    const contract = buildGateAMSteelFloorFormulaSourcePacketAcquisitionContract();

    expect(contract.landedGate).toBe(
      "gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan",
    );
    expect(contract.previousLandedGate).toBe(
      "gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan",
    );
    expect(contract.selectionStatus).toBe(
      "gate_am_source_packet_acquisition_landed_no_runtime_selected_source_absent_uncertainty_gate_an",
    );
    expect(contract.selectedNextFile).toBe(
      GATE_AM_STEEL_FLOOR_FORMULA_SOURCE_PACKET_ACQUISITION_SELECTED_NEXT_FILE,
    );
    expect(contract.selectedNextAction).toBe(
      GATE_AM_STEEL_FLOOR_FORMULA_SOURCE_PACKET_ACQUISITION_SELECTED_NEXT_ACTION,
    );
    expect(contract.residualPolicyAfterGateAM.runtimeValueMovement).toBe(false);
    expect(contract.residualPolicyAfterGateAM.runtimeRetuneAllowedNow).toBe(
      false,
    );
  });

  it("rejects narrow source leads that do not own same-stack ISO lab DeltaLw", () => {
    const contract = buildGateAMSteelFloorFormulaSourcePacketAcquisitionContract();
    const leadsById = new Map(
      contract.searchedSourcePacketLeads.map((lead) => [lead.id, lead]),
    );

    expect(contract.priorNearMissCandidateCount).toBe(5);
    expect(contract.searchedSourcePacketLeads).toHaveLength(5);
    expect(contract.acceptedSourcePacketIds).toEqual([]);
    expect(contract.acceptedMeasuredHoldoutCount).toBe(0);
    expect(contract.requiredMeasuredHoldoutCount).toBe(3);
    expect(
      contract.searchedSourcePacketLeads.every(
        (lead) => lead.countsTowardFormulaResidual === false,
      ),
    ).toBe(true);

    expect(
      leadsById.get("regupol_us_l0146_steel_deck_steel_joist_stc_iic_only")
        ?.acquisitionDecision,
    ).toBe("rejected_wrong_metric_basis_astm_iic_stc");
    expect(
      leadsById.get("regupol_us_l0146_steel_deck_steel_joist_stc_iic_only")
        ?.decision,
    ).toBe("rejected_wrong_basis");

    expect(
      leadsById.get("regupol_global_sonus_core_5_steel_c_joist_iic_stc_only")
        ?.acquisitionDecision,
    ).toBe("rejected_wrong_metric_basis_astm_iic_stc");
    expect(
      leadsById.get("regupol_us_sonusfit_solid_reference_iso_delta_lw_only")
        ?.acquisitionDecision,
    ).toBe("rejected_reference_floor_not_same_stack_steel");
    expect(
      leadsById.get(
        "regupol_us_concrete_over_sonus_curve_15_concrete_reference_delta_lw",
      )?.acquisitionDecision,
    ).toBe("rejected_reference_floor_not_same_stack_steel");
    expect(
      leadsById.get("soundadvisor_iso_delta_lw_boundary_concrete_reference_only")
        ?.acquisitionDecision,
    ).toBe("rejected_boundary_reference_not_candidate_packet");
  });

  it("keeps source acquisition bounded and pivots back to formula-first accuracy work", () => {
    const contract = buildGateAMSteelFloorFormulaSourcePacketAcquisitionContract();

    expect(contract.acquisitionScope).toEqual({
      narrowSearchOnly: true,
      broadSourceLibraryCrawlAllowedNext: false,
      formulaFirstNextStep: true,
      sourceRowsAreHoldoutsOrCalibrationNotProduct: true,
    });
    expect(contract.sourcePacketDecision.decision).toBe(
      "no_qualifying_source_owned_same_stack_iso_delta_lw_packet_found",
    );
    expect(contract.sourcePacketDecision.noRuntimeRetuneReason).toBe(
      "no_source_owned_delta_lw_holdout_and_no_formula_recalibration_owner",
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
    expect(contract.sourcePacketDecision.rejectedDecisionBuckets).toEqual([
      "rejected_wrong_metric_basis_astm_iic_stc",
      "rejected_reference_floor_not_same_stack_steel",
      "rejected_boundary_reference_not_candidate_packet",
    ]);
  });

  it("preserves DeltaLw residual blockers until measured source-owned holdouts exist", () => {
    const contract = buildGateAMSteelFloorFormulaSourcePacketAcquisitionContract();

    expect(
      contract.residualPolicyAfterGateAM.deltaLwMeasuredHoldoutsSatisfied,
    ).toBe(false);
    expect(contract.residualPolicyAfterGateAM.deltaLwBlockers).toEqual(
      expect.arrayContaining([
        "delta_lw_measured_holdouts_missing",
        "source_owned_metric_holdouts_missing",
        "open_web_formula_inputs_not_source_owned",
        "field_and_building_basis_owners_missing",
      ]),
    );
    expect(contract.residualPolicyAfterGateAM.deltaLwBlockers).not.toContain(
      "paired_negative_boundaries_missing",
    );
  });

  it("keeps docs and current-gate runner aligned with Gate AM and next Gate AN", async () => {
    const [agentsDoc, planDoc, stateDoc, sliceDoc, runner] = await Promise.all([
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md"),
      readRepoFile("tools/dev/run-calculator-current-gate.ts"),
    ]);

    for (const content of [agentsDoc, planDoc, stateDoc, sliceDoc]) {
      expect(content).toContain(
        "gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-am-steel-floor-formula-source-owned-delta-lw-source-packet-acquisition-contract.test.ts",
      );
      expect(content).toContain(
        "gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-an-steel-floor-formula-source-absent-uncertainty-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-am-steel-floor-formula-source-owned-delta-lw-source-packet-acquisition-contract.test.ts",
    );
  });
});

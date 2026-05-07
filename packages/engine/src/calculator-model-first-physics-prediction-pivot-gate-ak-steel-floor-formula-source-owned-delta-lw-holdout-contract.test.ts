import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
  buildGateAKSteelFloorFormulaSourceOwnedDeltaLwHoldoutContract,
  evaluateSteelFloorDeltaLwHoldoutPacket,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> => readFile(join(REPO_ROOT, path), "utf8");

describe("calculator model-first physics prediction pivot - Gate AK steel floor source-owned DeltaLw holdout", () => {
  it("lands Gate AK without moving runtime values and selects first source-owned DeltaLw holdout Gate AL", () => {
    const contract = buildGateAKSteelFloorFormulaSourceOwnedDeltaLwHoldoutContract();

    expect(contract.landedGate).toBe(
      "gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan",
    );
    expect(contract.previousLandedGate).toBe(
      "gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan",
    );
    expect(contract.selectionStatus).toBe(
      "gate_ak_delta_lw_holdout_packet_contract_landed_selected_first_source_owned_holdout_gate_al",
    );
    expect(contract.selectedNextFile).toBe(
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts",
    );
    expect(contract.selectedNextAction).toBe(
      "gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan",
    );
    expect(contract.residualPolicyAfterGateAK.runtimeValueMovement).toBe(false);
    expect(contract.residualPolicyAfterGateAK.runtimeRetuneAllowedNow).toBe(false);
  });

  it("requires source ownership for every formula-relevant DeltaLw holdout field", () => {
    const contract = buildGateAKSteelFloorFormulaSourceOwnedDeltaLwHoldoutContract();

    expect(contract.sourceOwnedPacketContract.requiredSourceOwnedFields).toEqual([
      "metric_value",
      "topology_and_support_family",
      "carrier_spacing",
      "load_basis",
      "dynamic_stiffness",
      "lower_support_class",
      "upper_resilient_topology",
      "paired_negative_boundary_owner",
    ]);
    expect(contract.sourceOwnedPacketContract.acceptsProductCatalogDeltaLw).toBe(false);
    expect(contract.sourceOwnedPacketContract.acceptsAnnexOrCompanionInferredDeltaLw).toBe(false);
    expect(contract.sourceOwnedPacketContract.acceptsFieldOrBuildingBasisDeltaLw).toBe(false);

    const acceptedFuturePacket = evaluateSteelFloorDeltaLwHoldoutPacket({
      id: "future_source_owned_same_stack_lab_delta_lw_packet",
      sourceKind: "source_owned_same_stack_lab_delta_lw",
      basis: "lab_iso_10140_717_2",
      representedRowCount: 1,
      measuredDeltaLwDb: 23,
      sourceOwnedFields: STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      runtimeValueMovement: false,
    });

    expect(acceptedFuturePacket.decision).toBe("accepted_source_owned_delta_lw_holdout");
    expect(acceptedFuturePacket.countsTowardFormulaResidual).toBe(true);
    expect(acceptedFuturePacket.missingSourceOwnedFields).toEqual([]);

    const missingMetricOwner = evaluateSteelFloorDeltaLwHoldoutPacket({
      id: "future_packet_missing_metric_owner",
      sourceKind: "source_owned_same_stack_lab_delta_lw",
      basis: "lab_iso_10140_717_2",
      representedRowCount: 1,
      measuredDeltaLwDb: 23,
      sourceOwnedFields: STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS.filter(
        (field) => field !== "metric_value",
      ),
      runtimeValueMovement: false,
    });

    expect(missingMetricOwner.decision).toBe("rejected_missing_source_ownership");
    expect(missingMetricOwner.countsTowardFormulaResidual).toBe(false);
    expect(missingMetricOwner.missingSourceOwnedFields).toContain("metric_value");
  });

  it("audits current local steel-floor candidates without letting LnW, product, inferred, or field values tighten DeltaLw", () => {
    const contract = buildGateAKSteelFloorFormulaSourceOwnedDeltaLwHoldoutContract();
    const packetsById = new Map(contract.localCandidateAudit.map((packet) => [packet.id, packet]));

    expect(contract.acceptedMeasuredHoldoutCount).toBe(0);
    expect(contract.requiredMeasuredHoldoutCount).toBe(3);
    expect(contract.localCandidateAudit).toHaveLength(5);

    const pliteqRows = packetsById.get("pliteq_steel_joist_ln_w_only_rows");
    expect(pliteqRows?.representedRowCount).toBe(3);
    expect(pliteqRows?.decision).toBe("rejected_missing_source_ownership");
    expect(pliteqRows?.missingSourceOwnedFields).toContain("metric_value");

    const ubiqRows = packetsById.get("ubiq_open_web_ln_w_ci_anchor_rows");
    expect(ubiqRows?.representedRowCount).toBe(36);
    expect(ubiqRows?.decision).toBe("rejected_missing_source_ownership");
    expect(ubiqRows?.missingSourceOwnedFields).toEqual(
      expect.arrayContaining([
        "metric_value",
        "carrier_spacing",
        "load_basis",
        "dynamic_stiffness",
        "lower_support_class",
        "upper_resilient_topology",
      ]),
    );

    expect(packetsById.get("impact_product_catalog_delta_lw_rows")?.decision).toBe(
      "rejected_product_catalog_or_inferred",
    );
    expect(packetsById.get("annex_c_or_companion_inferred_delta_lw_rows")?.decision).toBe(
      "rejected_product_catalog_or_inferred",
    );
    expect(packetsById.get("field_or_building_basis_delta_lw_rows")?.decision).toBe(
      "rejected_wrong_basis",
    );

    for (const packet of contract.localCandidateAudit) {
      expect(packet.countsTowardFormulaResidual).toBe(false);
      expect(packet.runtimeValueMovement).toBe(false);
    }
  });

  it("keeps steel-floor residual retuning blocked until measured DeltaLw holdouts are actually source-owned", () => {
    const contract = buildGateAKSteelFloorFormulaSourceOwnedDeltaLwHoldoutContract();

    expect(contract.residualPolicyAfterGateAK.deltaLwBlockers).toEqual(
      expect.arrayContaining([
        "delta_lw_measured_holdouts_missing",
        "source_owned_metric_holdouts_missing",
        "open_web_formula_inputs_not_source_owned",
      ]),
    );
    expect(contract.residualPolicyAfterGateAK.deltaLwBlockers).not.toContain(
      "paired_negative_boundaries_missing",
    );
    expect(contract.residualPolicyAfterGateAK.lnWBlockers).toEqual(
      expect.arrayContaining([
        "holdout_count_below_policy_threshold",
        "open_web_formula_inputs_not_source_owned",
        "field_and_building_basis_owners_missing",
      ]),
    );
    expect(contract.residualPolicyAfterGateAK.pairedNegativeBoundaryCount).toBe(4);
  });

  it("keeps docs and current-gate runner aligned with Gate AK and next Gate AL", async () => {
    const [planDoc, stateDoc, runner] = await Promise.all([
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("tools/dev/run-calculator-current-gate.ts"),
    ]);

    expect(planDoc).toContain(
      "gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan",
    );
    expect(planDoc).toContain(
      "calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts",
    );
    expect(stateDoc).toContain(
      "gate_ak_delta_lw_holdout_packet_contract_landed_selected_first_source_owned_holdout_gate_al",
    );
    expect(runner).toContain(
      "calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts",
    );
  });
});

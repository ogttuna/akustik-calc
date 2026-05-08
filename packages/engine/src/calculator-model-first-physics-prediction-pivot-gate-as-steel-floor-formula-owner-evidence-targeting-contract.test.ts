import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  GATE_AS_STEEL_FLOOR_FORMULA_OWNER_EVIDENCE_TARGETING_SELECTED_NEXT_ACTION,
  GATE_AS_STEEL_FLOOR_FORMULA_OWNER_EVIDENCE_TARGETING_SELECTED_NEXT_FILE,
  buildGateASSteelFloorFormulaOwnerEvidenceTargetingContract,
} from "./steel-floor-formula-owner-evidence-targeting";
import {
  STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
} from "./steel-floor-formula-source-owned-delta-lw-holdout";
import {
  GATE_AJ_REQUIRED_DELTA_LW_MEASURED_HOLDOUT_COUNT,
  GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT,
} from "./steel-floor-formula-negative-boundary-delta-lw-intake";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const readRepoFile = (path: string): Promise<string> =>
  readFile(join(REPO_ROOT, path), "utf8");

describe("calculator model-first physics prediction pivot Gate AS - steel floor formula owner evidence targeting", () => {
  it("lands Gate AS as a no-runtime owner-targeting decision and selects Gate AT", () => {
    const contract =
      buildGateASSteelFloorFormulaOwnerEvidenceTargetingContract();

    expect(contract).toMatchObject({
      landedGate: "gate_as_steel_floor_formula_owner_evidence_targeting_plan",
      previousLandedGate:
        "gate_ar_steel_floor_formula_calibration_evidence_intake_plan",
      selectedImplementationSlice:
        "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction:
        GATE_AS_STEEL_FLOOR_FORMULA_OWNER_EVIDENCE_TARGETING_SELECTED_NEXT_ACTION,
      selectedNextFile:
        GATE_AS_STEEL_FLOOR_FORMULA_OWNER_EVIDENCE_TARGETING_SELECTED_NEXT_FILE,
      selectionStatus:
        "gate_as_owner_evidence_targeting_landed_no_runtime_selected_same_stack_delta_lw_packet_target_gate_at",
    });
    expect(contract.ownerTargetingScope).toEqual({
      broadSourceLibraryCrawlAllowed: false,
      exactRowsAreExactOverridesOnlyOnFullAssemblyMatch: true,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
      sourceRowsAreCalibrationEvidenceNotProduct: true,
    });
  });

  it("ranks every Gate AQ owner by calculator impact and acquisition feasibility", () => {
    const contract =
      buildGateASSteelFloorFormulaOwnerEvidenceTargetingContract();

    expect(contract.rankedOwnerTargets).toHaveLength(7);
    expect(contract.rankedOwnerTargets.map((target) => target.owner)).toEqual([
      "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
      "same_stack_bare_steel_reference_rows",
      "source_owned_steel_transfer_efficiency_curve",
      "frequency_dependent_dynamic_stiffness_or_product_curve_owner",
      "source_owned_load_basis_schedule",
      "lower_ceiling_support_family_holdouts",
      "upper_resilient_topology_holdouts",
    ]);
    expect(contract.rankedOwnerTargets.map((target) => target.priorityRank)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
    expect(
      contract.rankedOwnerTargets.filter((target) => target.selectedForNextGate),
    ).toHaveLength(1);
    expect(
      contract.rankedOwnerTargets.every(
        (target) =>
          target.currentAcceptedPacketIds.length === 0 &&
          target.localLedgerGapScore === 10,
      ),
    ).toBe(true);
    expect(contract.rankedOwnerTargets.map((target) => target.totalPriorityScore)).toEqual([
      122, 103, 89, 83, 76, 69, 63,
    ]);
  });

  it("selects the same-stack ISO DeltaLw packet target with strict owner fields and boundaries", () => {
    const contract =
      buildGateASSteelFloorFormulaOwnerEvidenceTargetingContract();
    const selected = contract.selectedOwnerTarget;

    expect(selected.target).toMatchObject({
      calculatorImpactScore: 10,
      currentAcceptedPacketIds: [],
      evidenceTargetKind: "source_packet_target",
      metricIds: ["Ln,w", "DeltaLw"],
      owner: "accepted_source_owned_same_stack_iso_delta_lw_holdouts",
      priorityRank: 1,
      selectedForNextGate: true,
      termId: "source_owned_delta_lw_holdout_absence",
    });
    expect(selected.target.requiredPacketFields).toEqual([
      ...STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
    ]);
    expect(selected.target.rejectionBoundaries).toEqual([
      "reject_product_or_inferred_delta_lw",
      "reject_astm_iic_stc_field_or_building_basis",
      "reject_concrete_or_solid_reference_floor",
      "reject_boundary_reference_only",
      "reject_missing_source_owned_physical_owner_fields",
      "require_exact_source_only_for_full_assembly_match",
    ]);
    expect(selected.acquisitionPacketShape).toEqual({
      metricBasis: "lab_iso_10140_717_2",
      minimumAcceptedPacketCountBeforeRetune:
        GATE_AJ_REQUIRED_DELTA_LW_MEASURED_HOLDOUT_COUNT,
      minimumPairedNegativeBoundaryCountBeforeRetune:
        GATE_AJ_REQUIRED_NEGATIVE_BOUNDARY_COUNT,
      measuredMetricIds: ["DeltaLw"],
      referenceFloor: "same_stack_steel",
      requiredSourceOwnedFields: [
        ...STEEL_FLOOR_DELTA_LW_REQUIRED_SOURCE_OWNER_FIELDS,
      ],
    });
  });

  it("uses the Gate AR local ledger as the gap signal without accepting current evidence", () => {
    const contract =
      buildGateASSteelFloorFormulaOwnerEvidenceTargetingContract();

    expect(contract.currentLedgerSnapshot.acceptedSourceOwnedPacketIds).toEqual([]);
    expect(contract.currentLedgerSnapshot.rejectedCandidateIds).toHaveLength(10);
    expect(contract.currentLedgerSnapshot.bucketCounts).toEqual([
      { bucket: "accepted_source_owned_calibration_packet", count: 0 },
      { bucket: "rejected_missing_source_owned_owner_field", count: 2 },
      { bucket: "rejected_wrong_metric_basis", count: 3 },
      { bucket: "rejected_reference_floor_not_same_stack_steel", count: 2 },
      { bucket: "rejected_product_or_inferred_metric", count: 2 },
      { bucket: "rejected_boundary_reference_only", count: 1 },
    ]);
  });

  it("keeps runtime pins, exact-source precedence, and lab/field/building separation unchanged", () => {
    const contract =
      buildGateASSteelFloorFormulaOwnerEvidenceTargetingContract();

    expect(contract.runtimePins).toEqual({
      deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      estimateDeltaLw: 22.4,
      estimateLnW: 55.6,
      lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
    });
    expect(contract.exactMeasuredRowsRemainPrecedence).toBe(true);
    expect(contract.fieldAndBuildingBasisSeparation).toEqual({
      fieldOrAstmBasisCanTightenLabCorridor: false,
      labDeltaLwCanAliasFieldMetrics: false,
    });
  });

  it("keeps docs and current-gate runner aligned with Gate AS and selected Gate AT", async () => {
    const [agentsDoc, readmeDoc, planDoc, stateDoc, sliceDoc, runner] =
      await Promise.all([
        readRepoFile("AGENTS.md"),
        readRepoFile("docs/calculator/README.md"),
        readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
        readRepoFile("docs/calculator/CURRENT_STATE.md"),
        readRepoFile(
          "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
        ),
        readRepoFile("tools/dev/run-calculator-current-gate.ts"),
      ]);

    for (const content of [agentsDoc, readmeDoc, planDoc, stateDoc, sliceDoc]) {
      expect(content).toContain(
        "gate_as_steel_floor_formula_owner_evidence_targeting_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts",
      );
      expect(content).toContain(
        "gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan",
      );
      expect(content).toContain(
        "calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts",
      );
    }

    expect(runner).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts",
    );
  });
});

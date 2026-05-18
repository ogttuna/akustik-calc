import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const COMPANY_INTERNAL_MISCLASSIFICATION_READINESS_BLOCKER = {
  apiShapeChange: false,
  companyInternalHighAccuracyOpeningAllowedNow: false,
  confidencePromotion: false,
  controlledCaveatedPilotOnly: true,
  evidencePromotion: false,
  landedAnalysis: "company_internal_misclassification_readiness_blocker_analysis_2026_05_04",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  selectedNextAction:
    "gate_a_revalidate_source_gap_order_after_field_output_guard_and_company_internal_blocker",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const ACTIVE_COMPANY_USE_BLOCKER_IDS = [
  "rockwool_triple_leaf_source_packet_absent",
  "field_output_guard_landed_field_owner_still_required",
  "frequent_combination_lane_sentinel_carry_forward",
  "source_ready_runtime_candidate_absent",
  "hostile_api_import_guard_must_stay_green"
] as const;

const PRE_COMPANY_INTERNAL_USE_EXIT_CRITERIA = [
  "rockwool_triple_leaf_exact_or_explicit_screening_only",
  "field_outputs_never_design_grade_without_owner",
  "frequent_wall_floor_lane_snapshots_green",
  "source_promotion_requires_topology_material_metric_tolerance_negatives_visible_tests",
  "hostile_api_import_payloads_fail_closed",
  "calculator_gate_current_and_full_check_green"
] as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/SLICE_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_PLAN.md"
] as const;

const REQUIRED_RUNNER_TESTS = [
  "src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts",
  "src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts",
  "src/post-common-combination-lane-misclassification-sentinel-v1-next-slice-selection-contract.test.ts",
  "src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts",
  "src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts",
  "src/company-internal-misclassification-readiness-blocker-contract.test.ts",
  "features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts",
  "features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts"
] as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const COMPLETE_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const FIELD_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  ...COMPLETE_TRIPLE_LEAF_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function hasWarning(warnings: readonly string[], pattern: RegExp): boolean {
  return warnings.some((warning) => pattern.test(warning));
}

describe("company-internal misclassification readiness blocker contract", () => {
  it("records the current company-internal high-accuracy opening as blocked without runtime movement", () => {
    expect(COMPANY_INTERNAL_MISCLASSIFICATION_READINESS_BLOCKER).toMatchObject({
      apiShapeChange: false,
      companyInternalHighAccuracyOpeningAllowedNow: false,
      confidencePromotion: false,
      controlledCaveatedPilotOnly: true,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
    expect(ACTIVE_COMPANY_USE_BLOCKER_IDS).toEqual([
      "rockwool_triple_leaf_source_packet_absent",
      "field_output_guard_landed_field_owner_still_required",
      "frequent_combination_lane_sentinel_carry_forward",
      "source_ready_runtime_candidate_absent",
      "hostile_api_import_guard_must_stay_green"
    ]);
    expect(PRE_COMPANY_INTERNAL_USE_EXIT_CRITERIA).toHaveLength(6);
  });

  it("proves the split-rockwool triple-leaf result is still a blocker, not a fixed exact row", () => {
    const lab = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const field = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: FIELD_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(lab.metrics.estimatedRwDb).toBe(53);
    expect(lab.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "multileaf_multicavity",
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor"
    });
    expect(field.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "multileaf_multicavity",
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor"
    });
    expect(Number.isFinite(field.metrics.estimatedRwPrimeDb ?? Number.NaN)).toBe(true);
    expect(Number.isFinite(field.metrics.estimatedDnTwDb ?? Number.NaN)).toBe(true);
    expect(
      hasWarning(lab.warnings, /source-absent formula corridor/i) ||
        hasWarning(field.warnings, /Airborne field-side overlay active/i)
    ).toBe(true);
  });

  it("keeps the active current-gate runner covering lane, source, field-output, and release-blocker guards", () => {
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    for (const testPath of REQUIRED_RUNNER_TESTS) {
      expect(runner).toContain(testPath);
    }
  });

  it("keeps docs aligned on the pre-company-internal-use blocker and exit criteria", () => {
    for (const relativePath of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }

    for (const relativePath of REQUIRED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain("company_internal_high_accuracy_opening_blocked_until_misclassification_blockers_close");
      expect(contents).toContain("pre_company_internal_use_exit_criteria");
      expect(contents).toContain("triple_leaf_like_lane_source_field_errors_are_company_use_blockers");
      expect(contents).toContain(COMPANY_INTERNAL_MISCLASSIFICATION_READINESS_BLOCKER.selectedNextAction);
    }
  });
});

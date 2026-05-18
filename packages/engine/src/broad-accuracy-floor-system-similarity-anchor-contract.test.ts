import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTION_STATUS,
  buildBroadAccuracyFloorSystemSimilarityAnchorContract
} from "./broad-accuracy-floor-system-similarity-anchor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-system-similarity-anchor.ts",
  "packages/engine/src/broad-accuracy-floor-system-similarity-anchor-contract.test.ts",
  "packages/engine/src/broad-accuracy-reference-benchmark-expansion.ts",
  "packages/engine/src/lightweight-steel-fl28-estimate.ts",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md"
] as const;

const FL28_250MM_SIMILARITY_SEED_LAYERS = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 3 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("broad accuracy floor-system similarity anchor contract", () => {
  it("lands the no-runtime floor-system anchor admission gate and selects the narrow open-web runtime corridor", () => {
    const contract = buildBroadAccuracyFloorSystemSimilarityAnchorContract();

    expect(contract).toMatchObject({
      admittedRuntimeMovementThisGate: false,
      landedGate: BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction: BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTION_STATUS,
      weakLaneConvertedToSupportedReadiness: false
    });
    expect(contract.previousBenchmarkExpansion).toEqual({
      selectedNextAction: "broad_accuracy_floor_system_similarity_anchor_runtime_plan",
      selectedNextFile: "packages/engine/src/broad-accuracy-floor-system-similarity-anchor-contract.test.ts",
      selectionStatus:
        "broad_accuracy_reference_benchmark_expansion_landed_no_runtime_selected_floor_system_similarity_anchor"
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("classifies existing open-web and open-box source rows without treating inventory as readiness", () => {
    const contract = buildBroadAccuracyFloorSystemSimilarityAnchorContract();

    expect(contract.anchorInventory).toEqual({
      boundOpenWebCarpetLnWPlusCiRows: 18,
      boundOpenWebFl33LnWUpperBoundRows: 3,
      boundOpenWebSteelRows: 21,
      exactOpenBoxTimberRows: 15,
      exactOpenWebDirectFixedRows: 54,
      exactOpenWebElasticSuspendedRows: 36,
      exactOpenWebFamilyEstimateEligibleRows: 12,
      exactOpenWebSteelRows: 90
    });
    expect(contract.currentRuntimeSeed).toEqual({
      basis: "predictor_lightweight_steel_fl28_interpolation_estimate",
      exactRowsUsed: [
        "ubiq_fl28_open_web_steel_200_exact_lab_2026",
        "ubiq_fl28_open_web_steel_300_exact_lab_2026",
        "ubiq_fl28_open_web_steel_400_exact_lab_2026"
      ],
      status: "existing_narrow_seed_only",
      stillUsesScreeningWarningCopy: true,
      unlockedMetrics: ["Rw", "Ln,w", "Ln,w+CI"]
    });
  });

  it("keeps admission rules strict for metric basis, support family, owner fields, and bound semantics", () => {
    const contract = buildBroadAccuracyFloorSystemSimilarityAnchorContract();

    expect(contract.anchorOwnerFields).toEqual([
      "route",
      "metricBasis",
      "supportFamily",
      "supportForm",
      "carrierDepthMm",
      "carrierSpacingMm",
      "deckOrFloatingPanelThicknessMm",
      "finishPackage",
      "lowerSupportClass",
      "ceilingBoardSchedule",
      "ceilingCavityDepthMm",
      "ceilingFillThicknessMm"
    ]);
    expect(contract.similarityAdmissionRules).toEqual([
      "exact_source_precedence_stays_first",
      "same_route_metric_and_basis_required",
      "lab_impact_rows_cannot_anchor_field_or_building_outputs_without_metric_adapter_owner",
      "iso_lnw_delta_lw_rows_cannot_anchor_astm_iic_aiic",
      "wrong_support_family_or_support_form_is_a_negative_boundary",
      "missing_carrier_depth_spacing_finish_or_lower_assembly_owner_blocks_similarity_runtime",
      "bound_rows_keep_bound_semantics_and_cannot_promote_exact_lnw",
      "familyEstimateEligible_false_rows_can_exact_match_but_do_not_seed_broad_family_runtime"
    ]);
    expect(contract.boundaryExamples).toEqual([
      {
        anchorUse: "exact_override",
        id: "same_open_web_exact_row_rank_zero",
        reason: "same UBIQ open-web steel topology, metric, and lab basis remains an exact source override",
        requiredOwnerFields: ["route", "metricBasis", "supportForm", "carrierDepthMm", "finishPackage"],
        sourceId: "ubiq_fl28_open_web_steel_300_exact_lab_2026"
      },
      {
        anchorUse: "current_runtime_seed",
        id: "fl28_250mm_interpolation_seed",
        reason: "existing FL-28 runtime interpolates between measured 200/300/400 mm same-family lab rows",
        requiredOwnerFields: ["carrierDepthMm", "deckOrFloatingPanelThicknessMm", "ceilingBoardSchedule"],
        sourceId: "ubiq_fl28_open_web_steel_300_exact_lab_2026"
      },
      {
        anchorUse: "anchor_only",
        id: "supported_band_carpet_bound_lnw_plus_ci",
        reason: "carpet rows can anchor Ln,w+CI bound handling but cannot fabricate exact Ln,w or CI",
        requiredOwnerFields: ["metricBasis", "finishPackage", "boundMetricSemantics"],
        sourceId: "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026"
      },
      {
        anchorUse: "rejected",
        id: "open_box_timber_as_open_web_steel",
        reason: "open-box timber is a different support family and can only enter its own later similarity lane",
        requiredOwnerFields: ["supportFamily", "supportForm"],
        sourceId: "tuas_r2b_open_box_timber_measured_2026"
      },
      {
        anchorUse: "rejected",
        id: "lab_lnw_to_iic_alias",
        reason: "ISO lab Ln,w rows do not own ASTM IIC/AIIC rating curves",
        requiredOwnerFields: ["metricBasis", "ratingProcedure"],
        sourceId: null
      }
    ]);
  });

  it("selects the supported-band open-web runtime lane while parking direct-fixed, open-box, field, and ASTM detours", () => {
    const contract = buildBroadAccuracyFloorSystemSimilarityAnchorContract();
    const byId = new Map(contract.runtimeCandidates.map((candidate) => [candidate.candidateId, candidate]));

    expect(contract.selectedCandidate).toMatchObject({
      basis: "element_lab",
      blockers: [],
      boundAnchorRows: 18,
      candidateId: "open_web_steel_supported_resilient_ceiling_similarity",
      currentRuntimeSeedBasis: "predictor_lightweight_steel_fl28_interpolation_estimate",
      exactAnchorRows: 36,
      metrics: ["Rw", "Ln,w", "Ln,w+CI"],
      nextAction: BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_ACTION,
      score: 2.74,
      selected: true,
      sourceRowsRequiredBeforeSelection: false
    });
    expect(byId.get("open_web_steel_direct_fixed_lining_similarity")).toMatchObject({
      blockers: [
        "direct_fixed_lining_transfer_owner_missing",
        "all_direct_fixed_rows_are_exact_only_until_a_lower_support_model_owner_exists"
      ],
      exactAnchorRows: 54,
      selected: false
    });
    expect(byId.get("open_box_timber_measured_similarity")).toMatchObject({
      blockers: [
        "open_box_timber_wet_dry_hybrid_interaction_owner_missing",
        "wrong_support_family_guard_must_keep_open_box_out_of_open_web_steel_similarity"
      ],
      exactAnchorRows: 15,
      selected: false
    });
    expect(byId.get("astm_iic_aiic_floor_adapter_detour")).toMatchObject({
      hardRejected: true,
      metrics: ["IIC", "AIIC"],
      selected: false
    });
  });

  it("pins the existing FL-28 source-anchored interpolation seed without moving runtime values", () => {
    const result = calculateAssembly(FL28_250MM_SIMILARITY_SEED_LAYERS, {
      targetOutputs: ["Rw", "Ln,w", "Ln,w+CI"]
    });

    expect(result.floorSystemMatch).toBeNull();
    expect(result.boundFloorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate).toMatchObject({
      fitPercent: 93,
      impact: {
        LnW: 51.5,
        LnWPlusCI: 50,
        basis: "predictor_lightweight_steel_fl28_interpolation_estimate",
        estimateCandidateIds: [
          "ubiq_fl28_open_web_steel_200_exact_lab_2026",
          "ubiq_fl28_open_web_steel_300_exact_lab_2026",
          "ubiq_fl28_open_web_steel_400_exact_lab_2026"
        ],
        scope: "family_estimate"
      },
      kind: "family_archetype",
      structuralFamily: "lightweight steel"
    });
    expect(result.floorSystemRatings).toMatchObject({
      Rw: 63.5,
      RwCtr: 58,
      basis: "predictor_lightweight_steel_fl28_interpolation_estimate"
    });
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.warnings).toContain(
      "Published family estimate active: lightweight steel FL-28 interpolation at 93% fit. DynEcho stayed inside the curated UBIQ open-web family instead of drifting into a broad steel blend."
    );
  });

  it("keeps docs and the current-gate runner aligned with the floor-system similarity anchor closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);

      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_FLOOR_SYSTEM_SIMILARITY_ANCHOR_SELECTED_NEXT_FILE);
      expect(content, path).toContain("open-web steel supported-band");
      expect(content, path).toContain("similarity runtime");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("broad-accuracy-floor-system-similarity-anchor-contract.test.ts");
  });
});

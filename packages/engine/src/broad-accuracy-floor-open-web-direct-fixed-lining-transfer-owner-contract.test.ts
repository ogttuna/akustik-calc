import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTION_STATUS,
  buildBroadAccuracyFloorOpenWebDirectFixedTransferOwnerContract
} from "./broad-accuracy-floor-open-web-direct-fixed-lining-transfer-owner";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-surface-parity";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "Ln,w+CI", "IIC"] as const satisfies readonly RequestedOutputId[];
const FIELD_ALIAS_OUTPUTS = ["L'n,w"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-transfer-owner.ts",
  "packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-transfer-owner-contract.test.ts",
  "packages/engine/src/broad-accuracy-floor-system-similarity-anchor.ts",
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-surface-parity.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
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

const DIRECT_FIXED_FL23_300MM_TIMBER_LAYERS = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const SOURCE_ABSENT_DIRECT_FIXED_250MM_TIMBER_LAYERS = DIRECT_FIXED_FL23_300MM_TIMBER_LAYERS.map((layer) =>
  layer.floorRole === "base_structure" ? { ...layer, thicknessMm: 250 } : layer
) satisfies readonly LayerInput[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("broad accuracy floor open-web direct-fixed lining transfer owner contract", () => {
  it("lands the no-runtime direct-fixed transfer-owner gate and selects the formula corridor next", () => {
    const contract = buildBroadAccuracyFloorOpenWebDirectFixedTransferOwnerContract();

    expect(contract).toMatchObject({
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTION_STATUS
    });
    expect(contract.previousSurfaceParity).toEqual({
      landedGate:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SURFACE_PARITY_SELECTION_STATUS
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("classifies the 54 direct-fixed open-web exact rows without inflating them into broad runtime readiness", () => {
    const contract = buildBroadAccuracyFloorOpenWebDirectFixedTransferOwnerContract();

    expect(contract.directFixedInventory).toEqual({
      carrierDepthsMm: [200, 300, 400],
      deckThicknessesMm: [16, 19],
      exactRows: 54,
      familyEstimateEligibleRows: 0,
      familyIds: ["fl23", "fl25", "fl27"],
      finishPackages: ["bare", "engineered_timber_with_acoustic_underlay", "carpet_with_foam_underlay"],
      lowerSupportClass: "direct_to_joists",
      supportForm: "open_web_or_rolled",
      supportMaterial: "open_web_steel_floor"
    });
    expect(contract.familyPackets).toEqual([
      {
        boardSchedule: "2x13",
        carrierDepthsMm: [200, 300, 400],
        ciRange: [-1, 0],
        deckThicknessesMm: [16, 19],
        exactRows: 18,
        familyEstimateEligibleRows: 0,
        familyId: "fl23",
        finishPackages: ["bare", "carpet_with_foam_underlay", "engineered_timber_with_acoustic_underlay"],
        lnWPlusCiRange: [63, 77],
        lnWRange: [64, 77],
        rwCtrRange: [42, 45],
        rwRange: [50, 52]
      },
      {
        boardSchedule: "2x16",
        carrierDepthsMm: [200, 300, 400],
        ciRange: [-1, 0],
        deckThicknessesMm: [16, 19],
        exactRows: 18,
        familyEstimateEligibleRows: 0,
        familyId: "fl25",
        finishPackages: ["bare", "carpet_with_foam_underlay", "engineered_timber_with_acoustic_underlay"],
        lnWPlusCiRange: [63, 77],
        lnWRange: [64, 77],
        rwCtrRange: [43, 46],
        rwRange: [51, 53]
      },
      {
        boardSchedule: "3x16",
        carrierDepthsMm: [200, 300, 400],
        ciRange: [-1, 1],
        deckThicknessesMm: [16, 19],
        exactRows: 18,
        familyEstimateEligibleRows: 0,
        familyId: "fl27",
        finishPackages: ["bare", "carpet_with_foam_underlay", "engineered_timber_with_acoustic_underlay"],
        lnWPlusCiRange: [62, 77],
        lnWRange: [63, 76],
        rwCtrRange: [45, 48],
        rwRange: [53, 55]
      }
    ]);
  });

  it("owns the physical transfer terms and negative boundaries required before source-absent runtime", () => {
    const contract = buildBroadAccuracyFloorOpenWebDirectFixedTransferOwnerContract();

    expect(contract.ownerTerms.map((term) => term.id)).toEqual([
      "carrier_geometry_owner",
      "deck_panel_mass_owner",
      "upper_finish_delta_owner",
      "direct_lining_attachment_owner",
      "impact_lnw_transfer_owner",
      "airborne_rw_mass_bridge_owner",
      "impact_ci_semantics_owner",
      "source_absent_budget_owner",
      "exact_precedence_owner",
      "negative_boundary_owner"
    ]);
    expect(contract.runtimePromotionRequirements).toEqual([
      "exact_source_precedence_stays_first",
      "supportForm_open_web_or_rolled_required",
      "lowerTreatment_type_direct_fixed_ceiling_required",
      "direct_to_joists_support_class_required",
      "carrier_depth_interpolation_limited_to_200_400_mm_until_extrapolation_owner_lands",
      "16mm_and_19mm_deck_terms_must_be_separate",
      "bare_timber_underlay_and_carpet_finish_deltas_must_be_explicit",
      "resilient_suspended_ceiling_rows_are_negative_boundaries_not_transfer_anchors",
      "open_box_timber_rows_are_negative_boundaries_not_transfer_anchors",
      "field_building_and_astm_outputs_stay_unsupported_until_separate_metric_owners_land"
    ]);
    expect(contract.blockedRuntimeBoundaries.map((boundary) => boundary.id)).toEqual([
      "resilient_suspended_ceiling_wrong_lower_support",
      "open_box_timber_wrong_support_family",
      "field_building_alias_boundary",
      "astm_iic_aiic_alias_boundary"
    ]);
  });

  it("keeps exact direct-fixed rows first while the later runtime corridor closes the source-absent transfer debt", () => {
    const exact = calculateAssembly(DIRECT_FIXED_FL23_300MM_TIMBER_LAYERS, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const sourceAbsent = calculateAssembly(SOURCE_ABSENT_DIRECT_FIXED_250MM_TIMBER_LAYERS, {
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });
    const sourceAbsentFieldAlias = calculateAssembly(SOURCE_ABSENT_DIRECT_FIXED_250MM_TIMBER_LAYERS, {
      calculator: "dynamic",
      targetOutputs: FIELD_ALIAS_OUTPUTS
    });

    expect(exact.floorSystemMatch?.system.id).toBe("ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026");
    expect(exact.impact).toMatchObject({
      CI: -1,
      LnW: 71,
      LnWPlusCI: 70,
      basis: "official_floor_system_exact_match",
      labOrField: "lab",
      scope: "exact_floor_system_family"
    });
    expect(exact.floorSystemRatings).toMatchObject({
      Rw: 51,
      RwCtr: 44,
      basis: "official_floor_system_exact_match"
    });
    expect(exact.floorSystemEstimate).toBeNull();
    expect(exact.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "CI", "Ln,w+CI"]);
    expect(exact.unsupportedTargetOutputs).toEqual(["IIC"]);

    expect(sourceAbsent.floorSystemMatch).toBeNull();
    expect(sourceAbsent.floorSystemEstimate).toMatchObject({
      kind: "family_archetype",
      structuralFamily: "lightweight steel"
    });
    expect(sourceAbsent.impact).toMatchObject({
      CI: -0.5,
      LnW: 71,
      LnWPlusCI: 70.5,
      basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
      labOrField: "lab",
      scope: "family_estimate"
    });
    expect(sourceAbsent.floorSystemRatings).toMatchObject({
      Rw: 51,
      RwCtr: 43.5,
      basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS
    });
    expect(sourceAbsent.impact?.estimateCandidateIds).toEqual([
      "ubiq_fl23_open_web_steel_200_19mm_timber_underlay_exact_lab_2026",
      "ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026"
    ]);
    expect(sourceAbsent.impact?.errorBudgets?.find((budget) => budget.metricId === "Ln,w")).toMatchObject({
      notMeasuredEvidence: true,
      origin: "source_absent_formula_error_budget",
      toleranceDb: 4
    });
    expect(sourceAbsentFieldAlias.impact?.basis).not.toBe(OPEN_WEB_DIRECT_FIXED_LINING_BASIS);
    expect(sourceAbsentFieldAlias.supportedTargetOutputs).toEqual([]);
    expect(sourceAbsentFieldAlias.unsupportedTargetOutputs).toEqual(["L'n,w"]);
    expect(sourceAbsentFieldAlias.warnings).toEqual(
      expect.arrayContaining([
        expect.stringContaining("provide impactFieldContext"),
        expect.stringContaining("L'n,w")
      ])
    );
  });

  it("keeps docs, exports, and current-gate runners aligned with the direct-fixed transfer-owner contract", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const text = readRepoFile(path);
      const normalizedText = text.toLowerCase();

      expect(text, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_LANDED_GATE);
      expect(text, path).toContain(BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTION_STATUS);
      expect(text, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_ACTION
      );
      expect(text, path).toContain(
        BROAD_ACCURACY_FLOOR_OPEN_WEB_DIRECT_FIXED_LINING_TRANSFER_OWNER_SELECTED_NEXT_FILE
      );
      expect(text, path).toContain("54");
      expect(text, path).toContain("FL-23");
      expect(text, path).toContain("FL-25");
      expect(text, path).toContain("FL-27");
      expect(normalizedText, path).toContain("direct-fixed");
      expect(normalizedText, path).toContain("open-web");
      expect(normalizedText, path).toContain("formula corridor");
      expect(normalizedText, path).toContain("field/building");
      expect(normalizedText, path).toContain("astm");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-floor-open-web-direct-fixed-lining-transfer-owner");
    expect(runner).toContain("broad-accuracy-floor-open-web-direct-fixed-lining-transfer-owner-contract.test.ts");
  });
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS } from "./helper-only-timber-open-web-impact-stack-estimate";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LANDED_GATE = "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_owner_plan";
const SELECTION_STATUS =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_owner_landed_no_runtime_selected_formula_corridor";
const SELECTED_NEXT_ACTION = "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_formula_corridor_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor-contract.test.ts";
const SELECTED_NEXT_LABEL = "floor helper-only timber/open-web impact stack formula corridor";

const PREVIOUS_GATE = "broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_plan";
const PREVIOUS_SELECTION_STATUS =
  "broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_landed_no_runtime_selected_helper_only_timber_open_web_impact_stack_owner";
const PREVIOUS_CONTRACT =
  "packages/engine/src/broad-accuracy-post-open-web-field-building-input-surface-matrix-refresh-contract.test.ts";
const CURRENT_CONTRACT =
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-owner-contract.test.ts";

const FIELD_OUTPUTS = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC"
] as const satisfies readonly RequestedOutputId[];

const LAB_IMPACT_OUTPUTS = [
  "Rw",
  "C",
  "Ctr",
  "R'w",
  "DnT,w",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

const BUILDING_OUTPUTS = ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

const BUILDING_PREDICTION_CONTEXT = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  sourceRoomVolumeM3: 55,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  flankingJunctionClass: "rigid_cross_junction",
  conservativeFlankingAssumption: "multi_path_conservative",
  junctionCouplingLengthM: 4,
  buildingPredictionOutputBasis: "apparent_and_standardized"
} as const satisfies AirborneContext;

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const EXACT_FL23_OPEN_WEB = [
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 }
] as const satisfies readonly LayerInput[];

const RAW_OPEN_WEB_300 = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_PACKAGE = [
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const SUPPORTED_BAND_PACKAGE = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_TIMBER = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_OPEN_WEB = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_TIMBER_UNTAGGED = [
  { materialId: "gypsum_board", thicknessMm: 13 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 13 },
  { materialId: "timber_joist_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_OPEN_WEB_UNTAGGED = [
  { materialId: "gypsum_board", thicknessMm: 13 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 13 },
  { materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const satisfies readonly LayerInput[];

const HELPER_ONLY_OPEN_WEB_MISSING_BOARD = [
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 250 }
] as const satisfies readonly LayerInput[];

type OwnerRequirement = {
  readonly fields: readonly string[];
  readonly id: string;
  readonly ownerBlocksRuntime: boolean;
};

const OWNER_REQUIREMENTS = [
  {
    fields: [
      "supportFamily=open_box_timber_or_lightweight_steel_open_web",
      "supportForm",
      "baseStructureMaterialId",
      "carrierDepthMm",
      "carrierSpacingMm",
      "surfaceMassKgM2",
      "supportLossFactor"
    ],
    id: "support_family_owner",
    ownerBlocksRuntime: true
  },
  {
    fields: [
      "ceilingBoard.materialId",
      "ceilingBoard.layerCount",
      "ceilingBoard.thicknessMm",
      "ceilingBoardSurfaceMassKgM2",
      "boardAttachmentClass"
    ],
    id: "lower_ceiling_board_mass_owner",
    ownerBlocksRuntime: true
  },
  {
    fields: [
      "ceilingFill.materialId",
      "ceilingFill.thicknessMm",
      "ceilingFillDensityKgM3",
      "ceilingCavityDepthMm",
      "absorberFlowResistivity"
    ],
    id: "absorber_and_cavity_owner",
    ownerBlocksRuntime: true
  },
  {
    fields: [
      "resilientChannelOrHangerType",
      "connectionSpacingMm",
      "resilientDynamicStiffnessMNPerM3",
      "shortCircuitRiskClass"
    ],
    id: "suspension_support_class_owner",
    ownerBlocksRuntime: true
  },
  {
    fields: [
      "floorCoveringAbsence",
      "resilientLayerAbsence",
      "upperFillAbsence",
      "floatingScreedAbsence",
      "inexDeckAbsenceOrExplicitDeckClass"
    ],
    id: "package_absence_owner",
    ownerBlocksRuntime: true
  },
  {
    fields: ["barePlusLowerTreatmentImpactCurve", "lowerTreatmentDeltaLnCurve", "iso717ImpactAdapter", "CIAndCI50Owner"],
    id: "impact_curve_owner",
    ownerBlocksRuntime: true
  },
  {
    fields: ["timberJoistVsOpenWebSteelBranch", "candidateBorrowingBoundary", "wrongSupportFamilyBoundary"],
    id: "family_split_owner",
    ownerBlocksRuntime: true
  },
  {
    fields: ["elementLabOnly", "noFieldKTransfer", "noBuildingFlankingTransfer", "noASTMIICAlias"],
    id: "field_building_astm_boundary_owner",
    ownerBlocksRuntime: true
  },
  {
    fields: ["LnWToleranceBudgetOwner", "CI50BudgetOwner", "inputPrecisionBudgetOwner", "topologySimplificationBudgetOwner"],
    id: "error_budget_owner",
    ownerBlocksRuntime: true
  },
  {
    fields: ["duplicateCarrierGuard", "safeReorderGuard", "missingBoardGuard", "ambiguousRoleGuard"],
    id: "hostile_topology_owner",
    ownerBlocksRuntime: true
  }
] as const satisfies readonly OwnerRequirement[];

const NEGATIVE_BOUNDARIES = [
  "owner_gate_does_not_promote_runtime_values",
  "timber_helper_only_impact_remains_unsupported_until_formula_corridor",
  "open_web_lower_treatment_only_weak_estimate_not_named_owner_yet",
  "raw_bare_impact_field_transfer_remains_blocked",
  "building_prediction_remains_unsupported",
  "astm_iic_aliases_remain_unsupported",
  "exact_direct_fixed_supported_band_open_web_field_values_remain_pinned",
  "package_transfer_raw_bare_eps_screed_lanes_stay_separate",
  "broad_source_crawl_remains_blocked"
] as const;

const OWNER_CONTRACT = {
  broadSourceCrawl: false,
  buildingPredictionRuntimePromotion: false,
  exactRowsStayFirst: true,
  fieldRuntimePromotion: false,
  landedGate: LANDED_GATE,
  noRuntimeValueMovement: true,
  previousContract: PREVIOUS_CONTRACT,
  previousGate: PREVIOUS_GATE,
  previousSelectionStatus: PREVIOUS_SELECTION_STATUS,
  runtimePromotionAllowedInGate: false,
  selectedNextAction: SELECTED_NEXT_ACTION,
  selectedNextFile: SELECTED_NEXT_FILE,
  selectedNextLabel: SELECTED_NEXT_LABEL,
  selectionStatus: SELECTION_STATUS,
  toleranceMovement: false
} as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateFieldCase(layers: readonly LayerInput[]) {
  return calculateAssembly(layers, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    calculator: "dynamic",
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: FIELD_OUTPUTS
  });
}

describe("broad accuracy floor helper-only timber/open-web impact stack owner", () => {
  it("lands a no-runtime owner boundary and selects the formula corridor next", () => {
    expect(OWNER_CONTRACT).toEqual({
      broadSourceCrawl: false,
      buildingPredictionRuntimePromotion: false,
      exactRowsStayFirst: true,
      fieldRuntimePromotion: false,
      landedGate: "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_owner_plan",
      noRuntimeValueMovement: true,
      previousContract:
        "packages/engine/src/broad-accuracy-post-open-web-field-building-input-surface-matrix-refresh-contract.test.ts",
      previousGate: "broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_plan",
      previousSelectionStatus:
        "broad_accuracy_post_open_web_field_building_input_surface_matrix_refresh_landed_no_runtime_selected_helper_only_timber_open_web_impact_stack_owner",
      runtimePromotionAllowedInGate: false,
      selectedNextAction: "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_formula_corridor_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor-contract.test.ts",
      selectedNextLabel: "floor helper-only timber/open-web impact stack formula corridor",
      selectionStatus:
        "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_owner_landed_no_runtime_selected_formula_corridor",
      toleranceMovement: false
    });

    expect(existsSync(join(REPO_ROOT, PREVIOUS_CONTRACT))).toBe(true);
    expect(existsSync(join(REPO_ROOT, CURRENT_CONTRACT))).toBe(true);
    expect(NEGATIVE_BOUNDARIES).toContain("broad_source_crawl_remains_blocked");
    expect(NEGATIVE_BOUNDARIES).toContain("exact_direct_fixed_supported_band_open_web_field_values_remain_pinned");
  });

  it("names every physical owner required before helper-only timber/open-web formula runtime can promote", () => {
    expect(OWNER_REQUIREMENTS).toHaveLength(10);
    expect(OWNER_REQUIREMENTS.every((owner) => owner.ownerBlocksRuntime)).toBe(true);
    expect(OWNER_REQUIREMENTS.map((owner) => owner.id)).toEqual([
      "support_family_owner",
      "lower_ceiling_board_mass_owner",
      "absorber_and_cavity_owner",
      "suspension_support_class_owner",
      "package_absence_owner",
      "impact_curve_owner",
      "family_split_owner",
      "field_building_astm_boundary_owner",
      "error_budget_owner",
      "hostile_topology_owner"
    ]);
    expect(OWNER_REQUIREMENTS.flatMap((owner) => owner.fields)).toEqual(
      expect.arrayContaining([
        "supportFamily=open_box_timber_or_lightweight_steel_open_web",
        "carrierDepthMm",
        "carrierSpacingMm",
        "ceilingBoardSurfaceMassKgM2",
        "ceilingFillDensityKgM3",
        "ceilingCavityDepthMm",
        "resilientDynamicStiffnessMNPerM3",
        "shortCircuitRiskClass",
        "floorCoveringAbsence",
        "floatingScreedAbsence",
        "lowerTreatmentDeltaLnCurve",
        "CIAndCI50Owner",
        "timberJoistVsOpenWebSteelBranch",
        "noFieldKTransfer",
        "noBuildingFlankingTransfer",
        "noASTMIICAlias",
        "LnWToleranceBudgetOwner",
        "duplicateCarrierGuard",
        "missingBoardGuard"
      ])
    );
  });

  it("keeps the owner-gate record while the later runtime corridor owns current helper-only values", () => {
    const timber = calculateAssembly(HELPER_ONLY_TIMBER, { targetOutputs: LAB_IMPACT_OUTPUTS });
    const openWeb = calculateAssembly(HELPER_ONLY_OPEN_WEB, { targetOutputs: LAB_IMPACT_OUTPUTS });
    const timberUntagged = calculateAssembly(HELPER_ONLY_TIMBER_UNTAGGED, { targetOutputs: LAB_IMPACT_OUTPUTS });
    const openWebUntagged = calculateAssembly(HELPER_ONLY_OPEN_WEB_UNTAGGED, { targetOutputs: LAB_IMPACT_OUTPUTS });
    const openWebMissingBoard = calculateAssembly(HELPER_ONLY_OPEN_WEB_MISSING_BOARD, { targetOutputs: LAB_IMPACT_OUTPUTS });

    expect(timber.floorSystemRatings).toMatchObject({
      C: -1.1,
      Ctr: -5.9,
      Rw: 54.8,
      basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
    });
    expect(timber.impact).toMatchObject({
      CI: 1,
      CI50_2500: 2.3,
      LnW: 59.6,
      LnWPlusCI: 60.6,
      basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
    });
    expect(timber.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(timber.unsupportedTargetOutputs).toEqual([
      "R'w",
      "DnT,w",
      "L'n,w",
      "L'nT,w",
      "IIC",
      "AIIC"
    ]);

    expect(openWeb.floorSystemRatings).toMatchObject({
      C: -1.7,
      Ctr: -7.9,
      Rw: 46.7,
      basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
    });
    expect(openWeb.impact).toMatchObject({
      CI: 1,
      CI50_2500: 4,
      LnW: 59.6,
      LnWPlusCI: 60.6,
      basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
    });
    expect(openWeb.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);
    expect(openWeb.unsupportedTargetOutputs).toEqual([
      "R'w",
      "DnT,w",
      "L'n,w",
      "L'nT,w",
      "IIC",
      "AIIC"
    ]);

    expect(timberUntagged.floorSystemRatings).toMatchObject({ Rw: 44, basis: "screening_mass_law_curve_seed_v3" });
    expect(timberUntagged.impact).toBeNull();
    expect(timberUntagged.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr"]);
    expect(openWebUntagged.floorSystemRatings).toMatchObject({ Rw: 73, basis: "screening_mass_law_curve_seed_v3" });
    expect(openWebUntagged.impact).toBeNull();
    expect(openWebUntagged.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr"]);

    expect(openWebMissingBoard.floorSystemRatings).toMatchObject({
      Rw: 60.7,
      basis: "predictor_floor_system_family_general_estimate"
    });
    expect(openWebMissingBoard.impact).toMatchObject({
      CI: -1.7,
      LnW: 53.3,
      LnWPlusCI: 51.7,
      basis: "predictor_floor_system_family_general_estimate"
    });
    expect(openWebMissingBoard.supportedTargetOutputs).toEqual(["Rw", "C", "Ctr", "Ln,w", "CI", "Ln,w+CI"]);
    expect(openWebMissingBoard.unsupportedTargetOutputs).toEqual([
      "R'w",
      "DnT,w",
      "CI,50-2500",
      "L'n,w",
      "L'nT,w",
      "IIC",
      "AIIC"
    ]);
  });

  it("keeps exact/direct-fixed/supported-band field pins and raw-bare/building/ASTM boundaries separate", () => {
    const exact = calculateFieldCase(EXACT_FL23_OPEN_WEB);
    const directFixed = calculateFieldCase(DIRECT_FIXED_PACKAGE);
    const supportedBand = calculateFieldCase(SUPPORTED_BAND_PACKAGE);
    const rawBareField = calculateFieldCase(RAW_OPEN_WEB_300);
    const building = calculateAssembly(RAW_OPEN_WEB_300, {
      airborneContext: BUILDING_PREDICTION_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: BUILDING_OUTPUTS
    });
    const astm = calculateAssembly(DIRECT_FIXED_PACKAGE, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      calculator: "dynamic",
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: ASTM_OUTPUTS
    });

    expect(exact.floorSystemRatings).toMatchObject({ Rw: 51, basis: "official_floor_system_exact_match" });
    expect(exact.metrics).toMatchObject({ estimatedDnTwDb: 80, estimatedRwPrimeDb: 77 });
    expect(exact.impact).toMatchObject({ LPrimeNT50: 70, LPrimeNTw: 70.6, LPrimeNW: 73, LnW: 71 });

    expect(directFixed.floorSystemRatings).toMatchObject({ Rw: 52, basis: OPEN_WEB_DIRECT_FIXED_LINING_BASIS });
    expect(directFixed.metrics).toMatchObject({ estimatedDnTwDb: 78, estimatedRwPrimeDb: 75 });
    expect(directFixed.impact).toMatchObject({ LPrimeNT50: 76.5, LPrimeNTw: 76.6, LPrimeNW: 79, LnW: 77 });

    expect(supportedBand.floorSystemRatings).toMatchObject({ Rw: 61.5, basis: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS });
    expect(supportedBand.metrics).toMatchObject({ estimatedDnTwDb: 48, estimatedRwPrimeDb: 45 });
    expect(supportedBand.impact).toMatchObject({ LPrimeNT50: 60, LPrimeNTw: 61.1, LPrimeNW: 63.5, LnW: 61.5 });

    expect(rawBareField.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w"]);
    expect(rawBareField.unsupportedTargetOutputs).toEqual(["L'n,w", "L'nT,w", "L'nT,50", "IIC"]);
    expect(rawBareField.floorSystemRatings).toMatchObject({ Rw: 32, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });
    expect(rawBareField.impact).toMatchObject({ LnW: 96, basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS });
    expect(rawBareField.impact?.LPrimeNW).toBeUndefined();

    expect(building.supportedTargetOutputs).toEqual([]);
    expect(building.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]);
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("keeps docs and the current-gate runner aligned to the helper-only owner closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();
      const normalizedWhitespaceContent = normalizedContent.replace(/\s+/g, " ");

      expect(content, path).toContain(LANDED_GATE);
      expect(content, path).toContain(SELECTION_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(normalizedWhitespaceContent, path).toContain("helper-only timber/open-web");
      expect(normalizedWhitespaceContent, path).toContain("exact, direct-fixed, and supported-band");
      expect(normalizedWhitespaceContent, path).toContain("raw-bare impact field transfer remains blocked");
      expect(normalizedWhitespaceContent, path).toContain("building prediction");
      expect(normalizedWhitespaceContent, path).toContain("astm/iic");
      expect(normalizedWhitespaceContent, path).toContain("not a broad source crawl");
      expect(normalizedWhitespaceContent, path).toContain("lower-treatment");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("src/broad-accuracy-post-open-web-field-building-input-surface-matrix-refresh-contract.test.ts");
    expect(runner).toContain("src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-owner-contract.test.ts");
  });
});
